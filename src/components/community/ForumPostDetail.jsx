import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ForumPostDetail({ post, user, onBack }) {
  const [replyContent, setReplyContent] = useState("");
  const queryClient = useQueryClient();

  const { data: replies = [] } = useQuery({
    queryKey: ['forumReplies', post.id],
    queryFn: () => base44.entities.ForumReply.filter({ post_id: post.id }),
  });

  const createReplyMutation = useMutation({
    mutationFn: async (content) => {
      await base44.entities.ForumReply.create({
        post_id: post.id,
        content,
        author_email: user.email,
        author_name: user.full_name,
        likes: []
      });
      await base44.entities.ForumPost.update(post.id, { replies_count: (post.replies_count || 0) + 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumReplies', post.id] });
      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
      setReplyContent("");
      toast.success('Reply posted!');
    }
  });

  const likeReplyMutation = useMutation({
    mutationFn: async ({ replyId, likes }) => {
      const newLikes = likes.includes(user.email)
        ? likes.filter(e => e !== user.email)
        : [...likes, user.email];
      return base44.entities.ForumReply.update(replyId, { likes: newLikes });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forumReplies', post.id] })
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forum
        </Button>

        {/* Main Post */}
        <Card className="border-none shadow-lg mb-6">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">{post.title}</h1>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold">
                {post.author_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-slate-900">{post.author_name}</p>
                <p className="text-sm text-slate-500">{new Date(post.created_date).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap mb-6">{post.content}</p>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button className="flex items-center gap-2 text-slate-600 hover:text-pink-600">
                <Heart className="w-5 h-5" />
                <span>{post.likes?.length || 0} likes</span>
              </button>
              <button className="flex items-center gap-2 text-slate-600">
                <MessageCircle className="w-5 h-5" />
                <span>{replies.length} replies</span>
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 text-slate-600 hover:text-blue-600">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Reply Box */}
        <Card className="border-none shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {user?.full_name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="mb-3"
                />
                <Button 
                  onClick={() => createReplyMutation.mutate(replyContent)}
                  disabled={!replyContent.trim()}
                  className="bg-gradient-to-r from-orange-500 to-pink-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">{replies.length} Replies</h3>
          {replies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-none shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {reply.author_name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-slate-900">{reply.author_name}</span>
                        <span className="text-sm text-slate-500">•</span>
                        <span className="text-sm text-slate-500">{new Date(reply.created_date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700 mb-3">{reply.content}</p>
                      <button
                        onClick={() => likeReplyMutation.mutate({ replyId: reply.id, likes: reply.likes || [] })}
                        className={`flex items-center gap-1 text-sm ${reply.likes?.includes(user?.email) ? 'text-pink-600' : 'text-slate-500'}`}
                      >
                        <Heart className={`w-4 h-4 ${reply.likes?.includes(user?.email) ? 'fill-current' : ''}`} />
                        {reply.likes?.length || 0}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}