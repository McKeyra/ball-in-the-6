'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  Check,
  Dribbble,
  Trophy,
  Heart,
  Dumbbell,
  Waves,
  Target,
  Medal,
  Bike,
  Mountain,
  Swords,
  CircleDot,
  Flame,
  User,
  Shield,
  ClipboardList,
  Building2,
  Briefcase,
  BarChart3,
  TrendingUp,
  BookOpen,
  Baby,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const TOTAL_STEPS = 4;

/* ===== STEP 1: Sports ===== */
const SPORTS = [
  { id: 'basketball', label: 'Basketball', icon: Dribbble },
  { id: 'soccer', label: 'Soccer', icon: CircleDot },
  { id: 'hockey', label: 'Hockey', icon: Swords },
  { id: 'football', label: 'Football', icon: Trophy },
  { id: 'baseball', label: 'Baseball', icon: Target },
  { id: 'tennis', label: 'Tennis', icon: Medal },
  { id: 'volleyball', label: 'Volleyball', icon: Flame },
  { id: 'track', label: 'Track & Field', icon: Dumbbell },
  { id: 'swimming', label: 'Swimming', icon: Waves },
  { id: 'cricket', label: 'Cricket', icon: Shield },
  { id: 'cycling', label: 'Cycling', icon: Bike },
  { id: 'mma', label: 'MMA', icon: Mountain },
  { id: 'lacrosse', label: 'Lacrosse', icon: Heart },
  { id: 'rugby', label: 'Rugby', icon: Trophy },
  { id: 'esports', label: 'Esports', icon: Target },
  { id: 'skateboarding', label: 'Skateboarding', icon: Flame },
] as const;

/* ===== STEP 2: Roles ===== */
const ROLES = [
  {
    id: 'fan',
    label: 'Fan',
    description: 'Follow your favourite teams and players',
    icon: Heart,
  },
  {
    id: 'player',
    label: 'Player',
    description: 'Track your stats and find games',
    icon: User,
  },
  {
    id: 'coach',
    label: 'Coach',
    description: 'Manage rosters and game strategies',
    icon: ClipboardList,
  },
  {
    id: 'team',
    label: 'Team',
    description: 'Organize your team and schedule',
    icon: Shield,
  },
  {
    id: 'organization',
    label: 'Organization',
    description: 'Run leagues, events, and programs',
    icon: Building2,
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Promote your sports business or venue',
    icon: Briefcase,
  },
] as const;

/* ===== STEP 3: Teams ===== */
const TORONTO_TEAMS = [
  { id: 'raptors', label: 'Toronto Raptors', sport: 'NBA' },
  { id: 'tfc', label: 'Toronto FC', sport: 'MLS' },
  { id: 'maple-leafs', label: 'Toronto Maple Leafs', sport: 'NHL' },
  { id: 'blue-jays', label: 'Toronto Blue Jays', sport: 'MLB' },
  { id: 'argonauts', label: 'Toronto Argonauts', sport: 'CFL' },
  { id: 'tfc-ii', label: 'Toronto FC II', sport: 'MLS NEXT Pro' },
  { id: 'raptors-905', label: 'Raptors 905', sport: 'G League' },
  { id: 'toronto-marlies', label: 'Toronto Marlies', sport: 'AHL' },
  { id: 'york-united', label: 'York United FC', sport: 'CPL' },
  { id: 'toronto-rock', label: 'Toronto Rock', sport: 'NLL' },
  { id: 'toronto-wolfpack', label: 'Toronto Wolfpack', sport: 'RFL' },
  { id: 'toronto-six', label: 'Toronto Six', sport: 'PHF' },
] as const;

/* ===== STEP 4: Preferences ===== */
const PREFERENCES = [
  {
    id: 'scores',
    label: 'Show scores',
    description: 'Live scores and game results in your feed',
    icon: BarChart3,
  },
  {
    id: 'betting',
    label: 'Show betting intel',
    description: 'Odds, predictions, and prop analysis',
    icon: TrendingUp,
  },
  {
    id: 'coaching',
    label: 'Show coaching insights',
    description: 'Strategy breakdowns and play analysis',
    icon: BookOpen,
  },
  {
    id: 'youth',
    label: 'Show youth content',
    description: 'Youth leagues, development programs, and camps',
    icon: Baby,
  },
] as const;

