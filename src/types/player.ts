/* Player Detail Types */

export interface SeasonStats {
  gamesPlayed: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
  mpg: number;
  topg: number;
}

export interface GameLog {
  date: string;
  opponent: string;
  pts: number;
  reb: number;
  ast: number;
  min: number;
  result: 'W' | 'L';
}

export type HighlightType =
  | 'dunk'
  | 'three'
  | 'assist'
  | 'block'
  | 'crossover'
  | 'game-winner';

export interface PlayerHighlight {
  id: string;
  title: string;
  description: string;
  date: string;
  type: HighlightType;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

export interface PlayerDetail {
  id: string;
  name: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  number: number;
  height: string;
  weight: number;
  age: number;
  team: string;
  school: string;
  stats: SeasonStats;
  bio: string;
  accolades: string[];
  socialLinks: SocialLinks;
}
