import type { Metadata } from 'next';
import { ReportsView } from '@/views/vance/ReportsView';

export const metadata: Metadata = { title: 'Pregame Reports' };

export default function Page(): React.ReactElement {
  return <ReportsView />;
}
