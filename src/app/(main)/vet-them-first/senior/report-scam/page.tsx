import type { Metadata } from 'next';
import { ReportScamPage } from '@/views/vet-them-first/senior/ReportScamPage';

export const metadata: Metadata = {
  title: 'Report Scam | Vet Them First | Ball in the 6',
  description: 'Report a suspicious activity or scam attempt.',
};

export default function Page(): React.ReactElement {
  return <ReportScamPage />;
}
