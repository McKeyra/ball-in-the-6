interface Player {
  id: string;
  name: string;
  position: string;
  overall: number;
}

interface BoxScoreEntry {
  id: string;
  name: string;
  position: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fgMade: number;
  fgAttempted: number;
  threeMade: number;
  threeAttempted: number;
  ftMade: number;
  ftAttempted: number;
}

interface PlayByPlayEntry {
  quarter: number;
  possession: number;
  time: string;
  homeScore: number;
  awayScore: number;
  description: string;
  type: string;
  made?: boolean;
  isHomeOffense: boolean;
  momentum: number;
}

interface PossessionResult {
  points: number;
  type: string;
  made?: boolean;
  description: string;
  offensePlayer: Player;
  defensePlayer?: Player;
  momentumShift: number;
  stats: Record<string, Partial<BoxScoreEntry>>;
}

export interface GameResult {
  homeScore: number;
  awayScore: number;
  homeWon: boolean;
  quarterScores: { home: number[]; away: number[] };
  playByPlay: PlayByPlayEntry[];
  homeBoxScore: BoxScoreEntry[];
  awayBoxScore: BoxScoreEntry[];
  momentum: number;
  overtime: boolean;
}

const SHOT_DESCRIPTIONS: Record<string, string[]> = {
  three_pointer: [
    '{player} pulls up from three... {result}!',
    '{player} catches and shoots from downtown... {result}!',
    '{player} steps back behind the arc... {result}!',
    '{player} drains it from deep... {result}!',
  ],
  mid_range: [
    '{player} with the mid-range jumper... {result}!',
    '{player} pulls up from the elbow... {result}!',
    '{player} fades away from 15 feet... {result}!',
  ],
  layup: [
    '{player} drives to the basket for a layup... {result}!',
    '{player} with the finger roll... {result}!',
    '{player} scoops it up... {result}!',
  ],
  dunk: [
    '{player} throws it down with authority!',
    '{player} with the thunderous dunk!',
    '{player} rises up for the slam!',
  ],
  turnover: [
    '{player} loses the handle, turnover.',
    'Bad pass by {player}, stolen!',
    '{player} steps out of bounds, turnover.',
    'Offensive foul called on {player}.',
  ],
  steal: [
    '{player} with the quick hands, steal!',
    '{player} picks off the pass!',
    '{player} strips the ball away!',
  ],
  block: [
    '{player} rejects it at the rim!',
    '{player} with the emphatic block!',
    '{player} sends it back!',
  ],
};

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPlayerRating(player: Player): number {
  return player.overall || 75;
}

function pickShooter(team: Player[]): Player {
  const ratings = team.map((p) => getPlayerRating(p));
  const total = ratings.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < team.length; i++) {
    r -= ratings[i];
    if (r <= 0) return team[i];
  }
  return team[0];
}

function initBoxScore(team: Player[]): BoxScoreEntry[] {
  return team.map((p) => ({
    id: p.id,
    name: p.name,
    position: p.position,
    minutes: 0,
    points: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    fgMade: 0,
    fgAttempted: 0,
    threeMade: 0,
    threeAttempted: 0,
    ftMade: 0,
    ftAttempted: 0,
  }));
}

function findInBox(boxScore: BoxScoreEntry[], playerId: string): BoxScoreEntry | undefined {
  return boxScore.find((b) => b.id === playerId);
}

