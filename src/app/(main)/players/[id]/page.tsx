import type { Metadata } from 'next';
import { PlayerDetailPage } from '@/views/PlayerDetailPage';

export const metadata: Metadata = {
  title: 'Player Profile',
  description: 'Full player profile with season stats, game logs, highlights, and AI6 impact analysis.',
};

export default function Page() {
  return <PlayerDetailPage />;
}
