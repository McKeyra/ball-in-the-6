import type { Metadata } from 'next';
import { PersonaClassifierView } from '@/views/athlete/PersonaClassifierView';

export const metadata: Metadata = { title: 'Persona Classifier' };

export default function Page(): React.ReactElement {
  return <PersonaClassifierView />;
}
