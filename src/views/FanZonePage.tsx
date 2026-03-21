'use client';

import { useState } from 'react';
import { MessageSquare, Heart, Share2, Trophy, Flame, Users, ThumbsUp } from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface User {
  email: string;
  full_name?: string;
}

interface SocialPost {
  id: string;
  user_name: string;
  content: string;
  likes: number;
  comments?: string[];
  created_date: string;
}

interface Game {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
}

export function FanZonePage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('feed');
  const [postContent, setPostContent] = useState('');

  // TODO: Replace with API calls
  // const { data: currentUser } = useQuery({ queryKey: ['currentUser'], queryFn: () => fetch('/api/auth/me').then(r => r.json()) });
  // const { data: posts } = useQuery({ queryKey: ['socialPosts'], queryFn: ... });
  // const { data: liveGames } = useQuery({ queryKey: ['votingGames'], queryFn: ... });
  const currentUser= null as User | null;
  const posts: SocialPost[] = [];
  const liveGames: Game[] = [];

  const handleCreatePost = (): void => {
    if (!postContent.trim()) return;
    // TODO: POST /api/social-posts
    setPostContent('');
  };

  const handleLike = (postId: string, currentLikes: number): void => {
    // TODO: PATCH /api/social-posts/${postId} with likes: currentLikes + 1
  };

  const handleVote = (gameId: string, voteType: string): void => {
    // TODO: POST /api/game-votes
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Fan <span className="text-[#c9a962]">Zone</span>
          </h1>
          <p className="text-white/40 mt-1 text-sm md:text-base">Connect with the community and vote for your stars.</p>
        </header>

        {/* Navigation */}
        <div className="flex justify-center md:justify-start gap-1 sm:gap-2 mb-6 md:mb-8 bg-[#121212] p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 sm:px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 min-h-[44px] text-sm sm:text-base flex-1 sm:flex-initial justify-center ${
              activeTab === 'feed' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/30 hover:text-white/50'
            }`}
          >
            <Users size={18} /> <span className="hidden xs:inline">Community</span> Feed
          </button>
          <button
            onClick={() => setActiveTab('voting')}
            className={`px-4 sm:px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 min-h-[44px] text-sm sm:text-base flex-1 sm:flex-initial justify-center ${
              activeTab === 'voting' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/30 hover:text-white/50'
            }`}
          >
            <Trophy size={18} /> <span className="hidden xs:inline">Voting</span> Booth
          </button>
        </div>

        {/* Community Feed */}
        {activeTab === 'feed' && (
          <div className="space-y-4 md:space-y-6">
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
                <button
                  onClick={handleCreatePost}
                  disabled={!postContent.trim()}
                  className="bg-[#c9a962] hover:bg-[#d4b978] text-[#0f0f0f] rounded-full px-6 min-h-[44px] font-medium disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-3 md:space-y-4">
              {posts.map((post) => (
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
                      onClick={() => handleLike(post.id, post.likes || 0)}
                      className="flex items-center gap-2 text-white/40 hover:text-red-500 transition-colors min-h-[44px] min-w-[44px]"
                    >
                      <Heart size={18} className={post.likes > 0 ? 'fill-red-500 text-red-500' : ''} />
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
          <div className="space-y-4 md:space-y-6">
            <div className="bg-gradient-to-r from-[#c9a962]/10 to-transparent p-6 md:p-8 rounded-2xl border border-white/[0.06] text-center mb-6 md:mb-8">
              <Flame size={40} className="mx-auto text-[#c9a962] mb-3 md:mb-4 animate-pulse md:w-12 md:h-12" />
              <h2 className="text-xl md:text-2xl font-black text-white mb-2">Player of the Game</h2>
              <p className="text-white/50 text-sm md:text-base">Cast your vote for the MVP of recent matches!</p>
            </div>

            <div className="grid gap-3 md:gap-4">
              {liveGames.map((game) => (
                <div key={game.id} className="bg-white/[0.03] border border-white/[0.06] p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white text-base md:text-lg">{game.home_team} vs {game.away_team}</h3>
                    <div className="text-xs md:text-sm text-white/30">{new Date(game.date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleVote(game.id, 'home')}
                      className="border border-[#c9a962]/30 text-[#c9a962] hover:bg-[#c9a962]/10 min-h-[44px] flex-1 md:flex-initial text-sm px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <ThumbsUp size={16} /> Vote Home
                    </button>
                    <button
                      onClick={() => handleVote(game.id, 'away')}
                      className="border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 min-h-[44px] flex-1 md:flex-initial text-sm px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <ThumbsUp size={16} /> Vote Away
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
