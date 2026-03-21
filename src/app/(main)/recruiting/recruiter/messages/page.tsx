import type { Metadata } from 'next';
import { RecruiterMessagesPage } from '@/views/recruiting/recruiter/RecruiterMessagesPage';

export const metadata: Metadata = { title: 'Messages - Recruiter' };

export default function Page(): React.ReactElement {
  return <RecruiterMessagesPage />;
}
