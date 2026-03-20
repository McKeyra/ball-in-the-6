'use client';

import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, Star, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AthleteIntelligence } from '@/types/intelligence';

const SPORT_ICONS: Record<string, string> = {
  basketball: '\uD83C\uDFC0',
  football: '\uD83C\uDFC8',
  soccer: '\u26BD',
  baseball: '\u26BE',
  hockey: '\uD83C\uDFD2',
  tennis: '\uD83C\uDFBE',
};

const DIMENSION_LABELS: { key: keyof AthleteIntelligence['sixDimensions']; label: string; color: string }[] = [
  { key: 'intuition', label: 'Intuition', color: '#a855f7' },
  { key: 'intelligence', label: 'Intelligence', color: '#3b82f6' },
  { key: 'impact', label: 'Impact', color: '#c8ff00' },
  { key: 'innovation', label: 'Innovation', color: '#f97316' },
  { key: 'integration', label: 'Integration', color: '#10b981' },
  { key: 'iteration', label: 'Iteration', color: '#06b6d4' },
];

const TREND_ICONS: Record<string, React.FC<{ className?: string }>> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const TREND_COLORS: Record<string, string> = {
  up: 'text-accent-emerald',
  down: 'text-accent-red',
  stable: 'text-neutral-400',
};

function buildHexagonPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
}

function buildDataPoints(cx: number, cy: number, r: number, values: number[]): string {
  return values
    .map((v, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const dist = (v / 100) * r;
      return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
    })
    .join(' ');
}

interface AthleteIntelCardProps {
  athlete: AthleteIntelligence;
  index?: number;
}

export const AthleteIntelCard: React.FC<AthleteIntelCardProps> = ({ athlete, index = 0 }) => {
  const sportEmoji = SPORT_ICONS[athlete.sportIcon] ?? '\uD83C\uDFC5';
  const dimValues = DIMENSION_LABELS.map(d => athlete.sixDimensions[d.key]);
  const cx = 80;
  const cy = 80;
  const maxR = 60;

  const impactColor = athlete.impactScore >= 90 ? 'text-lime-dark' : athlete.impactScore >= 80 ? 'text-accent-blue' : 'text-neutral-600';
  const impactBg = athlete.impactScore >= 90 ? 'bg-lime/[0.1] border-lime/[0.2]' : athlete.impactScore >= 80 ? 'bg-accent-blue/[0.08] border-accent-blue/[0.15]' : 'bg-neutral-100 border-neutral-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-[20px] border border-black/[0.06] bg-white p-4"
    >
      {/* Header with Impact Score */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-50 border border-neutral-100 text-xl">
            {sportEmoji}
          </div>
          <div>
            <h3 className="text-[15px] font-black text-neutral-900">{athlete.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono text-neutral-500">{athlete.position}</span>
              <span className="text-neutral-300">&middot;</span>
              <span className="text-[10px] text-neutral-400">{athlete.team}</span>
            </div>
          </div>
        </div>

        {/* 6-Impact Score */}
        <div className={cn('flex flex-col items-center px-3 py-2 rounded-2xl border', impactBg)}>
          <span className={cn('text-xl font-black font-mono tabular-nums', impactColor)}>
            {athlete.impactScore}
          </span>
          <span className="text-[7px] font-black uppercase tracking-[0.15em] text-neutral-400 mt-[-1px]">6-Impact</span>
        </div>
      </div>

      {/* Hexagonal Radar Chart */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Grid rings */}
            {[0.25, 0.5, 0.75, 1].map((scale) => (
              <polygon
                key={scale}
                points={buildHexagonPoints(cx, cy, maxR * scale)}
                fill="none"
                stroke="#e5e5e5"
                strokeWidth={scale === 1 ? 1 : 0.5}
                opacity={scale === 1 ? 0.8 : 0.5}
              />
            ))}

            {/* Axis lines */}
            {DIMENSION_LABELS.map((_, i) => {
              const angle = (Math.PI / 3) * i - Math.PI / 2;
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={cx + maxR * Math.cos(angle)}
                  y2={cy + maxR * Math.sin(angle)}
                  stroke="#e5e5e5"
                  strokeWidth={0.5}
                />
              );
            })}

            {/* Data polygon */}
            <motion.polygon
              points={buildDataPoints(cx, cy, maxR, dimValues)}
              fill="rgba(200, 255, 0, 0.12)"
              stroke="#3d6b00"
              strokeWidth={1.5}
              strokeLinejoin="round"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />

            {/* Data points */}
            {dimValues.map((v, i) => {
              const angle = (Math.PI / 3) * i - Math.PI / 2;
              const dist = (v / 100) * maxR;
              const px = cx + dist * Math.cos(angle);
              const py = cy + dist * Math.sin(angle);
              return (
                <motion.circle
                  key={i}
                  cx={px}
                  cy={py}
                  r={3}
                  fill={DIMENSION_LABELS[i].color}
                  stroke="white"
                  strokeWidth={1.5}
                  initial={{ opacity: 0, r: 0 }}
                  animate={{ opacity: 1, r: 3 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.5 + i * 0.05 }}
                />
              );
            })}

            {/* Dimension labels */}
            {DIMENSION_LABELS.map((dim, i) => {
              const angle = (Math.PI / 3) * i - Math.PI / 2;
              const labelR = maxR + 14;
              const lx = cx + labelR * Math.cos(angle);
              const ly = cy + labelR * Math.sin(angle);
              return (
                <text
                  key={dim.key}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[7px] font-bold uppercase fill-neutral-400"
                  style={{ letterSpacing: '0.05em' }}
                >
                  {dim.label.slice(0, 3).toUpperCase()}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Dimension Scores */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {DIMENSION_LABELS.map((dim, i) => (
          <motion.div
            key={dim.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.4 + i * 0.05 }}
            className="flex items-center gap-1.5 rounded-xl bg-neutral-50 px-2 py-1.5"
          >
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dim.color }} />
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-wider text-neutral-400 truncate">{dim.label}</p>
              <p className="text-[12px] font-black font-mono tabular-nums text-neutral-800">{dimValues[i]}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trait Bars */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 mb-1">
          <Target className="h-3 w-3 text-neutral-300" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Trait Scores</span>
        </div>
        {athlete.traits.map((trait, i) => {
          const TrendIcon = TREND_ICONS[trait.trend];
          return (
            <div key={trait.traitId}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[11px] font-semibold text-neutral-700">{trait.traitName}</span>
                <div className="flex items-center gap-1.5">
                  <TrendIcon className={cn('h-3 w-3', TREND_COLORS[trait.trend])} />
                  <span className="text-[10px] font-mono font-bold tabular-nums text-neutral-800">{trait.score}</span>
                  <span className="text-[9px] font-mono text-neutral-400">P{trait.percentile}</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-lime-dark/60 to-lime-dark"
                  initial={{ width: 0 }}
                  animate={{ width: `${trait.score}%` }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 + i * 0.12, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Star className="h-3 w-3 text-lime-dark" />
          <span className="text-[10px] font-bold text-neutral-500">{athlete.sport}</span>
        </div>
        <span className="text-[9px] font-mono text-neutral-300">{athlete.traits.length} traits analyzed</span>
      </div>
    </motion.div>
  );
};
