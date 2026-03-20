import type { Metadata } from 'next';
import { SportsHubPage } from '@/views/SportsHubPage';

export const metadata: Metadata = {
  title: 'Sports Hub — Ball in the 6',
  description: 'Explore basketball, soccer, hockey, football and 40+ sports across Toronto. Standings, leaders, and schedules.',
};

export default function Page() {
  return <SportsHubPage />;
}
