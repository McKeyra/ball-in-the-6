'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/theme-store';
import { getThemeById } from '@/lib/themes';

function applyThemeToDOM(themeId: string): void {
  const theme = getThemeById(themeId as Parameters<typeof getThemeById>[0]);
  const root = document.documentElement;
  const { colors } = theme;

  root.style.setProperty('--color-void', colors.void);
  root.style.setProperty('--color-surface', colors.surface);
  root.style.setProperty('--color-text-primary', colors.textPrimary);
  root.style.setProperty('--color-text-secondary', colors.textSecondary);
  root.style.setProperty('--color-border', colors.border);
  root.style.setProperty('--color-lime', colors.lime);
  root.style.setProperty('--color-nav-bg', colors.navBg);

  // Update body colors directly for immediate visual effect
  document.body.style.backgroundColor = colors.void;
  document.body.style.color = colors.textPrimary;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeId = useThemeStore((s) => s.themeId);
  const hydrate = useThemeStore((s) => s.hydrate);
  const hydrated = useThemeStore((s) => s.hydrated);

  // Hydrate from localStorage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Apply theme whenever themeId changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    applyThemeToDOM(themeId);
  }, [themeId, hydrated]);

  // Add transition class to body for smooth theme switches
  useEffect(() => {
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    return (): void => {
      document.body.style.transition = '';
    };
  }, []);

  return <>{children}</>;
};
