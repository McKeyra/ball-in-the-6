'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PlayerStats {
  name: string;
  number: string;
  min: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  fgPct: number;
}

interface BoxScoreProps {
  homeTeamName: string;
  awayTeamName: string;
  homeTeamColor: string;
  awayTeamColor: string;
  homePlayers: PlayerStats[];
  awayPlayers: PlayerStats[];
}

type SortKey = 'pts' | 'reb' | 'ast' | 'stl' | 'blk' | 'fgPct' | 'min';

const STAT_COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'min', label: 'MIN' },
  { key: 'pts', label: 'PTS' },
  { key: 'reb', label: 'REB' },
  { key: 'ast', label: 'AST' },
  { key: 'stl', label: 'STL' },
  { key: 'blk', label: 'BLK' },
  { key: 'fgPct', label: 'FG%' },
];

export const BoxScore: React.FC<BoxScoreProps> = ({
  homeTeamName,
  awayTeamName,
  homeTeamColor,
  awayTeamColor,
  homePlayers,
  awayPlayers,
}) => {
  const [activeTab, setActiveTab] = useState<'away' | 'home'>('away');
  const [sortKey, setSortKey] = useState<SortKey>('pts');
  const [sortAsc, setSortAsc] = useState(false);

  const activePlayers = activeTab === 'home' ? homePlayers : awayPlayers;
  const activeColor = activeTab === 'home' ? homeTeamColor : awayTeamColor;
  const activeTeamName = activeTab === 'home' ? homeTeamName : awayTeamName;

  const leaders = useMemo(() => {
    const result: Record<SortKey, number> = {
      min: 0,
      pts: 0,
      reb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      fgPct: 0,
    };
    for (const key of Object.keys(result) as SortKey[]) {
      result[key] = Math.max(...activePlayers.map((p) => p[key]));
    }
    return result;
  }, [activePlayers]);

  const sorted = useMemo(() => {
    return [...activePlayers].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortAsc ? diff : -diff;
    });
  }, [activePlayers, sortKey, sortAsc]);

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-[20px] border border-neutral-200/60 bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
          Box Score
        </h3>
        <div className="flex gap-1 rounded-xl bg-neutral-100/60 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('away')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all',
              activeTab === 'away'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-600'
            )}
          >
            {awayTeamName}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all',
              activeTab === 'home'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-600'
            )}
          >
            {homeTeamName}
          </button>
        </div>
      </div>

      {/* Active team badge */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: activeColor }}
          />
          <span className="text-xs font-bold text-neutral-600">
            {activeTeamName}
          </span>
        </div>
      </div>

      {/* Table */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'home' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'home' ? -20 : 20 }}
          transition={{ duration: 0.25 }}
          className="overflow-x-auto px-2 pb-4"
        >
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="py-3 pl-3 text-left text-[10px] font-mono uppercase tracking-widest text-neutral-300 w-[140px]">
                  Player
                </th>
                {STAT_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      'cursor-pointer py-3 text-center text-[10px] font-mono uppercase tracking-widest transition-colors hover:text-neutral-600 w-14',
                      sortKey === col.key
                        ? 'text-[#c8ff00] font-black'
                        : 'text-neutral-300'
                    )}
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <span className="ml-0.5 text-[8px]">
                        {sortAsc ? '\u25B2' : '\u25BC'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((player, idx) => (
                <motion.tr
                  key={player.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="py-2.5 pl-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-300 w-5 text-right">
                        #{player.number}
                      </span>
                      <span className="text-xs font-bold text-neutral-800 truncate max-w-[100px]">
                        {player.name}
                      </span>
                    </div>
                  </td>
                  {STAT_COLUMNS.map((col) => {
                    const value = player[col.key];
                    const isLeader =
                      value === leaders[col.key] && value > 0;
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          'py-2.5 text-center font-mono text-xs',
                          isLeader
                            ? 'font-black text-neutral-900'
                            : 'text-neutral-500'
                        )}
                      >
                        <span
                          className={cn(
                            isLeader &&
                              'border-b-2 border-[#c8ff00] pb-0.5'
                          )}
                        >
                          {col.key === 'fgPct'
                            ? `${value}%`
                            : value}
                        </span>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
