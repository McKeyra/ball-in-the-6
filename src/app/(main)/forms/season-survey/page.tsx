import type { Metadata } from 'next';
import { SeasonSurveyForm } from '@/views/forms/SeasonSurveyForm';

export const metadata: Metadata = {
  title: 'Season Survey | Ball in the 6',
  description: 'Help us improve by sharing your feedback',
};

export default function Page(): React.ReactElement {
  return <SeasonSurveyForm />;
}
