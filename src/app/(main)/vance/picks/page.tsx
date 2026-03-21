import type { Metadata } from 'next';
import { PicksView } from '@/views/vance/PicksView';

export const metadata: Metadata = { title: "Today's Picks" };

export default function Page(): React.ReactElement {
  return <PicksView />;
}
