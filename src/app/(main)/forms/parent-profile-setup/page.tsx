import type { Metadata } from 'next';
import { ParentProfileSetupForm } from '@/views/forms/ParentProfileSetupForm';

export const metadata: Metadata = {
  title: 'Parent Profile Setup | Ball in the 6',
  description: 'Set up your parent/guardian profile',
};

export default function Page(): React.ReactElement {
  return <ParentProfileSetupForm />;
}
