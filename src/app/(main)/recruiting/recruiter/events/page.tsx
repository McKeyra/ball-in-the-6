import type { Metadata } from 'next';
import { RecruiterEventsPage } from '@/views/recruiting/recruiter/RecruiterEventsPage';

export const metadata: Metadata = { title: 'Events - Recruiter' };

export default function Page(): React.ReactElement {
  return <RecruiterEventsPage />;
}
