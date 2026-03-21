'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { KeyRound, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex justify-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-lime shadow-[0_4px_24px_rgba(200,255,0,0.25)]">
            <KeyRound className="h-8 w-8 text-black" strokeWidth={2.5} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[20px] border border-black/[0.06] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle className="h-12 w-12 text-accent-emerald" strokeWidth={1.5} />
              <div className="text-center">
                <p className="text-sm font-bold text-neutral-900">Check your email</p>
                <p className="mt-1 text-xs text-neutral-500">
                  If an account exists for {email}, you&apos;ll receive a password reset link.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'relative w-full rounded-2xl bg-lime px-6 py-3.5 text-sm font-bold text-black',
                  'shadow-[0_2px_12px_rgba(200,255,0,0.25)]',
                  'transition-all duration-200',
                  'hover:shadow-[0_4px_20px_rgba(200,255,0,0.35)]',
                  'active:scale-[0.98]',
                  'disabled:opacity-60 disabled:cursor-not-allowed',
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
