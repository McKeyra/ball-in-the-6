'use client';

import { motion } from 'motion/react';
import {
  DollarSign,
  Gamepad2,
  Search,
  ClipboardList,
  Heart,
  ShieldCheck,
  Tv,
  Grid3X3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StakeholderWeight, AthleteIntelligence } from '@/types/intelligence';

const STAKEHOLDER_COLUMNS = [
  { key: 'betting' as const, label: 'Betting', icon: DollarSign, color: 'text-accent-orange' },
  { key: 'fantasy' as const, label: 'Fantasy', icon: Gamepad2, color: 'text-accent-purple' },
  { key: 'scouting' as const, label: 'Scout', icon: Search, color: 'text-accent-blue' },
  { key: 'coaching' as const, label: 'Coach', icon: ClipboardList, color: 'text-accent-emerald' },
  { key: 'fan' as const, label: 'Fan', icon: Heart, color: 'text-accent-pink' },
  { key: 'parental' as const, label: 'Parent', icon: ShieldCheck, color: 'text-accent-cyan' },
  { key: 'media' as const, label: 'Media', icon: Tv, color: 'text-accent-red' },
];

function getCellColor(value: number): string {
  if (value >= 0.9) return 'bg-lime/[0.25] text-lime-dark';
  if (value >= 0.8) return 'bg-lime/[0.15] text-lime-dark';
  if (value >= 0.7) return 'bg-accent-emerald/[0.12] text-accent-emerald';
  if (value >= 0.6) return 'bg-accent-blue/[0.10] text-accent-blue';
  if (value >= 0.5) return 'bg-accent-purple/[0.08] text-accent-purple';
  if (value >= 0.4) return 'bg-neutral-100 text-neutral-500';
  return 'bg-neutral-50 text-neutral-400';
}

function getCellIntensity(value: number): number {
  return Math.round(value * 100);
}

interface StakeholderMatrixProps {
  weights: StakeholderWeight[];
  athlete: AthleteIntelligence;
}

export const StakeholderMatrix: React.FC<StakeholderMatrixProps> = ({ weights, athlete }) => {
  const maxWeight = Math.max(
    ...weights.flatMap(w =>
      STAKEHOLDER_COLUMNS.map(col => w[col.key])
    )
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-purple/[0.08]">
            <Grid3X3 className="h-3.5 w-3.5 text-accent-purple" />
          </div>
          <div>
            <h2 className="text-[13px] font-black text-neutral-900">Stakeholder Priority Matrix</h2>
            <p className="text-[10px] text-neutral-400">How each perspective weights athletic categories</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Legend:</span>
          {[
            { label: '90+', cls: 'bg-lime/[0.25]' },
            { label: '80+', cls: 'bg-lime/[0.15]' },
            { label: '70+', cls: 'bg-accent-emerald/[0.12]' },
            { label: '60+', cls: 'bg-accent-blue/[0.10]' },
            { label: '<60', cls: 'bg-neutral-100' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1">
              <div className={cn('h-3 w-3 rounded', item.cls)} />
              <span className="text-[8px] font-mono text-neutral-400">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Athlete Context */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-[20px] border border-lime/[0.08] bg-lime/[0.02] p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Analyzing</span>
            <h3 className="text-[14px] font-black text-neutral-900 mt-0.5">{athlete.name}</h3>
            <p className="text-[10px] text-neutral-500 font-mono">{athlete.position} &middot; {athlete.team} &middot; 6-Impact: {athlete.impactScore}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime/[0.1] border border-lime/[0.15]">
            <span className="text-[14px] font-black font-mono text-lime-dark">{athlete.impactScore}</span>
          </div>
        </div>
      </motion.div>

      {/* Matrix Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-4 overflow-x-auto"
      >
        {/* Column Headers */}
        <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
          <div /> {/* Empty corner */}
          {STAKEHOLDER_COLUMNS.map((col) => {
            const Icon = col.icon;
            return (
              <div key={col.key} className="flex flex-col items-center gap-0.5 px-1">
                <Icon className={cn('h-3.5 w-3.5', col.color)} />
                <span className="text-[7px] font-bold uppercase tracking-wider text-neutral-400 text-center leading-tight">
                  {col.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Matrix Rows */}
        <div className="space-y-1">
          {weights.map((row, rowIndex) => (
            <motion.div
              key={row.category}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.25 + rowIndex * 0.06 }}
              className="grid gap-1 items-center"
              style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}
            >
              {/* Row Label */}
              <div className="pr-2">
                <span className="text-[10px] font-bold text-neutral-700 leading-tight">{row.category}</span>
              </div>

              {/* Cells */}
              {STAKEHOLDER_COLUMNS.map((col, colIndex) => {
                const value = row[col.key];
                const intensity = getCellIntensity(value);
                return (
                  <motion.div
                    key={col.key}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + rowIndex * 0.06 + colIndex * 0.03 }}
                    className={cn(
                      'flex items-center justify-center rounded-lg py-2 min-h-[32px] cursor-default transition-transform hover:scale-105',
                      getCellColor(value)
                    )}
                    title={`${row.category} - ${col.label}: ${intensity}%`}
                  >
                    <span className="text-[10px] font-black font-mono tabular-nums">
                      {intensity}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stakeholder Insights */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-4"
      >
        <h3 className="text-[12px] font-black text-neutral-900 mb-3">Perspective Summaries</h3>
        <div className="grid grid-cols-2 gap-2">
          {STAKEHOLDER_COLUMNS.map((col, i) => {
            const Icon = col.icon;
            const colValues = weights.map(w => w[col.key]);
            const avgWeight = colValues.reduce((s, v) => s + v, 0) / colValues.length;
            const topCategory = weights.reduce((best, w) =>
              w[col.key] > (best?.[col.key] ?? 0) ? w : best
            , weights[0]);

            return (
              <motion.div
                key={col.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.45 + i * 0.05 }}
                className="rounded-xl bg-neutral-50 border border-neutral-100 p-2.5"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={cn('h-3 w-3', col.color)} />
                  <span className="text-[10px] font-bold text-neutral-700">{col.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[14px] font-black font-mono tabular-nums text-neutral-900">
                    {Math.round(avgWeight * 100)}
                  </span>
                  <span className="text-[8px] font-bold text-neutral-400">AVG</span>
                </div>
                <p className="text-[9px] text-neutral-400 mt-0.5 leading-tight">
                  Top: {topCategory.category}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
