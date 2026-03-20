'use client';

import { motion } from 'motion/react';
import { MapPin, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GameResultPost } from '@/types/index';

const TeamLogo: React.FC<{ color: string }> = ({ color }) => (
  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br shrink-0 flex items-center justify-center" style={{ backgroundImage: `linear-gradient(135deg, ${color}44, ${color}11)`, borderColor: `${color}33` }}>
    <Zap className="h-7 w-7" style={{ color }} />
  </div>
);

export const GameResultsCard: React.FC<GameResultPost> = ({ teamA, teamB, gameStatus, venue, mvp, impactScore }) => {
  const isLive = gameStatus.toUpperCase() === 'LIVE';

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="relative max-w-xl rounded-[28px] overflow-hidden border border-neutral-200">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
      <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-[#c8ff00]/10 blur-[80px]" />
      <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-purple-500/10 blur-[80px]" />
      <div className="relative z-10 p-6">
        <div className="flex justify-center mb-6">
          <div className={cn('flex items-center gap-2 rounded-full px-4 py-1.5 backdrop-blur-md', isLive ? 'bg-red-500/10 border border-red-500/20' : 'bg-neutral-100/60 border border-neutral-200')}>
            {isLive && (<span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" /></span>)}
            <span className={cn('text-[10px] font-black uppercase tracking-widest', isLive ? 'text-red-400' : 'text-neutral-900/70')}>{gameStatus}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex flex-col items-center gap-2">
            <TeamLogo color={teamA.color} />
            <span className="text-6xl font-black text-neutral-900 tabular-nums">{teamA.score}</span>
            <span className="text-xs font-bold text-neutral-900 truncate max-w-[100px]">{teamA.name}</span>
            <span className="text-[10px] font-mono text-neutral-400">{teamA.record}</span>
          </div>
          <span className="text-2xl font-black text-neutral-300 mt-4">VS</span>
          <div className="flex flex-col items-center gap-2">
            <TeamLogo color={teamB.color} />
            <span className="text-6xl font-black text-neutral-900 tabular-nums">{teamB.score}</span>
            <span className="text-xs font-bold text-neutral-900 truncate max-w-[100px]">{teamB.name}</span>
            <span className="text-[10px] font-mono text-neutral-400">{teamB.record}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-6"><MapPin className="h-3 w-3 text-neutral-400" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{venue}</span></div>
        <div className="h-px bg-neutral-100 mb-5" />
        <div className="mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-3">Player of the Game</span>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#c8ff00]/30 to-[#c8ff00]/5 border border-[#c8ff00]/20 flex items-center justify-center shrink-0"><Zap className="h-5 w-5 text-[#c8ff00]" /></div>
            <div className="min-w-0"><h3 className="text-lg font-black uppercase tracking-tighter text-neutral-900 truncate">{mvp.name}</h3><span className="text-xs font-mono text-neutral-500">{mvp.stats}</span></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Verified by Ai6</span></div>
          <div className="text-right"><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Impact</span><span className="text-2xl font-black text-neutral-900">{impactScore}</span></div>
        </div>
      </div>
    </motion.div>
  );
};
