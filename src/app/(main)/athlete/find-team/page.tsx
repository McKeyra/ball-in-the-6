import type { Metadata } from 'next';
import { FindTeamView } from '@/views/athlete/FindTeamView';

export const metadata: Metadata = { title: 'Find a Team' };

export default function Page(): React.ReactElement {
  return <FindTeamView />;
}
