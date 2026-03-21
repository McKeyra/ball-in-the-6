import type { Metadata } from 'next';
import { FamilyContactsPage } from '@/views/vet-them-first/senior/FamilyContactsPage';

export const metadata: Metadata = {
  title: 'Family Contacts | Vet Them First | Ball in the 6',
  description: 'Your family contact list for quick communication.',
};

export default function Page(): React.ReactElement {
  return <FamilyContactsPage />;
}
