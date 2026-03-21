import type { Metadata } from 'next';
import { PlayerProfilesPage } from '@/views/PlayerProfilesPage';

export const metadata: Metadata = { title: 'Player Profiles' };

export default function Page(): React.ReactElement {
  return <PlayerProfilesPage />;
}
