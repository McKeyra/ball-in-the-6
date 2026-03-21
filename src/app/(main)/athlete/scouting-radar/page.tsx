import type { Metadata } from 'next';
import { ScoutingRadarView } from '@/views/athlete/ScoutingRadarView';

export const metadata: Metadata = { title: 'Scouting Radar' };

export default function Page(): React.ReactElement {
  return <ScoutingRadarView />;
}
