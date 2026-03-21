import type { Metadata } from 'next';
import { FanPagesPage } from '@/views/FanPagesPage';

export const metadata: Metadata = { title: 'Fan Pages' };

export default function Page() {
  return <FanPagesPage />;
}
