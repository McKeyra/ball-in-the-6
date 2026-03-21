import type { Metadata } from 'next';
import { TrainingOverviewPage } from '@/views/training-marketplace/TrainingOverviewPage';

export const metadata: Metadata = { title: 'Training Overview - Parent' };

export default function Page(): React.ReactElement {
  return <TrainingOverviewPage />;
}
