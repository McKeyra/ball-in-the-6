import type { CrossSportComparison, AthleteIntelligence, StakeholderWeight } from '@/types/intelligence';

export const ALL_COMPARISONS: CrossSportComparison[] = [
  {
    trait: { id: 'scoring-eff', name: 'Scoring Efficiency', description: 'Points production relative to attempts', category: 'offense' },
    athletes: [
      { athleteId: 'a1', name: 'Marcus Thompson', sport: 'Basketball', sportIcon: 'basketball', normalizedScore: 92, rawMetric: 'TS%', rawValue: 64.2, sampleSize: 42 },
      { athleteId: 'a2', name: 'Jaylen Carter', sport: 'Basketball', sportIcon: 'basketball', normalizedScore: 87, rawMetric: 'TS%', rawValue: 61.8, sampleSize: 38 },
      { athleteId: 'a3', name: 'Devon Ellis', sport: 'Basketball', sportIcon: 'basketball', normalizedScore: 78, rawMetric: 'TS%', rawValue: 58.4, sampleSize: 30 },
    ],
  },
  {
    trait: { id: 'playmaking', name: 'Playmaking Vision', description: 'Ability to create opportunities for teammates', category: 'playmaking' },
    athletes: [
      { athleteId: 'a1', name: 'Marcus Thompson', sport: 'Basketball', sportIcon: 'basketball', normalizedScore: 95, rawMetric: 'AST/TO', rawValue: 3.8, sampleSize: 42 },
      { athleteId: 'a4', name: 'Caleb Smith', sport: 'Basketball', sportIcon: 'basketball', normalizedScore: 82, rawMetric: 'AST/TO', rawValue: 2.9, sampleSize: 40 },
    ],
  },
  {
    trait: { id: 'defensive-impact', name: 'Defensive Impact', description: 'Disruption and prevention of opponent scoring', category: 'defense' },
    athletes: [
      { athleteId: 'a5', name: 'Keon James', sport: 'Basketball', sportIcon: 'basketball', normalizedScore: 91, rawMetric: 'STL+BLK/G', rawValue: 4.2, sampleSize: 35 },
      { athleteId: 'a1', name: 'Marcus Thompson', sport: 'Basketball', sportIcon: 'basketball', normalizedScore: 84, rawMetric: 'STL+BLK/G', rawValue: 3.6, sampleSize: 42 },
    ],
  },
];

export const ATHLETES: AthleteIntelligence[] = [
  {
    athleteId: 'a1',
    name: 'Marcus Thompson',
    sport: 'Basketball',
    sportIcon: 'basketball',
    team: 'Northside Kings',
    position: 'PG',
    impactScore: 94,
    traits: [
      { traitId: 'scoring-eff', traitName: 'Scoring Efficiency', score: 92, trend: 'up', percentile: 96 },
      { traitId: 'playmaking', traitName: 'Playmaking Vision', score: 95, trend: 'up', percentile: 98 },
      { traitId: 'defensive-impact', traitName: 'Defensive Impact', score: 84, trend: 'stable', percentile: 88 },
    ],
    sixDimensions: { intuition: 91, intelligence: 94, impact: 96, innovation: 88, integration: 92, iteration: 90 },
  },
  {
    athleteId: 'a4',
    name: 'Caleb Smith',
    sport: 'Basketball',
    sportIcon: 'basketball',
    team: 'B.M.T. Titans',
    position: 'SF',
    impactScore: 89,
    traits: [
      { traitId: 'scoring-eff', traitName: 'Scoring Efficiency', score: 88, trend: 'up', percentile: 91 },
      { traitId: 'playmaking', traitName: 'Playmaking Vision', score: 82, trend: 'stable', percentile: 85 },
      { traitId: 'defensive-impact', traitName: 'Defensive Impact', score: 76, trend: 'up', percentile: 78 },
    ],
    sixDimensions: { intuition: 85, intelligence: 82, impact: 93, innovation: 90, integration: 84, iteration: 87 },
  },
  {
    athleteId: 'a5',
    name: 'Keon James',
    sport: 'Basketball',
    sportIcon: 'basketball',
    team: 'Oakwood Barons',
    position: 'SG',
    impactScore: 82,
    traits: [
      { traitId: 'defensive-impact', traitName: 'Defensive Impact', score: 91, trend: 'up', percentile: 95 },
      { traitId: 'scoring-eff', traitName: 'Scoring Efficiency', score: 74, trend: 'stable', percentile: 72 },
    ],
    sixDimensions: { intuition: 88, intelligence: 79, impact: 85, innovation: 72, integration: 80, iteration: 91 },
  },
];

export const STAKEHOLDER_WEIGHTS: StakeholderWeight[] = [
  { category: 'Scoring Volume', betting: 0.9, fantasy: 0.95, scouting: 0.7, coaching: 0.6, fan: 0.9, parental: 0.5, media: 0.85 },
  { category: 'Efficiency', betting: 0.85, fantasy: 0.7, scouting: 0.9, coaching: 0.85, fan: 0.4, parental: 0.3, media: 0.6 },
  { category: 'Playmaking', betting: 0.6, fantasy: 0.8, scouting: 0.85, coaching: 0.9, fan: 0.7, parental: 0.6, media: 0.75 },
  { category: 'Defense', betting: 0.5, fantasy: 0.65, scouting: 0.9, coaching: 0.95, fan: 0.5, parental: 0.7, media: 0.5 },
  { category: 'Clutch Factor', betting: 0.95, fantasy: 0.6, scouting: 0.8, coaching: 0.75, fan: 0.95, parental: 0.4, media: 0.9 },
  { category: 'Athleticism', betting: 0.4, fantasy: 0.5, scouting: 0.75, coaching: 0.65, fan: 0.85, parental: 0.5, media: 0.8 },
  { category: 'Leadership', betting: 0.3, fantasy: 0.2, scouting: 0.85, coaching: 0.9, fan: 0.6, parental: 0.9, media: 0.7 },
];
