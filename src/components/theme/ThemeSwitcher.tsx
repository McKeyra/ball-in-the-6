'use client';

import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/lib/theme-store';
import { THEMES, THEME_IDS, type ThemeId, type ThemeTokens } from '@/lib/themes';

const ThemeSwatch: React.FC<{
  theme: ThemeTokens;
  isActive: boolean;
  onSelect: (id: ThemeId) => void;
}> = ({ theme, isActive, onSelect }) => {
  const { colors } = theme;

  return (
    <button
      type="button"
      onClick={() => onSelect(theme.id)}
      className={cn(
        'relative flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all duration-200',
        isActive
          ? 'ring-2 ring-lime bg-surface/60'
          : 'ring-1 ring-black/[0.06] hover:ring-black/[0.12]'
      )}
    >
      {/* Color preview circles */}
      <div className="flex items-center gap-1">
        <span
          className="h-6 w-6 rounded-full ring-1 ring-black/10"
          style={{ backgroundColor: colors.void }}
        />
        <span
          className="h-6 w-6 rounded-full ring-1 ring-black/10"
          style={{ backgroundColor: colors.lime }}
        />
        <span
          className="h-6 w-6 rounded-full ring-1 ring-black/10"
          style={{ backgroundColor: colors.surface }}
        />
      </div>

      {/* Label */}
      <span className="text-[11px] font-bold text-neutral-600 leading-none mt-0.5">
        {theme.name}
      </span>

      {/* Active checkmark */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-lime shadow-sm"
        >
          <Check className="h-3 w-3 text-black" strokeWidth={3} />
        </motion.div>
      )}
    </button>
  );
};

export const ThemeSwitcher: React.FC = () => {
  const themeId = useThemeStore((s) => s.themeId);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {THEME_IDS.map((id) => (
          <ThemeSwatch
            key={id}
            theme={THEMES[id]}
            isActive={themeId === id}
            onSelect={setTheme}
          />
        ))}
      </div>
      <p className="text-[11px] text-neutral-400 leading-relaxed px-1">
        {THEMES[themeId].description}
      </p>
    </div>
  );
};
