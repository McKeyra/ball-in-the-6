import type { Metadata } from 'next';
import { TrainerSignupPage } from '@/views/training-marketplace/trainer/TrainerSignupPage';

export const metadata: Metadata = { title: 'Trainer Signup' };

export default function Page(): React.ReactElement {
  return <TrainerSignupPage />;
}
