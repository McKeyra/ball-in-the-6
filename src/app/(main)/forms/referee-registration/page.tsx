import type { Metadata } from 'next';
import { RefereeRegistrationForm } from '@/views/forms/RefereeRegistrationForm';

export const metadata: Metadata = {
  title: 'Referee Registration | Ball in the 6',
  description: 'Sign up to officiate games in our basketball league',
};

export default function Page(): React.ReactElement {
  return <RefereeRegistrationForm />;
}
