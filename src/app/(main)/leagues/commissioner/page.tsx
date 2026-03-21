import type { Metadata } from 'next';
import { LeagueCommissionerDashboardPage } from '@/views/LeagueCommissionerDashboardPage';

export const metadata: Metadata = { title: 'League Commissioner' };

export default function Page() {
  return <LeagueCommissionerDashboardPage />;
}
