import type { Metadata } from 'next';
import { AthleteStatsPage } from '@/views/recruiting/AthleteStatsPage';

export const metadata: Metadata = { title: 'Stats - Recruiting' };

export default function Page(): React.ReactElement {
  return <AthleteStatsPage />;
}
