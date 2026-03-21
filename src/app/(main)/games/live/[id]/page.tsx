import type { Metadata } from 'next';
import { LiveGamePage } from '@/views/LiveGamePage';

export const metadata: Metadata = {
  title: 'Live Game',
  description: 'Live basketball game scoring and stat tracking.',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LiveGamePage gameId={id} />;
}
