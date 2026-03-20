import type { Metadata } from 'next';
import { CommunitiesPage } from '@/views/CommunitiesPage';

export const metadata: Metadata = {
  title: 'Communities',
  description: 'Join Toronto basketball communities, pickup groups, and sports networks.',
};

export default function Page() {
  return <CommunitiesPage />;
}
