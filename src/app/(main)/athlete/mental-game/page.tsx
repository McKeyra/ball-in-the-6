import type { Metadata } from 'next';
import { MentalGameView } from '@/views/athlete/MentalGameView';

export const metadata: Metadata = { title: 'Mental Game' };

export default function Page(): React.ReactElement {
  return <MentalGameView />;
}
