'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

/* ---------- Types ---------- */

interface SportSummary {
  sport: string;
  leagueCount: number;
}

interface ScoutingPlayerStats {
  [key: string]: string | number | undefined;
}

interface ScoutingPlayer {
  id: string;
  rank: number;
  name: string;
  team: string;
  stats: ScoutingPlayerStats;
  season: string;
  league: {
    id: string;
    code: string;
    name: string;
    sport: string;
    country: string;
    level: string | null;
  };
}

interface PlayerResponse {
  data: ScoutingPlayer[];
  meta: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean };
}

interface SportsResponse {
  data: SportSummary[];
}

/* ---------- Constants ---------- */

const SPORT_COLORS: Record<string, string> = {
  hockey: '#3B82F6',
  basketball: '#F97316',
  soccer: '#10B981',
  football: '#92400E',
  baseball: '#EF4444',
  volleyball: '#8B5CF6',
  cricket: '#06B6D4',
  rugby: '#059669',
  lacrosse: '#D946EF',
  tennis: '#FACC15',
};

const DEFAULT_SPORT_COLOR = '#6B7280';

const PRIMARY_STAT: Record<string, { key: string; label: string }> = {
  hockey: { key: 'tp', label: 'Total Points' },
  basketball: { key: 'ppg', label: 'PPG' },
  soccer: { key: 'goals', label: 'Goals' },
  baseball: { key: 'hr', label: 'HR' },
  football: { key: 'td', label: 'TD' },
};

/* ---------- Helpers ---------- */

function getSportColor(sport: string): string {
  return SPORT_COLORS[sport.toLowerCase()] ?? DEFAULT_SPORT_COLOR;
}

function getPrimaryStat(sport: string): { key: string; label: string } {
  return PRIMARY_STAT[sport.toLowerCase()] ?? { key: 'gp', label: 'GP' };
}

function formatStatValue(value: string | number | undefined): string {
  if (value === undefined || value === null) return '-';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
  return String(value);
}

/* ---------- Rank Badge ---------- */

