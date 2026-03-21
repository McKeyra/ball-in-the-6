'use client';

import { cn } from '@/lib/utils';

interface ScoreConfig {
  stroke: string;
  text: string;
  label: string;
}

function getScoreColor(score: number): ScoreConfig {
  if (score >= 80) return { stroke: '#22c55e', text: 'text-green-400', label: 'Protected' };
  if (score >= 60) return { stroke: '#eab308', text: 'text-yellow-400', label: 'Moderate' };
  return { stroke: '#ef4444', text: 'text-red-400', label: 'At Risk' };
}

interface ProtectionScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export function ProtectionScore({ score, size = 120, strokeWidth = 8, showLabel = true }: ProtectionScoreProps): React.ReactElement {
  const safeScore = Math.max(0, Math.min(100, score || 0));
  const config = getScoreColor(safeScore);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={config.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold', config.text, size >= 100 ? 'text-2xl' : 'text-lg')}>
            {safeScore}
          </span>
          {showLabel && (
            <span className="text-[10px] text-slate-400">/ 100</span>
          )}
        </div>
      </div>
      {showLabel && (
        <span className={cn('text-xs font-medium', config.text)}>
          {config.label}
        </span>
      )}
    </div>
  );
}
