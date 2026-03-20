'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Share2,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Tent,
  Dumbbell,
  Stethoscope,
  Star,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ALL_PROGRAMS } from '@/lib/programs-data';
import type { ProgramType, ProgramStatus, PaymentPlan } from '@/types/programs';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PROGRAM_TYPE_ICONS: Record<ProgramType, typeof Trophy> = {
  league: Trophy,
  camp: Tent,
  training: Dumbbell,
  clinic: Stethoscope,
};

const PROGRAM_TYPE_LABELS: Record<ProgramType, string> = {
  league: 'League',
  camp: 'Camp',
  training: 'Training',
  clinic: 'Clinic',
};

const STATUS_STYLES: Record<ProgramStatus, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-neutral-100', text: 'text-neutral-500', label: 'Draft' },
  open: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Open' },
  active: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Active' },
  full: { bg: 'bg-orange-50', text: 'text-orange-600', label: 'Full' },
  completed: { bg: 'bg-neutral-100', text: 'text-neutral-400', label: 'Completed' },
};

const PLAN_LABELS: Record<PaymentPlan['type'], string> = {
  full: 'Pay in Full',
  '2-part': '2-Part Payment',
  monthly: 'Monthly Installments',
};

const formatPrice = (price: number): string => `$${price.toLocaleString()}`;

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export const ProgramDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<number>(0);

  const program = useMemo(
    () => ALL_PROGRAMS.find((p) => p.id === params.id),
    [params.id]
  );

  if (!program) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-neutral-400 mb-4">Program not found</p>
          <button
            type="button"
            onClick={() => router.push('/programs')}
            className="rounded-full bg-[#C8FF00] px-5 py-2 text-xs font-black text-black uppercase tracking-wider"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  const spotsRemaining = program.spotsTotal - program.spotsFilled;
  const fillPercent = Math.round((program.spotsFilled / program.spotsTotal) * 100);
  const statusStyle = STATUS_STYLES[program.status];
  const TypeIcon = PROGRAM_TYPE_ICONS[program.type];
  const activePlan = program.paymentPlans[selectedPlan];

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 px-4 pb-6 pt-4"
      >
        {/* Nav bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <Share2 className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Program info */}
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C8FF00]/15">
            <TypeIcon className="h-7 w-7 text-[#C8FF00]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#C8FF00]">
                {PROGRAM_TYPE_LABELS[program.type]}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/60">
                {program.sport}
              </span>
            </div>
            <h1 className="text-xl font-black text-white leading-tight mb-1">
              {program.name}
            </h1>
            <p className="text-xs text-white/50">{program.orgName}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest',
              statusStyle.bg,
              statusStyle.text
            )}
          >
            {statusStyle.label}
          </span>
          <span className="text-[11px] text-white/40">
            {program.ageGroups.join(', ')} &middot; {program.gender} &middot;{' '}
            {program.skillLevel}
          </span>
        </div>
      </motion.div>

      <div className="px-4 space-y-5 mt-5">
        {/* Description */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <p className="text-sm text-neutral-600 leading-relaxed">{program.description}</p>
        </motion.section>

        {/* Schedule */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="rounded-[20px] border border-neutral-200/60 p-4"
        >
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">
            Schedule
          </h2>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-neutral-300 shrink-0" />
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  {program.schedule.days.join(', ')}
                </p>
                <p className="text-[11px] text-neutral-400">
                  {program.season} &middot; {program.startDate} to {program.endDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-neutral-300 shrink-0" />
              <p className="text-sm font-bold text-neutral-900">
                {program.schedule.startTime} - {program.schedule.endTime}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-neutral-300 shrink-0" />
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  {program.schedule.venue}
                </p>
                <p className="text-[11px] text-neutral-400">{program.schedule.court}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Pricing */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="rounded-[20px] border border-neutral-200/60 p-4"
        >
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">
            Pricing
          </h2>

          {/* Main price */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-neutral-900 font-mono">
              {formatPrice(program.price)}
            </span>
            {program.earlyBirdPrice < program.price && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                Early bird {formatPrice(program.earlyBirdPrice)} &mdash; until{' '}
                {program.earlyBirdDeadline}
              </span>
            )}
          </div>

          {program.siblingDiscount > 0 && (
            <p className="text-[11px] text-neutral-400 mb-4">
              {program.siblingDiscount}% sibling discount available
            </p>
          )}

          {/* Payment plan selector */}
          <div className="space-y-2">
            {program.paymentPlans.map((plan, idx) => (
              <button
                key={plan.type}
                type="button"
                onClick={() => setSelectedPlan(idx)}
                className={cn(
                  'w-full rounded-xl border p-3 text-left transition-all',
                  selectedPlan === idx
                    ? 'border-[#C8FF00] bg-[#C8FF00]/5'
                    : 'border-neutral-200/60 hover:border-neutral-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-neutral-900">
                      {PLAN_LABELS[plan.type]}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {plan.amounts.map(formatPrice).join(' + ')}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
                      selectedPlan === idx
                        ? 'border-[#C8FF00] bg-[#C8FF00]'
                        : 'border-neutral-200'
                    )}
                  >
                    {selectedPlan === idx && (
                      <div className="h-2 w-2 rounded-full bg-black" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected plan details */}
          {activePlan && (
            <div className="mt-3 rounded-xl bg-neutral-50 p-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                Payment Schedule
              </p>
              {activePlan.amounts.map((amount, idx) => (
                <div
                  key={activePlan.dueDates[idx]}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-xs text-neutral-600">
                    Payment {idx + 1} &mdash; Due {activePlan.dueDates[idx]}
                  </span>
                  <span className="text-xs font-bold font-mono text-neutral-900">
                    {formatPrice(amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Spots Remaining */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="rounded-[20px] border border-neutral-200/60 p-4"
        >
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">
            Availability
          </h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-neutral-900">
              {spotsRemaining} spots remaining
            </span>
            <span className="text-xs font-mono text-neutral-400">
              {program.spotsFilled}/{program.spotsTotal}
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-neutral-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPercent}%` }}
              transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
              className={cn(
                'h-full rounded-full',
                fillPercent >= 90
                  ? 'bg-orange-400'
                  : fillPercent >= 60
                    ? 'bg-[#C8FF00]'
                    : 'bg-emerald-400'
              )}
            />
          </div>
          {fillPercent >= 80 && (
            <div className="flex items-center gap-1.5 mt-2">
              <AlertCircle className="h-3 w-3 text-orange-400" />
              <p className="text-[10px] font-bold text-orange-500">Filling up fast</p>
            </div>
          )}
        </motion.section>

        {/* Requirements */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="rounded-[20px] border border-neutral-200/60 p-4"
        >
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">
            Requirements
          </h2>
          <div className="space-y-2">
            {program.requirements.map((req) => (
              <div key={req} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-neutral-700">{req}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Coaches */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="rounded-[20px] border border-neutral-200/60 p-4"
        >
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">
            Coaches
          </h2>
          <div className="space-y-2">
            {program.coaches.map((coach) => (
              <div
                key={coach}
                className="flex items-center justify-between rounded-xl bg-neutral-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-600">
                    {coach
                      .replace('Coach ', '')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <span className="text-sm font-bold text-neutral-900">{coach}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-300" />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Reviews (Placeholder) */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="rounded-[20px] border border-neutral-200/60 p-4"
        >
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">
            Reviews
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < 4 ? 'text-[#C8FF00] fill-[#C8FF00]' : 'text-neutral-200'
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-neutral-900 font-mono">4.0</span>
            <span className="text-[10px] text-neutral-400">(Coming soon)</span>
          </div>
          <div className="rounded-xl bg-neutral-50 p-6 text-center">
            <p className="text-xs text-neutral-400">
              Reviews will be available after the program begins.
            </p>
          </div>
        </motion.section>
      </div>

      {/* Fixed Register CTA */}
      {program.status === 'open' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed bottom-20 left-0 right-0 z-50 px-4"
        >
          <button
            type="button"
            className="w-full rounded-2xl bg-[#C8FF00] py-4 text-center text-sm font-black text-black uppercase tracking-widest shadow-lg shadow-[#C8FF00]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Register Now &mdash; {formatPrice(program.earlyBirdPrice < program.price ? program.earlyBirdPrice : program.price)}
          </button>
        </motion.div>
      )}
    </div>
  );
};
