import type { Metadata } from 'next';
import { TeamListPage } from '@/views/TeamListPage';

export const metadata: Metadata = { title: 'Team List' };

export default function Page() {
  return <TeamListPage />;
}
