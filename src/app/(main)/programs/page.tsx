import type { Metadata } from 'next';
import { ProgramsPage } from '@/views/ProgramsPage';

export const metadata: Metadata = {
  title: 'Programs',
  description: 'Browse basketball leagues, camps, training sessions, and clinics across Toronto.',
};

export default function Page() {
  return <ProgramsPage />;
}
