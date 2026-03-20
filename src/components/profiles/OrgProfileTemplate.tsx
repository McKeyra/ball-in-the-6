'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import type { OrganizationProfile } from '@/types/profiles';
import { ProfileHeader } from './ProfileHeader';
import { StatGrid } from './StatGrid';
import {
  Trophy,
  Users,
  Calendar,
  Building2,
  Mail,
  Globe,
  TrendingUp,
  Layers,
} from 'lucide-react';

interface OrgProfileTemplateProps {
  profile: OrganizationProfile;
}

const UPCOMING_EVENTS = [
  { name: 'Summer Pro-Am Tipoff', date: 'Apr 12, 2026', location: 'Pan Am Centre', type: 'League Start' },
  { name: 'Youth Skills Showcase', date: 'Apr 19, 2026', location: 'Downsview Park', type: 'Camp' },
  { name: 'March Madness TO Finals', date: 'Mar 28, 2026', location: 'Scotiabank Arena', type: 'Tournament' },
  { name: 'Coaches Clinic', date: 'Apr 5, 2026', location: "L'Amoreaux Complex", type: 'Workshop' },
];

export const OrgProfileTemplate: React.FC<OrgProfileTemplateProps> = ({ profile }) => {
  const { tokens } = profile;

  return (
    <div className="min-h-screen bg-white pb-8">
      <ProfileHeader profile={profile} />

      <div className="mt-6 px-5 space-y-5">
        {/* Org type badge */}
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
            <Building2 className="h-3 w-3" />
            {profile.entityType.charAt(0).toUpperCase() + profile.entityType.slice(1)}
          </div>
        </motion.div>

        {/* Core stats */}
        <StatGrid
          stats={[
            { label: 'Active Programs', value: profile.stats.activePrograms, icon: Layers },
            { label: 'Total Players', value: profile.stats.totalPlayers, icon: Users },
            { label: 'Teams Managed', value: profile.stats.teamsManaged, icon: Trophy },
          ]}
          accentText={tokens.accentText}
          accentBg={tokens.accentBg}
          accentBorder={tokens.accentBorder}
        />

        {/* Events hosted stat */}
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
            <Calendar className={cn('h-4 w-4', tokens.accentText)} />
            <span className="text-xs font-bold text-neutral-700">Events Hosted</span>
          </div>
          <span className={cn('text-lg font-black font-mono', tokens.accentText)}>
            {profile.stats.eventsHosted}
          </span>
        </motion.div>

        {/* Programs / Leagues managed */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Programs
          </p>
          <div className="space-y-2">
            {profile.programs.map((program, i) => (
              <motion.div
                key={program.name}
                className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.08, duration: 0.3 }}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br',
                    tokens.gradient
                  )}>
                    <Layers className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800">{program.name}</p>
                    <p className="text-[10px] text-neutral-500">{program.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-black text-neutral-900">
                    {program.participants}
                  </p>
                  <p className="text-[9px] font-mono text-neutral-400">PLAYERS</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming events */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Upcoming Events
          </p>
          <div className="space-y-2">
            {UPCOMING_EVENTS.map((event, i) => (
              <motion.div
                key={event.name}
                className={cn(
                  'rounded-2xl border px-3 py-3',
                  tokens.accentBorder,
                  tokens.accentBg
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.08, duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-neutral-800">{event.name}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      {event.location} &middot; {event.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-neutral-600">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Member teams overview */}
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
                Member Teams
              </p>
              <p className="mt-1 font-mono text-3xl font-black text-neutral-900">
                {profile.stats.teamsManaged}
              </p>
            </div>
            <div className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br',
              tokens.gradient
            )}>
              <Users className="h-7 w-7 text-white" />
            </div>
          </div>
          <p className="mt-2 text-xs text-neutral-600">
            Across {profile.stats.activePrograms} active programs with{' '}
            {formatNumber(profile.stats.totalPlayers)} registered players
          </p>
        </motion.div>

        {/* Contact info */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Contact
          </p>
          <div className="space-y-2">
            {profile.links.map((link, i) => {
              const Icon = link.platform === 'email' ? Mail : Globe;
              return (
                <motion.a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-2.5 transition-colors hover:bg-neutral-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + i * 0.08, duration: 0.3 }}
                >
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-xl',
                    tokens.accentBg
                  )}>
                    <Icon className={cn('h-4 w-4', tokens.accentText)} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-700">{link.label}</p>
                    <p className="text-[10px] text-neutral-500 capitalize">{link.platform}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
