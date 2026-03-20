'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { getWinPercent } from '@/lib/utils';
import type { CoachProfile } from '@/types/profiles';
import { ProfileHeader } from './ProfileHeader';
import { StatGrid } from './StatGrid';
import {
  Trophy,
  Users,
  Star,
  Clock,
  Award,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Quote,
} from 'lucide-react';

interface CoachProfileTemplateProps {
  profile: CoachProfile;
}

const TEAMS_COACHED = [
  { name: 'B.M.T. Titans', years: '2020-Present', role: 'Head Coach', record: '142-38' },
  { name: 'Scarborough Elite U16', years: '2016-2020', role: 'Head Coach', record: '98-32' },
  { name: 'Malvern Youth Program', years: '2011-2016', role: 'Assistant Coach', record: '72-24' },
];

const PLAYER_DEV_STATS = [
  { label: 'D1 Commitments', value: 12 },
  { label: 'Provincial Team Selections', value: 8 },
  { label: 'Scholarship Recipients', value: 15 },
  { label: 'All-Star Selections', value: 24 },
];

export const CoachProfileTemplate: React.FC<CoachProfileTemplateProps> = ({ profile }) => {
  const { tokens } = profile;
  const winPct = getWinPercent(profile.stats.wins, profile.stats.losses);

  return (
    <div className="min-h-screen bg-white pb-8">
      <ProfileHeader profile={profile} />

      <div className="mt-6 px-5 space-y-5">
        {/* Specialty badge */}
        <motion.div
          className="flex items-center gap-2 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border',
            tokens.accentBg, tokens.accentText, tokens.accentBorder
          )}>
            <BookOpen className="h-3 w-3" />
            {profile.specialty}
          </div>
          <div className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border',
            tokens.accentBg, tokens.accentText, tokens.accentBorder
          )}>
            <Users className="h-3 w-3" />
            {profile.currentTeam}
          </div>
        </motion.div>

        {/* Career record */}
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
            Career Record
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

        {/* Core stats */}
        <StatGrid
          stats={[
            { label: 'Players Coached', value: profile.stats.playersCoached, icon: Users },
            { label: 'Programs Run', value: profile.stats.programsRun, icon: Trophy },
            { label: 'Years Experience', value: profile.stats.yearsExperience, icon: Clock },
          ]}
          accentText={tokens.accentText}
          accentBg={tokens.accentBg}
          accentBorder={tokens.accentBorder}
        />

        {/* Coach rating */}
        <motion.div
          className={cn(
            'flex items-center justify-between rounded-[20px] border px-4 py-3',
            tokens.accentBorder,
            tokens.accentBg
          )}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <Star className={cn('h-4 w-4', tokens.accentText)} />
            <span className="text-xs font-bold text-neutral-700">Community Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={cn('text-lg font-black', tokens.accentText)}>
              {profile.stats.rating}
            </span>
            <span className="text-xs text-neutral-500">/ 5.0</span>
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Certifications
          </p>
          <div className="space-y-2">
            {profile.certifications.map((cert, i) => (
              <motion.div
                key={cert}
                className="flex items-center gap-2.5 rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-2.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.06, duration: 0.3 }}
              >
                <div className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg',
                  tokens.accentBg
                )}>
                  <CheckCircle className={cn('h-3.5 w-3.5', tokens.accentText)} />
                </div>
                <span className="text-xs font-bold text-neutral-700">{cert}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coaching philosophy */}
        <motion.div
          className={cn(
            'rounded-[20px] border p-4',
            tokens.accentBorder,
            tokens.accentBg
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Coaching Philosophy
          </p>
          <div className="flex gap-3">
            <Quote className={cn('h-5 w-5 shrink-0 mt-0.5', tokens.accentText)} />
            <p className="text-sm text-neutral-700 leading-relaxed italic">
              Defence builds character. Every player who comes through my program leaves as a better person,
              not just a better basketball player. We develop leaders on and off the court.
              Hard work, discipline, and respect for the game — that is the foundation.
            </p>
          </div>
        </motion.div>

        {/* Teams coached history */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Teams Coached
          </p>
          <div className="space-y-2">
            {TEAMS_COACHED.map((team, i) => (
              <motion.div
                key={team.name}
                className="rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.08, duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-neutral-800">{team.name}</p>
                  <span className="font-mono text-[10px] text-neutral-500">{team.record}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-neutral-500">
                  <span>{team.role}</span>
                  <span>&middot;</span>
                  <span>{team.years}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Player development stats */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Player Development
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PLAYER_DEV_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className={cn(
                  'rounded-2xl border p-3 text-center',
                  tokens.accentBorder,
                  tokens.accentBg
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.08, duration: 0.3 }}
              >
                <p className="font-mono text-xl font-black text-neutral-900">{stat.value}</p>
                <p className="mt-0.5 text-[8px] font-mono uppercase tracking-widest text-neutral-500">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
