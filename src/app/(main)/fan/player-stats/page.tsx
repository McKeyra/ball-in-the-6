import type { Metadata } from 'next';
import { PlayerStatsView } from '@/views/fan/PlayerStatsView';

export const metadata: Metadata = { title: 'Player Breakdown' };

export default function Page(): React.ReactElement {
  return <PlayerStatsView />;
}
