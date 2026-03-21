import type { Metadata } from 'next';
import { TrainerProgramsPage } from '@/views/training-marketplace/trainer/TrainerProgramsPage';

export const metadata: Metadata = { title: 'Programs - Trainer' };

export default function Page(): React.ReactElement {
  return <TrainerProgramsPage />;
}
