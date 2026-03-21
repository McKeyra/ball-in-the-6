'use client';

import { type LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface CardColor {
  bg: string;
  text: string;
  border: string;
  gradient: string;
}

export const CARD_COLORS: Record<string, CardColor> = {
  gold: {
    bg: 'bg-[#c9a962]/10',
    text: 'text-[#c9a962]',
    border: 'border-[#c9a962]/20',
    gradient: 'from-[#c9a962] to-[#d4b872]',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    gradient: 'from-blue-500 to-cyan-500',
  },
  green: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    gradient: 'from-emerald-500 to-green-500',
  },
  purple: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    border: 'border-violet-500/20',
    gradient: 'from-violet-500 to-purple-500',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
    gradient: 'from-orange-500 to-red-500',
  },
};

export function getEntityColor(entityType: string): CardColor {
  const colorMap: Record<string, string> = {
    team: 'blue',
    player: 'green',
    league: 'gold',
    game: 'orange',
    event: 'purple',
  };
  return CARD_COLORS[colorMap[entityType] || 'gold'];
}

interface B6ColorCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  iconName?: string;
  color?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function B6ColorCard({
  title,
  subtitle,
  value,
  iconName,
  color = 'gold',
  onClick,
  children,
}: B6ColorCardProps) {
  const colorConfig = CARD_COLORS[color] || CARD_COLORS.gold;
  const Icon: LucideIcon | null = iconName
    ? (LucideIcons as unknown as Record<string, LucideIcon>)[iconName] || null
    : null;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] ${colorConfig.bg} ${colorConfig.border}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {subtitle && (
            <p className="text-xs font-medium text-white/50 mb-1">
              {subtitle}
            </p>
          )}
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {value !== undefined && (
            <p className={`text-2xl font-black mt-1 ${colorConfig.text}`}>
              {value}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorConfig.bg}`}
          >
            <Icon className={`w-5 h-5 ${colorConfig.text}`} />
          </div>
        )}
      </div>
      {children}
    </button>
  );
}

interface B6MiniColorCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export function B6MiniColorCard({
  label,
  value,
  color = 'gold',
}: B6MiniColorCardProps) {
  const colorConfig = CARD_COLORS[color] || CARD_COLORS.gold;

  return (
    <div
      className={`p-3 rounded-xl border ${colorConfig.bg} ${colorConfig.border}`}
    >
      <p className="text-xs text-white/50 mb-0.5">{label}</p>
      <p className={`text-lg font-bold ${colorConfig.text}`}>{value}</p>
    </div>
  );
}
