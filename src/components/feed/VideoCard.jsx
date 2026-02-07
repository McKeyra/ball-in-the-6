import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Heart, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoCard({ post, player, team }) {
  const [liked, setLiked] = useState(false);

  const sportColors = {
    basketball: 'from-orange-500 to-red-500',
    hockey: 'from-blue-600 to-cyan-500',
    soccer: 'from-green-500 to-emerald-500',
    baseball: 'from-red-600 to-pink-500',
    football: 'from-amber-600 to-orange-500',
    volleyball: 'from-yellow-500 to-orange-400',
    lacrosse: 'from-purple-500 to-pink-500',
  };

  const cardColor = team?.sport && sportColors[team.sport] || 'from-[#D0FF00] to-yellow-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${cardColor}`} />
        
        {/* Video Thumbnail */}
        <div className="aspect-video bg-black relative group cursor-pointer">
          {post.video_url ? (
            <video 
              src={post.video_url}
              className="w-full h-full object-cover"
              poster={post.media_urls?.[0]}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all">
            <div className="w-20 h-20 rounded-full bg-[#D0FF00] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#D0FF00]/50">
              <Play className="w-10 h-10 text-[#0A0A0A] ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-xs font-bold text-white">
            0:45
          </div>
        </div>

        <div className="p-4">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cardColor} flex items-center justify-center font-bold text-white`}>
              {player?.first_name?.[0] || 'P'}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                {player ? `${player.first_name} ${player.last_name}` : 'Unknown Player'}
              </p>
              <p className="text-xs text-gray-400">
                {team?.name || 'Independent'}
              </p>
            </div>
          </div>

          {/* Caption */}
          {post.content && (
            <p className="text-white text-sm mb-3 line-clamp-2">{post.content}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={`gap-2 ${liked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span className="text-xs">{(post.likes_count || 0) + (liked ? 1 : 0)}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-400 hover:text-blue-400">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{post.comments_count || 0}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-gray-400 hover:text-[#D0FF00]">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}