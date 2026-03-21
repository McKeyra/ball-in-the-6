'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Scoreboard } from '@/components/live-game/Scoreboard';
import { StatButton } from '@/components/live-game/StatButton';
import { EventFeed } from '@/components/live-game/EventFeed';
import { BoxScoreTable } from '@/components/live-game/BoxScoreTable';
import { ArrowLeft, Users, BarChart3, Activity, Download } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  color: string | null;
  players: Player[];
}

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  onCourt: boolean;
}

interface PlayerStatRecord {
  id: string;
  playerId: string;
  teamSide: string;
  minutes: number;
  points: number;
  fgMade: number;
  fgAttempts: number;
  threeMade: number;
  threeAttempts: number;
  ftMade: number;
  ftAttempts: number;
  offRebounds: number;
  defRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  player: Player;
}

interface GameEvent {
  id: string;
  type: string;
  description: string;
  quarter: number;
  gameClock: number;
  teamSide: string | null;
  playerName: string | null;
  points: number | null;
  createdAt: string;
}

interface GameData {
  id: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  gameClock: number;
  shotClock: number;
  shotClockSec: number;
  quarterLength: number;
  overtimeLength: number;
  status: string;
  timeoutsHome: number;
  timeoutsAway: number;
  foulOutLimit: number;
  homeTeam: Team;
  awayTeam: Team;
  playerStats: PlayerStatRecord[];
  gameEvents: GameEvent[];
}

type Tab = 'stats' | 'boxscore';

