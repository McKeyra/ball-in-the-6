import type { Metadata } from 'next';
import { GameDayParentPage } from '@/views/GameDayParentPage';

export const metadata: Metadata = {
  title: 'Game Day',
  description: 'Live game stats, play-by-play, and coach notes for your child\'s game.',
};

export default function Page() {
  return <GameDayParentPage />;
}
