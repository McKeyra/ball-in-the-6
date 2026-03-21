import type { Metadata } from 'next';
import { SpatialStatsView } from '@/views/athlete/SpatialStatsView';

export const metadata: Metadata = { title: 'Spatial Stats' };

export default function Page(): React.ReactElement {
  return <SpatialStatsView />;
}
