import type { Metadata } from 'next';
import { PlayerManagementPage } from '@/views/PlayerManagementPage';

export const metadata: Metadata = { title: 'Player Management' };

export default function Page() {
  return <PlayerManagementPage />;
}
