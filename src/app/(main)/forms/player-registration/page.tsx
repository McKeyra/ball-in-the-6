import type { Metadata } from 'next';
import { PlayerRegistrationForm } from '@/views/forms/PlayerRegistrationForm';

export const metadata: Metadata = {
  title: 'Player Registration | Ball in the 6',
  description: 'Register a new player for the basketball season',
};

export default function Page(): React.ReactElement {
  return <PlayerRegistrationForm />;
}
