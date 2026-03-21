import type { Metadata } from 'next';
import { FamilyDashboardPage } from '@/views/vet-them-first/family/FamilyDashboardPage';

export const metadata: Metadata = {
  title: 'Family Dashboard | Vet Them First | Ball in the 6',
  description: 'Overview of your senior family members\' protection status.',
};

export default function Page(): React.ReactElement {
  return <FamilyDashboardPage />;
}
