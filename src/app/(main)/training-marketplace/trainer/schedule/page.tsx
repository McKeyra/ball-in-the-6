import type { Metadata } from 'next';
import { TrainerSchedulePage } from '@/views/training-marketplace/trainer/TrainerSchedulePage';

export const metadata: Metadata = { title: 'Schedule - Trainer' };

export default function Page(): React.ReactElement {
  return <TrainerSchedulePage />;
}
