import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Play } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function GameSetup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedHome, setSelectedHome] = useState(null);
  const [selectedAway, setSelectedAway] = useState(null);

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
      const game = await base44.entities.Game.create({
        homeTeamId: selectedHome,
        awayTeamId: selectedAway,
        homeScore: 0,
        awayScore: 0,
        quarter: "Q1",
        gameClock: 600,
        shotClock: 24,
        homeTeamFouls: 0,
        awayTeamFouls: 0,
        homeBonusActive: false,
        awayBonusActive: false,
        homeTimeouts: 2,
        awayTimeouts: 2,
        status: "live",
        onCourtHome: [],
        onCourtAway: [],
        settings: {
          quarterLength: 10,
          overtimeLength: 5,
          foulOutLimit: 5,
          bonusRule: "FIBA",
          bonusThreshold: 5,
          soundEnabled: true
        }
      });

      // Create player stats for all players
      const homePlayers = players.filter(p => p.teamId === selectedHome);
      const awayPlayers = players.filter(p => p.teamId === selectedAway);
      
      for (const player of [...homePlayers, ...awayPlayers]) {
        await base44.entities.PlayerStat.create({
          gameId: game.id,
          playerId: player.id,
          points: 0,
          fgm: 0, fga: 0,
          fgm3: 0, fga3: 0,
          ftm: 0, fta: 0,
          oreb: 0, dreb: 0,
          ast: 0, stl: 0, blk: 0, tov: 0,
          pf: 0, tf: 0, uf: 0
        });
      }

      return game;
    },
    onSuccess: (game) => {
      navigate(createPageUrl("LiveGame") + `?gameId=${game.id}`);
    }
  });

  const initializeSampleData = async () => {
    // Create diverse teams with different names and colors
    const teamsData = [
      {
        name: "Thunderbolts",
        abbreviation: "THD",
        primaryColor: "#3B82F6",
        gradientStart: "#2563EB",
        gradientEnd: "#60A5FA"
      },
      {
        name: "Phoenix",
        abbreviation: "PHX",
        primaryColor: "#F97316",
        gradientStart: "#EA580C",
        gradientEnd: "#FB923C"
      },
      {
        name: "Dragons",
        abbreviation: "DRG",
        primaryColor: "#DC2626",
        gradientStart: "#B91C1C",
        gradientEnd: "#EF4444"
      },
      {
        name: "Titans",
        abbreviation: "TTN",
        primaryColor: "#9333EA",
        gradientStart: "#7C3AED",
        gradientEnd: "#A855F7"
      },
      {
        name: "Warriors",
        abbreviation: "WAR",
        primaryColor: "#EAB308",
        gradientStart: "#CA8A04",
        gradientEnd: "#FACC15"
      },
      {
        name: "Knights",
        abbreviation: "KNT",
        primaryColor: "#475569",
        gradientStart: "#334155",
        gradientEnd: "#64748B"
      },
      {
        name: "Eagles",
        abbreviation: "EGL",
        primaryColor: "#059669",
        gradientStart: "#047857",
        gradientEnd: "#10B981"
      },
      {
        name: "Vipers",
        abbreviation: "VPR",
        primaryColor: "#0891B2",
        gradientStart: "#0E7490",
        gradientEnd: "#06B6D4"
      }
    ];

    for (const teamData of teamsData) {
      const team = await base44.entities.Team.create(teamData);

      // Create 10 players for each team
      for (let i = 1; i <= 10; i++) {
        await base44.entities.Player.create({
          teamId: team.id,
          name: `${teamData.name.slice(0, 3).toUpperCase()}${i}`,
          number: String(i),
          position: ["PG", "SG", "SF", "PF", "C"][i % 5]
        });
      }
    }

    queryClient.invalidateQueries(['teams']);
    queryClient.invalidateQueries(['players']);
  };

  useEffect(() => {
    if (teams.length === 0) {
      initializeSampleData();
    }
  }, []);

  const getTeamPlayers = (teamId) => {
    return players.filter(p => p.teamId === teamId);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto py-4 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-2 md:mb-4 tracking-tight">Basketball Stats Pro</h1>
          <p className="text-white/60 text-sm md:text-base lg:text-lg">Select teams to start a new game</p>
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
                    background: `linear-gradient(135deg, ${team.gradientStart}, ${team.gradientEnd})`
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
                    background: `linear-gradient(135deg, ${team.gradientStart}, ${team.gradientEnd})`
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