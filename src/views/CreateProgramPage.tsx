'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  Tent,
  Dumbbell,
  Stethoscope,
  Check,
  Save,
  Eye,
  CalendarDays,
  MapPin,
  DollarSign,
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProgramType, AgeGroup, SkillLevel } from '@/types/programs';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  'Program Type',
  'Details',
  'Schedule & Venue',
  'Pricing',
  'Requirements',
  'Preview & Publish',
];

const PROGRAM_TYPES: { key: ProgramType; label: string; desc: string; icon: typeof Trophy }[] = [
  { key: 'league', label: 'League', desc: 'Competitive season with standings and playoffs', icon: Trophy },
  { key: 'camp', label: 'Camp', desc: 'Multi-day intensive skill development', icon: Tent },
  { key: 'training', label: 'Training', desc: 'Focused skill sessions and drills', icon: Dumbbell },
  { key: 'clinic', label: 'Clinic', desc: 'Short-format instructional workshops', icon: Stethoscope },
];

const AGE_OPTIONS: AgeGroup[] = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'adult'];
const SKILL_OPTIONS: { key: SkillLevel; label: string }[] = [
  { key: 'recreational', label: 'Recreational' },
  { key: 'competitive', label: 'Competitive' },
  { key: 'elite', label: 'Elite' },
];
const GENDER_OPTIONS = ['male', 'female', 'co-ed'] as const;
const DAY_OPTIONS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const REQUIREMENT_OPTIONS = [
  'Valid Ontario Health Card',
  'Signed Participant Waiver',
  'Code of Conduct Agreement',
  'Medical Clearance Form',
  'Proof of Age',
  'Coach Recommendation Letter',
  'Tryout Evaluation Score',
  'Concussion Protocol Acknowledgement',
];

/* ------------------------------------------------------------------ */
/*  Form State                                                         */
/* ------------------------------------------------------------------ */

interface FormState {
  type: ProgramType | null;
  name: string;
  sport: string;
  ageGroups: AgeGroup[];
  gender: (typeof GENDER_OPTIONS)[number];
  skillLevel: SkillLevel;
  season: string;
  startDate: string;
  endDate: string;
  days: string[];
  startTime: string;
  endTime: string;
  venue: string;
  court: string;
  price: string;
  earlyBirdPrice: string;
  earlyBirdDeadline: string;
  siblingDiscount: string;
  enableTwoPart: boolean;
  enableMonthly: boolean;
  requirements: string[];
}

