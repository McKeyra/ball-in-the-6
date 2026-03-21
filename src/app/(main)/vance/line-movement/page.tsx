import type { Metadata } from 'next';
import { LineMovementView } from '@/views/vance/LineMovementView';

export const metadata: Metadata = { title: 'Line Movement' };

export default function Page(): React.ReactElement {
  return <LineMovementView />;
}
