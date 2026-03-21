'use client';

import { cn } from '@/lib/utils';

interface StatButtonProps {
  label: string;
  value: number;
  color?: string;
  onIncrement: () => void;
  onDecrement: () => void;
  compact?: boolean;
}

export function StatButton({
  label,
  value,
  color = '#c8ff00',
  onIncrement,
  onDecrement,
  compact = false,
}: StatButtonProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300',
        compact ? 'px-3 py-2' : 'px-4 py-3',
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">{label}</span>
        <span className="text-lg font-black text-neutral-900 tabular-nums min-w-[24px] text-center">{value}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onDecrement}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50 transition-colors text-sm font-bold"
        >
          -
        </button>
        <button
          type="button"
          onClick={onIncrement}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-900 font-bold text-sm transition-colors"
          style={{ backgroundColor: color }}
        >
          +
        </button>
      </div>
    </div>
  );
}
