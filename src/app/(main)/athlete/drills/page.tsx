import type { Metadata } from 'next';
import { DrillLibraryView } from '@/views/athlete/DrillLibraryView';

export const metadata: Metadata = { title: 'Drill Library' };

export default function Page(): React.ReactElement {
  return <DrillLibraryView />;
}
