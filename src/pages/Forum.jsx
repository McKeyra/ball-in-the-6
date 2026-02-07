import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MessageSquare, Plus, Heart, MessageCircle, Pin, 
  Search, Filter, Users, BookOpen, HelpCircle, Calendar 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ForumPostDetail from "@/components/community/ForumPostDetail";

const categories = [
  { id: "general", label: "General Discussion", icon: MessageSquare, color: "bg-slate-500" },
  { id: "coaching-tips", label: "Coaching Tips", icon: BookOpen, color: "bg-blue-500" },
  { id: "parent-corner", label: "Parent Corner", icon: Users, color: "bg-purple-500" },
  { id: "equipment", label: "Equipment & Gear", icon: Users, color: "bg-green-500" },
  { id: "events", label: "Events & Tournaments", icon: Calendar, color: "bg-orange-500" },
  { id: "rules-questions", label: "Rules & Questions", icon: HelpCircle, color: "bg-pink-500" },
];

export default function Forum() {
  const [user, setUser] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "general" });
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: posts = [] } = useQuery({
    queryKey: ['forumPosts'],
    queryFn: () => base44.entities.ForumPost.list('-created_date'),
    enabled: !!user,
  });

  const createPostMutation = useMutation({
    mutationFn: (data) => base44.entities.ForumPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
      setShowNewPost(false);
      setNewPost({ title: "", content: "", category: "general" });
      toast.success('Post created!');
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async ({ postId, likes }) => {
      const newLikes = likes.includes(user.email)
        ? likes.filter(e => e !== user.email)
        : [...likes, user.email];
      return base44.entities.ForumPost.update(postId, { likes: newLikes });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forumPosts'] })
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in all fields');
      return;
    }
    createPostMutation.mutate({
      ...newPost,
      author_email: user.email,
      author_name: user.full_name,
      likes: [],
      replies_count: 0
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedPosts = filteredPosts.filter(p => p.pinned);
  const regularPosts = filteredPosts.filter(p => !p.pinned);

  if (selectedPost) {
    return <ForumPostDetail post={selectedPost} user={user} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
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
            <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-pink-600 min-h-[44px] w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Start a New Discussion</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Discussion title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                  <Select value={newPost.category} onValueChange={(v) => setNewPost({ ...newPost, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="min-h-[150px]"
                  />
                  <Button onClick={handleCreatePost} className="w-full bg-gradient-to-r from-orange-500 to-pink-600">
                    Post Discussion
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/[0.07]"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-64 bg-white/[0.07]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 md:mb-8">
          {categories.map(cat => {
            const Icon = cat.icon;
            const count = posts.filter(p => p.category === cat.id).length;
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
              {pinnedPosts.map(post => (
                <PostCard key={post.id} post={post} user={user} onClick={() => setSelectedPost(post)} onLike={likePostMutation} pinned />
              ))}
            </div>
          )}

          <AnimatePresence>
            {regularPosts.map(post => (
              <PostCard key={post.id} post={post} user={user} onClick={() => setSelectedPost(post)} onLike={likePostMutation} />
            ))}
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <Card className="border-none shadow-lg">
              <CardContent className="py-16 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <h3 className="text-xl font-semibold text-white mb-2">No discussions yet</h3>
                <p className="text-white/50 mb-4">Be the first to start a conversation!</p>
                <Button onClick={() => setShowNewPost(true)} className="bg-gradient-to-r from-orange-500 to-pink-600">
                  Start Discussion
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, user, onClick, onLike, pinned }) {
  const category = categories.find(c => c.id === post.category);
  const Icon = category?.icon || MessageSquare;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <Card
        className={`border-none shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-[0.99] ${pinned ? 'ring-2 ring-[#c9a962]' : ''}`}
        onClick={onClick}
      >
        <CardContent className="p-4 sm:p-6">
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
                <Badge variant="outline" className="flex-shrink-0 self-start text-xs hidden sm:inline-flex">{category?.label}</Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/40">
                  <span className="truncate max-w-[100px] sm:max-w-none">{post.author_name}</span>
                  <span>•</span>
                  <span>{new Date(post.created_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); onLike.mutate({ postId: post.id, likes: post.likes || [] }); }}
                    className={`flex items-center gap-1 text-sm min-h-[44px] min-w-[44px] justify-center ${post.likes?.includes(user?.email) ? 'text-pink-600' : 'text-white/40'}`}
                  >
                    <Heart className={`w-4 h-4 ${post.likes?.includes(user?.email) ? 'fill-current' : ''}`} />
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
        </CardContent>
      </Card>
    </motion.div>
  );
}