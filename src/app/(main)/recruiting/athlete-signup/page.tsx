import type { Metadata } from 'next';
import { AthleteSignupPage } from '@/views/recruiting/AthleteSignupPage';

export const metadata: Metadata = { title: 'Athlete Signup - Recruiting' };

export default function Page(): React.ReactElement {
  return <AthleteSignupPage />;
}
