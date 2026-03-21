import type { Metadata } from 'next';
import { FindTrainersPage } from '@/views/training-marketplace/FindTrainersPage';

export const metadata: Metadata = { title: 'Find Trainers' };

export default function Page(): React.ReactElement {
  return <FindTrainersPage />;
}
