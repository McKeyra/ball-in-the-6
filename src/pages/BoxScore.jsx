import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, FileSpreadsheet } from "lucide-react";

export default function BoxScore() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => base44.entities.Game.get(gameId),
    enabled: !!gameId
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const { data: allPlayers = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => base44.entities.Player.list()
  });

  const { data: stats = [] } = useQuery({
    queryKey: ['stats', gameId],
    queryFn: () => base44.entities.PlayerStat.filter({ game_id: gameId }),
    enabled: !!gameId
  });

  const homeTeam = teams.find(t => t.id === game?.home_team_id);
  const awayTeam = teams.find(t => t.id === game?.away_team_id);

  // Get players for this game
  const gamePlayers = allPlayers.filter(p =>
    p.game_id === gameId ||
    p.team_id === game?.home_team_id || p.team_id === game?.away_team_id ||
    p.teamId === game?.home_team_id || p.teamId === game?.away_team_id
  );

  const exportToCSV = () => {
    const headers = ['Player', 'Team', 'PTS', 'FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF'];

    const rows = stats.map(stat => {
      const player = gamePlayers.find(p => p.id === stat.player_id);
      const isHome = player?.team === 'home' || player?.team_id === game?.home_team_id || player?.teamId === game?.home_team_id;
      const team = isHome ? (game?.home_team_name || homeTeam?.name) : (game?.away_team_name || awayTeam?.name);
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
        (stat.oreb || 0) + (stat.dreb || 0),
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
        player: gamePlayers.find(p => p.id === stat.player_id)
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

  const renderTeamStats = (teamId, teamName, teamColor) => {
    // Find players for this team
    const teamPlayers = gamePlayers.filter(p =>
      p.team_id === teamId || p.teamId === teamId ||
      (teamId === game?.home_team_id && p.team === 'home') ||
      (teamId === game?.away_team_id && p.team === 'away')
    );
    const teamStats = stats.filter(s => teamPlayers.some(p => p.id === s.player_id));

    // Team totals
    const totals = teamStats.reduce((acc, s) => ({
      points: acc.points + (s.points || 0),
      fgm: acc.fgm + (s.fgm || 0),
      fga: acc.fga + (s.fga || 0),
      fgm3: acc.fgm3 + (s.fgm3 || 0),
      fga3: acc.fga3 + (s.fga3 || 0),
      ftm: acc.ftm + (s.ftm || 0),
      fta: acc.fta + (s.fta || 0),
      oreb: acc.oreb + (s.oreb || 0),
      dreb: acc.dreb + (s.dreb || 0),
      ast: acc.ast + (s.ast || 0),
      stl: acc.stl + (s.stl || 0),
      blk: acc.blk + (s.blk || 0),
      tov: acc.tov + (s.tov || 0),
      pf: acc.pf + (s.pf || 0),
    }), { points: 0, fgm: 0, fga: 0, fgm3: 0, fga3: 0, ftm: 0, fta: 0, oreb: 0, dreb: 0, ast: 0, stl: 0, blk: 0, tov: 0, pf: 0 });

    return (
      <Card className="bg-white/[0.08] border-white/[0.08] mb-4 md:mb-6">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-white text-lg md:text-xl lg:text-2xl flex items-center gap-3">
            {teamColor && <div className="w-4 h-4 rounded-full" style={{ background: teamColor }} />}
            {teamName || 'Team'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow className="border-white/[0.08]">
                  <TableHead className="text-white text-xs md:text-sm">Player</TableHead>
                  <TableHead className="text-white text-center text-xs md:text-sm">PTS</TableHead>
                  <TableHead className="text-white text-center text-xs md:text-sm hidden md:table-cell">FG</TableHead>
                  <TableHead className="text-white text-center text-xs md:text-sm hidden md:table-cell">3PT</TableHead>
                  <TableHead className="text-white text-center text-xs md:text-sm hidden md:table-cell">FT</TableHead>
                  <TableHead className="text-white text-center text-xs md:text-sm">REB</TableHead>
                  <TableHead className="text-white text-center text-xs md:text-sm">AST</TableHead>
                  <TableHead className="text-white text-center text-xs md:text-sm hidden sm:table-cell">STL</TableHead>
                  <TableHead className="text-white text-center text-xs md:text-sm hidden sm:table-cell">BLK</TableHead>
                  <TableHead className="text-white text-center text-xs md:text-sm hidden lg:table-cell">TOV</TableHead>
                  <TableHead className="text-white text-center text-xs md:text-sm hidden lg:table-cell">PF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamStats.map(stat => {
                  const player = gamePlayers.find(p => p.id === stat.player_id);
                  return (
                    <TableRow key={stat.id} className="border-white/[0.08] min-h-[44px]">
                      <TableCell className="text-white font-medium text-xs md:text-sm py-3">
                        #{player?.jersey_number || player?.number || '0'} {player?.name}
                      </TableCell>
                      <TableCell className="text-white text-center font-bold text-xs md:text-sm">{stat.points || 0}</TableCell>
                      <TableCell className="text-white text-center text-xs md:text-sm hidden md:table-cell">
                        {stat.fgm || 0}/{stat.fga || 0}
                      </TableCell>
                      <TableCell className="text-white text-center text-xs md:text-sm hidden md:table-cell">
                        {stat.fgm3 || 0}/{stat.fga3 || 0}
                      </TableCell>
                      <TableCell className="text-white text-center text-xs md:text-sm hidden md:table-cell">
                        {stat.ftm || 0}/{stat.fta || 0}
                      </TableCell>
                      <TableCell className="text-white text-center text-xs md:text-sm">
                        {(stat.oreb || 0) + (stat.dreb || 0)}
                      </TableCell>
                      <TableCell className="text-white text-center text-xs md:text-sm">{stat.ast || 0}</TableCell>
                      <TableCell className="text-white text-center text-xs md:text-sm hidden sm:table-cell">{stat.stl || 0}</TableCell>
                      <TableCell className="text-white text-center text-xs md:text-sm hidden sm:table-cell">{stat.blk || 0}</TableCell>
                      <TableCell className="text-white text-center text-xs md:text-sm hidden lg:table-cell">{stat.tov || 0}</TableCell>
                      <TableCell className="text-white text-center text-xs md:text-sm hidden lg:table-cell">{stat.pf || 0}</TableCell>
                    </TableRow>
                  );
                })}
                {/* Totals Row */}
                <TableRow className="border-white/[0.15] bg-white/[0.03]">
                  <TableCell className="text-white font-bold text-xs md:text-sm py-3">TOTALS</TableCell>
                  <TableCell className="text-white text-center font-bold text-xs md:text-sm">{totals.points}</TableCell>
                  <TableCell className="text-white text-center text-xs md:text-sm hidden md:table-cell font-medium">
                    {totals.fgm}/{totals.fga}
                  </TableCell>
                  <TableCell className="text-white text-center text-xs md:text-sm hidden md:table-cell font-medium">
                    {totals.fgm3}/{totals.fga3}
                  </TableCell>
                  <TableCell className="text-white text-center text-xs md:text-sm hidden md:table-cell font-medium">
                    {totals.ftm}/{totals.fta}
                  </TableCell>
                  <TableCell className="text-white text-center text-xs md:text-sm font-medium">{totals.oreb + totals.dreb}</TableCell>
                  <TableCell className="text-white text-center text-xs md:text-sm font-medium">{totals.ast}</TableCell>
                  <TableCell className="text-white text-center text-xs md:text-sm hidden sm:table-cell font-medium">{totals.stl}</TableCell>
                  <TableCell className="text-white text-center text-xs md:text-sm hidden sm:table-cell font-medium">{totals.blk}</TableCell>
                  <TableCell className="text-white text-center text-xs md:text-sm hidden lg:table-cell font-medium">{totals.tov}</TableCell>
                  <TableCell className="text-white text-center text-xs md:text-sm hidden lg:table-cell font-medium">{totals.pf}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto py-4 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("LiveGame") + `?gameId=${gameId}`)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Game
          </Button>

          <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
            <Button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white min-h-[44px] flex-1 sm:flex-initial text-xs md:text-sm"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Export</span> CSV
            </Button>
            <Button
              onClick={exportToJSON}
              className="bg-blue-600 hover:bg-blue-700 text-white min-h-[44px] flex-1 sm:flex-initial text-xs md:text-sm"
            >
              <FileText className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Export</span> JSON
            </Button>
          </div>
        </div>

        <Card className="bg-white/[0.05] border-white/[0.08] mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6 lg:p-8">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                {game?.status === 'completed' ? 'Final Score' : 'Current Score'}
              </h1>
              <div className="flex justify-center items-center gap-4 md:gap-8">
                <div>
                  <h2 className="text-base md:text-xl lg:text-2xl text-white mb-2 truncate max-w-[120px] md:max-w-none">
                    {game?.home_team_name || homeTeam?.name || 'Home'}
                  </h2>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black" style={{ color: game?.home_team_color || '#c9a962' }}>
                    {game?.home_score || 0}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl lg:text-4xl text-white/50">-</div>
                <div>
                  <h2 className="text-base md:text-xl lg:text-2xl text-white mb-2 truncate max-w-[120px] md:max-w-none">
                    {game?.away_team_name || awayTeam?.name || 'Away'}
                  </h2>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black" style={{ color: game?.away_team_color || '#6366f1' }}>
                    {game?.away_score || 0}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {renderTeamStats(game?.home_team_id, game?.home_team_name || homeTeam?.name, game?.home_team_color)}
        {renderTeamStats(game?.away_team_id, game?.away_team_name || awayTeam?.name, game?.away_team_color)}
      </div>
    </div>
  );
}
