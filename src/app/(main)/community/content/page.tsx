import type { Metadata } from 'next';
import { ContentPage } from '@/views/ContentPage';

export const metadata: Metadata = { title: 'Content' };

export default function Page() {
  return <ContentPage />;
}
