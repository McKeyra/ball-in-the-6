'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2, AlertCircle, Globe, Layers, Calendar } from 'lucide-react';
import Link from 'next/link';

/* ---------- Types ---------- */

interface ScoutingLeague {
  id: string;
  sport: string;
  code: string;
  name: string;
  country: string;
  province: string | null;
  level: string | null;
  source: string;
  seasonCount: number;
  seasons: string[];
}

interface LeagueResponse {
  data: ScoutingLeague[];
  meta: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean };
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

function LeagueSkeleton(): React.ReactElement {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-neutral-800 rounded w-40" />
            <div className="h-3 bg-neutral-800/60 rounded w-12" />
          </div>
          <div className="mt-2 flex gap-2">
            <div className="h-3 bg-neutral-800/40 rounded w-16" />
            <div className="h-3 bg-neutral-800/40 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Page ---------- */

export default function SportDetailPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}): React.ReactElement {
  const resolvedParams = React.use(params);
  const sport = resolvedParams.sport;
  const sportColor = getSportColor(sport);
  const displayName = formatSportName(sport);

  const {
    data: leagues,
    isLoading,
    isError,
    error,
  } = useQuery<ScoutingLeague[]>({
    queryKey: ['scouting-leagues', sport],
    queryFn: async (): Promise<ScoutingLeague[]> => {
      const res = await fetch(`/api/scouting/leagues?sport=${encodeURIComponent(sport)}&limit=50`);
      if (!res.ok) throw new Error('Failed to fetch leagues');
      const json: LeagueResponse = await res.json();
      return json.data;
    },
  });

  const leagueList = leagues ?? [];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 pb-24 pt-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          href="/sports"
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-300 transition-colors mb-4"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          All Sports
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
            {!isLoading && !isError && (
              <p className="text-sm text-neutral-500 mt-1">
                {leagueList.length} {leagueList.length === 1 ? 'league' : 'leagues'} tracked
              </p>
            )}
          </div>
          <Link
            href={`/sports/${sport}/standings`}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
          >
            Players
          </Link>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="max-w-3xl mx-auto">
          <LeagueSkeleton />
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
      {!isLoading && !isError && leagueList.length === 0 && (
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 py-20 text-neutral-400">
          <Layers className="h-8 w-8" />
          <p className="text-sm">No leagues found for {displayName}.</p>
        </div>
      )}

      {/* League list */}
      {!isLoading && !isError && leagueList.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-2">
          {leagueList.map((league) => (
            <div
              key={league.id}
              className="group bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 transition-all hover:border-neutral-600"
            >
              {/* Name + code */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold truncate">{league.name}</h3>
                  <span
                    className="inline-block mt-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${sportColor}20`, color: sportColor }}
                  >
                    {league.code}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-neutral-500 shrink-0">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">{league.seasonCount} seasons</span>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {league.country}
                  {league.province ? ` / ${league.province}` : ''}
                </span>
                {league.level && (
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {league.level}
                  </span>
                )}
              </div>

              {/* Seasons */}
              {league.seasons.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {league.seasons.slice(0, 8).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800/80 text-neutral-400"
                    >
                      {s}
                    </span>
                  ))}
                  {league.seasons.length > 8 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800/40 text-neutral-600">
                      +{league.seasons.length - 8} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
