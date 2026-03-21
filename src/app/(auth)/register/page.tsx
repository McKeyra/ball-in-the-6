'use client';

import { useState, useMemo, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { UserPlus, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import type { AgeBracket } from '@/lib/auth/types';

const MINIMUM_AGE_YEARS = 0;
const CHILD_MAX_AGE = 12;
const TEEN_MAX_AGE = 17;

const calculateAgeBracket = (dob: string): AgeBracket | null => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < MINIMUM_AGE_YEARS) return null;
  if (age <= CHILD_MAX_AGE) return 'child';
  if (age <= TEEN_MAX_AGE) return 'teen';
  return 'adult';
};

const getAgeBracketLabel = (bracket: AgeBracket): string => {
  const labels: Record<AgeBracket, string> = {
    child: 'Under 13 — Parental consent required',
    teen: '13-17 — Limited features available',
    adult: '18+ — Full access',
  };
  return labels[bracket];
};

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ageBracket = useMemo(() => calculateAgeBracket(dateOfBirth), [dateOfBirth]);

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    passwordsMatch &&
    dateOfBirth.length > 0 &&
    termsAccepted;

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError(null);

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }

    setIsSubmitting(true);

    register({ email, password, name, dateOfBirth })
      .then(() => {
        router.push('/');
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setError(message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex flex-col items-center py-8">
      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-lime shadow-[0_4px_24px_rgba(200,255,0,0.25)]">
          <UserPlus className="h-8 w-8 text-black" strokeWidth={2.5} />
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 text-center"
      >
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Join Ball in the 6
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Create your account and get in the game
        </p>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full rounded-[20px] border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-start gap-3 rounded-2xl border border-accent-red/20 bg-accent-red/[0.05] px-4 py-3"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-red" />
              <p className="text-sm text-accent-red">{error}</p>
            </motion.div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Your full name"
              className={cn(
                'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3 text-sm text-neutral-900',
                'placeholder:text-neutral-400',
                'outline-none transition-all duration-200',
                'focus:border-lime focus:ring-2 focus:ring-lime/20',
              )}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(
                'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3 text-sm text-neutral-900',
                'placeholder:text-neutral-400',
                'outline-none transition-all duration-200',
                'focus:border-lime focus:ring-2 focus:ring-lime/20',
              )}
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label htmlFor="dob" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Date of birth
            </label>
            <input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
              className={cn(
                'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3 text-sm text-neutral-900',
                'outline-none transition-all duration-200',
                'focus:border-lime focus:ring-2 focus:ring-lime/20',
              )}
            />
            {ageBracket && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium',
                  ageBracket === 'adult' && 'bg-accent-emerald/10 text-accent-emerald',
                  ageBracket === 'teen' && 'bg-accent-orange/10 text-accent-orange',
                  ageBracket === 'child' && 'bg-accent-purple/10 text-accent-purple',
                )}
              >
                <ShieldCheck size={14} />
                <span>{getAgeBracketLabel(ageBracket)}</span>
              </motion.div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={cn(
                  'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3 pr-12 text-sm text-neutral-900',
                  'placeholder:text-neutral-400',
                  'outline-none transition-all duration-200',
                  'focus:border-lime focus:ring-2 focus:ring-lime/20',
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 transition-colors hover:text-neutral-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="flex gap-1.5 pt-1">
                {[1, 2, 3, 4].map((segment) => {
                  const strength =
                    (password.length >= 8 ? 1 : 0) +
                    (/[A-Z]/.test(password) ? 1 : 0) +
                    (/[0-9]/.test(password) ? 1 : 0) +
                    (/[^a-zA-Z0-9]/.test(password) ? 1 : 0);
                  const filled = segment <= strength;
                  return (
                    <div
                      key={segment}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-all duration-300',
                        filled
                          ? strength <= 1
                            ? 'bg-accent-red'
                            : strength <= 2
                              ? 'bg-accent-orange'
                              : strength <= 3
                                ? 'bg-accent-yellow'
                                : 'bg-accent-emerald'
                          : 'bg-neutral-200',
                      )}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className={cn(
                  'w-full rounded-2xl border border-black/[0.08] bg-surface px-4 py-3 pr-12 text-sm text-neutral-900',
                  'placeholder:text-neutral-400',
                  'outline-none transition-all duration-200',
                  'focus:border-lime focus:ring-2 focus:ring-lime/20',
                  confirmPassword.length > 0 && !passwordsMatch && 'border-accent-red/50 focus:border-accent-red focus:ring-accent-red/20',
                  passwordsMatch && 'border-accent-emerald/50 focus:border-accent-emerald focus:ring-accent-emerald/20',
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 transition-colors hover:text-neutral-600"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-accent-red">Passwords do not match</p>
            )}
          </div>

          {/* Terms */}
          <label className="flex cursor-pointer items-start gap-3">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="peer sr-only"
              />
              <div className={cn(
                'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200',
                termsAccepted
                  ? 'border-lime bg-lime'
                  : 'border-neutral-300 bg-white',
              )}>
                {termsAccepted && (
                  <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm leading-snug text-neutral-600">
              I agree to the{' '}
              <Link href="/terms" className="font-medium text-neutral-900 underline decoration-lime decoration-2 underline-offset-2">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-neutral-900 underline decoration-lime decoration-2 underline-offset-2">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={cn(
              'relative w-full rounded-2xl bg-lime px-6 py-3.5 text-sm font-bold text-black',
              'shadow-[0_2px_12px_rgba(200,255,0,0.25)]',
              'transition-all duration-200',
              'hover:shadow-[0_4px_20px_rgba(200,255,0,0.35)]',
              'active:scale-[0.98]',
              'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </motion.div>

      {/* Footer link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 text-center text-sm text-neutral-500"
      >
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-neutral-900 underline decoration-lime decoration-2 underline-offset-2 transition-colors hover:text-lime-dark"
        >
          Sign in
        </Link>
      </motion.p>
    </div>
  );
}
