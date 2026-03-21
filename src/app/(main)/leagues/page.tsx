import type { Metadata } from 'next';
import { LeagueManagementPage } from '@/views/LeagueManagementPage';

export const metadata: Metadata = { title: 'League Management' };

export default function Page() {
  return <LeagueManagementPage />;
}
