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
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { TeamSearchResult, type TeamResult } from '@/components/onboarding/TeamSearchResult';
import { ProgramSearchResult, type ProgramResult } from '@/components/onboarding/ProgramSearchResult';
import { CelebrationScreen } from '@/components/onboarding/CelebrationScreen';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const STEP_LABELS = ['Account', 'Sport', 'Team', 'Done'] as const;

const SPORT_OPTIONS = [
  { id: 'basketball', label: 'Basketball', icon: Dribbble },
  { id: 'soccer', label: 'Soccer', icon: CircleDot },
  { id: 'hockey', label: 'Hockey', icon: Swords },
  { id: 'football', label: 'Football', icon: Trophy },
  { id: 'baseball', label: 'Baseball', icon: Target },
  { id: 'track', label: 'Track & Field', icon: Dumbbell },
] as const;

const POSITIONS: Record<string, string[]> = {
  basketball: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
  soccer: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
  hockey: ['Goaltender', 'Defenseman', 'Left Wing', 'Right Wing', 'Center'],
  football: ['Quarterback', 'Running Back', 'Wide Receiver', 'Linebacker', 'Defensive Back'],
  baseball: ['Pitcher', 'Catcher', 'Infielder', 'Outfielder'],
  track: ['Sprints', 'Middle Distance', 'Long Distance', 'Hurdles', 'Jumps', 'Throws'],
};

const MOCK_TEAMS: TeamResult[] = [
  { id: 't1', name: 'B.M.T. Titans U14', sport: 'Basketball', coachName: 'Marcus Williams', memberCount: 14, location: 'Scarborough' },
  { id: 't2', name: 'Scarborough Elite U14', sport: 'Basketball', coachName: 'Dwayne Carter', memberCount: 12, location: 'Scarborough' },
  { id: 't3', name: 'North York Knights', sport: 'Basketball', coachName: 'James Thompson', memberCount: 15, location: 'North York' },
  { id: 't4', name: 'Ajax FC Academy', sport: 'Soccer', coachName: 'Paulo Silva', memberCount: 18, location: 'Ajax' },
];

const MOCK_PROGRAMS: ProgramResult[] = [
  { id: 'p1', name: 'U14 Competitive League', orgName: 'Ball in the 6', sport: 'basketball', schedule: 'Mon/Wed 6-8 PM', price: 450, spotsLeft: 3, ageGroup: 'U14', location: 'Pan Am Centre, Scarborough' },
  { id: 'p2', name: 'Summer Basketball Camp', orgName: 'Toronto Youth Athletics', sport: 'basketball', schedule: 'Mon-Fri 9 AM-3 PM', price: 550, spotsLeft: 8, ageGroup: 'Ages 8-14', location: 'Downsview Park Gym' },
  { id: 'p3', name: 'Skills Development Clinic', orgName: 'Hoop Dreams Toronto', sport: 'basketball', schedule: 'Sat 10 AM-12 PM', price: 200, spotsLeft: 12, ageGroup: 'Ages 10-16', location: "L'Amoreaux Sports Complex" },
];

