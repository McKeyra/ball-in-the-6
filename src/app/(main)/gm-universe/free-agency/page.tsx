import type { Metadata } from 'next';
import { FreeAgencyPage } from '@/views/gm-universe/FreeAgencyPage';

export const metadata: Metadata = {
  title: 'Free Agency | GM Universe | Ball in the 6',
  description: 'Sign free agents to fill out your roster.',
};

export default function Page(): React.ReactElement {
  return <FreeAgencyPage />;
}
