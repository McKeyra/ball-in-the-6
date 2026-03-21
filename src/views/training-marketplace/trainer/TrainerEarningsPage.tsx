'use client';

import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';

// TODO: Replace with actual API route

const PLATFORM_FEE_RATE = 0.15;

const PAYOUT_STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-600/20 text-green-400 border-green-600/30',
  pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  processing: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  failed: 'bg-red-600/20 text-red-400 border-red-600/30',
};

interface SessionData {
  id: string;
  session_date?: string;
  amount?: number;
  status?: string;
}

interface PayoutData {
  id: string;
  created_date?: string;
  amount?: number;
  method?: string;
  status?: string;
  reference?: string;
}

interface EarningsSummary {
  totalGross: number;
  totalFee: number;
  totalNet: number;
  monthGross: number;
  monthNet: number;
  avgPerSession: number;
  completedCount: number;
  monthChange: number;
}

interface MonthSummary {
  key: string;
  label: string;
  count: number;
  gross: number;
}

interface RevenueCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
}

function RevenueCard({ title, value, subtitle, trend, icon: Icon, loading }: RevenueCardProps): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="h-4 w-20 mb-2 bg-slate-800 rounded animate-pulse" />
        <div className="h-7 w-24 mb-1 bg-slate-800 rounded animate-pulse" />
        <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
      </div>
    );
  }
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">{title}</span>
        <div className="p-2 bg-slate-800 rounded-lg">
          <Icon className="w-4 h-4 text-red-500" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="flex items-center gap-2 mt-1">
        {trend !== undefined && (
          <span className={cn(
            'flex items-center gap-0.5 text-xs font-medium',
            trend >= 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
        <span className="text-xs text-slate-500">{subtitle}</span>
      </div>
    </div>
  );
}

interface BreakdownRowProps {
  label: string;
  value: string;
  color: string;
  bold?: boolean;
}

function BreakdownRow({ label, value, color, bold }: BreakdownRowProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between">
      <span className={cn('text-sm', bold ? 'font-semibold text-white' : 'text-slate-400')}>
        {label}
      </span>
      <span className={cn('text-sm font-medium', color, bold && 'text-lg')}>{value}</span>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatRow({ label, value, highlight }: StatRowProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={cn('text-sm font-medium', highlight ? 'text-green-400' : 'text-white')}>
        {value}
      </span>
    </div>
  );
}

function getRecentMonths(sessions: SessionData[], count: number): MonthSummary[] {
  const now = new Date();
  const months: MonthSummary[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const monthSessions = sessions.filter((s) => s.session_date?.startsWith(key));
    months.push({
      key,
      label,
      count: monthSessions.length,
      gross: monthSessions.reduce((sum, s) => sum + (s.amount ?? 0), 0),
    });
  }
  return months;
}

export function TrainerEarningsPage(): React.ReactElement {
  const userId = 'current-user';

  const { data: sessions = [], isLoading: loadingSessions } = useQuery<SessionData[]>({
    queryKey: ['trainer', 'earnings-sessions'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/trainer/sessions?status=completed')
      return [];
    },
    enabled: !!userId,
  });

  const { data: payouts = [], isLoading: loadingPayouts } = useQuery<PayoutData[]>({
    queryKey: ['trainer', 'payouts'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/trainer/payouts')
      return [];
    },
    enabled: !!userId,
  });

  const earnings = useMemo((): EarningsSummary => {
    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);

    const totalGross = sessions.reduce((sum, s) => sum + (s.amount ?? 0), 0);
    const totalFee = totalGross * PLATFORM_FEE_RATE;
    const totalNet = totalGross - totalFee;

    const monthGross = sessions
      .filter((s) => s.session_date?.startsWith(thisMonth))
      .reduce((sum, s) => sum + (s.amount ?? 0), 0);
    const monthNet = monthGross - monthGross * PLATFORM_FEE_RATE;

    const lastMonthGross = sessions
      .filter((s) => s.session_date?.startsWith(lastMonth))
      .reduce((sum, s) => sum + (s.amount ?? 0), 0);

    const completedCount = sessions.length;
    const avgPerSession = completedCount > 0 ? totalGross / completedCount : 0;

    const monthChange = lastMonthGross > 0
      ? Math.round(((monthGross - lastMonthGross) / lastMonthGross) * 100)
      : monthGross > 0 ? 100 : 0;

    return {
      totalGross,
      totalFee,
      totalNet,
      monthGross,
      monthNet,
      avgPerSession,
      completedCount,
      monthChange,
    };
  }, [sessions]);

  const isLoading = loadingSessions || loadingPayouts;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Earnings</h1>
        <p className="text-slate-400 text-sm mt-1">Track your revenue and payout history.</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RevenueCard
          title="This Month"
          value={`$${earnings.monthGross.toLocaleString()}`}
          subtitle={`Net: $${earnings.monthNet.toLocaleString()}`}
          trend={earnings.monthChange}
          icon={Calendar}
          loading={isLoading}
        />
        <RevenueCard
          title="Total Revenue"
          value={`$${earnings.totalGross.toLocaleString()}`}
          subtitle={`Net: $${earnings.totalNet.toLocaleString()}`}
          icon={DollarSign}
          loading={isLoading}
        />
        <RevenueCard
          title="Avg Per Session"
          value={`$${Math.round(earnings.avgPerSession)}`}
          subtitle={`${earnings.completedCount} sessions`}
          icon={TrendingUp}
          loading={isLoading}
        />
        <RevenueCard
          title="Platform Fee"
          value={`${(PLATFORM_FEE_RATE * 100).toFixed(0)}%`}
          subtitle={`-$${earnings.totalFee.toLocaleString()} total`}
          icon={CreditCard}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg lg:col-span-2">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Revenue Breakdown</h2>
          </div>
          <div className="p-4 pt-2 space-y-4">
            <div className="space-y-3">
              <BreakdownRow
                label="Gross Revenue"
                value={`$${earnings.totalGross.toLocaleString()}`}
                color="text-white"
              />
              <BreakdownRow
                label={`Platform Fee (${(PLATFORM_FEE_RATE * 100).toFixed(0)}%)`}
                value={`-$${earnings.totalFee.toLocaleString()}`}
                color="text-red-400"
              />
              <div className="border-t border-slate-800" />
              <BreakdownRow
                label="Net Income"
                value={`$${earnings.totalNet.toLocaleString()}`}
                color="text-green-400"
                bold
              />
            </div>

            {/* Monthly Summary */}
            <div className="border-t border-slate-800" />
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Recent Months
            </p>
            <div className="space-y-2">
              {getRecentMonths(sessions, 6).map((month) => (
                <div
                  key={month.key}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30"
                >
                  <span className="text-sm text-slate-300">{month.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {month.count} session{month.count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm font-medium text-white">
                      ${month.gross.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Quick Stats</h2>
          </div>
          <div className="p-4 pt-2 space-y-4">
            <div className="space-y-3">
              <StatRow label="Total Sessions" value={earnings.completedCount} />
              <StatRow label="Total Gross" value={`$${earnings.totalGross.toLocaleString()}`} />
              <StatRow label="Total Fees" value={`$${earnings.totalFee.toLocaleString()}`} />
              <StatRow label="Net Earned" value={`$${earnings.totalNet.toLocaleString()}`} highlight />
              <div className="border-t border-slate-800" />
              <StatRow label="Avg/Session (Gross)" value={`$${Math.round(earnings.avgPerSession)}`} />
              <StatRow
                label="Avg/Session (Net)"
                value={`$${Math.round(earnings.avgPerSession * (1 - PLATFORM_FEE_RATE))}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4 pb-2">
          <h2 className="text-base font-semibold text-white">Payout History</h2>
        </div>
        <div className="p-4 pt-2">
          {loadingPayouts ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-800 rounded animate-pulse" />
              ))}
            </div>
          ) : payouts.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No payouts yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">Date</th>
                    <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">Amount</th>
                    <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">Method</th>
                    <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">Status</th>
                    <th className="text-right text-xs font-medium text-slate-400 py-2 px-3">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-slate-800">
                      <td className="text-sm text-slate-300 py-3 px-3">
                        {payout.created_date
                          ? new Date(payout.created_date).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="text-sm font-medium text-white py-3 px-3">
                        ${(payout.amount ?? 0).toLocaleString()}
                      </td>
                      <td className="text-sm text-slate-400 capitalize py-3 px-3">
                        {payout.method ?? 'e-transfer'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            'inline-flex items-center border text-[10px] px-2 py-0.5 rounded-full',
                            PAYOUT_STATUS_COLORS[payout.status ?? 'pending'] ?? PAYOUT_STATUS_COLORS.pending
                          )}
                        >
                          {payout.status ?? 'pending'}
                        </span>
                      </td>
                      <td className="text-sm text-slate-500 text-right font-mono py-3 px-3">
                        {payout.reference ?? '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
