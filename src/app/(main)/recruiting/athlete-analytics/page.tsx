import type { Metadata } from 'next';
import { AthleteAnalyticsPage } from '@/views/recruiting/AthleteAnalyticsPage';

export const metadata: Metadata = { title: 'Analytics - Recruiting' };

export default function Page(): React.ReactElement {
  return <AthleteAnalyticsPage />;
}
