import type { Metadata } from 'next';
import { AwardsPage } from '@/views/AwardsPage';

export const metadata: Metadata = { title: 'Awards' };

export default function Page() {
  return <AwardsPage />;
}
