import type { Metadata } from 'next';
import { NotificationsPage } from '@/views/NotificationsPage';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Stay updated with likes, comments, follows, and game alerts.',
};

export default function Page() {
  return <NotificationsPage />;
}
