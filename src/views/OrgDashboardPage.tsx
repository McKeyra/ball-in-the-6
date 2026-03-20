'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  BarChart3,
  Users,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Plus,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ALL_PROGRAMS, ALL_REGISTRATIONS, ALL_INVOICES } from '@/lib/programs-data';
import Link from 'next/link';
import type { ProgramStatus } from '@/types/programs';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STATUS_DOT: Record<ProgramStatus, string> = {
  draft: 'bg-neutral-300',
  open: 'bg-emerald-400',
  active: 'bg-blue-400',
  full: 'bg-orange-400',
  completed: 'bg-neutral-300',
};

const formatCurrency = (amount: number): string =>
  `$${amount.toLocaleString('en-CA', { minimumFractionDigits: 0 })}`;

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */

const StatCard: React.FC<{
  label: string;
  value: string;
  icon: typeof BarChart3;
  trend?: string;
  index: number;
}> = ({ label, value, icon: Icon, trend, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
    className="rounded-[20px] border border-neutral-200/60 bg-white p-4"
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C8FF00]/10">
        <Icon className="h-4 w-4 text-neutral-700" />
      </div>
      {trend && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-black text-neutral-900 font-mono">{value}</p>
    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mt-0.5">
      {label}
    </p>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export const OrgDashboardPage: React.FC = () => {
  const stats = useMemo(() => {
    const totalRevenue = ALL_INVOICES.filter((inv) => inv.status === 'paid').reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const uniquePlayers = new Set(ALL_REGISTRATIONS.map((r) => r.playerId)).size;
    const activePrograms = ALL_PROGRAMS.filter(
      (p) => p.status === 'open' || p.status === 'active'
    ).length;

    return { totalRevenue, uniquePlayers, activePrograms };
  }, []);

  const recentRegistrations = useMemo(
    () =>
      [...ALL_REGISTRATIONS]
        .sort(
          (a, b) =>
            new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
        )
        .slice(0, 5),
    []
  );

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              >
                <ArrowLeft className="h-4 w-4 text-neutral-500" />
              </Link>
              <div>
                <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-[10px] font-mono text-neutral-400">
                  Toronto Metro Basketball League
                </p>
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#C8FF00]">
              <BarChart3 className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </motion.header>

      <div className="px-4 pt-5 space-y-5">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Programs"
            value={String(stats.activePrograms)}
            icon={BarChart3}
            trend="+2"
            index={0}
          />
          <StatCard
            label="Players"
            value={String(stats.uniquePlayers)}
            icon={Users}
            trend="+12"
            index={1}
          />
          <StatCard
            label="Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={DollarSign}
            trend="+18%"
            index={2}
          />
          <StatCard
            label="Messages"
            value="24"
            icon={MessageSquare}
            index={3}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex gap-2"
        >
          <Link
            href="/programs/create"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-[#C8FF00] py-3 text-[11px] font-black text-black uppercase tracking-wider transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-3.5 w-3.5" />
            New Program
          </Link>
          <Link
            href="/payments"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-neutral-200/60 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider transition-colors hover:bg-neutral-50"
          >
            <DollarSign className="h-3.5 w-3.5" />
            Payments
          </Link>
          <Link
            href="/programs"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-neutral-200/60 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider transition-colors hover:bg-neutral-50"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Programs
          </Link>
        </motion.div>

        {/* Active Programs Table */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400">
              Active Programs
            </h2>
            <Link
              href="/programs"
              className="text-[10px] font-bold text-neutral-400 hover:text-neutral-600"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2">
            {ALL_PROGRAMS.map((program) => {
              const programRegs = ALL_REGISTRATIONS.filter(
                (r) => r.programId === program.id
              );
              const programInvoices = ALL_INVOICES.filter((inv) =>
                programRegs.some((r) => r.id === inv.registrationId)
              );
              const programRevenue = programInvoices
                .filter((inv) => inv.status === 'paid')
                .reduce((sum, inv) => sum + inv.amount, 0);
              const spotsRemaining = program.spotsTotal - program.spotsFilled;

              return (
                <Link key={program.id} href={`/programs/${program.id}`}>
                  <div className="rounded-[20px] border border-neutral-200/60 p-4 transition-all hover:border-[#C8FF00]/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'h-2 w-2 rounded-full',
                            STATUS_DOT[program.status]
                          )}
                        />
                        <h3 className="text-sm font-bold text-neutral-900">
                          {program.name}
                        </h3>
                      </div>
                      <ChevronRight className="h-4 w-4 text-neutral-300" />
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-400">
                      <span>
                        {program.spotsFilled}/{program.spotsTotal} spots
                      </span>
                      <span>{spotsRemaining} remaining</span>
                      <span className="text-emerald-500 font-bold">
                        {formatCurrency(programRevenue)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Recent Registrations */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400">
              Recent Registrations
            </h2>
          </div>

          <div className="space-y-2">
            {recentRegistrations.map((reg) => {
              const program = ALL_PROGRAMS.find((p) => p.id === reg.programId);
              const statusColors: Record<string, string> = {
                confirmed: 'text-emerald-500 bg-emerald-50',
                pending: 'text-orange-500 bg-orange-50',
                waitlisted: 'text-blue-500 bg-blue-50',
                cancelled: 'text-neutral-400 bg-neutral-100',
              };

              return (
                <div
                  key={reg.id}
                  className="flex items-center justify-between rounded-xl bg-neutral-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-black text-neutral-600 border border-neutral-200/60">
                      {reg.playerName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        {reg.playerName}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {program?.name ?? 'Unknown'} &middot;{' '}
                        {new Date(reg.registeredAt).toLocaleDateString('en-CA')}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest',
                      statusColors[reg.status] ?? 'text-neutral-400 bg-neutral-100'
                    )}
                  >
                    {reg.status}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Revenue Chart Placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.3 }}
          className="rounded-[20px] border border-neutral-200/60 p-4"
        >
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">
            Revenue Overview
          </h2>
          <div className="flex items-center justify-center h-40 rounded-xl bg-neutral-50">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-neutral-200 mx-auto mb-2" />
              <p className="text-xs text-neutral-400">
                Revenue chart coming soon
              </p>
              <p className="text-[10px] text-neutral-300 mt-1">
                Total collected: {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
