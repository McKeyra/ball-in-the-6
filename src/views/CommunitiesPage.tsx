'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Users,
  Flame,
  Check,
  Crown,
  Dribbble,
  Footprints,
  Dumbbell,
  MapPin,
  GraduationCap,
  Swords,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';

type CommunityCategory =
  | 'Basketball'
  | 'Soccer'
  | 'Hockey'
  | 'Football'
  | 'Training'
  | 'Pickup Games'
  | 'Coaching';

interface Community {
  id: string;
  name: string;
  description: string;
  category: CommunityCategory;
  coverColor: string;
  iconColor: string;
  members: number;
  active: number;
  hot: boolean;
  joined: boolean;
  featured: boolean;
}

const CATEGORY_ICONS: Record<CommunityCategory, typeof Dribbble> = {
  Basketball: Dribbble,
  Soccer: Footprints,
  Hockey: Swords,
  Football: Shield,
  Training: Dumbbell,
  'Pickup Games': MapPin,
  Coaching: GraduationCap,
};

const CATEGORY_FILTERS: CommunityCategory[] = [
  'Basketball',
  'Soccer',
  'Hockey',
  'Football',
  'Training',
  'Pickup Games',
  'Coaching',
];

const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'com-001',
    name: 'Scarborough Runs',
    description: 'The official hub for all Scarborough basketball runs. Find games, make plays.',
    category: 'Basketball',
    coverColor: 'from-orange-500 to-red-500',
    iconColor: 'text-orange-500',
    members: 2840,
    active: 156,
    hot: true,
    joined: true,
    featured: true,
  },
  {
    id: 'com-002',
    name: '6ix Pickup Games',
    description: 'Daily pickup game listings across the GTA. Never miss a run.',
    category: 'Pickup Games',
    coverColor: 'from-lime-400 to-emerald-500',
    iconColor: 'text-lime-600',
    members: 4120,
    active: 312,
    hot: true,
    joined: true,
    featured: true,
  },
  {
    id: 'com-003',
    name: 'Toronto Hoops League',
    description: 'Official community for organized league play. Schedules, standings, highlights.',
    category: 'Basketball',
    coverColor: 'from-purple-500 to-indigo-600',
    iconColor: 'text-purple-500',
    members: 1890,
    active: 89,
    hot: false,
    joined: true,
    featured: true,
  },
  {
    id: 'com-004',
    name: 'Court Fitness',
    description: 'Basketball-specific training, conditioning, and skill work. Level up your game.',
    category: 'Training',
    coverColor: 'from-cyan-500 to-blue-500',
    iconColor: 'text-cyan-500',
    members: 1230,
    active: 67,
    hot: false,
    joined: true,
    featured: false,
  },
  {
    id: 'com-005',
    name: 'GTA Soccer Network',
    description: 'Indoor and outdoor soccer across the GTA. All skill levels welcome.',
    category: 'Soccer',
    coverColor: 'from-green-500 to-emerald-600',
    iconColor: 'text-green-500',
    members: 3450,
    active: 198,
    hot: true,
    joined: false,
    featured: true,
  },
  {
    id: 'com-006',
    name: 'Pond Hockey Toronto',
    description: 'When the ponds freeze, we play. Shinny spots and outdoor rinks across the city.',
    category: 'Hockey',
    coverColor: 'from-blue-500 to-sky-400',
    iconColor: 'text-blue-500',
    members: 890,
    active: 34,
    hot: false,
    joined: false,
    featured: false,
  },
  {
    id: 'com-007',
    name: 'Youth Coaching Network',
    description: 'Resources, drills, and mentorship for coaches developing young athletes in Toronto.',
    category: 'Coaching',
    coverColor: 'from-yellow-500 to-amber-500',
    iconColor: 'text-yellow-600',
    members: 670,
    active: 42,
    hot: false,
    joined: false,
    featured: false,
  },
  {
    id: 'com-008',
    name: 'Midnight Ball',
    description: 'Late night runs across the city. Indoor courts, bright lights, no excuses.',
    category: 'Pickup Games',
    coverColor: 'from-violet-600 to-purple-800',
    iconColor: 'text-violet-500',
    members: 1560,
    active: 78,
    hot: true,
    joined: false,
    featured: true,
  },
  {
    id: 'com-009',
    name: 'Flag Football 6ix',
    description: 'Recreational flag football leagues and pickup games. Spring & summer season.',
    category: 'Football',
    coverColor: 'from-amber-600 to-orange-700',
    iconColor: 'text-amber-600',
    members: 920,
    active: 55,
    hot: false,
    joined: false,
    featured: false,
  },
  {
    id: 'com-010',
    name: 'Strength & Conditioning',
    description: 'Off-court training for serious athletes. Lifting, plyometrics, mobility.',
    category: 'Training',
    coverColor: 'from-rose-500 to-pink-600',
    iconColor: 'text-rose-500',
    members: 780,
    active: 38,
    hot: false,
    joined: false,
    featured: false,
  },
  {
    id: 'com-011',
    name: 'Downsview Courts',
    description: 'North York ballers. All the action at Downsview Park and surrounding courts.',
    category: 'Basketball',
    coverColor: 'from-teal-500 to-cyan-600',
    iconColor: 'text-teal-500',
    members: 1340,
    active: 92,
    hot: false,
    joined: true,
    featured: false,
  },
  {
    id: 'com-012',
    name: 'Ball Hockey League',
    description: 'Year-round ball hockey. Indoor and outdoor leagues across Toronto.',
    category: 'Hockey',
    coverColor: 'from-slate-600 to-gray-700',
    iconColor: 'text-slate-500',
    members: 540,
    active: 21,
    hot: false,
    joined: false,
    featured: false,
  },
];

