import type { Metadata } from 'next';
import { SponsorPipelinePage } from '@/views/SponsorPipelinePage';

export const metadata: Metadata = { title: 'Sponsor Pipeline' };

export default function Page() {
  return <SponsorPipelinePage />;
}
