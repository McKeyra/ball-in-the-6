import type { Metadata } from 'next';
import { SeniorDashboardPage } from '@/views/vet-them-first/senior/SeniorDashboardPage';

export const metadata: Metadata = {
  title: 'Senior Dashboard | Vet Them First | Ball in the 6',
  description: 'Your protection status and quick actions.',
};

export default function Page(): React.ReactElement {
  return <SeniorDashboardPage />;
}
