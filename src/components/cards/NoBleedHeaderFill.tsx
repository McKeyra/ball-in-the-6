'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Trophy, Share2, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { timeAgo, formatNumber } from '@/lib/utils';
import type { HeaderFillPost } from '@/types/index';
import { ImageWithFallback } from './ImageWithFallback';

const SCORES = [
  { value: 1, label: 'SOLID', color: 'emerald' },
  { value: 2, label: 'IMPRESSIVE', color: 'blue' },
  { value: 3, label: 'LEGENDARY', color: 'lime' },
] as const;

const SCORE_STYLES: Record<string, { base: string; active: string }> = {
  emerald: { base: 'border-emerald-500/20 text-emerald-400/60 hover:bg-emerald-500/10', active: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' },
  blue: { base: 'border-blue-500/20 text-blue-400/60 hover:bg-blue-500/10', active: 'bg-blue-500/20 border-blue-400/40 text-blue-300' },
  lime: { base: 'border-[#c8ff00]/20 text-[#c8ff00]/60 hover:bg-[#c8ff00]/10', active: 'bg-[#c8ff00]/20 border-[#c8ff00]/40 text-[#c8ff00]' },
};

export const NoBleedHeaderFill: React.FC<HeaderFillPost> = ({ author, imageUrl, caption, score, assists, drops, timestamp }) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [assistCount, setAssistCount] = useState(assists);

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="max-w-xl rounded-[28px] bg-neutral-50 backdrop-blur-xl border border-neutral-200 overflow-hidden">
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c8ff00]/20 via-emerald-900/30 to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        <div className="absolute top-4 left-5 z-10">
          <div className="flex items-center gap-1.5 rounded-full bg-[#c8ff00]/10 border border-[#c8ff00]/20 px-3 py-1 backdrop-blur-md"><Sparkles className="h-3 w-3 text-[#c8ff00]" /><span className="text-[10px] font-black uppercase tracking-widest text-[#c8ff00]">Feature Moment</span></div>
        </div>
        <div className="absolute bottom-4 left-5 z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#c8ff00] to-emerald-600 ring-2 ring-neutral-950 shrink-0" />
          <div>
            <div className="flex items-center gap-1.5"><span className="text-sm font-bold text-neutral-900">{author.username}</span>{author.verified && <ShieldCheck className="h-3.5 w-3.5 text-[#c8ff00]" />}</div>
            <span className="text-[10px] font-mono text-neutral-900/50">@{author.handle} &middot; {timeAgo(timestamp)}</span>
          </div>
        </div>
      </div>
      <div className="mx-5 mt-3 aspect-video rounded-2xl overflow-hidden"><ImageWithFallback src={imageUrl} alt={caption} className="h-full w-full" /></div>
      <div className="px-5 pt-3"><p className="text-sm text-neutral-700 line-clamp-2">{caption}</p></div>
      <div className="grid grid-cols-3 gap-3 px-5 pt-4">
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3 text-center"><Trophy className="h-4 w-4 text-yellow-500 mx-auto mb-1" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Impact</span><span className="text-2xl font-black text-neutral-900">{formatNumber(score + (selectedScore ?? 0))}</span></div>
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3 text-center"><Share2 className="h-4 w-4 text-orange-500 mx-auto mb-1" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Assists</span><span className="text-2xl font-black text-neutral-900">{formatNumber(assistCount)}</span></div>
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3 text-center"><Zap className="h-4 w-4 text-[#c8ff00] mx-auto mb-1" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Drops</span><span className="text-2xl font-black text-neutral-900">{formatNumber(drops)}</span></div>
      </div>
      <div className="flex gap-2 px-5 pt-4">
        {SCORES.map((s) => {
          const styles = SCORE_STYLES[s.color];
          const isActive = selectedScore === s.value;
          return (<button key={s.value} onClick={() => setSelectedScore(isActive ? null : s.value)} className={cn('flex-1 rounded-xl border py-2 text-center transition-all', 'text-[10px] font-black uppercase tracking-widest', isActive ? styles.active : styles.base)}>+{s.value} {s.label}</button>);
        })}
      </div>
      <div className="px-5 py-4"><button onClick={() => setAssistCount((c) => c + 1)} className="w-full rounded-2xl bg-neutral-50 border border-neutral-200 py-3 text-center transition-all hover:bg-neutral-100"><span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Assist this moment</span></button></div>
    </motion.div>
  );
};
