import type { Metadata } from 'next';
import { AssessmentView } from '@/views/athlete/AssessmentView';

export const metadata: Metadata = { title: 'Assessment' };

export default function Page(): React.ReactElement {
  return <AssessmentView />;
}
