import type { Metadata } from 'next';
import { TrainerAthletesPage } from '@/views/training-marketplace/trainer/TrainerAthletesPage';

export const metadata: Metadata = { title: 'My Athletes - Trainer' };

export default function Page(): React.ReactElement {
  return <TrainerAthletesPage />;
}
