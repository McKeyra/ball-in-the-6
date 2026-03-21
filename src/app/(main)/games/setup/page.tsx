import type { Metadata } from 'next';
import { GameSetupPage } from '@/views/GameSetupPage';

export const metadata: Metadata = {
  title: 'Game Setup',
  description: 'Set up a new basketball game with team selection and settings.',
};

export default function Page() {
  return <GameSetupPage />;
}
