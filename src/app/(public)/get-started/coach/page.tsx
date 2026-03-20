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
  ClipboardList as CoachIcon,
  Users,
  Copy,
  Check,
  Plus,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { CelebrationScreen } from '@/components/onboarding/CelebrationScreen';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const STEP_LABELS = ['Account', 'Team', 'Invite', 'Done'] as const;

const CERTIFICATIONS = [
  'NCCP Level 1',
  'NCCP Level 2',
  'NCCP Level 3',
  'First Aid / CPR',
  'Respect in Sport',
  'Vulnerable Sector Check',
] as const;

export default function CoachOnboardingPage(): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  /* Step 1 */
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [coachPassword, setCoachPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCerts, setSelectedCerts] = useState<Set<string>>(new Set());

  /* Step 2 */
  const [teamChoice, setTeamChoice] = useState<'create' | 'join' | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamSport, setTeamSport] = useState('Basketball');
  const [joinCode, setJoinCode] = useState('');

  /* Step 3 */
  const [copied, setCopied] = useState(false);
  const inviteCode = 'BTG-7X3K9M';

  const toggleCert = useCallback((cert: string): void => {
    setSelectedCerts((prev) => {
      const next = new Set(prev);
      if (next.has(cert)) next.delete(cert);
      else next.add(cert);
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

  const handleCopy = useCallback((): void => {
    void navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inviteCode]);

  const handleFinish = useCallback((): void => {
    router.push('/');
  }, [router]);

  const canProceedStep1 =
    coachName.trim().length > 0 &&
    coachEmail.trim().length > 0 &&
    coachPassword.length >= 8;

  const canProceedStep2 =
    teamChoice === 'join'
      ? joinCode.trim().length > 0
      : teamChoice === 'create'
        ? teamName.trim().length > 0
        : false;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
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
                key="coach-1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-emerald-50">
                    <CoachIcon className="h-5 w-5 text-emerald-600" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Coach sign-up
                  </h2>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Set up your coaching profile so parents and players can find you.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="coach-name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Full name
                    </label>
                    <input
                      id="coach-name"
                      type="text"
                      value={coachName}
                      onChange={(e) => setCoachName(e.target.value)}
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
                    <label htmlFor="coach-email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Email
                    </label>
                    <input
                      id="coach-email"
                      type="email"
                      value={coachEmail}
                      onChange={(e) => setCoachEmail(e.target.value)}
                      placeholder="coach@example.com"
                      autoComplete="email"
                      className={cn(
                        'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                        'placeholder:text-neutral-400 outline-none transition-all duration-200',
                        'focus:border-lime focus:ring-2 focus:ring-lime/20',
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="coach-password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="coach-password"
                        type={showPassword ? 'text' : 'password'}
                        value={coachPassword}
                        onChange={(e) => setCoachPassword(e.target.value)}
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

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Certifications
                      <span className="ml-1 normal-case text-neutral-300">(optional)</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CERTIFICATIONS.map((cert) => (
                        <button
                          key={cert}
                          type="button"
                          onClick={() => toggleCert(cert)}
                          className={cn(
                            'rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-all duration-200',
                            selectedCerts.has(cert)
                              ? 'border-lime bg-lime/10 text-neutral-900'
                              : 'border-black/[0.06] bg-white text-neutral-500 hover:border-black/[0.12]',
                          )}
                        >
                          {selectedCerts.has(cert) && <Check className="mr-1 inline h-3 w-3" strokeWidth={2.5} />}
                          {cert}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 2: Create or join ===== */}
            {step === 2 && (
              <motion.div
                key="coach-2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Create or join a team
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  You can manage multiple teams later from your dashboard.
                </p>

                <div className="mt-8 space-y-3">
                  <button
                    type="button"
                    onClick={() => setTeamChoice('create')}
                    className={cn(
                      'flex w-full items-start gap-4 rounded-[20px] border-2 p-5 text-left transition-all duration-200',
                      teamChoice === 'create'
                        ? 'border-lime bg-lime/10 shadow-[0_0_20px_rgba(200,255,0,0.15)]'
                        : 'border-black/[0.06] bg-white hover:border-black/[0.12]',
                    )}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-lime/15">
                      <Plus className="h-5 w-5 text-neutral-800" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">Create a new team</p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        Start fresh and invite your players
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTeamChoice('join')}
                    className={cn(
                      'flex w-full items-start gap-4 rounded-[20px] border-2 p-5 text-left transition-all duration-200',
                      teamChoice === 'join'
                        ? 'border-lime bg-lime/10 shadow-[0_0_20px_rgba(200,255,0,0.15)]'
                        : 'border-black/[0.06] bg-white hover:border-black/[0.12]',
                    )}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-blue-50">
                      <Search className="h-5 w-5 text-blue-500" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">Join an existing team</p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        Enter a team code from an organization
                      </p>
                    </div>
                  </button>
                </div>

                {/* Create form */}
                {teamChoice === 'create' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 space-y-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label htmlFor="team-name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Team name
                      </label>
                      <input
                        id="team-name"
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder='e.g. "Scarborough Elite U14"'
                        className={cn(
                          'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                          'placeholder:text-neutral-400 outline-none transition-all duration-200',
                          'focus:border-lime focus:ring-2 focus:ring-lime/20',
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="team-sport" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Sport
                      </label>
                      <select
                        id="team-sport"
                        value={teamSport}
                        onChange={(e) => setTeamSport(e.target.value)}
                        className={cn(
                          'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                          'outline-none transition-all duration-200',
                          'focus:border-lime focus:ring-2 focus:ring-lime/20',
                        )}
                      >
                        {['Basketball', 'Soccer', 'Hockey', 'Football', 'Baseball', 'Track & Field'].map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Join form */}
                {teamChoice === 'join' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 space-y-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label htmlFor="join-code" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Team code
                      </label>
                      <input
                        id="join-code"
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Enter the code from your organization"
                        className={cn(
                          'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3.5 text-sm text-neutral-900',
                          'placeholder:text-neutral-400 outline-none transition-all duration-200',
                          'focus:border-lime focus:ring-2 focus:ring-lime/20',
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Skip */}
                <button
                  type="button"
                  onClick={goNext}
                  className="mt-6 w-full text-center text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
                >
                  Skip for now
                </button>
              </motion.div>
            )}

            {/* ===== STEP 3: Invite ===== */}
            {step === 3 && (
              <motion.div
                key="coach-3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Invite your players&apos; parents
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Share this code with parents so they can link their child to your team.
                </p>

                <div className="mt-8 rounded-[20px] border border-lime/30 bg-lime/[0.05] p-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Your team invite code
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-mono)] text-3xl font-black tracking-widest text-neutral-900">
                    {inviteCode}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={cn(
                      'mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200',
                      copied
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-white text-neutral-700 hover:bg-neutral-100',
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" strokeWidth={2} />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 rounded-[20px] border border-black/[0.06] bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime/15">
                      <Users className="h-5 w-5 text-neutral-800" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">How it works</p>
                      <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed">
                        Parents enter this code when they sign up to connect their child to your team.
                        You&apos;ll see them in your roster once they join.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skip */}
                <button
                  type="button"
                  onClick={goNext}
                  className="mt-6 w-full text-center text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
                >
                  I&apos;ll do this later
                </button>
              </motion.div>
            )}

            {/* ===== STEP 4: Done ===== */}
            {step === 4 && (
              <motion.div
                key="coach-4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              >
                <CelebrationScreen
                  title="Welcome, Coach!"
                  subtitle="Your coaching profile is ready. Let's build your roster."
                  summaryItems={[
                    { label: 'Name', value: coachName || 'Coach' },
                    ...(teamName ? [{ label: 'Team', value: teamName }] : []),
                    { label: 'Certifications', value: selectedCerts.size > 0 ? `${selectedCerts.size} added` : 'None yet' },
                  ]}
                  primaryAction={{ label: 'Go to Coach Dashboard', onClick: handleFinish }}
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
                (step === 2 && !canProceedStep2 && teamChoice !== null)
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
