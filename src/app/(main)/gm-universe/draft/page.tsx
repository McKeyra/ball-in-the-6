import type { Metadata } from 'next';
import { DraftPage } from '@/views/gm-universe/DraftPage';

export const metadata: Metadata = {
  title: 'Draft Board | GM Universe | Ball in the 6',
  description: 'Scout draft prospects and view the draft order.',
};

export default function Page(): React.ReactElement {
  return <DraftPage />;
}
