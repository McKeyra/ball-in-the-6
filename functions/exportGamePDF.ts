import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsPDF } from 'npm:jspdf@4.1.0';

Deno.serve(async (req) => {
    try {
        const authHeader = req.headers.get('Authorization');
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        // Verify user
        const token = authHeader?.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { gameId } = await req.json();

        const { data: games } = await supabase.from('game').select('*').eq('id', gameId);
        const game = games?.[0];
        const { data: players } = await supabase.from('player').select('*').eq('game_id', gameId);
        const { data: events } = await supabase.from('game_event').select('*').eq('game_id', gameId).order('created_date', { ascending: false });

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        let yPos = 20;

        // Helper functions
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        const calculateAdvanced = (player) => {
            const efg = player.fga > 0 ? ((player.fgm + 0.5 * player.three_pm) / player.fga * 100).toFixed(1) : '0.0';
            const ts = player.fga > 0 ? (player.points / (2 * (player.fga + 0.44 * player.fta)) * 100).toFixed(1) : '0.0';
            const astTo = player.turnovers > 0 ? (player.assists / player.turnovers).toFixed(2) : player.assists.toFixed(2);
            const totalReb = player.rebounds_off + player.rebounds_def;
            const per = (player.points + totalReb + player.assists + player.steals + player.blocks - (player.fga - player.fgm) - (player.fta - player.ftm) - player.turnovers).toFixed(1);
            return { efg, ts, astTo, totalReb, per };
        };

        // Title - FIBA Style
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('OFFICIAL SCORESHEET', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        // Game Header
        doc.setFontSize(16);
        doc.text(`${game.home_team_name} vs ${game.away_team_name}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;

        // Final Score
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text(`${game.home_score} - ${game.away_score}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 12;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Quarter ${game.quarter} • ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;

        // Team Box Scores
        const homePlayers = (players || []).filter(p => p.team === 'home');
        const awayPlayers = (players || []).filter(p => p.team === 'away');

        const drawTeamTable = (teamName, teamPlayers, startY) => {
            let y = startY;

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(teamName, 14, y);
            y += 7;

            // Table Headers
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            const headers = ['#', 'Name', 'PTS', 'FGM-A', '3PM-A', 'FTM-A', 'REB', 'AST', 'STL', 'BLK', 'TO', 'PF'];
            const colWidths = [8, 30, 12, 18, 18, 18, 12, 12, 12, 12, 12, 12];
            let x = 14;

            headers.forEach((header, i) => {
                doc.text(header, x, y);
                x += colWidths[i];
            });

            y += 5;
            doc.line(14, y, 196, y);
            y += 5;

            // Player Rows
            doc.setFont('helvetica', 'normal');
            teamPlayers.forEach(player => {
                x = 14;
                const stats = calculateAdvanced(player);
                const row = [
                    player.jersey_number.toString(),
                    player.name,
                    player.points.toString(),
                    `${player.fgm}-${player.fga}`,
                    `${player.three_pm}-${player.three_pa}`,
                    `${player.ftm}-${player.fta}`,
                    stats.totalReb.toString(),
                    player.assists.toString(),
                    player.steals.toString(),
                    player.blocks.toString(),
                    player.turnovers.toString(),
                    player.personal_fouls.toString()
                ];

                row.forEach((val, i) => {
                    doc.text(val, x, y);
                    x += colWidths[i];
                });
                y += 5;
            });

            y += 3;
            doc.line(14, y, 196, y);
            return y + 10;
        };

        yPos = drawTeamTable(game.home_team_name, homePlayers, yPos);

        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        yPos = drawTeamTable(game.away_team_name, awayPlayers, yPos);

        // Game Summary - Key Achievements
        doc.addPage();
        yPos = 20;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('GAME SUMMARY', pageWidth / 2, yPos, { align: 'center' });
        yPos += 12;

        const allPlayers = [...homePlayers, ...awayPlayers];
        const topScorer = allPlayers.reduce((max, p) => p.points > max.points ? p : max, allPlayers[0]);
        const topRebounder = allPlayers.reduce((max, p) => {
            const maxReb = max.rebounds_off + max.rebounds_def;
            const pReb = p.rebounds_off + p.rebounds_def;
            return pReb > maxReb ? p : max;
        }, allPlayers[0]);
        const topAssister = allPlayers.reduce((max, p) => p.assists > max.assists ? p : max, allPlayers[0]);
        const bestEfg = allPlayers.filter(p => p.fga >= 5).reduce((max, p) => {
            const maxEfg = calculateAdvanced(max).efg;
            const pEfg = calculateAdvanced(p).efg;
            return parseFloat(pEfg) > parseFloat(maxEfg) ? p : max;
        }, allPlayers.filter(p => p.fga >= 5)[0] || allPlayers[0]);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');

        const highlights = [
            { title: 'Top Scorer', player: topScorer, stat: `${topScorer.points} PTS` },
            { title: 'Top Rebounder', player: topRebounder, stat: `${topRebounder.rebounds_off + topRebounder.rebounds_def} REB` },
            { title: 'Assist Leader', player: topAssister, stat: `${topAssister.assists} AST` },
            { title: 'Best Shooting Efficiency', player: bestEfg, stat: `${calculateAdvanced(bestEfg).efg}% eFG` }
        ];

        highlights.forEach(h => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${h.title}:`, 20, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(`${h.player.name} (#${h.player.jersey_number}) - ${h.stat}`, 70, yPos);
            yPos += 8;
        });

        yPos += 10;

        // Advanced Metrics Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('ADVANCED METRICS', 20, yPos);
        yPos += 8;

        doc.setFontSize(8);
        const advHeaders = ['Player', 'Team', 'eFG%', 'TS%', 'AST/TO', 'PER'];
        const advWidths = [40, 30, 20, 20, 20, 20];
        let x = 14;

        advHeaders.forEach((h, i) => {
            doc.text(h, x, yPos);
            x += advWidths[i];
        });

        yPos += 5;
        doc.line(14, yPos, 196, yPos);
        yPos += 5;

        doc.setFont('helvetica', 'normal');
        allPlayers.forEach(player => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            const stats = calculateAdvanced(player);
            const teamName = player.team === 'home' ? game.home_team_name : game.away_team_name;
            x = 14;

            const advRow = [
                player.name,
                teamName,
                stats.efg + '%',
                stats.ts + '%',
                stats.astTo,
                stats.per
            ];

            advRow.forEach((val, i) => {
                doc.text(val, x, yPos);
                x += advWidths[i];
            });
            yPos += 5;
        });

        // Play-by-Play Log
        doc.addPage();
        yPos = 20;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('PLAY-BY-PLAY', pageWidth / 2, yPos, { align: 'center' });
        yPos += 12;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Q', 14, yPos);
        doc.text('Time', 24, yPos);
        doc.text('Event', 45, yPos);
        yPos += 5;
        doc.line(14, yPos, 196, yPos);
        yPos += 5;

        doc.setFont('helvetica', 'normal');
        (events || []).slice(0, 100).forEach(event => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }

            doc.text(`Q${event.quarter}`, 14, yPos);
            doc.text(formatTime(event.game_clock_seconds), 24, yPos);
            doc.text(event.description.substring(0, 80), 45, yPos);
            yPos += 5;
        });

        const pdfBytes = doc.output('arraybuffer');

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=game-scoresheet-${new Date().toISOString().split('T')[0]}.pdf`
            }
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});
