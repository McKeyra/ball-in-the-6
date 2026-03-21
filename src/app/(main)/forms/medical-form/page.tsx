import type { Metadata } from 'next';
import { MedicalFormForm } from '@/views/forms/MedicalFormForm';

export const metadata: Metadata = {
  title: 'Medical Information | Ball in the 6',
  description: 'Submit medical information for your player',
};

export default function Page(): React.ReactElement {
  return <MedicalFormForm />;
}
