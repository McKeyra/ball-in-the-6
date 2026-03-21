import type { Metadata } from 'next';
import { VetContractorsPage } from '@/views/vet-them-first/family/VetContractorsPage';

export const metadata: Metadata = {
  title: 'Vet Contractors | Vet Them First | Ball in the 6',
  description: 'Submit and track contractor vetting requests.',
};

export default function Page(): React.ReactElement {
  return <VetContractorsPage />;
}
