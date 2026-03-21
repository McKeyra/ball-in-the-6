import type { Metadata } from 'next';
import { XPDashboardPage } from '@/views/training-marketplace/XPDashboardPage';

export const metadata: Metadata = { title: 'XP Dashboard - Training' };

export default function Page(): React.ReactElement {
  return <XPDashboardPage />;
}