function RankBadge({ rank, color }: { rank: number; color: string }): React.ReactElement {
  if (rank === 1) {
    return (
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        <svg className="h-4 w-4" style={{ color }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9CA3AF18' }}>
        <svg className="h-4 w-4 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L9 9H2l5.5 4.5L5 21l7-4.5L19 21l-2.5-7.5L22 9h-7L12 2z" />
        </svg>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#92400E18' }}>
        <svg className="h-4 w-4" style={{ color: '#92400E' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L9 9H2l5.5 4.5L5 21l7-4.5L19 21l-2.5-7.5L22 9h-7L12 2z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 flex items-center justify-center">
      <span className="text-xs font-black text-neutral-600">{rank}</span>
    </div>
  );
}

/* ================================================================
   MAIN VIEW
   ================================================================ */

export function DailyRankView(): React.ReactElement {
  const [selectedSport, setSelectedSport] = useState('');

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  /* Fetch available sports */
  const { data: sportsResponse, isLoading: sportsLoading } = useQuery<SportsResponse>({
    queryKey: ['scouting-sports-summary'],
    queryFn: async () => {
      const res = await fetch('/api/scouting/leagues?summary=sports');
      if (!res.ok) throw new Error('Failed to fetch sports');
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });

  const sports = sportsResponse?.data ?? [];
  const activeSport = selectedSport || (sports.length > 0 ? sports[0].sport : '');
  const sportColor = getSportColor(activeSport);
  const { key: primaryStatKey, label: primaryStatLabel } = getPrimaryStat(activeSport);

  /* Fetch ranked players */
  const { data: response, isLoading: playersLoading, isError } = useQuery<PlayerResponse>({
    queryKey: ['daily-rank-players', activeSport],
    queryFn: async () => {
      const params = new URLSearchParams({
        sport: activeSport,
        limit: '30',
      });
      const res = await fetch(`/api/scouting/players?${params}`);
      if (!res.ok) throw new Error('Failed to fetch rankings');
      return res.json();
    },
    enabled: !!activeSport,
    staleTime: 5 * 60 * 1000,
  });

  const players = response?.data ?? [];
  const totalPlayers = response?.meta?.total ?? 0;

  return (
    <div className="max-w-lg mx-auto space-y-4 p-6 bg-[#0f0f0f] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Daily Rankings</h1>
          <p className="text-[10px] font-mono text-neutral-500 mt-0.5">{dateStr}</p>
        </div>
        <span className="text-[10px] font-mono text-neutral-600">
          {totalPlayers} scouted
        </span>
      </div>

      <p className="text-xs text-neutral-500">
        Top ranked players across all scouting leagues, ordered by rank.
      </p>

      {/* Sport Filter Tabs */}
      {sportsLoading ? (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-neutral-800 rounded-xl animate-pulse shrink-0" />
          ))}
        </div>
      ) : sports.length > 0 ? (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {sports.map((s) => {
            const color = getSportColor(s.sport);
            const isActive = activeSport.toLowerCase() === s.sport.toLowerCase();
            return (
              <button
                key={s.sport}
                type="button"
                onClick={() => setSelectedSport(s.sport)}
                className={cn(
                  'shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all',
                  isActive
                    ? 'text-white shadow-sm'
                    : 'bg-neutral-800/60 text-neutral-500 hover:text-neutral-300',
                )}
                style={isActive ? { backgroundColor: color } : undefined}
              >
                {s.sport}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Rankings List */}
      {playersLoading ? (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-7 w-7 bg-neutral-800 rounded-lg" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-28 bg-neutral-800 rounded" />
                <div className="h-2 w-16 bg-neutral-800 rounded" />
              </div>
              <div className="h-5 w-10 bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-neutral-900/80 border border-red-900/30 rounded-2xl p-8 text-center">
          <p className="text-red-400 text-sm font-medium">Failed to load rankings</p>
          <p className="text-neutral-600 text-xs mt-1">Check your connection and try again</p>
        </div>
      ) : players.length === 0 ? (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 text-center">
          <p className="text-neutral-500 text-sm">No ranking data available for this sport</p>
        </div>
      ) : (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/50"
            style={{ backgroundColor: `${sportColor}08` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${sportColor}20` }}
              >
                <svg className="h-3 w-3" style={{ color: sportColor }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9 9H2l5.5 4.5L5 21l7-4.5L19 21l-2.5-7.5L22 9h-7L12 2z" />
                </svg>
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                {activeSport} Rankings
              </h3>
            </div>
            <span className="text-[9px] font-mono text-neutral-600">{primaryStatLabel}</span>
          </div>

          {/* Player Rows */}
          <div className="p-2">
            {players.map((player, i) => {
              const primaryStat = player.stats[primaryStatKey];

              return (
                <div
                  key={player.id}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                    i === 0 ? '' : 'hover:bg-neutral-800/40',
                  )}
                  style={i === 0 ? { backgroundColor: `${sportColor}06` } : undefined}
                >
                  {/* Rank */}
                  <RankBadge rank={player.rank} color={sportColor} />

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-bold truncate', i === 0 ? 'text-white' : 'text-neutral-300')}>
                      {player.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono truncate">
                      {player.team} &middot; {player.league.code.toUpperCase()} &middot; {player.league.country}
                    </p>
                  </div>

                  {/* Primary Stat */}
                  <span
                    className={cn('text-sm font-black font-mono shrink-0', i === 0 ? '' : 'text-neutral-500')}
                    style={i === 0 ? { color: sportColor } : undefined}
                  >
                    {formatStatValue(primaryStat)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl p-4 text-center">
        <p className="text-[10px] text-neutral-600">
          Rankings based on scouting data across multiple leagues and seasons.
        </p>
        <p className="text-[9px] text-neutral-700 mt-1">
          Updated regularly from EliteProspects, USports, and other sources.
        </p>
      </div>
    </div>
  );
}
