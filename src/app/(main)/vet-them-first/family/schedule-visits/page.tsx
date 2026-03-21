import type { Metadata } from 'next';
import { ScheduleVisitsPage } from '@/views/vet-them-first/family/ScheduleVisitsPage';

export const metadata: Metadata = {
  title: 'Schedule Visits | Vet Them First | Ball in the 6',
  description: 'Plan and schedule visits with senior family members.',
};

export default function Page(): React.ReactElement {
  return <ScheduleVisitsPage />;
}
