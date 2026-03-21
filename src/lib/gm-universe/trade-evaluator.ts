interface PlayerContract {
  salary: number;
  years: number;
  type: string;
}

interface TradePlayer {
  id: string;
  name: string;
  position: string;
  overall: number;
  age: number;
  potential?: number;
  contract: PlayerContract;
}

export interface TradeEvaluation {
  rating: 'great' | 'fair' | 'unfair';
  explanation: string;
  salaryDiff: number;
  givenValue: number;
  receivedValue: number;
}

const AGE_FACTOR: Record<string, number> = {
  young: 1.25,
  prime: 1.15,
  veteran: 0.9,
  aging: 0.65,
};

const CONTRACT_VALUE: Record<string, number> = {
  rookie: 1.3,
  team_friendly: 1.2,
  market: 1.0,
  overpaid: 0.75,
  max: 0.85,
};

function getAgeFactor(age: number): number {
  if (age < 24) return AGE_FACTOR.young;
  if (age < 30) return AGE_FACTOR.prime;
  if (age < 34) return AGE_FACTOR.veteran;
  return AGE_FACTOR.aging;
}

function getContractFactor(contract: PlayerContract | undefined): number {
  if (!contract?.type) return CONTRACT_VALUE.market;
  return CONTRACT_VALUE[contract.type] ?? CONTRACT_VALUE.market;
}

function calculatePlayerValue(player: TradePlayer): number {
  const overallBase = player.overall || 75;
  const ageFactor = getAgeFactor(player.age || 27);
  const contractFactor = getContractFactor(player.contract);
  const potentialBonus = ((player.potential ?? player.overall ?? 75) - overallBase) * 0.3;

  return (overallBase + potentialBonus) * ageFactor * contractFactor;
}

function getTotalSalary(players: TradePlayer[]): number {
  return players.reduce((sum, p) => sum + (p.contract?.salary ?? 0), 0);
}

function generateExplanation(
  givenValue: number,
  receivedValue: number,
  playersGiven: TradePlayer[],
  playersReceived: TradePlayer[],
  salaryDiff: number,
): string {
  const reasons: string[] = [];
  const diff = receivedValue - givenValue;
  const pctDiff = givenValue > 0 ? (diff / givenValue) * 100 : 0;

  if (pctDiff > 15) {
    reasons.push('You are receiving significantly more value in this deal.');
  } else if (pctDiff > 5) {
    reasons.push('Slight edge in your favor based on player ratings and age profiles.');
  } else if (pctDiff < -15) {
    reasons.push('You are giving up significantly more value than you are receiving.');
  } else if (pctDiff < -5) {
    reasons.push('The other side gets a slight edge in raw value.');
  } else {
    reasons.push('Both sides exchange roughly equal value.');
  }

  const youngReceived = playersReceived.filter((p) => (p.age || 27) < 25);
  const youngGiven = playersGiven.filter((p) => (p.age || 27) < 25);
  if (youngReceived.length > youngGiven.length) {
    reasons.push('You gain youth in this trade, which adds long-term upside.');
  } else if (youngGiven.length > youngReceived.length) {
    reasons.push('You are trading away younger assets, reducing future flexibility.');
  }

  if (Math.abs(salaryDiff) > 5000000) {
    reasons.push(
      salaryDiff > 0
        ? `Salary increases by $${(salaryDiff / 1000000).toFixed(1)}M. Watch the luxury tax.`
        : `You save $${(Math.abs(salaryDiff) / 1000000).toFixed(1)}M in salary, creating cap flexibility.`,
    );
  }

  const bestReceived = playersReceived.reduce(
    (best, p) => ((p.overall ?? 0) > (best.overall ?? 0) ? p : best),
    { overall: 0 } as TradePlayer,
  );
  const bestGiven = playersGiven.reduce(
    (best, p) => ((p.overall ?? 0) > (best.overall ?? 0) ? p : best),
    { overall: 0 } as TradePlayer,
  );

  if (bestReceived.overall > bestGiven.overall + 5) {
    reasons.push(`${bestReceived.name} is a clear upgrade and the best player in this deal.`);
  } else if (bestGiven.overall > bestReceived.overall + 5) {
    reasons.push(`Giving up ${bestGiven.name} hurts. They are the best player in this deal.`);
  }

  return reasons.join(' ');
}

export function evaluateTrade(playersGiven: TradePlayer[], playersReceived: TradePlayer[]): TradeEvaluation {
  if (!playersGiven.length && !playersReceived.length) {
    return {
      rating: 'fair',
      explanation: 'No players selected for trade.',
      salaryDiff: 0,
      givenValue: 0,
      receivedValue: 0,
    };
  }

  const givenValue = playersGiven.reduce((sum, p) => sum + calculatePlayerValue(p), 0);
  const receivedValue = playersReceived.reduce((sum, p) => sum + calculatePlayerValue(p), 0);
  const salaryOut = getTotalSalary(playersGiven);
  const salaryIn = getTotalSalary(playersReceived);
  const salaryDiff = salaryIn - salaryOut;

  const diff = receivedValue - givenValue;
  const pctDiff = givenValue > 0 ? (diff / givenValue) * 100 : 0;

  let rating: 'great' | 'fair' | 'unfair';
  if (pctDiff > 10) {
    rating = 'great';
  } else if (pctDiff < -10) {
    rating = 'unfair';
  } else {
    rating = 'fair';
  }

  const explanation = generateExplanation(givenValue, receivedValue, playersGiven, playersReceived, salaryDiff);

  return {
    rating,
    explanation,
    salaryDiff,
    givenValue: Math.round(givenValue),
    receivedValue: Math.round(receivedValue),
  };
}
