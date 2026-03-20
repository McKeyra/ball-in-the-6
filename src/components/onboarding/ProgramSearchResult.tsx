'use client';

import { motion } from 'motion/react';
import { Clock, DollarSign, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProgramResult {
  id: string;
  name: string;
  orgName: string;
  sport: string;
  schedule: string;
  price: number;
  spotsLeft: number;
  ageGroup: string;
  location: string;
}

interface ProgramSearchResultProps {
  program: ProgramResult;
  onRegister: (id: string) => void;
  index?: number;
}

export const ProgramSearchResult: React.FC<ProgramSearchResultProps> = ({
  program,
  onRegister,
  index = 0,
}) => {
  const spotsUrgent = program.spotsLeft <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="rounded-[20px] border-2 border-black/[0.06] bg-white p-4 transition-all duration-200 hover:border-black/[0.12]"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-neutral-900 truncate">{program.name}</p>
          <p className="mt-0.5 text-xs text-neutral-500">{program.orgName}</p>
        </div>
        <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold text-neutral-500">
          {program.ageGroup}
        </span>
      </div>

      {/* Details */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1 text-xs font-medium text-neutral-500">
          <Clock className="h-3.5 w-3.5" strokeWidth={2} />
          {program.schedule}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-neutral-500">
          <DollarSign className="h-3.5 w-3.5" strokeWidth={2} />
          ${program.price}
        </span>
        <span
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            spotsUrgent ? 'text-red-500' : 'text-neutral-500',
          )}
        >
          <Users className="h-3.5 w-3.5" strokeWidth={2} />
          {program.spotsLeft} spots left
        </span>
      </div>

      {/* Location */}
      <p className="mt-2 text-xs text-neutral-400">{program.location}</p>

      {/* Register button */}
      <button
        type="button"
        onClick={() => onRegister(program.id)}
        className={cn(
          'mt-3 w-full rounded-[14px] bg-lime py-2.5 text-sm font-bold text-black',
          'shadow-[0_2px_12px_rgba(200,255,0,0.2)]',
          'transition-all duration-200',
          'hover:shadow-[0_4px_20px_rgba(200,255,0,0.35)]',
          'active:scale-[0.98]',
        )}
      >
        Register
      </button>
    </motion.div>
  );
};
