import type { Metadata } from 'next';
import { AthleteEventsPage } from '@/views/recruiting/AthleteEventsPage';

export const metadata: Metadata = { title: 'Events - Recruiting' };

export default function Page(): React.ReactElement {
  return <AthleteEventsPage />;
}
