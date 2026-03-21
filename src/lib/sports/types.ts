/**
 * Sport configuration type definitions.
 * These types describe the full sport config data structures
 * used across the platform (positions, GOATs, drills, etc.).
 */

export interface RadarDimension {
  key: string;
  label: string;
  goatScore: number;
}

export interface Position {
  code: string;
  name: string;
  archetype: string;
  color: string;
  goat: string;
  goatCountry: string;
  radarDimensions: RadarDimension[];
}

export type GameLogFieldType = 'number' | 'percent' | 'decimal' | 'time' | 'text' | 'boolean';

export interface GameLogField {
  key: string;
  label: string;
  type: GameLogFieldType;
}

export interface Stage {
  id: string;
  label: string;
  ageRange: string;
  color: string;
  philosophy: string;
  keyFocus: string[];
  restrictions: string[];
}

export interface PersonaArchetype {
  name: string;
  description: string;
  traits: string[];
}

export interface QuizOption {
  text: string;
  archetypes: Record<string, string>;
}

export interface PersonaQuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface Drill {
  name: string;
  position: string;
  difficulty: number;
  description: string;
  equipment: string[];
}

export interface Benchmark {
  name: string;
  unit: string;
  youth: number;
  school: number;
  university: number;
  professional: number;
}

export type CourtType = 'court' | 'rink' | 'pitch' | 'field' | 'diamond' | 'track';

export interface SportConfig {
  id: string;
  name: string;
  emoji: string;
  color: string;
  courtType: CourtType;
  positions: Position[];
  gameLogFields: GameLogField[];
  stages: Stage[];
  personaArchetypes: Record<string, PersonaArchetype[]>;
  personaQuiz: PersonaQuizQuestion[];
  drills: Drill[];
  benchmarks: Benchmark[];
}

export type SportId =
  | 'basketball'
  | 'hockey'
  | 'volleyball'
  | 'baseball'
  | 'soccer'
  | 'cricket'
  | 'track-field'
  | 'football';
