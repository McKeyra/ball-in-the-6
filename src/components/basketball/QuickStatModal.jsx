import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function QuickStatModal({ game, players, onClose }) {
  const queryClient = useQueryClient();
  const [selectedStat, setSelectedStat] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const onCourtPlayers = players.filter(p => p.on_court);

  const statOptions = [
    { id: '2pt_make', label: '2PT Make', points: 2, icon: '🎯' },
    { id: '3pt_make', label: '3PT Make', points: 3, icon: '🏀' },
    { id: 'ft_make', label: 'FT Make', points: 1, icon: '✓' },
    { id: 'assist', label: 'Assist', points: 0, icon: '👏' },
    { id: 'rebound_def', label: 'Def Rebound', points: 0, icon: '⬇️' },
    { id: 'rebound_off', label: 'Off Rebound', points: 0, icon: '⬆️' },
    { id: 'steal', label: 'Steal', points: 0, icon: '🤚' },
    { id: 'block', label: 'Block', points: 0, icon: '🚫' },
    { id: 'turnover', label: 'Turnover', points: 0, icon: '❌' },
    { id: 'foul_personal', label: 'Personal Foul', points: 0, icon: '⚠️' }
  ];

  const createEventMutation = useMutation({
    mutationFn: async ({ player, stat }) => {
      await base44.entities.GameEvent.create({
        game_id: game.id,
        player_id: player.id,
        event_type: stat.id,
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        points: stat.points,
        team: player.team,
        description: `${player.name} ${stat.label.toLowerCase()}`
      });

      const updates = {};
      if (stat.id === '2pt_make') {
        updates.fgm = player.fgm + 1;
        updates.fga = player.fga + 1;
        updates.points = player.points + 2;
      } else if (stat.id === '3pt_make') {
        updates.fgm = player.fgm + 1;
        updates.fga = player.fga + 1;
        updates.three_pm = player.three_pm + 1;
        updates.three_pa = player.three_pa + 1;
        updates.points = player.points + 3;
      } else if (stat.id === 'ft_make') {
        updates.ftm = player.ftm + 1;
        updates.fta = player.fta + 1;
        updates.points = player.points + 1;
      } else if (stat.id === 'assist') {
        updates.assists = player.assists + 1;
      } else if (stat.id === 'rebound_def') {
        updates.rebounds_def = player.rebounds_def + 1;
      } else if (stat.id === 'rebound_off') {
        updates.rebounds_off = player.rebounds_off + 1;
      } else if (stat.id === 'steal') {
        updates.steals = player.steals + 1;
      } else if (stat.id === 'block') {
        updates.blocks = player.blocks + 1;
      } else if (stat.id === 'turnover') {
        updates.turnovers = player.turnovers + 1;
      } else if (stat.id === 'foul_personal') {
        updates.personal_fouls = player.personal_fouls + 1;
      }

      await base44.entities.Player.update(player.id, updates);

      const gameUpdates = {};
      if (stat.points > 0) {
        const scoreField = player.team === 'home' ? 'home_score' : 'away_score';
        gameUpdates[scoreField] = game[scoreField] + stat.points;
      }
      
      if (stat.id === '2pt_make' || stat.id === '3pt_make') {
        gameUpdates.shot_clock_seconds = 24;
      }
      
      if (Object.keys(gameUpdates).length > 0) {
        await base44.entities.Game.update(game.id, gameUpdates);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['players']);
      queryClient.invalidateQueries(['games']);
      onClose();
    },
  });

  const handleConfirm = () => {
    if (selectedStat && selectedPlayer) {
      createEventMutation.mutate({ player: selectedPlayer, stat: selectedStat });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: '#e0e0e0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          maxHeight: '85vh'
        }}
      >
        {/* Fixed Header with Confirm */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-300">
          <h2 className="text-2xl font-bold text-gray-700">Quick Stat Entry</h2>
          <div className="flex items-center gap-3">
            {selectedPlayer && selectedStat && (
              <Button
                onClick={handleConfirm}
                disabled={createEventMutation.isPending}
                className="h-10 px-6 font-semibold"
                style={{
                  background: selectedPlayer.team === 'home' ? game.home_team_color : game.away_team_color,
                  color: 'white',
                  boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
                  border: 'none'
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              style={{
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                background: '#e0e0e0'
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
          {!selectedStat ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Select Stat Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {statOptions.map(stat => (
                  <button
                    key={stat.id}
                    onClick={() => setSelectedStat(stat)}
                    className="p-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all"
                    style={{
                      background: '#e0e0e0',
                      boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                      border: 'none'
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = 'inset 4px 4px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)';
                    }}
                  >
                    <div className="text-3xl">{stat.icon}</div>
                    <div className="text-sm font-semibold text-gray-700 text-center">{stat.label}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => {
                  setSelectedStat(null);
                  setSelectedPlayer(null);
                }}
                className="text-sm text-gray-500 mb-4 hover:text-gray-700"
              >
                ← Back to stats
              </button>
              <h3 className="text-sm font-semibold text-gray-600 mb-4">
                Select Player for {selectedStat.label}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Home Team */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {game.home_team_name}
                  </div>
                  <div className="space-y-2">
                    {onCourtPlayers.filter(p => p.team === 'home').map(player => (
                      <button
                        key={player.id}
                        onClick={() => setSelectedPlayer(player)}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          selectedPlayer?.id === player.id ? 'ring-2' : ''
                        }`}
                        style={{
                          background: selectedPlayer?.id === player.id 
                            ? `${game.home_team_color}30` 
                            : '#e0e0e0',
                          boxShadow: selectedPlayer?.id === player.id 
                            ? 'inset 2px 2px 4px rgba(0,0,0,0.1)'
                            : '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.7)',
                          border: 'none',
                          ringColor: game.home_team_color
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                            style={{ background: game.home_team_color }}
                          >
                            {player.jersey_number}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-700">{player.name}</div>
                            <div className="text-xs text-gray-500">{player.position}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Away Team */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {game.away_team_name}
                  </div>
                  <div className="space-y-2">
                    {onCourtPlayers.filter(p => p.team === 'away').map(player => (
                      <button
                        key={player.id}
                        onClick={() => setSelectedPlayer(player)}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          selectedPlayer?.id === player.id ? 'ring-2' : ''
                        }`}
                        style={{
                          background: selectedPlayer?.id === player.id 
                            ? `${game.away_team_color}30` 
                            : '#e0e0e0',
                          boxShadow: selectedPlayer?.id === player.id 
                            ? 'inset 2px 2px 4px rgba(0,0,0,0.1)'
                            : '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.7)',
                          border: 'none',
                          ringColor: game.away_team_color
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                            style={{ background: game.away_team_color }}
                          >
                            {player.jersey_number}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-700">{player.name}</div>
                            <div className="text-xs text-gray-500">{player.position}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}