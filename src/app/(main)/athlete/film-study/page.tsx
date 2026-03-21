import type { Metadata } from 'next';
import { FilmStudyView } from '@/views/athlete/FilmStudyView';

export const metadata: Metadata = { title: 'Film Study' };

export default function Page(): React.ReactElement {
  return <FilmStudyView />;
}
