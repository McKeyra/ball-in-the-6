import type { Metadata } from 'next';
import { TeamSelectionPage } from '@/views/gm-universe/TeamSelectionPage';

export const metadata: Metadata = {
  title: 'Select Your Team | GM Universe | Ball in the 6',
  description: 'Choose an NBA team to manage as General Manager.',
};

export default function Page(): React.ReactElement {
  return <TeamSelectionPage />;
}
