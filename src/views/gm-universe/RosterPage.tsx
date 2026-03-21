'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlayerContract {
  salary: number;
  years: number;
  type: string;
}

interface PlayerStats {
  ppg: number;
  rpg: number;
  apg: number;
}

type Morale = 'high' | 'medium' | 'low';
type Development = 'ascending' | 'peak' | 'declining';

interface RosterPlayer {
  id: string;
  name: string;
  position: string;
  overall: number;
  age: number;
  contract: PlayerContract;
  stats: PlayerStats;
  morale: Morale;
  development: Development;
}

const MOCK_ROSTER: RosterPlayer[] = [
  { id: 'r1', name: 'Scottie Barnes', position: 'SF', overall: 88, age: 23, contract: { salary: 26400000, years: 4, type: 'max' }, stats: { ppg: 24.2, rpg: 8.1, apg: 6.3 }, morale: 'high', development: 'ascending' },
  { id: 'r2', name: 'Immanuel Quickley', position: 'PG', overall: 82, age: 25, contract: { salary: 18000000, years: 3, type: 'market' }, stats: { ppg: 18.7, rpg: 3.2, apg: 7.5 }, morale: 'high', development: 'ascending' },
  { id: 'r3', name: 'RJ Barrett', position: 'SG', overall: 80, age: 24, contract: { salary: 23800000, years: 3, type: 'market' }, stats: { ppg: 19.4, rpg: 5.8, apg: 3.9 }, morale: 'medium', development: 'ascending' },
  { id: 'r4', name: 'Jakob Poeltl', position: 'C', overall: 79, age: 29, contract: { salary: 19500000, years: 2, type: 'market' }, stats: { ppg: 14.1, rpg: 10.8, apg: 2.4 }, morale: 'medium', development: 'peak' },
  { id: 'r5', name: 'Gradey Dick', position: 'SG', overall: 76, age: 21, contract: { salary: 5200000, years: 3, type: 'rookie' }, stats: { ppg: 14.8, rpg: 2.3, apg: 2.1 }, morale: 'high', development: 'ascending' },
  { id: 'r6', name: 'Bruce Brown', position: 'SG', overall: 75, age: 28, contract: { salary: 6500000, years: 2, type: 'team_friendly' }, stats: { ppg: 9.2, rpg: 4.1, apg: 3.0 }, morale: 'medium', development: 'peak' },
  { id: 'r7', name: 'Kelly Olynyk', position: 'PF', overall: 74, age: 33, contract: { salary: 13000000, years: 1, type: 'market' }, stats: { ppg: 10.4, rpg: 5.2, apg: 3.3 }, morale: 'medium', development: 'declining' },
  { id: 'r8', name: 'Chris Boucher', position: 'PF', overall: 72, age: 31, contract: { salary: 10200000, years: 1, type: 'market' }, stats: { ppg: 8.6, rpg: 5.4, apg: 0.8 }, morale: 'low', development: 'declining' },
  { id: 'r9', name: 'Gary Trent Jr.', position: 'SG', overall: 77, age: 25, contract: { salary: 16500000, years: 2, type: 'market' }, stats: { ppg: 16.2, rpg: 2.7, apg: 1.8 }, morale: 'medium', development: 'peak' },
  { id: 'r10', name: 'Precious Achiuwa', position: 'PF', overall: 73, age: 25, contract: { salary: 6000000, years: 2, type: 'team_friendly' }, stats: { ppg: 8.2, rpg: 6.1, apg: 1.2 }, morale: 'medium', development: 'ascending' },
  { id: 'r11', name: 'Malachi Flynn', position: 'PG', overall: 70, age: 26, contract: { salary: 2300000, years: 1, type: 'team_friendly' }, stats: { ppg: 5.1, rpg: 1.8, apg: 2.9 }, morale: 'low', development: 'peak' },
  { id: 'r12', name: 'Thaddeus Young', position: 'PF', overall: 68, age: 36, contract: { salary: 3000000, years: 1, type: 'team_friendly' }, stats: { ppg: 3.8, rpg: 3.2, apg: 1.5 }, morale: 'high', development: 'declining' },
  { id: 'r13', name: 'Jalen McDaniels', position: 'SF', overall: 71, age: 26, contract: { salary: 4800000, years: 2, type: 'team_friendly' }, stats: { ppg: 6.4, rpg: 3.7, apg: 1.1 }, morale: 'medium', development: 'peak' },
  { id: 'r14', name: 'Javon Freeman-Liberty', position: 'SG', overall: 66, age: 23, contract: { salary: 1800000, years: 2, type: 'rookie' }, stats: { ppg: 4.2, rpg: 2.1, apg: 1.0 }, morale: 'medium', development: 'ascending' },
  { id: 'r15', name: 'Jordan Nwora', position: 'SF', overall: 67, age: 26, contract: { salary: 2100000, years: 1, type: 'team_friendly' }, stats: { ppg: 5.6, rpg: 2.8, apg: 0.7 }, morale: 'low', development: 'peak' },
];

interface SortOption {
  key: string;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'overall', label: 'Rating' },
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'age', label: 'Age' },
  { key: 'salary', label: 'Salary' },
  { key: 'ppg', label: 'PPG' },
];

