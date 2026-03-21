'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ProtectionScore } from '../components/ProtectionScore';
import { Laptop, Smartphone, Tablet, Monitor, Settings, Calendar } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface Senior {
  id: string;
  senior_id: string;
  senior_name: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  senior_id: string;
  senior_name?: string;
  protection_score?: number;
  last_check_date?: string;
}

const DEVICE_ICONS: Record<string, LucideIcon> = { laptop: Laptop, phone: Smartphone, tablet: Tablet, computer: Monitor };

export function DevicesPage(): React.ReactElement {
  const { user } = useAuth();

  const { data: seniors = [] } = useQuery<Senior[]>({
    queryKey: ['vtf', 'family-seniors'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/seniors')
      return [];
    },
    enabled: !!user?.id,
  });

  const { data: devices = [], isLoading } = useQuery<Device[]>({
    queryKey: ['vtf', 'family-all-devices'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/devices')
      return [];
    },
    enabled: seniors.length > 0,
  });

  return (
    <div className="bg-slate-950 min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Device Management</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor and configure protection for all devices.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 bg-slate-800 rounded-lg" />)}</div>
      ) : devices.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-12 text-center">
            <Laptop className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No Devices</h3>
            <p className="text-sm text-slate-400">Add devices for your seniors to start monitoring.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => {
            const Icon = DEVICE_ICONS[device.type] ?? Laptop;
            const score = device.protection_score ?? 0;
            return (
              <Card key={device.id} className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-800 rounded-lg"><Icon className="w-6 h-6 text-red-400" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{device.name}</p>
                      <p className="text-xs text-slate-400">{device.senior_name} | {device.type}</p>
                    </div>
                    <ProtectionScore score={score} size={60} strokeWidth={5} showLabel={false} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />Last check: {device.last_check_date ? new Date(device.last_check_date).toLocaleDateString() : 'Never'}
                    </span>
                    <Badge variant="outline" className={cn('text-[10px]', score >= 60 ? 'border-green-600/30 text-green-400' : 'border-red-600/30 text-red-400')}>
                      {score >= 60 ? 'Protected' : 'At Risk'}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" className="w-full border-slate-700 text-slate-300">
                    <Settings className="w-3.5 h-3.5 mr-1" />Configure
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
