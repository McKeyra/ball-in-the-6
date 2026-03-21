import type { Metadata } from 'next';
import { TradePage } from '@/views/gm-universe/TradePage';

export const metadata: Metadata = {
  title: 'Trade Center | GM Universe | Ball in the 6',
  description: 'Negotiate trades with other teams in the league.',
};

export default function Page(): React.ReactElement {
  return <TradePage />;
}
