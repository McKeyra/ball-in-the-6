import type { Metadata } from 'next';
import { EquipmentRequestForm } from '@/views/forms/EquipmentRequestForm';

export const metadata: Metadata = {
  title: 'Equipment Request | Ball in the 6',
  description: 'Order uniforms and gear for your team',
};

export default function Page(): React.ReactElement {
  return <EquipmentRequestForm />;
}
