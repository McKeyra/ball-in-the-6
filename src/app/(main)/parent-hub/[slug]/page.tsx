export const dynamic = "force-dynamic";
import { notFound } from 'next/navigation';
import { ParentDashboardPage } from '@/views/parent-hub/ParentDashboardPage';
import { AnnouncementsPage } from '@/views/parent-hub/AnnouncementsPage';
import { DocumentsPage } from '@/views/parent-hub/DocumentsPage';
import { MyChildrenPage } from '@/views/parent-hub/MyChildrenPage';
import { ParentCalendarPage } from '@/views/parent-hub/ParentCalendarPage';
import { ParentMessagesPage } from '@/views/parent-hub/ParentMessagesPage';
import { ParentPaymentsPage } from '@/views/parent-hub/ParentPaymentsPage';

const SLUG_MAP: Record<string, { component: React.ComponentType; title: string }> = {
  dashboard: { component: ParentDashboardPage, title: 'Dashboard' },
  announcements: { component: AnnouncementsPage, title: 'Announcements' },
  documents: { component: DocumentsPage, title: 'Documents' },
  'my-children': { component: MyChildrenPage, title: 'My Children' },
  calendar: { component: ParentCalendarPage, title: 'Family Calendar' },
  messages: { component: ParentMessagesPage, title: 'Messages' },
  payments: { component: ParentPaymentsPage, title: 'Payments' },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<{ title: string }> {
  const { slug } = await params;
  const entry = SLUG_MAP[slug];
  return { title: entry ? `${entry.title} | Parent Hub | Ball in the 6` : 'Parent Hub | Ball in the 6' };
}


export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const entry = SLUG_MAP[slug];
  if (!entry) notFound();
  const Component = entry.component;
  return <Component />;
}
