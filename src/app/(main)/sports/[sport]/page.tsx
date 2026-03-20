import type { Metadata } from 'next';
import { SportDetailPage } from '@/views/SportDetailPage';
import { SPORT_CONFIGS, CORE_SPORT_IDS } from '@/types/sports';

export async function generateStaticParams(): Promise<{ sport: string }[]> {
  return CORE_SPORT_IDS.map((sport) => ({ sport }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string }>;
}): Promise<Metadata> {
  const { sport } = await params;
  const config = SPORT_CONFIGS[sport];
  const name = config?.name ?? 'Sport';

  return {
    title: `${name} — Ball in the 6`,
    description: `${name} standings, league leaders, upcoming schedule, and stats on Ball in the 6.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  return <SportDetailPage sportId={sport} />;
}
