import type { Metadata } from 'next';
import { WatchlistPage } from '@/views/recruiting/recruiter/WatchlistPage';

export const metadata: Metadata = { title: 'Watchlist - Recruiter' };

export default function Page(): React.ReactElement {
  return <WatchlistPage />;
}
