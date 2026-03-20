'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Share2,
  Camera,
  MessageCircle,
  Trophy,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PARENT_CHILDREN, COACH_NOTES } from '@/lib/parent-data';
import { CoachNoteCard } from '@/components/parent/CoachNoteCard';

/* ------------------------------------------------------------------ */
/*  Mock live game data                                                */
/* ------------------------------------------------------------------ */
const LIVE_GAME = {
  id: 'game-live-001',
  status: 'live' as const,
  period: 'Q3',
  gameClock: '3:47',
  homeTeam: {
    name: 'Scarborough Elite U14',
    shortName: 'SE',
    color: 'from-gray-500 to-slate-600',
    score: 42,
    record: '8-6',
  },
  awayTeam: {
    name: 'B.M.T. Titans U14',
    shortName: 'BT',
    color: 'from-orange-500 to-red-500',
    score: 38,
    record: '12-2',
  },
  venue: 'Pan Am Centre, Scarborough',
};

const CHILD = PARENT_CHILDREN[0];

const CHILD_LIVE_STATS = {
  pts: 12,
  reb: 3,
  ast: 5,
  min: 18,
};

const PLAY_BY_PLAY = [
  { id: 'p-01', time: '3:47', period: 'Q3', action: `${CHILD.name} assist to Devon C. for layup`, isChild: true },
  { id: 'p-02', time: '4:12', period: 'Q3', action: 'B.M.T. timeout called', isChild: false },
  { id: 'p-03', time: '5:01', period: 'Q3', action: `${CHILD.name} made 3-pointer from left wing`, isChild: true },
  { id: 'p-04', time: '5:33', period: 'Q3', action: 'Jordan B. made mid-range jumper for B.M.T.', isChild: false },
  { id: 'p-05', time: '6:15', period: 'Q3', action: `${CHILD.name} steal and coast-to-coast layup`, isChild: true },
  { id: 'p-06', time: '6:33', period: 'Q3', action: 'Caleb S. missed 3-pointer for B.M.T.', isChild: false },
  { id: 'p-07', time: '7:01', period: 'Q3', action: `${CHILD.name} rebound and outlet pass to Isaiah M.`, isChild: true },
  { id: 'p-08', time: '7:15', period: 'Q2', action: `${CHILD.name} driving layup and-1 (made FT)`, isChild: true },
  { id: 'p-09', time: '7:44', period: 'Q2', action: 'Kyle E. blocked shot on Tyrell D.', isChild: false },
  { id: 'p-10', time: '8:02', period: 'Q2', action: `${CHILD.name} made pull-up jumper`, isChild: true },
];

const GAME_DAY_COACH_NOTES = COACH_NOTES.filter((n) => n.childName === CHILD.name).slice(0, 2);

type PlayFilter = 'all' | 'child';

