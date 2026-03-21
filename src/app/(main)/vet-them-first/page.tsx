'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

interface ModuleLink {
  label: string;
  description: string;
  path: string;
  icon: string;
}

const FAMILY_LINKS: ModuleLink[] = [
  { label: 'Dashboard', description: 'Family overview and alerts', path: '/vet-them-first/family/dashboard', icon: 'D' },
  { label: 'Check-Ins', description: 'Quick check-ins with seniors', path: '/vet-them-first/family/check-ins', icon: 'CI' },
  { label: 'Devices', description: 'Monitor device protection', path: '/vet-them-first/family/devices', icon: 'DV' },
  { label: 'Scam Reports', description: 'Review scam incidents', path: '/vet-them-first/family/scam-reports', icon: 'SR' },
  { label: 'Schedule Visits', description: 'Plan visits with family', path: '/vet-them-first/family/schedule-visits', icon: 'SV' },
  { label: 'Subscription', description: 'Manage your plan', path: '/vet-them-first/family/subscription', icon: 'SB' },
  { label: 'Vet Contractors', description: 'Submit contractors for vetting', path: '/vet-them-first/family/vet-contractors', icon: 'VC' },
];

const SENIOR_LINKS: ModuleLink[] = [
  { label: 'Dashboard', description: 'Senior home and protection', path: '/vet-them-first/senior/dashboard', icon: 'D' },
  { label: 'Family Contacts', description: 'Your family contact list', path: '/vet-them-first/senior/family-contacts', icon: 'FC' },
  { label: 'Get Help', description: 'Emergency help and resources', path: '/vet-them-first/senior/get-help', icon: 'GH' },
  { label: 'My Devices', description: 'View your device status', path: '/vet-them-first/senior/my-devices', icon: 'MD' },
  { label: 'Report Scam', description: 'Report a suspicious activity', path: '/vet-them-first/senior/report-scam', icon: 'RS' },
];

export default function Page(): React.ReactElement {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Vet Them First</h1>
        <p className="text-sm text-slate-400 mt-1">Protecting seniors from scams, fraud, and exploitation.</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Family Portal</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {FAMILY_LINKS.map((link) => (
            <Card
              key={link.path}
              className="bg-slate-900/80 border-slate-800 cursor-pointer hover:border-red-600/50 transition-all"
              onClick={() => router.push(link.path)}
            >
              <CardContent className="p-4">
                <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-red-500">{link.icon}</span>
                </div>
                <p className="text-xs text-white font-medium">{link.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{link.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Senior Portal</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {SENIOR_LINKS.map((link) => (
            <Card
              key={link.path}
              className="bg-slate-900/80 border-slate-800 cursor-pointer hover:border-amber-600/50 transition-all"
              onClick={() => router.push(link.path)}
            >
              <CardContent className="p-4">
                <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-amber-500">{link.icon}</span>
                </div>
                <p className="text-xs text-white font-medium">{link.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{link.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card
        className="bg-slate-900/80 border-slate-800 cursor-pointer hover:border-purple-600/50 transition-all"
        onClick={() => router.push('/vet-them-first/admin')}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center">
            <span className="text-xs font-bold text-purple-500">AD</span>
          </div>
          <div>
            <p className="text-xs text-white font-medium">Admin Panel</p>
            <p className="text-[10px] text-slate-500">Manage scam reports, contractor vets, and subscriptions.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
