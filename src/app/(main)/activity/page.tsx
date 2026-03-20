import type { Metadata } from 'next';
import { ActivityPage } from '@/views/ActivityPage';

export const metadata: Metadata = {
  title: 'Activity',
  description: 'Your recent activity on Ball in the 6 — posts, likes, comments, and more.',
};

export default function Page() {
  return <ActivityPage />;
}
