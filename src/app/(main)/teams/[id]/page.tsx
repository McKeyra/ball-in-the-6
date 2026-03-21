import type { Metadata } from 'next';
import { TeamDetailPage } from '@/views/TeamDetailPage';

export const metadata: Metadata = { title: 'Team Detail' };

export default function Page() {
  return <TeamDetailPage />;
}
