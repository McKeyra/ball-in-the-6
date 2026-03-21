import type { Metadata } from 'next';
import { PathwayNavigatorView } from '@/views/athlete/PathwayNavigatorView';

export const metadata: Metadata = { title: 'Pathway Navigator' };

export default function Page(): React.ReactElement {
  return <PathwayNavigatorView />;
}
