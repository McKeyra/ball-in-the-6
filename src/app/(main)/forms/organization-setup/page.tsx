import type { Metadata } from 'next';
import { OrganizationSetupForm } from '@/views/forms/OrganizationSetupForm';

export const metadata: Metadata = {
  title: 'Organization Setup | Ball in the 6',
  description: 'Set up your organization profile',
};

export default function Page(): React.ReactElement {
  return <OrganizationSetupForm />;
}
