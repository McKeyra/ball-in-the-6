'use client';

import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ScoreboardProps {
  homeTeam: { name: string; color: string };
  awayTeam: { name: string; color: string };
  homeScore: number;
  awayScore: number;
  quarter: number;
  gameClock: number;
  shotClock: number;
  isRunning: boolean;
  onToggleClock: () => void;
  onResetShotClock: () => void;
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function quarterLabel(q: number): string {
  if (q <= 4) return `Q${q}`;
  return `OT${q - 4}`;
}

export function Scoreboard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  quarter,
  gameClock,
  shotClock,
  isRunning,
  onToggleClock,
  onResetShotClock,
}: ScoreboardProps): React.ReactElement {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
      {/* Teams & Score */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center">
          <div
            className="mx-auto mb-2 h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black text-white"
            style={{ backgroundColor: homeTeam.color || '#3b82f6' }}
          >
            {homeTeam.name.charAt(0)}
          </div>
          <p className="text-3xl font-black text-neutral-900">{homeScore}</p>
          <p className="text-xs font-bold text-neutral-600 mt-1 truncate">{homeTeam.name}</p>
          <p className="text-[10px] font-mono text-neutral-400">HOME</p>
        </div>

        {/* Clock */}
        <div className="px-4 text-center">
          <div className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-black text-[#c8ff00] uppercase tracking-widest mb-2">
            {quarterLabel(quarter)}
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-black text-neutral-900 tabular-nums">
            {formatClock(gameClock)}
          </p>
          <p className="text-sm font-mono text-neutral-400 tabular-nums mt-1">
            {shotClock}s
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              type="button"
              onClick={onToggleClock}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                isRunning
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-[#c8ff00] text-neutral-900 hover:bg-[#b8ef00]',
              )}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={onResetShotClock}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 text-center">
          <div
            className="mx-auto mb-2 h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black text-white"
            style={{ backgroundColor: awayTeam.color || '#ef4444' }}
          >
            {awayTeam.name.charAt(0)}
          </div>
          <p className="text-3xl font-black text-neutral-900">{awayScore}</p>
          <p className="text-xs font-bold text-neutral-600 mt-1 truncate">{awayTeam.name}</p>
          <p className="text-[10px] font-mono text-neutral-400">AWAY</p>
        </div>
      </div>
    </div>
  );
}
