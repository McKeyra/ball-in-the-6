import type { Metadata } from 'next';
import { CodeOfConductForm } from '@/views/forms/CodeOfConductForm';

export const metadata: Metadata = {
  title: 'Code of Conduct | Ball in the 6',
  description: 'Review and agree to the code of conduct',
};

export default function Page(): React.ReactElement {
  return <CodeOfConductForm />;
}
