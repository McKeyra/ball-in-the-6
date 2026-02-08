import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Play, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

export default function GameSetup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedHome, setSelectedHome] = useState(null);
  const [selectedAway, setSelectedAway] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    quarter_length_minutes: 10,
    overtime_length_minutes: 5,
    shot_clock_seconds: 24,
    timeouts_per_half: 2,
    foul_out_limit: 5,
    bonus_threshold: 5,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list()
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => base44.entities.Player.list()
  });

  const createGameMutation = useMutation({
    mutationFn: async () => {
      const homeTeam = teams.find(t => t.id === selectedHome);
      const awayTeam = teams.find(t => t.id === selectedAway);

      const game = await base44.entities.Game.create({
        home_team_id: selectedHome,
        away_team_id: selectedAway,
        home_team_name: homeTeam?.name || 'Home',
        away_team_name: awayTeam?.name || 'Away',
        home_team_color: homeTeam?.primary_color || homeTeam?.gradientStart || '#3B82F6',
        away_team_color: awayTeam?.primary_color || awayTeam?.gradientStart || '#F97316',
        home_score: 0,
        away_score: 0,
        quarter: 1,
        game_clock_seconds: settings.quarter_length_minutes * 60,
        shot_clock_seconds: settings.shot_clock_seconds,
        home_team_fouls: 0,
        away_team_fouls: 0,
        home_bonus_active: false,
        away_bonus_active: false,
        home_timeouts: settings.timeouts_per_half,
        away_timeouts: settings.timeouts_per_half,
        status: "live",
        quarter_length_minutes: settings.quarter_length_minutes,
        overtime_length_minutes: settings.overtime_length_minutes,
        game_date: new Date().toISOString(),
        settings: {
          quarter_length: settings.quarter_length_minutes,
          overtime_length: settings.overtime_length_minutes,
          foul_out_limit: settings.foul_out_limit,
          bonus_threshold: settings.bonus_threshold,
          shot_clock: settings.shot_clock_seconds,
          timeouts_per_half: settings.timeouts_per_half,
        }
      });

      // Create player stat records for all players on both teams
      const homePlayers = players.filter(p => p.team_id === selectedHome || p.teamId === selectedHome);
      const awayPlayers = players.filter(p => p.team_id === selectedAway || p.teamId === selectedAway);

      const statRecords = [...homePlayers, ...awayPlayers].map(player => ({
        game_id: game.id,
        player_id: player.id,
        team_id: player.team_id || player.teamId,
        points: 0,
        fgm: 0, fga: 0,
        fgm3: 0, fga3: 0,
        ftm: 0, fta: 0,
        oreb: 0, dreb: 0,
        ast: 0, stl: 0, blk: 0, tov: 0,
        pf: 0, tf: 0, uf: 0,
        minutes: 0,
      }));

      if (statRecords.length > 0) {
        try {
          await base44.entities.PlayerStat.bulkCreate(statRecords);
        } catch (e) {
          // If bulkCreate fails, create individually
          for (const record of statRecords) {
            try {
              await base44.entities.PlayerStat.create(record);
            } catch { /* skip if fails */ }
          }
        }
      }

      return game;
    },
    onSuccess: (game) => {
      queryClient.invalidateQueries(['games']);
      navigate(createPageUrl("LiveGame") + `?gameId=${game.id}`);
    }
  });

  const getTeamPlayers = (teamId) => {
    return players.filter(p => (p.team_id === teamId || p.teamId === teamId));
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto py-4 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-2 md:mb-4 tracking-tight">Game Setup</h1>
          <p className="text-white/60 text-sm md:text-base lg:text-lg">Select teams and configure game settings</p>
        </div>

        {/* Game Settings */}
        <div className="mb-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Game Settings</span>
            {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSettings && (
            <Card className="bg-white/[0.05] border-white/[0.08] mb-6">
              <CardContent className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Quarter Length (min)</label>
                  <Input
                    type="number"
                    value={settings.quarter_length_minutes}
                    onChange={(e) => setSettings(s => ({ ...s, quarter_length_minutes: parseInt(e.target.value) || 10 }))}
                    className="bg-white/[0.08] border-white/[0.08] text-white"
                    min={1} max={20}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Overtime Length (min)</label>
                  <Input
                    type="number"
                    value={settings.overtime_length_minutes}
                    onChange={(e) => setSettings(s => ({ ...s, overtime_length_minutes: parseInt(e.target.value) || 5 }))}
                    className="bg-white/[0.08] border-white/[0.08] text-white"
                    min={1} max={10}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Shot Clock (sec)</label>
                  <Input
                    type="number"
                    value={settings.shot_clock_seconds}
                    onChange={(e) => setSettings(s => ({ ...s, shot_clock_seconds: parseInt(e.target.value) || 24 }))}
                    className="bg-white/[0.08] border-white/[0.08] text-white"
                    min={14} max={35}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Timeouts per Half</label>
                  <Input
                    type="number"
                    value={settings.timeouts_per_half}
                    onChange={(e) => setSettings(s => ({ ...s, timeouts_per_half: parseInt(e.target.value) || 2 }))}
                    className="bg-white/[0.08] border-white/[0.08] text-white"
                    min={1} max={5}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Foul Out Limit</label>
                  <Input
                    type="number"
                    value={settings.foul_out_limit}
                    onChange={(e) => setSettings(s => ({ ...s, foul_out_limit: parseInt(e.target.value) || 5 }))}
                    className="bg-white/[0.08] border-white/[0.08] text-white"
                    min={4} max={6}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Bonus Threshold</label>
                  <Input
                    type="number"
                    value={settings.bonus_threshold}
                    onChange={(e) => setSettings(s => ({ ...s, bonus_threshold: parseInt(e.target.value) || 5 }))}
                    className="bg-white/[0.08] border-white/[0.08] text-white"
                    min={4} max={7}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
          {/* Home Team Selection */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl rounded-2xl">
            <CardHeader className="border-b border-white/10 p-4 md:p-6">
              <CardTitle className="text-white text-lg md:text-xl lg:text-2xl">Home Team</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-2 md:space-y-3 max-h-[400px] md:max-h-[600px] overflow-y-auto">
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => setSelectedHome(team.id)}
                  disabled={selectedAway === team.id}
                  className={`w-full p-4 md:p-5 rounded-xl text-left transition-all min-h-[60px] ${
                    selectedHome === team.id
                      ? 'ring-4 ring-white scale-[1.02] shadow-2xl'
                      : selectedAway === team.id
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:scale-[1.01] shadow-lg active:scale-[0.98]'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${team.gradientStart || team.primary_color || '#3B82F6'}, ${team.gradientEnd || team.primary_color || '#60A5FA'})`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight truncate">{team.name}</h3>
                      <p className="text-white/80 text-xs md:text-sm font-semibold mt-1">{team.abbreviation}</p>
                    </div>
                    <div className="text-white/90 text-center ml-2 flex-shrink-0">
                      <Users className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1" />
                      <span className="text-[10px] md:text-xs font-bold">{getTeamPlayers(team.id).length} players</span>
                    </div>
                  </div>
                </button>
              ))}
              {teams.length === 0 && (
                <div className="text-center py-8 text-white/40">
                  <p>No teams found. Create teams first.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Away Team Selection */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl rounded-2xl">
            <CardHeader className="border-b border-white/10 p-4 md:p-6">
              <CardTitle className="text-white text-lg md:text-xl lg:text-2xl">Away Team</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-2 md:space-y-3 max-h-[400px] md:max-h-[600px] overflow-y-auto">
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => setSelectedAway(team.id)}
                  disabled={selectedHome === team.id}
                  className={`w-full p-4 md:p-5 rounded-xl text-left transition-all min-h-[60px] ${
                    selectedAway === team.id
                      ? 'ring-4 ring-white scale-[1.02] shadow-2xl'
                      : selectedHome === team.id
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:scale-[1.01] shadow-lg active:scale-[0.98]'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${team.gradientStart || team.primary_color || '#F97316'}, ${team.gradientEnd || team.primary_color || '#FB923C'})`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight truncate">{team.name}</h3>
                      <p className="text-white/80 text-xs md:text-sm font-semibold mt-1">{team.abbreviation}</p>
                    </div>
                    <div className="text-white/90 text-center ml-2 flex-shrink-0">
                      <Users className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1" />
                      <span className="text-[10px] md:text-xs font-bold">{getTeamPlayers(team.id).length} players</span>
                    </div>
                  </div>
                </button>
              ))}
              {teams.length === 0 && (
                <div className="text-center py-8 text-white/40">
                  <p>No teams found. Create teams first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => createGameMutation.mutate()}
            disabled={!selectedHome || !selectedAway || createGameMutation.isPending}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-base md:text-lg lg:text-xl px-8 md:px-12 py-4 md:py-6 rounded-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] w-full sm:w-auto"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            {createGameMutation.isPending ? "Starting Game..." : "Start Game"}
          </Button>
        </div>
      </div>
    </div>
  );
}
