import { useState } from 'react';
import { X, Plus, Minus, Play, RotateCcw, Download, FileJson, FileSpreadsheet, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function GameSettings({ game, players, events, onClose, isRunning, setIsRunning }) {
  const queryClient = useQueryClient();
  const [editScores, setEditScores] = useState(false);
  const [homeScore, setHomeScore] = useState(game.home_score);
  const [awayScore, setAwayScore] = useState(game.away_score);
  const [editGameInfo, setEditGameInfo] = useState(false);
  const [gameInfo, setGameInfo] = useState({
    location: game.location || '',
    game_date: game.game_date || '',
    game_time: game.game_time || '',
    referee_1: game.referee_1 || '',
    referee_2: game.referee_2 || '',
    referee_3: game.referee_3 || ''
  });

  const updateGameMutation = useMutation({
    mutationFn: async (updates) => {
      await base44.entities.Game.update(game.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['games']);
      queryClient.invalidateQueries(['game']);
    },
  });

  const exportToCSV = () => {
    const headers = ['Player', 'Team', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO', 'FG', '3PT', 'FT'];
    const rows = players.map(p => [
      p.name,
      p.team === 'home' ? game.home_team_name : game.away_team_name,
      p.points,
      p.rebounds_off + p.rebounds_def,
      p.assists,
      p.steals,
      p.blocks,
      p.turnovers,
      `${p.fgm}/${p.fga}`,
      `${p.three_pm}/${p.three_pa}`,
      `${p.ftm}/${p.fta}`
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game_stats.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  const exportToJSON = () => {
    const data = {
      game: {
        home_team: game.home_team_name,
        away_team: game.away_team_name,
        home_score: game.home_score,
        away_score: game.away_score,
        quarter: game.quarter
      },
      players: players.map(p => ({
        name: p.name,
        team: p.team,
        stats: {
          points: p.points,
          rebounds: p.rebounds_off + p.rebounds_def,
          assists: p.assists,
          steals: p.steals,
          blocks: p.blocks,
          turnovers: p.turnovers,
          fg: `${p.fgm}/${p.fga}`,
          three_pt: `${p.three_pm}/${p.three_pa}`,
          ft: `${p.ftm}/${p.fta}`
        }
      }))
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game_stats.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  const exportToPDF = async () => {
    try {
      const response = await base44.functions.invoke('exportGamePDF', {
        game_id: game.id
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'game_stats.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('PDF export failed:', error);
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
        {/* Fixed Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-300">
          <h2 className="text-2xl font-bold text-gray-700">Game Settings</h2>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Timer Control */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Timer Control</h3>
            <div 
              className="p-4 rounded-2xl"
              style={{
                background: '#e0e0e0',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Game Timer</span>
                </div>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="relative w-14 h-7 rounded-full transition-all"
                  style={{
                    background: isRunning ? '#10b981' : '#e0e0e0',
                    boxShadow: isRunning 
                      ? 'inset 2px 2px 4px rgba(0,0,0,0.2)' 
                      : '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                  }}
                >
                  <div
                    className="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all"
                    style={{
                      left: isRunning ? 'calc(100% - 26px)' : '2px',
                      boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isRunning ? 'Timer is running' : 'Timer is stopped'}
              </p>
            </div>
          </div>

          {/* Game Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Game Information</h3>
            <div 
              className="p-4 rounded-2xl space-y-3"
              style={{
                background: '#e0e0e0',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
              }}
            >
              {editGameInfo ? (
                <>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Location</label>
                    <Input
                      value={gameInfo.location}
                      onChange={(e) => setGameInfo({...gameInfo, location: e.target.value})}
                      placeholder="e.g. Madison Square Garden"
                      className="bg-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Date</label>
                      <Input
                        type="date"
                        value={gameInfo.game_date}
                        onChange={(e) => setGameInfo({...gameInfo, game_date: e.target.value})}
                        className="bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Time</label>
                      <Input
                        type="time"
                        value={gameInfo.game_time}
                        onChange={(e) => setGameInfo({...gameInfo, game_time: e.target.value})}
                        className="bg-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Referee 1</label>
                    <Input
                      value={gameInfo.referee_1}
                      onChange={(e) => setGameInfo({...gameInfo, referee_1: e.target.value})}
                      placeholder="First referee name"
                      className="bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Referee 2</label>
                    <Input
                      value={gameInfo.referee_2}
                      onChange={(e) => setGameInfo({...gameInfo, referee_2: e.target.value})}
                      placeholder="Second referee name"
                      className="bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Referee 3 (Optional)</label>
                    <Input
                      value={gameInfo.referee_3}
                      onChange={(e) => setGameInfo({...gameInfo, referee_3: e.target.value})}
                      placeholder="Third referee name (optional)"
                      className="bg-transparent"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => {
                        updateGameMutation.mutate(gameInfo);
                        setEditGameInfo(false);
                      }}
                      className="flex-1"
                      style={{
                        background: '#10b981',
                        color: 'white'
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setGameInfo({
                          location: game.location || '',
                          game_date: game.game_date || '',
                          game_time: game.game_time || '',
                          referee_1: game.referee_1 || '',
                          referee_2: game.referee_2 || '',
                          referee_3: game.referee_3 || ''
                        });
                        setEditGameInfo(false);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Location:</span>
                      <span className="text-sm font-semibold">{game.location || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Date:</span>
                      <span className="text-sm font-semibold">{game.game_date || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Time:</span>
                      <span className="text-sm font-semibold">{game.game_time || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Referee 1:</span>
                      <span className="text-sm font-semibold">{game.referee_1 || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Referee 2:</span>
                      <span className="text-sm font-semibold">{game.referee_2 || 'Not set'}</span>
                    </div>
                    {game.referee_3 && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Referee 3:</span>
                        <span className="text-sm font-semibold">{game.referee_3}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => setEditGameInfo(true)}
                    className="w-full"
                    style={{
                      background: '#e0e0e0',
                      boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                      color: '#666'
                    }}
                  >
                    Edit Game Info
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Score Management */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Score Management</h3>
            <div 
              className="p-4 rounded-2xl space-y-3"
              style={{
                background: '#e0e0e0',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{game.home_team_name}</span>
                {editScores ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: '#e0e0e0',
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)'
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={homeScore}
                      onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                      className="w-16 text-center text-lg font-bold bg-transparent"
                    />
                    <button
                      onClick={() => setHomeScore(homeScore + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: '#e0e0e0',
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)'
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{game.home_score}</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{game.away_team_name}</span>
                {editScores ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: '#e0e0e0',
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)'
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={awayScore}
                      onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                      className="w-16 text-center text-lg font-bold bg-transparent"
                    />
                    <button
                      onClick={() => setAwayScore(awayScore + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: '#e0e0e0',
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)'
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{game.away_score}</span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {editScores ? (
                  <>
                    <Button
                      onClick={() => {
                        updateGameMutation.mutate({ home_score: homeScore, away_score: awayScore });
                        setEditScores(false);
                      }}
                      className="flex-1"
                      style={{
                        background: '#10b981',
                        color: 'white'
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setHomeScore(game.home_score);
                        setAwayScore(game.away_score);
                        setEditScores(false);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setEditScores(true)}
                    className="w-full"
                    style={{
                      background: '#e0e0e0',
                      boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                      color: '#666'
                    }}
                  >
                    Edit Scores
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Clock Controls */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Clock & Quarter</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => updateGameMutation.mutate({ 
                  quarter: Math.min(game.quarter + 1, 8),
                  game_clock_seconds: game.quarter_length_minutes * 60,
                  home_team_fouls: 0,
                  away_team_fouls: 0
                })}
                style={{
                  background: '#e0e0e0',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                  color: '#666'
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Next Quarter
              </Button>
              <Button
                onClick={() => updateGameMutation.mutate({ 
                  game_clock_seconds: game.quarter_length_minutes * 60,
                  shot_clock_seconds: 24
                })}
                style={{
                  background: '#e0e0e0',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                  color: '#666'
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Clocks
              </Button>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Export Game Data</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={exportToCSV}
                className="flex flex-col items-center gap-1 h-auto py-3"
                style={{
                  background: '#e0e0e0',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                  color: '#666'
                }}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="text-xs">CSV</span>
              </Button>
              <Button
                onClick={exportToJSON}
                className="flex flex-col items-center gap-1 h-auto py-3"
                style={{
                  background: '#e0e0e0',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                  color: '#666'
                }}
              >
                <FileJson className="w-5 h-5" />
                <span className="text-xs">JSON</span>
              </Button>
              <Button
                onClick={exportToPDF}
                className="flex flex-col items-center gap-1 h-auto py-3"
                style={{
                  background: '#e0e0e0',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                  color: '#666'
                }}
              >
                <Download className="w-5 h-5" />
                <span className="text-xs">PDF</span>
              </Button>
            </div>
          </div>

          <div 
            className="p-4 rounded-2xl"
            style={{
              background: '#e0e0e0',
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.7)'
            }}
          >
            <div className="text-xs text-gray-500 text-center">
              💡 Tip: Use Event Feed to delete individual events if errors occur. Manual score adjustments don't affect event history.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}