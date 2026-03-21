'use client';

import { cn } from '@/lib/utils';

interface ScoreStyle {
  min: number;
  bg: string;
  border: string;
  text: string;
  ring: string;
}

const SCORE_CONFIG: Record<string, ScoreStyle> = {
  gold: { min: 90, bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', ring: 'ring-yellow-500/30' },
  green: { min: 80, bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', ring: 'ring-green-500/30' },
  blue: { min: 70, bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', ring: 'ring-blue-500/30' },
  gray: { min: 0, bg: 'bg-slate-600/20', border: 'border-slate-600/50', text: 'text-slate-400', ring: 'ring-slate-500/30' },
};

const SIZE_MAP = {
  sm: { container: 'w-10 h-10', text: 'text-xs', label: 'text-[8px]' },
  md: { container: 'w-12 h-12', text: 'text-sm', label: 'text-[9px]' },
  lg: { container: 'w-16 h-16', text: 'text-lg', label: 'text-[10px]' },
} as const;

function getScoreConfig(score: number): ScoreStyle {
  if (score >= SCORE_CONFIG.gold.min) return SCORE_CONFIG.gold;
  if (score >= SCORE_CONFIG.green.min) return SCORE_CONFIG.green;
  if (score >= SCORE_CONFIG.blue.min) return SCORE_CONFIG.blue;
  return SCORE_CONFIG.gray;
}

interface VanceScoreBadgeProps {
  score?: number | null;
  size?: keyof typeof SIZE_MAP;
}

export function VanceScoreBadge({ score, size = 'md' }: VanceScoreBadgeProps): React.ReactElement {
  if (score === null || score === undefined) {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center rounded-full bg-slate-800 border border-slate-700',
        SIZE_MAP[size].container
      )}>
        <span className={cn('font-bold text-slate-500', SIZE_MAP[size].text)}>--</span>
        <span className={cn('text-slate-600', SIZE_MAP[size].label)}>VANCE</span>
      </div>
    );
  }

  const config = getScoreConfig(score);
  const sizeConfig = SIZE_MAP[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-full border ring-2 flex-shrink-0',
        config.bg,
        config.border,
        config.ring,
        sizeConfig.container
      )}
    >
      <span className={cn('font-bold leading-none', config.text, sizeConfig.text)}>
        {Math.round(score)}
      </span>
      <span className={cn('font-medium leading-none mt-0.5', config.text, sizeConfig.label)}>
        VANCE
      </span>
    </div>
  );
}
