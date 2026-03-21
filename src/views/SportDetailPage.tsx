'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Trophy,
  Users,
  Database,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
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
  meta: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
}

interface ScoutingPlayer {
  id: string;
  rank: number;
  name: string;
  team: string;
  stats: Record<string, string | number | undefined>;
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
  meta: { page: number; limit: number; total: number; totalPages: number };
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
};

const STAT_COLUMNS: Record<string, { keys: string[]; labels: string[] }> = {
  hockey: { keys: ['gp', 'g', 'a', 'tp', 'pim'], labels: ['GP', 'G', 'A', 'TP', 'PIM'] },
  basketball: { keys: ['gp', 'ppg', 'pts'], labels: ['GP', 'PPG', 'PTS'] },
  soccer: { keys: ['gp', 'goals'], labels: ['GP', 'Goals'] },
  baseball: { keys: ['avg', 'hr', 'rbi', 'gp'], labels: ['AVG', 'HR', 'RBI', 'GP'] },
  football: { keys: ['gp', 'td', 'yds'], labels: ['GP', 'TD', 'YDS'] },
};

function getSportColor(sport: string): string {
  return SPORT_COLORS[sport.toLowerCase()] ?? '#c8ff00';
}

function capitalize(s: string): string {
  return s.split(/[\s-]+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatStat(value: string | number | undefined): string {
  if (value === undefined || value === null) return '-';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(1);
  return String(value);
}

/* ---------- Skeletons ---------- */

function LeagueGridSkeleton(): React.ReactElement {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 animate-pulse">
          <div className="h-4 w-40 bg-neutral-800 rounded mb-2" />
          <div className="h-3 w-24 bg-neutral-800 rounded mb-3" />
          <div className="h-6 w-20 bg-neutral-800 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function TopPlayersSkeleton(): React.ReactElement {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-neutral-900/60 rounded-xl p-3 animate-pulse flex items-center gap-3">
          <div className="h-6 w-6 bg-neutral-800 rounded" />
          <div className="h-4 w-28 bg-neutral-800 rounded" />
          <div className="flex-1" />
          <div className="h-4 w-16 bg-neutral-800 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ---------- League Card ---------- */

function LeagueCard({
  league,
  sportColor,
  sportId,
}: {
  league: ScoutingLeague;
  sportColor: string;
  sportId: string;
}): React.ReactElement {
  return (
    <Link
      href={`/sports/${sportId}/standings?league=${league.code}`}
      className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition-all duration-200 hover:border-neutral-700 hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white truncate group-hover:text-neutral-100">
            {league.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono uppercase text-neutral-500">{league.code}</span>
            {league.level && (
              <>
                <span className="text-neutral-700 text-[10px]">|</span>
                <span className="text-[10px] text-neutral-500">{league.level}</span>
              </>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-neutral-700 group-hover:text-neutral-400 shrink-0 mt-0.5" />
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="text-[10px] text-neutral-600">{league.country}</span>
        {league.province && (
          <>
            <span className="text-neutral-700 text-[10px]">|</span>
            <span className="text-[10px] text-neutral-600">{league.province}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ color: sportColor, backgroundColor: `${sportColor}12` }}
        >
          {league.seasonCount} seasons
        </span>
        {league.seasons[0] && (
          <span className="text-[10px] font-mono text-neutral-600">Latest: {league.seasons[0]}</span>
        )}
      </div>
    </Link>
  );
}

/* ---------- Top Players Section ---------- */

function TopPlayersPreview({
  sportId,
  sportColor,
}: {
  sportId: string;
  sportColor: string;
}): React.ReactElement {
  const { data: response, isLoading } = useQuery<PlayerResponse>({
    queryKey: ['sport-top-players', sportId],
    queryFn: async () => {
      const params = new URLSearchParams({ sport: sportId, limit: '10' });
      const res = await fetch(`/api/scouting/players?${params}`);
      if (!res.ok) throw new Error('Failed to fetch top players');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const players = response?.data ?? [];
  const statConfig = STAT_COLUMNS[sportId.toLowerCase()];

  if (isLoading) return <TopPlayersSkeleton />;
  if (players.length === 0) return <></>;

  // Derive stat columns from first player if no predefined config
  const statKeys = statConfig?.keys ?? (players[0] ? Object.keys(players[0].stats) : []);
  const statLabels = statConfig?.labels ?? statKeys.map((k) => k.toUpperCase());

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/50">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" style={{ color: sportColor }} />
          <h3 className="text-xs font-black text-white uppercase tracking-wider">Top Players</h3>
        </div>
        <Link
          href={`/sports/${sportId}/standings`}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors hover:opacity-70"
          style={{ color: sportColor }}
        >
          View All
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-neutral-800/50">
              <th className="text-left text-[9px] font-mono text-neutral-600 uppercase pl-4 pr-2 py-2 w-6">#</th>
              <th className="text-left text-[9px] font-mono text-neutral-600 uppercase px-2 py-2">Player</th>
              <th className="text-left text-[9px] font-mono text-neutral-600 uppercase px-2 py-2">Team</th>
              {statLabels.map((l) => (
                <th key={l} className="text-center text-[9px] font-mono text-neutral-600 uppercase px-2 py-2 w-12">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => (
              <tr
                key={player.id}
                className={cn('transition-colors hover:bg-neutral-800/30', i === 0 && 'bg-[var(--c)]/[0.04]')}
                style={{ '--c': sportColor } as React.CSSProperties}
              >
                <td className="pl-4 pr-2 py-2">
                  <span
                    className={cn('text-xs font-black', i === 0 ? '' : 'text-neutral-500')}
                    style={i === 0 ? { color: sportColor } : undefined}
                  >
                    {player.rank}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <span className={cn('text-xs font-bold', i === 0 ? 'text-white' : 'text-neutral-300')}>{player.name}</span>
                </td>
                <td className="px-2 py-2">
                  <span className="text-[11px] font-mono text-neutral-500">{player.team}</span>
                </td>
                {statKeys.map((key) => (
                  <td key={key} className="text-center px-2 py-2">
                    <span className={cn('text-xs font-mono', i === 0 ? 'font-bold text-white' : 'text-neutral-400')}>
                      {formatStat(player.stats[key])}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN DETAIL PAGE
   ================================================================ */

export const SportDetailPage: React.FC<{ sportId: string }> = ({ sportId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const sportColor = getSportColor(sportId);
  const sportName = capitalize(sportId);

  const { data: response, isLoading } = useQuery<LeagueResponse>({
    queryKey: ['sport-leagues', sportId, searchQuery, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        sport: sportId,
        page: String(page),
        limit: '20',
      });
      if (searchQuery) params.set('search', searchQuery);
      const res = await fetch(`/api/scouting/leagues?${params}`);
      if (!res.ok) throw new Error('Failed to fetch leagues');
      return res.json();
    },
  });

  const leagues = response?.data ?? [];
  const totalLeagues = response?.meta?.total ?? 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-neutral-800/60">
        <div className="px-4 pt-14 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/sports"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-800/80 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">{sportName}</h1>
              <p className="text-[10px] font-mono text-neutral-500">
                {totalLeagues} leagues
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Hero Banner */}
        <div
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ backgroundColor: `${sportColor}08` }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${sportColor}15` }}
              >
                <Trophy className="h-7 w-7" style={{ color: sportColor }} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{sportName}</h2>
                <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                  {totalLeagues} leagues &middot; Scouting data
                </p>
              </div>
            </div>

            <Link
              href={`/sports/${sportId}/standings`}
              className="inline-flex items-center gap-2 mt-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:shadow-lg active:scale-95"
              style={{ backgroundColor: sportColor }}
            >
              View Standings
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div
            className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: sportColor }}
          />
        </div>

        {/* Top Players Preview */}
        <TopPlayersPreview sportId={sportId} sportColor={sportColor} />

        {/* League Search */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" style={{ color: sportColor }} />
              <h3 className="text-sm font-black text-white uppercase tracking-wide">All Leagues</h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-600">{totalLeagues} total</span>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={`Search ${sportName.toLowerCase()} leagues...`}
              className="w-full bg-neutral-900/60 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
        </div>

        {/* League Grid */}
        {isLoading ? (
          <LeagueGridSkeleton />
        ) : leagues.length === 0 ? (
          <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl p-10 text-center">
            <Database className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No leagues found</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {leagues.map((league) => (
              <LeagueCard
                key={league.id}
                league={league}
                sportColor={sportColor}
                sportId={sportId}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {(response?.meta?.totalPages ?? 0) > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 bg-neutral-800 rounded-lg disabled:opacity-30 hover:bg-neutral-700 transition-colors"
            >
              Prev
            </button>
            <span className="text-[10px] font-mono text-neutral-500">
              {page} / {response?.meta?.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!response?.meta?.hasNext}
              className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 bg-neutral-800 rounded-lg disabled:opacity-30 hover:bg-neutral-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Back to hub */}
        <div className="pt-4 pb-4 flex justify-center">
          <Link
            href="/sports"
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-800 px-5 py-2.5 text-xs font-bold text-neutral-500 transition-all hover:border-neutral-600 hover:text-neutral-300"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            All Sports
          </Link>
        </div>
      </div>
    </div>
  );
};
