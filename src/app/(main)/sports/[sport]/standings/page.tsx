import type { Metadata } from 'next';
import { StandingsPage } from '@/views/StandingsPage';
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
    title: `${name} Standings — Ball in the 6`,
    description: `Full ${name.toLowerCase()} standings with conference/division breakdowns, win-loss records, streaks, and playoff positioning.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  return <StandingsPage sportId={sport} />;
}
