import type { Metadata } from 'next';
import { CourtViewPage } from '@/views/CourtViewPage';

export const metadata: Metadata = { title: 'Court View' };

export default function Page() {
  return <CourtViewPage />;
}
