import type { Metadata } from 'next';
import { NPSSurveyForm } from '@/views/forms/NPSSurveyForm';

export const metadata: Metadata = {
  title: 'NPS Survey | Ball in the 6',
  description: 'How likely are you to recommend us?',
};

export default function Page(): React.ReactElement {
  return <NPSSurveyForm />;
}
