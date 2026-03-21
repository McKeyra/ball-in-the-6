import type { Metadata } from 'next';
import { LeagueSettingsForm } from '@/views/forms/LeagueSettingsForm';

export const metadata: Metadata = {
  title: 'League Settings | Ball in the 6',
  description: 'Configure your league settings',
};

export default function Page(): React.ReactElement {
  return <LeagueSettingsForm />;
}
