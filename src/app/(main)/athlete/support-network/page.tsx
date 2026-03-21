import type { Metadata } from 'next';
import { SupportNetworkView } from '@/views/athlete/SupportNetworkView';

export const metadata: Metadata = { title: 'Support Network' };

export default function Page(): React.ReactElement {
  return <SupportNetworkView />;
}
