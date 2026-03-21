import type { Metadata } from 'next';
import { PlayersView } from '@/views/vance/PlayersView';

export const metadata: Metadata = { title: 'Player Ratings' };

export default function Page(): React.ReactElement {
  return <PlayersView />;
}
