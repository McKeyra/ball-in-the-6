import type { Metadata } from 'next';
import { RecruiterDashboardPage } from '@/views/recruiting/recruiter/RecruiterDashboardPage';

export const metadata: Metadata = { title: 'Recruiter Dashboard' };

export default function Page(): React.ReactElement {
  return <RecruiterDashboardPage />;
}
