import type { Metadata } from 'next';
import { CheckInsPage } from '@/views/vet-them-first/family/CheckInsPage';

export const metadata: Metadata = {
  title: 'Check-Ins | Vet Them First | Ball in the 6',
  description: 'Quick check-ins with your senior family members.',
};

export default function Page(): React.ReactElement {
  return <CheckInsPage />;
}
