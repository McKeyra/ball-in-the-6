import { useState } from 'react';
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
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pb-24">
        <header className="mb-6 md:mb-8 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">Fan <span className="text-[#c9a962]">Zone</span></h1>
            <p className="text-white/40 mt-1 text-sm md:text-base">Connect with the community and vote for your stars.</p>
        </header>

        {/* Navigation */}
        <div className="flex justify-center md:justify-start gap-1 sm:gap-2 mb-6 md:mb-8 bg-[#121212] p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
            <button
                onClick={() => setActiveTab('feed')}
                className={`px-4 sm:px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 min-h-[44px] text-sm sm:text-base flex-1 sm:flex-initial justify-center ${activeTab === 'feed' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/30 hover:text-white/50 active:bg-white/[0.05]'}`}
            >
                <Users size={18} /> <span className="hidden xs:inline">Community</span> Feed
            </button>
            <button
                onClick={() => setActiveTab('voting')}
                className={`px-4 sm:px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 min-h-[44px] text-sm sm:text-base flex-1 sm:flex-initial justify-center ${activeTab === 'voting' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/30 hover:text-white/50 active:bg-white/[0.05]'}`}
            >
                <Trophy size={18} /> <span className="hidden xs:inline">Voting</span> Booth
            </button>
        </div>

        {/* Community Feed */}
        {activeTab === 'feed' && (
            <div className="space-y-4 md:space-y-6 animate-in fade-in">
                {/* Create Post */}
                <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-2xl">
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What's on your mind, fan?"
                        className="w-full bg-white/[0.04] rounded-xl p-3 sm:p-4 text-white text-sm md:text-base resize-none focus:outline-none focus:ring-1 focus:ring-[#c9a962]"
                        rows={3}
                    />
                    <div className="flex justify-end mt-3">
                        <Button
                            onClick={() => createPostMutation.mutate(postContent)}
                            disabled={!postContent.trim()}
                            className="bg-[#c9a962] hover:bg-[#d4b978] text-[#0f0f0f] rounded-full px-6 min-h-[44px]"
                        >
                            Post
                        </Button>
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-3 md:space-y-4">
                    {posts?.map(post => (
                        <div key={post.id} className="bg-white/[0.03] border border-white/[0.06] p-4 sm:p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a962] to-[#d4b978] flex items-center justify-center text-[#0f0f0f] font-bold flex-shrink-0">
                                    {post.user_name?.[0] || 'F'}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-white text-sm md:text-base truncate">{post.user_name}</div>
                                    <div className="text-xs text-white/30">{new Date(post.created_date).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <p className="text-white/70 mb-4 leading-relaxed text-sm md:text-base">{post.content}</p>
                            <div className="flex items-center gap-4 sm:gap-6 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => likePostMutation.mutate({ id: post.id, currentLikes: post.likes || 0 })}
                                    className="flex items-center gap-2 text-white/40 hover:text-red-500 transition-colors min-h-[44px] min-w-[44px]"
                                >
                                    <Heart size={18} className={post.likes > 0 ? "fill-red-500 text-red-500" : ""} />
                                    <span className="text-sm">{post.likes || 0}</span>
                                </button>
                                <button className="flex items-center gap-2 text-white/40 hover:text-blue-400 transition-colors min-h-[44px] min-w-[44px]">
                                    <MessageSquare size={18} />
                                    <span className="text-sm">{post.comments?.length || 0}</span>
                                </button>
                                <button className="ml-auto text-white/30 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center">
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
            <div className="space-y-4 md:space-y-6 animate-in fade-in">
                <div className="bg-gradient-to-r from-[#c9a962]/10 to-transparent p-6 md:p-8 rounded-2xl border border-white/[0.06] text-center mb-6 md:mb-8">
                    <Flame size={40} className="mx-auto text-[#c9a962] mb-3 md:mb-4 animate-pulse md:w-12 md:h-12" />
                    <h2 className="text-xl md:text-2xl font-black text-white mb-2">Player of the Game</h2>
                    <p className="text-white/50 text-sm md:text-base">Cast your vote for the MVP of recent matches!</p>
                </div>

                <div className="grid gap-3 md:gap-4">
                    {liveGames?.map(game => (
                        <div key={game.id} className="bg-white/[0.03] border border-white/[0.06] p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-white text-base md:text-lg">{game.home_team} vs {game.away_team}</h3>
                                <div className="text-xs md:text-sm text-white/30">{new Date(game.date).toLocaleDateString()}</div>
                            </div>
                            <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
                                <Button
                                    onClick={() => castVoteMutation.mutate({ game_id: game.id, user_id: currentUser?.email, player_id: 'home_mvp_placeholder', vote_type: 'potg' })}
                                    variant="outline"
                                    className="border-[#c9a962]/30 text-[#c9a962] hover:bg-[#c9a962]/10 min-h-[44px] flex-1 md:flex-initial text-sm"
                                >
                                    <ThumbsUp size={16} className="mr-2" /> Vote Home
                                </Button>
                                <Button
                                    onClick={() => castVoteMutation.mutate({ game_id: game.id, user_id: currentUser?.email, player_id: 'away_mvp_placeholder', vote_type: 'potg' })}
                                    variant="outline"
                                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 min-h-[44px] flex-1 md:flex-initial text-sm"
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