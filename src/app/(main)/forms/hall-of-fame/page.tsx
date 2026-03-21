import type { Metadata } from 'next';
import { HallOfFameForm } from '@/views/forms/HallOfFameForm';

export const metadata: Metadata = {
  title: 'Hall of Fame Nomination | Ball in the 6',
  description: 'Nominate for the Hall of Fame',
};

export default function Page(): React.ReactElement {
  return <HallOfFameForm />;
}
