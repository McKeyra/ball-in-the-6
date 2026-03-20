'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  CalendarDays,
  ArrowUpDown,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Trophy,
  Tent,
  Dumbbell,
  Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ALL_PROGRAMS } from '@/lib/programs-data';
import Link from 'next/link';
import type { ProgramType, AgeGroup, ProgramStatus } from '@/types/programs';

/* ------------------------------------------------------------------ */
/*  Filter & Sort Types                                                */
/* ------------------------------------------------------------------ */

type TypeFilter = 'all' | ProgramType;
type AgeFilter = 'all' | AgeGroup;
type SortOption = 'date' | 'price' | 'popularity';

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'league', label: 'League' },
  { key: 'camp', label: 'Camp' },
  { key: 'training', label: 'Training' },
  { key: 'clinic', label: 'Clinic' },
];

const AGE_FILTERS: { key: AgeFilter; label: string }[] = [
  { key: 'all', label: 'All Ages' },
  { key: 'U8', label: 'U8' },
  { key: 'U10', label: 'U10' },
  { key: 'U12', label: 'U12' },
  { key: 'U14', label: 'U14' },
  { key: 'U16', label: 'U16' },
  { key: 'U18', label: 'U18' },
  { key: 'adult', label: 'Adult' },
];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'date', label: 'Date' },
  { key: 'price', label: 'Price' },
  { key: 'popularity', label: 'Popular' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const PROGRAM_TYPE_ICONS: Record<ProgramType, typeof Trophy> = {
  league: Trophy,
  camp: Tent,
  training: Dumbbell,
  clinic: Stethoscope,
};

const STATUS_STYLES: Record<ProgramStatus, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-neutral-100', text: 'text-neutral-500', label: 'Draft' },
  open: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Open' },
  active: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Active' },
  full: { bg: 'bg-orange-50', text: 'text-orange-600', label: 'Full' },
  completed: { bg: 'bg-neutral-100', text: 'text-neutral-400', label: 'Completed' },
};

const formatPrice = (price: number): string => `$${price.toLocaleString()}`;

/* ------------------------------------------------------------------ */
/*  Program Card                                                       */
/* ------------------------------------------------------------------ */

const ProgramCard: React.FC<{ program: (typeof ALL_PROGRAMS)[number]; index: number }> = ({
  program,
  index,
}) => {
  const spotsRemaining = program.spotsTotal - program.spotsFilled;
  const fillPercent = Math.round((program.spotsFilled / program.spotsTotal) * 100);
  const statusStyle = STATUS_STYLES[program.status];
  const TypeIcon = PROGRAM_TYPE_ICONS[program.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/programs/${program.id}`} className="block">
        <div className="rounded-[20px] border border-neutral-200/60 bg-white p-4 transition-all hover:border-[#C8FF00]/40 hover:shadow-lg hover:shadow-[#C8FF00]/5">
          {/* Top row: type icon + status badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8FF00]/10">
                <TypeIcon className="h-5 w-5 text-neutral-700" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                  {program.name}
                </h3>
                <p className="text-[11px] text-neutral-400">{program.orgName}</p>
              </div>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest',
                statusStyle.bg,
                statusStyle.text
              )}
            >
              {statusStyle.label}
            </span>
          </div>

          {/* Info pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-50 px-2 py-1 text-[10px] font-medium text-neutral-500">
              <CalendarDays className="h-3 w-3" />
              {program.season}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-50 px-2 py-1 text-[10px] font-medium text-neutral-500">
              <Users className="h-3 w-3" />
              {program.ageGroups.join(', ')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-50 px-2 py-1 text-[10px] font-medium text-neutral-500">
              <MapPin className="h-3 w-3" />
              {program.schedule.venue}
            </span>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-3">
            <Clock className="h-3 w-3 text-neutral-300" />
            <span>
              {program.schedule.days.join(', ')} &middot; {program.schedule.startTime} -{' '}
              {program.schedule.endTime}
            </span>
          </div>

          {/* Price + spots row */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-neutral-900 font-mono">
                  {formatPrice(program.price)}
                </span>
                {program.earlyBirdPrice < program.price && (
                  <span className="text-[10px] font-bold text-emerald-500">
                    Early bird {formatPrice(program.earlyBirdPrice)}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                {program.paymentPlans.length} payment plan{program.paymentPlans.length > 1 ? 's' : ''} available
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-mono text-neutral-400">
                {spotsRemaining} / {program.spotsTotal} spots
              </p>
              <div className="mt-1 h-1.5 w-24 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    fillPercent >= 90
                      ? 'bg-orange-400'
                      : fillPercent >= 60
                        ? 'bg-[#C8FF00]'
                        : 'bg-emerald-400'
                  )}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Register CTA for open programs */}
          {program.status === 'open' && (
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8FF00] px-4 py-1.5 text-[11px] font-black text-black uppercase tracking-wider">
                Register Now
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export const ProgramsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const filtered = useMemo(() => {
    let result = [...ALL_PROGRAMS];

    /* Search */
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.orgName.toLowerCase().includes(q) ||
          p.sport.toLowerCase().includes(q) ||
          p.schedule.venue.toLowerCase().includes(q)
      );
    }

    /* Type filter */
    if (typeFilter !== 'all') {
      result = result.filter((p) => p.type === typeFilter);
    }

    /* Age filter */
    if (ageFilter !== 'all') {
      result = result.filter((p) => p.ageGroups.includes(ageFilter));
    }

    /* Sort */
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'price':
          return a.price - b.price;
        case 'popularity':
          return b.spotsFilled - a.spotsFilled;
        default:
          return 0;
      }
    });

    return result;
  }, [search, typeFilter, ageFilter, sortBy]);

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="px-4 pt-4 pb-3">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-neutral-500"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-black text-neutral-900 tracking-tight">Programs</h1>
                <p className="text-[10px] font-mono text-neutral-400">
                  {ALL_PROGRAMS.length} programs available
                </p>
              </div>
            </div>
            <Link
              href="/programs/create"
              className="flex h-8 items-center gap-1.5 rounded-full bg-[#C8FF00] px-3.5 text-[11px] font-black text-black uppercase tracking-wider transition-colors hover:bg-[#C8FF00]/80"
            >
              <DollarSign className="h-3.5 w-3.5" />
              Create
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search programs, venues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C8FF00]/50 focus:bg-white"
            />
          </div>

          {/* Type filter pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setTypeFilter(f.key)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all',
                  typeFilter === f.key
                    ? 'bg-[#C8FF00] text-black'
                    : 'bg-neutral-100/60 text-neutral-400 hover:text-neutral-600'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Age filter pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
            {AGE_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setAgeFilter(f.key)}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-[10px] font-bold transition-all',
                  ageFilter === f.key
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-50 text-neutral-400 hover:text-neutral-600'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3 w-3 text-neutral-300" />
            <div className="flex gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSortBy(opt.key)}
                  className={cn(
                    'rounded-lg px-3 py-1 text-[10px] font-bold transition-all',
                    sortBy === opt.key
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-300 hover:text-neutral-500'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Program Cards */}
      <div className="px-4 pt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((program, i) => (
              <ProgramCard key={program.id} program={program} index={i} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-16 text-center"
            >
              <p className="text-sm text-neutral-400">No programs match your filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