interface MoraleConfig {
  color: string;
  bg: string;
  label: string;
}

const MORALE_CONFIG: Record<Morale, MoraleConfig> = {
  high: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'High' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Med' },
  low: { color: 'text-red-400', bg: 'bg-red-400/10', label: 'Low' },
};

interface DevConfig {
  color: string;
  symbol: string;
  label: string;
}

const DEV_CONFIG: Record<Development, DevConfig> = {
  ascending: { color: 'text-emerald-400', symbol: '\u2191', label: 'Ascending' },
  peak: { color: 'text-amber-400', symbol: '\u2192', label: 'Peak' },
  declining: { color: 'text-red-400', symbol: '\u2193', label: 'Declining' },
};

const POSITION_ORDER: Record<string, number> = { PG: 1, SG: 2, SF: 3, PF: 4, C: 5 };

export function RosterPage(): React.ReactElement {
  const [sortBy, setSortBy] = useState('overall');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedRoster = useMemo(() => {
    const copy = [...MOCK_ROSTER];
    copy.sort((a, b) => {
      let aVal: number;
      let bVal: number;

      if (sortBy === 'salary') {
        aVal = a.contract.salary;
        bVal = b.contract.salary;
      } else if (sortBy === 'ppg') {
        aVal = a.stats.ppg;
        bVal = b.stats.ppg;
      } else if (sortBy === 'name') {
        return sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'position') {
        aVal = POSITION_ORDER[a.position] ?? 6;
        bVal = POSITION_ORDER[b.position] ?? 6;
      } else if (sortBy === 'age') {
        aVal = a.age;
        bVal = b.age;
      } else {
        aVal = a.overall;
        bVal = b.overall;
      }

      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return copy;
  }, [sortBy, sortDir]);

  const handleSort = (key: string): void => {
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  const totalSalary = MOCK_ROSTER.reduce((s, p) => s + p.contract.salary, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Roster</h1>
        <span className="text-xs text-slate-500">
          {MOCK_ROSTER.length} players | ${(totalSalary / 1000000).toFixed(1)}M total
        </span>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => handleSort(opt.key)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1',
              sortBy === opt.key
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700',
            )}
          >
            {opt.label}
            {sortBy === opt.key && (
              <span className="text-[10px]">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
            )}
          </button>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800">
              {['Player', 'POS', 'OVR', 'AGE', 'Salary', 'YRS', 'PPG', 'RPG', 'APG', 'Morale', 'Dev'].map((h) => (
                <th key={h} className="text-left py-2 px-2 text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRoster.map((player) => {
              const morale = MORALE_CONFIG[player.morale];
              const dev = DEV_CONFIG[player.development];
              return (
                <tr key={player.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-2 text-white font-medium">{player.name}</td>
                  <td className="py-2.5 px-2 text-slate-400">{player.position}</td>
                  <td className="py-2.5 px-2">
                    <span className={cn(
                      'font-bold',
                      player.overall >= 85 ? 'text-emerald-400' : player.overall >= 78 ? 'text-amber-400' : 'text-slate-400',
                    )}>
                      {player.overall}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-slate-400">{player.age}</td>
                  <td className="py-2.5 px-2 text-slate-300 font-mono">
                    ${(player.contract.salary / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-2.5 px-2 text-slate-500">{player.contract.years}yr</td>
                  <td className="py-2.5 px-2 text-white font-medium tabular-nums">{player.stats.ppg}</td>
                  <td className="py-2.5 px-2 text-slate-300 tabular-nums">{player.stats.rpg}</td>
                  <td className="py-2.5 px-2 text-slate-300 tabular-nums">{player.stats.apg}</td>
                  <td className="py-2.5 px-2">
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded', morale.bg, morale.color)}>
                      {morale.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={cn('font-bold', dev.color)}>{dev.symbol}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-2">
        {sortedRoster.map((player) => {
          const morale = MORALE_CONFIG[player.morale];
          const dev = DEV_CONFIG[player.development];
          return (
            <Card key={player.id} className="bg-slate-900/80 border-slate-800">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-lg font-bold',
                      player.overall >= 85 ? 'text-emerald-400' : player.overall >= 78 ? 'text-amber-400' : 'text-slate-400',
                    )}>
                      {player.overall}
                    </span>
                    <div>
                      <p className="text-xs text-white font-medium">{player.name}</p>
                      <p className="text-[10px] text-slate-500">{player.position} | Age {player.age}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-300 font-mono">
                      ${(player.contract.salary / 1000000).toFixed(1)}M/{player.contract.years}yr
                    </p>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className={cn('text-[9px] px-1 py-0.5 rounded', morale.bg, morale.color)}>
                        {morale.label}
                      </span>
                      <span className={cn('text-xs font-bold', dev.color)}>
                        {dev.symbol} {dev.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 text-[10px]">
                  <span className="text-slate-300">{player.stats.ppg} PPG</span>
                  <span className="text-slate-400">{player.stats.rpg} RPG</span>
                  <span className="text-slate-400">{player.stats.apg} APG</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
