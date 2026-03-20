'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Zap,
  MapPin,
  Brain,
  Users,
  Gamepad2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  {
    icon: MapPin,
    title: 'Courts',
    description: 'Find and review every court, field, and rink across the 6ix',
    color: 'bg-accent-emerald/10 text-accent-emerald',
  },
  {
    icon: Brain,
    title: 'Intelligence',
    description: 'AI-powered insights, predictions, and player analytics',
    color: 'bg-accent-purple/10 text-accent-purple',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with players, coaches, fans, and organizations',
    color: 'bg-accent-blue/10 text-accent-blue',
  },
  {
    icon: Gamepad2,
    title: 'Games',
    description: 'Live scores, results, and interactive sports experiences',
    color: 'bg-accent-orange/10 text-accent-orange',
  },
] as const;

const STATS = [
  { value: '40', label: 'Sports' },
  { value: '6', label: 'Profile Types' },
  { value: 'Real-time', label: 'Intel' },
] as const;

function SkylineSVG(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 1200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* CN Tower */}
      <rect x="540" y="10" width="6" height="170" rx="3" fill="currentColor" />
      <rect x="530" y="25" width="26" height="8" rx="2" fill="currentColor" />
      <ellipse cx="543" cy="60" rx="14" ry="6" fill="currentColor" />
      <rect x="536" y="55" width="14" height="18" rx="2" fill="currentColor" />
      <circle cx="543" cy="8" r="4" fill="currentColor" />

      {/* Buildings left of CN Tower */}
      <rect x="80" y="120" width="35" height="60" rx="2" fill="currentColor" />
      <rect x="125" y="100" width="28" height="80" rx="2" fill="currentColor" />
      <rect x="162" y="130" width="22" height="50" rx="2" fill="currentColor" />
      <rect x="195" y="90" width="30" height="90" rx="2" fill="currentColor" />
      <rect x="235" y="110" width="25" height="70" rx="2" fill="currentColor" />
      <rect x="270" y="75" width="32" height="105" rx="2" fill="currentColor" />
      <rect x="312" y="95" width="26" height="85" rx="2" fill="currentColor" />
      <rect x="348" y="60" width="20" height="120" rx="2" fill="currentColor" />
      <rect x="378" y="105" width="35" height="75" rx="2" fill="currentColor" />
      <rect x="423" y="80" width="28" height="100" rx="2" fill="currentColor" />
      <rect x="460" y="115" width="24" height="65" rx="2" fill="currentColor" />
      <rect x="494" y="90" width="30" height="90" rx="2" fill="currentColor" />

      {/* Buildings right of CN Tower */}
      <rect x="580" y="85" width="32" height="95" rx="2" fill="currentColor" />
      <rect x="622" y="100" width="25" height="80" rx="2" fill="currentColor" />
      <rect x="657" y="70" width="28" height="110" rx="2" fill="currentColor" />
      <rect x="695" y="110" width="35" height="70" rx="2" fill="currentColor" />
      <rect x="740" y="55" width="22" height="125" rx="2" fill="currentColor" />
      <rect x="772" y="95" width="30" height="85" rx="2" fill="currentColor" />
      <rect x="812" y="120" width="26" height="60" rx="2" fill="currentColor" />
      <rect x="848" y="80" width="35" height="100" rx="2" fill="currentColor" />
      <rect x="893" y="100" width="28" height="80" rx="2" fill="currentColor" />
      <rect x="930" y="130" width="24" height="50" rx="2" fill="currentColor" />
      <rect x="964" y="110" width="30" height="70" rx="2" fill="currentColor" />
      <rect x="1004" y="90" width="22" height="90" rx="2" fill="currentColor" />
      <rect x="1036" y="120" width="35" height="60" rx="2" fill="currentColor" />
      <rect x="1081" y="105" width="28" height="75" rx="2" fill="currentColor" />

      {/* Ground line */}
      <rect x="0" y="178" width="1200" height="22" fill="currentColor" />
    </svg>
  );
}

