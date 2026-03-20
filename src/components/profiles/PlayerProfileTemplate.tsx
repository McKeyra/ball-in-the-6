'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import type { PlayerProfile } from '@/types/profiles';
import { ProfileHeader } from './ProfileHeader';
import { StatGrid } from './StatGrid';
import {
  Trophy,
  Zap,
  Target,
  TrendingUp,
  Play,
  Users,
  Ruler,
  Hash,
} from 'lucide-react';

interface PlayerProfileTemplateProps {
  profile: PlayerProfile;
}

const SEASON_GAMES = [
  { opponent: 'Scarborough Elite', pts: 28, ast: 6, reb: 3, result: 'W' },
  { opponent: 'Northside Kings', pts: 22, ast: 8, reb: 5, result: 'W' },
  { opponent: 'East York Wolves', pts: 31, ast: 4, reb: 7, result: 'W' },
  { opponent: 'Rexdale Runs', pts: 18, ast: 11, reb: 2, result: 'L' },
  { opponent: 'SJPII Panthers', pts: 26, ast: 7, reb: 4, result: 'W' },
];

export const PlayerProfileTemplate: React.FC<PlayerProfileTemplateProps> = ({ profile }) => {
  const { tokens } = profile;

  return (
    <div className="min-h-screen bg-white pb-8">
      <ProfileHeader profile={profile} />

      <div className="mt-6 px-5 space-y-5">
        {/* Player info bar */}
        <motion.div
          className="flex items-center gap-2 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {[
            { icon: Target, label: profile.position },
            { icon: Hash, label: `#${profile.jerseyNumber}` },
            { icon: Ruler, label: profile.height },
            { icon: Users, label: profile.team },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold',
                  tokens.accentBg,
                  tokens.accentText,
                  'border',
                  tokens.accentBorder
                )}
              >
                <Icon className="h-3 w-3" />
                {item.label}
              </div>
            );
          })}
        </motion.div>

        {/* Core stats */}
        <StatGrid
          stats={[
            { label: 'PPG', value: profile.stats.ppg, icon: Zap, decimals: 1 },
            { label: 'APG', value: profile.stats.apg, icon: Target, decimals: 1 },
            { label: 'RPG', value: profile.stats.rpg, icon: TrendingUp, decimals: 1 },
          ]}
          accentText={tokens.accentText}
          accentBg={tokens.accentBg}
          accentBorder={tokens.accentBorder}
        />

        {/* Secondary stats */}
        <StatGrid
          stats={[
            { label: 'Games Played', value: profile.stats.gamesPlayed, icon: Trophy },
            { label: 'League Rank', value: profile.stats.rank, prefix: '#', icon: TrendingUp },
          ]}
          columns={2}
          accentText={tokens.accentText}
          accentBg={tokens.accentBg}
          accentBorder={tokens.accentBorder}
        />

        {/* 6-Impact Score */}
        <motion.div
          className={cn(
            'rounded-[20px] border p-4',
            tokens.accentBorder,
            tokens.accentBg
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
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
              animate={{ width: '89%' }}
              transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-neutral-500">
            Top 11% of all players in the 6ix
          </p>
        </motion.div>

        {/* Highlight reel placeholder */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Highlight Reel
          </p>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`highlight-${i}`}
                className="relative aspect-video rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br',
                    tokens.gradient,
                    'opacity-80'
                  )}>
                    <Play className="h-3 w-3 text-white ml-0.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team affiliation */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Team Affiliation
          </p>
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500'
            )}>
              <span className="text-lg font-black text-white">BT</span>
            </div>
            <div>
              <p className="text-sm font-black text-neutral-900">{profile.team}</p>
              <p className="text-xs text-neutral-500">{profile.position} &middot; #{profile.jerseyNumber} &middot; {profile.experience}</p>
            </div>
          </div>
        </motion.div>

        {/* Recent games */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Recent Games
          </p>
          <div className="space-y-2">
            {SEASON_GAMES.map((game, i) => (
              <motion.div
                key={game.opponent}
                className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-2.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.08, duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white',
                    game.result === 'W' ? 'bg-emerald-500' : 'bg-red-500'
                  )}>
                    {game.result}
                  </span>
                  <span className="text-xs font-bold text-neutral-700">vs {game.opponent}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-500">
                  <span>{game.pts} PTS</span>
                  <span>{game.ast} AST</span>
                  <span>{game.reb} REB</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
