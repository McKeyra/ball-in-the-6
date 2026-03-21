'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProtectionScore } from '../components/ProtectionScore';
import { Laptop, Smartphone, Tablet, Monitor, Shield, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface SeniorProfile {
  id: string;
}

interface Device {
  id: string;
  name?: string;
  type?: string;
  protection_score?: number;
}

const DEVICE_ICONS: Record<string, LucideIcon> = { laptop: Laptop, phone: Smartphone, tablet: Tablet, computer: Monitor };

export function MyDevicesPage(): React.ReactElement {
  const { user } = useAuth();

  const { data: profile = {} as SeniorProfile } = useQuery<SeniorProfile>({
    queryKey: ['vtf', 'senior-profile'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/senior/profile')
      return {} as SeniorProfile;
    },
    enabled: !!user?.id,
  });

  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ['vtf', 'senior-devices'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/senior/devices')
      return [];
    },
    enabled: !!profile?.id,
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Devices</h1>
        <p className="text-xl text-slate-500 mt-1">{devices.length} device{devices.length !== 1 ? 's' : ''} monitored</p>
      </div>

      {devices.length === 0 ? (
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="py-12 text-center">
            <Laptop className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Devices</h3>
            <p className="text-xl text-slate-500">Ask your family to add your devices for protection.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {devices.map((device) => {
            const Icon = DEVICE_ICONS[device.type ?? ''] ?? Laptop;
            const isProtected = (device.protection_score ?? 0) >= 60;
            return (
              <Card key={device.id} className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn('w-16 h-16 rounded-xl flex items-center justify-center', isProtected ? 'bg-green-100' : 'bg-red-100')}>
                      <Icon className={cn('w-8 h-8', isProtected ? 'text-green-500' : 'text-red-500')} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-slate-900">{device.name ?? 'Device'}</p>
                      <p className="text-lg text-slate-500 capitalize">{device.type ?? 'Unknown'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                    <div>
                      <p className="text-lg text-slate-500">Protection</p>
                      <div className="flex items-center gap-2 mt-1">
                        {isProtected ? (
                          <Shield className="w-6 h-6 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-red-500" />
                        )}
                        <span className={cn('text-xl font-bold', isProtected ? 'text-green-600' : 'text-red-600')}>
                          {isProtected ? 'Protected' : 'At Risk'}
                        </span>
                      </div>
                    </div>
                    <ProtectionScore score={device.protection_score ?? 0} size={70} strokeWidth={6} showLabel={false} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
