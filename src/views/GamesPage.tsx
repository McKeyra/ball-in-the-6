'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Bell, Trophy, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { GAMES } from '@/lib/mock-data';
import type { Game, GameLevel } from '@/types/index';

const LEVELS: { key: GameLevel; label: string; color: string }[] = [
  { key: 'pro', label: 'Pro', color: 'bg-[#c8ff00] text-black' },
  { key: 'collegiate', label: 'Collegiate', color: 'bg-purple-500 text-neutral-900' },
  { key: 'highschool', label: 'High School', color: 'bg-blue-500 text-neutral-900' },
  { key: 'elementary', label: 'Elementary', color: 'bg-orange-500 text-neutral-900' },
];

const GameCard: React.FC<{ game: Game; isCenter: boolean }> = ({ game, isCenter }) => {
  const isLive = game.status === 'live';
  const isFinal = game.status === 'final';
  const aWon = isFinal && game.teamA.score > game.teamB.score;

  return (
    <div className={cn('w-[300px] shrink-0 snap-center rounded-[24px] border p-5 transition-all duration-300', isCenter ? 'bg-neutral-100/70 border-neutral-300/50 scale-100 opacity-100 shadow-[0_0_40px_rgba(200,255,0,0.04)]' : 'bg-neutral-50 border-neutral-200/60 scale-[0.92] opacity-50')}>
      <div className="flex items-center gap-2 mb-4">
        {isLive && (<><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" /></span><span className="text-[10px] font-black uppercase tracking-widest text-red-400">Live &middot; {game.time}</span></>)}
        {game.status === 'upcoming' && <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{game.time}</span>}
        {isFinal && <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Final</span>}
      </div>
      <div className="flex items-center justify-between">
        <TeamSide team={game.teamA} isWinner={aWon} showScore={game.status !== 'upcoming'} />
        <span className="text-[10px] font-mono text-neutral-300 px-2">VS</span>
        <TeamSide team={game.teamB} isWinner={isFinal && !aWon} showScore={game.status !== 'upcoming'} />
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-[10px] text-neutral-400"><MapPin className="h-3 w-3" /><span className="truncate">{game.venue}</span></div>
      {game.mvp && (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-yellow-500/[0.06] border border-yellow-500/10 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10 text-[10px] font-black text-yellow-400">{game.mvp.avatar}</div>
          <div className="min-w-0"><p className="text-[9px] font-mono uppercase tracking-widest text-yellow-600">MVP</p><p className="text-xs font-bold text-neutral-900 truncate">{game.mvp.name}</p><p className="text-[10px] text-neutral-500 truncate">{game.mvp.stats}</p></div>
        </div>
      )}
      {game.impactScore !== undefined && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-[#c8ff00]/[0.04] border border-[#c8ff00]/10 px-3 py-2"><span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">Impact</span><span className="text-sm font-black text-[#c8ff00]">{game.impactScore}</span></div>
      )}
      {game.status === 'upcoming' && (
        <button type="button" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#c8ff00]/20 bg-[#c8ff00]/5 py-2.5 text-xs font-black text-[#c8ff00] transition-colors hover:bg-[#c8ff00]/10"><Bell className="h-3.5 w-3.5" />Remind Me</button>
      )}
    </div>
  );
};

const TeamSide: React.FC<{ team: Game['teamA']; isWinner: boolean; showScore: boolean }> = ({ team, isWinner, showScore }) => (
  <div className="flex-1 text-center">
    <div className="mx-auto mb-2 h-12 w-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${team.color}18`, borderColor: `${team.color}30` }}>
      <Zap className="h-5 w-5" style={{ color: team.color }} />
    </div>
    {showScore && <p className={cn('text-3xl font-black', isWinner ? 'text-neutral-900' : 'text-neutral-500')}>{team.score}</p>}
    <p className={cn('text-xs font-bold mt-1 truncate', showScore && !isWinner ? 'text-neutral-400' : 'text-neutral-700')}>{team.name}</p>
    <p className="text-[10px] font-mono text-neutral-300">{team.record}</p>
  </div>
);

const GameCarousel: React.FC<{ games: Game[] }> = ({ games }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIdx, setCenterIdx] = useState(0);

  const scrollToIndex = (idx: number): void => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 300;
    const gap = 16;
    const containerCenter = el.clientWidth / 2;
    const scrollTarget = idx * (cardWidth + gap) - containerCenter + cardWidth / 2;
    el.scrollTo({ left: scrollTarget, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = (): void => {
      const cardWidth = 300;
      const gap = 16;
      const containerCenter = el.scrollLeft + el.clientWidth / 2;
      const idx = Math.round((containerCenter - cardWidth / 2) / (cardWidth + gap));
      setCenterIdx(Math.max(0, Math.min(idx, games.length - 1)));
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(() => scrollToIndex(0), 50);
    return () => el.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games.length]);

  if (games.length === 0) return <p className="pt-16 text-center text-sm text-neutral-300">No games at this level right now.</p>;

  return (
    <div className="relative">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-[calc(50vw-150px)] py-6">
        {games.map((game, i) => <GameCard key={game.id} game={game} isCenter={i === centerIdx} />)}
      </div>
      {games.length > 1 && (<>
        <button type="button" onClick={() => scrollToIndex(Math.max(0, centerIdx - 1))} className={cn('absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-600 transition-all hover:text-neutral-900 hover:bg-white/90', centerIdx === 0 && 'opacity-0 pointer-events-none')}><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" onClick={() => scrollToIndex(Math.min(games.length - 1, centerIdx + 1))} className={cn('absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-600 transition-all hover:text-neutral-900 hover:bg-white/90', centerIdx === games.length - 1 && 'opacity-0 pointer-events-none')}><ChevronRight className="h-5 w-5" /></button>
      </>)}
      <div className="flex justify-center gap-1.5 pb-2">
        {games.map((_, i) => <button key={i} type="button" onClick={() => scrollToIndex(i)} className={cn('h-1.5 rounded-full transition-all duration-300', i === centerIdx ? 'w-6 bg-[#c8ff00]' : 'w-1.5 bg-white/[0.15] hover:bg-white/[0.25]')} />)}
      </div>
    </div>
  );
};

type StatusFilter = 'all' | 'live' | 'upcoming' | 'final';

const STATUS_PILLS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'final', label: 'Results' },
];

