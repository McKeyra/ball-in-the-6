'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Brain,
  Search,
  ChevronRight,
  Trophy,
  Users,
  Database,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ---------- Types ---------- */

interface SportSummary {
  sport: string;
  leagueCount: number;
}

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
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
  };
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
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
  };
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
  swimming: '#0EA5E9',
  golf: '#22C55E',
};

const STAT_COLUMNS: Record<string, { keys: string[]; labels: string[] }> = {
  hockey: { keys: ['gp', 'g', 'a', 'tp', 'pim'], labels: ['GP', 'G', 'A', 'TP', 'PIM'] },
  basketball: { keys: ['gp', 'ppg', 'pts'], labels: ['GP', 'PPG', 'PTS'] },
  soccer: { keys: ['gp', 'goals'], labels: ['GP', 'Goals'] },
  baseball: { keys: ['avg', 'hr', 'rbi', 'gp'], labels: ['AVG', 'HR', 'RBI', 'GP'] },
  football: { keys: ['gp', 'td', 'yds'], labels: ['GP', 'TD', 'YDS'] },
};

function getSportColor(sport: string): string {
  return SPORT_COLORS[sport.toLowerCase()] ?? '#6B7280';
}

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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ---------- Loading / Error States ---------- */

function LoadingState({ message }: { message?: string }): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
      <p className="text-sm text-neutral-500">{message ?? 'Loading scouting data...'}</p>
    </div>
  );
}

function ErrorState({ message }: { message?: string }): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <AlertCircle className="h-8 w-8 text-red-500/70" />
      <p className="text-sm text-red-400">{message ?? 'Failed to load data'}</p>
    </div>
  );
}

/* ---------- Skeleton Components ---------- */

