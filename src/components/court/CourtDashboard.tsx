'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InteractiveCourtSVG } from '@/components/court/InteractiveCourtSVG';
import { ShotChartOverlay } from '@/components/court/ShotChartOverlay';
import { PlayerShotSelector } from '@/components/court/PlayerShotSelector';
import { MOCK_SHOT_CHARTS } from '@/lib/court/mock-shots';
import type { PlayerShotChart, ShotData } from '@/types/court';

interface StatCardProps {
  label: string;
  value: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
    className="rounded-xl border border-neutral-200 bg-white p-3 text-center"
  >
    <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">{label}</p>
    <p className="mt-1 text-lg font-black font-mono text-neutral-900 tabular-nums">{value}</p>
  </motion.div>
);

const computeZonePct = (shots: ShotData[], zoneIds: string[]): string => {
  const filtered = shots.filter((s) => zoneIds.includes(s.zoneId));
  const makes = filtered.reduce((a, s) => a + s.makes, 0);
  const attempts = filtered.reduce((a, s) => a + s.attempts, 0);
  return attempts > 0 ? ((makes / attempts) * 100).toFixed(1) : '0.0';
};

const THREE_POINT_ZONES = [
  'left-corner-3',
  'right-corner-3',
  'left-wing-3',
  'right-wing-3',
  'center-3',
] as const;

const TWO_POINT_ZONES = [
  'restricted-area',
  'left-block',
  'right-block',
  'left-mid-range',
  'right-mid-range',
  'left-elbow',
  'right-elbow',
  'top-of-key',
  'free-throw',
] as const;

const ALL_ZONES = [...TWO_POINT_ZONES, ...THREE_POINT_ZONES] as const;

export const CourtDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    MOCK_SHOT_CHARTS[0].playerId
  );
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const currentChart: PlayerShotChart | undefined = useMemo(
    () => MOCK_SHOT_CHARTS.find((c) => c.playerId === selectedPlayerId),
    [selectedPlayerId]
  );

  const handlePlayerSelect = useCallback((playerId: string): void => {
    setSelectedPlayerId(playerId);
    setSelectedZoneId(null);
  }, []);

  const handleZoneSelect = useCallback((zoneId: string | null): void => {
    setSelectedZoneId(zoneId);
  }, []);

  if (!currentChart) return null;

  const shots = currentChart.shots;
  const fgPct = computeZonePct(shots, [...ALL_ZONES]);
  const threePct = computeZonePct(shots, [...THREE_POINT_ZONES]);
  const twoPct = computeZonePct(shots, [...TWO_POINT_ZONES]);

  /* eFG% = (FGM + 0.5 * 3PM) / FGA */
  const threeFiltered = shots.filter((s) =>
    (THREE_POINT_ZONES as readonly string[]).includes(s.zoneId)
  );
  const threeMakes = threeFiltered.reduce((a, s) => a + s.makes, 0);
  const totalFGA = currentChart.totalAttempts;
  const totalFGM = currentChart.totalMakes;
  const efgPct =
    totalFGA > 0
      ? (((totalFGM + 0.5 * threeMakes) / totalFGA) * 100).toFixed(1)
      : '0.0';

  const summaryStats = [
    { label: 'FG%', value: `${fgPct}%` },
    { label: '3PT%', value: `${threePct}%` },
    { label: '2PT%', value: `${twoPct}%` },
    { label: 'eFG%', value: `${efgPct}%` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn('w-full', className)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-[#C8FF00]" />
        <h2 className="text-lg font-black text-neutral-900 tracking-tight">
          Shot Chart Analysis
        </h2>
      </div>

      {/* Player selector */}
      <PlayerShotSelector
        players={MOCK_SHOT_CHARTS}
        selectedPlayerId={selectedPlayerId}
        onPlayerSelect={handlePlayerSelect}
        className="mb-4"
      />

      {/* Summary stats row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {summaryStats.map((stat, i) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} index={i} />
        ))}
      </div>

      {/* Court + overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <InteractiveCourtSVG
            shots={shots}
            selectedZoneId={selectedZoneId}
            onZoneSelect={handleZoneSelect}
          />
        </motion.div>

        <ShotChartOverlay
          selectedZoneId={selectedZoneId}
          shots={shots}
        />
      </div>
    </motion.div>
  );
};
