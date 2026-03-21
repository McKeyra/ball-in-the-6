import type { Metadata } from 'next';
import { PlayerDashboardPage } from '@/views/PlayerDashboardPage';

export const metadata: Metadata = { title: 'Player Dashboard' };

export default function Page() {
  return <PlayerDashboardPage />;
}
