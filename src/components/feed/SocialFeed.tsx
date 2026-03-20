'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import type { FeedPost } from '@/types/index';
import { PlayCard } from '@/components/cards/PlayCard';
import { NoBleedCard } from '@/components/cards/NoBleedCard';
import { FullWidthCard } from '@/components/cards/FullWidthCard';
import { GameResultsCard } from '@/components/cards/GameResultsCard';
import { NoBleedSlider } from '@/components/cards/NoBleedSlider';
import { NoBleedHeaderFill } from '@/components/cards/NoBleedHeaderFill';

interface SocialFeedProps {
  posts: FeedPost[];
}

const renderCard = (post: FeedPost): React.ReactNode => {
  switch (post.type) {
    case 'play': return <PlayCard post={post} />;
    case 'nobleed': return <NoBleedCard {...post} />;
    case 'fullwidth': return <FullWidthCard {...post} />;
    case 'game': return <GameResultsCard {...post} />;
    case 'slider': return <NoBleedSlider {...post} />;
    case 'headerfill': return <NoBleedHeaderFill {...post} />;
    default: return null;
  }
};

export const SocialFeed: React.FC<SocialFeedProps> = ({ posts }) => {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 space-y-0">
      {posts.map((post, index) => (
        <div key={post.id}>
          {index > 0 && <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.06 }} className="flex justify-center">
            {renderCard(post)}
          </motion.div>
        </div>
      ))}
      {posts.length > 0 && (
        <div className="flex flex-col items-center gap-3 pb-28 pt-12">
          <div className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_rgba(200,255,0,0.5)]" />
          <p className="text-xs font-medium text-neutral-400">You&apos;re all caught up</p>
          <Zap className="h-4 w-4 text-neutral-800" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
};
