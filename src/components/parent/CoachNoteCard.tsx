'use client';

import { motion } from 'motion/react';
import { MessageCircle, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CoachNote } from '@/types/parent';

const NOTE_TYPE_CONFIG = {
  praise: { label: 'Praise', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  feedback: { label: 'Feedback', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  progress: { label: 'Progress', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  concern: { label: 'Concern', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
} as const;

interface CoachNoteCardProps {
  note: CoachNote;
  index?: number;
}

export const CoachNoteCard: React.FC<CoachNoteCardProps> = ({ note, index = 0 }) => {
  const config = NOTE_TYPE_CONFIG[note.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      className="rounded-[16px] bg-white border border-neutral-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
            <MessageCircle className="h-3.5 w-3.5 text-neutral-500" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-bold text-neutral-900 block truncate">{note.coachName}</span>
            <span className="text-[11px] text-neutral-400">{note.date} &middot; {note.childName}</span>
          </div>
        </div>
        <div className={cn('flex items-center rounded-full px-2.5 py-1 border', config.bg, config.border)}>
          <span className={cn('text-[10px] font-bold uppercase tracking-wide', config.text)}>{config.label}</span>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-neutral-600 leading-relaxed">{note.content}</p>

      {/* Reply */}
      <button
        type="button"
        className="mt-3 flex items-center gap-1.5 text-xs font-bold text-neutral-400 transition-colors hover:text-neutral-600"
      >
        <Reply className="h-3.5 w-3.5" strokeWidth={2} />
        Reply
      </button>
    </motion.div>
  );
};
