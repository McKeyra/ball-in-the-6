import type { Metadata } from 'next';
import { WaiverConsentForm } from '@/views/forms/WaiverConsentForm';

export const metadata: Metadata = {
  title: 'Waiver & Consent | Ball in the 6',
  description: 'Review and sign required waivers',
};

export default function Page(): React.ReactElement {
  return <WaiverConsentForm />;
}
