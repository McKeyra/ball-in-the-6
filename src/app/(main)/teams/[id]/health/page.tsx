import type { Metadata } from 'next';
import { TeamHealthDashboardPage } from '@/views/TeamHealthDashboardPage';

export const metadata: Metadata = { title: 'Team Health' };

export default function Page() {
  return <TeamHealthDashboardPage />;
}
