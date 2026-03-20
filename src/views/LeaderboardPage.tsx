'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  Zap,
  Target,
  MapPin,
  Users,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';

const TIME_FILTERS = ['Weekly', 'Monthly', 'All Time'] as const;
type TimeFilter = (typeof TIME_FILTERS)[number];

const CATEGORY_FILTERS = ['Overall', 'Plays', 'Assists', 'Courts'] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  avatarColor: string;
  impactScore: number;
  change: number;
  verified: boolean;
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  { id: 'lb-01', rank: 1, name: 'McKeyra', handle: '@mr_ballinthe6', avatar: 'MK', avatarColor: 'from-purple-500 to-blue-500', impactScore: 12400, change: 2, verified: true, isCurrentUser: true },
  { id: 'lb-02', rank: 2, name: 'Caleb Smith', handle: '@caleb_buckets', avatar: 'CS', avatarColor: 'from-orange-500 to-red-500', impactScore: 11200, change: 1, verified: true },
  { id: 'lb-03', rank: 3, name: 'Marcus Thompson', handle: '@marcust_6ix', avatar: 'MT', avatarColor: 'from-emerald-500 to-cyan-500', impactScore: 9800, change: -1, verified: true },
  { id: 'lb-04', rank: 4, name: 'DunkCity', handle: '@dunkcity_to', avatar: 'DC', avatarColor: 'from-pink-500 to-purple-500', impactScore: 8340, change: 3, verified: false },
  { id: 'lb-05', rank: 5, name: 'CourtKing_99', handle: '@courtking_99', avatar: 'CK', avatarColor: 'from-yellow-500 to-orange-500', impactScore: 7120, change: -2, verified: false },
  { id: 'lb-06', rank: 6, name: 'SixMan', handle: '@sixman_hoops', avatar: 'SM', avatarColor: 'from-blue-500 to-indigo-500', impactScore: 6450, change: 0, verified: false },
  { id: 'lb-07', rank: 7, name: 'Rexdale Runs', handle: '@rexdale_runs', avatar: 'RR', avatarColor: 'from-red-500 to-rose-500', impactScore: 5890, change: 1, verified: false },
  { id: 'lb-08', rank: 8, name: 'NorthSide Ball', handle: '@northside_ball', avatar: 'NB', avatarColor: 'from-teal-500 to-green-500', impactScore: 5210, change: -1, verified: false },
  { id: 'lb-09', rank: 9, name: 'Jaylen Carter', handle: '@jcarter_uoft', avatar: 'JC', avatarColor: 'from-blue-600 to-blue-400', impactScore: 4980, change: 4, verified: true },
  { id: 'lb-10', rank: 10, name: 'Devon Ellis', handle: '@d_ellis_22', avatar: 'DE', avatarColor: 'from-amber-500 to-yellow-400', impactScore: 4720, change: 0, verified: false },
  { id: 'lb-11', rank: 11, name: 'Keon James', handle: '@kj_oakwood', avatar: 'KJ', avatarColor: 'from-violet-500 to-purple-400', impactScore: 4510, change: 2, verified: false },
  { id: 'lb-12', rank: 12, name: 'Ayo Williams', handle: '@ayo_birchmount', avatar: 'AW', avatarColor: 'from-rose-500 to-pink-500', impactScore: 4340, change: -3, verified: false },
  { id: 'lb-13', rank: 13, name: 'Xavier Brown', handle: '@xavi_hoops', avatar: 'XB', avatarColor: 'from-cyan-500 to-blue-500', impactScore: 4180, change: 1, verified: false },
  { id: 'lb-14', rank: 14, name: 'Dion Maxwell', handle: '@dmax_6ix', avatar: 'DM', avatarColor: 'from-green-500 to-emerald-500', impactScore: 3920, change: -1, verified: false },
  { id: 'lb-15', rank: 15, name: 'Tristan Cole', handle: '@tcole_ball', avatar: 'TC', avatarColor: 'from-slate-500 to-gray-600', impactScore: 3780, change: 0, verified: false },
  { id: 'lb-16', rank: 16, name: 'Jordan Reeves', handle: '@jreeves_23', avatar: 'JR', avatarColor: 'from-indigo-500 to-violet-500', impactScore: 3650, change: 5, verified: false },
  { id: 'lb-17', rank: 17, name: 'Andre Mitchell', handle: '@dre_mitch', avatar: 'AM', avatarColor: 'from-orange-400 to-amber-500', impactScore: 3490, change: -2, verified: false },
  { id: 'lb-18', rank: 18, name: 'Chris Okafor', handle: '@c_okafor', avatar: 'CO', avatarColor: 'from-lime-500 to-green-500', impactScore: 3320, change: 1, verified: false },
  { id: 'lb-19', rank: 19, name: 'Mark Daniels', handle: '@markd_to', avatar: 'MD', avatarColor: 'from-red-400 to-orange-500', impactScore: 3180, change: 0, verified: false },
  { id: 'lb-20', rank: 20, name: 'Elijah Park', handle: '@eli_park', avatar: 'EP', avatarColor: 'from-sky-500 to-cyan-400', impactScore: 3050, change: -1, verified: false },
  { id: 'lb-21', rank: 21, name: 'Ryan Okoro', handle: '@ryan_o', avatar: 'RO', avatarColor: 'from-fuchsia-500 to-pink-500', impactScore: 2920, change: 3, verified: false },
  { id: 'lb-22', rank: 22, name: 'Liam Tran', handle: '@liam_buckets', avatar: 'LT', avatarColor: 'from-emerald-400 to-teal-500', impactScore: 2810, change: -1, verified: false },
  { id: 'lb-23', rank: 23, name: 'Nathan Wells', handle: '@nwells_44', avatar: 'NW', avatarColor: 'from-blue-400 to-indigo-400', impactScore: 2690, change: 0, verified: false },
  { id: 'lb-24', rank: 24, name: 'Isaiah Ford', handle: '@isaiah_6ix', avatar: 'IF', avatarColor: 'from-purple-400 to-violet-500', impactScore: 2580, change: 2, verified: false },
  { id: 'lb-25', rank: 25, name: 'Derek Chung', handle: '@d_chung', avatar: 'DC', avatarColor: 'from-gray-500 to-slate-500', impactScore: 2470, change: -1, verified: false },
];

