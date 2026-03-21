import type { Metadata } from 'next';
import { FacilityBookingForm } from '@/views/forms/FacilityBookingForm';

export const metadata: Metadata = {
  title: 'Facility Booking | Ball in the 6',
  description: 'Reserve a court or gym for your event',
};

export default function Page(): React.ReactElement {
  return <FacilityBookingForm />;
}
