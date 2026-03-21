'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Users, ShieldAlert, ClipboardCheck, Activity, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface StatCardConfig {
  key: string;
  label: string;
  icon: typeof Users;
  color: 'blue' | 'red' | 'yellow' | 'green';
}

const STAT_CARDS: StatCardConfig[] = [
  { key: 'users', label: 'Total Users', icon: Users, color: 'blue' },
  { key: 'alerts', label: 'Alerts Today', icon: ShieldAlert, color: 'red' },
  { key: 'pendingVets', label: 'Pending Vets', icon: ClipboardCheck, color: 'yellow' },
  { key: 'health', label: 'System Health', icon: Activity, color: 'green' },
];

const STAT_COLORS: Record<string, string> = {
  blue: 'bg-blue-600/20 text-blue-400',
  red: 'bg-red-600/20 text-red-400',
  yellow: 'bg-yellow-600/20 text-yellow-400',
  green: 'bg-green-600/20 text-green-400',
};

const VET_STATUS_COLORS: Record<string, string> = {
  pending: 'border-yellow-600/30 text-yellow-400',
  approved: 'border-green-600/30 text-green-400',
  rejected: 'border-red-600/30 text-red-400',
};

interface ScamReport {
  id: string;
  description?: string;
  type?: string;
  severity?: string;
  status?: string;
  created_date?: string;
}

interface ContractorVet {
  id: string;
  name: string;
  type?: string;
  company?: string;
  phone?: string;
  notes?: string;
  status: string;
  created_date?: string;
}

interface SubscriptionRecord {
  id: string;
  plan_name?: string;
  price?: number;
}

interface DeviceRecord {
  id: string;
  protection_score?: number;
}

