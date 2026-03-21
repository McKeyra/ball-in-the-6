import type { Metadata } from 'next';
import { AthleteSearchPage } from '@/views/recruiting/recruiter/AthleteSearchPage';

export const metadata: Metadata = { title: 'Search Athletes - Recruiter' };

export default function Page(): React.ReactElement {
  return <AthleteSearchPage />;
}
