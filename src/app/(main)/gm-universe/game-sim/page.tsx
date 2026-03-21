import type { Metadata } from 'next';
import { GameSimPage } from '@/views/gm-universe/GameSimPage';

export const metadata: Metadata = {
  title: 'Game Simulation | GM Universe | Ball in the 6',
  description: 'Simulate games and view live play-by-play results.',
};

export default function Page(): React.ReactElement {
  return <GameSimPage />;
}
