'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import type { AnyProfile } from '@/types/profiles';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Flame,
  UserPlus,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

interface ProfileHeaderProps {
  profile: AnyProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const { tokens } = profile;
  const initials = profile.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const joinDate = new Date(profile.joinedDate).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const streak =
    'stats' in profile && 'streak' in profile.stats
      ? (profile.stats as { streak?: number }).streak
      : undefined;

  return (
    <div className="relative">
      {/* Banner gradient */}
      <motion.div
        className="relative h-40 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r',
            tokens.gradient
          )}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />

        {/* Profile type badge */}
        <motion.div
          className={cn(
            'absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3 py-1 backdrop-blur-md',
            tokens.accentBg,
            'border',
            tokens.accentBorder
          )}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span className={cn('text-xs font-black', tokens.accentText)}>
            {tokens.badgeLabel}
          </span>
        </motion.div>
      </motion.div>

      {/* Profile info */}
      <div className="px-5">
        {/* Avatar */}
        <motion.div
          className={cn(
            'relative -mt-14 flex h-28 w-28 items-center justify-center rounded-[20px] border-4 border-white bg-gradient-to-br',
            tokens.gradient,
            tokens.avatarGlow
          )}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <span className="text-3xl font-black text-white/90 select-none">
            {initials}
          </span>
          {/* Online status */}
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-3 border-white bg-emerald-400" />
        </motion.div>

        {/* Name & handle */}
        <motion.div
          className="mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-900 tracking-tight">
              {profile.displayName}
            </h1>
            {profile.verified && (
              <ShieldCheck className="h-5 w-5 text-[#c8ff00]" />
            )}
          </div>
          <p className="text-sm font-mono text-neutral-500">{profile.handle}</p>
        </motion.div>

        {/* Bio */}
        <motion.p
          className="mt-2 text-sm text-neutral-700 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {profile.bio}
        </motion.p>

        {/* Meta info row */}
        <motion.div
          className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {profile.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Joined {joinDate}
          </span>
          {streak !== undefined && streak > 0 && (
            <span className="flex items-center gap-1 text-orange-400">
              <Flame className="h-3 w-3" />
              {streak} day streak
            </span>
          )}
        </motion.div>

        {/* Followers / Following */}
        <motion.div
          className="mt-4 flex items-center gap-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <span>
            <span className="font-black text-neutral-900">
              {formatNumber(profile.following)}
            </span>{' '}
            <span className="text-neutral-500">Following</span>
          </span>
          <span>
            <span className="font-black text-neutral-900">
              {formatNumber(profile.followers)}
            </span>{' '}
            <span className="text-neutral-500">Followers</span>
          </span>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="mt-4 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <button
            type="button"
            className={cn(
              'flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold text-white transition-all active:scale-95 bg-gradient-to-r',
              tokens.gradient
            )}
          >
            <UserPlus className="h-4 w-4" />
            Follow
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-bold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </button>
        </motion.div>

        {/* Links */}
        {profile.links.length > 0 && (
          <motion.div
            className="mt-3 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            {profile.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  tokens.accentBg,
                  tokens.accentText,
                  'hover:opacity-80'
                )}
              >
                <ExternalLink className="h-3 w-3" />
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
