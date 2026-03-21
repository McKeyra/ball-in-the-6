'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Trophy,
  Calendar,
  Target,
} from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

interface ChartDataPoint {
  label: string;
  value: number;
}

interface AttendanceDataPoint {
  label: string;
  value: number;
  maxValue: number;
}

interface Registration {
  id: string;
  created_date?: string;
}

interface Payment {
  id: string;
  status?: string;
  amount?: number;
  program_name?: string;
  description?: string;
}

interface Team {
  id: string;
  name: string;
  wins?: number;
  losses?: number;
  ties?: number;
  points_for?: number;
  points_against?: number;
}

interface Program {
  id: string;
  name: string;
  status?: string;
  max_participants?: number;
}

interface EventItem {
  id: string;
  date?: string;
  start_time?: string;
  program_name?: string;
  program_id?: string;
}

function BarChartSimple({ data, maxValue, colorClass = 'bg-red-500' }: { data: ChartDataPoint[]; maxValue?: number; colorClass?: string }): React.ReactElement {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-1.5 h-40">
      {data.map((item, i) => {
        const height = (item.value / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-slate-400 font-medium">
              {item.value > 0 ? `$${item.value.toLocaleString()}` : ''}
            </span>
            <div className="w-full bg-slate-800 rounded-t relative" style={{ height: '100%' }}>
              <div
                className={cn('absolute bottom-0 w-full rounded-t transition-all', colorClass)}
                style={{ height: `${Math.max(height, 2)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function LineChartSimple({ data, colorClass = 'text-red-500' }: { data: ChartDataPoint[]; colorClass?: string }): React.ReactElement {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const width = 100;
  const height = 120;
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding + chartHeight - ((d.value - min) / range) * chartHeight;
    return `${x},${y}`;
  });

  const pathD = points.length > 0 ? `M ${points.join(' L ')}` : '';
  const areaD = pathD
    ? `${pathD} L ${padding + chartWidth},${padding + chartHeight} L ${padding},${padding + chartHeight} Z`
    : '';

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32" preserveAspectRatio="none">
        {areaD && (
          <path d={areaD} fill="currentColor" className={cn(colorClass, 'opacity-10')} />
        )}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={colorClass}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {data.map((d, i) => {
          const x = padding + (i / Math.max(data.length - 1, 1)) * chartWidth;
          const y = padding + chartHeight - ((d.value - min) / range) * chartHeight;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill="currentColor"
              className={colorClass}
            />
          );
        })}
      </svg>
      <div className="flex justify-between px-1 mt-1">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] text-slate-500">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function AttendanceBar({ label, value, maxValue }: AttendanceDataPoint): React.ReactElement {
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-300">{label}</span>
        <span className="text-xs font-medium text-white">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ReportsPage(): React.ReactElement {
  // TODO: Replace with fetch('/api/command-center/registrations')
  const { data: registrations = [], isLoading: loadingRegs } = useQuery<Registration[]>({
    queryKey: ['command-center', 'registrations-all'],
    queryFn: async () => { const r = await fetch('/api/command-center/registrations'); return r.ok ? r.json() : []; },
  });

  // TODO: Replace with fetch('/api/command-center/payments')
  const { data: payments = [], isLoading: loadingPayments } = useQuery<Payment[]>({
    queryKey: ['command-center', 'payments-all'],
    queryFn: async () => { const r = await fetch('/api/command-center/payments'); return r.ok ? r.json() : []; },
  });

  // TODO: Replace with fetch('/api/command-center/teams')
  const { data: teams = [], isLoading: loadingTeams } = useQuery<Team[]>({
    queryKey: ['command-center', 'teams'],
    queryFn: async () => { const r = await fetch('/api/command-center/teams'); return r.ok ? r.json() : []; },
  });

  // TODO: Replace with fetch('/api/command-center/programs')
  const { data: programs = [] } = useQuery<Program[]>({
    queryKey: ['command-center', 'programs'],
    queryFn: async () => { const r = await fetch('/api/command-center/programs'); return r.ok ? r.json() : []; },
  });

  // TODO: Replace with fetch('/api/command-center/events')
  const { data: events = [] } = useQuery<EventItem[]>({
    queryKey: ['command-center', 'events-all'],
    queryFn: async () => { const r = await fetch('/api/command-center/events'); return r.ok ? r.json() : []; },
  });

  const isLoading = loadingRegs || loadingPayments || loadingTeams;

  const regTrend = useMemo((): ChartDataPoint[] => {
    const monthCounts: Record<string, number> = {};
    registrations.forEach((reg) => {
      const date = reg.created_date ? new Date(reg.created_date) : null;
      if (!date) return;
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    });

    const now = new Date();
    const result: ChartDataPoint[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      result.push({
        label: MONTHS[d.getMonth()],
        value: monthCounts[key] || 0,
      });
    }
    return result;
  }, [registrations]);

  const revenueByProgram = useMemo((): ChartDataPoint[] => {
    const programRevenue: Record<string, number> = {};
    payments
      .filter((p) => p.status === 'completed')
      .forEach((p) => {
        const prog = p.program_name || p.description || 'Other';
        programRevenue[prog] = (programRevenue[prog] || 0) + (p.amount || 0);
      });

    return Object.entries(programRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, value]) => ({ label: label.length > 12 ? label.slice(0, 12) + '...' : label, value }));
  }, [payments]);

  const attendanceData = useMemo((): AttendanceDataPoint[] => {
    if (programs.length === 0) return [];
    return programs.slice(0, 6).map((p) => {
      const eventCount = events.filter(
        (e) => e.program_name === p.name || e.program_id === p.id
      ).length;
      return {
        label: p.name,
        value: eventCount,
        maxValue: Math.max(eventCount, p.max_participants || 20),
      };
    });
  }, [programs, events]);

  const sortedTeams = useMemo(() => {
    return [...teams]
      .map((t) => ({
        ...t,
        wins: t.wins || 0,
        losses: t.losses || 0,
        ties: t.ties || 0,
        pf: t.points_for || 0,
        pa: t.points_against || 0,
      }))
      .sort((a, b) => {
        const ptsA = a.wins * 2 + a.ties;
        const ptsB = b.wins * 2 + b.ties;
        return ptsB - ptsA;
      });
  }, [teams]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-slate-400 text-sm mt-1">
          Analytics and insights for your organization
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">Total Registrations</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-7 w-16 bg-slate-800" />
            ) : (
              <p className="text-2xl font-bold text-white">{registrations.length}</p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Total Revenue</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-7 w-20 bg-slate-800" />
            ) : (
              <p className="text-2xl font-bold text-white">
                ${payments
                  .filter((p) => p.status === 'completed')
                  .reduce((s, p) => s + (p.amount || 0), 0)
                  .toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-red-400" />
              <span className="text-xs text-slate-400">Active Programs</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-7 w-12 bg-slate-800" />
            ) : (
              <p className="text-2xl font-bold text-white">
                {programs.filter((p) => p.status === 'open' || p.status === 'in_progress').length}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Events This Month</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-7 w-12 bg-slate-800" />
            ) : (
              <p className="text-2xl font-bold text-white">
                {events.filter((e) => {
                  const d = e.date || e.start_time?.split('T')[0];
                  if (!d) return false;
                  const now = new Date();
                  return d.startsWith(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
                }).length}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Registration Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 bg-slate-800 rounded" />
            ) : regTrend.length > 0 ? (
              <LineChartSimple data={regTrend} colorClass="text-blue-500" />
            ) : (
              <div className="h-32 flex items-center justify-center">
                <p className="text-sm text-slate-500">No registration data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-400" />
              Revenue by Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 bg-slate-800 rounded" />
            ) : revenueByProgram.length > 0 ? (
              <BarChartSimple data={revenueByProgram} colorClass="bg-green-500" />
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-sm text-slate-500">No revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-400" />
              Attendance Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 bg-slate-800 rounded" />
                ))}
              </div>
            ) : attendanceData.length > 0 ? (
              <div className="space-y-3">
                {attendanceData.map((item, i) => (
                  <AttendanceBar
                    key={i}
                    label={item.label}
                    value={item.value}
                    maxValue={item.maxValue}
                  />
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-sm text-slate-500">No attendance data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-red-400" />
              Team Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 bg-slate-800 rounded" />
                ))}
              </div>
            ) : sortedTeams.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400 w-8">#</TableHead>
                      <TableHead className="text-slate-400">Team</TableHead>
                      <TableHead className="text-slate-400 text-center">W</TableHead>
                      <TableHead className="text-slate-400 text-center">L</TableHead>
                      <TableHead className="text-slate-400 text-center">T</TableHead>
                      <TableHead className="text-slate-400 text-center">PTS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTeams.slice(0, 8).map((team, idx) => (
                      <TableRow key={team.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="text-xs text-slate-500 font-mono">{idx + 1}</TableCell>
                        <TableCell className="text-sm text-white font-medium">{team.name}</TableCell>
                        <TableCell className="text-sm text-green-400 text-center">{team.wins}</TableCell>
                        <TableCell className="text-sm text-red-400 text-center">{team.losses}</TableCell>
                        <TableCell className="text-sm text-slate-400 text-center">{team.ties}</TableCell>
                        <TableCell className="text-sm text-white font-bold text-center">
                          {team.wins * 2 + team.ties}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-sm text-slate-500">No team data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
