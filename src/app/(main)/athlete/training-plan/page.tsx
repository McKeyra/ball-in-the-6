import type { Metadata } from 'next';
import { TrainingPlanView } from '@/views/athlete/TrainingPlanView';

export const metadata: Metadata = { title: 'Training Plan' };

export default function Page(): React.ReactElement {
  return <TrainingPlanView />;
}
