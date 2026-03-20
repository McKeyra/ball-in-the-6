'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Search,
  Dribbble,
  CircleDot,
  Swords,
  Trophy,
  Target,
  Dumbbell,
  Baby,
  Calendar,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { VerificationCodeInput } from '@/components/onboarding/VerificationCodeInput';
import { TeamSearchResult, type TeamResult } from '@/components/onboarding/TeamSearchResult';
import { ProgramSearchResult, type ProgramResult } from '@/components/onboarding/ProgramSearchResult';
import { CelebrationScreen } from '@/components/onboarding/CelebrationScreen';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const STEP_LABELS = ['Account', 'Child', 'Team', 'Done'] as const;

/* ===== Mock data: Teams ===== */
const MOCK_TEAMS: TeamResult[] = [
  { id: 't1', name: 'B.M.T. Titans U14', sport: 'Basketball', coachName: 'Marcus Williams', memberCount: 14, location: 'Scarborough' },
  { id: 't2', name: 'Scarborough Elite U14', sport: 'Basketball', coachName: 'Dwayne Carter', memberCount: 12, location: 'Scarborough' },
  { id: 't3', name: 'North York Knights', sport: 'Basketball', coachName: 'James Thompson', memberCount: 15, location: 'North York' },
  { id: 't4', name: 'Etobicoke Eagles', sport: 'Basketball', coachName: 'Sarah Chen', memberCount: 13, location: 'Etobicoke' },
  { id: 't5', name: 'Downtown Dribblers', sport: 'Basketball', coachName: 'Andre Wilson', memberCount: 11, location: 'Downtown' },
  { id: 't6', name: 'Ajax FC Academy', sport: 'Soccer', coachName: 'Paulo Silva', memberCount: 18, location: 'Ajax' },
  { id: 't7', name: 'Brampton Thunder Hockey', sport: 'Hockey', coachName: 'Mike Patel', memberCount: 16, location: 'Brampton' },
  { id: 't8', name: 'Mississauga Wolves', sport: 'Football', coachName: 'David Brown', memberCount: 22, location: 'Mississauga' },
];

/* ===== Mock data: Sports ===== */
const SPORT_OPTIONS = [
  { id: 'basketball', label: 'Basketball', icon: Dribbble },
  { id: 'soccer', label: 'Soccer', icon: CircleDot },
  { id: 'hockey', label: 'Hockey', icon: Swords },
  { id: 'football', label: 'Football', icon: Trophy },
  { id: 'baseball', label: 'Baseball', icon: Target },
  { id: 'track', label: 'Track & Field', icon: Dumbbell },
] as const;

/* ===== Mock data: Neighbourhoods ===== */
const NEIGHBOURHOODS = [
  'Scarborough',
  'North York',
  'Etobicoke',
  'Downtown',
  'East York',
  'York',
  'Brampton',
  'Mississauga',
  'Ajax',
  'Pickering',
] as const;

/* ===== Mock data: Programs ===== */
const MOCK_PROGRAMS: ProgramResult[] = [
  { id: 'p1', name: 'U14 Competitive League', orgName: 'Ball in the 6', sport: 'basketball', schedule: 'Mon/Wed 6-8 PM', price: 450, spotsLeft: 3, ageGroup: 'U14', location: 'Pan Am Centre, Scarborough' },
  { id: 'p2', name: 'Summer Basketball Camp', orgName: 'Toronto Youth Athletics', sport: 'basketball', schedule: 'Mon-Fri 9 AM-3 PM', price: 550, spotsLeft: 8, ageGroup: 'Ages 8-14', location: 'Downsview Park Gym' },
  { id: 'p3', name: 'Skills Development Clinic', orgName: 'Hoop Dreams Toronto', sport: 'basketball', schedule: 'Sat 10 AM-12 PM', price: 200, spotsLeft: 12, ageGroup: 'Ages 10-16', location: "L'Amoreaux Sports Complex" },
  { id: 'p4', name: 'Soccer Academy Spring', orgName: 'GTA Soccer Club', sport: 'soccer', schedule: 'Tue/Thu 5-7 PM', price: 380, spotsLeft: 6, ageGroup: 'U12', location: 'Centennial Park, Etobicoke' },
  { id: 'p5', name: 'House League Hockey', orgName: 'North York Minor Hockey', sport: 'hockey', schedule: 'Sat/Sun 8-10 AM', price: 650, spotsLeft: 2, ageGroup: 'U13', location: 'North York Memorial Arena' },
  { id: 'p6', name: 'Junior Football Camp', orgName: 'GTA Gridiron', sport: 'football', schedule: 'Mon/Wed/Fri 4-6 PM', price: 300, spotsLeft: 15, ageGroup: 'Ages 11-15', location: 'Birchmount Stadium, Scarborough' },
];

