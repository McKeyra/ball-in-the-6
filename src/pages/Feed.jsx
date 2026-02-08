import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageCircle, Share2, MoreVertical, Send, Image, Video,
  Trophy, MapPin, Calendar, Users, TrendingUp, Flame, Clock, X,
  ChevronRight, PlayCircle, Star, Filter
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Feed() {
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => null);
  }, []);

  // Fetch posts
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['feed-posts'],
    queryFn: () => base44.entities.Post.list('-created_date', 50),
    refetchInterval: 30000, // Refresh every 30s
  });

  // Fetch games
  const { data: games = [] } = useQuery({
    queryKey: ['feed-games'],
    queryFn: () => base44.entities.Game.list('-game_date', 20),
  });

  // Fetch teams
  const { data: teams = [] } = useQuery({
    queryKey: ['feed-teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  // Fetch players for posts
  const { data: players = [] } = useQuery({
    queryKey: ['feed-players'],
    queryFn: () => base44.entities.PersistentPlayer.list(),
  });

  // Fetch programs
  const { data: programs = [] } = useQuery({
    queryKey: ['feed-programs'],
    queryFn: () => base44.entities.Program.list('-created_date', 10),
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (newPost) => base44.entities.Post.create(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries(['feed-posts']);
      setNewPostContent('');
      setShowCreatePost(false);
    },
  });

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    createPostMutation.mutate({
      content: newPostContent,
      author_name: user?.full_name || user?.email || 'Anonymous',
      author_id: user?.id,
      type: 'player_post',
      likes: 0,
      comments_count: 0,
      created_date: new Date().toISOString(),
    });
  };

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Get team by ID
  const getTeam = (teamId) => teams.find(t => t.id === teamId);
  const getPlayer = (playerId) => players.find(p => p.id === playerId);

  // Live games
  const liveGames = games.filter(g => g.status === 'live' || g.status === 'in_progress');
  const recentGames = games.filter(g => g.status === 'completed').slice(0, 5);

  // Build feed items
  const getFeedItems = () => {
    let items = [];

    // Add posts
    posts.forEach(post => {
      if (filter === 'all' || filter === 'posts') {
        items.push({
          type: 'post',
          data: post,
          timestamp: new Date(post.created_date || Date.now()),
        });
      }
    });

    // Add game results
    if (filter === 'all' || filter === 'games') {
      recentGames.forEach(game => {
        items.push({
          type: 'game',
          data: game,
          timestamp: new Date(game.game_date || Date.now()),
        });
      });
    }

    // Add program announcements
    if (filter === 'all' || filter === 'training') {
      programs.slice(0, 3).forEach(program => {
        items.push({
          type: 'program',
          data: program,
          timestamp: new Date(program.created_date || Date.now()),
        });
      });
    }

    // Sort by timestamp
    return items.sort((a, b) => b.timestamp - a.timestamp);
  };

  const feedItems = getFeedItems();

  // Render post card
  const renderPostCard = (post) => {
    const isLiked = likedPosts.has(post.id);
    return (
      <motion.div
        key={`post-${post.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.05] border border-white/[0.06] rounded-2xl overflow-hidden"
      >
        <div className="h-1 bg-gradient-to-r from-[#c9a962] to-yellow-500" />
        <div className="p-4 md:p-5">
          {/* Author */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a962] to-yellow-600 flex items-center justify-center font-bold text-white">
                {(post.author_name || 'A')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{post.author_name || 'Anonymous'}</p>
                <p className="text-xs text-white/40">
                  {post.created_date ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true }) : 'Just now'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white/40 min-h-[44px] min-w-[44px]">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-white/90 mb-4 leading-relaxed">{post.content}</p>

          {/* Image if exists */}
          {post.image_url && (
            <div className="rounded-xl overflow-hidden mb-4">
              <img src={post.image_url} alt="Post" className="w-full object-cover" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLike(post.id)}
                className={`gap-2 min-h-[44px] ${isLiked ? 'text-red-500' : 'text-white/50'} hover:text-red-500`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-white/50 hover:text-blue-400 min-h-[44px]">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments_count || 0}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-white/50 hover:text-[#c9a962] min-h-[44px]">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render game card
  const renderGameCard = (game) => {
    const homeWon = (game.home_score || 0) > (game.away_score || 0);
    return (
      <motion.div
        key={`game-${game.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to={`${createPageUrl('BoxScore')}?gameId=${game.id}`}>
          <Card className="bg-white/[0.05] border-white/[0.06] overflow-hidden hover:bg-white/[0.08] transition-colors">
            <div className={`h-1 bg-gradient-to-r ${homeWon ? 'from-emerald-500 to-green-500' : 'from-blue-500 to-cyan-500'}`} />
            <div className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
                  FINAL
                </span>
                <span className="text-xs text-white/40">
                  {game.game_date ? format(new Date(game.game_date), 'MMM d') : 'Recent'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`font-semibold ${homeWon ? 'text-[#c9a962]' : 'text-white/80'}`}>
                    {game.home_team_name || 'Home'}
                  </p>
                </div>
                <div className="text-center px-4">
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {game.home_score || 0} - {game.away_score || 0}
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p className={`font-semibold ${!homeWon ? 'text-[#c9a962]' : 'text-white/80'}`}>
                    {game.away_team_name || 'Away'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-white/40">
                <MapPin className="w-3 h-3" />
                <span>{game.venue || 'TBD'}</span>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  };

  // Render program card
  const renderProgramCard = (program) => (
    <motion.div
      key={`program-${program.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-gradient-to-br from-[#c9a962]/20 to-transparent border-[#c9a962]/30 overflow-hidden">
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
                  Starts {format(new Date(program.start_date), 'MMM d, yyyy')}
                </p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0" />
          </div>
        </div>
      </Card>
    </motion.div>
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
                {liveGames.slice(0, 2).map(game => (
                  <Link
                    key={game.id}
                    to={`${createPageUrl('LiveGame')}?gameId=${game.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-white text-sm">
                        {game.home_team_name} vs {game.away_team_name}
                      </span>
                    </div>
                    <span className="text-white font-semibold">
                      {game.home_score || 0} - {game.away_score || 0}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Post */}
        <div className="mb-6">
          {showCreatePost ? (
            <Card className="bg-white/[0.05] border-white/[0.06] p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#c9a962]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#c9a962] font-semibold">
                    {(user?.full_name || user?.email || 'A')[0].toUpperCase()}
                  </span>
                </div>
                <Textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="flex-1 bg-transparent border-none text-white placeholder:text-white/30 resize-none min-h-[80px]"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-white/50 min-h-[44px] min-w-[44px]">
                    <Image className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/50 min-h-[44px] min-w-[44px]">
                    <Video className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowCreatePost(false)}
                    className="text-white/50 min-h-[44px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || createPostMutation.isPending}
                    className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#d4b46d] min-h-[44px]"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Button
              onClick={() => setShowCreatePost(true)}
              className="w-full bg-white/[0.05] border border-white/[0.06] text-white/50 justify-start px-4 min-h-[56px] hover:bg-white/[0.08]"
            >
              <div className="w-8 h-8 rounded-full bg-[#c9a962]/20 flex items-center justify-center mr-3">
                <span className="text-[#c9a962] text-sm font-semibold">
                  {(user?.full_name || user?.email || 'A')[0].toUpperCase()}
                </span>
              </div>
              What's happening?
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { id: 'all', label: 'All', icon: Flame },
            { id: 'posts', label: 'Posts', icon: MessageCircle },
            { id: 'games', label: 'Games', icon: Trophy },
            { id: 'training', label: 'Training', icon: TrendingUp },
          ].map(f => {
            const Icon = f.icon;
            return (
              <Button
                key={f.id}
                variant={filter === f.id ? 'default' : 'outline'}
                onClick={() => setFilter(f.id)}
                className={`min-h-[44px] px-4 flex-shrink-0 gap-2 ${
                  filter === f.id
                    ? 'bg-[#c9a962] text-[#0f0f0f]'
                    : 'border-white/[0.06] text-white/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {f.label}
              </Button>
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
            <AnimatePresence>
              {feedItems.map(item => {
                switch (item.type) {
                  case 'post':
                    return renderPostCard(item.data);
                  case 'game':
                    return renderGameCard(item.data);
                  case 'program':
                    return renderProgramCard(item.data);
                  default:
                    return null;
                }
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
