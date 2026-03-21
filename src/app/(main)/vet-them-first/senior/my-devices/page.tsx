import type { Metadata } from 'next';
import { MyDevicesPage } from '@/views/vet-them-first/senior/MyDevicesPage';

export const metadata: Metadata = {
  title: 'My Devices | Vet Them First | Ball in the 6',
  description: 'View the protection status of your devices.',
};

export default function Page(): React.ReactElement {
  return <MyDevicesPage />;
}
