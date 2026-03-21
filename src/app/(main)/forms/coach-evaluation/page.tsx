import type { Metadata } from 'next';
import { CoachEvaluationForm } from '@/views/forms/CoachEvaluationForm';

export const metadata: Metadata = {
  title: 'Coach Evaluation | Ball in the 6',
  description: "Share feedback about your child's coach",
};

export default function Page(): React.ReactElement {
  return <CoachEvaluationForm />;
}
