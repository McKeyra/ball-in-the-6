import type { Metadata } from 'next';
import { GOATStudyView } from '@/views/athlete/GOATStudyView';

export const metadata: Metadata = { title: 'GOAT Study' };

export default function Page(): React.ReactElement {
  return <GOATStudyView />;
}
