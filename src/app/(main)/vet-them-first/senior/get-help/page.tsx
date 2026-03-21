import type { Metadata } from 'next';
import { GetHelpPage } from '@/views/vet-them-first/senior/GetHelpPage';

export const metadata: Metadata = {
  title: 'Get Help | Vet Them First | Ball in the 6',
  description: 'Emergency help, resources, and support for seniors.',
};

export default function Page(): React.ReactElement {
  return <GetHelpPage />;
}
