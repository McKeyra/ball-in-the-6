import type { Metadata } from 'next';
import { GameReportForm } from '@/views/forms/GameReportForm';

export const metadata: Metadata = {
  title: 'Game Report | Ball in the 6',
  description: 'Complete the post-game coach report',
};

export default function Page(): React.ReactElement {
  return <GameReportForm />;
}
