import type { Metadata } from 'next';
import { OrgDashboardPage } from '@/views/OrgDashboardPage';

export const metadata: Metadata = {
  title: 'Organization Dashboard',
  description: 'Manage your organization programs, registrations, and revenue.',
};

export default function Page() {
  return <OrgDashboardPage />;
}
