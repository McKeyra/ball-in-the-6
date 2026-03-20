'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Trophy, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { timeAgo, formatNumber } from '@/lib/utils';
import type { SliderPost } from '@/types/index';
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

export const NoBleedSlider: React.FC<SliderPost> = ({ author, imageUrls, caption, score, assists, timestamp }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [assistCount, setAssistCount] = useState(assists);
  const total = imageUrls.length;
  const prev = (): void => setCurrentIndex((i) => (i === 0 ? total - 1 : i - 1));
  const next = (): void => setCurrentIndex((i) => (i === total - 1 ? 0 : i + 1));

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="max-w-xl rounded-[28px] bg-neutral-50 backdrop-blur-xl border border-neutral-200 overflow-hidden">
      <div className="flex items-center gap-3 px-5 pt-5 pb-2">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#c8ff00] to-emerald-600 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5"><span className="text-sm font-bold text-neutral-900 truncate">{author.username}</span>{author.verified && <ShieldCheck className="h-3.5 w-3.5 text-[#c8ff00] shrink-0" />}</div>
          <span className="text-xs font-mono text-neutral-400">@{author.handle}</span>
        </div>
        <span className="text-[10px] font-mono text-neutral-300">{timeAgo(timestamp)}</span>
      </div>
      <div className="relative mx-5 mt-3 aspect-video rounded-2xl overflow-hidden">
        <ImageWithFallback src={imageUrls[currentIndex] ?? ''} alt={`${caption} ${currentIndex + 1}`} className="h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8"><p className="text-sm text-neutral-900/90 line-clamp-2">{caption}</p></div>
        {total > 1 && (<><button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 backdrop-blur-md border border-neutral-200 flex items-center justify-center transition-colors hover:bg-black/70"><ChevronLeft className="h-4 w-4 text-neutral-900" /></button><button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 backdrop-blur-md border border-neutral-200 flex items-center justify-center transition-colors hover:bg-black/70"><ChevronRight className="h-4 w-4 text-neutral-900" /></button></>)}
        {total > 1 && (<div className="absolute bottom-14 inset-x-0 flex justify-center gap-1.5">{imageUrls.map((_, i) => (<button key={i} onClick={() => setCurrentIndex(i)} className={cn('h-1.5 rounded-full transition-all', i === currentIndex ? 'w-4 bg-[#c8ff00]' : 'w-1.5 bg-white/30')} />))}</div>)}
      </div>
      <div className="flex gap-2 px-5 pt-4">
        {SCORES.map((s) => {
          const styles = SCORE_STYLES[s.color];
          const isActive = selectedScore === s.value;
          return (<button key={s.value} onClick={() => setSelectedScore(isActive ? null : s.value)} className={cn('flex-1 rounded-xl border py-2 text-center transition-all', 'text-[10px] font-black uppercase tracking-widest', isActive ? styles.active : styles.base)}>+{s.value} {s.label}</button>);
        })}
      </div>
      <div className="flex items-center gap-5 px-5 py-4">
        <div className="flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-yellow-500" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{formatNumber(score + (selectedScore ?? 0))}</span></div>
        <button onClick={() => setAssistCount((c) => c + 1)} className="flex items-center gap-1.5 transition-colors hover:text-orange-400"><Share2 className="h-3.5 w-3.5 text-orange-500" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{formatNumber(assistCount)}</span></button>
      </div>
    </motion.div>
  );
};
