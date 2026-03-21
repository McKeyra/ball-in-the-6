'use client';

import {
  TrendingUp,
  Target,
  Zap,
  BarChart3,
} from 'lucide-react';

const STAT_CATEGORIES = [
  { label: 'Points Per Game', key: 'ppg', icon: Target, color: 'text-red-400' },
  { label: 'Rebounds Per Game', key: 'rpg', icon: BarChart3, color: 'text-blue-400' },
  { label: 'Assists Per Game', key: 'apg', icon: Zap, color: 'text-green-400' },
  { label: 'Field Goal %', key: 'fg_pct', icon: TrendingUp, color: 'text-yellow-400' },
] as const;

export function AthleteStatsPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Stats</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track and showcase your season and career statistics to recruiters.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CATEGORIES.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.key} className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
              <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-white">--</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4"><h2 className="text-base font-semibold text-white">Season Statistics</h2></div>
        <div className="p-4 text-center py-12">
          <BarChart3 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Add your game stats to build a comprehensive statistical profile.</p>
          <p className="text-slate-600 text-xs mt-2">Recruiters view athlete stats more than any other profile section.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4"><h2 className="text-base font-semibold text-white">Career Averages</h2></div>
        <div className="p-4 text-center py-12">
          <TrendingUp className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Career averages will calculate automatically as you log more seasons.</p>
        </div>
      </div>
    </div>
  );
}
