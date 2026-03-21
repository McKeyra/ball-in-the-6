import type { Metadata } from 'next';
import { SponsorApplicationForm } from '@/views/forms/SponsorApplicationForm';

export const metadata: Metadata = {
  title: 'Sponsor Application | Ball in the 6',
  description: 'Partner with Ball in the 6',
};

export default function Page(): React.ReactElement {
  return <SponsorApplicationForm />;
}
