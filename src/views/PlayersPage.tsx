'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLAYER_DETAILS } from '@/lib/player-data';
import { PlayerCard } from '@/components/players/PlayerCard';
import Link from 'next/link';

type PositionFilter = 'All' | 'PG' | 'SG' | 'SF' | 'PF' | 'C';
type SortOption = 'name' | 'ppg' | 'impact';

const POSITIONS: PositionFilter[] = ['All', 'PG', 'SG', 'SF', 'PF', 'C'];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'ppg', label: 'PPG' },
  { key: 'impact', label: 'Impact Score' },
];

/* Map player IDs to impact scores from mock-data PLAYERS array */
const IMPACT_SCORES: Record<string, number> = {
  'player-001': 12400,
  'player-002': 11200,
  'player-003': 9800,
  'player-004': 8340,
} as const;

export const PlayersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState<PositionFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('ppg');

  const filtered = useMemo(() => {
    let result = [...PLAYER_DETAILS];

    /* Search filter */
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q)
      );
    }

    /* Position filter */
    if (position !== 'All') {
      result = result.filter((p) => p.position === position);
    }

    /* Sort */
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'ppg':
          return b.stats.ppg - a.stats.ppg;
        case 'impact':
          return (IMPACT_SCORES[b.id] ?? 0) - (IMPACT_SCORES[a.id] ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [search, position, sortBy]);

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="px-4 pt-4 pb-3">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-neutral-500"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                  Players
                </h1>
                <p className="text-[10px] font-mono text-neutral-400">
                  {PLAYER_DETAILS.length} athletes
                </p>
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#C8FF00]">
              <Users className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search players, teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C8FF00]/50 focus:bg-white"
            />
          </div>

          {/* Position filter pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setPosition(pos)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all',
                  position === pos
                    ? 'bg-[#C8FF00] text-black'
                    : 'bg-neutral-100/60 text-neutral-400 hover:text-neutral-600'
                )}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 mt-3">
            <ArrowUpDown className="h-3 w-3 text-neutral-300" />
            <div className="flex gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSortBy(opt.key)}
                  className={cn(
                    'rounded-lg px-3 py-1 text-[10px] font-bold transition-all',
                    sortBy === opt.key
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-300 hover:text-neutral-500'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Player List */}
      <div className="px-4 pt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((player, i) => (
              <PlayerCard key={player.id} player={player} index={i} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-16 text-center"
            >
              <p className="text-sm text-neutral-400">
                No players match your search.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
