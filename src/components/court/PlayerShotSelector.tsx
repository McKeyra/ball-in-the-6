'use client';

import { motion } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { PlayerShotChart } from '@/types/court';

interface PlayerShotSelectorProps {
  players: PlayerShotChart[];
  selectedPlayerId: string;
  onPlayerSelect: (playerId: string) => void;
  className?: string;
}

export const PlayerShotSelector: React.FC<PlayerShotSelectorProps> = ({
  players,
  selectedPlayerId,
  onPlayerSelect,
  className,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPlayer = players.find((p) => p.playerId === selectedPlayerId);

  const handleSelect = useCallback(
    (playerId: string): void => {
      onPlayerSelect(playerId);
      setOpen(false);
    },
    [onPlayerSelect]
  );

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClick = (e: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!selectedPlayer) return null;

  const overallPct =
    selectedPlayer.totalAttempts > 0
      ? ((selectedPlayer.totalMakes / selectedPlayer.totalAttempts) * 100).toFixed(1)
      : '0.0';

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-[20px] border border-neutral-200 bg-white px-4 py-3 text-left transition-colors hover:border-neutral-300"
      >
        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-xs font-black text-[#C8FF00]">
          {selectedPlayer.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-neutral-900 truncate">
            {selectedPlayer.playerName}
          </p>
          <p className="text-[10px] font-mono text-neutral-400">
            {overallPct}% FG &middot; {selectedPlayer.totalAttempts} attempts
          </p>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-neutral-400" />
        </motion.div>
      </button>

      {/* Dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg"
        >
          {players.map((player) => {
            const pct =
              player.totalAttempts > 0
                ? ((player.totalMakes / player.totalAttempts) * 100).toFixed(1)
                : '0.0';
            const isActive = player.playerId === selectedPlayerId;

            return (
              <button
                key={player.playerId}
                type="button"
                onClick={() => handleSelect(player.playerId)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                  isActive
                    ? 'bg-[#C8FF00]/10'
                    : 'hover:bg-neutral-50'
                )}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-black',
                    isActive
                      ? 'bg-neutral-900 text-[#C8FF00]'
                      : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  {player.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-bold truncate',
                      isActive ? 'text-neutral-900' : 'text-neutral-700'
                    )}
                  >
                    {player.playerName}
                  </p>
                  <p className="text-[10px] font-mono text-neutral-400">
                    {pct}% FG &middot; {player.totalAttempts} att
                  </p>
                </div>
                {isActive && <Check className="h-4 w-4 text-[#C8FF00]" />}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
