'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PARENT_CHILDREN, PARENT_EVENTS, COACH_NOTES } from '@/lib/parent-data';
import { CoachNoteCard } from '@/components/parent/CoachNoteCard';
import { EventTimeline } from '@/components/parent/EventTimeline';

/* ------------------------------------------------------------------ */
/*  Mock attendance data                                               */
/* ------------------------------------------------------------------ */
const ATTENDANCE_RECORD = [
  { date: '03/08', status: 'present' as const },
  { date: '03/09', status: 'present' as const },
  { date: '03/11', status: 'late' as const },
  { date: '03/12', status: 'present' as const },
  { date: '03/14', status: 'absent' as const },
  { date: '03/15', status: 'present' as const },
  { date: '03/16', status: 'present' as const },
  { date: '03/18', status: 'present' as const },
  { date: '03/19', status: 'late' as const },
  { date: '03/20', status: 'present' as const },
];

const ATTENDANCE_CONFIG = {
  present: { color: 'bg-emerald-400', label: 'Present' },
  absent: { color: 'bg-red-400', label: 'Absent' },
  late: { color: 'bg-yellow-400', label: 'Late' },
} as const;

/* ------------------------------------------------------------------ */
/*  Mock payment history                                               */
/* ------------------------------------------------------------------ */
const PAYMENT_HISTORY = [
  { id: 'pay-001', date: '2026-03-01', amount: 400, description: 'U14 Registration - March', status: 'paid' as const },
  { id: 'pay-002', date: '2026-02-01', amount: 400, description: 'U14 Registration - February', status: 'paid' as const },
  { id: 'pay-003', date: '2026-01-01', amount: 400, description: 'U14 Registration - January', status: 'paid' as const },
];

/* ------------------------------------------------------------------ */
/*  Mock live game data                                                */
/* ------------------------------------------------------------------ */
const LIVE_GAME = {
  isLive: true,
  homeTeam: 'Scarborough Elite U14',
  awayTeam: 'B.M.T. Titans U14',
  homeScore: 42,
  awayScore: 38,
  period: 'Q3',
  gameClock: '3:47',
  childStats: { pts: 12, reb: 3, ast: 5, min: 18 },
  plays: [
    { time: '4:12', action: 'Tyrese M. assist to Devon C. for layup' },
    { time: '5:01', action: 'Tyrese M. made 3-pointer from left wing' },
    { time: '6:33', action: 'Tyrese M. steal and fast break' },
    { time: '7:15', action: 'Tyrese M. driving layup (and-1)' },
  ],
};

const AVATAR_GRADIENTS = [
  'from-orange-500 to-red-500',
  'from-violet-500 to-purple-500',
] as const;