export default function OnboardingPage(): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [selectedSports, setSelectedSports] = useState<Set<string>>(new Set());
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    scores: true,
    betting: false,
    coaching: false,
    youth: false,
  });

  const toggleSport = useCallback((id: string): void => {
    setSelectedSports((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleTeam = useCallback((id: string): void => {
    setSelectedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const togglePreference = useCallback((id: string): void => {
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const goNext = useCallback((): void => {
    if (step < TOTAL_STEPS) {
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

  const handleSkip = useCallback((): void => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      router.push('/');
    }
  }, [step, router]);

  const progressPercent = (step / TOTAL_STEPS) * 100;

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

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
              <span className="text-sm font-bold text-neutral-900">
                Ball in the 6
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
            >
              Skip
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
            <motion.div
              className="h-full rounded-full bg-lime"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            />
          </div>

          {/* Step indicator */}
          <p className="mt-3 text-xs font-medium text-neutral-400">
            Step {step} of {TOTAL_STEPS}
          </p>
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pt-6 pb-32">
        <div className="mx-auto w-full max-w-lg flex-1">
          <AnimatePresence mode="wait" custom={direction}>
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
                  What sports are you into?
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Select all that apply. You can change this later.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {SPORTS.map((sport) => {
                    const Icon = sport.icon;
                    const active = selectedSports.has(sport.id);
                    return (
                      <button
                        key={sport.id}
                        onClick={() => toggleSport(sport.id)}
                        className={cn(
                          'flex flex-col items-center gap-2.5 rounded-[20px] border-2 p-4 transition-all duration-200',
                          active
                            ? 'border-lime bg-lime/10 shadow-[0_0_20px_rgba(200,255,0,0.15)]'
                            : 'border-black/[0.06] bg-white hover:border-black/[0.12] hover:bg-neutral-50',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                            active
                              ? 'bg-lime text-black'
                              : 'bg-surface text-neutral-400',
                          )}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <span
                          className={cn(
                            'text-xs font-semibold transition-colors',
                            active ? 'text-neutral-900' : 'text-neutral-500',
                          )}
                        >
                          {sport.label}
                        </span>
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-lime"
                          >
                            <Check className="h-3 w-3 text-black" strokeWidth={3} />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

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
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  What&apos;s your role?
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  This helps us personalize your experience.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    const active = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={cn(
                          'flex items-start gap-4 rounded-[20px] border-2 p-5 text-left transition-all duration-200',
                          active
                            ? 'border-lime bg-lime/10 shadow-[0_0_20px_rgba(200,255,0,0.15)]'
                            : 'border-black/[0.06] bg-white hover:border-black/[0.12] hover:bg-neutral-50',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors',
                            active
                              ? 'bg-lime text-black'
                              : 'bg-surface text-neutral-400',
                          )}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={cn(
                              'text-sm font-bold transition-colors',
                              active ? 'text-neutral-900' : 'text-neutral-700',
                            )}
                          >
                            {role.label}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-400">
                            {role.description}
                          </p>
                        </div>
                        {active && (
                          <div className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime">
                            <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Choose your teams
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Follow Toronto teams to get updates in your feed.
                </p>

                <div className="mt-8 space-y-3">
                  {TORONTO_TEAMS.map((team) => {
                    const active = selectedTeams.has(team.id);
                    return (
                      <button
                        key={team.id}
                        onClick={() => toggleTeam(team.id)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-[20px] border-2 px-5 py-4 transition-all duration-200',
                          active
                            ? 'border-lime bg-lime/10 shadow-[0_0_16px_rgba(200,255,0,0.12)]'
                            : 'border-black/[0.06] bg-white hover:border-black/[0.12] hover:bg-neutral-50',
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-xl font-[family-name:var(--font-mono)] text-xs font-bold transition-colors',
                              active
                                ? 'bg-lime text-black'
                                : 'bg-surface text-neutral-400',
                            )}
                          >
                            {team.sport.slice(0, 3)}
                          </div>
                          <div className="text-left">
                            <p
                              className={cn(
                                'text-sm font-bold transition-colors',
                                active ? 'text-neutral-900' : 'text-neutral-700',
                              )}
                            >
                              {team.label}
                            </p>
                            <p className="text-xs text-neutral-400">{team.sport}</p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
                            active
                              ? 'border-lime bg-lime'
                              : 'border-neutral-200 bg-white',
                          )}
                        >
                          {active && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />
                            </motion.div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

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
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Personalize your feed
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Choose what shows up in your feed. You can change these anytime.
                </p>

                <div className="mt-8 space-y-3">
                  {PREFERENCES.map((pref) => {
                    const Icon = pref.icon;
                    const active = preferences[pref.id] ?? false;
                    return (
                      <button
                        key={pref.id}
                        onClick={() => togglePreference(pref.id)}
                        className={cn(
                          'flex w-full items-center gap-4 rounded-[20px] border-2 px-5 py-5 text-left transition-all duration-200',
                          active
                            ? 'border-lime/40 bg-lime/[0.06]'
                            : 'border-black/[0.06] bg-white hover:bg-neutral-50',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors',
                            active
                              ? 'bg-lime/20 text-lime-dark'
                              : 'bg-surface text-neutral-400',
                          )}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-neutral-900">
                            {pref.label}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-400">
                            {pref.description}
                          </p>
                        </div>
                        {/* Toggle switch */}
                        <div
                          className={cn(
                            'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200',
                            active ? 'bg-lime' : 'bg-neutral-200',
                          )}
                        >
                          <motion.div
                            className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
                            animate={{ left: active ? 22 : 2 }}
                            transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-black/[0.04] bg-white/80 backdrop-blur-xl safe-bottom">
        <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
          <button
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

          {step < TOTAL_STEPS ? (
            <button
              onClick={goNext}
              className={cn(
                'flex items-center gap-2 rounded-2xl bg-lime px-7 py-3 text-sm font-bold text-black',
                'shadow-[0_2px_12px_rgba(200,255,0,0.25)]',
                'transition-all duration-200',
                'hover:shadow-[0_4px_20px_rgba(200,255,0,0.35)]',
                'active:scale-[0.97]',
              )}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className={cn(
                'flex items-center gap-2 rounded-2xl bg-lime px-7 py-3 text-sm font-bold text-black',
                'shadow-[0_4px_24px_rgba(200,255,0,0.3)]',
                'transition-all duration-200',
                'hover:shadow-[0_8px_40px_rgba(200,255,0,0.4)]',
                'active:scale-[0.97]',
              )}
            >
              Let&apos;s Go!
              <Zap className="h-4 w-4" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
