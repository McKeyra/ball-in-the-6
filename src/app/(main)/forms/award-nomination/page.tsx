import type { Metadata } from 'next';
import { AwardNominationForm } from '@/views/forms/AwardNominationForm';

export const metadata: Metadata = {
  title: 'Award Nomination | Ball in the 6',
  description: 'Nominate a player, coach, or volunteer',
};

export default function Page(): React.ReactElement {
  return <AwardNominationForm />;
}
