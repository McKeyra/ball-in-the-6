'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Trophy,
  Users,
  Database,
  Filter,
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
  meta: { page: number; limit: number; total: number; totalPages: number };
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

function TableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-neutral-900/60 rounded-xl p-3 animate-pulse flex items-center gap-3">
          <div className="h-5 w-5 bg-neutral-800 rounded" />
          <div className="h-4 w-32 bg-neutral-800 rounded" />
          <div className="flex-1" />
          <div className="h-4 w-12 bg-neutral-800 rounded" />
          <div className="h-4 w-12 bg-neutral-800 rounded" />
          <div className="h-4 w-12 bg-neutral-800 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ---------- League Player Group ---------- */

function LeaguePlayerGroup({
  leagueName,
  leagueCode,
  players,
  sportColor,
  statKeys,
  statLabels,
}: {
  leagueName: string;
  leagueCode: string;
  players: ScoutingPlayer[];
  sportColor: string;
  statKeys: string[];
  statLabels: string[];
}): React.ReactElement {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
      {/* League Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/50"
        style={{ backgroundColor: `${sportColor}06` }}
      >
        <div className="flex items-center gap-2">
          <Trophy className="h-3.5 w-3.5" style={{ color: sportColor }} />
          <h3 className="text-xs font-black text-white uppercase tracking-wider">{leagueName}</h3>
        </div>
        <span className="text-[9px] font-mono text-neutral-600 uppercase">{leagueCode}</span>
      </div>

      {/* Player Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[450px]">
          <thead>
            <tr className="border-b border-neutral-800/30">
              <th className="text-left text-[9px] font-mono text-neutral-600 uppercase pl-4 pr-2 py-2 w-6">#</th>
              <th className="text-left text-[9px] font-mono text-neutral-600 uppercase px-2 py-2">Player</th>
              <th className="text-left text-[9px] font-mono text-neutral-600 uppercase px-2 py-2">Team</th>
              <th className="text-left text-[9px] font-mono text-neutral-600 uppercase px-2 py-2 w-20">Season</th>
              {statLabels.map((label) => (
                <th key={label} className="text-center text-[9px] font-mono text-neutral-600 uppercase px-2 py-2 w-12">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => (
              <tr
                key={player.id}
                className={cn(
                  'transition-colors hover:bg-neutral-800/30',
                  i === 0 && 'bg-[var(--c)]/[0.03]',
                )}
                style={{ '--c': sportColor } as React.CSSProperties}
              >
                <td className="pl-4 pr-2 py-2.5">
                  <span
                    className={cn('text-xs font-black', i === 0 ? '' : 'text-neutral-500')}
                    style={i === 0 ? { color: sportColor } : undefined}
                  >
                    {player.rank}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <span className={cn('text-xs font-bold', i === 0 ? 'text-white' : 'text-neutral-300')}>
                    {player.name}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <span className="text-[11px] font-mono text-neutral-500">{player.team}</span>
                </td>
                <td className="px-2 py-2.5">
                  <span className="text-[10px] font-mono text-neutral-600">{player.season}</span>
                </td>
                {statKeys.map((key) => (
                  <td key={key} className="text-center px-2 py-2.5">
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
   MAIN STANDINGS PAGE
   ================================================================ */

export const StandingsPage: React.FC<{ sportId: string }> = ({ sportId }) => {
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [playerSearch, setPlayerSearch] = useState('');
  const [playerPage, setPlayerPage] = useState(1);

  const sportColor = getSportColor(sportId);
  const sportName = capitalize(sportId);

  // Get league param from URL search params (if linked from sport detail)
  const urlLeague = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('league')
    : null;

  const activeLeagueCode = selectedLeague || urlLeague || '';

  // Fetch leagues for this sport
  const { data: leaguesResponse, isLoading: leaguesLoading } = useQuery<LeagueResponse>({
    queryKey: ['standings-leagues', sportId],
    queryFn: async () => {
      const params = new URLSearchParams({ sport: sportId, limit: '50' });
      const res = await fetch(`/api/scouting/leagues?${params}`);
      if (!res.ok) throw new Error('Failed to fetch leagues');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const leagues = leaguesResponse?.data ?? [];

  // Fetch players (filtered by league if selected, otherwise all for sport)
  const { data: playersResponse, isLoading: playersLoading } = useQuery<PlayerResponse>({
    queryKey: ['standings-players', sportId, activeLeagueCode, playerSearch, playerPage],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '50', page: String(playerPage) });
      if (activeLeagueCode) {
        params.set('leagueCode', activeLeagueCode);
      } else {
        params.set('sport', sportId);
      }
      if (playerSearch) params.set('search', playerSearch);
      const res = await fetch(`/api/scouting/players?${params}`);
      if (!res.ok) throw new Error('Failed to fetch players');
      return res.json();
    },
  });

  const players = playersResponse?.data ?? [];
  const totalPlayers = playersResponse?.meta?.total ?? 0;

  // Determine stat columns
  const statConfig = STAT_COLUMNS[sportId.toLowerCase()];
  const firstStats = players[0]?.stats ?? {};
  const statKeys = statConfig?.keys ?? Object.keys(firstStats);
  const statLabels = statConfig?.labels ?? statKeys.map((k) => k.toUpperCase());

  // Group players by league for display
  const groupedByLeague = useMemo(() => {
    if (activeLeagueCode) return null; // Don't group when filtering by single league

    const groups: Record<string, { name: string; code: string; players: ScoutingPlayer[] }> = {};
    for (const player of players) {
      const key = player.league.code;
      if (!groups[key]) {
        groups[key] = { name: player.league.name, code: player.league.code, players: [] };
      }
      groups[key].players.push(player);
    }
    return Object.values(groups);
  }, [players, activeLeagueCode]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-neutral-800/60">
        <div className="px-4 pt-14 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href={`/sports/${sportId}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-800/80 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">
                {sportName} Standings
              </h1>
              <p className="text-[10px] font-mono text-neutral-500">
                {totalPlayers} players
                {activeLeagueCode ? ` in ${activeLeagueCode.toUpperCase()}` : ` across ${leagues.length} leagues`}
              </p>
            </div>
          </div>

          {/* League Filter */}
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setSelectedLeague('');
                  setPlayerPage(1);
                }}
                className={cn(
                  'shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all',
                  !activeLeagueCode
                    ? 'text-white shadow-sm'
                    : 'bg-neutral-800/60 text-neutral-500 hover:text-neutral-300',
                )}
                style={!activeLeagueCode ? { backgroundColor: sportColor } : undefined}
              >
                All
              </button>
              {leaguesLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-7 w-14 bg-neutral-800 rounded-xl animate-pulse shrink-0" />
                  ))
                : leagues.map((league) => (
                    <button
                      key={league.code}
                      type="button"
                      onClick={() => {
                        setSelectedLeague(league.code);
                        setPlayerPage(1);
                      }}
                      className={cn(
                        'shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all',
                        activeLeagueCode === league.code
                          ? 'text-white shadow-sm'
                          : 'bg-neutral-800/60 text-neutral-500 hover:text-neutral-300',
                      )}
                      style={activeLeagueCode === league.code ? { backgroundColor: sportColor } : undefined}
                    >
                      {league.code}
                    </button>
                  ))}
            </div>
          </div>

          {/* Player Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
            <input
              type="text"
              value={playerSearch}
              onChange={(e) => {
                setPlayerSearch(e.target.value);
                setPlayerPage(1);
              }}
              placeholder="Search players..."
              className="w-full bg-neutral-900/60 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-5 space-y-4">
        {playersLoading ? (
          <TableSkeleton />
        ) : players.length === 0 ? (
          <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl p-10 text-center">
            <Database className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No player data found</p>
            <p className="text-neutral-600 text-[11px] mt-1">Try a different league or search term</p>
          </div>
        ) : groupedByLeague ? (
          // Grouped view (all leagues)
          <div className="space-y-4">
            {groupedByLeague.map((group) => (
              <LeaguePlayerGroup
                key={group.code}
                leagueName={group.name}
                leagueCode={group.code}
                players={group.players}
                sportColor={sportColor}
                statKeys={statKeys}
                statLabels={statLabels}
              />
            ))}
          </div>
        ) : (
          // Single league table
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="text-left text-[9px] font-mono text-neutral-600 uppercase pl-4 pr-2 py-3 w-6">#</th>
                    <th className="text-left text-[9px] font-mono text-neutral-600 uppercase px-2 py-3">Player</th>
                    <th className="text-left text-[9px] font-mono text-neutral-600 uppercase px-2 py-3">Team</th>
                    <th className="text-left text-[9px] font-mono text-neutral-600 uppercase px-2 py-3 w-20">Season</th>
                    {statLabels.map((label) => (
                      <th key={label} className="text-center text-[9px] font-mono text-neutral-600 uppercase px-2 py-3 w-14">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, i) => (
                    <tr
                      key={player.id}
                      className={cn(
                        'transition-colors hover:bg-neutral-800/30',
                        i === 0 && 'bg-[var(--c)]/[0.04]',
                      )}
                      style={{ '--c': sportColor } as React.CSSProperties}
                    >
                      <td className="pl-4 pr-2 py-2.5">
                        <span
                          className={cn('text-xs font-black', i === 0 ? '' : 'text-neutral-500')}
                          style={i === 0 ? { color: sportColor } : undefined}
                        >
                          {player.rank}
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <span className={cn('text-xs font-bold', i === 0 ? 'text-white' : 'text-neutral-300')}>
                          {player.name}
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <span className="text-[11px] font-mono text-neutral-500">{player.team}</span>
                      </td>
                      <td className="px-2 py-2.5">
                        <span className="text-[10px] font-mono text-neutral-600">{player.season}</span>
                      </td>
                      {statKeys.map((key) => (
                        <td key={key} className="text-center px-2 py-2.5">
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
        )}

        {/* Pagination */}
        {(playersResponse?.meta?.totalPages ?? 0) > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPlayerPage((p) => Math.max(1, p - 1))}
              disabled={playerPage <= 1}
              className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 bg-neutral-800 rounded-lg disabled:opacity-30 hover:bg-neutral-700 transition-colors"
            >
              Prev
            </button>
            <span className="text-[10px] font-mono text-neutral-500">
              {playerPage} / {playersResponse?.meta?.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPlayerPage((p) => p + 1)}
              disabled={!playersResponse?.meta?.hasNext}
              className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 bg-neutral-800 rounded-lg disabled:opacity-30 hover:bg-neutral-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Back Links */}
        <div className="pt-4 pb-4 flex justify-center gap-3">
          <Link
            href={`/sports/${sportId}`}
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-800 px-5 py-2.5 text-xs font-bold text-neutral-500 transition-all hover:border-neutral-600 hover:text-neutral-300"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            {sportName}
          </Link>
          <Link
            href="/sports"
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-800 px-5 py-2.5 text-xs font-bold text-neutral-500 transition-all hover:border-neutral-600 hover:text-neutral-300"
          >
            All Sports
          </Link>
        </div>
      </div>
    </div>
  );
};
