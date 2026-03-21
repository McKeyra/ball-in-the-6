import type { Metadata } from 'next';
import { FanZonePage } from '@/views/FanZonePage';

export const metadata: Metadata = { title: 'Fan Zone' };

export default function Page() {
  return <FanZonePage />;
}
