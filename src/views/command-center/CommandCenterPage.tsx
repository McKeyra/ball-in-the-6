'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  ClipboardList,
  BarChart3,
  Settings,
  Shield,
  MapPin,
  Heart,
  Megaphone,
  BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  slug: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

const NAV_ITEMS: NavItem[] = [
  { slug: 'dashboard', label: 'Dashboard', description: 'Organization overview and vitals', icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { slug: 'teams', label: 'Teams', description: 'Manage teams, rosters, and standings', icon: Shield, color: 'text-red-400', bg: 'bg-red-500/20' },
  { slug: 'schedule', label: 'Schedule', description: 'Events, practices, and games calendar', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { slug: 'registrations', label: 'Registrations', description: 'Player and family registrations', icon: ClipboardList, color: 'text-green-400', bg: 'bg-green-500/20' },
  { slug: 'programs', label: 'Programs', description: 'Manage leagues, camps, and clinics', icon: BookOpen, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { slug: 'contacts', label: 'Contacts', description: 'Directory of parents, coaches, and staff', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  { slug: 'payments', label: 'Payments', description: 'Financial transactions and invoicing', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { slug: 'messages', label: 'Messages', description: 'Internal communications hub', icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { slug: 'campaigns', label: 'Campaigns', description: 'Marketing and outreach campaigns', icon: Megaphone, color: 'text-pink-400', bg: 'bg-pink-500/20' },
  { slug: 'facilities', label: 'Facilities', description: 'Courts, fields, and facility management', icon: MapPin, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  { slug: 'volunteers', label: 'Volunteers', description: 'Volunteer roster, roles, and hours', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/20' },
  { slug: 'reports', label: 'Reports', description: 'Analytics and organizational insights', icon: BarChart3, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  { slug: 'settings', label: 'Settings', description: 'Organization configuration', icon: Settings, color: 'text-slate-400', bg: 'bg-slate-500/20' },
];

export function CommandCenterPage(): React.ReactElement {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Command Center</h1>
        <p className="text-slate-400 text-sm mt-1">Manage every aspect of your organization</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.slug}
              className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              onClick={() => router.push(`/command-center/${item.slug}`)}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${item.bg} shrink-0`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
