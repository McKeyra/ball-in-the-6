import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Clock } from "lucide-react";

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
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Game Stats</h1>
          </div>
          <p className="text-sm md:text-base text-white/40">Read-only view</p>
        </div>

        {/* Scoreboard */}
        <Card className="mb-6 md:mb-8 overflow-hidden">
          <div className="bg-white/[0.07] p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-12">
              <div className="text-center">
                <p className="text-white/70 text-xs md:text-sm mb-1 md:mb-2 truncate max-w-[80px] md:max-w-none">{game.home_team_name}</p>
                <p
                  className="text-4xl md:text-5xl lg:text-6xl font-black tabular-nums"
                  style={{ color: `hsl(${game.home_color_hue}, 70%, 60%)` }}
                >
                  {game.home_score}
                </p>
              </div>

              <div className="text-center">
                <div
                  className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl mb-1 md:mb-2 border-2"
                  style={{
                    backgroundColor: `hsl(${game.home_color_hue}, 60%, 45%)`,
                    borderColor: `hsl(${game.home_color_hue}, 60%, 60%)`,
                  }}
                >
                  Q{game.period}
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-white/70">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="font-mono font-semibold text-sm md:text-base">{formatClock(game.clock_milliseconds)}</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/70 text-xs md:text-sm mb-1 md:mb-2 truncate max-w-[80px] md:max-w-none">{game.away_team_name}</p>
                <p
                  className="text-4xl md:text-5xl lg:text-6xl font-black tabular-nums"
                  style={{ color: `hsl(${game.away_color_hue}, 70%, 60%)` }}
                >
                  {game.away_score}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Stats Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="p-4 md:p-6" style={{ backgroundColor: `hsl(${game.home_color_hue}, 60%, 95%)` }}>
              <CardTitle className="text-base md:text-lg" style={{ color: `hsl(${game.home_color_hue}, 70%, 40%)` }}>
                {game.home_team_name} Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center min-h-[44px]">
                  <span className="text-white/60 text-sm md:text-base">Total Rebounds</span>
                  <span className="font-bold text-base md:text-lg">{homeStats.rebounds}</span>
                </div>
                <div className="flex justify-between items-center min-h-[44px]">
                  <span className="text-white/60 text-sm md:text-base">Assists</span>
                  <span className="font-bold text-base md:text-lg">{homeStats.assists}</span>
                </div>
                <div className="flex justify-between items-center min-h-[44px]">
                  <span className="text-white/60 text-sm md:text-base">Steals</span>
                  <span className="font-bold text-base md:text-lg">{homeStats.steals}</span>
                </div>
                <div className="flex justify-between items-center min-h-[44px]">
                  <span className="text-white/60 text-sm md:text-base">Blocks</span>
                  <span className="font-bold text-base md:text-lg">{homeStats.blocks}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 md:p-6" style={{ backgroundColor: `hsl(${game.away_color_hue}, 60%, 95%)` }}>
              <CardTitle className="text-base md:text-lg" style={{ color: `hsl(${game.away_color_hue}, 70%, 40%)` }}>
                {game.away_team_name} Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center min-h-[44px]">
                  <span className="text-white/60 text-sm md:text-base">Total Rebounds</span>
                  <span className="font-bold text-base md:text-lg">{awayStats.rebounds}</span>
                </div>
                <div className="flex justify-between items-center min-h-[44px]">
                  <span className="text-white/60 text-sm md:text-base">Assists</span>
                  <span className="font-bold text-base md:text-lg">{awayStats.assists}</span>
                </div>
                <div className="flex justify-between items-center min-h-[44px]">
                  <span className="text-white/60 text-sm md:text-base">Steals</span>
                  <span className="font-bold text-base md:text-lg">{awayStats.steals}</span>
                </div>
                <div className="flex justify-between items-center min-h-[44px]">
                  <span className="text-white/60 text-sm md:text-base">Blocks</span>
                  <span className="font-bold text-base md:text-lg">{awayStats.blocks}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Stats Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <div
                  className="w-3 h-5 md:w-4 md:h-6 rounded"
                  style={{ backgroundColor: `hsl(${game.home_color_hue}, 70%, 50%)` }}
                />
                {game.home_team_name} Players
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full text-xs md:text-sm min-w-[280px]">
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
                      <tr key={player.id} className="border-b last:border-0 min-h-[44px]">
                        <td className="py-3 font-bold" style={{ color: `hsl(${game.home_color_hue}, 70%, 50%)` }}>
                          {player.jersey_number}
                        </td>
                        <td className="py-3 truncate max-w-[100px] md:max-w-none">{player.name}</td>
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
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <div
                  className="w-3 h-5 md:w-4 md:h-6 rounded"
                  style={{ backgroundColor: `hsl(${game.away_color_hue}, 70%, 50%)` }}
                />
                {game.away_team_name} Players
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full text-xs md:text-sm min-w-[280px]">
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
                      <tr key={player.id} className="border-b last:border-0 min-h-[44px]">
                        <td className="py-3 font-bold" style={{ color: `hsl(${game.away_color_hue}, 70%, 50%)` }}>
                          {player.jersey_number}
                        </td>
                        <td className="py-3 truncate max-w-[100px] md:max-w-none">{player.name}</td>
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