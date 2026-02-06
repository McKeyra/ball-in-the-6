import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";

export default function PlayerPostCard({ post, player, team }) {
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

  const cardColor = team?.color || (team?.sport && sportColors[team.sport]) || 'from-[#D0FF00] to-yellow-500';

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${player?.first_name || 'Player'}'s Post`,
        text: post.content,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm overflow-hidden">
        {/* Header with gradient accent */}
        <div className={`h-1 bg-gradient-to-r ${cardColor}`} />
        
        <div className="p-4">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${cardColor} flex items-center justify-center font-bold text-white text-lg`}>
                {player?.first_name?.[0] || 'P'}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {player ? `${player.first_name} ${player.last_name}` : 'Unknown Player'}
                </p>
                <p className="text-sm text-gray-400">
                  {team?.name || 'Independent'} • {player?.position || 'Athlete'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          {post.content && (
            <p className="text-white mb-4 leading-relaxed">{post.content}</p>
          )}

          {/* Media Grid */}
          {post.media_urls && post.media_urls.length > 0 && (
            <div className={`grid gap-2 mb-4 ${
              post.media_urls.length === 1 ? 'grid-cols-1' :
              post.media_urls.length === 2 ? 'grid-cols-2' :
              post.media_urls.length === 3 ? 'grid-cols-3' :
              'grid-cols-2'
            }`}>
              {post.media_urls.slice(0, 4).map((url, idx) => (
                <div 
                  key={idx} 
                  className="aspect-square bg-white/5 rounded-lg overflow-hidden relative group cursor-pointer"
                >
                  <img 
                    src={url} 
                    alt={`Post media ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {idx === 3 && post.media_urls.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <p className="text-white text-2xl font-bold">+{post.media_urls.length - 4}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={`gap-2 ${liked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span>{(post.likes_count || 0) + (liked ? 1 : 0)}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-400 hover:text-blue-400">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments_count || 0}</span>
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="gap-2 text-gray-400 hover:text-[#D0FF00]"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}