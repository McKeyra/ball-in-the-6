import type { Metadata } from 'next';
import { ChildDetailPage } from '@/views/ChildDetailPage';

export const metadata: Metadata = {
  title: 'Child Profile',
  description: 'Detailed view of your child\'s program, schedule, coach feedback, and stats.',
};

export default function Page() {
  return <ChildDetailPage />;
}
