'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import type { BusinessProfile } from '@/types/profiles';
import { ProfileHeader } from './ProfileHeader';
import { StatGrid } from './StatGrid';
import {
  Star,
  MapPin,
  Clock,
  Tag,
  Users,
  Calendar,
  ShoppingBag,
  Megaphone,
  Heart,
  Percent,
} from 'lucide-react';

interface BusinessProfileTemplateProps {
  profile: BusinessProfile;
}

const SPONSORED_TEAMS = [
  { name: 'B.M.T. Titans', league: 'Toronto AAU League', since: '2022' },
  { name: 'Scarborough Elite', league: 'GTA Pro-Am', since: '2021' },
  { name: 'Malvern Youth Program', league: 'Community League', since: '2023' },
];

const PROMOTIONS = [
  { title: '20% Off Team Orders', description: 'Custom jerseys for 10+ players', code: 'TEAM20', active: true },
  { title: 'Game Day Special', description: 'Free shooting sleeve with $50+ purchase', code: 'GAMEDAY', active: true },
  { title: 'Student Discount', description: '15% off with valid student ID', code: 'STUDENT15', active: true },
];

export const BusinessProfileTemplate: React.FC<BusinessProfileTemplateProps> = ({ profile }) => {
  const { tokens } = profile;

  return (
    <div className="min-h-screen bg-white pb-8">
      <ProfileHeader profile={profile} />

      <div className="mt-6 px-5 space-y-5">
        {/* Category badge */}
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
            <ShoppingBag className="h-3 w-3" />
            {profile.category}
          </div>
        </motion.div>

        {/* Core stats */}
        <StatGrid
          stats={[
            { label: 'Active Sponsorships', value: profile.stats.sponsorships, icon: Heart },
            { label: 'Events Sponsored', value: profile.stats.eventsSponsored, icon: Calendar },
            { label: 'Community Reach', value: profile.stats.communityReach, icon: Users, suffix: '+' },
          ]}
          accentText={tokens.accentText}
          accentBg={tokens.accentBg}
          accentBorder={tokens.accentBorder}
        />

        {/* Rating */}
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
            <span className="text-xs font-bold text-neutral-700">Customer Rating</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`star-${i}`}
                  className={cn(
                    'h-3.5 w-3.5',
                    i < Math.floor(profile.stats.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-neutral-300'
                  )}
                />
              ))}
            </div>
            <span className={cn('text-sm font-black font-mono', tokens.accentText)}>
              {profile.stats.rating}
            </span>
          </div>
        </motion.div>

        {/* Products / Services */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Products & Services
          </p>
          <div className="grid grid-cols-2 gap-2">
            {profile.offerings.map((offering, i) => (
              <motion.div
                key={offering}
                className={cn(
                  'flex items-center gap-2 rounded-2xl border px-3 py-2.5',
                  tokens.accentBorder,
                  tokens.accentBg
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.06, duration: 0.3 }}
              >
                <Tag className={cn('h-3.5 w-3.5 shrink-0', tokens.accentText)} />
                <span className="text-xs font-bold text-neutral-700">{offering}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Location & Hours */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Location & Hours
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl shrink-0',
                tokens.accentBg
              )}>
                <MapPin className={cn('h-4 w-4', tokens.accentText)} />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-800">Address</p>
                <p className="text-xs text-neutral-600 mt-0.5">{profile.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl shrink-0',
                tokens.accentBg
              )}>
                <Clock className={cn('h-4 w-4', tokens.accentText)} />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-800">Hours</p>
                <p className="text-xs text-neutral-600 mt-0.5">{profile.hours}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active promotions */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className={cn('h-4 w-4', tokens.accentText)} />
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Active Promotions
            </p>
          </div>
          <div className="space-y-2">
            {PROMOTIONS.map((promo, i) => (
              <motion.div
                key={promo.code}
                className={cn(
                  'rounded-2xl border px-3 py-3',
                  tokens.accentBorder,
                  tokens.accentBg
                )}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.08, duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-neutral-800">{promo.title}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{promo.description}</p>
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 rounded-full px-2.5 py-1 border',
                    'bg-white',
                    tokens.accentBorder
                  )}>
                    <Percent className={cn('h-3 w-3', tokens.accentText)} />
                    <span className={cn('font-mono text-[10px] font-black', tokens.accentText)}>
                      {promo.code}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sponsored teams */}
        <motion.div
          className="rounded-[20px] border border-black/[0.06] bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">
            Sponsored Teams
          </p>
          <div className="space-y-2">
            {SPONSORED_TEAMS.map((team, i) => {
              const initials = team.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2);
              return (
                <motion.div
                  key={team.name}
                  className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-2.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + i * 0.08, duration: 0.3 }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br',
                      tokens.gradient
                    )}>
                      <span className="text-[10px] font-black text-white">{initials}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800">{team.name}</p>
                      <p className="text-[10px] text-neutral-500">{team.league}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">Since {team.since}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Community reach */}
        <motion.div
          className={cn(
            'rounded-[20px] border p-4',
            tokens.accentBorder,
            tokens.accentBg
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                Community Reach
              </p>
              <p className="mt-1 font-mono text-3xl font-black text-neutral-900">
                {formatNumber(profile.stats.communityReach)}+
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
            People reached through sponsorships, events, and community programs across the GTA
          </p>
        </motion.div>
      </div>
    </div>
  );
};
