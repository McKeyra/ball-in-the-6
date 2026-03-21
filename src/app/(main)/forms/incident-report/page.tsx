import type { Metadata } from 'next';
import { IncidentReportForm } from '@/views/forms/IncidentReportForm';

export const metadata: Metadata = {
  title: 'Incident Report | Ball in the 6',
  description: 'Document safety or conduct incidents',
};

export default function Page(): React.ReactElement {
  return <IncidentReportForm />;
}
