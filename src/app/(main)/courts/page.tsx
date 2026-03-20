import type { Metadata } from 'next';
import { CourtsPage } from '@/views/CourtsPage';

export const metadata: Metadata = {
  title: 'Courts',
  description: 'Discover basketball courts across Toronto and the GTA.',
};

export default function Page() {
  return <CourtsPage />;
}
