import type { Metadata } from 'next';
import { TeamDashboardPage } from '@/views/TeamDashboardPage';

export const metadata: Metadata = { title: 'Team Dashboard' };

export default function Page() {
  return <TeamDashboardPage />;
}
