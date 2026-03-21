import type { Metadata } from 'next';
import { AthleteDashboardPage } from '@/views/recruiting/AthleteDashboardPage';

export const metadata: Metadata = { title: 'Athlete Dashboard - Recruiting' };

export default function Page(): React.ReactElement {
  return <AthleteDashboardPage />;
}
