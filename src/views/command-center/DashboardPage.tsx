'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/auth-store';
import {
  Users,
  Trophy,
  Shield,
  DollarSign,
  Calendar,
  ClipboardList,
  MessageSquare,
  Settings,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  UserPlus,
  CreditCard,
  Clock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HealthSegment {
  label: string;
  key: string;
  color: string;
  value: number;
}

const ORG_HEALTH_SEGMENTS = [
  { label: 'Registrations', key: 'registrations', color: '#dc2626' },
  { label: 'Payments', key: 'payments', color: '#16a34a' },
  { label: 'Attendance', key: 'attendance', color: '#2563eb' },
  { label: 'Engagement', key: 'engagement', color: '#d97706' },
];

function VitalityRing({ segments, size = 160, strokeWidth = 14 }: { segments: HealthSegment[]; size?: number; strokeWidth?: number }): React.ReactElement {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const gapAngle = 8;
  const totalGapDegrees = gapAngle * segments.length;
  const availableDegrees = 360 - totalGapDegrees;
  const segmentDegrees = availableDegrees / segments.length;

  let cumulativeAngle = -90;

  const overallScore = Math.round(
    segments.reduce((sum, s) => sum + s.value, 0) / segments.length
  );

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((seg, i) => {
          const startAngle = cumulativeAngle;
          const sweepAngle = segmentDegrees * (seg.value / 100);
          const bgSweep = segmentDegrees;

          cumulativeAngle += segmentDegrees + gapAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const bgEndRad = ((startAngle + bgSweep) * Math.PI) / 180;
          const endRad = ((startAngle + sweepAngle) * Math.PI) / 180;

          const bgX1 = center + radius * Math.cos(startRad);
          const bgY1 = center + radius * Math.sin(startRad);
          const bgX2 = center + radius * Math.cos(bgEndRad);
          const bgY2 = center + radius * Math.sin(bgEndRad);
          const bgLargeArc = bgSweep > 180 ? 1 : 0;

          const x1 = center + radius * Math.cos(startRad);
          const y1 = center + radius * Math.sin(startRad);
          const x2 = center + radius * Math.cos(endRad);
          const y2 = center + radius * Math.sin(endRad);
          const largeArc = sweepAngle > 180 ? 1 : 0;

          return (
            <g key={i}>
              <path
                d={`M ${bgX1} ${bgY1} A ${radius} ${radius} 0 ${bgLargeArc} 1 ${bgX2} ${bgY2}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-800"
                strokeLinecap="round"
              />
              {sweepAngle > 0 && (
                <path
                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{overallScore}%</span>
        <span className="text-xs text-slate-400">Org Health</span>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, trendLabel, icon: Icon, loading }: {
  title: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  icon: LucideIcon;
  loading: boolean;
}): React.ReactElement {
  if (loading) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-20 mb-2 bg-slate-800" />
          <Skeleton className="h-8 w-16 mb-1 bg-slate-800" />
          <Skeleton className="h-3 w-24 bg-slate-800" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = trend >= 0;

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">{title}</span>
          <div className="p-2 bg-slate-800 rounded-lg">
            <Icon className="w-4 h-4 text-red-500" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-400" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              isPositive ? 'text-green-500' : 'text-red-400'
            )}
          >
            {isPositive ? '+' : ''}
            {trend}%
          </span>
          <span className="text-xs text-slate-500">{trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

const QUICK_ACTIONS: { label: string; icon: LucideIcon; href: string; color: string }[] = [
  { label: 'Add Athlete', icon: UserPlus, href: '/command-center/registrations', color: 'text-blue-400' },
  { label: 'New Program', icon: ClipboardList, href: '/command-center/programs', color: 'text-green-400' },
  { label: 'Schedule Event', icon: Calendar, href: '/command-center/schedule', color: 'text-purple-400' },
  { label: 'Send Message', icon: MessageSquare, href: '/command-center/messages', color: 'text-yellow-400' },
  { label: 'Record Payment', icon: CreditCard, href: '/command-center/payments', color: 'text-emerald-400' },
  { label: 'Org Settings', icon: Settings, href: '/command-center/settings', color: 'text-slate-400' },
];

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-600/20 text-green-400 border-green-600/30',
  pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  overdue: 'bg-red-600/20 text-red-400 border-red-600/30',
};

const REG_STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-600/20 text-green-400 border-green-600/30',
  pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  waitlisted: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  rejected: 'bg-red-600/20 text-red-400 border-red-600/30',
};

// TODO: Define proper types from Prisma schema
interface EntityRecord {
  id: string;
  name?: string;
  status?: string;
  amount?: number;
  created_date?: string;
  athlete_name?: string;
  program_name?: string;
  program?: string;
  parent_name?: string;
  payer?: string;
  title?: string;
  start_time?: string;
  date?: string;
  time?: string;
  venue?: string;
  type?: string;
}

export function DashboardPage(): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  // TODO: Replace with fetch('/api/command-center/athletes')
  const { data: athletes = [], isLoading: loadingAthletes } = useQuery<EntityRecord[]>({
    queryKey: ['command-center', 'athletes'],
    queryFn: async () => { const r = await fetch('/api/command-center/athletes'); return r.ok ? r.json() : []; },
  });

  const { data: programs = [], isLoading: loadingPrograms } = useQuery<EntityRecord[]>({
    queryKey: ['command-center', 'programs'],
    queryFn: async () => { const r = await fetch('/api/command-center/programs'); return r.ok ? r.json() : []; },
  });

  const { data: teams = [], isLoading: loadingTeams } = useQuery<EntityRecord[]>({
    queryKey: ['command-center', 'teams'],
    queryFn: async () => { const r = await fetch('/api/command-center/teams'); return r.ok ? r.json() : []; },
  });

  const { data: payments = [], isLoading: loadingPayments } = useQuery<EntityRecord[]>({
    queryKey: ['command-center', 'payments-recent'],
    queryFn: async () => { const r = await fetch('/api/command-center/payments?limit=20'); return r.ok ? r.json() : []; },
  });

  const { data: registrations = [], isLoading: loadingRegistrations } = useQuery<EntityRecord[]>({
    queryKey: ['command-center', 'registrations-recent'],
    queryFn: async () => { const r = await fetch('/api/command-center/registrations?limit=10'); return r.ok ? r.json() : []; },
  });

  const { data: events = [], isLoading: loadingEvents } = useQuery<EntityRecord[]>({
    queryKey: ['command-center', 'events-today'],
    queryFn: async () => { const r = await fetch('/api/command-center/events?limit=10'); return r.ok ? r.json() : []; },
  });

  const isLoading = loadingAthletes || loadingPrograms || loadingTeams || loadingPayments;

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const healthSegments: HealthSegment[] = ORG_HEALTH_SEGMENTS.map((seg) => {
    let value = 0;
    switch (seg.key) {
      case 'registrations':
        value = athletes.length > 0 ? Math.min(100, Math.round((athletes.length / 200) * 100)) : 0;
        break;
      case 'payments': {
        const completed = payments.filter((p) => p.status === 'completed').length;
        value = payments.length > 0 ? Math.round((completed / payments.length) * 100) : 0;
        break;
      }
      case 'attendance':
        value = events.length > 0 ? 72 : 0;
        break;
      case 'engagement':
        value = programs.length > 0 ? Math.min(100, programs.length * 12) : 0;
        break;
    }
    return { ...seg, value };
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter((e) => {
    const eventDate = e.date || e.start_time?.split('T')[0];
    return eventDate === todayStr;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back{user?.fullName ? `, ${user.fullName}` : ''}. Here is your organization overview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Athletes" value={athletes.length} trend={12} trendLabel="vs last month" icon={Users} loading={isLoading} />
        <KPICard title="Programs" value={programs.length} trend={8} trendLabel="vs last season" icon={Trophy} loading={isLoading} />
        <KPICard title="Teams" value={teams.length} trend={5} trendLabel="active" icon={Shield} loading={isLoading} />
        <KPICard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} trend={-3} trendLabel="vs last month" icon={DollarSign} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Organization Health</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {isLoading ? (
              <Skeleton className="w-40 h-40 rounded-full bg-slate-800" />
            ) : (
              <VitalityRing segments={healthSegments} />
            )}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
              {healthSegments.map((seg) => (
                <div key={seg.key} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-xs text-slate-400">{seg.label}</span>
                  <span className="text-xs font-medium text-white ml-auto">{seg.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-3 px-3 flex flex-col items-center gap-2 bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-red-600/50"
                  onClick={() => router.push(action.href)}
                >
                  <action.icon className={cn('w-5 h-5', action.color)} />
                  <span className="text-xs text-slate-300">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base text-white">Today&apos;s Events</CardTitle>
            <Badge variant="outline" className="border-slate-700 text-slate-400">
              {todayEvents.length}
            </Badge>
          </CardHeader>
          <CardContent>
            {loadingEvents ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 bg-slate-800 rounded-lg" />
                ))}
              </div>
            ) : todayEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No events scheduled today</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-red-600/20">
                      <Clock className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{event.title || event.name}</p>
                      <p className="text-xs text-slate-400">
                        {event.start_time
                          ? new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : event.time || 'TBD'}
                        {event.venue ? ` - ${event.venue}` : ''}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">
                      {event.type || 'event'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base text-white">Recent Registrations</CardTitle>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-slate-800" onClick={() => router.push('/command-center/registrations')}>
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingRegistrations ? (
              <div className="space-y-3">{[1, 2, 3, 4].map((i) => (<Skeleton key={i} className="h-10 bg-slate-800 rounded" />))}</div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8"><ClipboardList className="w-8 h-8 text-slate-600 mx-auto mb-2" /><p className="text-sm text-slate-500">No registrations yet</p></div>
            ) : (
              <div className="space-y-2">
                {registrations.slice(0, 5).map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{(reg.athlete_name || reg.name || 'A').charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{reg.athlete_name || reg.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{reg.program_name || reg.program || 'N/A'}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn('text-[10px]', REG_STATUS_COLORS[reg.status || ''] || 'border-slate-700 text-slate-400')}>
                      {reg.status || 'pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base text-white">Recent Payments</CardTitle>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-slate-800" onClick={() => router.push('/command-center/payments')}>
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingPayments ? (
              <div className="space-y-3">{[1, 2, 3, 4].map((i) => (<Skeleton key={i} className="h-10 bg-slate-800 rounded" />))}</div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8"><DollarSign className="w-8 h-8 text-slate-600 mx-auto mb-2" /><p className="text-sm text-slate-500">No payments recorded</p></div>
            ) : (
              <div className="space-y-2">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                    <div>
                      <p className="text-sm font-medium text-white">{payment.parent_name || payment.payer || 'Unknown'}</p>
                      <p className="text-xs text-slate-400">{payment.created_date ? new Date(payment.created_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">${(payment.amount || 0).toLocaleString()}</span>
                      <Badge variant="outline" className={cn('text-[10px]', PAYMENT_STATUS_COLORS[payment.status || ''] || 'border-slate-700 text-slate-400')}>
                        {payment.status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
