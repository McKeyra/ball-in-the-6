import type { Metadata } from 'next';
import { SubscriptionPage } from '@/views/vet-them-first/family/SubscriptionPage';

export const metadata: Metadata = {
  title: 'Subscription | Vet Them First | Ball in the 6',
  description: 'Manage your Vet Them First subscription plan.',
};

export default function Page(): React.ReactElement {
  return <SubscriptionPage />;
}
