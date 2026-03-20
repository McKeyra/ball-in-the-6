'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Calendar, MessageCircle, CreditCard, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Child } from '@/types/parent';

const PAYMENT_STATUS_CONFIG = {
  current: { label: 'Paid', dotColor: 'bg-emerald-400', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  upcoming: { label: 'Due Soon', dotColor: 'bg-yellow-400', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  overdue: { label: 'Overdue', dotColor: 'bg-red-400', textColor: 'text-red-600', bgColor: 'bg-red-50' },
} as const;

const AVATAR_GRADIENTS = [
  'from-orange-500 to-red-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-cyan-500',
  'from-pink-500 to-rose-500',
] as const;

interface ChildCardProps {
  child: Child;
  index?: number;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child, index = 0 }) => {
  const program = child.programs[0];
  if (!program) return null;

  const paymentConfig = PAYMENT_STATUS_CONFIG[program.paymentStatus];
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="rounded-[20px] bg-white border border-neutral-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      {/* Header */}
      <Link href={`/parent/child/${child.id}`} className="flex items-center gap-3 group">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-black text-white',
            gradient
          )}
        >
          {child.avatar ?? child.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-neutral-900 truncate">{child.name}</span>
            <span className="text-xs font-medium text-neutral-400">Age {child.age}</span>
          </div>
          <p className="text-sm text-neutral-500 truncate">{program.teamName}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0" strokeWidth={2} />
      </Link>

      {/* Next Event Badge */}
      <div className="mt-3 flex items-center gap-2 rounded-[12px] bg-surface px-3 py-2">
        <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" strokeWidth={2} />
        <span className="text-xs font-medium text-neutral-600 truncate">
          Next: {program.nextEvent.title} &middot; {program.nextEvent.date.slice(5)} at {program.nextEvent.time}
        </span>
      </div>

      {/* Payment Status */}
      <div className="mt-2 flex items-center gap-2">
        <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1', paymentConfig.bgColor)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', paymentConfig.dotColor)} />
          <span className={cn('text-[11px] font-bold', paymentConfig.textColor)}>{paymentConfig.label}</span>
        </div>
        {program.amountDue > 0 && (
          <span className="text-[11px] font-medium text-neutral-400">
            ${program.amountDue} due
          </span>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/parent/child/${child.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-surface py-2 text-xs font-bold text-neutral-700 transition-colors hover:bg-neutral-200/60"
        >
          <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
          Schedule
        </Link>
        <Link
          href="/messages"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-surface py-2 text-xs font-bold text-neutral-700 transition-colors hover:bg-neutral-200/60"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
          Coach
        </Link>
        {program.amountDue > 0 && (
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-lime/20 py-2 text-xs font-bold text-black transition-colors hover:bg-lime/30"
          >
            <CreditCard className="h-3.5 w-3.5" strokeWidth={2} />
            Pay
          </button>
        )}
      </div>
    </motion.div>
  );
};
