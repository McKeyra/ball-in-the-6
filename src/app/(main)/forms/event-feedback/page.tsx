import type { Metadata } from 'next';
import { EventFeedbackForm } from '@/views/forms/EventFeedbackForm';

export const metadata: Metadata = {
  title: 'Event Feedback | Ball in the 6',
  description: 'Rate and review a Ball in the 6 event',
};

export default function Page(): React.ReactElement {
  return <EventFeedbackForm />;
}
