import type { Metadata } from 'next';
import { DevicesPage } from '@/views/vet-them-first/family/DevicesPage';

export const metadata: Metadata = {
  title: 'Devices | Vet Them First | Ball in the 6',
  description: 'Monitor the protection status of your family\u0027s devices.',
};

export default function Page(): React.ReactElement {
  return <DevicesPage />;
}
