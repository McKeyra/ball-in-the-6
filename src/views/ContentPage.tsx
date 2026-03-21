'use client';

import { useState } from 'react';
import { Plus, Image, BarChart2, FileText } from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface Post {
  id: string;
  content: string;
  type: string;
  created_date: string;
}

export function ContentPage(): React.ReactElement {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [postForm, setPostForm] = useState({ type: 'player_post', content: '', visibility: 'public' });

  // TODO: Replace with API calls
  // const { data: posts = [] } = useQuery({ queryKey: ['content-posts'], queryFn: ... });
  // const { data: galleries = [] } = useQuery({ queryKey: ['galleries'], queryFn: ... });
  // const { data: polls = [] } = useQuery({ queryKey: ['polls'], queryFn: ... });
  // const { data: articles = [] } = useQuery({ queryKey: ['articles'], queryFn: ... });
  const posts: Post[] = [];
  const galleries: unknown[] = [];
  const polls: unknown[] = [];
  const articles: unknown[] = [];

  const handleCreatePost = (): void => {
    if (!postForm.content) return;
    // TODO: POST /api/posts
    setCreatePostOpen(false);
    setPostForm({ type: 'player_post', content: '', visibility: 'public' });
  };

  const tabs = [
    { id: 'posts', label: `Posts (${posts.length})` },
    { id: 'galleries', label: `Galleries (${galleries.length})` },
    { id: 'polls', label: `Polls (${polls.length})` },
    { id: 'articles', label: `Articles (${articles.length})` },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 md:mb-2 text-white">Content Management</h1>
            <p className="text-white/40 text-sm md:text-base">Create posts, galleries, polls &amp; news</p>
          </div>
          <button
            onClick={() => setCreatePostOpen(true)}
            className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Post
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/[0.05] border border-white/[0.06] rounded-lg overflow-x-auto mb-4 md:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-h-[44px] text-xs sm:text-sm px-3 py-2 font-medium transition-colors ${
                activeTab === tab.id ? 'bg-white/[0.1] text-white' : 'text-white/50 hover:text-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white/[0.05] border border-white/[0.06] rounded-xl active:scale-[0.99] transition-all">
                <div className="p-4 md:p-6">
                  <h3 className="text-sm md:text-lg text-white line-clamp-2 font-semibold">{post.content?.slice(0, 50)}...</h3>
                </div>
                <div className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
                  <div className="flex items-center justify-between text-xs md:text-sm text-white/40">
                    <span className="capitalize">{post.type}</span>
                    <span>{new Date(post.created_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'galleries' && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-12 md:py-16 text-center">
            <Image className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Photo Galleries</h3>
            <p className="text-white/40 text-sm md:text-base mb-4">Gallery management coming soon...</p>
          </div>
        )}

        {activeTab === 'polls' && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-12 md:py-16 text-center">
            <BarChart2 className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Community Polls</h3>
            <p className="text-white/40 text-sm md:text-base mb-4">Poll creation coming soon...</p>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-12 md:py-16 text-center">
            <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">News Articles</h3>
            <p className="text-white/40 text-sm md:text-base mb-4">Article management coming soon...</p>
          </div>
        )}

        {/* Create Post Dialog */}
        {createPostOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-w-lg w-full bg-[#121212] border border-white/[0.06] text-white rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Create New Post</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    placeholder="What's happening?"
                    className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-3 resize-none min-h-[120px]"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setCreatePostOpen(false)} className="flex-1 min-h-[44px] border border-white/[0.06] rounded-lg text-white/60">Cancel</button>
                  <button
                    onClick={handleCreatePost}
                    className="flex-1 bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] rounded-lg font-medium disabled:opacity-50"
                    disabled={!postForm.content}
                  >
                    Create Post
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
