import type { Metadata } from 'next';
import { EditTeamPage } from '@/views/EditTeamPage';

export const metadata: Metadata = { title: 'Edit Team' };

export default function Page() {
  return <EditTeamPage />;
}
