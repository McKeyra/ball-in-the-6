'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  DollarSign,
  Download,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CreditCard,
  Send,
  Receipt,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ALL_INVOICES, ALL_REGISTRATIONS, ALL_PROGRAMS } from '@/lib/programs-data';
import Link from 'next/link';
import type { InvoiceStatus } from '@/types/programs';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

type ViewTab = 'parent' | 'org';

const INVOICE_STATUS_STYLES: Record<
  InvoiceStatus,
  { icon: typeof CheckCircle2; bg: string; text: string; label: string }
> = {
  paid: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    label: 'Paid',
  },
  pending: {
    icon: Clock,
    bg: 'bg-orange-50',
    text: 'text-orange-500',
    label: 'Pending',
  },
  overdue: {
    icon: AlertTriangle,
    bg: 'bg-red-50',
    text: 'text-red-500',
    label: 'Overdue',
  },
};

const formatCurrency = (amount: number): string =>
  `$${amount.toLocaleString('en-CA', { minimumFractionDigits: 0 })}`;

/* ------------------------------------------------------------------ */
/*  Invoice Row                                                        */
/* ------------------------------------------------------------------ */

const InvoiceRow: React.FC<{
  invoice: (typeof ALL_INVOICES)[number];
  showOrgActions: boolean;
  index: number;
}> = ({ invoice, showOrgActions, index }) => {
  const style = INVOICE_STATUS_STYLES[invoice.status];
  const StatusIcon = style.icon;

  const registration = ALL_REGISTRATIONS.find((r) => r.id === invoice.registrationId);
  const program = registration
    ? ALL_PROGRAMS.find((p) => p.id === registration.programId)
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="rounded-[20px] border border-neutral-200/60 p-4"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', style.bg)}>
            <StatusIcon className={cn('h-4 w-4', style.text)} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">
              {program?.name ?? 'Unknown Program'}
            </p>
            <p className="text-[10px] text-neutral-400">
              {registration?.playerName ?? 'Unknown'} &middot; Invoice {invoice.id}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest',
            style.bg,
            style.text
          )}
        >
          {style.label}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-black text-neutral-900 font-mono">
            {formatCurrency(invoice.amount)}
          </span>
          <p className="text-[10px] text-neutral-400 mt-0.5">
            Due {invoice.dueDate}
            {invoice.paidAt && (
              <>
                {' '}&middot; Paid {new Date(invoice.paidAt).toLocaleDateString('en-CA')}
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          {invoice.status === 'paid' && (
            <button
              type="button"
              className="flex h-8 items-center gap-1 rounded-lg bg-neutral-50 px-2.5 text-[10px] font-bold text-neutral-500 transition-colors hover:bg-neutral-100"
            >
              <Download className="h-3 w-3" />
              Receipt
            </button>
          )}
          {invoice.status !== 'paid' && !showOrgActions && (
            <button
              type="button"
              className="flex h-8 items-center gap-1 rounded-lg bg-[#C8FF00] px-3 text-[10px] font-black text-black uppercase tracking-wider transition-transform hover:scale-105"
            >
              <CreditCard className="h-3 w-3" />
              Pay
            </button>
          )}
          {invoice.status !== 'paid' && showOrgActions && (
            <button
              type="button"
              className="flex h-8 items-center gap-1 rounded-lg bg-blue-50 px-2.5 text-[10px] font-bold text-blue-600 transition-colors hover:bg-blue-100"
            >
              <Send className="h-3 w-3" />
              Remind
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export const PaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('parent');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

  const filteredInvoices = useMemo(() => {
    let result = [...ALL_INVOICES];
    if (statusFilter !== 'all') {
      result = result.filter((inv) => inv.status === statusFilter);
    }
    /* Sort: overdue first, then pending, then paid */
    const statusOrder: Record<InvoiceStatus, number> = { overdue: 0, pending: 1, paid: 2 };
    result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    return result;
  }, [statusFilter]);

  const summary = useMemo(() => {
    const totalOwed = ALL_INVOICES.filter((inv) => inv.status !== 'paid').reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const totalPaid = ALL_INVOICES.filter((inv) => inv.status === 'paid').reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const overdueCount = ALL_INVOICES.filter((inv) => inv.status === 'overdue').length;
    const nextDue = ALL_INVOICES.filter((inv) => inv.status === 'pending')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    return { totalOwed, totalPaid, overdueCount, nextDue };
  }, []);

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
              >
                <ArrowLeft className="h-4 w-4 text-neutral-500" />
              </Link>
              <div>
                <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                  Payments
                </h1>
                <p className="text-[10px] font-mono text-neutral-400">
                  {ALL_INVOICES.length} invoices
                </p>
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#C8FF00]">
              <Receipt className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
          </div>

          {/* View tabs */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab('parent')}
              className={cn(
                'flex-1 rounded-xl py-2 text-xs font-bold transition-all',
                activeTab === 'parent'
                  ? 'bg-[#C8FF00] text-black'
                  : 'bg-neutral-100/60 text-neutral-400'
              )}
            >
              My Payments
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('org')}
              className={cn(
                'flex-1 rounded-xl py-2 text-xs font-bold transition-all',
                activeTab === 'org'
                  ? 'bg-[#C8FF00] text-black'
                  : 'bg-neutral-100/60 text-neutral-400'
              )}
            >
              Received
            </button>
          </div>

          {/* Status filter pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {(['all', 'overdue', 'pending', 'paid'] as const).map((status) => {
              const count =
                status === 'all'
                  ? ALL_INVOICES.length
                  : ALL_INVOICES.filter((inv) => inv.status === status).length;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1 text-[10px] font-bold capitalize transition-all',
                    statusFilter === status
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-50 text-neutral-400'
                  )}
                >
                  {status === 'all' ? 'All' : status} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </motion.header>

      <div className="px-4 pt-5 space-y-4">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="rounded-[20px] border border-neutral-200/60 p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
              {activeTab === 'parent' ? 'Total Owed' : 'Outstanding'}
            </p>
            <p className="text-xl font-black text-neutral-900 font-mono">
              {formatCurrency(summary.totalOwed)}
            </p>
            {summary.overdueCount > 0 && (
              <p className="text-[10px] font-bold text-red-500 mt-1">
                {summary.overdueCount} overdue
              </p>
            )}
          </div>
          <div className="rounded-[20px] border border-neutral-200/60 p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
              {activeTab === 'parent' ? 'Total Paid' : 'Collected'}
            </p>
            <p className="text-xl font-black text-emerald-600 font-mono">
              {formatCurrency(summary.totalPaid)}
            </p>
          </div>
        </motion.div>

        {/* Next Due */}
        {summary.nextDue && activeTab === 'parent' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="rounded-[20px] border border-[#C8FF00]/30 bg-[#C8FF00]/5 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  Next Payment Due
                </p>
                <p className="text-sm font-bold text-neutral-900">
                  {formatCurrency(summary.nextDue.amount)} &mdash; {summary.nextDue.dueDate}
                </p>
              </div>
              <button
                type="button"
                className="flex h-9 items-center gap-1.5 rounded-xl bg-[#C8FF00] px-4 text-[11px] font-black text-black uppercase tracking-wider transition-transform hover:scale-105"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Pay Now
              </button>
            </div>
          </motion.div>
        )}

        {/* Send Reminders (org view) */}
        {activeTab === 'org' && summary.overdueCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="rounded-[20px] border border-red-200/40 bg-red-50 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-red-600">
                  {summary.overdueCount} overdue invoice{summary.overdueCount > 1 ? 's' : ''}
                </p>
                <p className="text-[10px] text-red-400 mt-0.5">
                  Send payment reminders to families
                </p>
              </div>
              <button
                type="button"
                className="flex h-9 items-center gap-1.5 rounded-xl bg-red-500 px-4 text-[11px] font-black text-white uppercase tracking-wider transition-transform hover:scale-105"
              >
                <Bell className="h-3.5 w-3.5" />
                Remind All
              </button>
            </div>
          </motion.div>
        )}

        {/* Invoices List */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">
            {activeTab === 'parent' ? 'My Invoices' : 'All Invoices'}
          </h2>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice, i) => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                    showOrgActions={activeTab === 'org'}
                    index={i}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-12 text-center"
                >
                  <p className="text-sm text-neutral-400">No invoices match this filter.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
