import type { Metadata } from 'next';
import { ProgramSignupForm } from '@/views/forms/ProgramSignupForm';

export const metadata: Metadata = {
  title: 'Program Registration | Ball in the 6',
  description: 'Sign up for basketball camps and clinics',
};

export default function Page(): React.ReactElement {
  return <ProgramSignupForm />;
}
