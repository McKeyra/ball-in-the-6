import type { Metadata } from 'next';
import { DetailedGameViewPage } from '@/views/DetailedGameViewPage';

export const metadata: Metadata = { title: 'Game Details' };

export default function Page() {
  return <DetailedGameViewPage />;
}
