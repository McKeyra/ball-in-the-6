import type { Metadata } from 'next';
import { SeasonPage } from '@/views/gm-universe/SeasonPage';

export const metadata: Metadata = {
  title: 'Season | GM Universe | Ball in the 6',
  description: 'View standings, schedule, and season results.',
};

export default function Page(): React.ReactElement {
  return <SeasonPage />;
}
