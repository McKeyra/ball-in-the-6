'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { PlayerDetail } from '@/types/player';

interface PlayerCardProps {
  player: PlayerDetail;
  index: number;
}

const POSITION_COLORS: Record<string, string> = {
  PG: 'from-purple-500 to-blue-500',
  SG: 'from-orange-500 to-red-500',
  SF: 'from-emerald-500 to-cyan-500',
  PF: 'from-pink-500 to-purple-500',
  C: 'from-yellow-500 to-orange-500',
} as const;

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, index }) => {
  const gradient = POSITION_COLORS[player.position] ?? 'from-gray-500 to-slate-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05 * index,
        duration: 0.35,
        type: 'spring',
        stiffness: 200,
        damping: 22,
      }}
    >
      <Link href={`/players/${player.id}`} className="block group">
        <div
          className={cn(
            'rounded-[20px] border border-neutral-200/60 bg-white p-5',
            'transition-all duration-300',
            'hover:border-[#C8FF00]/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(200,255,0,0.08)]'
          )}
        >
          <div className="flex items-center gap-4">
            {/* Avatar with jersey number */}
            <div className="relative shrink-0">
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-lg font-black text-white',
                  gradient
                )}
              >
                {player.name.charAt(0)}
                {player.name.split(' ')[1]?.charAt(0) ?? ''}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-black text-white ring-2 ring-white">
                {player.number}
              </div>
            </div>

            {/* Player info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-neutral-900 truncate group-hover:text-[#C8FF00] transition-colors">
                {player.name}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {player.team}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                  {player.position}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  #{player.number}
                </span>
              </div>
            </div>

            {/* PPG stat */}
            <div className="shrink-0 text-right">
              <p className="font-mono text-2xl font-black text-neutral-900 tracking-tighter">
                {player.stats.ppg.toFixed(1)}
              </p>
              <p className="text-[8px] font-mono uppercase tracking-widest text-neutral-400">
                PPG
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
