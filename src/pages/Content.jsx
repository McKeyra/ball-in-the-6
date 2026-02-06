import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image, BarChart2, FileText, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Content Management</h1>
            <p className="text-white/40">Create posts, galleries, polls & news</p>
          </div>
          <Button 
            onClick={() => setCreatePostOpen(true)}
            className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="bg-white/[0.05] border-white/[0.06]">
            <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
            <TabsTrigger value="galleries">Galleries ({galleries.length})</TabsTrigger>
            <TabsTrigger value="polls">Polls ({polls.length})</TabsTrigger>
            <TabsTrigger value="articles">Articles ({articles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="grid md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="bg-white/[0.05] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="text-lg">{post.content?.slice(0, 50)}...</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-white/40">
                      <span>{post.type}</span>
                      <span>{new Date(post.created_date).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="galleries">
            <p className="text-white/40">Gallery management coming soon...</p>
          </TabsContent>

          <TabsContent value="polls">
            <p className="text-white/40">Poll creation coming soon...</p>
          </TabsContent>

          <TabsContent value="articles">
            <p className="text-white/40">Article management coming soon...</p>
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