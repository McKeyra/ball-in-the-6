import type { Metadata } from 'next';
import { ParentDashboardPage } from '@/views/ParentDashboardPage';

export const metadata: Metadata = {
  title: 'Parent Dashboard',
  description: 'Track your children\'s programs, schedules, coach feedback, and payments.',
};

export default function Page() {
  return <ParentDashboardPage />;
}
