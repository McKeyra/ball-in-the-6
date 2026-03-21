import type { Metadata } from 'next';
import { LeagueApplicationForm } from '@/views/forms/LeagueApplicationForm';

export const metadata: Metadata = {
  title: 'League Application | Ball in the 6',
  description: 'Join the Ball in the 6 organization network',
};

export default function Page(): React.ReactElement {
  return <LeagueApplicationForm />;
}
