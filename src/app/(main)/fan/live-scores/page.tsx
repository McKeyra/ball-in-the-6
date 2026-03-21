import type { Metadata } from 'next';
import { LiveScoresView } from '@/views/fan/LiveScoresView';

export const metadata: Metadata = { title: 'Live Scores' };

export default function Page(): React.ReactElement {
  return <LiveScoresView />;
}
