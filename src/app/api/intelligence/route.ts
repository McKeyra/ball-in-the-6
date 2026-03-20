import type { CrossSportComparison, AthleteIntelligence, StakeholderWeight } from '@/types/intelligence';

const VALID_TYPES = ['comparisons', 'athletes', 'stakeholders'] as const;
type IntelType = (typeof VALID_TYPES)[number];

const MOCK_COMPARISONS: CrossSportComparison[] = [
  {
    trait: {
      id: 'trait-001',
      name: 'Court Vision',
      description: 'Ability to read the floor and anticipate plays',
      category: 'playmaking',
    },
    athletes: [
      { athleteId: 'a-001', name: 'McKeyra', sport: 'Basketball', sportIcon: '', normalizedScore: 94, rawMetric: 'Assists/Game', rawValue: 8.4, sampleSize: 32 },
      { athleteId: 'a-002', name: 'Caleb Smith', sport: 'Basketball', sportIcon: '', normalizedScore: 88, rawMetric: 'Assists/Game', rawValue: 6.2, sampleSize: 28 },
      { athleteId: 'a-003', name: 'Devon Ellis', sport: 'Basketball', sportIcon: '', normalizedScore: 82, rawMetric: 'Assists/Game', rawValue: 5.1, sampleSize: 24 },
    ],
  },
  {
    trait: {
      id: 'trait-002',
      name: 'Explosive Power',
      description: 'Burst acceleration and vertical leap',
      category: 'athleticism',
    },
    athletes: [
      { athleteId: 'a-004', name: 'DunkCity', sport: 'Basketball', sportIcon: '', normalizedScore: 96, rawMetric: 'Vertical Leap (in)', rawValue: 42, sampleSize: 15 },
      { athleteId: 'a-001', name: 'McKeyra', sport: 'Basketball', sportIcon: '', normalizedScore: 91, rawMetric: 'Vertical Leap (in)', rawValue: 38, sampleSize: 15 },
      { athleteId: 'a-005', name: 'Marcus Thompson', sport: 'Basketball', sportIcon: '', normalizedScore: 87, rawMetric: 'Vertical Leap (in)', rawValue: 36, sampleSize: 15 },
    ],
  },
  {
    trait: {
      id: 'trait-003',
      name: 'Defensive IQ',
      description: 'Positioning, anticipation, and defensive reads',
      category: 'defense',
    },
    athletes: [
      { athleteId: 'a-005', name: 'Marcus Thompson', sport: 'Basketball', sportIcon: '', normalizedScore: 92, rawMetric: 'Steals/Game', rawValue: 3.2, sampleSize: 28 },
      { athleteId: 'a-002', name: 'Caleb Smith', sport: 'Basketball', sportIcon: '', normalizedScore: 85, rawMetric: 'Steals/Game', rawValue: 2.1, sampleSize: 28 },
      { athleteId: 'a-006', name: 'Keon James', sport: 'Basketball', sportIcon: '', normalizedScore: 78, rawMetric: 'Steals/Game', rawValue: 1.8, sampleSize: 20 },
    ],
  },
];

const MOCK_ATHLETES: AthleteIntelligence[] = [
  {
    athleteId: 'a-001',
    name: 'McKeyra',
    sport: 'Basketball',
    sportIcon: '',
    team: 'B6 Originals',
    position: 'PG',
    impactScore: 94,
    traits: [
      { traitId: 'trait-001', traitName: 'Court Vision', score: 94, trend: 'up', percentile: 97 },
      { traitId: 'trait-002', traitName: 'Explosive Power', score: 91, trend: 'stable', percentile: 94 },
      { traitId: 'trait-004', traitName: 'Shooting', score: 88, trend: 'up', percentile: 91 },
    ],
    sixDimensions: { intuition: 95, intelligence: 92, impact: 94, innovation: 88, integration: 90, iteration: 87 },
  },
  {
    athleteId: 'a-002',
    name: 'Caleb Smith',
    sport: 'Basketball',
    sportIcon: '',
    team: 'B.M.T. Titans',
    position: 'SG',
    impactScore: 89,
    traits: [
      { traitId: 'trait-001', traitName: 'Court Vision', score: 88, trend: 'up', percentile: 90 },
      { traitId: 'trait-004', traitName: 'Shooting', score: 92, trend: 'up', percentile: 95 },
      { traitId: 'trait-003', traitName: 'Defensive IQ', score: 85, trend: 'stable', percentile: 86 },
    ],
    sixDimensions: { intuition: 87, intelligence: 90, impact: 89, innovation: 84, integration: 86, iteration: 82 },
  },
  {
    athleteId: 'a-005',
    name: 'Marcus Thompson',
    sport: 'Basketball',
    sportIcon: '',
    team: 'Northside Kings',
    position: 'SF',
    impactScore: 86,
    traits: [
      { traitId: 'trait-003', traitName: 'Defensive IQ', score: 92, trend: 'up', percentile: 94 },
      { traitId: 'trait-002', traitName: 'Explosive Power', score: 87, trend: 'stable', percentile: 89 },
      { traitId: 'trait-005', traitName: 'Leadership', score: 90, trend: 'up', percentile: 92 },
    ],
    sixDimensions: { intuition: 84, intelligence: 88, impact: 86, innovation: 82, integration: 91, iteration: 85 },
  },
];

const MOCK_STAKEHOLDERS: StakeholderWeight[] = [
  { category: 'Scoring', betting: 0.35, fantasy: 0.30, scouting: 0.20, coaching: 0.25, fan: 0.40, parental: 0.15, media: 0.30 },
  { category: 'Defense', betting: 0.15, fantasy: 0.10, scouting: 0.25, coaching: 0.30, fan: 0.10, parental: 0.20, media: 0.10 },
  { category: 'Playmaking', betting: 0.20, fantasy: 0.25, scouting: 0.25, coaching: 0.20, fan: 0.15, parental: 0.10, media: 0.20 },
  { category: 'Athleticism', betting: 0.10, fantasy: 0.15, scouting: 0.20, coaching: 0.15, fan: 0.25, parental: 0.05, media: 0.25 },
  { category: 'Consistency', betting: 0.20, fantasy: 0.20, scouting: 0.10, coaching: 0.10, fan: 0.10, parental: 0.50, media: 0.15 },
];

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get('type');

  const type: IntelType = VALID_TYPES.includes(typeParam as IntelType)
    ? (typeParam as IntelType)
    : 'comparisons';

  let data: CrossSportComparison[] | AthleteIntelligence[] | StakeholderWeight[];

  switch (type) {
    case 'athletes':
      data = MOCK_ATHLETES;
      break;
    case 'stakeholders':
      data = MOCK_STAKEHOLDERS;
      break;
    case 'comparisons':
    default:
      data = MOCK_COMPARISONS;
      break;
  }

  return Response.json({
    data,
    meta: {
      type,
      total: data.length,
    },
  });
}
