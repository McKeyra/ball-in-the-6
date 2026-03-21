import type { Metadata } from 'next';
import { VendorApplicationForm } from '@/views/forms/VendorApplicationForm';

export const metadata: Metadata = {
  title: 'Vendor Application | Ball in the 6',
  description: 'Become a vendor at Ball in the 6 events',
};

export default function Page(): React.ReactElement {
  return <VendorApplicationForm />;
}
