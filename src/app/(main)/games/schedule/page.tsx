import type { Metadata } from 'next';
import { SchedulePage } from '@/views/SchedulePage';

export const metadata: Metadata = {
  title: 'Game Schedule',
  description: 'Full basketball game schedule for Toronto leagues.',
};

export default function Page() {
  return <SchedulePage />;
}
