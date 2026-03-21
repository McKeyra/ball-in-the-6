'use client';

import { useState } from 'react';
import {
  MessageSquare, Plus, Heart, MessageCircle, Pin,
  Search, Filter, Users, BookOpen, HelpCircle, Calendar,
} from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface User {
  email: string;
  full_name: string;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author_name: string;
  author_email: string;
  likes: string[];
  replies_count: number;
  pinned?: boolean;
  created_date: string;
}

interface CategoryDef {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const categories: CategoryDef[] = [
  { id: 'general', label: 'General Discussion', icon: MessageSquare, color: 'bg-slate-500' },
  { id: 'coaching-tips', label: 'Coaching Tips', icon: BookOpen, color: 'bg-blue-500' },
  { id: 'parent-corner', label: 'Parent Corner', icon: Users, color: 'bg-purple-500' },
  { id: 'equipment', label: 'Equipment & Gear', icon: Users, color: 'bg-green-500' },
  { id: 'events', label: 'Events & Tournaments', icon: Calendar, color: 'bg-orange-500' },
  { id: 'rules-questions', label: 'Rules & Questions', icon: HelpCircle, color: 'bg-pink-500' },
];

function PostCard({
  post,
  user,
  onClick,
  onLike,
  pinned,
}: {
  post: ForumPost;
  user: User | null;
  onClick: () => void;
  onLike: () => void;
  pinned?: boolean;
}): React.ReactElement {
  const category = categories.find((c) => c.id === post.category);
  const Icon = category?.icon || MessageSquare;

  return (
    <div
      className={`bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.08] transition-all cursor-pointer active:scale-[0.99] rounded-xl ${pinned ? 'ring-2 ring-[#c9a962]' : ''}`}
      onClick={onClick}
    >
      <div className="p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${category?.color || 'bg-slate-500'} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {pinned && <Pin className="w-4 h-4 text-[#c9a962]" />}
                  <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-1">{post.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-white/50 line-clamp-2 mb-2 sm:mb-3">{post.content}</p>
              </div>
              <span className="hidden sm:inline-flex px-2 py-1 border border-white/[0.08] rounded text-xs text-white/60 flex-shrink-0">
                {category?.label}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/40">
                <span className="truncate max-w-[100px] sm:max-w-none">{post.author_name}</span>
                <span>&bull;</span>
                <span>{new Date(post.created_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); onLike(); }}
                  className={`flex items-center gap-1 text-sm min-h-[44px] min-w-[44px] justify-center ${post.likes?.includes(user?.email || '') ? 'text-pink-600' : 'text-white/40'}`}
                >
                  <Heart className={`w-4 h-4 ${post.likes?.includes(user?.email || '') ? 'fill-current' : ''}`} />
                  {post.likes?.length || 0}
                </button>
                <span className="flex items-center gap-1 text-sm text-white/40 min-h-[44px] min-w-[44px] justify-center">
                  <MessageCircle className="w-4 h-4" />
                  {post.replies_count || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForumPage(): React.ReactElement {
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });

  // TODO: Replace with API calls
  // const { data: user } = useQuery({ queryKey: ['me'], queryFn: () => fetch('/api/auth/me').then(r => r.json()) });
  // const { data: posts = [] } = useQuery({ queryKey: ['forumPosts'], queryFn: ... });
  const user = null as User | null;
  const posts: ForumPost[] = [];

  const handleCreatePost = (): void => {
    if (!newPost.title || !newPost.content) return;
    // TODO: POST /api/forum-posts
    setShowNewPost(false);
    setNewPost({ title: '', content: '', category: 'general' });
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedPosts = filteredPosts.filter((p) => p.pinned);
  const regularPosts = filteredPosts.filter((p) => !p.pinned);

  if (selectedPost) {
    // TODO: ForumPostDetail component
    return (
      <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setSelectedPost(null)} className="text-white/60 mb-4 min-h-[44px]">
            &larr; Back to Forum
          </button>
          <h2 className="text-2xl font-bold text-white mb-4">{selectedPost.title}</h2>
          <p className="text-white/70">{selectedPost.content}</p>
          <p className="text-sm text-white/40 mt-4">By {selectedPost.author_name} on {new Date(selectedPost.created_date).toLocaleDateString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                Community Forum
              </h1>
              <p className="text-white/50 mt-1 text-sm md:text-base">Connect with coaches, parents, and the sports community</p>
            </div>
            <button
              onClick={() => setShowNewPost(true)}
              className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Discussion
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-white/[0.07] border border-white/[0.06] rounded-lg min-h-[44px] text-white placeholder:text-white/30 px-3"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 bg-white/[0.07] border border-white/[0.06] rounded-lg min-h-[44px] text-white px-3"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 md:mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = posts.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 sm:p-4 rounded-xl border transition-all min-h-[88px] ${
                  selectedCategory === cat.id
                    ? 'bg-white/[0.07] border-[#c9a962] shadow-lg'
                    : 'bg-white/[0.05] border-white/[0.06] hover:bg-white/[0.07] active:bg-white/[0.1]'
                }`}
              >
                <div className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-medium text-white text-center line-clamp-1">{cat.label}</p>
                <p className="text-xs text-white/40 text-center">{count} posts</p>
              </button>
            );
          })}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {pinnedPosts.length > 0 && (
            <div className="space-y-3">
              {pinnedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={user}
                  onClick={() => setSelectedPost(post)}
                  onLike={() => { /* TODO: like mutation */ }}
                  pinned
                />
              ))}
            </div>
          )}

          {regularPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={user}
              onClick={() => setSelectedPost(post)}
              onLike={() => { /* TODO: like mutation */ }}
            />
          ))}

          {filteredPosts.length === 0 && (
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl py-16 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <h3 className="text-xl font-semibold text-white mb-2">No discussions yet</h3>
              <p className="text-white/50 mb-4">Be the first to start a conversation!</p>
              <button onClick={() => setShowNewPost(true)} className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 px-4 py-2 rounded-lg font-medium">
                Start Discussion
              </button>
            </div>
          )}
        </div>

        {/* Create Post Dialog */}
        {showNewPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-w-2xl w-full bg-[#121212] border border-white/[0.06] text-white rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Start a New Discussion</h2>
              <div className="space-y-4">
                <input
                  placeholder="Discussion title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full bg-white/[0.07] border border-white/[0.06] rounded-lg min-h-[44px] text-white placeholder:text-white/30 px-3"
                />
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full bg-white/[0.07] border border-white/[0.06] rounded-lg min-h-[44px] text-white px-3"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Share your thoughts..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full min-h-[150px] bg-white/[0.07] border border-white/[0.06] rounded-lg text-white placeholder:text-white/30 p-3 resize-none"
                />
                <div className="flex gap-3">
                  <button onClick={() => setShowNewPost(false)} className="flex-1 min-h-[44px] border border-white/[0.06] rounded-lg text-white/60">Cancel</button>
                  <button onClick={handleCreatePost} className="flex-1 bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] rounded-lg font-medium">
                    Post Discussion
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
