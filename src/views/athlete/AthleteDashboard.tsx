'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const MODULE_GRID = [
  { key: 'dashboard', label: 'Dashboard', icon: '\u{1F3E0}', path: '/athlete' },
  { key: 'positions', label: 'Positions', icon: '\u{1F3AF}', path: '/athlete/positions' },
  { key: 'scouting-radar', label: 'Scouting Radar', icon: '\u{1F4E1}', path: '/athlete/scouting-radar' },
  { key: 'goat-study', label: 'GOAT Study', icon: '\u{1F410}', path: '/athlete/goat-study' },
  { key: 'persona', label: 'Persona Classifier', icon: '\u{1F9EC}', path: '/athlete/persona' },
  { key: 'drills', label: 'Drill Library', icon: '\u{1F4CB}', path: '/athlete/drills' },
  { key: 'training', label: 'Training Plan', icon: '\u{1F4AA}', path: '/athlete/training-plan' },
  { key: 'benchmarks', label: 'Benchmarks', icon: '\u{1F4CA}', path: '/athlete/benchmarks' },
  { key: 'spatial', label: 'Spatial Stats', icon: '\u{1F5FA}\u{FE0F}', path: '/athlete/spatial-stats' },
  { key: 'game-builder', label: 'Game Builder', icon: '\u{1F3AE}', path: '/athlete/game-builder' },
  { key: 'film-study', label: 'Film Study', icon: '\u{1F3AC}', path: '/athlete/film-study' },
  { key: 'mental-game', label: 'Mental Game', icon: '\u{1F9E0}', path: '/athlete/mental-game' },
  { key: 'nutrition', label: 'Nutrition', icon: '\u{1F34E}', path: '/athlete/nutrition' },
  { key: 'support', label: 'Support Network', icon: '\u{1F91D}', path: '/athlete/support-network' },
  { key: 'pathway', label: 'Pathway Navigator', icon: '\u{1F6E4}\u{FE0F}', path: '/athlete/pathway' },
  { key: 'game-log', label: 'Game Log', icon: '\u{1F4D3}', path: '/athlete/game-log' },
  { key: 'daily-log', label: 'Daily Log', icon: '\u{1F4DD}', path: '/athlete/daily-log' },
  { key: 'assessment', label: 'Assessment', icon: '\u{1F4C8}', path: '/athlete/assessment' },
  { key: 'recruiting', label: 'Recruiting Engine', icon: '\u{1F4E7}', path: '/athlete/recruiting' },
  { key: 'find-team', label: 'Find a Team', icon: '\u{1F50D}', path: '/athlete/find-team' },
  { key: 'export', label: 'Export Profile', icon: '\u{1F4E4}', path: '/athlete/export-profile' },
  { key: 'stages', label: 'Stage Selector', icon: '\u{1F3D7}\u{FE0F}', path: '/athlete/stages' },
];

export function AthleteDashboard(): React.ReactElement {
  const { sportConfig } = useSport();
  const [stats] = useState({ gamesLogged: 0, dailyEntries: 0, winRate: 0, avgRpe: 0 });
  const athleteName = 'Athlete';
  const athletePosition = sportConfig.positions[0]?.code || '-';
  const currentPosition = sportConfig.positions.find((p) => p.code === athletePosition);

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: sportConfig.color }} />
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${sportConfig.color}20` }}>
              {sportConfig.emoji}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{athleteName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded border border-neutral-600 text-neutral-300 text-xs">{currentPosition?.name || athletePosition}</span>
                <span className="px-2 py-0.5 rounded text-xs border-0" style={{ backgroundColor: `${sportConfig.color}30`, color: sportConfig.color }}>{sportConfig.name}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Games Logged', value: stats.gamesLogged, icon: '\u{1F3C0}' },
              { label: 'Daily Entries', value: stats.dailyEntries, icon: '\u{1F4DD}' },
              { label: 'Win Rate', value: `${stats.winRate}%`, icon: '\u{1F3C6}' },
              { label: 'Avg RPE', value: stats.avgRpe, icon: '\u{1F4AA}' },
            ].map((stat) => (
              <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-3 text-center border border-neutral-700/50">
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-neutral-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Winners Win Journal</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {MODULE_GRID.map((mod) => (
            <Link
              key={mod.key}
              href={mod.path}
              className={cn(
                'group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
                'bg-neutral-900 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/80',
                'hover:scale-[1.02] active:scale-[0.98]'
              )}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{mod.icon}</span>
              <span className="text-xs text-neutral-300 text-center font-medium leading-tight">{mod.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 pt-4">
        <span>{sportConfig.emoji}</span>
        <span>Active Sport: {sportConfig.name}</span>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sportConfig.color }} />
      </div>
    </div>
  );
}
