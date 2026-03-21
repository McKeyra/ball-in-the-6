'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ProtectionScore } from '../components/ProtectionScore';
import { AlertCard } from '../components/AlertCard';
import { Phone, ShieldAlert, Users } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface SeniorProfile {
  id: string;
  name?: string;
  protection_score?: number;
  user_id?: string;
}

interface DeviceRecord {
  id: string;
}

interface FamilyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  photo_url?: string;
}

interface AlertRecord {
  id: string;
  severity?: string;
  title?: string;
  message?: string;
  description?: string;
  created_date?: string;
}

export function SeniorDashboardPage(): React.ReactElement {
  const { user } = useAuth();
  const router = useRouter();

  const { data: profile = {} as SeniorProfile } = useQuery<SeniorProfile>({
    queryKey: ['vtf', 'senior-profile'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/senior/profile')
      return {} as SeniorProfile;
    },
    enabled: !!user?.id,
  });

  const { data: devices = [] } = useQuery<DeviceRecord[]>({
    queryKey: ['vtf', 'senior-devices'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/senior/devices')
      return [];
    },
    enabled: !!profile?.id,
  });

  const { data: contacts = [] } = useQuery<FamilyContact[]>({
    queryKey: ['vtf', 'senior-contacts'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/senior/contacts')
      return [];
    },
    enabled: !!profile?.id,
  });

  const { data: alerts = [] } = useQuery<AlertRecord[]>({
    queryKey: ['vtf', 'senior-alerts'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/senior/alerts')
      return [];
    },
    enabled: !!profile?.id,
  });

  const protectionScore = profile.protection_score ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Hello{profile.name ? `, ${profile.name}` : ''}
        </h1>
        <p className="text-xl text-slate-500 mt-1">You are protected.</p>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <ProtectionScore score={protectionScore} size={160} strokeWidth={12} />
          <p className="text-xl font-semibold text-slate-900">Protection Score</p>
          <p className="text-lg text-slate-500">{devices.length} device{devices.length !== 1 ? 's' : ''} monitored</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Quick Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contacts.slice(0, 4).map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.phone}`}
              className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {contact.photo_url ? (
                  <img src={contact.photo_url} alt={contact.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-8 h-8 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-semibold text-slate-900 truncate">{contact.name}</p>
                <p className="text-lg text-slate-500">{contact.relationship ?? 'Family'}</p>
              </div>
              <Phone className="w-8 h-8 text-green-500 flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="tel:911"
          className="flex items-center justify-center gap-3 p-6 rounded-xl bg-red-600 text-white text-2xl font-bold shadow-lg hover:bg-red-700 transition-colors"
        >
          <Phone className="w-8 h-8" />
          Call 911
        </a>
        <Button
          className="h-auto p-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-2xl font-bold shadow-lg flex items-center justify-center gap-3"
          onClick={() => router.push('/vet-them-first/senior/report-scam')}
        >
          <ShieldAlert className="w-8 h-8" />
          Report Something Suspicious
        </Button>
      </div>

      {alerts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Recent Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert as Parameters<typeof AlertCard>[0]['alert']} variant="light" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
