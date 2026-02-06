import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Clock, TrendingUp } from "lucide-react";

export default function GameView() {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get("id");

  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => base44.entities.Game.filter({ id: gameId }).then((games) => games[0]),
    enabled: !!gameId,
  });

  const { data: players = [] } = useQuery({
    queryKey: ["players", gameId],
    queryFn: () => base44.entities.Player.filter({ game_id: gameId }),
    enabled: !!gameId,
  });

  if (gameLoading || !game) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const homePlayers = players.filter((p) => p.team === "home");
  const awayPlayers = players.filter((p) => p.team === "away");

  const formatClock = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTeamStats = (teamPlayers) => {
    return {
      points: teamPlayers.reduce((sum, p) => sum + p.points, 0),
      rebounds: teamPlayers.reduce((sum, p) => sum + (p.rebounds_offensive || 0) + (p.rebounds_defensive || 0), 0),
      assists: teamPlayers.reduce((sum, p) => sum + p.assists, 0),
      steals: teamPlayers.reduce((sum, p) => sum + p.steals, 0),
      blocks: teamPlayers.reduce((sum, p) => sum + p.blocks, 0),
    };
  };

  const homeStats = getTeamStats(homePlayers);
  const awayStats = getTeamStats(awayPlayers);

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-white">Game Stats</h1>
          </div>
          <p className="text-white/40">Read-only view</p>
        </div>

        {/* Scoreboard */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-white/[0.07] p-8">
            <div className="flex items-center justify-center gap-12">
              <div className="text-center">
                <p className="text-white/70 text-sm mb-2">{game.home_team_name}</p>
                <p
                  className="text-6xl font-black tabular-nums"
                  style={{ color: `hsl(${game.home_color_hue}, 70%, 60%)` }}
                >
                  {game.home_score}
                </p>
              </div>

              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 border-2"
                  style={{
                    backgroundColor: `hsl(${game.home_color_hue}, 60%, 45%)`,
                    borderColor: `hsl(${game.home_color_hue}, 60%, 60%)`,
                  }}
                >
                  Q{game.period}
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-semibold">{formatClock(game.clock_milliseconds)}</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/70 text-sm mb-2">{game.away_team_name}</p>
                <p
                  className="text-6xl font-black tabular-nums"
                  style={{ color: `hsl(${game.away_color_hue}, 70%, 60%)` }}
                >
                  {game.away_score}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Stats Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader style={{ backgroundColor: `hsl(${game.home_color_hue}, 60%, 95%)` }}>
              <CardTitle style={{ color: `hsl(${game.home_color_hue}, 70%, 40%)` }}>
                {game.home_team_name} Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Total Rebounds</span>
                  <span className="font-bold text-lg">{homeStats.rebounds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Assists</span>
                  <span className="font-bold text-lg">{homeStats.assists}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Steals</span>
                  <span className="font-bold text-lg">{homeStats.steals}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Blocks</span>
                  <span className="font-bold text-lg">{homeStats.blocks}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ backgroundColor: `hsl(${game.away_color_hue}, 60%, 95%)` }}>
              <CardTitle style={{ color: `hsl(${game.away_color_hue}, 70%, 40%)` }}>
                {game.away_team_name} Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Total Rebounds</span>
                  <span className="font-bold text-lg">{awayStats.rebounds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Assists</span>
                  <span className="font-bold text-lg">{awayStats.assists}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Steals</span>
                  <span className="font-bold text-lg">{awayStats.steals}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Blocks</span>
                  <span className="font-bold text-lg">{awayStats.blocks}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Stats Tables */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div
                  className="w-4 h-6 rounded"
                  style={{ backgroundColor: `hsl(${game.home_color_hue}, 70%, 50%)` }}
                />
                {game.home_team_name} Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2 font-semibold">#</th>
                      <th className="pb-2 font-semibold">Player</th>
                      <th className="pb-2 font-semibold text-center">PTS</th>
                      <th className="pb-2 font-semibold text-center">REB</th>
                      <th className="pb-2 font-semibold text-center">AST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homePlayers.map((player) => (
                      <tr key={player.id} className="border-b last:border-0">
                        <td className="py-3 font-bold" style={{ color: `hsl(${game.home_color_hue}, 70%, 50%)` }}>
                          {player.jersey_number}
                        </td>
                        <td className="py-3">{player.name}</td>
                        <td className="py-3 text-center font-semibold">{player.points}</td>
                        <td className="py-3 text-center">{(player.rebounds_offensive || 0) + (player.rebounds_defensive || 0)}</td>
                        <td className="py-3 text-center">{player.assists}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div
                  className="w-4 h-6 rounded"
                  style={{ backgroundColor: `hsl(${game.away_color_hue}, 70%, 50%)` }}
                />
                {game.away_team_name} Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2 font-semibold">#</th>
                      <th className="pb-2 font-semibold">Player</th>
                      <th className="pb-2 font-semibold text-center">PTS</th>
                      <th className="pb-2 font-semibold text-center">REB</th>
                      <th className="pb-2 font-semibold text-center">AST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awayPlayers.map((player) => (
                      <tr key={player.id} className="border-b last:border-0">
                        <td className="py-3 font-bold" style={{ color: `hsl(${game.away_color_hue}, 70%, 50%)` }}>
                          {player.jersey_number}
                        </td>
                        <td className="py-3">{player.name}</td>
                        <td className="py-3 text-center font-semibold">{player.points}</td>
                        <td className="py-3 text-center">{(player.rebounds_offensive || 0) + (player.rebounds_defensive || 0)}</td>
                        <td className="py-3 text-center">{player.assists}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}