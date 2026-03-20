'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Users,
  CreditCard,
  FileText,
  MessageCircle,
  ChevronRight,
  DollarSign,
  CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PARENT_CHILDREN, PARENT_EVENTS, COACH_NOTES, PARENT_GROUP_CHATS } from '@/lib/parent-data';
import { ChildCard } from '@/components/parent/ChildCard';
import { CoachNoteCard } from '@/components/parent/CoachNoteCard';
import { EventTimeline } from '@/components/parent/EventTimeline';

const SEVEN_DAYS_FROM_NOW = new Date();
SEVEN_DAYS_FROM_NOW.setDate(SEVEN_DAYS_FROM_NOW.getDate() + 7);

const upcomingEvents = PARENT_EVENTS.filter((e) => {
  const eventDate = new Date(e.date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today && eventDate <= SEVEN_DAYS_FROM_NOW;
});

const totalOwed = PARENT_CHILDREN.reduce(
  (sum, child) => sum + child.programs.reduce((pSum, p) => pSum + p.amountDue, 0),
  0
);

const totalPaid = PARENT_CHILDREN.reduce(
  (sum, child) => sum + child.programs.reduce((pSum, p) => pSum + p.amountPaid, 0),
  0
);

const recentNotes = COACH_NOTES.slice(0, 3);

export const ParentDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-void/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
            >
              <ArrowLeft className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
            </Link>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-neutral-900" strokeWidth={2} />
              <h1 className="text-lg font-black text-neutral-900">Parent Dashboard</h1>
            </div>
          </div>
          <Link
            href="/parent/gameday"
            className="flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-xs font-black text-black transition-transform active:scale-95"
          >
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Game Day
          </Link>
        </div>
      </motion.header>

      <div className="px-4 pt-5 space-y-6">
        {/* My Children */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">My Children</h2>
            <span className="text-xs font-medium text-neutral-400">{PARENT_CHILDREN.length} registered</span>
          </div>
          <div className="space-y-3">
            {PARENT_CHILDREN.map((child, i) => (
              <ChildCard key={child.id} child={child} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Upcoming Events */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">Upcoming Events</h2>
            <div className="flex items-center gap-1 text-xs font-medium text-neutral-400">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
              Next 7 days
            </div>
          </div>
          <div className="rounded-[20px] bg-white border border-neutral-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <EventTimeline events={upcomingEvents} />
          </div>
        </motion.section>

        {/* Messages Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">Messages</h2>
            <Link href="/messages" className="text-xs font-bold text-lime-dark hover:underline">
              View All
            </Link>
          </div>

          {/* Coach Notes */}
          <div className="space-y-3 mb-4">
            {recentNotes.map((note, i) => (
              <CoachNoteCard key={note.id} note={note} index={i} />
            ))}
          </div>

          {/* Group Chats */}
          <div className="rounded-[20px] bg-white border border-neutral-200/60 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="px-4 py-2.5 border-b border-neutral-100">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Group Chats</span>
            </div>
            {PARENT_GROUP_CHATS.map((chat, i) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.04, duration: 0.2 }}
              >
                <Link
                  href="/messages"
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface',
                    i < PARENT_GROUP_CHATS.length - 1 && 'border-b border-neutral-100/60'
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lime/40 to-emerald-400/40">
                    <MessageCircle className="h-4 w-4 text-neutral-700" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn('text-sm truncate', chat.unread > 0 ? 'font-black text-neutral-900' : 'font-bold text-neutral-700')}>
                        {chat.name}
                      </span>
                      <span className={cn('text-[11px] shrink-0 ml-2', chat.unread > 0 ? 'font-bold text-lime-dark' : 'font-medium text-neutral-400')}>
                        {chat.lastMessageAt}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className={cn('text-xs truncate pr-2', chat.unread > 0 ? 'text-neutral-600 font-medium' : 'text-neutral-400')}>
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="shrink-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-lime px-1 text-[10px] font-black text-black">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Payment Summary */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-3">Payment Summary</h2>
          <div className="rounded-[20px] bg-white border border-neutral-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-[14px] bg-surface p-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Paid</span>
                <span className="text-lg font-black text-emerald-600 font-[family-name:var(--font-mono)]">${totalPaid}</span>
              </div>
              <div className="rounded-[14px] bg-surface p-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Owed</span>
                <span className={cn('text-lg font-black font-[family-name:var(--font-mono)]', totalOwed > 0 ? 'text-red-500' : 'text-neutral-400')}>
                  ${totalOwed}
                </span>
              </div>
              <div className="rounded-[14px] bg-surface p-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Due</span>
                <span className="text-lg font-black text-neutral-700 font-[family-name:var(--font-mono)]">Mar 25</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-lime py-3 text-sm font-black text-black transition-transform active:scale-[0.98] shadow-[0_0_12px_rgba(200,255,0,0.2)]"
              >
                <DollarSign className="h-4 w-4" strokeWidth={2.5} />
                Make Payment
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-surface py-3 text-sm font-black text-neutral-700 transition-colors hover:bg-neutral-200/60"
              >
                <FileText className="h-4 w-4" strokeWidth={2} />
                View Invoices
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
