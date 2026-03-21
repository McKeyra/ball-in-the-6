import type { Metadata } from 'next';
import { FacilityPartnerForm } from '@/views/forms/FacilityPartnerForm';

export const metadata: Metadata = {
  title: 'Facility Partnership | Ball in the 6',
  description: 'Partner your venue with Ball in the 6',
};

export default function Page(): React.ReactElement {
  return <FacilityPartnerForm />;
}
