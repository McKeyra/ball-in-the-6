import type { Metadata } from 'next';
import { CreateTeamPage } from '@/views/CreateTeamPage';

export const metadata: Metadata = { title: 'Create Team' };

export default function Page() {
  return <CreateTeamPage />;
}
