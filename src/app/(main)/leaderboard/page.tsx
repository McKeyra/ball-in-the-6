import type { Metadata } from 'next';
import { LeaderboardPage } from '@/views/LeaderboardPage';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'See who is making the biggest impact on Toronto basketball.',
};

export default function Page() {
  return <LeaderboardPage />;
}
