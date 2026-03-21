import type { Metadata } from 'next';
import { TeamOverviewPage } from '@/views/TeamOverviewPage';

export const metadata: Metadata = { title: 'Team Overview' };

export default function Page() {
  return <TeamOverviewPage />;
}
