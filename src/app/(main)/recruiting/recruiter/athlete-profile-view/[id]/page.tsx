import type { Metadata } from 'next';
import { AthleteProfileViewPage } from '@/views/recruiting/recruiter/AthleteProfileViewPage';

export const metadata: Metadata = { title: 'Athlete Profile - Recruiter' };

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<React.ReactElement> {
  const { id } = await params;
  return <AthleteProfileViewPage athleteId={id} />;
}
