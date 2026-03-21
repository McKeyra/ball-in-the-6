'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, AlertCircle, Users } from 'lucide-react';
import Link from 'next/link';

/* ---------- Types ---------- */

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

/* ---------- Stat display config per sport ---------- */

const STAT_COLUMNS: Record<string, { keys: string[]; labels: string[] }> = {
  hockey: { keys: ['gp', 'g', 'a', 'tp', 'pim'], labels: ['GP', 'G', 'A', 'TP', 'PIM'] },
  basketball: { keys: ['gp', 'ppg', 'pts'], labels: ['GP', 'PPG', 'PTS'] },
  soccer: { keys: ['gp', 'goals'], labels: ['GP', 'Goals'] },
  baseball: { keys: ['avg', 'hr', 'rbi', 'gp'], labels: ['AVG', 'HR', 'RBI', 'GP'] },
  football: { keys: ['gp', 'td', 'yds'], labels: ['GP', 'TD', 'YDS'] },
  volleyball: { keys: ['gp', 'kills', 'aces'], labels: ['GP', 'Kills', 'Aces'] },
  cricket: { keys: ['matches', 'runs', 'wickets'], labels: ['M', 'Runs', 'Wkts'] },
  rugby: { keys: ['gp', 'tries', 'points'], labels: ['GP', 'Tries', 'PTS'] },
  lacrosse: { keys: ['gp', 'g', 'a', 'tp'], labels: ['GP', 'G', 'A', 'TP'] },
};

function getStatConfig(sport: string): { keys: string[]; labels: string[] } {
  return STAT_COLUMNS[sport.toLowerCase()] ?? { keys: [], labels: [] };
}

function formatStatValue(value: string | number | undefined): string {
  if (value === undefined || value === null) return '-';
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(1);
  }
  return String(value);
}

function formatSportName(sport: string): string {
  if (sport.toLowerCase() === 'mma') return 'MMA';
  return sport
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/* ---------- Skeleton ---------- */

function TableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3 animate-pulse">
          <div className="h-4 bg-neutral-800 rounded w-6" />
          <div className="h-4 bg-neutral-800 rounded w-28" />
          <div className="h-4 bg-neutral-800/60 rounded w-20 ml-auto" />
        </div>
      ))}
    </div>
  );
}

/* ---------- Page ---------- */

export default function StandingsPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}): React.ReactElement {
  const resolvedParams = React.use(params);
  const sport = resolvedParams.sport;
  const displayName = formatSportName(sport);
  const statConfig = getStatConfig(sport);

  const {
    data: players,
    isLoading,
    isError,
    error,
  } = useQuery<ScoutingPlayer[]>({
    queryKey: ['scouting-players', sport],
    queryFn: async (): Promise<ScoutingPlayer[]> => {
      const res = await fetch(`/api/scouting/players?sport=${encodeURIComponent(sport)}&limit=50`);
      if (!res.ok) throw new Error('Failed to fetch players');
      const json: PlayerResponse = await res.json();
      return json.data;
    },
  });

  const playerList = players ?? [];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 pb-24 pt-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          href={`/sports/${sport}`}
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-300 transition-colors mb-4"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {displayName}
        </Link>

        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-neutral-400" />
          <h1 className="text-2xl font-bold tracking-tight">{displayName} Players</h1>
        </div>
        {!isLoading && !isError && (
          <p className="text-sm text-neutral-500 mt-1 ml-8">
            Top {playerList.length} players by rank
          </p>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="max-w-3xl mx-auto">
          <TableSkeleton />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 py-20 text-neutral-400">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-sm">{error instanceof Error ? error.message : 'Something went wrong'}</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && playerList.length === 0 && (
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 py-20 text-neutral-400">
          <Users className="h-8 w-8" />
          <p className="text-sm">No player data available for {displayName}.</p>
        </div>
      )}

      {/* Player table */}
      {!isLoading && !isError && playerList.length > 0 && (
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500 text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-3 w-10">#</th>
                <th className="text-left py-3 px-2">Player</th>
                <th className="text-left py-3 px-2">Team</th>
                <th className="text-left py-3 px-2 hidden sm:table-cell">League</th>
                {statConfig.labels.map((label) => (
                  <th key={label} className="text-right py-3 px-2 whitespace-nowrap">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playerList.map((player, idx) => (
                <tr
                  key={player.id}
                  className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors"
                >
                  <td className="py-3 px-3 text-neutral-600 tabular-nums text-xs">
                    {player.rank ?? idx + 1}
                  </td>
                  <td className="py-3 px-2 font-medium truncate max-w-[140px]">
                    {player.name}
                  </td>
                  <td className="py-3 px-2 text-neutral-400 truncate max-w-[120px]">
                    {player.team}
                  </td>
                  <td className="py-3 px-2 text-neutral-500 text-xs hidden sm:table-cell truncate max-w-[100px]">
                    {player.league.code}
                  </td>
                  {statConfig.keys.map((key) => (
                    <td key={key} className="py-3 px-2 text-right tabular-nums text-neutral-300">
                      {formatStatValue(player.stats[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Auto-detected stat columns info */}
          {statConfig.keys.length === 0 && (
            <div className="mt-6 text-center">
              <p className="text-xs text-neutral-600">
                Stat columns are not configured for this sport. Showing name, team, and league only.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