export function simulatePossession(homeTeam: Player[], awayTeam: Player[], momentum: number, isHomeOffense: boolean): PossessionResult {
  const offense = isHomeOffense ? homeTeam : awayTeam;
  const defense = isHomeOffense ? awayTeam : homeTeam;
  const offenseRating = offense.reduce((s, p) => s + getPlayerRating(p), 0) / offense.length;
  const defenseRating = defense.reduce((s, p) => s + getPlayerRating(p), 0) / defense.length;

  const momentumBonus = isHomeOffense ? (momentum - 50) * 0.003 : (50 - momentum) * 0.003;
  const ratingDiff = (offenseRating - defenseRating) * 0.005;
  const baseChance = 0.45 + ratingDiff + momentumBonus;

  const turnoverChance = 0.14 - ratingDiff * 0.5;
  const blockChance = 0.04;

  const roll = Math.random();

  if (roll < turnoverChance) {
    const offPlayer = pickShooter(offense);
    const defPlayer = randomChoice(defense);
    const stealChance = 0.08;
    const isSteal = Math.random() < stealChance / turnoverChance;

    if (isSteal) {
      const desc = randomChoice(SHOT_DESCRIPTIONS.steal).replace('{player}', defPlayer.name);
      return {
        points: 0,
        type: 'steal',
        description: desc,
        offensePlayer: offPlayer,
        defensePlayer: defPlayer,
        momentumShift: isHomeOffense ? -3 : 3,
        stats: { [offPlayer.id]: { turnovers: 1 }, [defPlayer.id]: { steals: 1 } },
      };
    }

    const desc = randomChoice(SHOT_DESCRIPTIONS.turnover).replace('{player}', offPlayer.name);
    return {
      points: 0,
      type: 'turnover',
      description: desc,
      offensePlayer: offPlayer,
      momentumShift: isHomeOffense ? -2 : 2,
      stats: { [offPlayer.id]: { turnovers: 1 } },
    };
  }

  if (roll < turnoverChance + blockChance) {
    const offPlayer = pickShooter(offense);
    const blocker = randomChoice(defense);
    const desc = randomChoice(SHOT_DESCRIPTIONS.block).replace('{player}', blocker.name);
    return {
      points: 0,
      type: 'block',
      description: desc,
      offensePlayer: offPlayer,
      defensePlayer: blocker,
      momentumShift: isHomeOffense ? -4 : 4,
      stats: {
        [blocker.id]: { blocks: 1 },
        [offPlayer.id]: { fgAttempted: 1 },
      },
    };
  }

  const shooter = pickShooter(offense);
  const shotTypeRoll = Math.random();
  let shotType: string;
  let shotPoints: number;

  if (shotTypeRoll < 0.35) {
    shotType = 'three_pointer';
    shotPoints = 3;
  } else if (shotTypeRoll < 0.55) {
    shotType = 'mid_range';
    shotPoints = 2;
  } else if (shotTypeRoll < 0.88) {
    shotType = 'layup';
    shotPoints = 2;
  } else {
    shotType = 'dunk';
    shotPoints = 2;
  }

  const shotChance = shotType === 'three_pointer'
    ? baseChance * 0.78
    : shotType === 'dunk'
      ? baseChance * 1.4
      : baseChance;

  const made = Math.random() < shotChance;
  const result = made ? 'GOOD' : 'no good';

  let desc: string;
  if (shotType === 'dunk' && made) {
    desc = randomChoice(SHOT_DESCRIPTIONS.dunk).replace('{player}', shooter.name);
  } else {
    desc = randomChoice(SHOT_DESCRIPTIONS[shotType])
      .replace('{player}', shooter.name)
      .replace('{result}', result);
  }

  const stats: Record<string, Partial<BoxScoreEntry>> = { [shooter.id]: { fgAttempted: 1 } };
  if (made) {
    stats[shooter.id].fgMade = 1;
    stats[shooter.id].points = shotPoints;
    if (shotType === 'three_pointer') {
      stats[shooter.id].threeAttempted = 1;
      stats[shooter.id].threeMade = 1;
    }

    if (Math.random() < 0.3) {
      const assister = offense.find((p) => p.id !== shooter.id) ?? shooter;
      if (assister.id !== shooter.id) {
        stats[assister.id] = { assists: 1 };
        desc += ` (Assist: ${assister.name})`;
      }
    }
  } else {
    if (shotType === 'three_pointer') {
      stats[shooter.id].threeAttempted = 1;
    }

    const rebounder = Math.random() < 0.7
      ? randomChoice(defense)
      : randomChoice(offense);
    stats[rebounder.id] = stats[rebounder.id] ?? {};
    stats[rebounder.id].rebounds = 1;
  }

  return {
    points: made ? shotPoints : 0,
    type: shotType,
    made,
    description: desc,
    offensePlayer: shooter,
    momentumShift: made ? (isHomeOffense ? 2 : -2) : (isHomeOffense ? -1 : 1),
    stats,
  };
}

