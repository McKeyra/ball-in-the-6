import type { Metadata } from 'next';
import { VanceDashboard } from '@/views/vance/VanceDashboard';

export const metadata: Metadata = { title: 'Vance - AI Sports Intelligence' };

export default function Page(): React.ReactElement {
  return <VanceDashboard />;
}
