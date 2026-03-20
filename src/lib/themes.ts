export type ThemeId = 'light' | 'dark' | 'neon-lime' | 'raptors' | 'midnight' | 'sunset';

export interface ThemeTokens {
  id: ThemeId;
  name: string;
  description: string;
  colors: {
    void: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    lime: string;
    navBg: string;
  };
}

export const THEMES: Record<ThemeId, ThemeTokens> = {
  light: {
    id: 'light',
    name: 'Light',
    description: 'Clean white — the default Ball in the 6 look',
    colors: {
      void: '#ffffff',
      surface: '#f5f5f5',
      textPrimary: '#171717',
      textSecondary: '#737373',
      border: 'rgba(0, 0, 0, 0.06)',
      lime: '#c8ff00',
      navBg: '#ffffff',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'True dark with lime accents',
    colors: {
      void: '#030303',
      surface: '#0A0A0A',
      textPrimary: '#f5f5f5',
      textSecondary: '#a3a3a3',
      border: 'rgba(255, 255, 255, 0.08)',
      lime: '#c8ff00',
      navBg: '#030303',
    },
  },
  'neon-lime': {
    id: 'neon-lime',
    name: 'Neon Lime',
    description: 'Full neon energy — lime everywhere',
    colors: {
      void: '#0A0A0A',
      surface: '#0d1a00',
      textPrimary: '#c8ff00',
      textSecondary: '#8ab800',
      border: 'rgba(200, 255, 0, 0.12)',
      lime: '#c8ff00',
      navBg: '#060d00',
    },
  },
  raptors: {
    id: 'raptors',
    name: 'Raptors',
    description: 'Toronto Raptors — red, black, and white',
    colors: {
      void: '#ffffff',
      surface: '#f5f0f0',
      textPrimary: '#000000',
      textSecondary: '#4a4a4a',
      border: 'rgba(206, 17, 65, 0.12)',
      lime: '#CE1141',
      navBg: '#000000',
    },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep navy with ice blue tones',
    colors: {
      void: '#0D1B2A',
      surface: '#1B2838',
      textPrimary: '#e0f0ff',
      textSecondary: '#7ea8c9',
      border: 'rgba(126, 168, 201, 0.15)',
      lime: '#5dadec',
      navBg: '#0a1520',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm amber and orange glow',
    colors: {
      void: '#1a0a00',
      surface: '#261400',
      textPrimary: '#ffe0b2',
      textSecondary: '#c08a50',
      border: 'rgba(255, 152, 0, 0.15)',
      lime: '#ff9800',
      navBg: '#120700',
    },
  },
} as const;

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

export const DEFAULT_THEME_ID: ThemeId = 'light';

export function getThemeById(id: ThemeId): ThemeTokens {
  return THEMES[id] ?? THEMES[DEFAULT_THEME_ID];
}
