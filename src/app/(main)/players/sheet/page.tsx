import type { Metadata } from 'next';
import { PlayerSheetPage } from '@/views/PlayerSheetPage';

export const metadata: Metadata = { title: 'Player Sheet' };

export default function Page() {
  return <PlayerSheetPage />;
}
