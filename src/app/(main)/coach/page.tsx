import type { Metadata } from 'next';
import { CoachDashboardPage } from '@/views/CoachDashboardPage';

export const metadata: Metadata = { title: 'Coach Dashboard' };

export default function Page() {
  return <CoachDashboardPage />;
}
