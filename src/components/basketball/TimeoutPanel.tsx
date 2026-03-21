'use client';

import { useState } from 'react';
import {
  X,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTimeout } from './TimeoutContext';

type TeamSide = 'home' | 'away';
type ActionType = 'timeout' | 'stat' | 'timer' | null;

interface PlayerData {
  id: string;
  name: string;
  jersey_number: string;
  position: string;
  team: TeamSide;
  on_court: boolean;
  points: number;
  rebounds_off: number;
  rebounds_def: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personal_fouls: number;
  [key: string]: string | number | boolean;
}

interface GameData {
  id: string;
  quarter: number;
  game_clock_seconds: number;
  shot_clock_seconds: number;
  home_team_name: string;
  away_team_name: string;
  home_team_color: string;
  away_team_color: string;
  home_timeouts: number;
  away_timeouts: number;
  [key: string]: string | number;
}

interface StatOptionItem {
  id: string;
  label: string;
}

interface TimeoutPanelProps {
  game: GameData;
  players: PlayerData[];
  onClose: () => void;
  onSubstitution: () => void;
}

const STAT_OPTIONS: StatOptionItem[] = [
  { id: 'points', label: 'Points' },
  { id: 'rebounds_off', label: 'Offensive Rebounds' },
  { id: 'rebounds_def', label: 'Defensive Rebounds' },
  { id: 'assists', label: 'Assists' },
  { id: 'steals', label: 'Steals' },
  { id: 'blocks', label: 'Blocks' },
  { id: 'turnovers', label: 'Turnovers' },
  { id: 'personal_fouls', label: 'Fouls' },
];

