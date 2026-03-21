import type { Metadata } from 'next';
import { BackgroundCheckForm } from '@/views/forms/BackgroundCheckForm';

export const metadata: Metadata = {
  title: 'Background Check | Ball in the 6',
  description: 'Complete background check authorization',
};

export default function Page(): React.ReactElement {
  return <BackgroundCheckForm />;
}
