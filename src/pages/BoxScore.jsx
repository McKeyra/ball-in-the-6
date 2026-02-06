import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, FileText, FileSpreadsheet } from "lucide-react";

export default function BoxScore() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => base44.entities.Game.filter({ id: gameId }).then(g => g[0])
  });

  const { data: homeTeam } = useQuery({
    queryKey: ['team', game?.homeTeamId],
    queryFn: () => base44.entities.Team.filter({ id: game.homeTeamId }).then(t => t[0]),
    enabled: !!game?.homeTeamId
  });

  const { data: awayTeam } = useQuery({
    queryKey: ['team', game?.awayTeamId],
    queryFn: () => base44.entities.Team.filter({ id: game.awayTeamId }).then(t => t[0]),
    enabled: !!game?.awayTeamId
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => base44.entities.Player.list()
  });

  const { data: stats = [] } = useQuery({
    queryKey: ['stats', gameId],
    queryFn: () => base44.entities.PlayerStat.filter({ gameId }),
    enabled: !!gameId
  });

  const exportToCSV = () => {
    const headers = ['Player', 'Team', 'PTS', 'FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF'];
    
    const rows = stats.map(stat => {
      const player = players.find(p => p.id === stat.playerId);
      const team = player?.teamId === game?.homeTeamId ? homeTeam?.name : awayTeam?.name;
      const fgPct = stat.fga > 0 ? ((stat.fgm / stat.fga) * 100).toFixed(1) : '0.0';
      const fg3Pct = stat.fga3 > 0 ? ((stat.fgm3 / stat.fga3) * 100).toFixed(1) : '0.0';
      const ftPct = stat.fta > 0 ? ((stat.ftm / stat.fta) * 100).toFixed(1) : '0.0';
      
      return [
        player?.name,
        team,
        stat.points,
        stat.fgm,
        stat.fga,
        fgPct,
        stat.fgm3,
        stat.fga3,
        fg3Pct,
        stat.ftm,
        stat.fta,
        ftPct,
        stat.oreb,
        stat.dreb,
        stat.oreb + stat.dreb,
        stat.ast,
        stat.stl,
        stat.blk,
        stat.tov,
        stat.pf
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `box-score-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const exportData = {
      game,
      homeTeam,
      awayTeam,
      stats: stats.map(stat => ({
        ...stat,
        player: players.find(p => p.id === stat.playerId)
      }))
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderTeamStats = (teamId, teamName) => {
    const teamPlayers = players.filter(p => p.teamId === teamId);
    const teamStats = stats.filter(s => teamPlayers.some(p => p.id === s.playerId));

    return (
      <Card className="bg-white/[0.08] border-white/[0.08] mb-6">
        <CardHeader>
          <CardTitle className="text-white text-2xl">{teamName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.08]">
                  <TableHead className="text-white">Player</TableHead>
                  <TableHead className="text-white text-center">PTS</TableHead>
                  <TableHead className="text-white text-center">FG</TableHead>
                  <TableHead className="text-white text-center">3PT</TableHead>
                  <TableHead className="text-white text-center">FT</TableHead>
                  <TableHead className="text-white text-center">REB</TableHead>
                  <TableHead className="text-white text-center">AST</TableHead>
                  <TableHead className="text-white text-center">STL</TableHead>
                  <TableHead className="text-white text-center">BLK</TableHead>
                  <TableHead className="text-white text-center">TOV</TableHead>
                  <TableHead className="text-white text-center">PF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamStats.map(stat => {
                  const player = players.find(p => p.id === stat.playerId);
                  return (
                    <TableRow key={stat.id} className="border-white/[0.08]">
                      <TableCell className="text-white font-medium">
                        #{player?.number} {player?.name}
                      </TableCell>
                      <TableCell className="text-white text-center font-bold">{stat.points}</TableCell>
                      <TableCell className="text-white text-center">
                        {stat.fgm}/{stat.fga}
                      </TableCell>
                      <TableCell className="text-white text-center">
                        {stat.fgm3}/{stat.fga3}
                      </TableCell>
                      <TableCell className="text-white text-center">
                        {stat.ftm}/{stat.fta}
                      </TableCell>
                      <TableCell className="text-white text-center">
                        {stat.oreb + stat.dreb}
                      </TableCell>
                      <TableCell className="text-white text-center">{stat.ast}</TableCell>
                      <TableCell className="text-white text-center">{stat.stl}</TableCell>
                      <TableCell className="text-white text-center">{stat.blk}</TableCell>
                      <TableCell className="text-white text-center">{stat.tov}</TableCell>
                      <TableCell className="text-white text-center">{stat.pf}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("LiveGame") + `?gameId=${gameId}`)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Game
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={exportToJSON}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>

        <Card className="bg-white/[0.05] border-white/[0.08] mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Final Score</h1>
              <div className="flex justify-center items-center gap-8">
                <div>
                  <h2 className="text-2xl text-white mb-2">{homeTeam?.name}</h2>
                  <div className="text-6xl font-black text-white">{game?.homeScore}</div>
                </div>
                <div className="text-4xl text-white/50">-</div>
                <div>
                  <h2 className="text-2xl text-white mb-2">{awayTeam?.name}</h2>
                  <div className="text-6xl font-black text-white">{game?.awayScore}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {renderTeamStats(game?.homeTeamId, homeTeam?.name)}
        {renderTeamStats(game?.awayTeamId, awayTeam?.name)}
      </div>
    </div>
  );
}