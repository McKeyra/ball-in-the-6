import type { Metadata } from 'next';
import { PlayerDevelopmentPage } from '@/views/PlayerDevelopmentPage';

export const metadata: Metadata = { title: 'Player Development' };

export default function Page() {
  return <PlayerDevelopmentPage />;
}
