import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Video, Plus, Grid3x3, List } from "lucide-react";

export default function MediaGallery({ posts }) {
  const [view, setView] = useState('grid');

  const allMedia = posts.reduce((acc, post) => {
    if (post.media_urls) {
      post.media_urls.forEach(url => {
        acc.push({
          url,
          type: post.video_url ? 'video' : 'image',
          caption: post.content,
          date: post.created_date,
        });
      });
    }
    if (post.video_url) {
      acc.push({
        url: post.video_url,
        type: 'video',
        caption: post.content,
        date: post.created_date,
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-[#D0FF00]" />
          <h2 className="text-xl font-bold text-white">Media Gallery</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'bg-[#D0FF00] text-[#0A0A0A]' : 'border-white/10'}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-[#D0FF00] text-[#0A0A0A]' : 'border-white/10'}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {allMedia.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-12 text-center">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No media uploaded yet</p>
            <Button className="bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90">
              <Plus className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-2' : 'space-y-2'}>
          {allMedia.map((media, idx) => (
            <div 
              key={idx}
              className={`relative bg-white/5 rounded-lg overflow-hidden group cursor-pointer ${
                view === 'grid' ? 'aspect-square' : 'aspect-video'
              }`}
            >
              {media.type === 'video' ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
              ) : (
                <img 
                  src={media.url} 
                  alt="Media"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <Button
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90"
                >
                  {media.type === 'video' ? <Video className="w-5 h-5" /> : <Image className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}