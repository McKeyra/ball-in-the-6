import type { Metadata } from 'next';
import { PositionsView } from '@/views/athlete/PositionsView';

export const metadata: Metadata = { title: 'Positions' };

export default function Page(): React.ReactElement {
  return <PositionsView />;
}
