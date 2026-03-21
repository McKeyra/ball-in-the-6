import type { Metadata } from 'next';
import { ProfileBuilderPage } from '@/views/recruiting/ProfileBuilderPage';

export const metadata: Metadata = { title: 'Profile Builder - Recruiting' };

export default function Page(): React.ReactElement {
  return <ProfileBuilderPage />;
}
