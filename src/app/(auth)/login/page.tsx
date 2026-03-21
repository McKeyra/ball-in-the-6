'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Zap, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    login(email, password)
      .then(() => {
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
        setError(message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-lime shadow-[0_4px_24px_rgba(200,255,0,0.25)]">
          <Zap className="h-8 w-8 text-black" strokeWidth={2.5} />
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
          Sign in to Ball in the 6
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Welcome back to Toronto&apos;s sports community
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
                autoComplete="current-password"
                placeholder="Enter your password"
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
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2.5">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200',
                  rememberMe
                    ? 'border-lime bg-lime'
                    : 'border-neutral-300 bg-white',
                )}>
                  {rememberMe && (
                    <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-neutral-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
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
                Signing in...
              </span>
            ) : (
              'Sign In'
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
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-neutral-900 underline decoration-lime decoration-2 underline-offset-2 transition-colors hover:text-lime-dark"
        >
          Create one
        </Link>
      </motion.p>
    </div>
  );
}
