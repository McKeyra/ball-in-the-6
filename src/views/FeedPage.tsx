'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Heart, MessageCircle, Share2, MoreVertical, Send, Image, Video,
  Trophy, MapPin, Calendar, TrendingUp, Flame, Clock,
  ChevronRight, PlayCircle,
} from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface User {
  id: string;
  full_name?: string;
  email: string;
}

interface Post {
  id: string;
  content: string;
  author_name?: string;
  author_id?: string;
  image_url?: string;
  likes?: number;
  comments_count?: number;
  created_date?: string;
  type?: string;
}

interface Game {
  id: string;
  status?: string;
  home_team_name?: string;
  away_team_name?: string;
  home_score?: number;
  away_score?: number;
  game_date?: string;
  venue?: string;
}

interface Program {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  created_date?: string;
}

type FeedItem =
  | { type: 'post'; data: Post; timestamp: Date }
  | { type: 'game'; data: Game; timestamp: Date }
  | { type: 'upcoming_game'; data: Game; timestamp: Date }
  | { type: 'program'; data: Program; timestamp: Date };

export function FeedPage(): React.ReactElement {
  const [filter, setFilter] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const { data: user = null } = useQuery<User | null>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: feedData, isLoading: postsLoading } = useQuery<{ posts?: Post[]; games?: Game[]; programs?: Program[] }>({
    queryKey: ['feed'],
    queryFn: async () => {
      const res = await fetch('/api/feed');
      if (!res.ok) throw new Error('Failed to fetch feed');
      return res.json();
    },
  });

  const posts: Post[] = feedData?.posts || [];

  const { data: gamesData = [] } = useQuery<Game[]>({
    queryKey: ['feed-games'],
    queryFn: async () => {
      const res = await fetch('/api/games?sport=basketball');
      if (!res.ok) return [];
      return res.json();
    },
  });
  const games: Game[] = gamesData;

  const { data: programs = [] } = useQuery<Program[]>({
    queryKey: ['feed-programs'],
    queryFn: async () => {
      const res = await fetch('/api/programs');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const handleCreatePost = (): void => {
    if (!newPostContent.trim()) return;
    // TODO: POST /api/posts with content
    setNewPostContent('');
    setShowCreatePost(false);
  };

  const toggleLike = (postId: string): void => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  const liveGames = games.filter((g) => g.status === 'live' || g.status === 'in_progress');
  const recentGames = games.filter((g) => g.status === 'completed').slice(0, 5);
  const upcomingGames = games.filter((g) => g.status === 'scheduled').slice(0, 5);

  // Build feed items
  const getFeedItems = (): FeedItem[] => {
    const items: FeedItem[] = [];
    if (filter === 'all' || filter === 'posts') {
      posts.forEach((post) => items.push({ type: 'post', data: post, timestamp: new Date(post.created_date || Date.now()) }));
    }
    if (filter === 'all' || filter === 'games') {
      recentGames.forEach((game) => items.push({ type: 'game', data: game, timestamp: new Date(game.game_date || Date.now()) }));
      upcomingGames.forEach((game) => items.push({ type: 'upcoming_game', data: game, timestamp: new Date(game.game_date || Date.now()) }));
    }
    if (filter === 'all' || filter === 'training') {
      programs.slice(0, 3).forEach((program) => items.push({ type: 'program', data: program, timestamp: new Date(program.created_date || Date.now()) }));
    }
    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const feedItems = getFeedItems();

  const renderPostCard = (post: Post): React.ReactElement => {
    const isLiked = likedPosts.has(post.id);
    return (
      <div key={`post-${post.id}`} className="bg-white/[0.05] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#c9a962] to-yellow-500" />
        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a962] to-yellow-600 flex items-center justify-center font-bold text-white">
                {(post.author_name || 'A')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{post.author_name || 'Anonymous'}</p>
                <p className="text-xs text-white/40">
                  {post.created_date ? new Date(post.created_date).toLocaleDateString() : 'Just now'}
                </p>
              </div>
            </div>
            <button className="text-white/40 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/90 mb-4 leading-relaxed">{post.content}</p>
          {post.image_url && (
            <div className="rounded-xl overflow-hidden mb-4">
              <img src={post.image_url} alt="Post" className="w-full object-cover" />
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleLike(post.id)}
                className={`gap-2 min-h-[44px] flex items-center ${isLiked ? 'text-red-500' : 'text-white/50'} hover:text-red-500`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
              </button>
              <button className="gap-2 text-white/50 hover:text-blue-400 min-h-[44px] flex items-center">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments_count || 0}</span>
              </button>
            </div>
            <button className="gap-2 text-white/50 hover:text-[#c9a962] min-h-[44px] flex items-center">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderGameCard = (game: Game): React.ReactElement => {
    const homeWon = (game.home_score || 0) > (game.away_score || 0);
    return (
      <div key={`game-${game.id}`}>
        <Link href={`/box-score?gameId=${game.id}`}>
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden hover:bg-white/[0.08] transition-colors">
            <div className={`h-1 bg-gradient-to-r ${homeWon ? 'from-emerald-500 to-green-500' : 'from-blue-500 to-cyan-500'}`} />
            <div className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">FINAL</span>
                <span className="text-xs text-white/40">
                  {game.game_date ? new Date(game.game_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`font-semibold ${homeWon ? 'text-[#c9a962]' : 'text-white/80'}`}>{game.home_team_name || 'Home'}</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-2xl md:text-3xl font-bold text-white">{game.home_score || 0} - {game.away_score || 0}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className={`font-semibold ${!homeWon ? 'text-[#c9a962]' : 'text-white/80'}`}>{game.away_team_name || 'Away'}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-white/40">
                <MapPin className="w-3 h-3" />
                <span>{game.venue || 'TBD'}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const renderUpcomingGameCard = (game: Game): React.ReactElement => (
    <div key={`upcoming-${game.id}`} className="bg-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" /> UPCOMING
          </span>
          <span className="text-xs text-white/40">
            {game.game_date ? new Date(game.game_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-white/80 flex-1">{game.home_team_name || 'Home'}</p>
          <p className="text-lg font-bold text-white/50 px-4">VS</p>
          <p className="font-semibold text-white/80 flex-1 text-right">{game.away_team_name || 'Away'}</p>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-white/40">
          <Calendar className="w-3 h-3" />
          <span>{game.game_date ? new Date(game.game_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'}</span>
        </div>
      </div>
    </div>
  );

  const renderProgramCard = (program: Program): React.ReactElement => (
    <div key={`program-${program.id}`} className="bg-gradient-to-br from-[#c9a962]/20 to-transparent border border-[#c9a962]/30 rounded-xl overflow-hidden">
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#c9a962]/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-[#c9a962]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white mb-1">{program.name}</p>
            <p className="text-sm text-white/60 line-clamp-2">{program.description}</p>
            {program.start_date && (
              <p className="text-xs text-[#c9a962] mt-2">
                Starts {new Date(program.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="h-32 md:h-40 bg-gradient-to-br from-[#c9a962] via-amber-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0f0f0f]/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Your Feed</h1>
            <p className="text-white/70 text-sm mt-1">Stay connected with the community</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 md:p-6 -mt-6 pb-24">
        {/* Live Games Banner */}
        {liveGames.length > 0 && (
          <div className="mb-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-emerald-400">
                  {liveGames.length} Live Game{liveGames.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-2">
                {liveGames.slice(0, 2).map((game) => (
                  <Link
                    key={game.id}
                    href={`/live-game?gameId=${game.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-white text-sm">{game.home_team_name} vs {game.away_team_name}</span>
                    </div>
                    <span className="text-white font-semibold">{game.home_score || 0} - {game.away_score || 0}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Post */}
        <div className="mb-6">
          {showCreatePost ? (
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#c9a962]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#c9a962] font-semibold">
                    {(user?.full_name || user?.email || 'A')[0].toUpperCase()}
                  </span>
                </div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="flex-1 bg-transparent border-none text-white placeholder:text-white/30 resize-none min-h-[80px] outline-none"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div className="flex gap-2">
                  <button className="text-white/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <Image className="w-5 h-5" />
                  </button>
                  <button className="text-white/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowCreatePost(false)} className="text-white/50 min-h-[44px] px-3">Cancel</button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#d4b46d] min-h-[44px] px-4 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" /> Post
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full bg-white/[0.05] border border-white/[0.06] text-white/50 flex items-center px-4 min-h-[56px] hover:bg-white/[0.08] rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-[#c9a962]/20 flex items-center justify-center mr-3">
                <span className="text-[#c9a962] text-sm font-semibold">
                  {(user?.full_name || user?.email || 'A')[0].toUpperCase()}
                </span>
              </div>
              What&apos;s happening?
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { id: 'all', label: 'All', icon: Flame },
            { id: 'posts', label: 'Posts', icon: MessageCircle },
            { id: 'games', label: 'Games', icon: Trophy },
            { id: 'training', label: 'Training', icon: TrendingUp },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`min-h-[44px] px-4 flex-shrink-0 flex items-center gap-2 rounded-lg text-sm font-medium ${
                  filter === f.id
                    ? 'bg-[#c9a962] text-[#0f0f0f]'
                    : 'border border-white/[0.06] text-white/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Feed Items */}
        <div className="space-y-4">
          {postsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/[0.05] rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-white/[0.1]" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-white/[0.1] rounded" />
                      <div className="h-3 w-20 bg-white/[0.06] rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-full bg-white/[0.06] rounded mb-2" />
                  <div className="h-4 w-2/3 bg-white/[0.06] rounded" />
                </div>
              ))}
            </div>
          ) : feedItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/40 mb-2">No posts yet</p>
              <p className="text-white/30 text-sm">Be the first to share something!</p>
            </div>
          ) : (
            feedItems.map((item) => {
              switch (item.type) {
                case 'post':
                  return renderPostCard(item.data);
                case 'game':
                  return renderGameCard(item.data);
                case 'upcoming_game':
                  return renderUpcomingGameCard(item.data);
                case 'program':
                  return renderProgramCard(item.data);
                default:
                  return null;
              }
            })
          )}
        </div>
      </div>
    </div>
  );
}
