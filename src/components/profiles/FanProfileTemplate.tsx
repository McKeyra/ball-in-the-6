'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import type { FanProfile } from '@/types/profiles';
import { ProfileHeader } from './ProfileHeader';
import { StatGrid } from './StatGrid';
import {
  Trophy,
  Heart,
  Ticket,
  Zap,
  TrendingUp,
  Award,
  Star,
  Target,
  Flame,
} from 'lucide-react';

interface FanProfileTemplateProps {
  profile: FanProfile;
}

const MOCK_BADGES = [
  { name: 'Season Ticket Holder', icon: Ticket, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { name: 'Die-Hard Fan', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
  { name: 'Game Day Regular', icon: Star, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Community MVP', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Streak Master', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'Top Contributor', icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const MOCK_ATTENDANCE = [
  { month: 'Jan', games: 6 },
  { month: 'Feb', games: 8 },
  { month: 'Mar', games: 5 },
  { month: 'Apr', games: 7 },
  { month: 'May', games: 4 },
  { month: 'Jun', games: 9 },
];

export const FanProfileTemplate: React.FC<FanProfileTemplateProps> = ({ profile }) => {
  const { tokens } = profile;
  const maxGames = Math.max(...MOCK_ATTENDANCE.map((m) => m.games));

  return (
    <div className="min-h-screen bg-white pb-8">
      <ProfileHeader profile={profile} />

      <div className="mt-6 px-5 space-y-5">
        {/* Stats grid */}
        <StatGrid
          stats={[
            { label: 'Games Attended', value: profile.stats.gamesAttended, icon: Ticket },
            { label: 'Impact Score', value: profile.stats.impactScore, icon: Trophy },
            { label: 'Assists Given', value: profile.stats.assistsGiven, icon: Zap },
          ]}
          accentText={tokens.accentText}
          accentBg={tokens.accentBg}
          accentBorder={tokens.accentBorder}
        />

        {/* Leaderboard rank */}
        <motion.div
          className={cn(
            'flex items-center justify-between rounded-[20px] border px-4 py-3',
            tokens.accentBorder,
            tokens.accentBg
          )}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className={cn('h-4 w-4', tokens.accentText)} />
            <span className="text-xs font-bold text-neutral-700">Fan Leaderboard</span>
          </div>
          <span className={cn('text-lg font-black', tokens.accentText)}>#14</span>
        </motion.div>

        {/* Favorite team */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Favorite Team
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700">
              <span className="text-lg font-black text-white">TR</span>
            </div>
            <div>
              <p className="text-sm font-black text-neutral-900">
                {profile.stats.favoriteTeam}
              </p>
              <p className="text-xs text-neutral-500">NBA</p>
            </div>
          </div>
        </motion.div>

        {/* Badges earned */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Badges Earned
          </p>
          <div className="grid grid-cols-3 gap-2">
            {MOCK_BADGES.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.name}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center',
                    badge.bg
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.08, duration: 0.3 }}
                >
                  <Icon className={cn('h-5 w-5', badge.color)} />
                  <span className="text-[9px] font-bold text-neutral-700 leading-tight">
                    {badge.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Game attendance chart */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-4">
            Attendance History
          </p>
          <div className="flex items-end justify-between gap-2 h-28">
            {MOCK_ATTENDANCE.map((month, i) => {
              const heightPercent = (month.games / maxGames) * 100;
              return (
                <div key={month.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-mono font-bold text-neutral-900">
                    {month.games}
                  </span>
                  <motion.div
                    className={cn(
                      'w-full rounded-lg bg-gradient-to-t',
                      tokens.gradient,
                      'opacity-80'
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay: 1.0 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                  />
                  <span className="text-[9px] font-mono text-neutral-400">{month.month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Impact score detail */}
        <motion.div
          className={cn(
            'rounded-[20px] border p-4',
            tokens.accentBorder,
            tokens.accentBg
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                6-Impact Score
              </p>
              <p className="mt-1 font-mono text-3xl font-black text-neutral-900">
                {formatNumber(profile.stats.impactScore)}
              </p>
            </div>
            <div className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br',
              tokens.gradient
            )}>
              <Trophy className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/50 overflow-hidden">
            <motion.div
              className={cn('h-full rounded-full bg-gradient-to-r', tokens.gradient)}
              initial={{ width: '0%' }}
              animate={{ width: '72%' }}
              transition={{ delay: 1.3, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-neutral-500">
            Top 28% of all fans in the 6ix
          </p>
        </motion.div>
      </div>
    </div>
  );
};
