'use client';

import { useQuery } from '@tanstack/react-query';
import { Trophy, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

/* ---------- Types ---------- */

interface SportSummary {
  sport: string;
  leagueCount: number;
}

interface SportSummaryResponse {
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
  lacrosse: '#D97706',
  tennis: '#EC4899',
  golf: '#22C55E',
  swimming: '#0EA5E9',
  track: '#F59E0B',
  boxing: '#DC2626',
  mma: '#7C3AED',
};

function getSportColor(sport: string): string {
  return SPORT_COLORS[sport.toLowerCase()] ?? '#6B7280';
}

function formatSportName(sport: string): string {
  if (sport.toLowerCase() === 'mma') return 'MMA';
  return sport
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/* ---------- Skeleton ---------- */

function CardSkeleton(): React.ReactElement {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 animate-pulse">
      <div className="h-5 bg-neutral-800 rounded w-24 mb-3" />
      <div className="h-4 bg-neutral-800/60 rounded w-16" />
    </div>
  );
}

/* ---------- Page ---------- */

export default function SportsHubPage(): React.ReactElement {
  const {
    data: sports,
    isLoading,
    isError,
    error,
  } = useQuery<SportSummary[]>({
    queryKey: ['scouting-sport-summary'],
    queryFn: async (): Promise<SportSummary[]> => {
      const res = await fetch('/api/scouting/leagues?summary=sports');
      if (!res.ok) throw new Error('Failed to fetch sports summary');
      const json: SportSummaryResponse = await res.json();
      return json.data;
    },
  });

  const sorted = (sports ?? []).sort((a, b) => b.leagueCount - a.leagueCount);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 pb-24 pt-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-6 w-6 text-amber-400" />
          <h1 className="text-2xl font-bold tracking-tight">Sports Hub</h1>
        </div>
        <p className="text-neutral-400 text-sm">
          Explore scouting data across every sport we track. Tap a sport to see leagues, players, and standings.
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 py-20 text-neutral-400">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-sm">{error instanceof Error ? error.message : 'Something went wrong'}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && sorted.length === 0 && (
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 py-20 text-neutral-400">
          <Trophy className="h-8 w-8" />
          <p className="text-sm">No sports data available yet.</p>
        </div>
      )}

      {/* Sports grid */}
      {!isLoading && !isError && sorted.length > 0 && (
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sorted.map((s) => {
            const color = getSportColor(s.sport);
            const slug = s.sport.toLowerCase().replace(/\s+/g, '-');

            return (
              <Link
                key={s.sport}
                href={`/sports/${slug}`}
                className="group relative bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 transition-all hover:border-neutral-600 hover:bg-neutral-900/80"
              >
                {/* Accent bar */}
                <div
                  className="absolute top-0 left-4 right-4 h-[2px] rounded-b-full opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: color }}
                />

                <h2 className="text-base font-semibold mb-1 tracking-tight">
                  {formatSportName(s.sport)}
                </h2>
                <p className="text-xs text-neutral-500">
                  {s.leagueCount} {s.leagueCount === 1 ? 'league' : 'leagues'}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      {/* Total count */}
      {!isLoading && !isError && sorted.length > 0 && (
        <div className="max-w-3xl mx-auto mt-6 text-center">
          <p className="text-xs text-neutral-600">
            {sorted.length} sports &middot;{' '}
            {sorted.reduce((sum, s) => sum + s.leagueCount, 0)} total leagues
          </p>
        </div>
      )}
    </div>
  );
}
