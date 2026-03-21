import type { Metadata } from 'next';
import { TeamSelectionPage } from '@/views/gm-universe/TeamSelectionPage';

export const metadata: Metadata = {
  title: 'GM Universe | Ball in the 6',
  description: 'Select your team and take on the role of General Manager.',
};

export default function Page(): React.ReactElement {
  return <TeamSelectionPage />;
}
