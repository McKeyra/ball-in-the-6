import type { Metadata } from 'next';
import { AthleteVideosPage } from '@/views/recruiting/AthleteVideosPage';

export const metadata: Metadata = { title: 'Videos - Recruiting' };

export default function Page(): React.ReactElement {
  return <AthleteVideosPage />;
}