/* ===== Gender options ===== */
const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'] as const;

/* ===== Helpers ===== */
const calculateAge = (dob: string): number | null => {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

type SubStep = '3' | '3a' | '3b';

export default function ParentOnboardingPage(): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [subStep, setSubStep] = useState<SubStep>('3');

  /* Step 1: Account fields */
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  /* Step 2: Child fields */
  const [childFirst, setChildFirst] = useState('');
  const [childLast, setChildLast] = useState('');
  const [childDob, setChildDob] = useState('');
  const [childGender, setChildGender] = useState('');

  /* Step 3A: Team search */
  const [teamQuery, setTeamQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [codeVerified, setCodeVerified] = useState(false);

  /* Step 3B: Program search */
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [registeredProgram, setRegisteredProgram] = useState<string | null>(null);

  const childAge = useMemo(() => calculateAge(childDob), [childDob]);
  const childFullName = `${childFirst} ${childLast}`.trim();

  /* Determine effective step for indicator (always 1-4) */
  const effectiveStep = step <= 2 ? step : step === 3 ? 3 : 4;

  /* Team search filter */
  const filteredTeams = useMemo(() => {
    if (!teamQuery.trim()) return [];
    const q = teamQuery.toLowerCase();
    return MOCK_TEAMS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.coachName.toLowerCase().includes(q) ||
        t.sport.toLowerCase().includes(q),
    );
  }, [teamQuery]);

  /* Program search filter */
  const filteredPrograms = useMemo(() => {
    return MOCK_PROGRAMS.filter((p) => {
      if (selectedSport && p.sport !== selectedSport) return false;
      if (selectedArea && !p.location.toLowerCase().includes(selectedArea.toLowerCase())) return false;
      return true;
    });
  }, [selectedSport, selectedArea]);

  const selectedTeamData = useMemo(
    () => MOCK_TEAMS.find((t) => t.id === selectedTeam) ?? null,
    [selectedTeam],
  );

  /* Navigation */
  const goNext = useCallback((): void => {
    setDirection(1);
    if (step === 3 && subStep === '3') return; // must pick yes/no
    if (step < 4) setStep((s) => s + 1);
  }, [step, subStep]);

  const goBack = useCallback((): void => {
    setDirection(-1);
    if (step === 3 && subStep !== '3') {
      setSubStep('3');
      return;
    }
    if (step > 1) setStep((s) => s - 1);
  }, [step, subStep]);

  const goToSubStep = useCallback(
    (sub: SubStep): void => {
      setDirection(1);
      setSubStep(sub);
    },
    [],
  );

  const handleFinish = useCallback((): void => {
    router.push('/parent');
  }, [router]);

  const handleAddAnother = useCallback((): void => {
    setStep(2);
    setDirection(-1);
    setChildFirst('');
    setChildLast('');
    setChildDob('');
    setChildGender('');
    setSubStep('3');
    setSelectedTeam(null);
    setCodeVerified(false);
    setRegisteredProgram(null);
    setTeamQuery('');
    setSelectedSport(null);
    setSelectedArea(null);
  }, []);

  /* Can proceed checks */
  const canProceedStep1 =
    parentName.trim().length > 0 &&
    parentEmail.trim().length > 0 &&
    parentPassword.length >= 8;

  const canProceedStep2 =
    childFirst.trim().length > 0 &&
    childLast.trim().length > 0 &&
    childDob.length > 0;

  const canProceedStep3A = selectedTeam !== null && codeVerified;
  const canProceedStep3B = registeredProgram !== null;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  /* Summary items for celebration screen */
  const summaryItems = useMemo(() => {
    const items = [
      { label: 'Child', value: childFullName || 'N/A' },
    ];
    if (childAge !== null) {
      items.push({ label: 'Age', value: `${childAge} years old` });
    }
    if (selectedTeamData) {
      items.push({ label: 'Team', value: selectedTeamData.name });
    }
    if (registeredProgram) {
      const prog = MOCK_PROGRAMS.find((p) => p.id === registeredProgram);
      if (prog) items.push({ label: 'Program', value: prog.name });
    }
    return items;
  }, [childFullName, childAge, selectedTeamData, registeredProgram]);

  return (
    <div className="relative flex min-h-screen flex-col bg-void">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-lime/[0.04] blur-[180px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-8">
        <div className="mx-auto max-w-lg">
          {/* Logo + Skip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime shadow-[0_2px_12px_rgba(200,255,0,0.2)]">
                <Zap className="h-4.5 w-4.5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-neutral-900">Ball in the 6</span>
            </div>
            <Link
              href="/get-started"
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
            >
              Cancel
            </Link>
          </div>

          {/* Step indicator */}
          <div className="mt-6">
            <StepIndicator steps={[...STEP_LABELS]} currentStep={effectiveStep} />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pt-8 pb-32">
        <div className="mx-auto w-full max-w-lg flex-1">
          <AnimatePresence mode="wait" custom={direction}>
            {/* ===== STEP 1: Account ===== */}
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  First, let&apos;s create your account
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  We&apos;ll use this to keep you updated about your child&apos;s games and practices.
                </p>

                <div className="mt-8 space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="parent-name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Your name
                    </label>
                    <input
                      id="parent-name"
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Full name"
                      autoComplete="name"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="parent-email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Email address
                    </label>
                    <input
                      id="parent-email"
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="parent-phone" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Phone number
                      <span className="ml-1 normal-case text-neutral-300">(optional)</span>
                    </label>
                    <input
                      id="parent-phone"
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="(416) 555-0123"
                      autoComplete="tel"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="parent-password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="parent-password"
                        type={showPassword ? 'text' : 'password'}
                        value={parentPassword}
                        onChange={(e) => setParentPassword(e.target.value)}
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

            {/* ===== STEP 2: Child ===== */}
            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-lime/15">
                    <Baby className="h-5 w-5 text-neutral-800" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                      Tell us about your child
                    </h2>
                  </div>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  You can add more children later from your dashboard.
                </p>

                <div className="mt-8 space-y-4">
                  {/* First name */}
                  <div className="space-y-2">
                    <label htmlFor="child-first" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      First name
                    </label>
                    <input
                      id="child-first"
                      type="text"
                      value={childFirst}
                      onChange={(e) => setChildFirst(e.target.value)}
                      placeholder="Child's first name"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  {/* Last name */}
                  <div className="space-y-2">
                    <label htmlFor="child-last" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Last name
                    </label>
                    <input
                      id="child-last"
                      type="text"
                      value={childLast}
                      onChange={(e) => setChildLast(e.target.value)}
                      placeholder="Child's last name"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  {/* Date of birth */}
                  <div className="space-y-2">
                    <label htmlFor="child-dob" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Date of birth
                    </label>
                    <div className="relative">
                      <input
                        id="child-dob"
                        type="date"
                        value={childDob}
                        onChange={(e) => setChildDob(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className={cn(
                          'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                          'outline-none transition-all duration-200',
                          'focus:border-lime focus:ring-2 focus:ring-lime/20',
                        )}
                      />
                    </div>
                    {childAge !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 rounded-xl bg-lime/10 px-3 py-2"
                      >
                        <Calendar className="h-3.5 w-3.5 text-neutral-600" strokeWidth={2} />
                        <span className="text-xs font-semibold text-neutral-700">
                          Your child is{' '}
                          <span className="font-bold text-neutral-900 font-[family-name:var(--font-mono)]">
                            {childAge}
                          </span>{' '}
                          years old
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Gender (optional) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Gender
                      <span className="ml-1 normal-case text-neutral-300">(optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GENDER_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setChildGender(childGender === option ? '' : option)}
                          className={cn(
                            'rounded-full border-2 px-4 py-2 text-xs font-semibold transition-all duration-200',
                            childGender === option
                              ? 'border-lime bg-lime/10 text-neutral-900'
                              : 'border-black/[0.06] bg-white text-neutral-500 hover:border-black/[0.12]',
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 3: Team/Program ===== */}
            {step === 3 && (
              <motion.div
                key={`step-3-${subStep}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                {/* Sub-step: Choice */}
                {subStep === '3' && (
                  <>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                      Does {childFirst || 'your child'} already play on a team?
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      This helps us get them set up in the right place.
                    </p>

                    <div className="mt-8 space-y-3">
                      <button
                        type="button"
                        onClick={() => goToSubStep('3a')}
                        className={cn(
                          'flex w-full items-start gap-4 rounded-[20px] border-2 border-black/[0.06] bg-white p-5 text-left',
                          'transition-all duration-200 hover:border-lime/40 hover:bg-lime/[0.03]',
                          'active:scale-[0.99]',
                        )}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-emerald-50">
                          <span className="text-xl">&#9989;</span>
                        </div>
                        <div>
                          <p className="text-base font-bold text-neutral-900">
                            Yes, they&apos;re already on a team
                          </p>
                          <p className="mt-1 text-sm text-neutral-500">
                            My child is already registered with a team or program
                          </p>
                        </div>
                        <ArrowRight className="ml-auto mt-1 h-5 w-5 shrink-0 text-neutral-300" />
                      </button>

                      <button
                        type="button"
                        onClick={() => goToSubStep('3b')}
                        className={cn(
                          'flex w-full items-start gap-4 rounded-[20px] border-2 border-black/[0.06] bg-white p-5 text-left',
                          'transition-all duration-200 hover:border-lime/40 hover:bg-lime/[0.03]',
                          'active:scale-[0.99]',
                        )}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-blue-50">
                          <Search className="h-5 w-5 text-blue-500" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-base font-bold text-neutral-900">
                            No, we&apos;re looking for programs
                          </p>
                          <p className="mt-1 text-sm text-neutral-500">
                            Help me find leagues, camps, and clinics near us
                          </p>
                        </div>
                        <ArrowRight className="ml-auto mt-1 h-5 w-5 shrink-0 text-neutral-300" />
                      </button>
                    </div>

                    {/* Skip option */}
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="mt-6 w-full text-center text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
                    >
                      Skip for now, I&apos;ll do this later
                    </button>
                  </>
                )}

                {/* Sub-step 3A: Team Search */}
                {subStep === '3a' && (
                  <>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                      Find {childFirst || 'your child'}&apos;s team
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      Search by team name, coach name, or sport.
                    </p>

                    {/* Search bar */}
                    <div className="relative mt-6">
                      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" strokeWidth={2} />
                      <input
                        type="text"
                        value={teamQuery}
                        onChange={(e) => setTeamQuery(e.target.value)}
                        placeholder="Search teams..."
                        className={cn(
                          'w-full rounded-2xl border border-black/[0.08] bg-surface py-3.5 pl-11 pr-4 text-sm text-neutral-900',
                          'placeholder:text-neutral-400 outline-none transition-all duration-200',
                          'focus:border-lime focus:ring-2 focus:ring-lime/20',
                        )}
                      />
                    </div>

                    {/* Results */}
                    {teamQuery.trim().length > 0 && (
                      <div className="mt-4 space-y-2">
                        {filteredTeams.length === 0 ? (
                          <p className="py-8 text-center text-sm text-neutral-400">
                            No teams found. Try a different search.
                          </p>
                        ) : (
                          filteredTeams.map((team, i) => (
                            <TeamSearchResult
                              key={team.id}
                              team={team}
                              isSelected={selectedTeam === team.id}
                              onSelect={setSelectedTeam}
                              index={i}
                            />
                          ))
                        )}
                      </div>
                    )}

                    {/* Selected team — verification */}
                    {selectedTeamData && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-4"
                      >
                        <div className="rounded-[20px] border border-lime/30 bg-lime/[0.05] p-4">
                          <p className="text-sm font-bold text-neutral-900">
                            Claim {childFirst || 'your child'} on {selectedTeamData.name}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            Your coach should have given you a 6-digit verification code.
                          </p>
                        </div>

                        <VerificationCodeInput
                          onValidationChange={setCodeVerified}
                        />

                        <button
                          type="button"
                          className="w-full text-center text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
                        >
                          Don&apos;t have a code? Request access from the coach
                        </button>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Sub-step 3B: Find Programs */}
                {subStep === '3b' && (
                  <>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                      Find a program for {childFirst || 'your child'}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      We&apos;ll show you what&apos;s available in your area.
                    </p>

                    {/* Sport selector */}
                    <div className="mt-6">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Sport
                      </p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {SPORT_OPTIONS.map((sport) => {
                          const Icon = sport.icon;
                          const active = selectedSport === sport.id;
                          return (
                            <button
                              key={sport.id}
                              type="button"
                              onClick={() => setSelectedSport(active ? null : sport.id)}
                              className={cn(
                                'flex flex-col items-center gap-1.5 rounded-[14px] border-2 p-3 transition-all duration-200',
                                active
                                  ? 'border-lime bg-lime/10'
                                  : 'border-black/[0.06] bg-white hover:border-black/[0.12]',
                              )}
                            >
                              <Icon className={cn('h-5 w-5', active ? 'text-neutral-900' : 'text-neutral-400')} strokeWidth={2} />
                              <span className={cn('text-[10px] font-semibold', active ? 'text-neutral-900' : 'text-neutral-500')}>
                                {sport.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Age (auto-filled) */}
                    {childAge !== null && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface px-3 py-2">
                        <Calendar className="h-3.5 w-3.5 text-neutral-400" strokeWidth={2} />
                        <span className="text-xs font-medium text-neutral-500">
                          Showing programs for age{' '}
                          <span className="font-bold text-neutral-700 font-[family-name:var(--font-mono)]">{childAge}</span>
                        </span>
                      </div>
                    )}

                    {/* Area selector */}
                    <div className="mt-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        <MapPin className="mr-1 inline h-3 w-3" strokeWidth={2} />
                        Neighbourhood
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {NEIGHBOURHOODS.map((area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => setSelectedArea(selectedArea === area ? null : area)}
                            className={cn(
                              'rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-all duration-200',
                              selectedArea === area
                                ? 'border-lime bg-lime/10 text-neutral-900'
                                : 'border-black/[0.06] bg-white text-neutral-500 hover:border-black/[0.12]',
                            )}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Results */}
                    <div className="mt-6 space-y-3">
                      {filteredPrograms.length === 0 ? (
                        <p className="py-6 text-center text-sm text-neutral-400">
                          No programs match your filters. Try broadening your search.
                        </p>
                      ) : (
                        filteredPrograms.map((program, i) => (
                          <ProgramSearchResult
                            key={program.id}
                            program={program}
                            onRegister={(id) => {
                              setRegisteredProgram(id);
                              setStep(4);
                            }}
                            index={i}
                          />
                        ))
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ===== STEP 4: Celebration ===== */}
            {step === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <CelebrationScreen
                  title="You're all set!"
                  subtitle={`Here's what we set up for ${childFirst || 'your child'}`}
                  summaryItems={summaryItems}
                  primaryAction={{ label: 'Go to Dashboard', onClick: handleFinish }}
                  secondaryAction={{ label: 'Add Another Child', onClick: handleAddAnother }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-black/[0.04] bg-white/80 backdrop-blur-xl safe-bottom">
          <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1 && subStep === '3'}
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

            {/* Step 3 has its own navigation via the cards and register buttons */}
            {step !== 3 && (
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
            )}

            {/* Step 3A proceed button */}
            {step === 3 && subStep === '3a' && canProceedStep3A && (
              <button
                type="button"
                onClick={() => setStep(4)}
                className={cn(
                  'flex items-center gap-2 rounded-2xl bg-lime px-7 py-3 text-sm font-bold text-black',
                  'shadow-[0_4px_24px_rgba(200,255,0,0.3)]',
                  'transition-all duration-200',
                  'hover:shadow-[0_8px_40px_rgba(200,255,0,0.4)]',
                  'active:scale-[0.97]',
                )}
              >
                Claim & Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
