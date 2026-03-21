export const dynamic = "force-dynamic";
import { notFound } from 'next/navigation';
import { CampaignsPage } from '@/views/command-center/CampaignsPage';
import { DashboardPage } from '@/views/command-center/DashboardPage';
import { ContactsPage } from '@/views/command-center/ContactsPage';
import { FacilitiesPage } from '@/views/command-center/FacilitiesPage';
import { MessagesPage } from '@/views/command-center/MessagesPage';
import { PaymentsPage } from '@/views/command-center/PaymentsPage';
import { ProgramsPage } from '@/views/command-center/ProgramsPage';
import { RegistrationsPage } from '@/views/command-center/RegistrationsPage';
import { ReportsPage } from '@/views/command-center/ReportsPage';
import { SchedulePage } from '@/views/command-center/SchedulePage';
import { SettingsPage } from '@/views/command-center/SettingsPage';
import { TeamsPage } from '@/views/command-center/TeamsPage';
import { VolunteersPage } from '@/views/command-center/VolunteersPage';

const SLUG_MAP: Record<string, { component: React.ComponentType; title: string }> = {
  dashboard: { component: DashboardPage, title: 'Dashboard' },
  campaigns: { component: CampaignsPage, title: 'Campaigns' },
  contacts: { component: ContactsPage, title: 'Contacts' },
  facilities: { component: FacilitiesPage, title: 'Facilities' },
  messages: { component: MessagesPage, title: 'Messages' },
  payments: { component: PaymentsPage, title: 'Payments' },
  programs: { component: ProgramsPage, title: 'Programs' },
  registrations: { component: RegistrationsPage, title: 'Registrations' },
  reports: { component: ReportsPage, title: 'Reports' },
  schedule: { component: SchedulePage, title: 'Schedule' },
  settings: { component: SettingsPage, title: 'Settings' },
  teams: { component: TeamsPage, title: 'Teams' },
  volunteers: { component: VolunteersPage, title: 'Volunteers' },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<{ title: string }> {
  const { slug } = await params;
  const entry = SLUG_MAP[slug];
  return { title: entry ? `${entry.title} | Command Center | Ball in the 6` : 'Command Center | Ball in the 6' };
}


export default async function Page({ params }: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const entry = SLUG_MAP[slug];
  if (!entry) notFound();
  const Component = entry.component;
  return <Component />;
}
