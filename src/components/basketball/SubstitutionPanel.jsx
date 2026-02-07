import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function SubstitutionPanel({ game, players, onClose }) {
  const queryClient = useQueryClient();
  const [selectedTeam, setSelectedTeam] = useState('home');
  const [playerOut, setPlayerOut] = useState(null);
  const [playerIn, setPlayerIn] = useState(null);

  const teamPlayers = players.filter(p => p.team === selectedTeam);
  const onCourtPlayers = teamPlayers.filter(p => p.on_court);
  const benchPlayers = teamPlayers.filter(p => !p.on_court);

  const substituteMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Player.update(playerOut.id, { on_court: false });
      await base44.entities.Player.update(playerIn.id, { on_court: true });
      
      await base44.entities.GameEvent.create({
        game_id: game.id,
        player_id: playerIn.id,
        event_type: 'substitution',
        quarter: game.quarter,
        game_clock_seconds: game.game_clock_seconds,
        team: playerIn.team,
        description: `${playerIn.name} in for ${playerOut.name}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['players']);
      queryClient.invalidateQueries(['events']);
      setPlayerOut(null);
      setPlayerIn(null);
      onClose();
    },
  });

  const handleConfirm = () => {
    if (playerOut && playerIn) {
      substituteMutation.mutate();
    }
  };

  const canConfirm = playerOut && playerIn;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: '#e0e0e0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          maxHeight: '85vh'
        }}
      >
        {/* Fixed Header with Confirm */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-300">
          <h2 className="text-2xl font-bold text-gray-700">Substitution</h2>
          <div className="flex items-center gap-3">
            {canConfirm && (
              <Button
                onClick={handleConfirm}
                disabled={substituteMutation.isPending}
                className="h-10 px-6 font-semibold"
                style={{
                  background: selectedTeam === 'home' ? game.home_team_color : game.away_team_color,
                  color: 'white',
                  boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
                  border: 'none'
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Sub
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
          <Tabs value={selectedTeam} onValueChange={setSelectedTeam} className="w-full">
            <TabsList 
              className="grid w-full grid-cols-2 mb-6"
              style={{
                background: '#e0e0e0',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
                padding: '4px',
                borderRadius: '12px'
              }}
            >
              <TabsTrigger 
                value="home"
                style={{ 
                  background: selectedTeam === 'home' ? game.home_team_color : 'transparent',
                  color: selectedTeam === 'home' ? 'white' : '#666',
                  borderRadius: '8px'
                }}
              >
                {game.home_team_name}
              </TabsTrigger>
              <TabsTrigger 
                value="away"
                style={{ 
                  background: selectedTeam === 'away' ? game.away_team_color : 'transparent',
                  color: selectedTeam === 'away' ? 'white' : '#666',
                  borderRadius: '8px'
                }}
              >
                {game.away_team_name}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTeam} className="mt-0">
              <div className="grid grid-cols-2 gap-6">
                {/* Player Out */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">OUT</span>
                    On Court
                  </h3>
                  <div className="space-y-2">
                    {onCourtPlayers.map(player => (
                      <button
                        key={player.id}
                        onClick={() => setPlayerOut(player)}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          playerOut?.id === player.id ? 'ring-2' : ''
                        }`}
                        style={{
                          background: playerOut?.id === player.id 
                            ? `${selectedTeam === 'home' ? game.home_team_color : game.away_team_color}30` 
                            : '#e0e0e0',
                          boxShadow: playerOut?.id === player.id 
                            ? 'inset 2px 2px 4px rgba(0,0,0,0.1)'
                            : '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.7)',
                          border: 'none',
                          ringColor: selectedTeam === 'home' ? game.home_team_color : game.away_team_color
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                            style={{ background: selectedTeam === 'home' ? game.home_team_color : game.away_team_color }}
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

                {/* Player In */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">IN</span>
                    Bench
                  </h3>
                  <div className="space-y-2">
                    {benchPlayers.map(player => (
                      <button
                        key={player.id}
                        onClick={() => setPlayerIn(player)}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          playerIn?.id === player.id ? 'ring-2' : ''
                        }`}
                        style={{
                          background: playerIn?.id === player.id 
                            ? `${selectedTeam === 'home' ? game.home_team_color : game.away_team_color}30` 
                            : '#e0e0e0',
                          boxShadow: playerIn?.id === player.id 
                            ? 'inset 2px 2px 4px rgba(0,0,0,0.1)'
                            : '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.7)',
                          border: 'none',
                          ringColor: selectedTeam === 'home' ? game.home_team_color : game.away_team_color
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                            style={{ background: selectedTeam === 'home' ? game.home_team_color : game.away_team_color }}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}