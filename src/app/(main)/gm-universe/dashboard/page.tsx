import type { Metadata } from 'next';
import { GMDashboardPage } from '@/views/gm-universe/GMDashboardPage';

export const metadata: Metadata = {
  title: 'GM Dashboard | Ball in the 6',
  description: 'Overview of your team as General Manager.',
};

export default function Page(): React.ReactElement {
  return <GMDashboardPage />;
}
