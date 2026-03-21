import type { Metadata } from 'next';
import { ScamReportsPage } from '@/views/vet-them-first/family/ScamReportsPage';

export const metadata: Metadata = {
  title: 'Scam Reports | Vet Them First | Ball in the 6',
  description: 'Review and manage scam incident reports.',
};

export default function Page(): React.ReactElement {
  return <ScamReportsPage />;
}
