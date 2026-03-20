import { create } from 'zustand';
import { type ThemeId, type ThemeTokens, DEFAULT_THEME_ID, getThemeById } from '@/lib/themes';

const STORAGE_KEY = 'bit6-theme';

interface ThemeState {
  themeId: ThemeId;
  hydrated: boolean;
  setTheme: (id: ThemeId) => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeId: DEFAULT_THEME_ID,
  hydrated: false,

  setTheme: (id: ThemeId): void => {
    set({ themeId: id });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, id);
      } catch {
        // localStorage unavailable — silently ignore
      }
    }
  },

  hydrate: (): void => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && isValidThemeId(stored)) {
        set({ themeId: stored, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },
}));

function isValidThemeId(value: string): value is ThemeId {
  const valid: Set<string> = new Set([
    'light',
    'dark',
    'neon-lime',
    'raptors',
    'midnight',
    'sunset',
  ]);
  return valid.has(value);
}

export function getActiveTheme(): ThemeTokens {
  const { themeId } = useThemeStore.getState();
  return getThemeById(themeId);
}
