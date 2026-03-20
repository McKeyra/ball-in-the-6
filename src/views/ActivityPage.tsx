'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  UserPlus,
  MapPin,
  Trophy,
  Pencil,
  Flame,
  TrendingUp,
  Zap,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ActivityType = 'post' | 'like' | 'comment' | 'follow' | 'checkin' | 'achievement';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  timestamp: number;
}

const ACTIVITY_CONFIG: Record<ActivityType, { icon: typeof Heart; color: string; bg: string; label: string }> = {
  post: { icon: Pencil, color: 'text-lime-dark', bg: 'bg-lime/10', label: 'Posts' },
  like: { icon: Heart, color: 'text-accent-red', bg: 'bg-accent-red/10', label: 'Likes' },
  comment: { icon: MessageCircle, color: 'text-accent-blue', bg: 'bg-accent-blue/10', label: 'Comments' },
  follow: { icon: UserPlus, color: 'text-accent-purple', bg: 'bg-accent-purple/10', label: 'Follows' },
  checkin: { icon: MapPin, color: 'text-accent-orange', bg: 'bg-accent-orange/10', label: 'Check-ins' },
  achievement: { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Achievements' },
};

const NOW = Date.now();
const HOUR = 3600000;
const DAY = 86400000;

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'a-01', type: 'post', title: 'Posted a play', description: 'Ankle breaker into a stepback three at Pan Am', time: '12m ago', timestamp: NOW - 720000 },
  { id: 'a-02', type: 'like', title: 'Liked a play', description: "DunkCity's poster dunk at Cherry Beach", time: '28m ago', timestamp: NOW - 1680000 },
  { id: 'a-03', type: 'comment', title: 'Commented on a play', description: '"That move was nasty bro" on CourtKing\'s full-court press break', time: '45m ago', timestamp: NOW - 2700000 },
  { id: 'a-04', type: 'checkin', title: 'Checked in', description: 'Pan Am Centre, Scarborough', time: '1h ago', timestamp: NOW - HOUR },
  { id: 'a-05', type: 'like', title: 'Liked a play', description: "Marcus Thompson's no-look dime highlight", time: '2h ago', timestamp: NOW - 2 * HOUR },
  { id: 'a-06', type: 'follow', title: 'Followed', description: 'Scarborough Elite joined your network', time: '3h ago', timestamp: NOW - 3 * HOUR },
  { id: 'a-07', type: 'comment', title: 'Replied to a comment', description: '"See you at the next run" on Rexdale Runs post', time: '5h ago', timestamp: NOW - 5 * HOUR },
  { id: 'a-08', type: 'post', title: 'Posted a play', description: 'Behind-the-back pass to a wide open three at Downsview', time: '8h ago', timestamp: NOW - 8 * HOUR },
  { id: 'a-09', type: 'achievement', title: 'Achievement Unlocked', description: 'Reached 10,000 Impact Score', time: '10h ago', timestamp: NOW - 10 * HOUR },
  { id: 'a-10', type: 'like', title: 'Liked a game recap', description: 'B.M.T. Titans vs SJPII Panthers final score post', time: '12h ago', timestamp: NOW - 12 * HOUR },
  { id: 'a-11', type: 'checkin', title: 'Checked in', description: "L'Amoreaux Sports Complex", time: '1d ago', timestamp: NOW - DAY },
  { id: 'a-12', type: 'follow', title: 'Followed', description: 'NorthSide Ball joined your network', time: '1d ago', timestamp: NOW - 1.2 * DAY },
  { id: 'a-13', type: 'comment', title: 'Commented on a poll', description: '"Point guard debate" on SixMan\'s top 5 post', time: '1d ago', timestamp: NOW - 1.5 * DAY },
  { id: 'a-14', type: 'post', title: 'Shared a court review', description: 'Cherry Beach outdoor courts - 4.2 star rating', time: '2d ago', timestamp: NOW - 2 * DAY },
  { id: 'a-15', type: 'like', title: 'Liked a highlight', description: "Toronto Hoops' summer league registration announcement", time: '2d ago', timestamp: NOW - 2.3 * DAY },
  { id: 'a-16', type: 'checkin', title: 'Checked in', description: 'Driftwood Community Centre, Jane & Finch', time: '3d ago', timestamp: NOW - 3 * DAY },
  { id: 'a-17', type: 'achievement', title: 'Streak Bonus', description: '14-day posting streak achieved', time: '3d ago', timestamp: NOW - 3.2 * DAY },
  { id: 'a-18', type: 'follow', title: 'Followed', description: 'Rexdale Runs joined your network', time: '4d ago', timestamp: NOW - 4 * DAY },
  { id: 'a-19', type: 'like', title: 'Liked a prediction', description: 'Jaylen Carter\'s UofT game prediction thread', time: '5d ago', timestamp: NOW - 5 * DAY },
  { id: 'a-20', type: 'post', title: 'Posted a play', description: 'Fadeaway jumper from the mid-range at Malvern Community Centre', time: '6d ago', timestamp: NOW - 6 * DAY },
];

