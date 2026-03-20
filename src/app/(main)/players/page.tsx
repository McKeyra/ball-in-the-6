import type { Metadata } from 'next';
import { PlayersPage } from '@/views/PlayersPage';

export const metadata: Metadata = {
  title: 'Players',
  description: 'Discover Toronto basketball players, stats, highlights, and AI-powered impact analysis.',
};

export default function Page() {
  return <PlayersPage />;
}
