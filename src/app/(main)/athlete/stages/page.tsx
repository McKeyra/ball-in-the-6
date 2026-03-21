import type { Metadata } from 'next';
import { StageSelectorView } from '@/views/athlete/StageSelectorView';

export const metadata: Metadata = { title: 'Stage Selector' };

export default function Page(): React.ReactElement {
  return <StageSelectorView />;
}
