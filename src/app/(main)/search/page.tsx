import type { Metadata } from 'next';
import { SearchPage } from '@/views/SearchPage';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search players, courts, games, and posts across Toronto basketball.',
};

export default function Page() {
  return <SearchPage />;
}
