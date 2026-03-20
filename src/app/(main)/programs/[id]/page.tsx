import type { Metadata } from 'next';
import { ProgramDetailPage } from '@/views/ProgramDetailPage';

export const metadata: Metadata = {
  title: 'Program Details',
  description: 'Full program details including schedule, pricing, and registration.',
};

export default function Page() {
  return <ProgramDetailPage />;
}
