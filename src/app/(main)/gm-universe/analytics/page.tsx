import type { Metadata } from 'next';
import { GMAnalyticsPage } from '@/views/gm-universe/GMAnalyticsPage';

export const metadata: Metadata = {
  title: 'Analytics | GM Universe | Ball in the 6',
  description: 'Advanced analytics, player comparisons, and league insights.',
};

export default function Page(): React.ReactElement {
  return <GMAnalyticsPage />;
}
