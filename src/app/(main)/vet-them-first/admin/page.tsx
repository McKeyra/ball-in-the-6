import type { Metadata } from 'next';
import { VTFAdminPanelPage } from '@/views/vet-them-first/admin/VTFAdminPanelPage';

export const metadata: Metadata = {
  title: 'Admin Panel | Vet Them First | Ball in the 6',
  description: 'Manage scam reports, contractor vets, and subscriptions.',
};

export default function Page(): React.ReactElement {
  return <VTFAdminPanelPage />;
}
