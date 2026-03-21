import type { Metadata } from 'next';
import { VolunteerRegistrationForm } from '@/views/forms/VolunteerRegistrationForm';

export const metadata: Metadata = {
  title: 'Volunteer Registration | Ball in the 6',
  description: 'Join our community of volunteers',
};

export default function Page(): React.ReactElement {
  return <VolunteerRegistrationForm />;
}
