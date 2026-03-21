import type { Metadata } from 'next';
import { BenchmarksView } from '@/views/athlete/BenchmarksView';

export const metadata: Metadata = { title: 'Benchmarks' };

export default function Page(): React.ReactElement {
  return <BenchmarksView />;
}
