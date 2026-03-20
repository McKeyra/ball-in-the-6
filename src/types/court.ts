/* Court Engine Types */

export interface CourtZone {
  id: string;
  name: string;
  path: string;
  center: { x: number; y: number };
}

export interface ShotData {
  zoneId: string;
  makes: number;
  attempts: number;
  percentage: number;
}

export interface PlayerShotChart {
  playerId: string;
  playerName: string;
  avatar: string;
  shots: ShotData[];
  totalMakes: number;
  totalAttempts: number;
}

export interface CourtConfig {
  width: number;
  height: number;
  zones: CourtZone[];
}

export interface ZoneStats {
  zone: CourtZone;
  shot: ShotData;
  leagueAverage: number;
  trend: 'up' | 'down' | 'neutral';
}

export const LEAGUE_AVERAGES: Record<string, number> = {
  'restricted-area': 63.0,
  'left-block': 42.0,
  'right-block': 42.0,
  'left-mid-range': 40.5,
  'right-mid-range': 40.5,
  'left-elbow': 41.0,
  'right-elbow': 41.0,
  'top-of-key': 39.5,
  'free-throw': 42.5,
  'left-wing-3': 36.5,
  'right-wing-3': 36.5,
  'left-corner-3': 38.0,
  'right-corner-3': 38.0,
  'center-3': 35.5,
} as const;
