import type { Metadata } from 'next';
import { GameBuilderView } from '@/views/athlete/GameBuilderView';

export const metadata: Metadata = { title: 'Game Builder' };

export default function Page(): React.ReactElement {
  return <GameBuilderView />;
}
