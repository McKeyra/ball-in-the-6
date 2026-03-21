import type { Metadata } from 'next';
import { AthleteDashboard } from '@/views/athlete/AthleteDashboard';

export const metadata: Metadata = { title: 'Athlete Dashboard' };

export default function Page(): React.ReactElement {
  return <AthleteDashboard />;
}
