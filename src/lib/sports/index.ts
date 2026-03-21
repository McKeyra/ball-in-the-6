export { basketball } from './basketball';
export { hockey } from './hockey';
export { volleyball } from './volleyball';
export { baseball } from './baseball';
export { soccer } from './soccer';
export { cricket } from './cricket';
export { trackField } from './track-field';
export { football } from './football';

export type {
  SportConfig,
  SportId,
  Position,
  RadarDimension,
  GameLogField,
  GameLogFieldType,
  Stage,
  PersonaArchetype,
  QuizOption,
  PersonaQuizQuestion,
  Drill,
  Benchmark,
  CourtType,
} from './types';

import type { SportConfig, SportId } from './types';
import { basketball } from './basketball';
import { hockey } from './hockey';
import { volleyball } from './volleyball';
import { baseball } from './baseball';
import { soccer } from './soccer';
import { cricket } from './cricket';
import { trackField } from './track-field';
import { football } from './football';

export const SPORT_CONFIGS: Record<string, SportConfig> = {
  basketball,
  hockey,
  volleyball,
  baseball,
  soccer,
  cricket,
  'track-field': trackField,
  football,
};

export function getSportConfig(sportId: SportId | string): SportConfig {
  return SPORT_CONFIGS[sportId] ?? SPORT_CONFIGS.basketball;
}

export function getAllSportIds(): string[] {
  return Object.keys(SPORT_CONFIGS);
}
