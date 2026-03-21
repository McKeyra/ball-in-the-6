import type { Metadata } from 'next';
import { TeamRegistrationPage } from '@/views/TeamRegistrationPage';

export const metadata: Metadata = { title: 'Team Registration' };

export default function Page() {
  return <TeamRegistrationPage />;
}
