import type { Metadata } from 'next';
import { OrgDashboardPage } from '@/views/OrgDashboardPage';

export const metadata: Metadata = { title: 'Organization Dashboard' };

export default function Page() {
  return <OrgDashboardPage />;
}
