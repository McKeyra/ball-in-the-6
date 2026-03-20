'use client';

import { motion } from 'motion/react';
import { Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CrossSportComparison } from '@/types/intelligence';

const CATEGORY_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  offense: { bar: 'bg-accent-orange', bg: 'bg-accent-orange/[0.08]', text: 'text-accent-orange' },
  defense: { bar: 'bg-accent-blue', bg: 'bg-accent-blue/[0.08]', text: 'text-accent-blue' },
  athleticism: { bar: 'bg-accent-emerald', bg: 'bg-accent-emerald/[0.08]', text: 'text-accent-emerald' },
  playmaking: { bar: 'bg-accent-purple', bg: 'bg-accent-purple/[0.08]', text: 'text-accent-purple' },
  mentality: { bar: 'bg-accent-cyan', bg: 'bg-accent-cyan/[0.08]', text: 'text-accent-cyan' },
};

const SPORT_ICONS: Record<string, string> = {
  basketball: '\uD83C\uDFC0',
  football: '\uD83C\uDFC8',
  soccer: '\u26BD',
  baseball: '\u26BE',
  hockey: '\uD83C\uDFD2',
  tennis: '\uD83C\uDFBE',
};

function getSimilarity(athletes: CrossSportComparison['athletes']): number {
  if (athletes.length < 2) return 100;
  const scores = athletes.map(a => a.normalizedScore);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  return Math.round(100 - (max - min));
}

interface CrossSportCardProps {
  comparison: CrossSportComparison;
  index?: number;
}

export const CrossSportCard: React.FC<CrossSportCardProps> = ({ comparison, index = 0 }) => {
  const { trait, athletes } = comparison;
  const colors = CATEGORY_COLORS[trait.category] ?? CATEGORY_COLORS.offense;
  const similarity = getSimilarity(athletes);
  const maxScore = Math.max(...athletes.map(a => a.normalizedScore));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-[20px] border border-black/[0.06] bg-white p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className={cn('flex h-7 w-7 items-center justify-center rounded-xl', colors.bg)}>
              <Zap className={cn('h-3.5 w-3.5', colors.text)} />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-neutral-900 leading-tight">{trait.name}</h3>
              <p className="text-[10px] text-neutral-400 capitalize">{trait.category}</p>
            </div>
          </div>
        </div>

        {/* Similarity Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative h-11 w-11">
            <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
              <circle
                cx="18" cy="18" r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-neutral-100"
              />
              <motion.circle
                cx="18" cy="18" r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className={colors.text}
                strokeDasharray={`${(similarity / 100) * 88} 88`}
                initial={{ strokeDasharray: '0 88' }}
                animate={{ strokeDasharray: `${(similarity / 100) * 88} 88` }}
                transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: 'easeOut' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-neutral-800 font-mono">
              {similarity}
            </span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mt-0.5">SIM%</span>
        </div>
      </div>

      {/* Athlete Bars */}
      <div className="space-y-2.5">
        {athletes.map((athlete, i) => {
          const barPercent = (athlete.normalizedScore / maxScore) * 100;
          const sportEmoji = SPORT_ICONS[athlete.sportIcon] ?? '\uD83C\uDFC5';
          return (
            <div key={athlete.athleteId + i}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm leading-none">{sportEmoji}</span>
                  <span className="text-[11px] font-bold text-neutral-800 truncate">{athlete.name}</span>
                  <span className="text-[9px] text-neutral-400 font-mono shrink-0">{athlete.sport}</span>
                </div>
                <span className="text-[11px] font-mono font-black text-neutral-900 tabular-nums shrink-0 ml-2">
                  {athlete.normalizedScore}
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', colors.bar)}
                  initial={{ width: 0 }}
                  animate={{ width: `${barPercent}%` }}
                  transition={{ duration: 0.7, delay: index * 0.08 + 0.2 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] text-neutral-400 font-mono">{athlete.rawMetric}: {athlete.rawValue}</span>
                <span className="text-[9px] text-neutral-300 font-mono">n={athlete.sampleSize}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trait Description */}
      <div className="mt-3 pt-3 border-t border-neutral-100">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3 text-neutral-300" />
          <p className="text-[10px] text-neutral-400 leading-relaxed">{trait.description}</p>
        </div>
      </div>
    </motion.div>
  );
};
