'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  Phone,
  Dribbble,
  CircleDot,
  Swords,
  Trophy,
  Target,
  Dumbbell,
  Check,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { CelebrationScreen } from '@/components/onboarding/CelebrationScreen';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const STEP_LABELS = ['Details', 'Sports', 'Program', 'Done'] as const;

const ORG_TYPES = [
  { id: 'league', label: 'League', description: 'Organize competitive seasons' },
  { id: 'club', label: 'Club', description: 'Community sports club' },
  { id: 'academy', label: 'Academy', description: 'Training and development' },
  { id: 'recreation', label: 'Recreation Centre', description: 'Multi-sport facility' },
  { id: 'school', label: 'School', description: 'School athletics program' },
] as const;

const SPORT_OPTIONS = [
  { id: 'basketball', label: 'Basketball', icon: Dribbble },
  { id: 'soccer', label: 'Soccer', icon: CircleDot },
  { id: 'hockey', label: 'Hockey', icon: Swords },
  { id: 'football', label: 'Football', icon: Trophy },
  { id: 'baseball', label: 'Baseball', icon: Target },
  { id: 'track', label: 'Track & Field', icon: Dumbbell },
] as const;

const AGE_GROUPS = [
  'U6', 'U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'Adult', 'All Ages',
] as const;

