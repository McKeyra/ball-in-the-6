'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Calendar, Clock, Users } from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface Game {
  id: string;
  status?: string;
  home_team_name: string;
  away_team_name: string;
  home_team_color: string;
  away_team_color: string;
  home_score: number;
  away_score: number;
  quarter?: number;
  game_date?: string;
  game_time?: string;
  location?: string;
}

interface Player {
  id: string;
  name: string;
  jersey_number: number;
  team: 'home' | 'away';
  points: number;
  assists: number;
  rebounds_off: number;
  rebounds_def: number;
}

interface GameEvent {
  id: string;
  description: string;
  quarter: number;
  points?: number;
}

export function DetailedGameViewPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const gameId = params?.id ?? searchParams.get('gameId');

  const { data: gameData, isLoading } = useQuery<{
    id: string;
    status?: string;
    homeTeam: { name: string; color: string | null };
    awayTeam: { name: string; color: string | null };
    homeScore: number;
    awayScore: number;
    quarter?: number;
    gameDate?: string;
    gameTime?: string;
    venue?: string;
    playerStats?: unknown[];
    gameEvents?: unknown[];
  }>({
    queryKey: ['game-detail', gameId],
    queryFn: async () => {
      const res = await fetch(`/api/games/${gameId}`);
      if (!res.ok) throw new Error('Failed to fetch game');
      return res.json();
    },
    enabled: !!gameId,
  });

  const game: Game | null = gameData
    ? {
        id: gameData.id,
        status: gameData.status,
        home_team_name: gameData.homeTeam?.name ?? 'Home',
        away_team_name: gameData.awayTeam?.name ?? 'Away',
        home_team_color: gameData.homeTeam?.color ?? '#3b82f6',
        away_team_color: gameData.awayTeam?.color ?? '#ef4444',
        home_score: gameData.homeScore ?? 0,
        away_score: gameData.awayScore ?? 0,
        quarter: gameData.quarter,
        game_date: gameData.gameDate,
        game_time: gameData.gameTime,
        location: gameData.venue,
      }
    : null;

  const players: Player[] = (gameData?.playerStats ?? []).map((ps) => {
    const record = ps as unknown as Record<string, unknown>;
    return {
      id: String(record.id ?? ''),
      name: String(record.playerName ?? record.name ?? ''),
      jersey_number: Number(record.playerNumber ?? record.number ?? 0),
      team: (String(record.teamSide ?? 'home') === 'home' ? 'home' : 'away') as 'home' | 'away',
      points: Number(record.points ?? 0),
      assists: Number(record.assists ?? 0),
      rebounds_off: Number(record.offRebounds ?? 0),
      rebounds_def: Number(record.defRebounds ?? 0),
    };
  });

  const events: GameEvent[] = (gameData?.gameEvents ?? []).map((ev) => {
    const record = ev as unknown as Record<string, unknown>;
    return {
      id: String(record.id ?? ''),
      description: String(record.description ?? ''),
      quarter: Number(record.quarter ?? 1),
      points: record.points != null ? Number(record.points) : undefined,
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-[#c8ff00] border-t-transparent" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-white/60">Game not found</p>
        <button onClick={() => router.push('/games')} className="text-sm font-bold text-[#c8ff00]">Back to Games</button>
      </div>
    );
  }

  const homePlayers = players.filter((p) => p.team === 'home');
  const awayPlayers = players.filter((p) => p.team === 'away');
  const winner =
    game.home_score > game.away_score ? 'home' : game.home_score < game.away_score ? 'away' : 'tie';

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <button
            onClick={() => router.push('/games')}
            className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center"
            style={{ boxShadow: '0 10px 26px rgba(0,0,0,.10)', background: '#1a1a1a' }}
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white/90">Game Details</h1>
            <p className="text-sm md:text-base text-white/60">Complete game information and statistics</p>
          </div>
        </div>

        {/* Game Header Card */}
        <div
          className="p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl mb-4 md:mb-6"
          style={{ background: '#1a1a1a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
        >
          {/* Teams and Score */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-4 md:gap-0">
            <div className="flex items-center gap-3 md:gap-4 flex-1 w-full md:w-auto justify-center md:justify-start">
              <div className="w-14 h-14 md:w-16 lg:w-20 md:h-16 lg:h-20 rounded-full flex-shrink-0" style={{ background: game.home_team_color }} />
              <div className="text-center md:text-left">
                <div className={`text-lg md:text-xl lg:text-2xl font-bold ${winner === 'home' ? 'text-white' : 'text-white/70'}`}>
                  {game.home_team_name}
                </div>
                {winner === 'home' && game.status === 'finished' && (
                  <div className="text-xs md:text-sm text-green-600 font-semibold">WINNER</div>
                )}
              </div>
            </div>

            <div className="text-center px-4 md:px-8 order-first md:order-none">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`text-4xl md:text-5xl lg:text-6xl font-bold ${winner === 'home' ? 'text-white' : 'text-white/60'}`}>
                  {game.home_score}
                </div>
                <div className="text-xl md:text-2xl lg:text-3xl text-white/30">-</div>
                <div className={`text-4xl md:text-5xl lg:text-6xl font-bold ${winner === 'away' ? 'text-white' : 'text-white/60'}`}>
                  {game.away_score}
                </div>
              </div>
              {game.status === 'finished' && <div className="text-xs md:text-sm text-white/40 mt-1 md:mt-2">FINAL</div>}
            </div>

            <div className="flex items-center gap-3 md:gap-4 flex-1 w-full md:w-auto justify-center md:justify-end">
              <div className="text-center md:text-right order-2 md:order-1">
                <div className={`text-lg md:text-xl lg:text-2xl font-bold ${winner === 'away' ? 'text-white' : 'text-white/70'}`}>
                  {game.away_team_name}
                </div>
                {winner === 'away' && game.status === 'finished' && (
                  <div className="text-xs md:text-sm text-green-600 font-semibold">WINNER</div>
                )}
              </div>
              <div className="w-14 h-14 md:w-16 lg:w-20 md:h-16 lg:h-20 rounded-full flex-shrink-0 order-1 md:order-2" style={{ background: game.away_team_color }} />
            </div>
          </div>

          {/* Game Info */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 lg:gap-8 text-xs md:text-sm text-white/60">
            {game.game_date && (
              <div className="flex items-center gap-1 md:gap-2">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                {game.game_date}
              </div>
            )}
            {game.game_time && (
              <div className="flex items-center gap-1 md:gap-2">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                {game.game_time}
              </div>
            )}
            {game.location && (
              <div className="flex items-center gap-1 md:gap-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                {game.location}
              </div>
            )}
          </div>
        </div>

        {/* Player Stats */}
        {players.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            {[
              { label: game.home_team_name, teamPlayers: homePlayers, color: game.home_team_color },
              { label: game.away_team_name, teamPlayers: awayPlayers, color: game.away_team_color },
            ].map(({ label, teamPlayers, color }) => (
              <div
                key={label}
                className="p-4 md:p-6 rounded-2xl"
                style={{ background: '#1a1a1a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
              >
                <h3 className="text-base md:text-lg font-bold text-white/90 mb-3 md:mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 md:w-5 md:h-5" />
                  {label} Stats
                </h3>
                <div className="space-y-2">
                  {teamPlayers.length > 0 ? (
                    teamPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 rounded-lg min-h-[52px]"
                        style={{ background: 'rgba(255,255,255,0.07)', boxShadow: '0 2px 4px rgba(0,0,0,0.10)' }}
                      >
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                          <div
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-white text-xs md:text-sm flex-shrink-0"
                            style={{ background: color }}
                          >
                            {player.jersey_number}
                          </div>
                          <div className="text-xs md:text-sm font-semibold text-white/70 truncate">{player.name}</div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-white/60 flex-shrink-0">
                          <span>{player.points} PTS</span>
                          <span className="hidden sm:inline">{player.rebounds_off + player.rebounds_def} REB</span>
                          <span className="hidden sm:inline">{player.assists} AST</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 md:py-8 text-white/40 text-xs md:text-sm">No player stats available</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Event Log */}
        {events.length > 0 && (
          <div className="p-4 md:p-6 rounded-2xl" style={{ background: '#1a1a1a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}>
            <h3 className="text-base md:text-lg font-bold text-white/90 mb-3 md:mb-4">Game Events</h3>
            <div className="space-y-2 max-h-64 md:max-h-96 overflow-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg min-h-[44px] flex items-center"
                  style={{ background: 'rgba(255,255,255,0.07)', boxShadow: '0 2px 4px rgba(0,0,0,0.10)' }}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-xs md:text-sm text-white/70 flex-1 min-w-0">{event.description}</span>
                    <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-white/40 flex-shrink-0">
                      <span>Q{event.quarter}</span>
                      {event.points && event.points > 0 && (
                        <span className="font-semibold text-green-600">+{event.points}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {game.status !== 'finished' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/games/court-view')}
              className="min-h-[44px] w-full sm:w-auto px-6 py-3 rounded-lg font-medium"
              style={{ background: '#c9a962', color: 'white', boxShadow: '0 10px 26px rgba(0,0,0,.10)' }}
            >
              Go to Live Court View
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
