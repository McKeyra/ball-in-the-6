import type { Metadata } from 'next';
import { CreateProgramPage } from '@/views/CreateProgramPage';

export const metadata: Metadata = {
  title: 'Create Program',
  description: 'Create a new basketball program for your organization.',
};

export default function Page() {
  return <CreateProgramPage />;
}
