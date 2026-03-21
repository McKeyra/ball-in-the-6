'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Settings, Users, Clock, RotateCcw, AlertCircle } from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface Game {
  id: string;
  home_team_name: string;
  away_team_name: string;
  home_team_color: string;
  away_team_color: string;
  home_score: number;
  away_score: number;
  quarter: number;
  game_clock_seconds: number;
  status: string;
}

interface Player {
  id: string;
  name: string;
  jersey_number: number;
  team: 'home' | 'away';
  position: string;
  on_court: boolean;
  points: number;
}

interface GameEvent {
  id: string;
  description: string;
  event_type: string;
  quarter: number;
}

export function CourtViewPage(): React.ReactElement {
  const router = useRouter();
  const [gameId, setGameId] = useState<string | null>(null);
  const [showEventFeed, setShowEventFeed] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showSubstitution, setShowSubstitution] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: games = [], isLoading: gamesLoading, error: gamesError } = useQuery<Game[]>({
    queryKey: ['courtview-games'],
    queryFn: async () => {
      const res = await fetch('/api/games?status=live&sport=basketball');
      if (!res.ok) throw new Error('Failed to fetch games');
      return res.json();
    },
  });

  const players: Player[] = [];
  const events: GameEvent[] = [];

  const game = games.length > 0 ? games[0] : null;
  const homePlayers = players.filter((p) => p.team === 'home');
  const awayPlayers = players.filter((p) => p.team === 'away');

  const handlePlayerTap = (player: Player): void => {
    router.push(`/players/sheet?playerId=${player.id}&gameId=${gameId}`);
  };

  const handleUndo = async (): Promise<void> => {
    if (events.length === 0) return;
    // TODO: DELETE /api/game-events/${events[0].id}
  };

  // Error state
  if (gamesError || initError) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 md:p-6 pb-24">
        <div className="max-w-md w-full p-6 md:p-8 rounded-3xl text-center" style={{ background: '#1a1a1a', boxShadow: '0 10px 26px rgba(0,0,0,.10)' }}>
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-white/90 mb-2">Error Loading Game</h2>
          <p className="text-sm md:text-base text-white/60 mb-6">
            {initError || gamesError?.message || 'Unable to load game data'}
          </p>
          <button
            onClick={() => {
              setInitError(null);
              // TODO: refetch games
            }}
            className="min-h-[44px] px-6 py-3 rounded-lg font-medium"
            style={{ background: '#c9a962', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (gamesLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 pb-24">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-semibold text-white/60 mb-2">Loading games...</div>
          <div className="text-sm text-white/40">Please wait</div>
        </div>
      </div>
    );
  }

  // No game
  if (!game) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 pb-24">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-semibold text-white/60 mb-2">No Active Game</div>
          <div className="text-sm text-white/40">Create a new game to get started</div>
          <button
            onClick={() => router.push('/games')}
            className="mt-4 min-h-[44px] px-6 py-3 rounded-lg font-medium"
            style={{ background: '#c9a962', color: 'white' }}
          >
            Go to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] overflow-hidden relative pb-24">
      {/* Court background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'%3E%3Crect fill='none' stroke='%23000' stroke-width='2' x='10' y='10' width='380' height='580'/%3E%3Ccircle fill='none' stroke='%23000' stroke-width='2' cx='200' cy='300' r='60'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 flex flex-col h-screen">
        {/* ScoreBoard placeholder */}
        <div
          className="px-4 md:px-6 py-4"
          style={{ background: '#1a1a1a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ background: game.home_team_color }}
                />
                <div>
                  <p className="text-sm text-white/60">{game.home_team_name}</p>
                  <p className="text-3xl font-bold text-white">{game.home_score}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-white/40">Q{game.quarter}</div>
                <div className="text-lg font-mono text-white">
                  {Math.floor(game.game_clock_seconds / 60)}:{String(game.game_clock_seconds % 60).padStart(2, '0')}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-white/60">{game.away_team_name}</p>
                  <p className="text-3xl font-bold text-white">{game.away_score}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ background: game.away_team_color }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="px-4 md:px-6 py-3" style={{ background: '#1a1a1a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-4 gap-2 md:gap-3">
            {[
              { icon: Clock, label: 'Timeout', onClick: () => setShowTimeout(true) },
              { icon: Users, label: 'Sub', onClick: () => setShowSubstitution(true) },
              { icon: Settings, label: 'Game', onClick: () => setShowSettings(true) },
              { icon: RotateCcw, label: 'Undo', onClick: handleUndo },
            ].map(({ icon: Icon, label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="min-h-[44px] py-3 rounded-xl flex items-center justify-center gap-1 md:gap-2 font-semibold text-sm md:text-base"
                style={{ background: '#1a1a1a', boxShadow: '0 10px 26px rgba(0,0,0,.10)', color: 'rgba(255,255,255,0.5)' }}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Court Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {!isMobile ? (
            // Desktop Court View placeholder
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 gap-6">
                {/* Home Team */}
                <div>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">
                    {game.home_team_name} - On Court
                  </h3>
                  <div className="space-y-2">
                    {homePlayers
                      .filter((p) => p.on_court)
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handlePlayerTap(p)}
                          className="w-full p-3 rounded-xl bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.08] flex items-center gap-3 min-h-[56px]"
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                            style={{ background: game.home_team_color }}
                          >
                            {p.jersey_number}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-semibold text-white">{p.name}</div>
                            <div className="text-xs text-white/40">{p.position}</div>
                          </div>
                          <div className="text-sm font-bold text-white">{p.points} pts</div>
                        </button>
                      ))}
                  </div>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mt-4 mb-3">Bench</h3>
                  <div className="space-y-2">
                    {homePlayers
                      .filter((p) => !p.on_court)
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center gap-3 min-h-[48px] opacity-60"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs"
                            style={{ background: game.home_team_color }}
                          >
                            {p.jersey_number}
                          </div>
                          <span className="text-sm text-white/60">{p.name}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Away Team */}
                <div>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">
                    {game.away_team_name} - On Court
                  </h3>
                  <div className="space-y-2">
                    {awayPlayers
                      .filter((p) => p.on_court)
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handlePlayerTap(p)}
                          className="w-full p-3 rounded-xl bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.08] flex items-center gap-3 min-h-[56px]"
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                            style={{ background: game.away_team_color }}
                          >
                            {p.jersey_number}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-semibold text-white">{p.name}</div>
                            <div className="text-xs text-white/40">{p.position}</div>
                          </div>
                          <div className="text-sm font-bold text-white">{p.points} pts</div>
                        </button>
                      ))}
                  </div>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mt-4 mb-3">Bench</h3>
                  <div className="space-y-2">
                    {awayPlayers
                      .filter((p) => !p.on_court)
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center gap-3 min-h-[48px] opacity-60"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs"
                            style={{ background: game.away_team_color }}
                          >
                            {p.jersey_number}
                          </div>
                          <span className="text-sm text-white/60">{p.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Mobile Court View placeholder
            <div className="space-y-4">
              <p className="text-center text-white/40 text-sm">Tap a player to record stats</p>
              {[...homePlayers.filter((p) => p.on_court), ...awayPlayers.filter((p) => p.on_court)].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePlayerTap(p)}
                  className="w-full p-4 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center gap-3 min-h-[56px]"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: p.team === 'home' ? game.home_team_color : game.away_team_color }}
                  >
                    {p.jersey_number}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-xs text-white/40">
                      {p.team === 'home' ? game.home_team_name : game.away_team_name} &bull; {p.position}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-white">{p.points}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TODO: EventFeed, TimeoutPanel, SubstitutionPanel, GameSettings overlay modals */}
      {/* These would be rendered conditionally based on showEventFeed, showTimeout, showSubstitution, showSettings */}
    </div>
  );
}
