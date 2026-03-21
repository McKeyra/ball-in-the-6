'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'original', label: 'Original Game Details', icon: 'Calendar',
    fields: [
      { id: 'original_date', type: 'text', label: 'Original Game Date', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'original_time', type: 'text', label: 'Original Game Time', placeholder: 'HH:MM', required: true },
      { id: 'home_team', type: 'text', label: 'Home Team', placeholder: 'Home team name', required: true },
      { id: 'away_team', type: 'text', label: 'Away Team', placeholder: 'Away team name', required: true },
      { id: 'venue', type: 'text', label: 'Venue', placeholder: 'Current venue name', required: true },
    ],
  },
  {
    id: 'request', label: 'Requested Change', icon: 'Edit',
    fields: [
      { id: 'change_reason', type: 'cards', label: 'Reason for Change', required: true, columns: 1, options: [
        { value: 'venue_conflict', label: 'Venue Conflict', description: 'Venue is unavailable' },
        { value: 'team_conflict', label: 'Team Conflict', description: 'Insufficient players available' },
        { value: 'weather', label: 'Weather', description: 'Weather-related cancellation' },
        { value: 'facility_issue', label: 'Facility Issue', description: 'Maintenance or safety concern' },
        { value: 'other', label: 'Other', description: 'Other reason' },
      ]},
      { id: 'reason_details', type: 'textarea', label: 'Details', placeholder: 'Explain the reason...', required: true },
      { id: 'preferred_date_1', type: 'text', label: 'Preferred Date Option 1', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'preferred_time_1', type: 'text', label: 'Preferred Time Option 1', placeholder: 'HH:MM', required: true },
      { id: 'preferred_date_2', type: 'text', label: 'Preferred Date Option 2', placeholder: 'YYYY-MM-DD' },
      { id: 'preferred_time_2', type: 'text', label: 'Preferred Time Option 2', placeholder: 'HH:MM' },
      { id: 'preferred_date_3', type: 'text', label: 'Preferred Date Option 3', placeholder: 'YYYY-MM-DD' },
      { id: 'preferred_time_3', type: 'text', label: 'Preferred Time Option 3', placeholder: 'HH:MM' },
      { id: 'venue_change', type: 'cards', label: 'Need Venue Change?', columns: 2, options: [
        { value: 'yes', label: 'Yes', description: 'Need a different venue' },
        { value: 'no', label: 'No', description: 'Same venue is fine' },
      ]},
      { id: 'new_venue', type: 'text', label: 'Preferred New Venue', placeholder: 'If venue change needed' },
    ],
  },
  {
    id: 'impact', label: 'Impact Assessment', icon: 'AlertCircle',
    fields: [
      { id: 'other_teams_affected', type: 'text', label: 'Other Teams Affected', placeholder: 'List any other teams impacted' },
      { id: 'impact_description', type: 'textarea', label: 'Impact Description', placeholder: 'Describe the impact of this change...' },
      { id: 'notification_status', type: 'checkboxes', label: 'Notification Status', options: [
        { value: 'opponent_notified', label: 'Opponent Team Notified' },
        { value: 'venue_notified', label: 'Venue Notified' },
        { value: 'referees_notified', label: 'Referees Notified' },
      ]},
    ],
  },
  {
    id: 'approval', label: 'Approval', icon: 'CheckCircle',
    fields: [
      { id: 'league_approval', type: 'cards', label: 'League Approval Needed?', columns: 2, options: [
        { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },
      ]},
      { id: 'opponent_agreement', type: 'cards', label: 'Opponent Agreement', columns: 2, options: [
        { value: 'agreed', label: 'Agreed', description: 'Opponent has agreed' },
        { value: 'pending', label: 'Pending', description: 'Awaiting response' },
        { value: 'not_contacted', label: 'Not Contacted', description: 'Have not reached out' },
      ]},
      { id: 'requester_name', type: 'text', label: 'Requester Name', placeholder: 'Your full name', required: true },
      { id: 'requester_role', type: 'text', label: 'Your Role', placeholder: 'e.g., Head Coach', required: true },
    ],
  },
];

const DRAFT_KEY = 'schedule_request_draft';

export function ScheduleRequestForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/schedule-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Schedule Change Request" subtitle="Request a game schedule change" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Request" />;
}
