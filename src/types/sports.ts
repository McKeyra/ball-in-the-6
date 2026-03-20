/* Multi-Sport Type System */

export type SportId =
  | 'basketball'
  | 'soccer'
  | 'hockey'
  | 'football'
  | 'baseball'
  | 'tennis'
  | 'golf'
  | 'cricket'
  | 'rugby'
  | 'volleyball'
  | 'lacrosse'
  | 'swimming'
  | 'track'
  | 'boxing'
  | 'mma';

export type ScoringSystem = 'points' | 'goals' | 'runs' | 'sets';

export interface SportConfig {
  id: SportId;
  name: string;
  icon: string;
  color: string;
  colorDim: string;
  positions: string[];
  statCategories: StatCategory[];
  scoringSystem: ScoringSystem;
  periodLabel: string;
  periods: number;
  hasOvertime: boolean;
  hasTies: boolean;
  conferenceNames?: [string, string];
  divisionNames?: string[];
}

export interface StatCategory {
  key: string;
  label: string;
  abbr: string;
  unit?: string;
}

export interface SportStanding {
  teamId: string;
  teamName: string;
  teamAbbr: string;
  teamColor: string;
  conference?: string;
  division?: string;
  wins: number;
  losses: number;
  ties?: number;
  overtimeLosses?: number;
  points?: number;
  winPct?: number;
  gamesBack: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: string;
  lastTen: string;
}

export interface SportLeaderboard {
  playerId: string;
  playerName: string;
  team: string;
  teamAbbr: string;
  stat: string;
  value: number;
  rank: number;
  avatar: string;
}

export interface SportFixture {
  id: string;
  sportId: SportId;
  homeTeam: string;
  homeAbbr: string;
  homeColor: string;
  awayTeam: string;
  awayAbbr: string;
  awayColor: string;
  venue: string;
  date: string;
  time: string;
  broadcast?: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'final';
}

export interface SportLeaderCategory {
  category: StatCategory;
  leaders: SportLeaderboard[];
}

export interface SportData {
  standings: SportStanding[];
  leaderCategories: SportLeaderCategory[];
  fixtures: SportFixture[];
}

/* ---------- SPORT CONFIGS ---------- */

const BASKETBALL_STATS: StatCategory[] = [
  { key: 'ppg', label: 'Points Per Game', abbr: 'PPG' },
  { key: 'rpg', label: 'Rebounds Per Game', abbr: 'RPG' },
  { key: 'apg', label: 'Assists Per Game', abbr: 'APG' },
];

const SOCCER_STATS: StatCategory[] = [
  { key: 'goals', label: 'Goals', abbr: 'G' },
  { key: 'assists', label: 'Assists', abbr: 'A' },
  { key: 'cleanSheets', label: 'Clean Sheets', abbr: 'CS' },
];

const HOCKEY_STATS: StatCategory[] = [
  { key: 'points', label: 'Points', abbr: 'PTS' },
  { key: 'goals', label: 'Goals', abbr: 'G' },
  { key: 'saves', label: 'Save Percentage', abbr: 'SV%', unit: '%' },
];

const FOOTBALL_STATS: StatCategory[] = [
  { key: 'passYds', label: 'Passing Yards', abbr: 'YDS' },
  { key: 'rushYds', label: 'Rushing Yards', abbr: 'RuYDS' },
  { key: 'td', label: 'Touchdowns', abbr: 'TD' },
];

export const SPORT_CONFIGS: Record<string, SportConfig> = {
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    icon: 'CircleDot',
    color: '#F97316',
    colorDim: 'rgba(249, 115, 22, 0.12)',
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    statCategories: BASKETBALL_STATS,
    scoringSystem: 'points',
    periodLabel: 'Quarter',
    periods: 4,
    hasOvertime: true,
    hasTies: false,
    conferenceNames: ['Eastern', 'Western'],
    divisionNames: ['Atlantic', 'Central', 'Southeast', 'Northwest', 'Pacific', 'Southwest'],
  },
  soccer: {
    id: 'soccer',
    name: 'Soccer',
    icon: 'Goal',
    color: '#10B981',
    colorDim: 'rgba(16, 185, 129, 0.12)',
    positions: ['GK', 'CB', 'LB', 'RB', 'CM', 'CAM', 'LW', 'RW', 'ST'],
    statCategories: SOCCER_STATS,
    scoringSystem: 'goals',
    periodLabel: 'Half',
    periods: 2,
    hasOvertime: true,
    hasTies: true,
    conferenceNames: ['Eastern', 'Western'],
  },
  hockey: {
    id: 'hockey',
    name: 'Hockey',
    icon: 'Hexagon',
    color: '#3B82F6',
    colorDim: 'rgba(59, 130, 246, 0.12)',
    positions: ['C', 'LW', 'RW', 'LD', 'RD', 'G'],
    statCategories: HOCKEY_STATS,
    scoringSystem: 'goals',
    periodLabel: 'Period',
    periods: 3,
    hasOvertime: true,
    hasTies: false,
    conferenceNames: ['Eastern', 'Western'],
    divisionNames: ['Atlantic', 'Metropolitan', 'Central', 'Pacific'],
  },
  football: {
    id: 'football',
    name: 'Football',
    icon: 'Shield',
    color: '#92400E',
    colorDim: 'rgba(146, 64, 14, 0.12)',
    positions: ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P'],
    statCategories: FOOTBALL_STATS,
    scoringSystem: 'points',
    periodLabel: 'Quarter',
    periods: 4,
    hasOvertime: true,
    hasTies: true,
    conferenceNames: ['AFC', 'NFC'],
    divisionNames: ['North', 'South', 'East', 'West'],
  },
} as const;

export const CORE_SPORT_IDS: SportId[] = ['basketball', 'soccer', 'hockey', 'football'];

export const ALL_SPORT_COUNT = 40;
