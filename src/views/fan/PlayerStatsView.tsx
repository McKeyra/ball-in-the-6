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

const STAT_DISPLAY: Record<string, { keys: string[]; labels: string[] }> = {
  hockey: { keys: ['gp', 'g', 'a', 'tp', 'pim'], labels: ['GP', 'G', 'A', 'TP', 'PIM'] },
  basketball: { keys: ['gp', 'ppg', 'pts'], labels: ['GP', 'PPG', 'PTS'] },
  soccer: { keys: ['gp', 'goals'], labels: ['GP', 'Goals'] },
  baseball: { keys: ['avg', 'hr', 'rbi'], labels: ['AVG', 'HR', 'RBI'] },
  football: { keys: ['gp', 'td', 'yds'], labels: ['GP', 'TD', 'YDS'] },
};

const STAT_DISPLAY_LIMIT = 8;

/* ---------- Helpers ---------- */

function getSportColor(sport: string): string {
  return SPORT_COLORS[sport.toLowerCase()] ?? DEFAULT_SPORT_COLOR;
}

function getStatDisplay(sport: string, stats: ScoutingPlayerStats): { keys: string[]; labels: string[] } {
  const config = STAT_DISPLAY[sport.toLowerCase()];
  if (config) return config;
  const keys = Object.keys(stats).slice(0, STAT_DISPLAY_LIMIT);
  return { keys, labels: keys.map((k) => k.toUpperCase()) };
}

function formatStat(value: string | number | undefined): string {
  if (value === undefined || value === null) return '-';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
  return String(value);
}

/* ---------- Player Card ---------- */

function PlayerCard({
  player,
  sportColor,
  statKeys,
  statLabels,
  expanded,
  onToggle,
}: {
  player: ScoutingPlayer;
  sportColor: string;
  statKeys: string[];
  statLabels: string[];
  expanded: boolean;
  onToggle: () => void;
}): React.ReactElement {
  return (
    <div
      className={cn(
        'bg-neutral-900/80 border rounded-2xl cursor-pointer transition-all duration-200',
        expanded ? 'border-neutral-600' : 'border-neutral-800 hover:border-neutral-700',
      )}
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
            style={{ color: sportColor, backgroundColor: `${sportColor}15` }}
          >
            {player.rank}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm truncate">{player.name}</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-0.5">
              <span className="font-mono">{player.team}</span>
              <span className="text-neutral-700">|</span>
              <span>{player.league.name}</span>
            </div>
          </div>
          <svg
            className={cn('h-4 w-4 text-neutral-600 transition-transform shrink-0', expanded && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Inline stat chips */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {statKeys.map((key, i) => (
            <div key={key} className="flex items-center gap-1 bg-neutral-800/60 rounded-lg px-2 py-1">
              <span className="text-[9px] font-mono text-neutral-500 uppercase">{statLabels[i]}</span>
              <span className="text-[11px] font-bold font-mono text-neutral-300">
                {formatStat(player.stats[key])}
              </span>
            </div>
          ))}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-neutral-800 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-800/40 rounded-xl p-3">
                <p className="text-[9px] font-mono text-neutral-600 uppercase mb-1">League</p>
                <p className="text-xs font-bold text-neutral-300">{player.league.name}</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  {player.league.code.toUpperCase()} &middot; {player.league.country}
                </p>
              </div>
              <div className="bg-neutral-800/40 rounded-xl p-3">
                <p className="text-[9px] font-mono text-neutral-600 uppercase mb-1">Season</p>
                <p className="text-xs font-bold text-neutral-300">{player.season}</p>
                {player.league.level && (
                  <p className="text-[10px] text-neutral-500 mt-0.5">{player.league.level}</p>
                )}
              </div>
            </div>

            {/* Full Stats Grid */}
            <div className="bg-neutral-800/30 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))] gap-0">
                {statKeys.map((key, i) => (
                  <div key={key} className="text-center p-2.5 border-b border-neutral-800/50">
                    <p className="text-[9px] font-mono text-neutral-600 uppercase">{statLabels[i]}</p>
                    <p className="text-lg font-black font-mono mt-0.5" style={{ color: sportColor }}>
                      {formatStat(player.stats[key])}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   MAIN VIEW
   ================================================================ */

export function PlayerStatsView(): React.ReactElement {
  const [selectedSport, setSelectedSport] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* Fetch available sports from the scouting API */
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

  /* Fetch players for the active sport or search query */
  const { data: response, isLoading: playersLoading, isError } = useQuery<PlayerResponse>({
    queryKey: ['fan-scouting-players', activeSport, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim());
        if (activeSport) params.set('sport', activeSport);
      } else if (activeSport) {
        params.set('sport', activeSport);
      }
      params.set('limit', '50');
      const res = await fetch(`/api/scouting/players?${params}`);
      if (!res.ok) throw new Error('Failed to fetch players');
      return res.json();
    },
    enabled: !!activeSport || !!searchTerm.trim(),
  });

  const players = response?.data ?? [];
  const totalPlayers = response?.meta?.total ?? 0;
  const firstPlayerStats = players[0]?.stats ?? {};
  const { keys: statKeys, labels: statLabels } = getStatDisplay(activeSport, firstPlayerStats);

  return (
    <div className="max-w-lg mx-auto space-y-4 p-6 bg-[#0f0f0f] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Player Stats</h1>
        <span className="text-[10px] font-mono text-neutral-600">
          {totalPlayers} players
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by player name..."
          className="w-full bg-neutral-900/60 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-neutral-600 transition-colors"
        />
      </div>

      {/* Sport Filter Tabs (fetched from API) */}
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
                onClick={() => {
                  setSelectedSport(s.sport);
                  setExpandedId(null);
                  setSearchTerm('');
                }}
                className={cn(
                  'shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all',
                  isActive
                    ? 'text-white shadow-sm'
                    : 'bg-neutral-800/60 text-neutral-500 hover:text-neutral-300',
                )}
                style={isActive ? { backgroundColor: color } : undefined}
              >
                {s.sport}
                <span className="ml-1 text-[9px] opacity-60">({s.leagueCount})</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Results info */}
      {!playersLoading && players.length > 0 && (
        <p className="text-[10px] text-neutral-600">
          Showing {players.length} of {totalPlayers} players
          {searchTerm.trim() ? ` matching "${searchTerm}"` : ` in ${activeSport}`}
        </p>
      )}

      {/* Player List */}
      {playersLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-neutral-800 rounded" />
                  <div className="h-3 w-20 bg-neutral-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-neutral-900/80 border border-red-900/30 rounded-2xl p-8 text-center">
          <p className="text-red-400 text-sm font-medium">Failed to load player data</p>
          <p className="text-neutral-600 text-xs mt-1">Check your connection and try again</p>
        </div>
      ) : players.length === 0 ? (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 text-center">
          <p className="text-neutral-500 text-sm">
            {searchTerm.trim() ? `No players found for "${searchTerm}"` : 'No player data available for this sport'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              sportColor={sportColor}
              statKeys={statKeys}
              statLabels={statLabels}
              expanded={expandedId === player.id}
              onToggle={() => setExpandedId(expandedId === player.id ? null : player.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
