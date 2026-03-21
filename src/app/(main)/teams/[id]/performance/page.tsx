import type { Metadata } from 'next';
import { TeamPerformancePage } from '@/views/TeamPerformancePage';

export const metadata: Metadata = { title: 'Team Performance' };

export default function Page() {
  return <TeamPerformancePage />;
}
