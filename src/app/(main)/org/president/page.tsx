import type { Metadata } from 'next';
import { OrgPresidentDashboardPage } from '@/views/OrgPresidentDashboardPage';

export const metadata: Metadata = { title: 'Organization President' };

export default function Page() {
  return <OrgPresidentDashboardPage />;
}