export default function OrganizationOnboardingPage(): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  /* Step 1: Org details */
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<string | null>(null);
  const [orgLocation, setOrgLocation] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  /* Step 2: Sports & ages */
  const [selectedSports, setSelectedSports] = useState<Set<string>>(new Set());
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<Set<string>>(new Set());

  /* Step 3: First program */
  const [programName, setProgramName] = useState('');
  const [programSport, setProgramSport] = useState('');
  const [programSchedule, setProgramSchedule] = useState('');
  const [programPrice, setProgramPrice] = useState('');
  const [programCapacity, setProgramCapacity] = useState('');

  const toggleSport = useCallback((id: string): void => {
    setSelectedSports((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAgeGroup = useCallback((ag: string): void => {
    setSelectedAgeGroups((prev) => {
      const next = new Set(prev);
      if (next.has(ag)) next.delete(ag);
      else next.add(ag);
      return next;
    });
  }, []);

  const goNext = useCallback((): void => {
    if (step < 4) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step]);

  const goBack = useCallback((): void => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleFinish = useCallback((): void => {
    router.push('/');
  }, [router]);

  const canProceedStep1 =
    orgName.trim().length > 0 &&
    orgType !== null &&
    orgEmail.trim().length > 0 &&
    orgPassword.length >= 8;

  const canProceedStep2 = selectedSports.size > 0;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-void">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-lime/[0.04] blur-[180px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-8">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime shadow-[0_2px_12px_rgba(200,255,0,0.2)]">
                <Zap className="h-4.5 w-4.5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-neutral-900">Ball in the 6</span>
            </div>
            <Link href="/get-started" className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600">
              Cancel
            </Link>
          </div>
          <div className="mt-6">
            <StepIndicator steps={[...STEP_LABELS]} currentStep={step} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pt-8 pb-32">
        <div className="mx-auto w-full max-w-lg flex-1">
          <AnimatePresence mode="wait" custom={direction}>
            {/* ===== STEP 1: Org details ===== */}
            {step === 1 && (
              <motion.div
                key="org-1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-yellow-50">
                    <Building2 className="h-5 w-5 text-yellow-600" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Organization details
                  </h2>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Tell us about your organization so teams and players can find you.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="org-name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Organization name
                    </label>
                    <input
                      id="org-name"
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder='e.g. "GTA Basketball League"'
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  {/* Org type */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Type</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {ORG_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setOrgType(type.id)}
                          className={cn(
                            'flex flex-col items-start rounded-[14px] border-2 p-3 text-left transition-all duration-200',
                            orgType === type.id
                              ? 'border-lime bg-lime/10'
                              : 'border-black/[0.06] bg-white hover:border-black/[0.12]',
                          )}
                        >
                          <span className={cn('text-xs font-bold', orgType === type.id ? 'text-neutral-900' : 'text-neutral-700')}>
                            {type.label}
                          </span>
                          <span className="mt-0.5 text-[10px] text-neutral-400">{type.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="org-location" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      <MapPin className="mr-1 inline h-3 w-3" strokeWidth={2} />
                      Location
                      <span className="ml-1 normal-case text-neutral-300">(optional)</span>
                    </label>
                    <input
                      id="org-location"
                      type="text"
                      value={orgLocation}
                      onChange={(e) => setOrgLocation(e.target.value)}
                      placeholder="City or neighbourhood"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="org-phone" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      <Phone className="mr-1 inline h-3 w-3" strokeWidth={2} />
                      Contact phone
                      <span className="ml-1 normal-case text-neutral-300">(optional)</span>
                    </label>
                    <input
                      id="org-phone"
                      type="tel"
                      value={orgPhone}
                      onChange={(e) => setOrgPhone(e.target.value)}
                      placeholder="(416) 555-0123"
                      autoComplete="tel"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="org-email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Admin email
                    </label>
                    <input
                      id="org-email"
                      type="email"
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      placeholder="admin@yourorg.com"
                      autoComplete="email"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="org-password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="org-password"
                        type={showPassword ? 'text' : 'password'}
                        value={orgPassword}
                        onChange={(e) => setOrgPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        minLength={8}
                        className={cn(
                          'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 pr-12 text-sm text-neutral-900',
                          'placeholder:text-neutral-400 outline-none transition-all duration-200',
                          'focus:border-lime focus:ring-2 focus:ring-lime/20',
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 transition-colors hover:text-neutral-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 2: Sports & Age Groups ===== */}
            {step === 2 && (
              <motion.div
                key="org-2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  What programs do you run?
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Select the sports and age groups your organization serves.
                </p>

                {/* Sports grid */}
                <div className="mt-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Sports offered
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {SPORT_OPTIONS.map((sport) => {
                      const Icon = sport.icon;
                      const active = selectedSports.has(sport.id);
                      return (
                        <button
                          key={sport.id}
                          type="button"
                          onClick={() => toggleSport(sport.id)}
                          className={cn(
                            'flex flex-col items-center gap-2 rounded-[14px] border-2 p-3 transition-all duration-200',
                            active
                              ? 'border-lime bg-lime/10 shadow-[0_0_16px_rgba(200,255,0,0.15)]'
                              : 'border-black/[0.06] bg-white hover:border-black/[0.12]',
                          )}
                        >
                          <Icon className={cn('h-5 w-5', active ? 'text-neutral-900' : 'text-neutral-400')} strokeWidth={2} />
                          <span className={cn('text-[10px] font-semibold', active ? 'text-neutral-900' : 'text-neutral-500')}>
                            {sport.label}
                          </span>
                          {active && (
                            <Check className="h-3 w-3 text-neutral-900" strokeWidth={3} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Age groups */}
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Age groups served
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {AGE_GROUPS.map((ag) => (
                      <button
                        key={ag}
                        type="button"
                        onClick={() => toggleAgeGroup(ag)}
                        className={cn(
                          'rounded-full border-2 px-4 py-2 text-xs font-semibold transition-all duration-200',
                          selectedAgeGroups.has(ag)
                            ? 'border-lime bg-lime/10 text-neutral-900'
                            : 'border-black/[0.06] bg-white text-neutral-500 hover:border-black/[0.12]',
                        )}
                      >
                        {selectedAgeGroups.has(ag) && <Check className="mr-1 inline h-3 w-3" strokeWidth={2.5} />}
                        {ag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 3: First Program ===== */}
            {step === 3 && (
              <motion.div
                key="org-3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-lime/15">
                    <Plus className="h-5 w-5 text-neutral-800" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Add your first program
                  </h2>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Quick setup — you can edit all the details later.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="program-name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Program name
                    </label>
                    <input
                      id="program-name"
                      type="text"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      placeholder='e.g. "U14 Spring League"'
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="program-sport" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Sport
                    </label>
                    <select
                      id="program-sport"
                      value={programSport}
                      onChange={(e) => setProgramSport(e.target.value)}
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    >
                      <option value="">Select a sport</option>
                      {Array.from(selectedSports).map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                      {selectedSports.size === 0 &&
                        SPORT_OPTIONS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="program-schedule" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Schedule
                    </label>
                    <input
                      id="program-schedule"
                      type="text"
                      value={programSchedule}
                      onChange={(e) => setProgramSchedule(e.target.value)}
                      placeholder='e.g. "Mon/Wed 6-8 PM"'
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label htmlFor="program-price" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Price ($)
                      </label>
                      <input
                        id="program-price"
                        type="number"
                        value={programPrice}
                        onChange={(e) => setProgramPrice(e.target.value)}
                        placeholder="0"
                        min={0}
                        className={cn(
                          'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                          'placeholder:text-neutral-400 outline-none transition-all duration-200',
                          'focus:border-lime focus:ring-2 focus:ring-lime/20',
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="program-capacity" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Max spots
                      </label>
                      <input
                        id="program-capacity"
                        type="number"
                        value={programCapacity}
                        onChange={(e) => setProgramCapacity(e.target.value)}
                        placeholder="20"
                        min={1}
                        className={cn(
                          'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                          'placeholder:text-neutral-400 outline-none transition-all duration-200',
                          'focus:border-lime focus:ring-2 focus:ring-lime/20',
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Skip */}
                <button
                  type="button"
                  onClick={goNext}
                  className="mt-6 w-full text-center text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
                >
                  Skip — I&apos;ll add programs later
                </button>
              </motion.div>
            )}

            {/* ===== STEP 4: Done ===== */}
            {step === 4 && (
              <motion.div
                key="org-4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <CelebrationScreen
                  title="Your organization is live!"
                  subtitle="Players and parents can now find and register for your programs."
                  summaryItems={[
                    { label: 'Organization', value: orgName || 'Your Org' },
                    { label: 'Type', value: orgType ? orgType.charAt(0).toUpperCase() + orgType.slice(1) : 'N/A' },
                    { label: 'Sports', value: selectedSports.size > 0 ? `${selectedSports.size} selected` : 'None yet' },
                    ...(programName ? [{ label: 'First Program', value: programName }] : []),
                  ]}
                  primaryAction={{ label: 'Go to Org Dashboard', onClick: handleFinish }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-black/[0.04] bg-white/80 backdrop-blur-xl safe-bottom">
          <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className={cn(
                'flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200',
                step === 1
                  ? 'cursor-not-allowed text-neutral-300'
                  : 'text-neutral-600 hover:bg-neutral-100 active:scale-[0.97]',
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2)
              }
              className={cn(
                'flex items-center gap-2 rounded-2xl bg-lime px-7 py-3 text-sm font-bold text-black',
                'shadow-[0_2px_12px_rgba(200,255,0,0.25)]',
                'transition-all duration-200',
                'hover:shadow-[0_4px_20px_rgba(200,255,0,0.35)]',
                'active:scale-[0.97]',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
              )}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
