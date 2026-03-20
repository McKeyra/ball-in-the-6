import type { Metadata } from 'next';
import { ConversationPage } from '@/views/ConversationPage';

export const metadata: Metadata = {
  title: 'Conversation',
  description: 'Chat with other players in the Ball in the 6 community.',
};

export default function Page() {
  return <ConversationPage />;
}
