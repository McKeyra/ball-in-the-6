import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsPDF } from 'npm:jspdf@4.1.0';

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId } = await req.json();

    const { data: games } = await supabase.from('game').select('*').eq('id', gameId);
    const game = games?.[0];
    const { data: players } = await supabase.from('player').select('*').eq('game_id', gameId);
    const { data: events } = await supabase.from('event').select('*').eq('game_id', gameId);

    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL SCORESHEET', 105, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${game.sport.toUpperCase()} • ${new Date(game.created_date).toLocaleDateString()}`, 105, yPos, { align: 'center' });
    yPos += 15;

    // Final Score Box
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(game.home_team_name, 50, yPos);
    doc.text(`${game.home_score}`, 90, yPos, { align: 'right' });
    doc.text('-', 105, yPos, { align: 'center' });
    doc.text(`${game.away_score}`, 120, yPos);
    doc.text(game.away_team_name, 130, yPos);
    yPos += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`FINAL • Quarter ${game.period}`, 105, yPos, { align: 'center' });
    yPos += 15;

    // Team Stats Summary
    const homePlayers = (players || []).filter(p => p.team === 'home');
    const awayPlayers = (players || []).filter(p => p.team === 'away');

    const calculateTeamStats = (teamPlayers) => {
      const fgm = teamPlayers.reduce((sum, p) => sum + (p.field_goals_made || 0), 0);
      const fga = teamPlayers.reduce((sum, p) => sum + (p.field_goals_attempted || 0), 0);
      const threepm = teamPlayers.reduce((sum, p) => sum + (p.three_pointers_made || 0), 0);
      const threepa = teamPlayers.reduce((sum, p) => sum + (p.three_pointers_attempted || 0), 0);
      const ftm = teamPlayers.reduce((sum, p) => sum + (p.free_throws_made || 0), 0);
      const fta = teamPlayers.reduce((sum, p) => sum + (p.free_throws_attempted || 0), 0);
      const reb = teamPlayers.reduce((sum, p) => sum + (p.rebounds_offensive || 0) + (p.rebounds_defensive || 0), 0);
      const ast = teamPlayers.reduce((sum, p) => sum + (p.assists || 0), 0);
      const stl = teamPlayers.reduce((sum, p) => sum + (p.steals || 0), 0);
      const blk = teamPlayers.reduce((sum, p) => sum + (p.blocks || 0), 0);
      const tov = teamPlayers.reduce((sum, p) => sum + (p.turnovers || 0), 0);
      const pf = teamPlayers.reduce((sum, p) => sum + (p.personal_fouls || 0), 0);

      return { fgm, fga, threepm, threepa, ftm, fta, reb, ast, stl, blk, tov, pf };
    };

    const homeStats = calculateTeamStats(homePlayers);
    const awayStats = calculateTeamStats(awayPlayers);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TEAM STATISTICS', 20, yPos);
    yPos += 7;

    doc.setFontSize(8);
    const statsLabels = ['FG', '3PT', 'FT', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF'];
    const homeStatsValues = [
      `${homeStats.fgm}-${homeStats.fga}`,
      `${homeStats.threepm}-${homeStats.threepa}`,
      `${homeStats.ftm}-${homeStats.fta}`,
      homeStats.reb,
      homeStats.ast,
      homeStats.stl,
      homeStats.blk,
      homeStats.tov,
      homeStats.pf,
    ];
    const awayStatsValues = [
      `${awayStats.fgm}-${awayStats.fga}`,
      `${awayStats.threepm}-${awayStats.threepa}`,
      `${awayStats.ftm}-${awayStats.fta}`,
      awayStats.reb,
      awayStats.ast,
      awayStats.stl,
      awayStats.blk,
      awayStats.tov,
      awayStats.pf,
    ];

    doc.setFont('helvetica', 'normal');
    statsLabels.forEach((label, i) => {
      doc.text(label, 20, yPos + (i * 5));
      doc.text(homeStatsValues[i].toString(), 50, yPos + (i * 5));
      doc.text(awayStatsValues[i].toString(), 70, yPos + (i * 5));
    });
    yPos += 50;

    // Player Box Scores - Home Team
    if (yPos > 250) { doc.addPage(); yPos = 20; }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${game.home_team_name} - PLAYER STATISTICS`, 20, yPos);
    yPos += 7;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    const headers = ['#', 'PLAYER', 'PTS', 'FG', '3P', 'FT', 'REB', 'AST', 'STL', 'BLK', 'TO', 'PF', 'eFG%'];
    let xPos = 20;
    const colWidths = [8, 30, 12, 15, 15, 15, 12, 12, 12, 12, 12, 12, 15];

    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos);
      xPos += colWidths[i];
    });
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    homePlayers.forEach((player) => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }

      const efg = player.field_goals_attempted > 0
        ? (((player.field_goals_made + 0.5 * player.three_pointers_made) / player.field_goals_attempted) * 100).toFixed(1)
        : '0.0';

      const rowData = [
        player.jersey_number,
        player.name.substring(0, 15),
        player.points,
        `${player.field_goals_made}-${player.field_goals_attempted}`,
        `${player.three_pointers_made}-${player.three_pointers_attempted}`,
        `${player.free_throws_made}-${player.free_throws_attempted}`,
        (player.rebounds_offensive || 0) + (player.rebounds_defensive || 0),
        player.assists || 0,
        player.steals || 0,
        player.blocks || 0,
        player.turnovers || 0,
        player.personal_fouls || 0,
        `${efg}%`,
      ];

      xPos = 20;
      rowData.forEach((val, i) => {
        doc.text(val.toString(), xPos, yPos);
        xPos += colWidths[i];
      });
      yPos += 5;
    });

    yPos += 10;

    // Player Box Scores - Away Team
    if (yPos > 250) { doc.addPage(); yPos = 20; }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${game.away_team_name} - PLAYER STATISTICS`, 20, yPos);
    yPos += 7;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    xPos = 20;
    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos);
      xPos += colWidths[i];
    });
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    awayPlayers.forEach((player) => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }

      const efg = player.field_goals_attempted > 0
        ? (((player.field_goals_made + 0.5 * player.three_pointers_made) / player.field_goals_attempted) * 100).toFixed(1)
        : '0.0';

      const rowData = [
        player.jersey_number,
        player.name.substring(0, 15),
        player.points,
        `${player.field_goals_made}-${player.field_goals_attempted}`,
        `${player.three_pointers_made}-${player.three_pointers_attempted}`,
        `${player.free_throws_made}-${player.free_throws_attempted}`,
        (player.rebounds_offensive || 0) + (player.rebounds_defensive || 0),
        player.assists || 0,
        player.steals || 0,
        player.blocks || 0,
        player.turnovers || 0,
        player.personal_fouls || 0,
        `${efg}%`,
      ];

      xPos = 20;
      rowData.forEach((val, i) => {
        doc.text(val.toString(), xPos, yPos);
        xPos += colWidths[i];
      });
      yPos += 5;
    });

    // Game Summary
    doc.addPage();
    yPos = 20;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GAME SUMMARY', 20, yPos);
    yPos += 10;

    // Top Performers
    const allPlayers = [...(players || [])];
    const topScorer = [...allPlayers].sort((a, b) => b.points - a.points)[0];
    const topRebounder = [...allPlayers].sort((a, b) =>
      ((b.rebounds_offensive || 0) + (b.rebounds_defensive || 0)) -
      ((a.rebounds_offensive || 0) + (a.rebounds_defensive || 0))
    )[0];
    const topAssister = [...allPlayers].sort((a, b) => (b.assists || 0) - (a.assists || 0))[0];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOP PERFORMERS', 20, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.text(`Most Points: ${topScorer.name} (${topScorer.points} PTS)`, 20, yPos);
    yPos += 6;
    doc.text(`Most Rebounds: ${topRebounder.name} (${(topRebounder.rebounds_offensive || 0) + (topRebounder.rebounds_defensive || 0)} REB)`, 20, yPos);
    yPos += 6;
    doc.text(`Most Assists: ${topAssister.name} (${topAssister.assists || 0} AST)`, 20, yPos);
    yPos += 10;

    // Advanced Metrics
    doc.setFont('helvetica', 'bold');
    doc.text('TEAM SHOOTING EFFICIENCY', 20, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    const homeFGPct = homeStats.fga > 0 ? ((homeStats.fgm / homeStats.fga) * 100).toFixed(1) : '0.0';
    const awayFGPct = awayStats.fga > 0 ? ((awayStats.fgm / awayStats.fga) * 100).toFixed(1) : '0.0';
    const homeEFG = homeStats.fga > 0 ? (((homeStats.fgm + 0.5 * homeStats.threepm) / homeStats.fga) * 100).toFixed(1) : '0.0';
    const awayEFG = awayStats.fga > 0 ? (((awayStats.fgm + 0.5 * awayStats.threepm) / awayStats.fga) * 100).toFixed(1) : '0.0';

    doc.text(`${game.home_team_name} FG%: ${homeFGPct}% | eFG%: ${homeEFG}%`, 20, yPos);
    yPos += 6;
    doc.text(`${game.away_team_name} FG%: ${awayFGPct}% | eFG%: ${awayEFG}%`, 20, yPos);
    yPos += 10;

    // Play-by-Play (last page)
    if ((events || []).length > 0) {
      doc.addPage();
      yPos = 20;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PLAY-BY-PLAY LOG', 20, yPos);
      yPos += 10;

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');

      const sortedEvents = (events || []).sort((a, b) => b.created_date.localeCompare(a.created_date));

      sortedEvents.slice(0, 50).forEach((event) => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }

        const player = (players || []).find(p => p.id === event.player_id);
        const playerName = player ? player.name : 'Team';
        const eventLabel = event.event_type.replace(/_/g, ' ').toUpperCase();
        const time = `Q${event.period} ${Math.floor(event.clock_milliseconds / 60000)}:${Math.floor((event.clock_milliseconds % 60000) / 1000).toString().padStart(2, '0')}`;

        doc.text(`${time} - ${event.team.toUpperCase()} - ${playerName}: ${eventLabel}`, 20, yPos);
        yPos += 5;
      });
    }

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=game-${gameId}-report.pdf`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