export function VTFAdminPanelPage(): React.ReactElement {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // TODO: Replace with actual API calls
  const { data: allReports = [], isLoading: reportsLoading } = useQuery<ScamReport[]>({
    queryKey: ['vtf-admin', 'all-reports'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/admin/scam-reports')
      return [];
    },
    enabled: !!user?.id,
  });

  const { data: allVets = [], isLoading: vetsLoading } = useQuery<ContractorVet[]>({
    queryKey: ['vtf-admin', 'all-vets'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/admin/contractor-vets')
      return [];
    },
    enabled: !!user?.id,
  });

  const { data: allSubs = [], isLoading: subsLoading } = useQuery<SubscriptionRecord[]>({
    queryKey: ['vtf-admin', 'all-subscriptions'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/admin/subscriptions')
      return [];
    },
    enabled: !!user?.id,
  });

  const { data: allDevices = [] } = useQuery<DeviceRecord[]>({
    queryKey: ['vtf-admin', 'all-devices'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/admin/devices')
      return [];
    },
    enabled: !!user?.id,
  });

  const vetActionMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // TODO: fetch(`/api/vtf/admin/contractor-vets/${id}`, { method: 'PATCH', body: JSON.stringify({ status, reviewed_date: new Date().toISOString(), reviewed_by: user?.id }) })
      return { id, status };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vtf-admin', 'all-vets'] }),
  });

  const isLoading = reportsLoading || vetsLoading || subsLoading;

  const todayStr = new Date().toISOString().split('T')[0];
  const alertsToday = allReports.filter((r) => r.created_date?.startsWith(todayStr));
  const pendingVets = allVets.filter((v) => v.status === 'pending');
  const recentReports = allReports.slice(0, 10);
  const avgProtection = allDevices.length > 0
    ? Math.round(allDevices.reduce((sum, d) => sum + (d.protection_score ?? 0), 0) / allDevices.length)
    : 0;

  const stats: Record<string, string | number> = {
    users: allSubs.length,
    alerts: alertsToday.length,
    pendingVets: pendingVets.length,
    health: `${avgProtection}%`,
  };

  return (
    <div className="bg-slate-950 min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">VTF Admin Panel</h1>
        <p className="text-slate-400 text-sm mt-1">System overview and management.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 bg-slate-800 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
            <Card key={key} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn('p-3 rounded-lg', STAT_COLORS[color])}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-xl font-bold text-white">{stats[key]}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Contractor Vets */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-yellow-400" />
              Pending Contractor Vets ({pendingVets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingVets.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No pending vets</p>
            ) : (
              <div className="space-y-2">
                {pendingVets.map((vet) => (
                  <div key={vet.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{vet.name}</p>
                        <p className="text-xs text-slate-400">{vet.type} {vet.company && `| ${vet.company}`} {vet.phone && `| ${vet.phone}`}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-yellow-600/30 text-yellow-400">Pending</Badge>
                    </div>
                    {vet.notes && <p className="text-xs text-slate-400">{vet.notes}</p>}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        onClick={() => vetActionMutation.mutate({ id: vet.id, status: 'approved' })}
                        disabled={vetActionMutation.isPending}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600/30 text-red-400 hover:bg-red-600/10 flex-1"
                        onClick={() => vetActionMutation.mutate({ id: vet.id, status: 'rejected' })}
                        disabled={vetActionMutation.isPending}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Scam Reports */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Recent Scam Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No scam reports</p>
            ) : (
              <div className="space-y-2">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <AlertTriangle className={cn(
                        'w-4 h-4 shrink-0',
                        report.severity === 'critical' ? 'text-red-400' :
                        report.severity === 'urgent' ? 'text-orange-400' :
                        report.severity === 'warning' ? 'text-amber-400' : 'text-blue-400',
                      )} />
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{report.description ?? 'No description'}</p>
                        <p className="text-xs text-slate-400">
                          {report.type ?? 'unknown'} | {report.created_date ? new Date(report.created_date).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] shrink-0 ml-2',
                        report.status === 'reviewed' ? 'border-green-600/30 text-green-400' :
                        report.status === 'investigating' ? 'border-blue-600/30 text-blue-400' :
                        'border-red-600/30 text-red-400',
                      )}
                    >
                      {report.status ?? 'new'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Contractor Vets History */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white">All Contractor Vets ({allVets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {vetsLoading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 bg-slate-800 rounded" />)}</div>
          ) : allVets.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No contractor vets submitted</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-800">
                    <th className="pb-2 pr-4">Contractor</th>
                    <th className="pb-2 pr-4">Type</th>
                    <th className="pb-2 pr-4">Company</th>
                    <th className="pb-2 pr-4">Submitted</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {allVets.map((vet) => (
                    <tr key={vet.id}>
                      <td className="py-2 pr-4 text-white font-medium">{vet.name}</td>
                      <td className="py-2 pr-4 text-slate-400">{vet.type}</td>
                      <td className="py-2 pr-4 text-slate-400">{vet.company ?? '-'}</td>
                      <td className="py-2 pr-4 text-slate-400">{vet.created_date ? new Date(vet.created_date).toLocaleDateString() : '-'}</td>
                      <td className="py-2">
                        <Badge variant="outline" className={cn('text-[10px]', VET_STATUS_COLORS[vet.status] ?? VET_STATUS_COLORS.pending)}>
                          {vet.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Overview */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white">Subscription Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {subsLoading ? (
            <div className="space-y-2">{[1, 2].map((i) => <Skeleton key={i} className="h-12 bg-slate-800 rounded" />)}</div>
          ) : allSubs.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No active subscriptions</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['Basic', 'Standard', 'Premium'] as const).map((planName) => {
                const count = allSubs.filter((s) => s.plan_name === planName).length;
                const revenue = allSubs
                  .filter((s) => s.plan_name === planName)
                  .reduce((sum, s) => sum + (s.price ?? 0), 0);
                return (
                  <div key={planName} className="p-4 rounded-lg bg-slate-800/50 border border-slate-800 text-center">
                    <p className="text-xs text-slate-400">{planName}</p>
                    <p className="text-2xl font-bold text-white mt-1">{count}</p>
                    <p className="text-xs text-slate-400">subscribers</p>
                    <p className="text-sm font-medium text-green-400 mt-2">${revenue.toFixed(2)}/mo</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
