import type { Metadata } from 'next';
import { TeamManagerDashboardPage } from '@/views/TeamManagerDashboardPage';

export const metadata: Metadata = { title: 'Team Manager' };

export default function Page() {
  return <TeamManagerDashboardPage />;
}
