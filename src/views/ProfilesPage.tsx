'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { PROFILE_TOKEN_PRESETS, type ProfileType } from '@/types/profiles';
import {
  FAN_PROFILE,
  PLAYER_PROFILE,
  TEAM_PROFILE,
  COACH_PROFILE,
  ORG_PROFILE,
  BIZ_PROFILE,
} from '@/lib/profile-data';
import { FanProfileTemplate } from '@/components/profiles/FanProfileTemplate';
import { PlayerProfileTemplate } from '@/components/profiles/PlayerProfileTemplate';
import { TeamProfileTemplate } from '@/components/profiles/TeamProfileTemplate';
import { CoachProfileTemplate } from '@/components/profiles/CoachProfileTemplate';
import { OrgProfileTemplate } from '@/components/profiles/OrgProfileTemplate';
import { BusinessProfileTemplate } from '@/components/profiles/BusinessProfileTemplate';

const PROFILE_TABS: { key: ProfileType; label: string }[] = [
  { key: 'fan', label: 'Fan' },
  { key: 'player', label: 'Player' },
  { key: 'team', label: 'Team' },
  { key: 'coach', label: 'Coach' },
  { key: 'organization', label: 'Org' },
  { key: 'business', label: 'Business' },
];

const renderProfileTemplate = (type: ProfileType): React.ReactNode => {
  switch (type) {
    case 'fan':
      return <FanProfileTemplate profile={FAN_PROFILE} />;
    case 'player':
      return <PlayerProfileTemplate profile={PLAYER_PROFILE} />;
    case 'team':
      return <TeamProfileTemplate profile={TEAM_PROFILE} />;
    case 'coach':
      return <CoachProfileTemplate profile={COACH_PROFILE} />;
    case 'organization':
      return <OrgProfileTemplate profile={ORG_PROFILE} />;
    case 'business':
      return <BusinessProfileTemplate profile={BIZ_PROFILE} />;
    default:
      return null;
  }
};

export const ProfilesPage: React.FC = () => {
  const [activeType, setActiveType] = useState<ProfileType>('player');

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60 px-4 pt-4 pb-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">Profile Templates</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {PROFILE_TABS.map((tab) => {
            const isActive = activeType === tab.key;
            const tokens = PROFILE_TOKEN_PRESETS[tab.key];
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveType(tab.key)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all relative',
                  isActive
                    ? cn(tokens.accentBg, tokens.accentText, 'font-black', tokens.accentBorder, 'border')
                    : 'bg-neutral-100/60 text-neutral-500'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-xl"
        >
          {renderProfileTemplate(activeType)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
