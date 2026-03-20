'use client';

import { motion } from 'motion/react';
import { Users, Globe, Zap, TrendingUp, BarChart3, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CrossSportCard } from './CrossSportCard';
import type { CrossSportComparison, AthleteIntelligence } from '@/types/intelligence';

const HERO_STATS = [
  { label: 'Athletes Analyzed', value: '2,596', icon: Users, color: 'bg-accent-purple/[0.08] text-accent-purple' },
  { label: 'Sports Covered', value: '40', icon: Globe, color: 'bg-accent-blue/[0.08] text-accent-blue' },
  { label: 'Avg 6-Impact', value: '74.3', icon: Zap, color: 'bg-lime/[0.1] text-lime-dark' },
] as const;

interface IntelligenceDashboardProps {
  comparisons: CrossSportComparison[];
  athletes: AthleteIntelligence[];
}

export const IntelligenceDashboard: React.FC<IntelligenceDashboardProps> = ({ comparisons, athletes }) => {
  const avgImpact = athletes.length > 0
    ? (athletes.reduce((sum, a) => sum + a.impactScore, 0) / athletes.length).toFixed(1)
    : '74.3';

  const trendingComparisons = comparisons.slice(0, 2);

  return (
    <div className="space-y-5">
      {/* Hero Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-lime/[0.1]">
            <BarChart3 className="h-3.5 w-3.5 text-lime-dark" />
          </div>
          <h2 className="text-[13px] font-black text-neutral-900">Intelligence Overview</h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {HERO_STATS.map((stat, i) => {
            const Icon = stat.icon;
            const displayValue = stat.label === 'Avg 6-Impact' ? avgImpact : stat.value;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="flex flex-col items-center rounded-2xl bg-neutral-50 border border-neutral-100 p-3"
              >
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-xl mb-2', stat.color.split(' ')[0])}>
                  <Icon className={cn('h-4 w-4', stat.color.split(' ')[1])} />
                </div>
                <span className="text-lg font-black font-mono tabular-nums text-neutral-900">{displayValue}</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-neutral-400 mt-0.5 text-center leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 6-Impact Formula */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="rounded-[20px] border border-lime/[0.08] bg-lime/[0.02] p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-lime-dark" />
          <h3 className="text-[12px] font-bold text-neutral-900">6-Impact Score Formula</h3>
        </div>
        <div className="rounded-xl bg-white/60 border border-neutral-100 px-3 py-2">
          <code className="text-[10px] font-mono text-neutral-600 leading-relaxed">
            (efficiency * 0.4 + volume * 0.3 + clutch * 0.3) / leagueAvg * 50
          </code>
        </div>
        <p className="text-[10px] text-neutral-400 mt-2 leading-relaxed">
          Z-score normalization across 40 sports and 57 universal trait buckets. Scores are percentile-ranked within sport, then cross-normalized.
        </p>
      </motion.div>

      {/* Top Athletes Quick View */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-emerald/[0.08]">
              <TrendingUp className="h-3.5 w-3.5 text-accent-emerald" />
            </div>
            <h2 className="text-[13px] font-black text-neutral-900">Top Athletes</h2>
          </div>
          <span className="text-[9px] font-mono text-neutral-400">{athletes.length} profiled</span>
        </div>

        <div className="space-y-2">
          {athletes
            .sort((a, b) => b.impactScore - a.impactScore)
            .slice(0, 5)
            .map((athlete, i) => {
              const barWidth = (athlete.impactScore / 100) * 100;
              const isTop = i === 0;
              return (
                <motion.div
                  key={athlete.athleteId}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2 transition-colors',
                    isTop ? 'bg-lime/[0.05] border border-lime/[0.1]' : 'bg-neutral-50'
                  )}
                >
                  <span className="text-[10px] font-black font-mono text-neutral-300 w-4">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-neutral-800 truncate">{athlete.name}</span>
                      <span className={cn(
                        'text-[12px] font-black font-mono tabular-nums ml-2',
                        isTop ? 'text-lime-dark' : 'text-neutral-700'
                      )}>
                        {athlete.impactScore}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-neutral-100 overflow-hidden">
                      <motion.div
                        className={cn('h-full rounded-full', isTop ? 'bg-lime-dark' : 'bg-neutral-300')}
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-neutral-400 font-mono">{athlete.position}</span>
                      <span className="text-neutral-300">&middot;</span>
                      <span className="text-[9px] text-neutral-400">{athlete.team}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </motion.div>

      {/* Trending Comparisons */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-orange/[0.08]">
            <Zap className="h-3 w-3 text-accent-orange" />
          </div>
          <h2 className="text-[12px] font-black text-neutral-900">Trending Comparisons</h2>
          <span className="text-[9px] font-mono text-neutral-400 ml-auto">{comparisons.length} total</span>
        </div>
        <div className="space-y-3">
          {trendingComparisons.map((comparison, i) => (
            <CrossSportCard key={comparison.trait.id} comparison={comparison} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