export function LiveGamePage({ gameId }: { gameId: string }): React.ReactElement {
  const router = useRouter();
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<'home' | 'away'>('home');
  const [tab, setTab] = useState<Tab>('stats');
  const [clockRunning, setClockRunning] = useState(false);
  const clockRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch game data
  const fetchGame = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`/api/games/live?id=${gameId}`);
      if (!res.ok) throw new Error('Failed to load game');
      const data = (await res.json()) as GameData;
      setGame(data);
      if (!selectedPlayer && data.homeTeam.players.length > 0) {
        setSelectedPlayer(data.homeTeam.players[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [gameId, selectedPlayer]);

  useEffect(() => {
    void fetchGame();
  }, [fetchGame]);

  // Game clock tick
  useEffect(() => {
    if (clockRunning && game) {
      clockRef.current = setInterval(() => {
        setGame((prev) => {
          if (!prev || prev.gameClock <= 0) return prev;
          const newGameClock = prev.gameClock - 1;
          const newShotClock = prev.shotClock > 0 ? prev.shotClock - 1 : 0;
          return { ...prev, gameClock: newGameClock, shotClock: newShotClock };
        });
      }, 1000);
    }
    return (): void => {
      if (clockRef.current) clearInterval(clockRef.current);
    };
  }, [clockRunning, game?.id]);

  // Sync clock to server every 5 seconds
  useEffect(() => {
    if (!clockRunning || !game) return;
    const syncInterval = setInterval(() => {
      void fetch('/api/games/live', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id, gameClock: game.gameClock, shotClock: game.shotClock }),
      });
    }, 5000);
    return (): void => clearInterval(syncInterval);
  }, [clockRunning, game?.id, game?.gameClock, game?.shotClock]);

  const recordStat = async (stat: string, delta: number): Promise<void> => {
    if (!game || !selectedPlayer) return;
    const player = [...game.homeTeam.players, ...game.awayTeam.players].find((p) => p.id === selectedPlayer);
    if (!player) return;

    // Optimistic update
    setGame((prev) => {
      if (!prev) return prev;
      const stats = prev.playerStats.map((s) => {
        if (s.playerId !== selectedPlayer) return s;
        return { ...s, [stat]: Math.max(0, (s[stat as keyof PlayerStatRecord] as number) + delta) };
      });

      // Auto-update points for scoring stats
      let { homeScore, awayScore } = prev;
      if (stat === 'points') {
        const side = prev.playerStats.find((s) => s.playerId === selectedPlayer)?.teamSide;
        if (side === 'home') homeScore += delta;
        else awayScore += delta;
      }

      return { ...prev, playerStats: stats, homeScore, awayScore };
    });

    await fetch('/api/games/stats', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: game.id, playerId: selectedPlayer, stat, delta }),
    });

    // Create event for scoring
    if (stat === 'points' && delta > 0) {
      const side = game.playerStats.find((s) => s.playerId === selectedPlayer)?.teamSide ?? 'home';
      await fetch('/api/games/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          type: 'score',
          description: `${player.name} scores`,
          quarter: game.quarter,
          gameClock: game.gameClock,
          teamSide: side,
          playerName: player.name,
          points: delta,
        }),
      });
      void fetchGame();
    }
  };

  const recordEvent = async (type: string, description: string, side?: string): Promise<void> => {
    if (!game) return;
    await fetch('/api/games/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId: game.id,
        type,
        description,
        quarter: game.quarter,
        gameClock: game.gameClock,
        teamSide: side ?? null,
      }),
    });
    void fetchGame();
  };

  const exportBoxScore = (): void => {
    if (!game) return;
    const headers = 'Player,#,Pos,Team,PTS,FG,3PT,FT,REB,AST,STL,BLK,TOV,PF\n';
    const rows = game.playerStats.map((s) => {
      const reb = s.offRebounds + s.defRebounds;
      const team = s.teamSide === 'home' ? game.homeTeam.name : game.awayTeam.name;
      return `${s.player.name},${s.player.number},${s.player.position},${team},${s.points},${s.fgMade}/${s.fgAttempts},${s.threeMade}/${s.threeAttempts},${s.ftMade}/${s.ftAttempts},${reb},${s.assists},${s.steals},${s.blocks},${s.turnovers},${s.fouls}`;
    });
    const csv = headers + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boxscore-${game.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-[#c8ff00] border-t-transparent" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">{error ?? 'Game not found'}</p>
        <button type="button" onClick={() => router.push('/games')} className="text-sm font-bold text-[#c8ff00]">
          Back to Games
        </button>
      </div>
    );
  }

  const currentPlayers = selectedSide === 'home' ? game.homeTeam.players : game.awayTeam.players;
  const currentStats = game.playerStats.find((s) => s.playerId === selectedPlayer);
  const homeStats = game.playerStats
    .filter((s) => s.teamSide === 'home')
    .map((s) => ({ ...s, playerName: s.player.name, playerNumber: s.player.number, playerPosition: s.player.position }));
  const awayStats = game.playerStats
    .filter((s) => s.teamSide === 'away')
    .map((s) => ({ ...s, playerName: s.player.name, playerNumber: s.player.number, playerPosition: s.player.position }));

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60 px-4 py-3">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => router.push('/games')} className="flex items-center gap-2 text-sm font-bold text-neutral-600">
            <ArrowLeft className="h-4 w-4" /> Games
          </button>
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Live</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-4 space-y-4">
        {/* Scoreboard */}
        <Scoreboard
          homeTeam={{ name: game.homeTeam.name, color: game.homeTeam.color ?? '#3b82f6' }}
          awayTeam={{ name: game.awayTeam.name, color: game.awayTeam.color ?? '#ef4444' }}
          homeScore={game.homeScore}
          awayScore={game.awayScore}
          quarter={game.quarter}
          gameClock={game.gameClock}
          shotClock={game.shotClock}
          isRunning={clockRunning}
          onToggleClock={() => setClockRunning(!clockRunning)}
          onResetShotClock={() => setGame((prev) => prev ? { ...prev, shotClock: prev.shotClockSec } : prev)}
        />

        {/* Tab Bar */}
        <div className="flex rounded-xl bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setTab('stats')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-colors',
              tab === 'stats' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500',
            )}
          >
            <Activity className="h-3.5 w-3.5" /> Stat Entry
          </button>
          <button
            type="button"
            onClick={() => setTab('boxscore')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-colors',
              tab === 'boxscore' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500',
            )}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Box Score
          </button>
        </div>

        {tab === 'stats' && (
          <>
            {/* Team Selector */}
            <div className="flex rounded-xl border border-neutral-200 overflow-hidden">
              <button
                type="button"
                onClick={() => { setSelectedSide('home'); setSelectedPlayer(game.homeTeam.players[0]?.id ?? null); }}
                className={cn(
                  'flex-1 py-2.5 text-xs font-bold transition-colors',
                  selectedSide === 'home' ? 'bg-neutral-900 text-[#c8ff00]' : 'bg-white text-neutral-500',
                )}
              >
                {game.homeTeam.name}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedSide('away'); setSelectedPlayer(game.awayTeam.players[0]?.id ?? null); }}
                className={cn(
                  'flex-1 py-2.5 text-xs font-bold transition-colors',
                  selectedSide === 'away' ? 'bg-neutral-900 text-[#c8ff00]' : 'bg-white text-neutral-500',
                )}
              >
                {game.awayTeam.name}
              </button>
            </div>

            {/* Player Selector */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {currentPlayers.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => setSelectedPlayer(player.id)}
                  className={cn(
                    'shrink-0 rounded-xl border px-3 py-2 text-xs font-bold transition-colors',
                    selectedPlayer === player.id
                      ? 'border-[#c8ff00] bg-[#c8ff00]/10 text-neutral-900'
                      : 'border-neutral-200 text-neutral-500 hover:border-neutral-300',
                  )}
                >
                  <span className="text-[10px] text-neutral-400">#{player.number}</span>{' '}
                  {player.name.split(' ').pop()} <span className="text-[10px] text-neutral-400">{player.position}</span>
                </button>
              ))}
            </div>

            {/* Stat Buttons */}
            {currentStats && (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => void recordStat('points', 2).then(() => Promise.all([recordStat('fgMade', 1), recordStat('fgAttempts', 1)]))} className="rounded-xl bg-[#c8ff00] py-4 text-center text-sm font-black text-neutral-900 active:scale-95 transition-transform">
                    2PT
                  </button>
                  <button type="button" onClick={() => void recordStat('points', 3).then(() => Promise.all([recordStat('threeMade', 1), recordStat('threeAttempts', 1), recordStat('fgMade', 1), recordStat('fgAttempts', 1)]))} className="rounded-xl bg-[#c8ff00] py-4 text-center text-sm font-black text-neutral-900 active:scale-95 transition-transform">
                    3PT
                  </button>
                  <button type="button" onClick={() => void recordStat('points', 1).then(() => Promise.all([recordStat('ftMade', 1), recordStat('ftAttempts', 1)]))} className="rounded-xl bg-[#c8ff00]/60 py-4 text-center text-sm font-black text-neutral-900 active:scale-95 transition-transform">
                    FT
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => void recordStat('fgAttempts', 1)} className="rounded-xl border border-neutral-200 py-3 text-center text-xs font-bold text-neutral-500 active:scale-95 transition-transform">
                    2PT Miss
                  </button>
                  <button type="button" onClick={() => void Promise.all([recordStat('threeAttempts', 1), recordStat('fgAttempts', 1)])} className="rounded-xl border border-neutral-200 py-3 text-center text-xs font-bold text-neutral-500 active:scale-95 transition-transform">
                    3PT Miss
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <StatButton label="AST" value={currentStats.assists} onIncrement={() => void recordStat('assists', 1)} onDecrement={() => void recordStat('assists', -1)} compact />
                  <StatButton label="REB" value={currentStats.offRebounds + currentStats.defRebounds} onIncrement={() => void recordStat('defRebounds', 1)} onDecrement={() => void recordStat('defRebounds', -1)} compact />
                  <StatButton label="STL" value={currentStats.steals} onIncrement={() => void recordStat('steals', 1)} onDecrement={() => void recordStat('steals', -1)} compact />
                  <StatButton label="BLK" value={currentStats.blocks} onIncrement={() => void recordStat('blocks', 1)} onDecrement={() => void recordStat('blocks', -1)} compact />
                  <StatButton label="TOV" value={currentStats.turnovers} onIncrement={() => void recordStat('turnovers', 1)} onDecrement={() => void recordStat('turnovers', -1)} compact />
                  <StatButton label="PF" value={currentStats.fouls} onIncrement={() => void recordStat('fouls', 1)} onDecrement={() => void recordStat('fouls', -1)} compact />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void recordEvent('timeout', `${selectedSide === 'home' ? game.homeTeam.name : game.awayTeam.name} timeout`, selectedSide)}
                    className="flex-1 rounded-xl border border-neutral-200 py-3 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Timeout
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextQ = game.quarter + 1;
                      const newClock = nextQ > 4 ? (game.overtimeLength ?? 5) * 60 : game.quarterLength * 60;
                      setGame((prev) => prev ? { ...prev, quarter: nextQ, gameClock: newClock, shotClock: prev.shotClockSec } : prev);
                      void fetch('/api/games/live', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ gameId: game.id, quarter: nextQ, gameClock: newClock, shotClock: game.shotClockSec }),
                      });
                      void recordEvent('quarter_end', `End of ${game.quarter <= 4 ? `Q${game.quarter}` : `OT${game.quarter - 4}`}`);
                    }}
                    className="flex-1 rounded-xl border border-neutral-200 py-3 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    End Quarter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGame((prev) => prev ? { ...prev, status: 'final' } : prev);
                      setClockRunning(false);
                      void fetch('/api/games/live', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ gameId: game.id, status: 'final' }),
                      });
                      void recordEvent('quarter_end', 'Game Final');
                    }}
                    className="flex-1 rounded-xl bg-red-50 border border-red-200 py-3 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                  >
                    End Game
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'boxscore' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button type="button" onClick={exportBoxScore} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">
                <Download className="h-3 w-3" /> Export CSV
              </button>
            </div>
            <BoxScoreTable
              teamName={game.homeTeam.name}
              teamColor={game.homeTeam.color ?? '#3b82f6'}
              players={homeStats}
              selectedPlayerId={selectedPlayer ?? undefined}
              onSelectPlayer={setSelectedPlayer}
            />
            <BoxScoreTable
              teamName={game.awayTeam.name}
              teamColor={game.awayTeam.color ?? '#ef4444'}
              players={awayStats}
              selectedPlayerId={selectedPlayer ?? undefined}
              onSelectPlayer={setSelectedPlayer}
            />
          </div>
        )}

        {/* Event Feed */}
        <EventFeed
          events={game.gameEvents}
          homeColor={game.homeTeam.color ?? '#3b82f6'}
          awayColor={game.awayTeam.color ?? '#ef4444'}
        />
      </div>
    </div>
  );
}
