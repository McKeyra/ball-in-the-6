import type { Metadata } from 'next';
import { TryoutRegistrationForm } from '@/views/forms/TryoutRegistrationForm';

export const metadata: Metadata = {
  title: 'Tryout Registration | Ball in the 6',
  description: 'Register for competitive rep team tryouts',
};

export default function Page(): React.ReactElement {
  return <TryoutRegistrationForm />;
}
