import type { Metadata } from 'next';
import { GameDetailPage } from '@/views/GameDetailPage';

export const metadata: Metadata = {
  title: 'Game Detail',
  description: 'Live game stats, play-by-play, and AI-powered insights.',
};

export default function Page() {
  return <GameDetailPage />;
}
