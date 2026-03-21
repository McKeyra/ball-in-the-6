import type { Metadata } from 'next';
import { StorePage } from '@/views/StorePage';

export const metadata: Metadata = { title: 'Store' };

export default function Page() {
  return <StorePage />;
}
