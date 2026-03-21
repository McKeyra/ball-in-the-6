import type { Metadata } from 'next';
import { DailyLogView } from '@/views/athlete/DailyLogView';

export const metadata: Metadata = { title: 'Daily Log' };

export default function Page(): React.ReactElement {
  return <DailyLogView />;
}