export const GameDayParentPage: React.FC = () => {
  const router = useRouter();
  const [playFilter, setPlayFilter] = useState<PlayFilter>('child');

  const filteredPlays = playFilter === 'child'
    ? PLAY_BY_PLAY.filter((p) => p.isChild)
    : PLAY_BY_PLAY;

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="sticky top-0 z-40 bg-void/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/parent')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              aria-label="Back to parent dashboard"
            >
              <ArrowLeft className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
            </button>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <h1 className="text-lg font-black text-neutral-900">Game Day</h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              aria-label="Share game"
            >
              <Share2 className="h-[17px] w-[17px] text-neutral-500" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              aria-label="Photos"
            >
              <Camera className="h-[17px] w-[17px] text-neutral-500" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </motion.header>

      <div className="px-4 pt-5 space-y-5">
        {/* Live Scoreboard */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[20px] border-2 border-lime/40 bg-gradient-to-b from-lime/[0.06] to-transparent p-5 shadow-[0_0_24px_rgba(200,255,0,0.08)]"
        >
          {/* Status */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-red-500">Live</span>
            <span className="text-xs font-medium text-neutral-400">{LIVE_GAME.period} &middot; {LIVE_GAME.gameClock}</span>
          </div>

          {/* Scores */}
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div
                className={cn(
                  'mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-lg font-black text-white',
                  LIVE_GAME.homeTeam.color
                )}
              >
                {LIVE_GAME.homeTeam.shortName}
              </div>
              <span className="text-xs font-bold text-neutral-600 block">{LIVE_GAME.homeTeam.name}</span>
              <span className="text-[11px] text-neutral-400">{LIVE_GAME.homeTeam.record}</span>
              <span className="text-3xl font-black text-neutral-900 block mt-1 font-[family-name:var(--font-mono)]">
                {LIVE_GAME.homeTeam.score}
              </span>
            </div>

            <div className="flex flex-col items-center px-4">
              <Trophy className="h-5 w-5 text-lime mb-1" strokeWidth={2} />
              <span className="text-xs font-bold text-neutral-300">VS</span>
            </div>

            <div className="flex-1 text-center">
              <div
                className={cn(
                  'mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-lg font-black text-white',
                  LIVE_GAME.awayTeam.color
                )}
              >
                {LIVE_GAME.awayTeam.shortName}
              </div>
              <span className="text-xs font-bold text-neutral-600 block">{LIVE_GAME.awayTeam.name}</span>
              <span className="text-[11px] text-neutral-400">{LIVE_GAME.awayTeam.record}</span>
              <span className="text-3xl font-black text-neutral-900 block mt-1 font-[family-name:var(--font-mono)]">
                {LIVE_GAME.awayTeam.score}
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[11px] text-neutral-400">{LIVE_GAME.venue}</span>
          </div>
        </motion.div>

        {/* Child Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.3 }}
          className="rounded-[20px] bg-white border border-neutral-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-[11px] font-black text-white">
              {CHILD.avatar}
            </div>
            <div>
              <span className="text-sm font-black text-neutral-900">{CHILD.name}&apos;s Stats</span>
              <span className="text-[11px] text-neutral-400 block">Live &middot; {LIVE_GAME.period}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(CHILD_LIVE_STATS) as [string, number][]).map(([key, value]) => (
              <div key={key} className="rounded-[14px] bg-surface p-3 text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">{key}</span>
                <span className="text-xl font-black text-neutral-900 font-[family-name:var(--font-mono)]">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Play-by-Play */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">Play-by-Play</h2>
            <div className="flex items-center gap-1 rounded-full bg-surface p-0.5">
              <button
                type="button"
                onClick={() => setPlayFilter('child')}
                className={cn(
                  'rounded-full px-3 py-1 text-[11px] font-bold transition-colors',
                  playFilter === 'child' ? 'bg-lime text-black' : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                {CHILD.name}
              </button>
              <button
                type="button"
                onClick={() => setPlayFilter('all')}
                className={cn(
                  'rounded-full px-3 py-1 text-[11px] font-bold transition-colors',
                  playFilter === 'all' ? 'bg-lime text-black' : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                All
              </button>
            </div>
          </div>

          <div className="rounded-[20px] bg-white border border-neutral-200/60 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {filteredPlays.map((play, i) => (
              <motion.div
                key={play.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className={cn(
                  'flex items-start gap-3 px-4 py-3',
                  i < filteredPlays.length - 1 && 'border-b border-neutral-100/60',
                  play.isChild && 'bg-lime/[0.03]'
                )}
              >
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  <Clock className="h-3 w-3 text-neutral-300" strokeWidth={2} />
                  <span className="text-[11px] font-bold text-neutral-400 font-[family-name:var(--font-mono)] w-10">{play.time}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 block">{play.period}</span>
                  <span className={cn('text-sm', play.isChild ? 'font-bold text-neutral-900' : 'text-neutral-500')}>
                    {play.action}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Coach Notes */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.3 }}
        >
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-3">Coach Notes</h2>
          <div className="space-y-3">
            {GAME_DAY_COACH_NOTES.map((note, i) => (
              <CoachNoteCard key={note.id} note={note} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-surface py-3.5 text-sm font-black text-neutral-700 transition-colors hover:bg-neutral-200/60"
          >
            <Share2 className="h-4 w-4" strokeWidth={2} />
            Share
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-surface py-3.5 text-sm font-black text-neutral-700 transition-colors hover:bg-neutral-200/60"
          >
            <Camera className="h-4 w-4" strokeWidth={2} />
            Photos
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-lime py-3.5 text-sm font-black text-black transition-transform active:scale-[0.98] shadow-[0_0_12px_rgba(200,255,0,0.2)]"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2} />
            Coach
          </button>
        </motion.div>
      </div>
    </div>
  );
};
