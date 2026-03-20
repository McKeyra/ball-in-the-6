import type { Metadata } from 'next';
import { IntelligencePage } from '@/views/IntelligencePage';

export const metadata: Metadata = {
  title: 'Intelligence',
  description: 'Cross-sport athlete intelligence, comparisons, and stakeholder analysis.',
};

export default function Page() {
  return <IntelligencePage />;
}
