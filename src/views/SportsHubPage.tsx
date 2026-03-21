'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  Crown,
  ArrowRight,
  Database,
  Loader2,
} from 'lucide-react';
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
  swimming: '#0EA5E9',
  tennis: '#EC4899',
  golf: '#84CC16',
  track: '#F59E0B',
  boxing: '#DC2626',
  mma: '#7C3AED',
  curling: '#6366F1',
  wrestling: '#B91C1C',
  'field hockey': '#14B8A6',
  softball: '#E11D48',
  badminton: '#A855F7',
  'figure skating': '#F472B6',
  skiing: '#38BDF8',
  snowboarding: '#818CF8',
  rowing: '#22D3EE',
  sailing: '#2DD4BF',
};

function getSportColor(sport: string): string {
  return SPORT_COLORS[sport.toLowerCase()] ?? '#c8ff00';
}

function capitalize(s: string): string {
  return s
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/* ---------- Skeleton ---------- */

function SportGridSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 animate-pulse">
          <div className="h-12 w-12 bg-neutral-800 rounded-2xl mb-3" />
          <div className="h-4 w-20 bg-neutral-800 rounded mb-2" />
          <div className="h-3 w-14 bg-neutral-800 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ---------- Sport Card ---------- */

function SportCard({
  sport,
  leagueCount,
}: {
  sport: string;
  leagueCount: number;
}): React.ReactElement {
  const color = getSportColor(sport);
  const displayName = capitalize(sport);

  return (
    <Link
      href={`/sports/${sport.toLowerCase()}`}
      className="group relative rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition-all duration-200 hover:border-neutral-700 hover:shadow-lg hover:shadow-[var(--sport-color)]/5"
      style={{ '--sport-color': color } as React.CSSProperties}
    >
      {/* Sport Icon Circle */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl mb-3 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${color}15` }}
      >
        <span className="text-lg font-black" style={{ color }}>
          {displayName.charAt(0)}
        </span>
      </div>

      <h3 className="text-sm font-black text-white tracking-tight">{displayName}</h3>
      <p className="text-[10px] font-mono text-neutral-500 mt-1">
        {leagueCount} {leagueCount === 1 ? 'league' : 'leagues'}
      </p>

      {/* Hover indicator */}
      <ArrowRight
        className="absolute top-5 right-5 h-4 w-4 text-neutral-700 transition-all group-hover:text-neutral-400 group-hover:translate-x-0.5"
      />

      {/* Accent glow */}
      <div
        className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full blur-3xl opacity-0 transition-opacity group-hover:opacity-10"
        style={{ backgroundColor: color }}
      />
    </Link>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */

export const SportsHubPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: response, isLoading } = useQuery<SportSummaryResponse>({
    queryKey: ['scouting-sport-summary'],
    queryFn: async () => {
      const res = await fetch('/api/scouting/leagues?summary=sports');
      if (!res.ok) throw new Error('Failed to fetch sport summary');
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });

  const sports = response?.data ?? [];

  // Sort by league count descending
  const sortedSports = [...sports].sort((a, b) => b.leagueCount - a.leagueCount);

  // Filter by search
  const filteredSports = searchQuery
    ? sortedSports.filter((s) => s.sport.toLowerCase().includes(searchQuery.toLowerCase()))
    : sortedSports;

  const totalLeagues = sports.reduce((sum, s) => sum + s.leagueCount, 0);
  const totalSports = sports.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-neutral-800/60">
        <div className="px-4 pt-14 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Sports</h1>
              <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                {totalSports} sports &middot; {totalLeagues} leagues &middot; 34K+ athletes
              </p>
            </div>
            <Crown className="h-5 w-5 text-[#c8ff00]/40" />
          </div>

          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sports..."
            className="w-full bg-neutral-900/60 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm rounded-2xl px-4 py-3 focus:outline-none focus:border-neutral-600 transition-colors"
          />
        </div>
      </div>

      <div className="px-4 pt-5">
        {isLoading ? (
          <SportGridSkeleton />
        ) : filteredSports.length === 0 ? (
          <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl p-10 text-center">
            <Database className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No sports found</p>
            {searchQuery && (
              <p className="text-neutral-600 text-[11px] mt-1">Try a different search term</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredSports.map((sport) => (
              <SportCard
                key={sport.sport}
                sport={sport.sport}
                leagueCount={sport.leagueCount}
              />
            ))}
          </div>
        )}

        {/* Summary banner */}
        {!isLoading && filteredSports.length > 0 && (
          <div className="mt-6 rounded-2xl border border-[#c8ff00]/10 bg-[#c8ff00]/[0.03] p-5 text-center">
            <h3 className="text-sm font-black text-white mb-1">
              {totalLeagues} Scouting Leagues Across {totalSports} Sports
            </h3>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              Real player stats and rankings sourced from EliteProspects, USports, and more.
              Select a sport to browse leagues and player data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
