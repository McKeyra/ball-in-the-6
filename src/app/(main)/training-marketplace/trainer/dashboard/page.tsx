import type { Metadata } from 'next';
import { TrainerDashboardPage } from '@/views/training-marketplace/trainer/TrainerDashboardPage';

export const metadata: Metadata = { title: 'Trainer Dashboard' };

export default function Page(): React.ReactElement {
  return <TrainerDashboardPage />;
}
