import type { Metadata } from 'next';
import { LiveStatsPage } from '@/views/LiveStatsPage';

export const metadata: Metadata = { title: 'Live Stats' };

export default function Page() {
  return <LiveStatsPage />;
}
