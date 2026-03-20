'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { formatNumber, getWinPercent } from '@/lib/utils';
import type { TeamProfile } from '@/types/profiles';
import { ProfileHeader } from './ProfileHeader';
import { StatGrid } from './StatGrid';
import {
  Trophy,
  Users,
  Medal,
  TrendingUp,
  Calendar,
  MapPin,
  Shield,
} from 'lucide-react';

interface TeamProfileTemplateProps {
  profile: TeamProfile;
}

const UPCOMING_GAMES = [
  { opponent: 'Northside Kings', date: 'Mar 22', time: '7:00 PM', venue: 'Pan Am Centre' },
  { opponent: 'East York Wolves', date: 'Mar 25', time: '6:30 PM', venue: 'Downsview Park' },
  { opponent: 'SJPII Panthers', date: 'Mar 29', time: '8:00 PM', venue: 'Pan Am Centre' },
];

const COACHING_STAFF = [
  { name: 'Coach Dwayne Mitchell', role: 'Head Coach' },
  { name: 'Andre Thomas', role: 'Assistant Coach' },
  { name: 'Sarah Williams', role: 'Trainer' },
];

export const TeamProfileTemplate: React.FC<TeamProfileTemplateProps> = ({ profile }) => {
  const { tokens } = profile;
  const winPct = getWinPercent(profile.stats.wins, profile.stats.losses);

  return (
    <div className="min-h-screen bg-white pb-8">
      <ProfileHeader profile={profile} />

      <div className="mt-6 px-5 space-y-5">
        {/* Team info badges */}
        <motion.div
          className="flex items-center gap-2 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {[
            { icon: Shield, label: profile.league },
            { icon: Trophy, label: profile.division },
            { icon: MapPin, label: profile.homeCourt },
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

        {/* Record card */}
        <motion.div
          className={cn(
            'rounded-[20px] border p-5',
            tokens.accentBorder,
            tokens.accentBg
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Season Record
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-4xl font-black text-neutral-900">
                {profile.stats.wins}
              </span>
              <span className="text-lg text-neutral-400">-</span>
              <span className="font-mono text-4xl font-black text-neutral-900">
                {profile.stats.losses}
              </span>
            </div>
            <div className="text-right">
              <p className={cn('font-mono text-2xl font-black', tokens.accentText)}>
                {winPct}%
              </p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                Win Rate
              </p>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/60 overflow-hidden">
            <motion.div
              className={cn('h-full rounded-full bg-gradient-to-r', tokens.gradient)}
              initial={{ width: '0%' }}
              animate={{ width: `${winPct}%` }}
              transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Team stats */}
        <StatGrid
          stats={[
            { label: 'Roster Size', value: profile.stats.rosterSize, icon: Users },
            { label: 'Championships', value: profile.stats.championships, icon: Medal },
            { label: 'Impact Score', value: profile.stats.impactScore, icon: TrendingUp },
          ]}
          accentText={tokens.accentText}
          accentBg={tokens.accentBg}
          accentBorder={tokens.accentBorder}
        />

        {/* Roster */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Roster
            </p>
            <span className={cn('text-xs font-bold', tokens.accentText)}>
              {profile.roster.length} Players
            </span>
          </div>
          <div className="space-y-1.5">
            {profile.roster.map((player, i) => {
              const initials = player.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2);
              return (
                <motion.div
                  key={player.name}
                  className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.04, duration: 0.3 }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-[10px] font-black text-white',
                      tokens.gradient
                    )}>
                      {initials}
                    </div>
                    <span className="text-xs font-bold text-neutral-800">{player.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-neutral-500">#{player.number}</span>
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold',
                      tokens.accentBg,
                      tokens.accentText
                    )}>
                      {player.position}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming games */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Upcoming Games
          </p>
          <div className="space-y-2">
            {UPCOMING_GAMES.map((game, i) => (
              <motion.div
                key={game.opponent}
                className={cn(
                  'flex items-center justify-between rounded-2xl border px-3 py-3',
                  tokens.accentBorder,
                  tokens.accentBg
                )}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.3 }}
              >
                <div>
                  <p className="text-xs font-bold text-neutral-800">vs {game.opponent}</p>
                  <p className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-2.5 w-2.5" />
                    {game.venue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {game.date}
                  </p>
                  <p className="text-[10px] text-neutral-500">{game.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coaching staff */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Coaching Staff
          </p>
          <div className="space-y-2">
            {COACHING_STAFF.map((staff, i) => {
              const initials = staff.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2);
              return (
                <motion.div
                  key={staff.name}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-2.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.08, duration: 0.3 }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                    <span className="text-xs font-black text-emerald-500">{initials}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800">{staff.name}</p>
                    <p className="text-[10px] text-neutral-500">{staff.role}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
