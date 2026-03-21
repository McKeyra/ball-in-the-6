// TODO: Replace base44 API calls with actual API client

interface GamePlayer {
  id: string;
  persistent_player_id?: string;
  stats_aggregated?: boolean;
  points?: number;
  assists?: number;
  rebounds_off?: number;
  rebounds_def?: number;
  steals?: number;
  blocks?: number;
  turnovers?: number;
  fgm?: number;
  fga?: number;
  three_pm?: number;
  three_pa?: number;
  ftm?: number;
  fta?: number;
  minutes_played?: number;
  personal_fouls?: number;
  game_id?: string;
}

interface PersistentPlayer {
  id: string;
  career_games?: number;
  career_points?: number;
  career_assists?: number;
  career_rebounds?: number;
  career_steals?: number;
  career_blocks?: number;
  career_turnovers?: number;
  career_fgm?: number;
  career_fga?: number;
  career_three_pm?: number;
  career_three_pa?: number;
  career_ftm?: number;
  career_fta?: number;
  career_minutes?: number;
  career_fouls?: number;
}

interface CareerStats {
  career_games: number;
  career_points: number;
  career_assists: number;
  career_rebounds: number;
  career_steals: number;
  career_blocks: number;
  career_turnovers: number;
  career_fgm: number;
  career_fga: number;
  career_three_pm: number;
  career_three_pa: number;
  career_ftm: number;
  career_fta: number;
  career_minutes: number;
  career_fouls: number;
}

interface Game {
  id: string;
  status: string;
  home_score: number;
  away_score: number;
  home_team_id?: string;
  away_team_id?: string;
}

/**
 * Aggregates a game player's stats to their persistent player career totals.
 * Should be called when a game is marked as finished.
 */
export async function aggregatePlayerCareerStats(
  gamePlayer: GamePlayer
): Promise<CareerStats | null> {
  if (!gamePlayer.persistent_player_id || gamePlayer.stats_aggregated) {
    return null;
  }

  try {
    // TODO: Replace with actual API call
    const res = await fetch(
      `/api/persistent-players?id=${gamePlayer.persistent_player_id}`
    );
    const persistentPlayers: PersistentPlayer[] = await res.json();

    if (persistentPlayers.length === 0) {
      console.warn(
        `PersistentPlayer not found: ${gamePlayer.persistent_player_id}`
      );
      return null;
    }

    const persistentPlayer = persistentPlayers[0];

    const updatedStats: CareerStats = {
      career_games: (persistentPlayer.career_games || 0) + 1,
      career_points:
        (persistentPlayer.career_points || 0) + (gamePlayer.points || 0),
      career_assists:
        (persistentPlayer.career_assists || 0) + (gamePlayer.assists || 0),
      career_rebounds:
        (persistentPlayer.career_rebounds || 0) +
        (gamePlayer.rebounds_off || 0) +
        (gamePlayer.rebounds_def || 0),
      career_steals:
        (persistentPlayer.career_steals || 0) + (gamePlayer.steals || 0),
      career_blocks:
        (persistentPlayer.career_blocks || 0) + (gamePlayer.blocks || 0),
      career_turnovers:
        (persistentPlayer.career_turnovers || 0) + (gamePlayer.turnovers || 0),
      career_fgm:
        (persistentPlayer.career_fgm || 0) + (gamePlayer.fgm || 0),
      career_fga:
        (persistentPlayer.career_fga || 0) + (gamePlayer.fga || 0),
      career_three_pm:
        (persistentPlayer.career_three_pm || 0) + (gamePlayer.three_pm || 0),
      career_three_pa:
        (persistentPlayer.career_three_pa || 0) + (gamePlayer.three_pa || 0),
      career_ftm:
        (persistentPlayer.career_ftm || 0) + (gamePlayer.ftm || 0),
      career_fta:
        (persistentPlayer.career_fta || 0) + (gamePlayer.fta || 0),
      career_minutes:
        (persistentPlayer.career_minutes || 0) +
        (gamePlayer.minutes_played || 0),
      career_fouls:
        (persistentPlayer.career_fouls || 0) +
        (gamePlayer.personal_fouls || 0),
    };

    // TODO: Replace with actual API calls
    await fetch(
      `/api/persistent-players/${gamePlayer.persistent_player_id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStats),
      }
    );

    await fetch(`/api/players/${gamePlayer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats_aggregated: true }),
    });

    return updatedStats;
  } catch (error) {
    console.error('Error aggregating career stats:', error);
    return null;
  }
}

/**
 * Aggregates all players' stats for a finished game.
 */
export async function aggregateGameCareerStats(
  gameId: string
): Promise<CareerStats[]> {
  try {
    // TODO: Replace with actual API call
    const res = await fetch(`/api/players?game_id=${gameId}`);
    const gamePlayers: GamePlayer[] = await res.json();

    const results = await Promise.all(
      gamePlayers
        .filter((p) => p.persistent_player_id && !p.stats_aggregated)
        .map((player) => aggregatePlayerCareerStats(player))
    );

    return results.filter((r): r is CareerStats => r !== null);
  } catch (error) {
    console.error('Error aggregating game career stats:', error);
    return [];
  }
}

/**
 * Updates team win/loss records after a finished game.
 */
export async function updateTeamRecords(game: Game): Promise<void> {
  if (game.status !== 'finished') return;

  try {
    const homeWon = game.home_score > game.away_score;
    const awayWon = game.away_score > game.home_score;
    const isTie = game.home_score === game.away_score;

    if (game.home_team_id) {
      const res = await fetch(`/api/teams?id=${game.home_team_id}`);
      const homeTeams = await res.json();
      if (homeTeams.length > 0) {
        const homeTeam = homeTeams[0];
        await fetch(`/api/teams/${game.home_team_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wins: (homeTeam.wins || 0) + (homeWon ? 1 : 0),
            losses: (homeTeam.losses || 0) + (awayWon ? 1 : 0),
            ties: (homeTeam.ties || 0) + (isTie ? 1 : 0),
          }),
        });
      }
    }

    if (game.away_team_id) {
      const res = await fetch(`/api/teams?id=${game.away_team_id}`);
      const awayTeams = await res.json();
      if (awayTeams.length > 0) {
        const awayTeam = awayTeams[0];
        await fetch(`/api/teams/${game.away_team_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wins: (awayTeam.wins || 0) + (awayWon ? 1 : 0),
            losses: (awayTeam.losses || 0) + (homeWon ? 1 : 0),
            ties: (awayTeam.ties || 0) + (isTie ? 1 : 0),
          }),
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
export async function finalizeGame(game: Game): Promise<void> {
  if (game.status !== 'finished') {
    console.warn('Game must be finished before finalizing');
    return;
  }

  await aggregateGameCareerStats(game.id);
  await updateTeamRecords(game);
}