const INITIAL_STATE: FormState = {
  type: null,
  name: '',
  sport: 'Basketball',
  ageGroups: [],
  gender: 'co-ed',
  skillLevel: 'recreational',
  season: '',
  startDate: '',
  endDate: '',
  days: [],
  startTime: '',
  endTime: '',
  venue: '',
  court: '',
  price: '',
  earlyBirdPrice: '',
  earlyBirdDeadline: '',
  siblingDiscount: '',
  enableTwoPart: false,
  enableMonthly: false,
  requirements: [],
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export const CreateProgramPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);

  const updateField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]): void => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toggleArrayItem = useCallback(
    <K extends keyof FormState>(key: K, item: string): void => {
      setForm((prev) => {
        const arr = prev[key] as string[];
        const next = arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];
        return { ...prev, [key]: next };
      });
    },
    []
  );

  const nextStep = (): void => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = (): void => setStep((s) => Math.max(s - 1, 1));

  /* Determine if current step is valid enough to proceed */
  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return form.type !== null;
      case 2:
        return form.name.trim().length > 0 && form.ageGroups.length > 0;
      case 3:
        return form.days.length > 0 && form.venue.trim().length > 0;
      case 4:
        return form.price.trim().length > 0;
      case 5:
        return form.requirements.length > 0;
      default:
        return true;
    }
  };

  const formatPrice = (val: string): string => {
    const num = parseFloat(val);
    return isNaN(num) ? '$0' : `$${num.toLocaleString()}`;
  };

  /* ---------------------------------------------------------------- */
  /*  Step Renderers                                                    */
  /* ---------------------------------------------------------------- */

  const renderStep1 = (): React.ReactNode => (
    <div className="space-y-3">
      <p className="text-sm text-neutral-500 mb-4">
        What type of program are you creating?
      </p>
      {PROGRAM_TYPES.map((pt) => {
        const Icon = pt.icon;
        const isSelected = form.type === pt.key;
        return (
          <button
            key={pt.key}
            type="button"
            onClick={() => updateField('type', pt.key)}
            className={cn(
              'w-full rounded-[20px] border p-4 text-left transition-all',
              isSelected
                ? 'border-[#C8FF00] bg-[#C8FF00]/5 shadow-sm'
                : 'border-neutral-200/60 hover:border-neutral-300'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl',
                  isSelected ? 'bg-[#C8FF00]/20' : 'bg-neutral-100'
                )}
              >
                <Icon
                  className={cn(
                    'h-6 w-6',
                    isSelected ? 'text-black' : 'text-neutral-400'
                  )}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-neutral-900">{pt.label}</p>
                <p className="text-[11px] text-neutral-400">{pt.desc}</p>
              </div>
              {isSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C8FF00]">
                  <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderStep2 = (): React.ReactNode => (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          Program Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="e.g. Spring Basketball U12"
          className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
        />
      </div>

      {/* Sport */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          Sport
        </label>
        <input
          type="text"
          value={form.sport}
          onChange={(e) => updateField('sport', e.target.value)}
          className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
        />
      </div>

      {/* Age Groups */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          Age Groups
        </label>
        <div className="flex flex-wrap gap-2">
          {AGE_OPTIONS.map((age) => (
            <button
              key={age}
              type="button"
              onClick={() => toggleArrayItem('ageGroups', age)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all',
                form.ageGroups.includes(age)
                  ? 'bg-[#C8FF00] text-black'
                  : 'bg-neutral-100 text-neutral-400'
              )}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          Gender
        </label>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => updateField('gender', g)}
              className={cn(
                'rounded-full px-4 py-1.5 text-[11px] font-bold capitalize transition-all',
                form.gender === g
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-400'
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Level */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          Skill Level
        </label>
        <div className="flex gap-2">
          {SKILL_OPTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => updateField('skillLevel', s.key)}
              className={cn(
                'rounded-full px-4 py-1.5 text-[11px] font-bold transition-all',
                form.skillLevel === s.key
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-400'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Season & Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
            Season
          </label>
          <input
            type="text"
            value={form.season}
            onChange={(e) => updateField('season', e.target.value)}
            placeholder="e.g. Spring 2026"
            className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
            Start Date
          </label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          End Date
        </label>
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => updateField('endDate', e.target.value)}
          className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
        />
      </div>
    </div>
  );

  const renderStep3 = (): React.ReactNode => (
    <div className="space-y-4">
      {/* Days */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          Days
        </label>
        <div className="flex flex-wrap gap-2">
          {DAY_OPTIONS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleArrayItem('days', day)}
              className={cn(
                'rounded-full px-3 py-1.5 text-[11px] font-bold transition-all',
                form.days.includes(day)
                  ? 'bg-[#C8FF00] text-black'
                  : 'bg-neutral-100 text-neutral-400'
              )}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
            Start Time
          </label>
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => updateField('startTime', e.target.value)}
            className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
            End Time
          </label>
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => updateField('endTime', e.target.value)}
            className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
          />
        </div>
      </div>

      {/* Venue */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          Venue
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
          <input
            type="text"
            value={form.venue}
            onChange={(e) => updateField('venue', e.target.value)}
            placeholder="e.g. Pan Am Sports Centre"
            className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 pl-10 pr-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
          />
        </div>
      </div>

      {/* Court */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          Court / Room
        </label>
        <input
          type="text"
          value={form.court}
          onChange={(e) => updateField('court', e.target.value)}
          placeholder="e.g. Court A"
          className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
        />
      </div>
    </div>
  );

  const renderStep4 = (): React.ReactNode => (
    <div className="space-y-4">
      {/* Price */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          Program Fee
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
          <input
            type="number"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="450"
            className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 pl-10 pr-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
          />
        </div>
      </div>

      {/* Early Bird */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
            Early Bird Price
          </label>
          <input
            type="number"
            value={form.earlyBirdPrice}
            onChange={(e) => updateField('earlyBirdPrice', e.target.value)}
            placeholder="375"
            className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
            EB Deadline
          </label>
          <input
            type="date"
            value={form.earlyBirdDeadline}
            onChange={(e) => updateField('earlyBirdDeadline', e.target.value)}
            className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
          />
        </div>
      </div>

      {/* Sibling Discount */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
          Sibling Discount (%)
        </label>
        <input
          type="number"
          value={form.siblingDiscount}
          onChange={(e) => updateField('siblingDiscount', e.target.value)}
          placeholder="10"
          className="w-full rounded-xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:border-[#C8FF00]/50 focus:bg-white"
        />
      </div>

      {/* Payment Plans */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
          Payment Plans
        </label>
        <p className="text-[10px] text-neutral-400 mb-2">
          Full payment is always available. Enable additional plans:
        </p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => updateField('enableTwoPart', !form.enableTwoPart)}
            className={cn(
              'w-full flex items-center gap-3 rounded-xl border p-3 transition-all',
              form.enableTwoPart
                ? 'border-[#C8FF00] bg-[#C8FF00]/5'
                : 'border-neutral-200/60'
            )}
          >
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
                form.enableTwoPart
                  ? 'border-[#C8FF00] bg-[#C8FF00]'
                  : 'border-neutral-200'
              )}
            >
              {form.enableTwoPart && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
            </div>
            <span className="text-sm font-medium text-neutral-700">2-Part Payment</span>
          </button>
          <button
            type="button"
            onClick={() => updateField('enableMonthly', !form.enableMonthly)}
            className={cn(
              'w-full flex items-center gap-3 rounded-xl border p-3 transition-all',
              form.enableMonthly
                ? 'border-[#C8FF00] bg-[#C8FF00]/5'
                : 'border-neutral-200/60'
            )}
          >
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
                form.enableMonthly
                  ? 'border-[#C8FF00] bg-[#C8FF00]'
                  : 'border-neutral-200'
              )}
            >
              {form.enableMonthly && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
            </div>
            <span className="text-sm font-medium text-neutral-700">Monthly Installments</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep5 = (): React.ReactNode => (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500 mb-2">
        Select the requirements participants must meet:
      </p>
      <div className="space-y-2">
        {REQUIREMENT_OPTIONS.map((req) => (
          <button
            key={req}
            type="button"
            onClick={() => toggleArrayItem('requirements', req)}
            className={cn(
              'w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
              form.requirements.includes(req)
                ? 'border-[#C8FF00] bg-[#C8FF00]/5'
                : 'border-neutral-200/60'
            )}
          >
            <div
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                form.requirements.includes(req)
                  ? 'border-[#C8FF00] bg-[#C8FF00]'
                  : 'border-neutral-200'
              )}
            >
              {form.requirements.includes(req) && (
                <Check className="h-3 w-3 text-black" strokeWidth={3} />
              )}
            </div>
            <span className="text-sm text-neutral-700">{req}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep6 = (): React.ReactNode => (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-neutral-200/60 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Eye className="h-4 w-4 text-neutral-400" />
          <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">
            Preview
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Type</span>
            <span className="text-[11px] font-bold text-neutral-700 capitalize">{form.type ?? 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Name</span>
            <span className="text-[11px] font-bold text-neutral-700">{form.name || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Sport</span>
            <span className="text-[11px] font-bold text-neutral-700">{form.sport}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Age Groups</span>
            <span className="text-[11px] font-bold text-neutral-700">
              {form.ageGroups.length > 0 ? form.ageGroups.join(', ') : 'None'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Gender</span>
            <span className="text-[11px] font-bold text-neutral-700 capitalize">{form.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Skill</span>
            <span className="text-[11px] font-bold text-neutral-700 capitalize">{form.skillLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Season</span>
            <span className="text-[11px] font-bold text-neutral-700">{form.season || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Dates</span>
            <span className="text-[11px] font-bold text-neutral-700">
              {form.startDate && form.endDate ? `${form.startDate} to ${form.endDate}` : 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Schedule</span>
            <span className="text-[11px] font-bold text-neutral-700">
              {form.days.length > 0 ? form.days.map((d) => d.slice(0, 3)).join(', ') : 'Not set'}
              {form.startTime && form.endTime ? ` ${form.startTime}-${form.endTime}` : ''}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Venue</span>
            <span className="text-[11px] font-bold text-neutral-700">{form.venue || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Price</span>
            <span className="text-[11px] font-bold text-neutral-700 font-mono">
              {form.price ? formatPrice(form.price) : 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-neutral-400">Requirements</span>
            <span className="text-[11px] font-bold text-neutral-700">
              {form.requirements.length} selected
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          className="w-full rounded-2xl bg-[#C8FF00] py-4 text-center text-sm font-black text-black uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Publish Program
        </button>
        <button
          type="button"
          className="w-full rounded-2xl border border-neutral-200/60 py-3 text-center text-xs font-bold text-neutral-400 transition-colors hover:text-neutral-600"
        >
          <Save className="inline h-3.5 w-3.5 mr-1.5" />
          Save as Draft
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = (): React.ReactNode => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return null;
    }
  };

  /* Step icons for progress bar */
  const STEP_ICONS = [Trophy, CalendarDays, MapPin, DollarSign, ClipboardCheck, Eye];

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              >
                <ArrowLeft className="h-4 w-4 text-neutral-500" />
              </button>
              <div>
                <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                  Create Program
                </h1>
                <p className="text-[10px] font-mono text-neutral-400">
                  Step {step} of {TOTAL_STEPS} &mdash; {STEP_LABELS[step - 1]}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-all',
                  i < step ? 'bg-[#C8FF00]' : 'bg-neutral-100'
                )}
              />
            ))}
          </div>

          {/* Step icons */}
          <div className="flex justify-between mt-2">
            {STEP_ICONS.map((Icon, i) => (
              <button
                key={i}
                type="button"
                onClick={() => i + 1 <= step && setStep(i + 1)}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                  i + 1 === step
                    ? 'bg-[#C8FF00]/20 text-black'
                    : i + 1 < step
                      ? 'text-neutral-400 hover:text-neutral-600'
                      : 'text-neutral-200'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Step Content */}
      <div className="px-4 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {step < TOTAL_STEPS && (
        <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-2xl border border-neutral-200/60 py-3.5 text-center text-xs font-bold text-neutral-500 transition-colors hover:bg-neutral-50"
              >
                <ArrowLeft className="inline h-3.5 w-3.5 mr-1" />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className={cn(
                'flex-1 rounded-2xl py-3.5 text-center text-xs font-black uppercase tracking-widest transition-all',
                canProceed()
                  ? 'bg-[#C8FF00] text-black hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
              )}
            >
              Next
              <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
