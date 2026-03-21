import type { Metadata } from 'next';
import { TransferRequestForm } from '@/views/forms/TransferRequestForm';

export const metadata: Metadata = {
  title: 'Transfer Request | Ball in the 6',
  description: 'Request a player team transfer',
};

export default function Page(): React.ReactElement {
  return <TransferRequestForm />;
}