export default function WelcomePage(): React.JSX.Element {
  return (
    <div className="relative min-h-screen overflow-hidden bg-void">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)] opacity-40" />
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-lime/[0.06] blur-[200px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent-purple/[0.03] blur-[150px]" />
        <div className="absolute top-1/3 left-0 h-[300px] w-[300px] rounded-full bg-accent-cyan/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* ===== HERO SECTION ===== */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 pb-12 pt-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-lime shadow-[0_8px_40px_rgba(200,255,0,0.35)]">
              <Zap className="h-10 w-10 text-black" strokeWidth={2.5} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT_EXPO }}
            className="mt-10 text-center"
          >
            <h1 className="text-5xl font-black tracking-tight text-neutral-900 sm:text-7xl md:text-8xl">
              BALL IN
              <br />
              <span className="relative">
                THE
                <span className="ml-3 inline-flex items-center justify-center rounded-[20px] bg-lime px-5 py-1 text-black shadow-[0_4px_24px_rgba(200,255,0,0.25)]">
                  6
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="mt-6 max-w-md text-center text-lg text-neutral-500 sm:text-xl"
          >
            Toronto&apos;s Operating System for Sports
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE_OUT_EXPO }}
            className="mt-10 flex items-center gap-4"
          >
            <Link
              href="/register"
              className={cn(
                'group flex items-center gap-2 rounded-2xl bg-lime px-8 py-4 text-sm font-bold text-black',
                'shadow-[0_4px_24px_rgba(200,255,0,0.3)]',
                'transition-all duration-200',
                'hover:shadow-[0_8px_40px_rgba(200,255,0,0.4)]',
                'active:scale-[0.97]',
              )}
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className={cn(
                'flex items-center gap-2 rounded-2xl border-2 border-neutral-200 px-8 py-4 text-sm font-bold text-neutral-700',
                'transition-all duration-200',
                'hover:border-neutral-300 hover:bg-neutral-50',
                'active:scale-[0.97]',
              )}
            >
              Sign In
            </Link>
          </motion.div>

          {/* Skyline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.06, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: EASE_OUT_EXPO }}
            className="absolute bottom-0 left-0 right-0 text-neutral-900"
          >
            <SkylineSVG />
          </motion.div>
        </section>

        {/* ===== STATS ROW ===== */}
        <section className="relative bg-surface py-8">
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-8 px-6 sm:gap-16">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_OUT_EXPO }}
                className="text-center"
              >
                <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-neutral-900 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== FEATURE CARDS ===== */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="mb-16 text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                Everything Toronto Sports
              </h2>
              <p className="mt-4 text-base text-neutral-500 sm:text-lg">
                One platform for every court, every game, every community.
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: EASE_OUT_EXPO,
                    }}
                    className={cn(
                      'group rounded-[20px] border border-black/[0.06] bg-white p-7',
                      'shadow-[0_2px_12px_rgba(0,0,0,0.03)]',
                      'transition-all duration-300',
                      'hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-2xl',
                        feature.color,
                      )}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-neutral-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                      {feature.description}
                    </p>
                    <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-neutral-400 transition-colors group-hover:text-neutral-600">
                      Explore
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section className="px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className={cn(
              'mx-auto max-w-2xl rounded-[24px] bg-neutral-900 p-10 text-center',
              'shadow-[0_20px_60px_rgba(0,0,0,0.15)]',
            )}
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-lime shadow-[0_4px_20px_rgba(200,255,0,0.3)]">
              <Zap className="h-7 w-7 text-black" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to join the 6?
            </h3>
            <p className="mt-3 text-sm text-neutral-400">
              Create your profile and start exploring Toronto sports today.
            </p>
            <Link
              href="/register"
              className={cn(
                'mt-8 inline-flex items-center gap-2 rounded-2xl bg-lime px-8 py-4 text-sm font-bold text-black',
                'shadow-[0_4px_24px_rgba(200,255,0,0.25)]',
                'transition-all duration-200',
                'hover:shadow-[0_8px_40px_rgba(200,255,0,0.4)]',
                'active:scale-[0.97]',
              )}
            >
              Create Your Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-black/[0.04] bg-surface py-8 px-6">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime">
                <Zap className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-neutral-900">
                Ball in the 6
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Powered by AI6 &mdash; ENUW Inc
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