interface CommunityCardProps {
  community: Community;
  variant: 'featured' | 'list';
  onToggleJoin: (id: string) => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, variant, onToggleJoin }) => {
  const CategoryIcon = CATEGORY_ICONS[community.category];

  if (variant === 'featured') {
    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="shrink-0 w-[240px] rounded-[20px] border border-neutral-200/60 overflow-hidden bg-white"
      >
        {/* Cover */}
        <div className={cn('relative h-24 bg-gradient-to-br', community.coverColor)}>
          <div className="absolute inset-0 bg-black/10" />
          {community.hot && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2 py-0.5">
              <Flame className="h-3 w-3 text-orange-400" />
              <span className="text-[10px] font-bold text-white">HOT</span>
            </div>
          )}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5">
            <Users className="h-3 w-3 text-white" />
            <span className="text-[10px] font-bold text-white">{formatNumber(community.members)}</span>
          </div>
        </div>
        {/* Info */}
        <div className="px-3.5 py-3">
          <div className="flex items-center gap-1.5">
            <CategoryIcon className={cn('h-3.5 w-3.5', community.iconColor)} strokeWidth={2} />
            <span className="text-sm font-bold text-neutral-900 truncate">{community.name}</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">{community.description}</p>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {community.active} active
            </span>
            <button
              type="button"
              onClick={() => onToggleJoin(community.id)}
              className={cn(
                'rounded-full px-4 py-1.5 text-[11px] font-bold transition-all',
                community.joined
                  ? 'bg-neutral-100 text-neutral-600 hover:bg-red-50 hover:text-red-500'
                  : 'bg-lime text-black hover:bg-[#d4ff33]'
              )}
            >
              {community.joined ? 'Joined' : 'Join'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-[16px] px-3 py-3 transition-colors hover:bg-surface"
    >
      {/* Icon */}
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br', community.coverColor)}>
        <CategoryIcon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-neutral-900 truncate">{community.name}</span>
          {community.hot && <Flame className="h-3 w-3 shrink-0 text-orange-400" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-neutral-500 font-medium">{formatNumber(community.members)} members</span>
          <span className="text-neutral-300">|</span>
          <span className="flex items-center gap-1 text-[11px] text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {community.active} online
          </span>
        </div>
      </div>
      {/* Join button */}
      <button
        type="button"
        onClick={() => onToggleJoin(community.id)}
        className={cn(
          'shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all',
          community.joined
            ? 'bg-neutral-100 text-neutral-600 hover:bg-red-50 hover:text-red-500'
            : 'bg-lime text-black hover:bg-[#d4ff33]'
        )}
      >
        {community.joined ? 'Joined' : 'Join'}
      </button>
    </motion.div>
  );
};

export const CommunitiesPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [search, setSearch] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<CommunityCategory | 'All'>('All');

  const handleToggleJoin = useCallback((id: string): void => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: !c.joined } : c))
    );
  }, []);

  const filtered = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered.filter((c) => c.featured);
  const joined = filtered.filter((c) => c.joined);
  const discover = filtered.filter((c) => !c.joined);

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-void/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
            >
              <ArrowLeft className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
            </Link>
            <h1 className="text-lg font-black text-neutral-900">Communities</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
            <Users className="h-3.5 w-3.5" />
            <span>{joined.length} joined</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search communities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[14px] bg-surface border border-neutral-200/60 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-lime/40 focus:ring-1 focus:ring-lime/20 transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all',
                activeCategory === 'All'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-surface text-neutral-600 hover:bg-neutral-200/60'
              )}
            >
              All
            </button>
            {CATEGORY_FILTERS.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all',
                    activeCategory === cat
                      ? 'bg-neutral-900 text-white'
                      : 'bg-surface text-neutral-600 hover:bg-neutral-200/60'
                  )}
                >
                  <Icon className="h-3 w-3" strokeWidth={2} />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </motion.header>

      <div className="pt-4">
        {/* Featured Communities - Horizontal Scroll */}
        {featured.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between px-4 mb-3">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">Featured</h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                {featured.length} communities
              </span>
            </div>
            <div className="overflow-x-auto scrollbar-hide px-4">
              <div className="flex gap-3">
                {featured.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    variant="featured"
                    onToggleJoin={handleToggleJoin}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Your Communities */}
        {joined.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6 px-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">Your Communities</h2>
              <span className="text-[10px] font-mono text-neutral-300">{joined.length}</span>
            </div>
            <AnimatePresence mode="popLayout">
              {joined.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  variant="list"
                  onToggleJoin={handleToggleJoin}
                />
              ))}
            </AnimatePresence>
          </motion.section>
        )}

        {/* Discover */}
        {discover.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="px-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">Discover</h2>
              <span className="text-[10px] font-mono text-neutral-300">{discover.length}</span>
            </div>
            <AnimatePresence mode="popLayout">
              {discover.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  variant="list"
                  onToggleJoin={handleToggleJoin}
                />
              ))}
            </AnimatePresence>
          </motion.section>
        )}

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center px-4"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
              <Search className="h-7 w-7 text-neutral-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">No communities found</h3>
            <p className="mt-1 text-xs text-neutral-400 max-w-[240px]">
              Try a different search or browse all categories.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
