import { base44 } from "@/api/base44Client";

/**
 * Aggregates a game player's stats to their persistent player career totals.
 * Should be called when a game is marked as finished.
 */
export async function aggregatePlayerCareerStats(gamePlayer) {
  if (!gamePlayer.persistent_player_id || gamePlayer.stats_aggregated) {
    return null;
  }

  try {
    // Get the persistent player
    const persistentPlayers = await base44.entities.PersistentPlayer.filter({ 
      id: gamePlayer.persistent_player_id 
    });
    
    if (persistentPlayers.length === 0) {
      console.warn(`PersistentPlayer not found: ${gamePlayer.persistent_player_id}`);
      return null;
    }

    const persistentPlayer = persistentPlayers[0];

    // Calculate updated career stats
    const updatedStats = {
      career_games: (persistentPlayer.career_games || 0) + 1,
      career_points: (persistentPlayer.career_points || 0) + (gamePlayer.points || 0),
      career_assists: (persistentPlayer.career_assists || 0) + (gamePlayer.assists || 0),
      career_rebounds: (persistentPlayer.career_rebounds || 0) + 
        (gamePlayer.rebounds_off || 0) + (gamePlayer.rebounds_def || 0),
      career_steals: (persistentPlayer.career_steals || 0) + (gamePlayer.steals || 0),
      career_blocks: (persistentPlayer.career_blocks || 0) + (gamePlayer.blocks || 0),
      career_turnovers: (persistentPlayer.career_turnovers || 0) + (gamePlayer.turnovers || 0),
      career_fgm: (persistentPlayer.career_fgm || 0) + (gamePlayer.fgm || 0),
      career_fga: (persistentPlayer.career_fga || 0) + (gamePlayer.fga || 0),
      career_three_pm: (persistentPlayer.career_three_pm || 0) + (gamePlayer.three_pm || 0),
      career_three_pa: (persistentPlayer.career_three_pa || 0) + (gamePlayer.three_pa || 0),
      career_ftm: (persistentPlayer.career_ftm || 0) + (gamePlayer.ftm || 0),
      career_fta: (persistentPlayer.career_fta || 0) + (gamePlayer.fta || 0),
      career_minutes: (persistentPlayer.career_minutes || 0) + (gamePlayer.minutes_played || 0),
      career_fouls: (persistentPlayer.career_fouls || 0) + (gamePlayer.personal_fouls || 0)
    };

    // Update persistent player
    await base44.entities.PersistentPlayer.update(
      gamePlayer.persistent_player_id, 
      updatedStats
    );

    // Mark game player as aggregated
    await base44.entities.Player.update(gamePlayer.id, { stats_aggregated: true });

    return updatedStats;
  } catch (error) {
    console.error('Error aggregating career stats:', error);
    return null;
  }
}

/**
 * Aggregates all players' stats for a finished game.
 * Should be called when game status changes to 'finished'.
 */
export async function aggregateGameCareerStats(gameId) {
  try {
    const gamePlayers = await base44.entities.Player.filter({ game_id: gameId });
    
    const results = await Promise.all(
      gamePlayers
        .filter(p => p.persistent_player_id && !p.stats_aggregated)
        .map(player => aggregatePlayerCareerStats(player))
    );

    return results.filter(r => r !== null);
  } catch (error) {
    console.error('Error aggregating game career stats:', error);
    return [];
  }
}

/**
 * Updates team win/loss records after a finished game.
 */
export async function updateTeamRecords(game) {
  if (game.status !== 'finished') return;

  try {
    const homeWon = game.home_score > game.away_score;
    const awayWon = game.away_score > game.home_score;
    const isTie = game.home_score === game.away_score;

    if (game.home_team_id) {
      const homeTeams = await base44.entities.Team.filter({ id: game.home_team_id });
      if (homeTeams.length > 0) {
        const homeTeam = homeTeams[0];
        await base44.entities.Team.update(game.home_team_id, {
          wins: (homeTeam.wins || 0) + (homeWon ? 1 : 0),
          losses: (homeTeam.losses || 0) + (awayWon ? 1 : 0),
          ties: (homeTeam.ties || 0) + (isTie ? 1 : 0)
        });
      }
    }

    if (game.away_team_id) {
      const awayTeams = await base44.entities.Team.filter({ id: game.away_team_id });
      if (awayTeams.length > 0) {
        const awayTeam = awayTeams[0];
        await base44.entities.Team.update(game.away_team_id, {
          wins: (awayTeam.wins || 0) + (awayWon ? 1 : 0),
          losses: (awayTeam.losses || 0) + (homeWon ? 1 : 0),
          ties: (awayTeam.ties || 0) + (isTie ? 1 : 0)
        });
      }
    }
  } catch (error) {
    console.error('Error updating team records:', error);
  }
}

/**
 * Complete game finalization - aggregates stats and updates records.
 */
export async function finalizeGame(game) {
  if (game.status !== 'finished') {
    console.warn('Game must be finished before finalizing');
    return;
  }

  await aggregateGameCareerStats(game.id);
  await updateTeamRecords(game);
}