export const GamesPage: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<GameLevel>('pro');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const filtered = GAMES.filter((g) => { if (g.level !== activeLevel) return false; if (statusFilter !== 'all' && g.status !== statusFilter) return false; return true; });
  const liveCount = GAMES.filter((g) => g.level === activeLevel && g.status === 'live').length;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Game Day</h1>
              {liveCount > 0 && <p className="text-[10px] font-mono text-red-400 mt-0.5">{liveCount} live game{liveCount > 1 ? 's' : ''} now</p>}
            </div>
            <Trophy className="h-5 w-5 text-[#c8ff00]/40" />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {LEVELS.map((level) => (<button key={level.key} type="button" onClick={() => { setActiveLevel(level.key); setStatusFilter('all'); }} className={cn('shrink-0 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all', activeLevel === level.key ? level.color : 'bg-neutral-100/60 text-neutral-400 hover:text-neutral-600')}>{level.label}</button>))}
          </div>
          <div className="flex gap-1.5 mt-3">
            {STATUS_PILLS.map((pill) => (<button key={pill.key} type="button" onClick={() => setStatusFilter(pill.key)} className={cn('rounded-lg px-3 py-1 text-[10px] font-bold transition-all', statusFilter === pill.key ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-300 hover:text-neutral-500')}>{pill.label}</button>))}
          </div>
        </div>
      </div>
      <GameCarousel games={filtered} />
    </div>
  );
};