export const ChildDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const childId = typeof params.id === 'string' ? params.id : '';

  const child = PARENT_CHILDREN.find((c) => c.id === childId) ?? PARENT_CHILDREN[0];
  const childIndex = PARENT_CHILDREN.findIndex((c) => c.id === child.id);
  const program = child.programs[0];
  const childEvents = PARENT_EVENTS.filter((e) => e.childId === child.id);
  const childNotes = COACH_NOTES.filter((n) => n.childName === child.name);
  const gradient = AVATAR_GRADIENTS[childIndex % AVATAR_GRADIENTS.length];

  /* Two weeks of events */
  const twoWeeksOut = new Date();
  twoWeeksOut.setDate(twoWeeksOut.getDate() + 14);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduleEvents = childEvents.filter((e) => {
    const d = new Date(e.date + 'T00:00:00');
    d.setHours(0, 0, 0, 0);
    return d >= today && d <= twoWeeksOut;
  });

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
            <h1 className="text-lg font-black text-neutral-900">{child.name}</h1>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-neutral-700 transition-colors hover:bg-neutral-200/60"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
            Message Coach
          </button>
        </div>
      </motion.header>

      <div className="px-4 pt-5 space-y-6">
        {/* Child Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[20px] bg-white border border-neutral-200/60 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-black text-white',
                gradient
              )}
            >
              {child.avatar ?? child.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900">{child.name}</h2>
              <p className="text-sm text-neutral-500">Age {child.age}</p>
              {program && (
                <p className="text-sm font-medium text-neutral-700 mt-0.5">{program.teamName}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Program Info Card */}
        {program && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            className="rounded-[20px] bg-white border border-neutral-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-3">Program Info</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[12px] bg-surface p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Program</span>
                <span className="text-sm font-bold text-neutral-900 mt-0.5 block">{program.programName}</span>
              </div>
              <div className="rounded-[12px] bg-surface p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Sport</span>
                <span className="text-sm font-bold text-neutral-900 mt-0.5 block">{program.sport}</span>
              </div>
              <div className="rounded-[12px] bg-surface p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Paid</span>
                <span className="text-sm font-bold text-emerald-600 font-[family-name:var(--font-mono)] mt-0.5 block">${program.amountPaid}</span>
              </div>
              <div className="rounded-[12px] bg-surface p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Balance</span>
                <span className={cn('text-sm font-bold font-[family-name:var(--font-mono)] mt-0.5 block', program.amountDue > 0 ? 'text-red-500' : 'text-neutral-400')}>
                  ${program.amountDue}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Live Game Day View */}
        {LIVE_GAME.isLive && child.id === 'child-001' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="rounded-[20px] border-2 border-lime/40 bg-lime/[0.04] p-4 shadow-[0_0_20px_rgba(200,255,0,0.08)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-red-500">Live Game</span>
              <span className="text-xs font-medium text-neutral-400 ml-auto">{LIVE_GAME.period} &middot; {LIVE_GAME.gameClock}</span>
            </div>

            {/* Scoreboard */}
            <div className="flex items-center justify-between rounded-[14px] bg-white/80 px-4 py-3 mb-3">
              <div className="text-center">
                <span className="text-xs font-bold text-neutral-500 block">{LIVE_GAME.homeTeam}</span>
                <span className="text-2xl font-black text-neutral-900 font-[family-name:var(--font-mono)]">{LIVE_GAME.homeScore}</span>
              </div>
              <span className="text-xs font-bold text-neutral-300">VS</span>
              <div className="text-center">
                <span className="text-xs font-bold text-neutral-500 block">{LIVE_GAME.awayTeam}</span>
                <span className="text-2xl font-black text-neutral-900 font-[family-name:var(--font-mono)]">{LIVE_GAME.awayScore}</span>
              </div>
            </div>

            {/* Child Stats */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {Object.entries(LIVE_GAME.childStats).map(([key, value]) => (
                <div key={key} className="rounded-[10px] bg-white/80 p-2 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">{key}</span>
                  <span className="text-lg font-black text-neutral-900 font-[family-name:var(--font-mono)]">{value}</span>
                </div>
              ))}
            </div>

            {/* Play-by-play */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">{child.name}&apos;s Plays</span>
              {LIVE_GAME.plays.map((play, i) => (
                <div key={i} className="flex items-start gap-2 rounded-[10px] bg-white/60 px-3 py-2">
                  <span className="text-[11px] font-bold text-neutral-400 shrink-0 font-[family-name:var(--font-mono)]">{play.time}</span>
                  <span className="text-xs text-neutral-700">{play.action}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Schedule (Next 2 Weeks) */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">Schedule</h3>
            <span className="text-xs font-medium text-neutral-400">Next 2 weeks</span>
          </div>
          <div className="rounded-[20px] bg-white border border-neutral-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {scheduleEvents.length > 0 ? (
              <EventTimeline events={scheduleEvents} />
            ) : (
              <p className="text-sm text-neutral-400 text-center py-6">No upcoming events</p>
            )}
          </div>
        </motion.section>

        {/* Coach Feedback Feed */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-3">Coach Feedback</h3>
          <div className="space-y-3">
            {childNotes.length > 0 ? (
              childNotes.map((note, i) => (
                <CoachNoteCard key={note.id} note={note} index={i} />
              ))
            ) : (
              <div className="rounded-[16px] bg-surface p-6 text-center">
                <p className="text-sm text-neutral-400">No coach notes yet</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Attendance Tracker */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-3">Attendance</h3>
          <div className="rounded-[20px] bg-white border border-neutral-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* Legend */}
            <div className="flex items-center gap-4 mb-3">
              {(Object.entries(ATTENDANCE_CONFIG) as [keyof typeof ATTENDANCE_CONFIG, (typeof ATTENDANCE_CONFIG)[keyof typeof ATTENDANCE_CONFIG]][]).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={cn('h-2.5 w-2.5 rounded-full', config.color)} />
                  <span className="text-[11px] font-medium text-neutral-500">{config.label}</span>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2 flex-wrap">
              {ATTENDANCE_RECORD.map((record, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'h-6 w-6 rounded-full flex items-center justify-center',
                      ATTENDANCE_CONFIG[record.status].color
                    )}
                  >
                    {record.status === 'present' && <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />}
                    {record.status === 'absent' && <XCircle className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />}
                    {record.status === 'late' && <Clock className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />}
                  </div>
                  <span className="text-[9px] font-medium text-neutral-400">{record.date}</span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-3 flex items-center gap-4 pt-3 border-t border-neutral-100">
              <span className="text-xs text-neutral-500">
                <span className="font-bold text-emerald-600">{ATTENDANCE_RECORD.filter((r) => r.status === 'present').length}</span> present
              </span>
              <span className="text-xs text-neutral-500">
                <span className="font-bold text-yellow-600">{ATTENDANCE_RECORD.filter((r) => r.status === 'late').length}</span> late
              </span>
              <span className="text-xs text-neutral-500">
                <span className="font-bold text-red-500">{ATTENDANCE_RECORD.filter((r) => r.status === 'absent').length}</span> absent
              </span>
            </div>
          </div>
        </motion.section>

        {/* Payment History */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-3">Payment History</h3>
          <div className="rounded-[20px] bg-white border border-neutral-200/60 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {PAYMENT_HISTORY.map((payment, i) => (
              <div
                key={payment.id}
                className={cn(
                  'flex items-center justify-between px-4 py-3',
                  i < PAYMENT_HISTORY.length - 1 && 'border-b border-neutral-100/60'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                    <CreditCard className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-neutral-900 block truncate">{payment.description}</span>
                    <span className="text-[11px] text-neutral-400">{payment.date}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-sm font-black text-emerald-600 font-[family-name:var(--font-mono)]">${payment.amount}</span>
                  <span className="text-[10px] font-bold uppercase text-emerald-500 block">Paid</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};
