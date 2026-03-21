import type { Metadata } from 'next';
import { BookSessionPage } from '@/views/training-marketplace/BookSessionPage';

export const metadata: Metadata = { title: 'Book Session - Training' };

export default function Page(): React.ReactElement {
  return <BookSessionPage />;
}
