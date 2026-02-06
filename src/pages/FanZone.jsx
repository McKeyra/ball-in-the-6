import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart, Share2, Trophy, Flame, Users, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

export default function FanZone() {
  const [activeTab, setActiveTab] = useState('feed');
  const [postContent, setPostContent] = useState("");
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
      queryKey: ['currentUser'],
      queryFn: () => base44.auth.me()
  });

  // --- Feed Logic ---
  const { data: posts } = useQuery({
      queryKey: ['socialPosts'],
      queryFn: () => base44.entities.SocialPost.list({ sort: { created_date: -1 }, limit: 20 })
  });

  const createPostMutation = useMutation({
      mutationFn: (content) => base44.entities.SocialPost.create({
          user_id: currentUser?.email,
          user_name: currentUser?.full_name || 'Anonymous Fan',
          content,
          type: 'feed',
          likes: 0,
          comments: []
      }),
      onSuccess: () => {
          queryClient.invalidateQueries(['socialPosts']);
          setPostContent("");
          toast.success("Posted!");
      }
  });

  const likePostMutation = useMutation({
      mutationFn: ({ id, currentLikes }) => base44.entities.SocialPost.update(id, { likes: currentLikes + 1 }),
      onSuccess: () => queryClient.invalidateQueries(['socialPosts'])
  });

  // --- Voting Logic ---
  const { data: liveGames } = useQuery({
      queryKey: ['votingGames'],
      queryFn: () => base44.entities.Game.list({ sort: { date: -1 }, limit: 5 })
  });

  const castVoteMutation = useMutation({
      mutationFn: (voteData) => base44.entities.GameVote.create({
          ...voteData,
          timestamp: new Date().toISOString()
      }),
      onSuccess: () => toast.success("Vote cast! You rock!")
  });

  return (
    <div className="max-w-4xl mx-auto pb-20">
        <header className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-black text-white tracking-tight">Fan <span className="text-purple-500">Zone</span></h1>
            <p className="text-white/40 mt-1">Connect with the community and vote for your stars.</p>
        </header>

        {/* Navigation */}
        <div className="flex justify-center md:justify-start gap-2 mb-8 bg-[#121212] p-1 rounded-xl w-fit neu-flat">
            <button 
                onClick={() => setActiveTab('feed')}
                className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'feed' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/30 hover:text-white/50'}`}
            >
                <Users size={18} /> Community Feed
            </button>
            <button 
                onClick={() => setActiveTab('voting')}
                className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'voting' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/30 hover:text-white/50'}`}
            >
                <Trophy size={18} /> Voting Booth
            </button>
        </div>

        {/* Community Feed */}
        {activeTab === 'feed' && (
            <div className="space-y-6 animate-in fade-in">
                {/* Create Post */}
                <div className="neu-flat p-4 rounded-2xl">
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What's on your mind, fan?"
                        className="w-full bg-white/[0.04] rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                        rows={3}
                    />
                    <div className="flex justify-end mt-3">
                        <Button 
                            onClick={() => createPostMutation.mutate(postContent)}
                            disabled={!postContent.trim()}
                            className="bg-purple-600 hover:bg-purple-500 rounded-full px-6"
                        >
                            Post
                        </Button>
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                    {posts?.map(post => (
                        <div key={post.id} className="neu-flat p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                    {post.user_name?.[0] || 'F'}
                                </div>
                                <div>
                                    <div className="font-bold text-white">{post.user_name}</div>
                                    <div className="text-xs text-white/30">{new Date(post.created_date).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <p className="text-white/70 mb-4 leading-relaxed">{post.content}</p>
                            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                <button 
                                    onClick={() => likePostMutation.mutate({ id: post.id, currentLikes: post.likes || 0 })}
                                    className="flex items-center gap-2 text-white/40 hover:text-red-500 transition-colors"
                                >
                                    <Heart size={18} className={post.likes > 0 ? "fill-red-500 text-red-500" : ""} />
                                    <span>{post.likes || 0}</span>
                                </button>
                                <button className="flex items-center gap-2 text-white/40 hover:text-blue-400 transition-colors">
                                    <MessageSquare size={18} />
                                    <span>{post.comments?.length || 0}</span>
                                </button>
                                <button className="ml-auto text-white/30 hover:text-white">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Voting Booth */}
        {activeTab === 'voting' && (
            <div className="space-y-6 animate-in fade-in">
                <div className="bg-gradient-to-r from-[#c9a962]/10 to-transparent p-8 rounded-2xl border border-white/[0.06] text-center mb-8">
                    <Flame size={48} className="mx-auto text-orange-500 mb-4 animate-pulse" />
                    <h2 className="text-2xl font-black text-white mb-2">Player of the Game</h2>
                    <p className="text-white/50">Cast your vote for the MVP of recent matches!</p>
                </div>

                <div className="grid gap-4">
                    {liveGames?.map(game => (
                        <div key={game.id} className="neu-flat p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-white text-lg">{game.home_team} vs {game.away_team}</h3>
                                <div className="text-sm text-white/30">{new Date(game.date).toLocaleDateString()}</div>
                            </div>
                            <div className="flex gap-3">
                                <Button 
                                    onClick={() => castVoteMutation.mutate({ game_id: game.id, user_id: currentUser?.email, player_id: 'home_mvp_placeholder', vote_type: 'potg' })}
                                    variant="outline"
                                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                >
                                    <ThumbsUp size={16} className="mr-2" /> Vote Home
                                </Button>
                                <Button 
                                    onClick={() => castVoteMutation.mutate({ game_id: game.id, user_id: currentUser?.email, player_id: 'away_mvp_placeholder', vote_type: 'potg' })}
                                    variant="outline"
                                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                >
                                    <ThumbsUp size={16} className="mr-2" /> Vote Away
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}