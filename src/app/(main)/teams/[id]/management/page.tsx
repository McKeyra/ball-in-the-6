import type { Metadata } from 'next';
import { TeamManagementPage } from '@/views/TeamManagementPage';

export const metadata: Metadata = { title: 'Team Management' };

export default function Page() {
  return <TeamManagementPage />;
}
