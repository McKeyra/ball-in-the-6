import type { Metadata } from 'next';
import { GamesPage } from '@/views/GamesPage';

export const metadata: Metadata = {
  title: 'Game Day',
  description: 'Live game scores, schedules, and recaps from Toronto basketball.',
};

export default function Page() {
  return <GamesPage />;
}