type DateGroup = 'Today' | 'Yesterday' | 'This Week';

const getDateGroup = (timestamp: number): DateGroup => {
  const todayCutoff = NOW - DAY;
  const yesterdayCutoff = NOW - 2 * DAY;

  if (timestamp >= todayCutoff) return 'Today';
  if (timestamp >= yesterdayCutoff) return 'Yesterday';
  return 'This Week';
};

const groupByDate = (items: ActivityItem[]): Record<DateGroup, ActivityItem[]> => {
  const groups: Record<DateGroup, ActivityItem[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
  };

  for (const item of items) {
    const group = getDateGroup(item.timestamp);
    groups[group].push(item);
  }

  return groups;
};

interface StatBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}

const StatBadge: React.FC<StatBadgeProps> = ({ icon, label, value, accent }) => (
  <div
    className={cn(
      'flex-1 flex flex-col items-center gap-1 rounded-[16px] border py-3.5 px-2',
      accent
        ? 'border-lime/20 bg-lime/[0.04]'
        : 'border-neutral-200/60 bg-surface'
    )}
  >
    {icon}
    <span className="text-xl font-black text-neutral-900 tracking-tight">{value}</span>
    <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-500">{label}</span>
  </div>
);

export const ActivityPage: React.FC = () => {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filtered = filter === 'all'
    ? MOCK_ACTIVITY
    : MOCK_ACTIVITY.filter((a) => a.type === filter);

  const grouped = groupByDate(filtered);
  const dateGroups: DateGroup[] = ['Today', 'Yesterday', 'This Week'];

  // Stats
  const postsThisWeek = MOCK_ACTIVITY.filter((a) => a.type === 'post').length;
  const interactions = MOCK_ACTIVITY.filter((a) => ['like', 'comment'].includes(a.type)).length;
  const streakDays = 14;

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
            <h1 className="text-lg font-black text-neutral-900">Activity</h1>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
              showFilters ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100/60'
            )}
            aria-label="Filter activity"
          >
            <Filter className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
        </div>

        {/* Filter pills */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-bold transition-all',
                    filter === 'all'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-surface text-neutral-600 hover:bg-neutral-200/60'
                  )}
                >
                  All
                </button>
                {(Object.keys(ACTIVITY_CONFIG) as ActivityType[]).map((type) => {
                  const config = ACTIVITY_CONFIG[type];
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilter(type)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all',
                        filter === type
                          ? 'bg-neutral-900 text-white'
                          : 'bg-surface text-neutral-600 hover:bg-neutral-200/60'
                      )}
                    >
                      <Icon className="h-3 w-3" strokeWidth={2} />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div className="px-4 pt-4">
        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3 gap-2.5 mb-6"
        >
          <StatBadge
            icon={<Pencil className="h-4 w-4 text-lime-dark" />}
            label="Posts This Week"
            value={String(postsThisWeek)}
          />
          <StatBadge
            icon={<TrendingUp className="h-4 w-4 text-accent-blue" />}
            label="Interactions"
            value={String(interactions)}
          />
          <StatBadge
            icon={<Flame className="h-4 w-4 text-orange-400" />}
            label="Day Streak"
            value={String(streakDays)}
            accent
          />
        </motion.div>

        {/* Activity Timeline */}
        {dateGroups.map((groupLabel) => {
          const items = grouped[groupLabel];
          if (items.length === 0) return null;

          return (
            <motion.section
              key={groupLabel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h2 className="mb-2 px-1 text-xs font-black uppercase tracking-wider text-neutral-400">
                {groupLabel}
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[23px] top-4 bottom-4 w-[1.5px] bg-neutral-100" />

                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => {
                    const config = ACTIVITY_CONFIG[item.type];
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ delay: index * 0.03, duration: 0.25 }}
                        className="relative flex items-start gap-3 py-2.5 pl-1"
                      >
                        {/* Timeline dot */}
                        <div
                          className={cn(
                            'relative z-10 flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border-2 border-white',
                            config.bg
                          )}
                        >
                          <Icon className={cn('h-4.5 w-4.5', config.color)} strokeWidth={2} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-sm leading-snug">
                            <span className="font-bold text-neutral-900">{item.title}</span>
                          </p>
                          <p className="text-[13px] text-neutral-500 mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                          <span className="mt-1 block text-[10px] font-medium text-neutral-300">
                            {item.time}
                          </span>
                        </div>

                        {/* Type badge */}
                        <span
                          className={cn(
                            'shrink-0 mt-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider',
                            config.bg,
                            config.color
                          )}
                        >
                          {item.type}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.section>
          );
        })}

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
              <Zap className="h-7 w-7 text-neutral-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">No activity yet</h3>
            <p className="mt-1 text-xs text-neutral-400 max-w-[240px]">
              Start posting plays, liking content, and following other ballers to see your activity here.
            </p>
            <Link
              href="/"
              className="mt-5 rounded-2xl bg-lime px-6 py-2.5 text-xs font-black text-black transition-transform active:scale-95"
            >
              Back to Feed
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};
