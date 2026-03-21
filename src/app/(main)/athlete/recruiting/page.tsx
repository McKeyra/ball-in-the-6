import type { Metadata } from 'next';
import { RecruitingEngineView } from '@/views/athlete/RecruitingEngineView';

export const metadata: Metadata = { title: 'Recruiting Engine' };

export default function Page(): React.ReactElement {
  return <RecruitingEngineView />;
}
