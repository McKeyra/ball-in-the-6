import type { Metadata } from 'next';
import { IntelligencePage } from '@/views/IntelligencePage';

export const metadata: Metadata = {
  title: 'Scouting Intelligence — Ball in the 6',
  description: 'Browse 510 leagues, 34K+ players across 19 sports. Real scouting data with stats and rankings.',
};

export default function Page() {
  return <IntelligencePage />;
}
