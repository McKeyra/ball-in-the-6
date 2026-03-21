'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ProtectionScore } from '../components/ProtectionScore';
import { AlertCard } from '../components/AlertCard';
import { Users, Laptop, AlertTriangle, ClipboardCheck, Calendar } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface Senior {
  id: string;
  senior_id: string;
  senior_name?: string;
  protection_score?: number;
}

interface DeviceRecord {
  id: string;
  senior_id: string;
}

interface AlertRecord {
  id: string;
  senior_id: string;
  severity?: string;
  title?: string;
  message?: string;
  description?: string;
  created_date?: string;
}

interface VetRecord {
  id: string;
}

interface VisitRecord {
  id: string;
  senior_name?: string;
  type?: string;
  date?: string;
  time?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: typeof Users;
  loading?: boolean;
  color?: string;
}

function StatCard({ title, value, icon: Icon, loading, color }: StatCardProps): React.ReactElement {
  if (loading) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-20 mb-2 bg-slate-800" />
          <Skeleton className="h-7 w-12 bg-slate-800" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">{title}</span>
          <div className="p-2 bg-slate-800 rounded-lg"><Icon className="w-4 h-4 text-red-500" /></div>
        </div>
        <div className={cn('text-2xl font-bold', color ?? 'text-white')}>{value}</div>
      </CardContent>
    </Card>
  );
}

export function FamilyDashboardPage(): React.ReactElement {
  const { user } = useAuth();

  const { data: seniors = [], isLoading: loadingSeniors } = useQuery<Senior[]>({
    queryKey: ['vtf', 'family-seniors'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/seniors')
      return [];
    },
    enabled: !!user?.id,
  });

  const { data: devices = [] } = useQuery<DeviceRecord[]>({
    queryKey: ['vtf', 'family-devices'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/devices')
      return [];
    },
    enabled: seniors.length > 0,
  });

  const { data: alerts = [] } = useQuery<AlertRecord[]>({
    queryKey: ['vtf', 'family-alerts'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/alerts')
      return [];
    },
    enabled: seniors.length > 0,
  });

  const { data: pendingVets = [] } = useQuery<VetRecord[]>({
    queryKey: ['vtf', 'pending-vets'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/pending-vets')
      return [];
    },
    enabled: !!user?.id,
  });

  const { data: visits = [] } = useQuery<VisitRecord[]>({
    queryKey: ['vtf', 'scheduled-visits'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/visits?status=scheduled')
      return [];
    },
    enabled: !!user?.id,
  });

  const activeAlerts = alerts.filter((a) => a.severity === 'urgent' || a.severity === 'critical');
  const isLoading = loadingSeniors;

  return (
    <div className="bg-slate-950 min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Family Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor and protect your loved ones.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Linked Seniors" value={seniors.length} icon={Users} loading={isLoading} />
        <StatCard title="Total Devices" value={devices.length} icon={Laptop} loading={isLoading} />
        <StatCard title="Active Alerts" value={activeAlerts.length} icon={AlertTriangle} loading={isLoading} color={activeAlerts.length > 0 ? 'text-red-400' : 'text-green-400'} />
        <StatCard title="Pending Vets" value={pendingVets.length} icon={ClipboardCheck} loading={isLoading} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Linked Seniors</h2>
        {seniors.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="py-8 text-center">
              <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No seniors linked yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seniors.map((senior) => {
              const seniorDevices = devices.filter((d) => d.senior_id === senior.senior_id);
              const seniorAlerts = alerts.filter((a) => a.senior_id === senior.senior_id);
              return (
                <Card key={senior.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <ProtectionScore score={senior.protection_score ?? 0} size={80} strokeWidth={6} showLabel={false} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{senior.senior_name ?? 'Senior'}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span>{seniorDevices.length} device{seniorDevices.length !== 1 ? 's' : ''}</span>
                          {seniorAlerts.length > 0 && (
                            <Badge variant="outline" className="border-red-600/30 text-red-400 text-[10px]">
                              {seniorAlerts.length} alert{seniorAlerts.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {alerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Recent Alerts</h2>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => (
              <AlertCard key={alert.id} alert={alert as Parameters<typeof AlertCard>[0]['alert']} variant="dark" />
            ))}
          </div>
        </div>
      )}

      {visits.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Scheduled Visits ({visits.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {visits.slice(0, 3).map((visit) => (
              <div key={visit.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm text-white">{visit.senior_name} - {visit.type ?? 'Visit'}</p>
                  <p className="text-xs text-slate-400">{visit.date} {visit.time && `at ${visit.time}`}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
