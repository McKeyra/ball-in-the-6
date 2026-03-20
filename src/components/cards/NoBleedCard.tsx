'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Trophy, Share2, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { timeAgo, formatNumber } from '@/lib/utils';
import type { NoBleedPost } from '@/types/index';
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

export const NoBleedCard: React.FC<NoBleedPost> = ({ author, imageUrl, caption, score, assists, commentCount, timestamp }) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [assistCount, setAssistCount] = useState(assists);

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="max-w-xl rounded-[28px] bg-neutral-50 backdrop-blur-xl border border-neutral-200 overflow-hidden">
      <div className="flex items-center gap-3 px-5 pt-5 pb-2">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#c8ff00] to-emerald-600 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-neutral-900 truncate">{author.username}</span>
            {author.verified && <ShieldCheck className="h-3.5 w-3.5 text-[#c8ff00] shrink-0" />}
          </div>
          <span className="text-xs font-mono text-neutral-400">@{author.handle}</span>
        </div>
        <span className="text-[10px] font-mono text-neutral-300">{timeAgo(timestamp)}</span>
      </div>
      <div className="mx-5 mt-3 aspect-video rounded-2xl overflow-hidden">
        <ImageWithFallback src={imageUrl} alt={caption} className="h-full w-full" />
      </div>
      <div className="px-5 pt-3"><p className="text-sm text-neutral-700 line-clamp-2">{caption}</p></div>
      <div className="flex items-center gap-1.5 px-5 pt-2">
        <MessageCircle className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-[10px] font-mono text-neutral-400">{formatNumber(commentCount)} comments</span>
      </div>
      <div className="flex gap-2 px-5 pt-3">
        {SCORES.map((s) => {
          const styles = SCORE_STYLES[s.color];
          const isActive = selectedScore === s.value;
          return (<button key={s.value} onClick={() => setSelectedScore(isActive ? null : s.value)} className={cn('flex-1 rounded-xl border py-2 text-center transition-all', 'text-[10px] font-black uppercase tracking-widest', isActive ? styles.active : styles.base)}>+{s.value} {s.label}</button>);
        })}
      </div>
      <div className="flex items-center gap-5 px-5 py-4">
        <div className="flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-yellow-500" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{formatNumber(score + (selectedScore ?? 0))}</span></div>
        <button onClick={() => setAssistCount((c) => c + 1)} className="flex items-center gap-1.5 transition-colors hover:text-orange-400"><Share2 className="h-3.5 w-3.5 text-orange-500" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{formatNumber(assistCount)}</span></button>
        <div className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5 text-neutral-400" /><span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{formatNumber(commentCount)}</span></div>
      </div>
    </motion.div>
  );
};
