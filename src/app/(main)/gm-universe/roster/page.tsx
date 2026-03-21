import type { Metadata } from 'next';
import { RosterPage } from '@/views/gm-universe/RosterPage';

export const metadata: Metadata = {
  title: 'Roster | GM Universe | Ball in the 6',
  description: 'Manage your team roster, view player stats and contracts.',
};

export default function Page(): React.ReactElement {
  return <RosterPage />;
}