const calculateAge = (dob: string): number | null => {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

type TeamSubStep = 'choice' | 'search' | 'browse';

export default function PlayerOnboardingPage(): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  /* Step 1 */
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [playerPassword, setPlayerPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [playerDob, setPlayerDob] = useState('');

  /* Step 2 */
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  /* Step 3 */
  const [teamSubStep, setTeamSubStep] = useState<TeamSubStep>('choice');
  const [teamQuery, setTeamQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [registeredProgram, setRegisteredProgram] = useState<string | null>(null);

  const playerAge = useMemo(() => calculateAge(playerDob), [playerDob]);

  const filteredTeams = useMemo(() => {
    if (!teamQuery.trim()) return [];
    const q = teamQuery.toLowerCase();
    return MOCK_TEAMS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.coachName.toLowerCase().includes(q),
    );
  }, [teamQuery]);

  const filteredPrograms = useMemo(() => {
    if (!selectedSport) return MOCK_PROGRAMS;
    return MOCK_PROGRAMS.filter((p) => p.sport === selectedSport);
  }, [selectedSport]);

  const selectedTeamData = useMemo(
    () => MOCK_TEAMS.find((t) => t.id === selectedTeam) ?? null,
    [selectedTeam],
  );

  const currentPositions = selectedSport ? (POSITIONS[selectedSport] ?? []) : [];

  const goNext = useCallback((): void => {
    if (step < 4) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step]);

  const goBack = useCallback((): void => {
    setDirection(-1);
    if (step === 3 && teamSubStep !== 'choice') {
      setTeamSubStep('choice');
      return;
    }
    if (step > 1) setStep((s) => s - 1);
  }, [step, teamSubStep]);

  const handleFinish = useCallback((): void => {
    router.push('/');
  }, [router]);

  const canProceedStep1 =
    playerName.trim().length > 0 &&
    playerEmail.trim().length > 0 &&
    playerPassword.length >= 8 &&
    playerDob.length > 0;

  const canProceedStep2 = selectedSport !== null;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  const summaryItems = useMemo(() => {
    const items: Array<{ label: string; value: string }> = [];
    if (playerName) items.push({ label: 'Player', value: playerName });
    if (playerAge !== null) items.push({ label: 'Age', value: `${playerAge}` });
    if (selectedSport) items.push({ label: 'Sport', value: selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1) });
    if (selectedPosition) items.push({ label: 'Position', value: selectedPosition });
    if (selectedTeamData) items.push({ label: 'Team', value: selectedTeamData.name });
    if (registeredProgram) {
      const prog = MOCK_PROGRAMS.find((p) => p.id === registeredProgram);
      if (prog) items.push({ label: 'Program', value: prog.name });
    }
    return items;
  }, [playerName, playerAge, selectedSport, selectedPosition, selectedTeamData, registeredProgram]);

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
            {/* ===== STEP 1: Account ===== */}
            {step === 1 && (
              <motion.div
                key="player-1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Create your player account
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Let&apos;s get you set up so you can track your game.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="player-name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Full name
                    </label>
                    <input
                      id="player-name"
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="player-email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Email
                    </label>
                    <input
                      id="player-email"
                      type="email"
                      value={playerEmail}
                      onChange={(e) => setPlayerEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="player-dob" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Date of birth
                    </label>
                    <input
                      id="player-dob"
                      type="date"
                      value={playerDob}
                      onChange={(e) => setPlayerDob(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                    {playerAge !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 rounded-xl bg-lime/10 px-3 py-2"
                      >
                        <Calendar className="h-3.5 w-3.5 text-neutral-600" strokeWidth={2} />
                        <span className="text-xs font-semibold text-neutral-700">
                          Age:{' '}
                          <span className="font-bold text-neutral-900 font-[family-name:var(--font-mono)]">{playerAge}</span>
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="player-password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="player-password"
                        type={showPassword ? 'text' : 'password'}
                        value={playerPassword}
                        onChange={(e) => setPlayerPassword(e.target.value)}
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

            {/* ===== STEP 2: Sport & Position ===== */}
            {step === 2 && (
              <motion.div
                key="player-2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  What&apos;s your sport?
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Pick your primary sport. You can add more later.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {SPORT_OPTIONS.map((sport) => {
                    const Icon = sport.icon;
                    const active = selectedSport === sport.id;
                    return (
                      <button
                        key={sport.id}
                        type="button"
                        onClick={() => {
                          setSelectedSport(active ? null : sport.id);
                          setSelectedPosition(null);
                        }}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-[14px] border-2 p-3.5 transition-all duration-200',
                          active
                            ? 'border-lime bg-lime/10 shadow-[0_0_16px_rgba(200,255,0,0.15)]'
                            : 'border-black/[0.06] bg-white hover:border-black/[0.12]',
                        )}
                      >
                        <Icon className={cn('h-6 w-6', active ? 'text-neutral-900' : 'text-neutral-400')} strokeWidth={2} />
                        <span className={cn('text-xs font-semibold', active ? 'text-neutral-900' : 'text-neutral-500')}>
                          {sport.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Position */}
                {selectedSport && currentPositions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Position
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentPositions.map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setSelectedPosition(selectedPosition === pos ? null : pos)}
                          className={cn(
                            'rounded-full border-2 px-4 py-2 text-xs font-semibold transition-all duration-200',
                            selectedPosition === pos
                              ? 'border-lime bg-lime/10 text-neutral-900'
                              : 'border-black/[0.06] bg-white text-neutral-500 hover:border-black/[0.12]',
                          )}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ===== STEP 3: Team ===== */}
            {step === 3 && (
              <motion.div
                key={`player-3-${teamSubStep}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                {teamSubStep === 'choice' && (
                  <>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                      Are you on a team?
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      Connect with your team or find a program to join.
                    </p>

                    <div className="mt-8 space-y-3">
                      <button
                        type="button"
                        onClick={() => setTeamSubStep('search')}
                        className={cn(
                          'flex w-full items-start gap-4 rounded-[20px] border-2 border-black/[0.06] bg-white p-5 text-left',
                          'transition-all duration-200 hover:border-lime/40 hover:bg-lime/[0.03] active:scale-[0.99]',
                        )}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-emerald-50">
                          <span className="text-xl">&#9989;</span>
                        </div>
                        <div>
                          <p className="text-base font-bold text-neutral-900">Yes, find my team</p>
                          <p className="mt-1 text-sm text-neutral-500">Search and join your current team</p>
                        </div>
                        <ArrowRight className="ml-auto mt-1 h-5 w-5 shrink-0 text-neutral-300" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setTeamSubStep('browse')}
                        className={cn(
                          'flex w-full items-start gap-4 rounded-[20px] border-2 border-black/[0.06] bg-white p-5 text-left',
                          'transition-all duration-200 hover:border-lime/40 hover:bg-lime/[0.03] active:scale-[0.99]',
                        )}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-blue-50">
                          <Search className="h-5 w-5 text-blue-500" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-base font-bold text-neutral-900">No, browse programs</p>
                          <p className="mt-1 text-sm text-neutral-500">Find leagues and camps to join</p>
                        </div>
                        <ArrowRight className="ml-auto mt-1 h-5 w-5 shrink-0 text-neutral-300" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="mt-6 w-full text-center text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
                    >
                      Skip for now
                    </button>
                  </>
                )}

                {teamSubStep === 'search' && (
                  <>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                      Find your team
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      Search by team name or coach.
                    </p>

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

                    {teamQuery.trim().length > 0 && (
                      <div className="mt-4 space-y-2">
                        {filteredTeams.length === 0 ? (
                          <p className="py-8 text-center text-sm text-neutral-400">No teams found.</p>
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

                    {selectedTeamData && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                      >
                        <button
                          type="button"
                          onClick={() => setStep(4)}
                          className={cn(
                            'w-full rounded-2xl bg-lime py-3.5 text-sm font-bold text-black',
                            'shadow-[0_4px_24px_rgba(200,255,0,0.3)]',
                            'transition-all duration-200 hover:shadow-[0_8px_40px_rgba(200,255,0,0.4)] active:scale-[0.98]',
                          )}
                        >
                          Join {selectedTeamData.name}
                        </button>
                      </motion.div>
                    )}
                  </>
                )}

                {teamSubStep === 'browse' && (
                  <>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                      Browse programs
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      Find a program that fits your game.
                    </p>

                    <div className="mt-6 space-y-3">
                      {filteredPrograms.length === 0 ? (
                        <p className="py-6 text-center text-sm text-neutral-400">No programs found.</p>
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

            {/* ===== STEP 4: Done ===== */}
            {step === 4 && (
              <motion.div
                key="player-4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <CelebrationScreen
                  title="You're in the game!"
                  subtitle="Your player profile is ready. Time to put in work."
                  summaryItems={summaryItems}
                  primaryAction={{ label: 'Go to My Profile', onClick: handleFinish }}
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
          </div>
        </div>
      )}
    </div>
  );
}