export function simulateGame(home: Player[], away: Player[]): GameResult {
  const POSSESSIONS_PER_QUARTER = 25;
  const QUARTERS = 4;

  let homeScore = 0;
  let awayScore = 0;
  let momentum = 55;
  const quarterScores = { home: [] as number[], away: [] as number[] };
  const playByPlay: PlayByPlayEntry[] = [];
  const homeBox = initBoxScore(home);
  const awayBox = initBoxScore(away);

  for (let q = 1; q <= QUARTERS; q++) {
    let qHome = 0;
    let qAway = 0;

    for (let p = 0; p < POSSESSIONS_PER_QUARTER; p++) {
      const isHomeOffense = p % 2 === 0;
      const result = simulatePossession(home, away, momentum, isHomeOffense);

      if (isHomeOffense) {
        homeScore += result.points;
        qHome += result.points;
      } else {
        awayScore += result.points;
        qAway += result.points;
      }

      momentum = Math.max(10, Math.min(90, momentum + (result.momentumShift || 0)));

      if (result.stats) {
        for (const [playerId, statUpdates] of Object.entries(result.stats)) {
          const homeEntry = findInBox(homeBox, playerId);
          const awayEntry = findInBox(awayBox, playerId);
          const entry = homeEntry ?? awayEntry;
          if (entry) {
            for (const [key, val] of Object.entries(statUpdates)) {
              (entry as unknown as Record<string, number>)[key] = ((entry as unknown as Record<string, number>)[key] || 0) + (val as number);
            }
          }
        }
      }

      playByPlay.push({
        quarter: q,
        possession: p + 1,
        time: `${Math.max(0, 12 - Math.floor((p / POSSESSIONS_PER_QUARTER) * 12))}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        homeScore,
        awayScore,
        description: result.description,
        type: result.type,
        made: result.made,
        isHomeOffense,
        momentum,
      });
    }

    quarterScores.home.push(qHome);
    quarterScores.away.push(qAway);

    homeBox.forEach((p) => (p.minutes += 12));
    awayBox.forEach((p) => (p.minutes += 12));
  }

  if (homeScore === awayScore) {
    let otHome = 0;
    let otAway = 0;
    for (let p = 0; p < 12; p++) {
      const isHomeOffense = p % 2 === 0;
      const result = simulatePossession(home, away, momentum, isHomeOffense);

      if (isHomeOffense) {
        homeScore += result.points;
        otHome += result.points;
      } else {
        awayScore += result.points;
        otAway += result.points;
      }

      momentum = Math.max(10, Math.min(90, momentum + (result.momentumShift || 0)));

      if (result.stats) {
        for (const [playerId, statUpdates] of Object.entries(result.stats)) {
          const entry = findInBox(homeBox, playerId) ?? findInBox(awayBox, playerId);
          if (entry) {
            for (const [key, val] of Object.entries(statUpdates)) {
              (entry as unknown as Record<string, number>)[key] = ((entry as unknown as Record<string, number>)[key] || 0) + (val as number);
            }
          }
        }
      }

      playByPlay.push({
        quarter: 5,
        possession: p + 1,
        time: `${Math.max(0, 5 - Math.floor((p / 12) * 5))}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        homeScore,
        awayScore,
        description: result.description,
        type: result.type,
        made: result.made,
        isHomeOffense,
        momentum,
      });
    }

    quarterScores.home.push(otHome);
    quarterScores.away.push(otAway);
    homeBox.forEach((p) => (p.minutes += 5));
    awayBox.forEach((p) => (p.minutes += 5));
  }

  return {
    homeScore,
    awayScore,
    homeWon: homeScore > awayScore,
    quarterScores,
    playByPlay,
    homeBoxScore: homeBox,
    awayBoxScore: awayBox,
    momentum,
    overtime: quarterScores.home.length > 4,
  };
}

export function generatePlayByPlay(gameResult: GameResult): PlayByPlayEntry[] {
  return gameResult.playByPlay;
}
