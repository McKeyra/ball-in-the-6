'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GameLog } from '@/types/player';

interface GameLogTableProps {
  games: GameLog[];
}

type SortKey = 'date' | 'opponent' | 'pts' | 'reb' | 'ast' | 'min' | 'result';
type SortDir = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
  { key: 'date', label: 'Date', align: 'left' },
  { key: 'opponent', label: 'Opponent', align: 'left' },
  { key: 'pts', label: 'PTS', align: 'right' },
  { key: 'reb', label: 'REB', align: 'right' },
  { key: 'ast', label: 'AST', align: 'right' },
  { key: 'min', label: 'MIN', align: 'right' },
  { key: 'result', label: 'Result', align: 'right' },
];

const getSeasonHighs = (games: GameLog[]): { pts: number; reb: number; ast: number; min: number } => ({
  pts: Math.max(...games.map((g) => g.pts)),
  reb: Math.max(...games.map((g) => g.reb)),
  ast: Math.max(...games.map((g) => g.ast)),
  min: Math.max(...games.map((g) => g.min)),
});

export const GameLogTable: React.FC<GameLogTableProps> = ({ games }) => {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const seasonHighs = useMemo(() => getSeasonHighs(games), [games]);

  const sorted = useMemo(() => {
    const copy = [...games];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return copy;
  }, [games, sortKey, sortDir]);

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const isSeasonHigh = (game: GameLog, key: 'pts' | 'reb' | 'ast' | 'min'): boolean =>
    game[key] === seasonHighs[key] && seasonHighs[key] > 0;

  return (
    <div className="rounded-[20px] border border-neutral-200/60 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100">
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
          Game Log
        </h3>
        <p className="text-[10px] text-neutral-400 mt-0.5">
          Last {games.length} games
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-neutral-100">
              {COLUMNS.map((col) => (
                <th key={col.key} className={cn('px-3 py-2.5 first:pl-5 last:pr-5')}>
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      'flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest transition-colors',
                      col.align === 'right' && 'ml-auto',
                      sortKey === col.key ? 'text-[#C8FF00]' : 'text-neutral-400 hover:text-neutral-600'
                    )}
                  >
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === 'asc'
                        ? <ChevronUp className="h-3 w-3" />
                        : <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {sorted.map((game, i) => (
                <motion.tr
                  key={`${game.date}-${game.opponent}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                  className={cn(
                    'border-b border-neutral-50 last:border-0 transition-colors hover:bg-neutral-50/50',
                    game.result === 'W' && 'bg-emerald-50/20'
                  )}
                >
                  {/* Date */}
                  <td className="px-3 py-3 first:pl-5 text-xs font-medium text-neutral-500">
                    {game.date}
                  </td>

                  {/* Opponent */}
                  <td className="px-3 py-3 text-xs font-bold text-neutral-700 truncate max-w-[140px]">
                    {game.result === 'W' ? 'vs' : '@'} {game.opponent}
                  </td>

                  {/* PTS */}
                  <td className="px-3 py-3 text-right">
                    <span
                      className={cn(
                        'font-mono text-sm tabular-nums',
                        isSeasonHigh(game, 'pts')
                          ? 'font-black text-[#C8FF00]'
                          : 'font-bold text-neutral-900'
                      )}
                    >
                      {game.pts}
                    </span>
                  </td>

                  {/* REB */}
                  <td className="px-3 py-3 text-right">
                    <span
                      className={cn(
                        'font-mono text-sm tabular-nums',
                        isSeasonHigh(game, 'reb')
                          ? 'font-black text-[#C8FF00]'
                          : 'font-bold text-neutral-900'
                      )}
                    >
                      {game.reb}
                    </span>
                  </td>

                  {/* AST */}
                  <td className="px-3 py-3 text-right">
                    <span
                      className={cn(
                        'font-mono text-sm tabular-nums',
                        isSeasonHigh(game, 'ast')
                          ? 'font-black text-[#C8FF00]'
                          : 'font-bold text-neutral-900'
                      )}
                    >
                      {game.ast}
                    </span>
                  </td>

                  {/* MIN */}
                  <td className="px-3 py-3 text-right">
                    <span
                      className={cn(
                        'font-mono text-sm tabular-nums',
                        isSeasonHigh(game, 'min')
                          ? 'font-black text-[#C8FF00]'
                          : 'font-bold text-neutral-500'
                      )}
                    >
                      {game.min}
                    </span>
                  </td>

                  {/* Result */}
                  <td className="px-3 py-3 last:pr-5 text-right">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-black',
                        game.result === 'W'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-600'
                      )}
                    >
                      {game.result}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 px-5 py-3 border-t border-neutral-100">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#C8FF00]" />
          <span className="text-[9px] font-mono text-neutral-400">Season High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-[9px] font-mono text-neutral-400">Win</span>
        </div>
      </div>
    </div>
  );
};
