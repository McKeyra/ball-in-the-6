'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Zap,
  Search,
  BarChart3,
  MessageCircle,
  ArrowRight,
  ClipboardList,
  User,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const BENEFITS = [
  {
    icon: Search,
    title: 'Find Programs',
    description: 'Discover leagues, camps, and clinics near you',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'See stats, coach notes, and development updates',
  },
  {
    icon: MessageCircle,
    title: 'Stay Connected',
    description: 'Get schedules, reminders, and team messages',
  },
] as const;

const SECONDARY_ROLES = [
  { href: '/get-started/coach', label: "I'm a Coach", icon: ClipboardList },
  { href: '/get-started/player', label: "I'm a Player", icon: User },
  { href: '/get-started/organization', label: "I'm an Organization", icon: Building2 },
] as const;

export default function GetStartedPage(): React.JSX.Element {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-lime/[0.06] blur-[180px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="flex justify-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-lime shadow-[0_4px_24px_rgba(200,255,0,0.25)]">
            <Zap className="h-8 w-8 text-black" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE_OUT_EXPO }}
          className="mt-8 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Welcome to{' '}
            <span className="relative">
              Ball in the 6
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.6, duration: 0.4, ease: EASE_OUT_EXPO }}
                className="absolute -bottom-1 left-0 h-1 rounded-full bg-lime"
              />
            </span>
          </h1>
          <p className="mt-4 text-base text-neutral-500 leading-relaxed">
            The easiest way to manage your child&apos;s sports life.
            <br className="hidden sm:block" />
            {' '}Schedules, progress, payments — all in one place.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: EASE_OUT_EXPO }}
          className="mt-10 space-y-3"
        >
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4, ease: EASE_OUT_EXPO }}
                className="flex items-center gap-4 rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-lime/15">
                  <Icon className="h-5 w-5 text-neutral-800" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-900">{benefit.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{benefit.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4, ease: EASE_OUT_EXPO }}
          className="mt-10"
        >
          <Link
            href="/get-started/parent"
            className={cn(
              'flex w-full items-center justify-center gap-2.5 rounded-2xl bg-lime px-6 py-4 text-base font-bold text-black',
              'shadow-[0_4px_24px_rgba(200,255,0,0.3)]',
              'transition-all duration-200',
              'hover:shadow-[0_8px_40px_rgba(200,255,0,0.4)]',
              'active:scale-[0.98]',
            )}
          >
            I&apos;m a Parent — Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {/* Secondary role links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="mt-6 flex items-center justify-center gap-4"
        >
          {SECONDARY_ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.href}
                href={role.href}
                className="flex items-center gap-1.5 text-sm font-semibold text-neutral-400 transition-colors hover:text-neutral-700"
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                {role.label}
              </Link>
            );
          })}
        </motion.div>

        {/* Already have account */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="mt-8 text-center text-sm text-neutral-400"
        >
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-neutral-700 underline decoration-lime decoration-2 underline-offset-2 transition-colors hover:text-neutral-900"
          >
            Sign in
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
