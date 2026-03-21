'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

/* ---------- Types ---------- */

interface TeamInfo {
  name: string;
  abbr: string;
  color: string;
}

interface LiveGame {
  id: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
  homeWinProb: number;
  status: string;
  arena: string;
}

interface UpcomingGame {
  id: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  tipoff: string;
  status: string;
  arena: string;
}

interface ApiGame {
  id: string;
  status?: string;
  homeScore?: number;
  awayScore?: number;
  home_score?: number;
  away_score?: number;
  quarter?: number;
  gameClock?: number;
  game_clock?: number;
  time_remaining?: string;
  home_win_prob?: number;
  homeWinProb?: number;
  venue?: string;
  time?: string;
  game_date?: string;
  tipoff?: string;
  sport?: string;
  homeTeam?: { id: string; name: string; abbreviation?: string; abbr?: string; primaryColor?: string; color?: string };
  awayTeam?: { id: string; name: string; abbreviation?: string; abbr?: string; primaryColor?: string; color?: string };
  home_team_name?: string;
  away_team_name?: string;
  home_team_abbr?: string;
  away_team_abbr?: string;
  home_team_color?: string;
  away_team_color?: string;
}

/* ---------- Helpers ---------- */

function formatGameClock(seconds: number | undefined): string {
  if (seconds === undefined || seconds === null) return '12:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function extractTeamInfo(game: ApiGame, side: 'home' | 'away'): TeamInfo {
  const teamObj = side === 'home' ? game.homeTeam : game.awayTeam;
  if (teamObj) {
    return {
      name: teamObj.name || (side === 'home' ? 'Home' : 'Away'),
      abbr: teamObj.abbreviation || teamObj.abbr || teamObj.name?.slice(0, 3).toUpperCase() || '???',
      color: teamObj.primaryColor || teamObj.color || '#666',
    };
  }
  const prefix = side === 'home' ? 'home' : 'away';
  return {
    name: game[`${prefix}_team_name` as keyof ApiGame] as string || (side === 'home' ? 'Home' : 'Away'),
    abbr: game[`${prefix}_team_abbr` as keyof ApiGame] as string || '???',
    color: game[`${prefix}_team_color` as keyof ApiGame] as string || '#666',
  };
}

function mapToLiveGame(g: ApiGame): LiveGame {
  const clockSeconds = g.gameClock ?? g.game_clock;
  return {
    id: g.id,
    homeTeam: extractTeamInfo(g, 'home'),
    awayTeam: extractTeamInfo(g, 'away'),
    homeScore: g.homeScore ?? g.home_score ?? 0,
    awayScore: g.awayScore ?? g.away_score ?? 0,
    quarter: g.quarter ?? 1,
    timeRemaining: g.time_remaining ?? formatGameClock(clockSeconds),
    homeWinProb: g.homeWinProb ?? g.home_win_prob ?? 50,
    status: g.status ?? 'live',
    arena: g.venue ?? 'TBD',
  };
}

