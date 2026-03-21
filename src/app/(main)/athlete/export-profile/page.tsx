import type { Metadata } from 'next';
import { ExportProfileView } from '@/views/athlete/ExportProfileView';

export const metadata: Metadata = { title: 'Export Profile' };

export default function Page(): React.ReactElement {
  return <ExportProfileView />;
}
