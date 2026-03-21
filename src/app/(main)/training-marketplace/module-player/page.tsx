import type { Metadata } from 'next';
import { ModulePlayerPage } from '@/views/training-marketplace/ModulePlayerPage';

export const metadata: Metadata = { title: 'Module Player - Training' };

export default function Page(): React.ReactElement {
  return <ModulePlayerPage />;
}
