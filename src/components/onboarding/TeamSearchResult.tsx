'use client';

import { motion } from 'motion/react';
import { MapPin, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TeamResult {
  id: string;
  name: string;
  sport: string;
  coachName: string;
  memberCount: number;
  location: string;
}

interface TeamSearchResultProps {
  team: TeamResult;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index?: number;
}

export const TeamSearchResult: React.FC<TeamSearchResultProps> = ({
  team,
  isSelected,
  onSelect,
  index = 0,
}) => {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      onClick={() => onSelect(team.id)}
      className={cn(
        'flex w-full items-center gap-4 rounded-[20px] border-2 p-4 text-left transition-all duration-200',
        isSelected
          ? 'border-lime bg-lime/10 shadow-[0_0_20px_rgba(200,255,0,0.15)]'
          : 'border-black/[0.06] bg-white hover:border-black/[0.12] hover:bg-neutral-50',
      )}
    >
      {/* Sport badge */}
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-xs font-black uppercase font-[family-name:var(--font-mono)] transition-colors',
          isSelected ? 'bg-lime text-black' : 'bg-surface text-neutral-400',
        )}
      >
        {team.sport.slice(0, 3)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-neutral-900 truncate">{team.name}</p>
        <p className="mt-0.5 text-xs text-neutral-500">Coach {team.coachName}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
            <Users className="h-3 w-3" strokeWidth={2} />
            {team.memberCount} players
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
            <MapPin className="h-3 w-3" strokeWidth={2} />
            {team.location}
          </span>
        </div>
      </div>

      {/* Select indicator */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all',
          isSelected ? 'border-lime bg-lime' : 'border-neutral-200 bg-white',
        )}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 400 }}
          >
            <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};
