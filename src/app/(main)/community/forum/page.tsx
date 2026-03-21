import type { Metadata } from 'next';
import { ForumPage } from '@/views/ForumPage';

export const metadata: Metadata = { title: 'Forum' };

export default function Page() {
  return <ForumPage />;
}
