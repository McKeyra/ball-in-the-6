export interface UniversalTrait {
  id: string;
  name: string;
  description: string;
  category: 'offense' | 'defense' | 'athleticism' | 'playmaking' | 'mentality';
}

export interface SportMetricMapping {
  sport: string;
  metric: string;
  rawValue: number;
  zScore: number;
  percentile: number;
}

export interface CrossSportComparison {
  trait: UniversalTrait;
  athletes: {
    athleteId: string;
    name: string;
    sport: string;
    sportIcon: string;
    normalizedScore: number;
    rawMetric: string;
    rawValue: number;
    sampleSize: number;
  }[];
}

export interface AthleteIntelligence {
  athleteId: string;
  name: string;
  sport: string;
  sportIcon: string;
  team: string;
  position: string;
  impactScore: number;
  traits: {
    traitId: string;
    traitName: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
    percentile: number;
  }[];
  sixDimensions: {
    intuition: number;
    intelligence: number;
    impact: number;
    innovation: number;
    integration: number;
    iteration: number;
  };
}

export interface StakeholderWeight {
  category: string;
  betting: number;
  fantasy: number;
  scouting: number;
  coaching: number;
  fan: number;
  parental: number;
  media: number;
}
