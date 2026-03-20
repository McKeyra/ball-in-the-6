'use client';

import { useState } from 'react';
import { TopHeader } from '@/components/navigation/TopHeader';
import { SocialFeed } from '@/components/feed/SocialFeed';
import { FEED_DATA } from '@/lib/mock-data';
import type { FeedFilter, FeedPost } from '@/types/index';

const FILTER_MAP: Record<string, FeedFilter> = {
  'For You': 'all',
  'Plays': 'plays',
  'Games': 'games',
  'Trending': 'trending',
};

const PLAY_TYPES = new Set(['play', 'fullwidth', 'nobleed', 'headerfill', 'slider']);

const filterPosts = (posts: FeedPost[], filter: FeedFilter): FeedPost[] => {
  switch (filter) {
    case 'plays': return posts.filter((p) => PLAY_TYPES.has(p.type));
    case 'games': return posts.filter((p) => p.type === 'game');
    case 'trending':
    case 'all':
    default: return posts;
  }
};

export const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('For You');
  const internalFilter = FILTER_MAP[activeFilter] ?? 'all';
  const filteredPosts = filterPosts(FEED_DATA, internalFilter);

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <SocialFeed posts={filteredPosts} />
    </div>
  );
};
