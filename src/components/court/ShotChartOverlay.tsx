'use client';

import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, Target, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getHeatLabel } from '@/lib/court/zones';
import { LEAGUE_AVERAGES } from '@/types/court';
import type { ShotData, CourtZone, ZoneStats } from '@/types/court';
import { COURT_ZONES } from '@/lib/court/zones';

interface ShotChartOverlayProps {
  selectedZoneId: string | null;
  shots: ShotData[];
  className?: string;
}

const TrendIcon: React.FC<{ trend: ZoneStats['trend'] }> = ({ trend }) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
    case 'down':
      return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
    default:
      return <Minus className="h-3.5 w-3.5 text-neutral-400" />;
  }
};

const getTrend = (percentage: number, leagueAvg: number): ZoneStats['trend'] => {
  const diff = percentage - leagueAvg;
  if (diff >= 3) return 'up';
  if (diff <= -3) return 'down';
  return 'neutral';
};

export const ShotChartOverlay: React.FC<ShotChartOverlayProps> = ({
  selectedZoneId,
  shots,
  className,
}) => {
  const zone: CourtZone | undefined = COURT_ZONES.find((z) => z.id === selectedZoneId);
  const shot: ShotData | undefined = shots.find((s) => s.zoneId === selectedZoneId);

  if (!zone || !shot) {
    return (
      <div className={cn('flex items-center justify-center rounded-[20px] border border-neutral-200 bg-neutral-50 p-6', className)}>
        <div className="text-center">
          <Crosshair className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
          <p className="text-sm text-neutral-400 font-medium">Tap a zone on the court</p>
          <p className="text-xs text-neutral-300 mt-1">to see detailed shot data</p>
        </div>
      </div>
    );
  }

  const leagueAvg = LEAGUE_AVERAGES[zone.id] ?? 40;
  const trend = getTrend(shot.percentage, leagueAvg);
  const diff = shot.percentage - leagueAvg;
  const heatLabel = getHeatLabel(shot.percentage, leagueAvg);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={zone.id}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={cn(
          'rounded-[20px] border border-neutral-200 bg-white p-5 shadow-sm',
          className
        )}
      >
        {/* Zone name + heat badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[#C8FF00]" />
            <h3 className="text-sm font-black text-neutral-900">{zone.name}</h3>
          </div>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              diff >= 5 && 'bg-green-100 text-green-700',
              diff >= 0 && diff < 5 && 'bg-lime-100 text-lime-700',
              diff < 0 && diff >= -5 && 'bg-yellow-100 text-yellow-700',
              diff < -5 && 'bg-red-100 text-red-700'
            )}
          >
            {heatLabel}
          </span>
        </div>

        {/* Main stat */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-black font-mono text-neutral-900 tabular-nums">
            {shot.percentage.toFixed(1)}
          </span>
          <span className="text-lg font-bold text-neutral-400">%</span>
        </div>

        {/* Makes / Attempts */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-neutral-50 p-3">
            <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Makes</p>
            <p className="text-lg font-black text-neutral-900 font-mono tabular-nums">{shot.makes}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 p-3">
            <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Attempts</p>
            <p className="text-lg font-black text-neutral-900 font-mono tabular-nums">{shot.attempts}</p>
          </div>
        </div>

        {/* League comparison */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/50 px-3 py-2.5">
          <div>
            <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">vs League Avg</p>
            <p className="text-xs font-mono text-neutral-500 mt-0.5">{leagueAvg.toFixed(1)}%</p>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendIcon trend={trend} />
            <span
              className={cn(
                'text-sm font-black font-mono tabular-nums',
                diff >= 0 ? 'text-green-600' : 'text-red-500'
              )}
            >
              {diff >= 0 ? '+' : ''}
              {diff.toFixed(1)}%
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
