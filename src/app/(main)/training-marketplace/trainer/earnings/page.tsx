import type { Metadata } from 'next';
import { TrainerEarningsPage } from '@/views/training-marketplace/trainer/TrainerEarningsPage';

export const metadata: Metadata = { title: 'Earnings - Trainer' };

export default function Page(): React.ReactElement {
  return <TrainerEarningsPage />;
}
