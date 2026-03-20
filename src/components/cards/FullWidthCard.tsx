'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Trophy, Share2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { timeAgo, formatNumber } from '@/lib/utils';
import type { FullWidthPost } from '@/types/index';
import { ImageWithFallback } from './ImageWithFallback';

const SCORES = [
  { value: 1, label: 'SOLID', color: 'emerald' },
  { value: 2, label: 'IMPRESSIVE', color: 'blue' },
  { value: 3, label: 'LEGENDARY', color: 'lime' },
] as const;

const SCORE_STYLES: Record<string, { base: string; active: string }> = {
  emerald: { base: 'border-emerald-500/30 text-emerald-400/70 hover:bg-emerald-500/10', active: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' },
  blue: { base: 'border-blue-500/30 text-blue-400/70 hover:bg-blue-500/10', active: 'bg-blue-500/20 border-blue-400/40 text-blue-300' },
  lime: { base: 'border-[#c8ff00]/30 text-[#c8ff00]/70 hover:bg-[#c8ff00]/10', active: 'bg-[#c8ff00]/20 border-[#c8ff00]/40 text-[#c8ff00]' },
};

export const FullWidthCard: React.FC<FullWidthPost> = ({ author, imageUrl, caption, score, assists, timestamp }) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [assistCount, setAssistCount] = useState(assists);

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="relative max-w-[400px] h-[580px] rounded-[28px] overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback src={imageUrl} alt={caption} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>
      <div className="absolute top-5 left-5 z-10">
        <div className="flex items-center gap-1.5 rounded-full bg-[#c8ff00]/10 border border-[#c8ff00]/20 px-3 py-1.5 backdrop-blur-md">
          <TrendingUp className="h-3.5 w-3.5 text-[#c8ff00]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#c8ff00]">Trending</span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#c8ff00] to-emerald-600 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-neutral-900 truncate">{author.username}</span>
              {author.verified && <ShieldCheck className="h-3.5 w-3.5 text-[#c8ff00] shrink-0" />}
            </div>
            <span className="text-[10px] font-mono text-neutral-900/50">@{author.handle} &middot; {timeAgo(timestamp)}</span>
          </div>
        </div>
        <p className="text-sm text-neutral-900/80 line-clamp-2 mb-4">{caption}</p>
        <div className="flex gap-2 mb-4">
          {SCORES.map((s) => {
            const styles = SCORE_STYLES[s.color];
            const isActive = selectedScore === s.value;
            return (<button key={s.value} onClick={() => setSelectedScore(isActive ? null : s.value)} className={cn('flex-1 rounded-xl border py-2 text-center backdrop-blur-md transition-all', 'text-[10px] font-black uppercase tracking-widest', isActive ? styles.active : styles.base)}>+{s.value}</button>);
          })}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-yellow-500" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-900/50">{formatNumber(score + (selectedScore ?? 0))}</span></div>
          <button onClick={() => setAssistCount((c) => c + 1)} className="flex items-center gap-1.5 transition-colors hover:text-orange-400"><Share2 className="h-3.5 w-3.5 text-orange-500" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-900/50">{formatNumber(assistCount)}</span></button>
        </div>
      </div>
    </motion.div>
  );
};
