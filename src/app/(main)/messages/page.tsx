import type { Metadata } from 'next';
import { MessagesPage } from '@/views/MessagesPage';

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Direct messages with the Ball in the 6 community.',
};

export default function Page() {
  return <MessagesPage />;
}
