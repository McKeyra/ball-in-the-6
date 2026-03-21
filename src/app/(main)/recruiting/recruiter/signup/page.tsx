import type { Metadata } from 'next';
import { RecruiterSignupPage } from '@/views/recruiting/recruiter/RecruiterSignupPage';

export const metadata: Metadata = { title: 'Recruiter Signup' };

export default function Page(): React.ReactElement {
  return <RecruiterSignupPage />;
}
