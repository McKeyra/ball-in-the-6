import type { Metadata } from 'next';
import { GameLogView } from '@/views/athlete/GameLogView';

export const metadata: Metadata = { title: 'Game Log' };

export default function Page(): React.ReactElement {
  return <GameLogView />;
}
