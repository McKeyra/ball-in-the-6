'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'player', label: 'Player Information', icon: 'User',
    fields: [
      { id: 'player_name', type: 'text', label: 'Player Name', placeholder: 'Full name', required: true },
      { id: 'player_id', type: 'text', label: 'Player ID', placeholder: 'League registration number' },
      { id: 'current_team', type: 'text', label: 'Current Team', placeholder: 'Current team name', required: true },
      { id: 'contact_email', type: 'text', label: 'Contact Email', placeholder: 'email@example.com', required: true },
      { id: 'contact_phone', type: 'text', label: 'Contact Phone', placeholder: '(416) 555-0123' },
    ],
  },
  {
    id: 'transfer', label: 'Transfer Details', icon: 'ArrowRight',
    fields: [
      { id: 'new_team', type: 'text', label: 'Requested Team', placeholder: 'New team name', required: true },
      { id: 'transfer_reason', type: 'cards', label: 'Reason for Transfer', required: true, columns: 1, options: [
        { value: 'relocation', label: 'Relocation', description: 'Moving to a different area' },
        { value: 'playing_time', label: 'Playing Time', description: 'Seeking more playing opportunities' },
        { value: 'skill_level', label: 'Skill Level', description: 'Better match for player skill level' },
        { value: 'personal', label: 'Personal Reasons', description: 'Family or personal circumstances' },
        { value: 'other', label: 'Other', description: 'Other reasons' },
      ]},
      { id: 'reason_details', type: 'textarea', label: 'Additional Details', placeholder: 'Provide more context for the transfer request...', rows: 4 },
    ],
  },
  {
    id: 'timing', label: 'Timing', icon: 'Calendar',
    fields: [
      { id: 'effective_date', type: 'text', label: 'Requested Effective Date', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'urgency', type: 'cards', label: 'Urgency', columns: 2, options: [
        { value: 'immediate', label: 'Immediate', description: 'As soon as possible' },
        { value: 'next_week', label: 'Next Week', description: 'Within the next week' },
        { value: 'next_month', label: 'Next Month', description: 'Within the next month' },
        { value: 'next_season', label: 'Next Season', description: 'For the upcoming season' },
      ]},
    ],
  },
  {
    id: 'approvals', label: 'Approvals', icon: 'CheckCircle',
    fields: [
      { id: 'current_coach_consent', type: 'cards', label: 'Current Coach Notified?', columns: 2, options: [
        { value: 'yes', label: 'Yes', description: 'Coach is aware' },
        { value: 'no', label: 'No', description: 'Not yet notified' },
      ]},
      { id: 'new_coach_acceptance', type: 'cards', label: 'New Coach Acceptance', columns: 2, options: [
        { value: 'accepted', label: 'Accepted', description: 'New team has agreed' },
        { value: 'pending', label: 'Pending', description: 'Not yet confirmed' },
      ]},
      { id: 'parent_consent', type: 'text', label: 'Parent/Guardian Consent', placeholder: 'Type parent name as signature', required: true },
      { id: 'outstanding_fees', type: 'text', label: 'Outstanding Fees', placeholder: 'Any fees owed to current team?' },
    ],
  },
  {
    id: 'notes', label: 'Additional Notes', icon: 'FileText',
    fields: [
      { id: 'additional_notes', type: 'textarea', label: 'Additional Notes', placeholder: 'Any other information relevant to this transfer...' },
      { id: 'attachments', type: 'upload', label: 'Supporting Documents', accept: '.pdf,.doc,.docx,image/*', multiple: true },
    ],
  },
];

const DRAFT_KEY = 'transfer_request_draft';

export function TransferRequestForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/transfer-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Transfer Request" subtitle="Request a player transfer between teams" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Request" />;
}
