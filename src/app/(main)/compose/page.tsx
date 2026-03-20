import type { Metadata } from 'next';
import { ComposePage } from '@/views/ComposePage';

export const metadata: Metadata = {
  title: 'New Post',
};

export default function Page() {
  return <ComposePage />;
}
