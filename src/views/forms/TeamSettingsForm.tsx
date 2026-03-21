'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const COLOR_OPTIONS = [
  { value: '#c8ff00', label: 'Lime', color: '#c8ff00' }, { value: '#3b82f6', label: 'Blue', color: '#3b82f6' },
  { value: '#ef4444', label: 'Red', color: '#ef4444' }, { value: '#22c55e', label: 'Green', color: '#22c55e' },
  { value: '#8b5cf6', label: 'Purple', color: '#8b5cf6' }, { value: '#f97316', label: 'Orange', color: '#f97316' },
  { value: '#06b6d4', label: 'Cyan', color: '#06b6d4' }, { value: '#ec4899', label: 'Pink', color: '#ec4899' },
  { value: '#000000', label: 'Black', color: '#000000' }, { value: '#ffffff', label: 'White', color: '#ffffff' },
  { value: '#1e3a5f', label: 'Navy', color: '#1e3a5f' }, { value: '#7c3aed', label: 'Violet', color: '#7c3aed' },
];

const SECTIONS: FormSection[] = [
  {
    id: 'identity', label: 'Team Identity', icon: 'Shield', description: 'Basic team branding and identification',
    fields: [
      { id: 'team_name', type: 'text', label: 'Team Name', placeholder: 'Toronto Thunder', required: true },
      { id: 'abbreviation', type: 'text', label: 'Abbreviation', placeholder: 'TOR', required: true, hint: '3-4 letter abbreviation for scoreboards and stats' },
      { id: 'logo', type: 'upload', label: 'Team Logo', accept: 'image/*', hint: 'PNG or SVG recommended, transparent background preferred' },
      { id: 'motto', type: 'text', label: 'Team Motto', placeholder: 'Strike with Thunder', hint: 'Optional team slogan or motto' },
    ],
  },
  {
    id: 'colors', label: 'Team Colors', icon: 'Palette', description: "Choose your team's primary and secondary colors",
    fields: [
      { id: 'primary_color', type: 'cards', label: 'Primary Color', required: true, columns: 4, options: COLOR_OPTIONS.map(c => ({ value: c.value, label: c.label, description: '' })) },
      { id: 'secondary_color', type: 'cards', label: 'Secondary Color', required: true, columns: 4, options: COLOR_OPTIONS.map(c => ({ value: c.value, label: c.label, description: '' })) },
    ],
  },
  {
    id: 'social', label: 'Social Media', icon: 'Share2', description: "Connect your team's social media accounts",
    fields: [
      { id: 'instagram', type: 'text', label: 'Instagram Handle', placeholder: '@torontothunder', hint: 'Include the @ symbol' },
      { id: 'twitter', type: 'text', label: 'Twitter/X Handle', placeholder: '@torontothunder', hint: 'Include the @ symbol' },
      { id: 'website', type: 'text', label: 'Team Website', placeholder: 'https://torontothunder.com' },
      { id: 'youtube', type: 'text', label: 'YouTube Channel', placeholder: 'https://youtube.com/@torontothunder' },
    ],
  },
  {
    id: 'policies', label: 'Team Policies', icon: 'FileText', description: 'Set attendance and behavior policies',
    fields: [
      { id: 'practice_attendance', type: 'select', label: 'Required Practice Attendance', required: true, options: [
        { value: '50', label: '50% Minimum' }, { value: '60', label: '60% Minimum' }, { value: '70', label: '70% Minimum' },
        { value: '80', label: '80% Minimum' }, { value: '90', label: '90% Minimum' }, { value: 'none', label: 'No Requirement' },
      ]},
      { id: 'late_policy', type: 'cards', label: 'Late Arrival Policy', required: true, columns: 2, options: [
        { value: 'strict', label: 'Strict', description: 'Players late to games may not start' },
        { value: 'moderate', label: 'Moderate', description: 'Warning system for repeated lateness' },
        { value: 'flexible', label: 'Flexible', description: 'Understanding of occasional lateness' },
        { value: 'none', label: 'No Policy', description: 'No formal late policy' },
      ]},
      { id: 'playing_time_policy', type: 'cards', label: 'Playing Time Policy', columns: 2, options: [
        { value: 'equal', label: 'Equal Playing Time', description: 'All players get similar minutes' },
        { value: 'merit', label: 'Merit-Based', description: 'Based on practice attendance and effort' },
        { value: 'competitive', label: 'Competitive', description: 'Best players play more in close games' },
        { value: 'development', label: 'Development Focus', description: 'Prioritize player development over winning' },
      ]},
      { id: 'code_of_conduct', type: 'textarea', label: 'Team Code of Conduct', placeholder: 'Outline expected behavior for players and parents...', rows: 4 },
    ],
  },
  {
    id: 'communication', label: 'Communication Settings', icon: 'MessageSquare', description: 'Team communication channels and parent portal settings',
    fields: [
      { id: 'group_chat_link', type: 'text', label: 'Team Group Chat Link', placeholder: 'https://chat.whatsapp.com/...', hint: 'WhatsApp, Slack, Discord, or other group chat link' },
      { id: 'parent_portal_access', type: 'checkboxes', label: 'Parent Portal Access', hint: 'What can parents view in the portal?', options: [
        { value: 'schedule', label: 'Game & Practice Schedule' }, { value: 'stats', label: 'Player Statistics' },
        { value: 'roster', label: 'Team Roster & Contact Info' }, { value: 'documents', label: 'Team Documents' },
        { value: 'photos', label: 'Team Photos & Media' }, { value: 'finances', label: 'Team Finances' },
      ]},
      { id: 'notification_settings', type: 'checkboxes', label: 'Automatic Notifications', hint: 'What should trigger automatic notifications to parents?', options: [
        { value: 'game_reminder', label: 'Game Reminders (24hr before)' }, { value: 'practice_reminder', label: 'Practice Reminders' },
        { value: 'schedule_change', label: 'Schedule Changes' }, { value: 'score_update', label: 'Live Score Updates' },
      ]},
    ],
  },
];

const DRAFT_KEY = 'team_settings_draft';

export function TeamSettingsForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/team-settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Team Settings" subtitle="Configure your team identity, colors, and policies" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Save Team Settings" />;
}
