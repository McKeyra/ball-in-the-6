import type { Metadata } from 'next';
import { CoachRegistrationForm } from '@/views/forms/CoachRegistrationForm';

export const metadata: Metadata = {
  title: 'Coach Application | Ball in the 6',
  description: 'Apply to become a coach in our basketball program',
};

export default function Page(): React.ReactElement {
  return <CoachRegistrationForm />;
}
