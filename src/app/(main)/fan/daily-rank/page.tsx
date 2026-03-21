import type { Metadata } from 'next';
import { DailyRankView } from '@/views/fan/DailyRankView';

export const metadata: Metadata = { title: 'Daily Rank' };

export default function Page(): React.ReactElement {
  return <DailyRankView />;
}
