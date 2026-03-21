import type { Metadata } from 'next';
import { ScheduleRequestForm } from '@/views/forms/ScheduleRequestForm';

export const metadata: Metadata = {
  title: 'Schedule Change Request | Ball in the 6',
  description: 'Request a game schedule modification',
};

export default function Page(): React.ReactElement {
  return <ScheduleRequestForm />;
}
