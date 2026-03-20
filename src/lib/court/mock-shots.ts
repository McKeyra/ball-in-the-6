import type { PlayerShotChart, ShotData } from '@/types/court';

const buildShots = (
  data: Array<[string, number, number]>
): ShotData[] =>
  data.map(([zoneId, makes, attempts]) => ({
    zoneId,
    makes,
    attempts,
    percentage: attempts > 0 ? Math.round((makes / attempts) * 1000) / 10 : 0,
  }));

const sum = (shots: ShotData[], key: 'makes' | 'attempts'): number =>
  shots.reduce((acc, s) => acc + s[key], 0);

const chart = (
  playerId: string,
  playerName: string,
  avatar: string,
  raw: Array<[string, number, number]>
): PlayerShotChart => {
  const shots = buildShots(raw);
  return {
    playerId,
    playerName,
    avatar,
    shots,
    totalMakes: sum(shots, 'makes'),
    totalAttempts: sum(shots, 'attempts'),
  };
};

/**
 * Mock shot charts for 4 players.
 * Format: [zoneId, makes, attempts]
 * Distributions reflect realistic basketball shooting patterns.
 */

export const MOCK_SHOT_CHARTS: PlayerShotChart[] = [
  chart('player-001', 'McKeyra', 'MK', [
    ['restricted-area', 48, 72],
    ['left-block', 12, 28],
    ['right-block', 14, 30],
    ['left-mid-range', 8, 22],
    ['right-mid-range', 11, 24],
    ['left-elbow', 9, 20],
    ['right-elbow', 7, 18],
    ['top-of-key', 6, 16],
    ['free-throw', 10, 22],
    ['left-corner-3', 8, 20],
    ['right-corner-3', 9, 22],
    ['left-wing-3', 14, 38],
    ['right-wing-3', 12, 34],
    ['center-3', 10, 30],
  ]),

  chart('player-002', 'Caleb Smith', 'CS', [
    ['restricted-area', 56, 82],
    ['left-block', 16, 34],
    ['right-block', 18, 38],
    ['left-mid-range', 6, 18],
    ['right-mid-range', 5, 16],
    ['left-elbow', 10, 24],
    ['right-elbow', 12, 26],
    ['top-of-key', 8, 20],
    ['free-throw', 14, 30],
    ['left-corner-3', 6, 18],
    ['right-corner-3', 7, 19],
    ['left-wing-3', 10, 32],
    ['right-wing-3', 11, 30],
    ['center-3', 8, 26],
  ]),

  chart('player-003', 'Marcus Thompson', 'MT', [
    ['restricted-area', 42, 68],
    ['left-block', 10, 26],
    ['right-block', 8, 22],
    ['left-mid-range', 14, 32],
    ['right-mid-range', 12, 28],
    ['left-elbow', 11, 26],
    ['right-elbow', 13, 28],
    ['top-of-key', 10, 24],
    ['free-throw', 12, 26],
    ['left-corner-3', 10, 24],
    ['right-corner-3', 12, 28],
    ['left-wing-3', 16, 42],
    ['right-wing-3', 18, 44],
    ['center-3', 14, 40],
  ]),

  chart('player-004', 'DunkCity', 'DC', [
    ['restricted-area', 62, 88],
    ['left-block', 20, 42],
    ['right-block', 22, 44],
    ['left-mid-range', 4, 14],
    ['right-mid-range', 3, 12],
    ['left-elbow', 5, 16],
    ['right-elbow', 4, 14],
    ['top-of-key', 3, 10],
    ['free-throw', 8, 20],
    ['left-corner-3', 4, 14],
    ['right-corner-3', 3, 12],
    ['left-wing-3', 6, 22],
    ['right-wing-3', 5, 20],
    ['center-3', 4, 18],
  ]),
];
