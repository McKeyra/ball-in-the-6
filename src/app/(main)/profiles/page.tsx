import type { Metadata } from 'next';
import { ProfilesPage } from '@/views/ProfilesPage';

export const metadata: Metadata = {
  title: 'Profiles',
  description: 'Browse player, team, coach, and organization profiles.',
};

export default function Page() {
  return <ProfilesPage />;
}
