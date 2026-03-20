import type { Metadata } from 'next';
import { PaymentsPage } from '@/views/PaymentsPage';

export const metadata: Metadata = {
  title: 'Payments',
  description: 'Manage payments, invoices, and receipts for your program registrations.',
};

export default function Page() {
  return <PaymentsPage />;
}
