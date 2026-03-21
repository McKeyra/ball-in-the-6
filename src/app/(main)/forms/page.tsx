import type { Metadata } from 'next';
import { FormsIndexPage } from '@/views/forms/FormsIndexPage';

export const metadata: Metadata = {
  title: 'Forms | Ball in the 6',
  description: 'Access all registration forms, applications, reports, and more for Ball in the 6 basketball.',
};

export default function Page(): React.ReactElement {
  return <FormsIndexPage />;
}
