'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  MessageSquare,
  Users,
  FileText,
  Megaphone,
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
  { slug: 'dashboard', label: 'Dashboard', description: 'Family overview and today\'s schedule', icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { slug: 'my-children', label: 'My Children', description: 'Manage your children\'s profiles', icon: Users, color: 'text-red-400', bg: 'bg-red-500/20' },
  { slug: 'calendar', label: 'Family Calendar', description: 'All events for your children', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { slug: 'payments', label: 'Payments', description: 'Invoices and payment history', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/20' },
  { slug: 'messages', label: 'Messages', description: 'Communicate with coaches and orgs', icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { slug: 'documents', label: 'Documents', description: 'Waivers, forms, and team documents', icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  { slug: 'announcements', label: 'Announcements', description: 'Latest news from your teams', icon: Megaphone, color: 'text-pink-400', bg: 'bg-pink-500/20' },
];

export function ParentHubPage(): React.ReactElement {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Parent Hub</h1>
        <p className="text-slate-400 text-sm mt-1">Everything you need to manage your family&apos;s sports activities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.slug}
              className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              onClick={() => router.push(`/parent-hub/${item.slug}`)}
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