function mapToUpcomingGame(g: ApiGame): UpcomingGame {
  const tipoff = g.tipoff ??
    (g.time ? new Date(g.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : null) ??
    (g.game_date ? new Date(g.game_date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'TBD');

  return {
    id: g.id,
    homeTeam: extractTeamInfo(g, 'home'),
    awayTeam: extractTeamInfo(g, 'away'),
    tipoff,
    status: 'upcoming',
    arena: g.venue ?? 'TBD',
  };
}

/* ---------- Live Game Card ---------- */

function LiveGameCard({ game }: { game: LiveGame }): React.ReactElement {
  const prob = game.homeWinProb;

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl min-w-[300px] snap-center shrink-0 md:min-w-0 md:shrink p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-500">LIVE</span>
          <span className="text-[10px] text-neutral-500">
            Q{game.quarter} {game.timeRemaining}
          </span>
        </div>
        <span className="text-[10px] text-neutral-600">{game.arena}</span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: game.awayTeam.color + '33', borderColor: game.awayTeam.color, borderWidth: 1 }}
            >
              {game.awayTeam.abbr}
            </div>
            <span className={cn(
              'text-sm font-medium',
              game.awayScore > game.homeScore ? 'text-white' : 'text-neutral-400',
            )}>
              {game.awayTeam.name}
            </span>
          </div>
          <span className={cn(
            'text-xl font-bold tabular-nums',
            game.awayScore > game.homeScore ? 'text-white' : 'text-neutral-400',
          )}>
            {game.awayScore}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: game.homeTeam.color + '33', borderColor: game.homeTeam.color, borderWidth: 1 }}
            >
              {game.homeTeam.abbr}
            </div>
            <span className={cn(
              'text-sm font-medium',
              game.homeScore > game.awayScore ? 'text-white' : 'text-neutral-400',
            )}>
              {game.homeTeam.name}
            </span>
          </div>
          <span className={cn(
            'text-xl font-bold tabular-nums',
            game.homeScore > game.awayScore ? 'text-white' : 'text-neutral-400',
          )}>
            {game.homeScore}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px]">
          <span className="text-neutral-500">{game.awayTeam.abbr} Win Prob</span>
          <span className="text-neutral-500">{game.homeTeam.abbr} Win Prob</span>
        </div>
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden flex">
          <div
            className="h-full transition-all duration-1000 rounded-l-full"
            style={{
              width: `${100 - prob}%`,
              backgroundColor: game.awayTeam.color,
              opacity: 0.7,
            }}
          />
          <div
            className="h-full transition-all duration-1000 rounded-r-full"
            style={{
              width: `${prob}%`,
              backgroundColor: game.homeTeam.color,
              opacity: 0.7,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold tabular-nums">
          <span className="text-neutral-400">{100 - prob}%</span>
          <span className="text-neutral-400">{prob}%</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Upcoming Game Card ---------- */

function UpcomingGameCard({ game }: { game: UpcomingGame }): React.ReactElement {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800/50 rounded-xl p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-neutral-300 w-8">{game.awayTeam.abbr}</span>
            <span className="text-[10px] text-neutral-600">@</span>
            <span className="text-xs font-bold text-neutral-300 w-8">{game.homeTeam.abbr}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-400 font-medium">{game.tipoff}</span>
          <p className="text-[9px] text-neutral-600">{game.arena}</p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN VIEW
   ================================================================ */

export function LiveScoresView(): React.ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: rawGames, isLoading, isError } = useQuery<ApiGame[]>({
    queryKey: ['live-scores-games'],
    queryFn: async () => {
      const res = await fetch('/api/games?status=live');
      if (!res.ok) throw new Error('Failed to fetch games');
      const json = await res.json();
      // Handle both { data: [...] } wrapper and raw array responses
      return Array.isArray(json) ? json : (json.data ?? []);
    },
    refetchInterval: 30000,
  });

  const allGames = rawGames ?? [];

  const liveGames: LiveGame[] = allGames
    .filter((g) => g.status === 'live' || g.status === 'in_progress')
    .map(mapToLiveGame);

  const upcomingGames: UpcomingGame[] = allGames
    .filter((g) => g.status === 'scheduled' || g.status === 'upcoming')
    .map(mapToUpcomingGame);

  return (
    <div className="max-w-lg mx-auto space-y-6 p-6 bg-[#0f0f0f] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Live Scores</h1>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400">
            {liveGames.length} live
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 animate-pulse">
              <div className="h-4 w-20 bg-neutral-800 rounded mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-5 w-32 bg-neutral-800 rounded" />
                  <div className="h-6 w-10 bg-neutral-800 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-5 w-32 bg-neutral-800 rounded" />
                  <div className="h-6 w-10 bg-neutral-800 rounded" />
                </div>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full mt-4" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-neutral-900/80 border border-red-900/30 rounded-xl p-8 text-center">
          <p className="text-red-400 text-sm font-medium">Failed to load live scores</p>
          <p className="text-neutral-600 text-xs mt-1">Check your connection and try again</p>
        </div>
      ) : liveGames.length === 0 ? (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-8 text-center">
          <p className="text-neutral-500 text-sm">No live games right now</p>
          <p className="text-neutral-600 text-[10px] mt-1">Check back during game time</p>
        </div>
      ) : (
        <>
          {/* Mobile: horizontal swipe carousel */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 md:hidden"
          >
            {liveGames.map((game) => (
              <LiveGameCard key={game.id} game={game} />
            ))}
          </div>

          {/* Desktop: stacked cards */}
          <div className="hidden md:block space-y-3">
            {liveGames.map((game) => (
              <LiveGameCard key={game.id} game={game} />
            ))}
          </div>

          {/* Scroll indicator (mobile) */}
          {liveGames.length > 1 && (
            <div className="flex justify-center gap-1.5 md:hidden">
              {liveGames.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-colors',
                    i === 0 ? 'bg-red-500' : 'bg-neutral-700',
                  )}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Upcoming Games */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-neutral-300">Upcoming</h2>
          <span className="text-[10px] text-neutral-600">
            {upcomingGames.length} games
          </span>
        </div>

        {upcomingGames.length === 0 ? (
          <div className="bg-neutral-900/60 border border-neutral-800/50 rounded-xl p-4 text-center">
            <p className="text-neutral-600 text-xs">No upcoming games scheduled</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingGames.map((game) => (
              <UpcomingGameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>

      <p className="text-[9px] text-neutral-700 text-center">
        Scores refresh every 30 seconds. Win probability powered by AI6 models.
      </p>
    </div>
  );
}
