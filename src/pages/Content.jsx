import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image, BarChart2, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Content() {
  const queryClient = useQueryClient();
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [createGalleryOpen, setCreateGalleryOpen] = useState(false);

  const { data: posts = [] } = useQuery({
    queryKey: ['content-posts'],
    queryFn: () => base44.entities.Post.list('-created_date'),
  });

  const { data: galleries = [] } = useQuery({
    queryKey: ['galleries'],
    queryFn: () => base44.entities.Gallery.list('-created_date'),
  });

  const { data: polls = [] } = useQuery({
    queryKey: ['polls'],
    queryFn: () => base44.entities.Poll.list('-created_date'),
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.list('-created_date'),
  });

  const createPostMutation = useMutation({
    mutationFn: (data) => base44.entities.Post.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['content-posts']);
      setCreatePostOpen(false);
    },
  });

  const [postForm, setPostForm] = useState({
    type: 'player_post',
    content: '',
    visibility: 'public',
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 md:mb-2 text-white">Content Management</h1>
            <p className="text-white/40 text-sm md:text-base">Create posts, galleries, polls & news</p>
          </div>
          <Button
            onClick={() => setCreatePostOpen(true)}
            className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90 min-h-[44px] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>

        <Tabs defaultValue="posts" className="space-y-4 md:space-y-6">
          <TabsList className="bg-white/[0.05] border-white/[0.06] w-full flex overflow-x-auto">
            <TabsTrigger value="posts" className="flex-1 min-h-[44px] text-xs sm:text-sm">Posts ({posts.length})</TabsTrigger>
            <TabsTrigger value="galleries" className="flex-1 min-h-[44px] text-xs sm:text-sm">Galleries ({galleries.length})</TabsTrigger>
            <TabsTrigger value="polls" className="flex-1 min-h-[44px] text-xs sm:text-sm">Polls ({polls.length})</TabsTrigger>
            <TabsTrigger value="articles" className="flex-1 min-h-[44px] text-xs sm:text-sm">Articles ({articles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="bg-white/[0.05] border-white/[0.06] active:scale-[0.99] transition-all">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-sm md:text-lg line-clamp-2 text-white">{post.content?.slice(0, 50)}...</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 md:px-6 md:pb-6 pt-0">
                    <div className="flex items-center justify-between text-xs md:text-sm text-white/40">
                      <span className="capitalize">{post.type}</span>
                      <span>{new Date(post.created_date).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="galleries">
            <Card className="bg-white/[0.03] border-white/[0.06]">
              <CardContent className="py-12 md:py-16 text-center">
                <Image className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/20" />
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Photo Galleries</h3>
                <p className="text-white/40 text-sm md:text-base mb-4">Gallery management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="polls">
            <Card className="bg-white/[0.03] border-white/[0.06]">
              <CardContent className="py-12 md:py-16 text-center">
                <BarChart2 className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/20" />
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Community Polls</h3>
                <p className="text-white/40 text-sm md:text-base mb-4">Poll creation coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles">
            <Card className="bg-white/[0.03] border-white/[0.06]">
              <CardContent className="py-12 md:py-16 text-center">
                <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/20" />
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">News Articles</h3>
                <p className="text-white/40 text-sm md:text-base mb-4">Article management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Post Dialog */}
        <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
          <DialogContent className="bg-[#121212] border-white/[0.06] text-white">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea 
                  value={postForm.content}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  placeholder="What's happening?"
                  className="bg-white/[0.05] border-white/[0.06]"
                  rows={4}
                />
              </div>

              <Button 
                onClick={() => createPostMutation.mutate(postForm)}
                className="w-full bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90"
                disabled={!postForm.content}
              >
                Create Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}