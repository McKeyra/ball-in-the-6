import type { Metadata } from 'next';
import { AthleteMessagesPage } from '@/views/recruiting/AthleteMessagesPage';

export const metadata: Metadata = { title: 'Messages - Recruiting' };

export default function Page(): React.ReactElement {
  return <AthleteMessagesPage />;
}