const CATEGORY_ICONS: Record<CategoryFilter, typeof Zap> = {
  Overall: Zap,
  Plays: Flame,
  Assists: Target,
  Courts: MapPin,
};

const MEDAL_STYLES = [
  { bg: 'bg-gradient-to-br from-amber-300 to-yellow-500', ring: 'ring-amber-200', shadow: 'shadow-[0_4px_20px_rgba(245,158,11,0.3)]', text: 'text-amber-700' },
  { bg: 'bg-gradient-to-br from-gray-200 to-slate-400', ring: 'ring-gray-200', shadow: 'shadow-[0_4px_20px_rgba(148,163,184,0.3)]', text: 'text-slate-600' },
  { bg: 'bg-gradient-to-br from-amber-600 to-orange-700', ring: 'ring-amber-300', shadow: 'shadow-[0_4px_20px_rgba(180,83,9,0.2)]', text: 'text-orange-800' },
];

export const LeaderboardPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Weekly');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Overall');

  const top3 = LEADERBOARD_DATA.slice(0, 3);
  const rest = LEADERBOARD_DATA.slice(3);

  const renderChangeIndicator = (change: number): React.ReactNode => {
    if (change > 0) {
      return (
        <span className="flex items-center gap-0.5 text-[11px] font-bold text-accent-emerald">
          <TrendingUp className="h-3 w-3" /> +{change}
        </span>
      );
    }
    if (change < 0) {
      return (
        <span className="flex items-center gap-0.5 text-[11px] font-bold text-accent-red">
          <TrendingDown className="h-3 w-3" /> {change}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-0.5 text-[11px] font-bold text-neutral-300">
        <Minus className="h-3 w-3" /> 0
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-void/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60">
              <ArrowLeft className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-neutral-900">Leaderboard</h1>
              <div className="flex h-6 w-6 items-center justify-center rounded-[8px] bg-lime">
                <Crown className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1">
            <Users className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-[11px] font-bold text-neutral-500">{LEADERBOARD_DATA.length} ballers</span>
          </div>
        </div>

        {/* Time filter */}
        <nav className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2">
          {TIME_FILTERS.map((filter) => {
            const isActive = timeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setTimeFilter(filter)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-xs transition-all duration-200',
                  isActive ? 'bg-lime font-black text-black' : 'font-bold text-neutral-400 hover:text-neutral-600'
                )}
              >
                {filter}
              </button>
            );
          })}
        </nav>

        {/* Category filter */}
        <nav className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-3">
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = categoryFilter === cat;
            const Icon = CATEGORY_ICONS[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all duration-200',
                  isActive ? 'border-lime bg-lime-dim font-bold text-lime-dark' : 'border-black/[0.06] font-medium text-neutral-400 hover:text-neutral-600'
                )}
              >
                <Icon className="h-3 w-3" />
                {cat}
              </button>
            );
          })}
        </nav>
      </motion.header>

      {/* Podium — Top 3 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="px-4 pt-6 pb-4"
      >
        <div className="flex items-end justify-center gap-3">
          {/* 2nd place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex flex-1 flex-col items-center"
          >
            <div className="relative mb-2">
              <div className={cn('flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-lg font-black text-white ring-3', top3[1].avatarColor, MEDAL_STYLES[1].ring, MEDAL_STYLES[1].shadow)}>
                {top3[1].avatar}
              </div>
              <div className={cn('absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black text-white', MEDAL_STYLES[1].bg)}>
                2
              </div>
            </div>
            <p className="text-xs font-bold text-neutral-900 text-center truncate max-w-full">{top3[1].name}</p>
            <p className="font-mono text-[11px] font-bold text-neutral-400">{formatNumber(top3[1].impactScore)}</p>
            <div className="mt-1">{renderChangeIndicator(top3[1].change)}</div>
            <div className={cn('mt-2 h-20 w-full rounded-t-[14px]', MEDAL_STYLES[1].bg, 'opacity-20')} />
          </motion.div>

          {/* 1st place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-1 flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="mb-1"
            >
              <Crown className="h-5 w-5 text-amber-400" strokeWidth={2.5} />
            </motion.div>
            <div className="relative mb-2">
              <div className={cn('flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-xl font-black text-white ring-4', top3[0].avatarColor, MEDAL_STYLES[0].ring, MEDAL_STYLES[0].shadow)}>
                {top3[0].avatar}
              </div>
              <div className={cn('absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white', MEDAL_STYLES[0].bg)}>
                1
              </div>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold text-neutral-900 text-center truncate">{top3[0].name}</p>
              {top3[0].verified && <CheckCircle className="h-3.5 w-3.5 shrink-0 text-lime-dark" fill="#C8FF00" />}
            </div>
            <p className="font-mono text-sm font-black text-lime-dark">{formatNumber(top3[0].impactScore)}</p>
            <div className="mt-1">{renderChangeIndicator(top3[0].change)}</div>
            <div className={cn('mt-2 h-28 w-full rounded-t-[14px]', MEDAL_STYLES[0].bg, 'opacity-20')} />
          </motion.div>

          {/* 3rd place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="flex flex-1 flex-col items-center"
          >
            <div className="relative mb-2">
              <div className={cn('flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-base font-black text-white ring-3', top3[2].avatarColor, MEDAL_STYLES[2].ring, MEDAL_STYLES[2].shadow)}>
                {top3[2].avatar}
              </div>
              <div className={cn('absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black text-white', MEDAL_STYLES[2].bg)}>
                3
              </div>
            </div>
            <p className="text-xs font-bold text-neutral-900 text-center truncate max-w-full">{top3[2].name}</p>
            <p className="font-mono text-[11px] font-bold text-neutral-400">{formatNumber(top3[2].impactScore)}</p>
            <div className="mt-1">{renderChangeIndicator(top3[2].change)}</div>
            <div className={cn('mt-2 h-14 w-full rounded-t-[14px]', MEDAL_STYLES[2].bg, 'opacity-20')} />
          </motion.div>
        </div>
      </motion.section>

      {/* Full Rankings */}
      <section className="px-4">
        <div className="rounded-[20px] border border-black/[0.06] bg-white overflow-hidden">
          {rest.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.03, duration: 0.25 }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 transition-colors',
                user.isCurrentUser && 'bg-lime/[0.06]',
                i < rest.length - 1 && 'border-b border-black/[0.04]'
              )}
            >
              {/* Rank */}
              <span className={cn(
                'w-7 shrink-0 text-center font-mono text-sm font-black',
                user.isCurrentUser ? 'text-lime-dark' : 'text-neutral-300'
              )}>
                {user.rank}
              </span>

              {/* Avatar */}
              <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-black text-white', user.avatarColor)}>
                {user.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn('text-sm font-bold truncate', user.isCurrentUser ? 'text-lime-dark' : 'text-neutral-900')}>
                    {user.name}
                  </span>
                  {user.verified && <CheckCircle className="h-3 w-3 shrink-0 text-lime-dark" fill="#C8FF00" />}
                  {user.isCurrentUser && (
                    <span className="shrink-0 rounded-full bg-lime px-2 py-0.5 text-[9px] font-black text-black">YOU</span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-400">{user.handle}</span>
              </div>

              {/* Score + Change */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-sm font-bold text-neutral-900">{formatNumber(user.impactScore)}</span>
                {renderChangeIndicator(user.change)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Your rank summary (sticky bottom card) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="fixed bottom-20 left-4 right-4 z-30 mx-auto max-w-xl"
      >
        <div className="rounded-[20px] border border-lime/30 bg-white/95 backdrop-blur-xl p-3 shadow-[0_-4px_20px_rgba(200,255,0,0.1)]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-lime">
              <Zap className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-neutral-900">Your Rank: <span className="text-lime-dark">#1</span></p>
              <p className="text-[10px] text-neutral-400">Top 1% of Toronto ballers</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-black text-lime-dark">{formatNumber(12400)}</p>
              <p className="text-[10px] text-neutral-400">Impact Score</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