function LeagueSkeleton(): React.ReactElement {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-48 bg-neutral-800 rounded" />
              <div className="h-3 w-24 bg-neutral-800 rounded" />
            </div>
            <div className="h-6 w-16 bg-neutral-800 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PlayerSkeleton(): React.ReactElement {
  return (
    <div className="space-y-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-neutral-900/60 rounded-xl p-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-neutral-800 rounded" />
            <div className="h-4 w-32 bg-neutral-800 rounded" />
            <div className="flex-1" />
            <div className="h-4 w-20 bg-neutral-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Overview Panel ---------- */

function OverviewPanel({ sports }: { sports: SportSummary[] }): React.ReactElement {
  const totalLeagues = sports.reduce((sum, s) => sum + s.leagueCount, 0);
  const sorted = [...sports].sort((a, b) => b.leagueCount - a.leagueCount);

  return (
    <div className="space-y-5">
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c8ff00]/10 border border-[#c8ff00]/20">
            <Database className="h-5 w-5 text-[#c8ff00]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Scouting Database</h2>
            <p className="text-xs text-neutral-500">
              {totalLeagues.toLocaleString()} leagues across {sports.length} sports
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {sorted.map((s) => {
          const color = getSportColor(s.sport);
          return (
            <div
              key={s.sport}
              className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 hover:bg-neutral-900/80 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-bold text-neutral-300 capitalize">{s.sport}</span>
              </div>
              <div className="text-2xl font-black text-white">{s.leagueCount}</div>
              <div className="text-[9px] uppercase tracking-wider text-neutral-600 mt-1">leagues</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- League List ---------- */

function LeagueList({
  leagues,
  selectedLeague,
  onSelect,
  sportColor,
}: {
  leagues: ScoutingLeague[];
  selectedLeague: ScoutingLeague | null;
  onSelect: (league: ScoutingLeague) => void;
  sportColor: string;
}): React.ReactElement {
  if (leagues.length === 0) {
    return (
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 text-center">
        <Database className="h-8 w-8 text-neutral-600 mx-auto mb-3" />
        <p className="text-neutral-500 text-sm">No leagues found for this sport</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {leagues.map((league) => {
        const isSelected = selectedLeague?.id === league.id;
        return (
          <button
            key={league.id}
            type="button"
            onClick={() => onSelect(league)}
            className={cn(
              'w-full text-left rounded-2xl border p-4 transition-all duration-200',
              isSelected
                ? 'border-neutral-600 bg-neutral-800/60'
                : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900/80',
            )}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={cn('text-sm font-bold truncate', isSelected ? 'text-white' : 'text-neutral-300')}
                  >
                    {league.name}
                  </h3>
                  {league.level && (
                    <span className="shrink-0 text-[9px] font-mono uppercase tracking-wider text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded">
                      {league.level}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">{league.code}</span>
                  <span className="text-neutral-700 text-[10px]">|</span>
                  <span className="text-[10px] text-neutral-500">{league.country}</span>
                  {league.province && (
                    <>
                      <span className="text-neutral-700 text-[10px]">|</span>
                      <span className="text-[10px] text-neutral-500">{league.province}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{
                    color: sportColor,
                    backgroundColor: `${sportColor}15`,
                  }}
                >
                  {league.seasonCount} {league.seasonCount === 1 ? 'season' : 'seasons'}
                </span>
                <ChevronRight
                  className={cn('h-4 w-4 transition-colors', isSelected ? 'text-neutral-400' : 'text-neutral-700')}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Season Selector ---------- */

function SeasonSelector({
  seasons,
  selected,
  onSelect,
  sportColor,
}: {
  seasons: string[];
  selected: string;
  onSelect: (season: string) => void;
  sportColor: string;
}): React.ReactElement {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
      {seasons.map((season) => (
        <button
          key={season}
          type="button"
          onClick={() => onSelect(season)}
          className={cn(
            'shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all',
            selected === season
              ? 'text-white shadow-sm'
              : 'bg-neutral-800/60 text-neutral-500 hover:text-neutral-300',
          )}
          style={selected === season ? { backgroundColor: sportColor } : undefined}
        >
          {season}
        </button>
      ))}
    </div>
  );
}

/* ---------- Player Stats Table ---------- */

function PlayerStatsTable({
  players,
  sport,
  sportColor,
  isLoading,
}: {
  players: ScoutingPlayer[];
  sport: string;
  sportColor: string;
  isLoading: boolean;
}): React.ReactElement {
  if (isLoading) return <PlayerSkeleton />;

  const config = getStatConfig(sport);

  const statKeys = config.keys.length > 0
    ? config.keys
    : players.length > 0
      ? Object.keys(players[0].stats)
      : [];

  const statLabels = config.labels.length > 0
    ? config.labels
    : statKeys.map((k) => k.toUpperCase());

  if (players.length === 0) {
    return (
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 text-center">
        <Users className="h-8 w-8 text-neutral-600 mx-auto mb-3" />
        <p className="text-neutral-500 text-sm">No players found</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left text-[9px] font-mono text-neutral-600 uppercase tracking-wider pl-4 pr-2 py-3 w-8">#</th>
              <th className="text-left text-[9px] font-mono text-neutral-600 uppercase tracking-wider px-2 py-3">Player</th>
              <th className="text-left text-[9px] font-mono text-neutral-600 uppercase tracking-wider px-2 py-3">Team</th>
              {statLabels.map((label) => (
                <th key={label} className="text-center text-[9px] font-mono text-neutral-600 uppercase tracking-wider px-2 py-3 w-14">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => (
              <tr
                key={player.id}
                className="transition-colors hover:bg-neutral-800/40"
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
                  <span className="text-[11px] text-neutral-500 font-mono">{player.team}</span>
                </td>
                {statKeys.map((key) => (
                  <td key={key} className="text-center px-2 py-2.5">
                    <span
                      className={cn('text-xs font-mono', i === 0 ? 'font-bold text-white' : 'text-neutral-400')}
                    >
                      {formatStatValue(player.stats[key])}
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

/* ---------- Top Players Panel (no league selected) ---------- */

function TopPlayersPanel({
  sport,
  sportColor,
  playerSearch,
  setPlayerSearch,
}: {
  sport: string;
  sportColor: string;
  playerSearch: string;
  setPlayerSearch: (v: string) => void;
}): React.ReactElement {
  const { data, isLoading, isError } = useQuery<PlayerResponse>({
    queryKey: ['scouting-top-players', sport, playerSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        sport,
        limit: '20',
      });
      if (playerSearch) params.set('search', playerSearch);
      const res = await fetch(`/api/scouting/players?${params}`);
      if (!res.ok) throw new Error('Failed to fetch players');
      return res.json();
    },
  });

  if (isError) return <ErrorState message={`Could not load ${sport} players`} />;

  const players = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" style={{ color: sportColor }} />
          <h2 className="text-sm font-black text-white uppercase tracking-wide">
            Top {capitalize(sport)} Players
          </h2>
        </div>
        {!isLoading && (
          <span className="text-[10px] font-mono text-neutral-600">
            {total.toLocaleString()} total
          </span>
        )}
      </div>

      {/* Player Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
        <input
          type="text"
          value={playerSearch}
          onChange={(e) => setPlayerSearch(e.target.value)}
          placeholder="Search players by name..."
          className="w-full bg-neutral-900/60 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-neutral-600 transition-colors"
        />
      </div>

      <PlayerStatsTable
        players={players}
        sport={sport}
        sportColor={sportColor}
        isLoading={isLoading}
      />
    </div>
  );
}

/* ================================================================
   MAIN INTELLIGENCE PAGE
   ================================================================ */

export function IntelligencePage(): React.ReactElement {
  const [activeSport, setActiveSport] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState<ScoutingLeague | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [leagueSearch, setLeagueSearch] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');
  const [leaguePage, setLeaguePage] = useState(1);

  // Fetch sport summary from API
  const {
    data: sports = [],
    isLoading: sportsLoading,
    isError: sportsError,
  } = useQuery<SportSummary[]>({
    queryKey: ['scouting-sport-summary'],
    queryFn: async () => {
      const res = await fetch('/api/scouting/leagues?summary=sports');
      if (!res.ok) throw new Error('Failed to fetch sport summary');
      const json = await res.json() as { data: SportSummary[] };
      return json.data;
    },
  });

  // Auto-select the first sport once loaded
  const sortedSports = [...sports].sort((a, b) => b.leagueCount - a.leagueCount);
  const resolvedSport = activeSport || (sortedSports.length > 0 ? sortedSports[0].sport : '');
  const activeColor = getSportColor(resolvedSport);
  const totalLeagues = sports.reduce((sum, s) => sum + s.leagueCount, 0);

  // Fetch leagues for selected sport
  const leaguesQuery = useQuery<LeagueResponse>({
    queryKey: ['scouting-leagues', resolvedSport, leagueSearch, leaguePage],
    queryFn: async () => {
      const params = new URLSearchParams({
        sport: resolvedSport,
        page: String(leaguePage),
        limit: '50',
      });
      if (leagueSearch) params.set('search', leagueSearch);
      const res = await fetch(`/api/scouting/leagues?${params}`);
      if (!res.ok) throw new Error('Failed to fetch leagues');
      return res.json();
    },
    enabled: !!resolvedSport,
  });

  // Fetch players for selected league + season
  const playersQuery = useQuery<PlayerResponse>({
    queryKey: ['scouting-league-players', selectedLeague?.code, selectedSeason, playerSearch],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '50' });
      if (selectedLeague) params.set('leagueCode', selectedLeague.code);
      if (selectedSeason) params.set('season', selectedSeason);
      if (playerSearch) params.set('search', playerSearch);
      const res = await fetch(`/api/scouting/players?${params}`);
      if (!res.ok) throw new Error('Failed to fetch players');
      return res.json();
    },
    enabled: !!selectedLeague && !!selectedSeason,
  });

  const leagues = leaguesQuery.data?.data ?? [];
  const leaguePlayers = playersQuery.data?.data ?? [];
  const leagueTotal = leaguesQuery.data?.meta?.total ?? 0;
  const leagueTotalPages = leaguesQuery.data?.meta?.totalPages ?? 0;

  const handleSportChange = (sport: string): void => {
    setActiveSport(sport);
    setSelectedLeague(null);
    setSelectedSeason('');
    setLeagueSearch('');
    setPlayerSearch('');
    setLeaguePage(1);
  };

  const handleLeagueSelect = (league: ScoutingLeague): void => {
    setSelectedLeague(league);
    setSelectedSeason(league.seasons[0] ?? '');
    setPlayerSearch('');
  };

  // Top-level loading state
  if (sportsLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <LoadingState message="Connecting to scouting database..." />
      </div>
    );
  }

  if (sportsError) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <ErrorState message="Could not connect to scouting API" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0f0f0f]/90 backdrop-blur-2xl border-b border-neutral-800/60">
        <div className="mx-auto max-w-3xl px-4 pt-14 pb-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c8ff00]/10 border border-[#c8ff00]/20">
              <Brain className="h-5 w-5 text-[#c8ff00]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Scouting Intelligence</h1>
              <p className="text-[11px] text-neutral-500">
                {totalLeagues.toLocaleString()} leagues &middot; {sports.length} sports
              </p>
            </div>
          </div>

          {/* Sport tabs from API */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
            {sortedSports.map((s) => {
              const isActive = resolvedSport === s.sport;
              const color = getSportColor(s.sport);
              return (
                <button
                  key={s.sport}
                  type="button"
                  onClick={() => handleSportChange(s.sport)}
                  className={cn(
                    'shrink-0 px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap',
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-neutral-500 hover:text-neutral-300 bg-neutral-900/40',
                  )}
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  {s.sport}
                  <span className={cn(
                    'ml-1.5 text-[9px] font-mono',
                    isActive ? 'text-white/60' : 'text-neutral-600',
                  )}>
                    {s.leagueCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-5 space-y-5">
        {/* Overview summary when no sport-specific view yet */}
        {!resolvedSport ? (
          <OverviewPanel sports={sports} />
        ) : (
          <>
            {/* League Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
              <input
                type="text"
                value={leagueSearch}
                onChange={(e) => {
                  setLeagueSearch(e.target.value);
                  setLeaguePage(1);
                }}
                placeholder={`Search ${resolvedSport} leagues...`}
                className="w-full bg-neutral-900/60 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            {/* Two-Column Layout: Leagues + Players */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* League Browser */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" style={{ color: activeColor }} />
                    <h2 className="text-sm font-black text-white uppercase tracking-wide">Leagues</h2>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600">
                    {leagueTotal} found
                  </span>
                </div>

                {leaguesQuery.isLoading ? (
                  <LeagueSkeleton />
                ) : leaguesQuery.isError ? (
                  <ErrorState message={`Could not load ${resolvedSport} leagues`} />
                ) : (
                  <LeagueList
                    leagues={leagues}
                    selectedLeague={selectedLeague}
                    onSelect={handleLeagueSelect}
                    sportColor={activeColor}
                  />
                )}

                {/* Pagination */}
                {leagueTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setLeaguePage((p) => Math.max(1, p - 1))}
                      disabled={leaguePage <= 1}
                      className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 bg-neutral-800 rounded-lg disabled:opacity-30 hover:bg-neutral-700 transition-colors"
                    >
                      Prev
                    </button>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {leaguePage} / {leagueTotalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLeaguePage((p) => Math.min(leagueTotalPages, p + 1))}
                      disabled={leaguePage >= leagueTotalPages}
                      className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 bg-neutral-800 rounded-lg disabled:opacity-30 hover:bg-neutral-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Player Panel */}
              <div className="space-y-3">
                {selectedLeague ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-black text-white">{selectedLeague.name}</h2>
                        <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                          {selectedLeague.code.toUpperCase()} &middot; {selectedLeague.country}
                          {selectedLeague.level ? ` \u00b7 ${selectedLeague.level}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Season Selector */}
                    <SeasonSelector
                      seasons={selectedLeague.seasons}
                      selected={selectedSeason}
                      onSelect={setSelectedSeason}
                      sportColor={activeColor}
                    />

                    {/* Player Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
                      <input
                        type="text"
                        value={playerSearch}
                        onChange={(e) => setPlayerSearch(e.target.value)}
                        placeholder="Search players by name..."
                        className="w-full bg-neutral-900/60 border border-neutral-800 text-white placeholder:text-neutral-600 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-neutral-600 transition-colors"
                      />
                    </div>

                    {/* Player Total */}
                    {playersQuery.data?.meta && (
                      <p className="text-[10px] font-mono text-neutral-600">
                        {playersQuery.data.meta.total} players ranked
                      </p>
                    )}

                    {/* Players Table */}
                    <PlayerStatsTable
                      players={leaguePlayers}
                      sport={resolvedSport}
                      sportColor={activeColor}
                      isLoading={playersQuery.isLoading}
                    />
                  </>
                ) : (
                  <TopPlayersPanel
                    sport={resolvedSport}
                    sportColor={activeColor}
                    playerSearch={playerSearch}
                    setPlayerSearch={setPlayerSearch}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
