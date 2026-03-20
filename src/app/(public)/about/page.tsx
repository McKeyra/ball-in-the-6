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
  Globe,
  Shield,
  BarChart3,
  Sparkles,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  {
    icon: MapPin,
    title: 'Court Discovery',
    description:
      'Find and review every basketball court, soccer field, tennis court, and rink across Toronto. GPS-powered with real-time availability and community ratings.',
    color: 'bg-accent-emerald/10 text-accent-emerald',
  },
  {
    icon: Brain,
    title: 'Sports Intelligence',
    description:
      'AI-powered analytics for every sport. Player comparisons, trend analysis, game predictions, and performance tracking powered by the AI6 engine.',
    color: 'bg-accent-purple/10 text-accent-purple',
  },
  {
    icon: Users,
    title: 'Community Hub',
    description:
      'Connect with players, coaches, fans, teams, and organizations. Share plays, discuss games, organize events, and build your sports network.',
    color: 'bg-accent-blue/10 text-accent-blue',
  },
  {
    icon: Gamepad2,
    title: 'Live Games',
    description:
      'Real-time scores, play-by-play updates, interactive game threads, and post-game analysis for every level of Toronto sports.',
    color: 'bg-accent-orange/10 text-accent-orange',
  },
  {
    icon: BarChart3,
    title: 'Player Profiles',
    description:
      'Six profile types for every stakeholder: Fan, Player, Coach, Team, Organization, and Business. Track stats, build your brand, and grow your reach.',
    color: 'bg-accent-cyan/10 text-accent-cyan',
  },
  {
    icon: Shield,
    title: 'Youth Sports',
    description:
      'Dedicated programs and content for youth development. Find camps, track development milestones, and connect young athletes with mentors.',
    color: 'bg-accent-pink/10 text-accent-pink',
  },
] as const;

const TEAM_MEMBERS = [
  { name: 'ENUW Inc', role: 'Creator & Operator', location: 'Toronto, ON' },
  { name: 'AI6 Engine', role: 'Intelligence Layer', location: 'Cloud' },
  { name: 'The 6ix Community', role: 'Heart & Soul', location: 'Toronto, ON' },
] as const;

export default function AboutPage(): React.JSX.Element {
  return (
    <div className="relative min-h-screen bg-void">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)] opacity-30" />
        <div className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-lime/[0.04] blur-[180px]" />
        <div className="absolute bottom-1/4 left-0 h-[400px] w-[400px] rounded-full bg-accent-purple/[0.03] blur-[140px]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="px-6 py-6">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <Link href="/welcome" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime shadow-[0_2px_12px_rgba(200,255,0,0.2)]">
                <Zap className="h-4.5 w-4.5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-neutral-900">
                Ball in the 6
              </span>
            </Link>
            <Link
              href="/register"
              className={cn(
                'rounded-2xl bg-lime px-5 py-2.5 text-xs font-bold text-black',
                'shadow-[0_2px_8px_rgba(200,255,0,0.2)]',
                'transition-all duration-200 hover:shadow-[0_4px_16px_rgba(200,255,0,0.3)]',
                'active:scale-[0.97]',
              )}
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* ===== HERO / MISSION ===== */}
        <section className="px-6 pt-16 pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-[20px] bg-lime shadow-[0_8px_40px_rgba(200,255,0,0.3)]"
            >
              <Zap className="h-8 w-8 text-black" strokeWidth={2.5} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_EXPO }}
              className="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl"
            >
              Toronto&apos;s Operating System
              <br />
              for Sports
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg"
            >
              Ball in the 6 is a multi-sport platform built for Toronto. We connect
              every player, coach, fan, team, and organization across 40+ sports
              into one intelligent ecosystem. Whether you&apos;re looking for a
              pickup game or tracking professional analytics, this is your home.
            </motion.p>
          </div>
        </section>

        {/* ===== MISSION STATEMENT ===== */}
        <section className="px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="mx-auto max-w-3xl rounded-[24px] border border-black/[0.06] bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-purple/10">
                <Heart className="h-5 w-5 text-accent-purple" strokeWidth={2} />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">Our Mission</h2>
            </div>
            <p className="text-base leading-relaxed text-neutral-600">
              To democratize sports intelligence and community in Toronto. We
              believe every athlete deserves access to the same tools, analytics,
              and network that professionals use. From the kid shooting hoops at
              Sherbourne Commons to the Raptors at Scotiabank Arena, Ball in the 6
              levels the playing field.
            </p>
          </motion.div>
        </section>

        {/* ===== FEATURE BREAKDOWN ===== */}
        <section className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="mb-16 text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                What We Built
              </h2>
              <p className="mt-4 text-base text-neutral-500">
                Every feature designed for Toronto&apos;s sports ecosystem.
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                      delay: i * 0.08,
                      ease: EASE_OUT_EXPO,
                    }}
                    className={cn(
                      'rounded-[20px] border border-black/[0.06] bg-white p-7',
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
                    <h3 className="mt-5 text-base font-bold text-neutral-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== AI6 INTELLIGENCE ===== */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className={cn(
                'rounded-[24px] bg-neutral-900 p-10 sm:p-14',
                'shadow-[0_20px_60px_rgba(0,0,0,0.15)]',
              )}
            >
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-10">
                <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-lime shadow-[0_4px_24px_rgba(200,255,0,0.3)] sm:mb-0">
                  <Sparkles className="h-8 w-8 text-black" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    Built with AI6 Intelligence
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-400 sm:text-base">
                    AI6 is our proprietary sports intelligence engine. It powers
                    everything from player analytics and game predictions to
                    personalized content feeds and smart court recommendations.
                    Every data point across every sport feeds into a unified
                    intelligence layer that gets smarter with every interaction.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
                    {['Predictions', 'Analytics', 'Personalization', 'Real-time'].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== TEAM / CREDITS ===== */}
        <section className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Who We Are
              </h2>
              <p className="mt-4 text-base text-neutral-500">
                Built in Toronto, for Toronto.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3">
              {TEAM_MEMBERS.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="rounded-[20px] border border-black/[0.06] bg-white p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[16px] bg-surface">
                    <Globe className="h-6 w-6 text-neutral-400" strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-lime-dark">
                    {member.role}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {member.location}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section className="px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Ready to get in the game?
            </h2>
            <p className="mt-4 text-base text-neutral-500">
              Join Toronto&apos;s sports community and unlock the full platform.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
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
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/welcome"
                className={cn(
                  'rounded-2xl border-2 border-neutral-200 px-8 py-4 text-sm font-bold text-neutral-700',
                  'transition-all duration-200',
                  'hover:border-neutral-300 hover:bg-neutral-50',
                  'active:scale-[0.97]',
                )}
              >
                Back Home
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-black/[0.04] bg-surface px-6 py-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime">
                <Zap className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-neutral-900">
                Ball in the 6
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Powered by AI6 &mdash; ENUW Inc &mdash; Toronto, Canada
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
