import type { Metadata } from 'next';
import { TeamSettingsForm } from '@/views/forms/TeamSettingsForm';

export const metadata: Metadata = {
  title: 'Team Settings | Ball in the 6',
  description: 'Configure your team settings',
};

export default function Page(): React.ReactElement {
  return <TeamSettingsForm />;
}