export function TimeoutPanel({
  game,
  players,
  onClose,
  onSubstitution,
}: TimeoutPanelProps): React.ReactElement {
  const queryClient = useQueryClient();
  const { startTimeout } = useTimeout();
  const [selectedTeam, setSelectedTeam] = useState<TeamSide>('home');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);

  // Stat update state
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [statType, setStatType] = useState<string | null>(null);
  const [statValue, setStatValue] = useState(0);

  // Timer adjust state
  const [newGameClock, setNewGameClock] = useState(game.game_clock_seconds);
  const [newShotClock, setNewShotClock] = useState(game.shot_clock_seconds);

  const createTimeoutMutation = useMutation({
    mutationFn: async () => {
      // TODO: Replace with actual API call
      await fetch('/api/game-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: game.id,
          event_type: 'timeout',
          quarter: game.quarter,
          game_clock_seconds: game.game_clock_seconds,
          team: selectedTeam,
          description: `${selectedTeam === 'home' ? game.home_team_name : game.away_team_name} timeout (${selectedDuration}s)`,
        }),
      });

      const timeoutField =
        selectedTeam === 'home' ? 'home_timeouts' : 'away_timeouts';
      await fetch(`/api/games/${game.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [timeoutField]: (game[timeoutField] as number) - 1,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });

      startTimeout(
        selectedTeam === 'home'
          ? game.home_team_name
          : game.away_team_name,
        'timeout',
      );

      onClose();
    },
  });

  const updateStatMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPlayer || !statType) return;
      // TODO: Replace with actual API call
      await fetch(`/api/players/${selectedPlayer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [statType]: (selectedPlayer[statType] as number) + statValue,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      setSelectedAction(null);
      setSelectedPlayer(null);
      setStatType(null);
      setStatValue(0);
    },
  });

  const adjustTimerMutation = useMutation({
    mutationFn: async () => {
      // TODO: Replace with actual API call
      await fetch(`/api/games/${game.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_clock_seconds: newGameClock,
          shot_clock_seconds: newShotClock,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      setSelectedAction(null);
    },
  });

  const handleConfirm = (): void => {
    if (selectedAction === 'timeout' && selectedDuration) {
      createTimeoutMutation.mutate();
    } else if (
      selectedAction === 'stat' &&
      selectedPlayer &&
      statType &&
      statValue !== 0
    ) {
      updateStatMutation.mutate();
    } else if (selectedAction === 'timer') {
      adjustTimerMutation.mutate();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onCourtPlayers = players.filter((p) => p.on_court);

  const showConfirm =
    (selectedAction === 'timeout' && selectedDuration) ||
    (selectedAction === 'stat' &&
      selectedPlayer &&
      statType &&
      statValue !== 0) ||
    selectedAction === 'timer';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="w-full h-full flex flex-col"
        style={{ background: '#e0e0e0' }}
      >
        {/* Fixed Header */}
        <div
          className="p-6 flex items-center justify-between border-b border-gray-300"
          style={{
            background: '#e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <h2 className="text-3xl font-bold text-gray-700">Timeout Menu</h2>
          <div className="flex items-center gap-3">
            {showConfirm ? (
              <Button
                onClick={handleConfirm}
                className="h-12 px-8 font-semibold text-lg"
                style={{
                  background:
                    selectedTeam === 'home'
                      ? game.home_team_color
                      : game.away_team_color,
                  color: 'white',
                  boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
                  border: 'none',
                }}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-12 w-12"
              style={{
                boxShadow:
                  '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                background: '#e0e0e0',
              }}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
          {!selectedAction ? (
            /* Action Selection */
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-600 mb-6">
                What would you like to do?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => setSelectedAction('timeout')}
                  className="p-8 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
                  style={{
                    background: '#e0e0e0',
                    boxShadow:
                      '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
                    border: 'none',
                  }}
                >
                  <Clock className="w-16 h-16 text-gray-600" />
                  <div className="text-xl font-bold text-gray-700">
                    Call Timeout
                  </div>
                  <div className="text-sm text-gray-500">
                    Official timeout break
                  </div>
                </button>

                <button
                  onClick={onSubstitution}
                  className="p-8 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
                  style={{
                    background: '#e0e0e0',
                    boxShadow:
                      '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
                    border: 'none',
                  }}
                >
                  <Users className="w-16 h-16 text-gray-600" />
                  <div className="text-xl font-bold text-gray-700">
                    Substitution
                  </div>
                  <div className="text-sm text-gray-500">Swap players</div>
                </button>

                <button
                  onClick={() => setSelectedAction('stat')}
                  className="p-8 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
                  style={{
                    background: '#e0e0e0',
                    boxShadow:
                      '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
                    border: 'none',
                  }}
                >
                  <TrendingUp className="w-16 h-16 text-gray-600" />
                  <div className="text-xl font-bold text-gray-700">
                    Adjust Stat
                  </div>
                  <div className="text-sm text-gray-500">
                    Fix player stats
                  </div>
                </button>

                <button
                  onClick={() => setSelectedAction('timer')}
                  className="p-8 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
                  style={{
                    background: '#e0e0e0',
                    boxShadow:
                      '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
                    border: 'none',
                  }}
                >
                  <Timer className="w-16 h-16 text-gray-600" />
                  <div className="text-xl font-bold text-gray-700">
                    Fix Timer
                  </div>
                  <div className="text-sm text-gray-500">
                    Adjust game/shot clock
                  </div>
                </button>
              </div>
            </div>
          ) : selectedAction === 'timeout' ? (
            <div className="max-w-3xl mx-auto space-y-8">
              <button
                onClick={() => setSelectedAction(null)}
                className="text-gray-500 hover:text-gray-700 mb-4"
              >
                &larr; Back to menu
              </button>

              <div>
                <label className="text-lg font-semibold text-gray-600 mb-4 block">
                  Select Team
                </label>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setSelectedTeam('home')}
                    className="py-8 rounded-3xl text-2xl font-semibold"
                    style={{
                      background:
                        selectedTeam === 'home'
                          ? `${game.home_team_color}30`
                          : '#e0e0e0',
                      boxShadow:
                        selectedTeam === 'home'
                          ? 'inset 6px 6px 12px rgba(0,0,0,0.1), inset -6px -6px 12px rgba(255,255,255,0.7)'
                          : '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
                      border: 'none',
                      color: '#666',
                    }}
                  >
                    {game.home_team_name}
                    <div className="text-base mt-2">
                      ({game.home_timeouts} left)
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedTeam('away')}
                    className="py-8 rounded-3xl text-2xl font-semibold"
                    style={{
                      background:
                        selectedTeam === 'away'
                          ? `${game.away_team_color}30`
                          : '#e0e0e0',
                      boxShadow:
                        selectedTeam === 'away'
                          ? 'inset 6px 6px 12px rgba(0,0,0,0.1), inset -6px -6px 12px rgba(255,255,255,0.7)'
                          : '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
                      border: 'none',
                      color: '#666',
                    }}
                  >
                    {game.away_team_name}
                    <div className="text-base mt-2">
                      ({game.away_timeouts} left)
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-lg font-semibold text-gray-600 mb-4 block">
                  Duration
                </label>
                <div className="grid grid-cols-2 gap-6">
                  {[60, 30].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      disabled={
                        selectedTeam === 'home'
                          ? game.home_timeouts <= 0
                          : game.away_timeouts <= 0
                      }
                      className="py-10 rounded-3xl text-3xl font-bold disabled:opacity-40"
                      style={{
                        background:
                          selectedDuration === duration
                            ? `${selectedTeam === 'home' ? game.home_team_color : game.away_team_color}30`
                            : '#e0e0e0',
                        boxShadow:
                          selectedDuration === duration
                            ? 'inset 6px 6px 12px rgba(0,0,0,0.1), inset -6px -6px 12px rgba(255,255,255,0.7)'
                            : '10px 10px 20px rgba(0,0,0,0.1), -10px -10px 20px rgba(255,255,255,0.7)',
                        border: 'none',
                        color: '#666',
                      }}
                    >
                      {duration} seconds
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedAction === 'stat' ? (
            <div className="max-w-4xl mx-auto space-y-8">
              <button
                onClick={() => {
                  setSelectedAction(null);
                  setSelectedPlayer(null);
                  setStatType(null);
                  setStatValue(0);
                }}
                className="text-gray-500 hover:text-gray-700 mb-4"
              >
                &larr; Back to menu
              </button>

              {!selectedPlayer ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-4">
                    Select Player
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {onCourtPlayers.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => setSelectedPlayer(player)}
                        className="p-6 rounded-2xl flex flex-col items-center gap-3"
                        style={{
                          background: '#e0e0e0',
                          boxShadow:
                            '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                          border: 'none',
                        }}
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-white"
                          style={{
                            background:
                              player.team === 'home'
                                ? game.home_team_color
                                : game.away_team_color,
                          }}
                        >
                          {player.jersey_number}
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-700">
                            {player.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {player.team === 'home'
                              ? game.home_team_name
                              : game.away_team_name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : !statType ? (
                <div>
                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="text-gray-500 hover:text-gray-700 mb-4"
                  >
                    &larr; Back to players
                  </button>
                  <h3 className="text-lg font-semibold text-gray-600 mb-4">
                    Select Stat to Adjust for {selectedPlayer.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {STAT_OPTIONS.map((stat) => (
                      <button
                        key={stat.id}
                        onClick={() => setStatType(stat.id)}
                        className="p-6 rounded-2xl text-center"
                        style={{
                          background: '#e0e0e0',
                          boxShadow:
                            '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                          border: 'none',
                        }}
                      >
                        <div className="text-2xl font-bold text-gray-700">
                          {selectedPlayer[stat.id] as number}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          {stat.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setStatType(null)}
                    className="text-gray-500 hover:text-gray-700 mb-4"
                  >
                    &larr; Back to stats
                  </button>
                  <h3 className="text-lg font-semibold text-gray-600 mb-4">
                    Adjust{' '}
                    {STAT_OPTIONS.find((s) => s.id === statType)?.label} for{' '}
                    {selectedPlayer.name}
                  </h3>
                  <div
                    className="max-w-md mx-auto p-8 rounded-3xl text-center"
                    style={{
                      background: '#e0e0e0',
                      boxShadow:
                        'inset 6px 6px 12px rgba(0,0,0,0.1), inset -6px -6px 12px rgba(255,255,255,0.7)',
                    }}
                  >
                    <div className="text-5xl font-bold text-gray-700 mb-4">
                      {selectedPlayer[statType] as number} &rarr;{' '}
                      {(selectedPlayer[statType] as number) + statValue}
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <button
                        onClick={() => setStatValue(statValue - 1)}
                        className="w-16 h-16 rounded-2xl text-3xl font-bold"
                        style={{
                          background: '#e0e0e0',
                          boxShadow:
                            '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                          color: '#666',
                        }}
                      >
                        -
                      </button>
                      <div className="text-4xl font-bold text-gray-700 w-20">
                        {statValue > 0 ? '+' : ''}
                        {statValue}
                      </div>
                      <button
                        onClick={() => setStatValue(statValue + 1)}
                        className="w-16 h-16 rounded-2xl text-3xl font-bold"
                        style={{
                          background: '#e0e0e0',
                          boxShadow:
                            '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                          color: '#666',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : selectedAction === 'timer' ? (
            <div className="max-w-2xl mx-auto space-y-8">
              <button
                onClick={() => setSelectedAction(null)}
                className="text-gray-500 hover:text-gray-700 mb-4"
              >
                &larr; Back to menu
              </button>

              <div>
                <label className="text-lg font-semibold text-gray-600 mb-4 block">
                  Game Clock
                </label>
                <div
                  className="p-8 rounded-3xl text-center"
                  style={{
                    background: '#e0e0e0',
                    boxShadow:
                      'inset 6px 6px 12px rgba(0,0,0,0.1), inset -6px -6px 12px rgba(255,255,255,0.7)',
                  }}
                >
                  <div className="text-5xl font-bold text-gray-700 mb-6">
                    {formatTime(newGameClock)}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    {[
                      { label: '-1 min', delta: -60 },
                      { label: '-10s', delta: -10 },
                      { label: '+10s', delta: 10 },
                      { label: '+1 min', delta: 60 },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() =>
                          setNewGameClock(
                            Math.max(0, newGameClock + btn.delta)
                          )
                        }
                        className="px-6 py-3 rounded-xl font-semibold"
                        style={{
                          background: '#e0e0e0',
                          boxShadow:
                            '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-lg font-semibold text-gray-600 mb-4 block">
                  Shot Clock
                </label>
                <div
                  className="p-8 rounded-3xl text-center"
                  style={{
                    background: '#e0e0e0',
                    boxShadow:
                      'inset 6px 6px 12px rgba(0,0,0,0.1), inset -6px -6px 12px rgba(255,255,255,0.7)',
                  }}
                >
                  <div className="text-5xl font-bold text-gray-700 mb-6">
                    {newShotClock}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    {[
                      {
                        label: '-5s',
                        action: () =>
                          setNewShotClock(Math.max(0, newShotClock - 5)),
                      },
                      {
                        label: '-1s',
                        action: () =>
                          setNewShotClock(Math.max(0, newShotClock - 1)),
                      },
                      {
                        label: 'Reset 24',
                        action: () => setNewShotClock(24),
                      },
                      {
                        label: '+1s',
                        action: () => setNewShotClock(newShotClock + 1),
                      },
                      {
                        label: '+5s',
                        action: () => setNewShotClock(newShotClock + 5),
                      },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onClick={btn.action}
                        className="px-6 py-3 rounded-xl font-semibold"
                        style={{
                          background: '#e0e0e0',
                          boxShadow:
                            '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
