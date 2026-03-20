import type { Metadata } from 'next';
import { SettingsPage } from '@/views/SettingsPage';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account, preferences, privacy, and app settings.',
};

export default function Page() {
  return <SettingsPage />;
}
