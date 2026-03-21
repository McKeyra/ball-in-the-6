'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'role', label: 'Your Role', icon: 'User',
    fields: [
      { id: 'participant_role', type: 'pills', label: 'Role', required: true, maxSelect: 1, options: [
        { value: 'player', label: 'Player' }, { value: 'parent', label: 'Parent' },
        { value: 'coach', label: 'Coach' }, { value: 'referee', label: 'Referee' },
        { value: 'volunteer', label: 'Volunteer' },
      ]},
      { id: 'participant_name', type: 'text', label: 'Full Name', placeholder: 'Enter your full name', required: true },
      { id: 'team_affiliation', type: 'text', label: 'Team Affiliation', placeholder: 'Team name (if applicable)' },
    ],
  },
  {
    id: 'acknowledgments', label: 'Acknowledgments', icon: 'CheckCircle',
    fields: [
      { id: 'sportsmanship', type: 'checkboxes', label: 'Sportsmanship', required: true, options: [
        { value: 'fair_play', label: 'Fair Play', description: 'I will demonstrate fair play and good sportsmanship at all times' },
        { value: 'respect_opponents', label: 'Respect Opponents', description: 'I will treat opponents with respect and courtesy' },
        { value: 'gracious', label: 'Gracious Win/Loss', description: 'I will be gracious in both victory and defeat' },
      ]},
      { id: 'respect_officials', type: 'checkboxes', label: 'Respect for Officials', required: true, options: [
        { value: 'respect_refs', label: 'Respect Referees', description: 'I will respect all officials and their decisions' },
        { value: 'no_arguing', label: 'No Arguing', description: 'I will not argue with officials or use abusive language' },
      ]},
      { id: 'no_violence', type: 'checkboxes', label: 'Anti-Violence', required: true, options: [
        { value: 'no_violence', label: 'Zero Tolerance for Violence', description: 'I understand there is zero tolerance for violence, threats, or intimidation' },
      ]},
      { id: 'social_media', type: 'checkboxes', label: 'Social Media', required: true, options: [
        { value: 'responsible_social', label: 'Responsible Social Media', description: 'I will use social media responsibly and not post content that disparages players, coaches, or officials' },
      ]},
    ],
  },
  {
    id: 'consequences', label: 'Understanding Consequences', icon: 'AlertTriangle',
    fields: [
      { id: 'understand_penalties', type: 'checkboxes', label: 'Penalties', required: true, options: [
        { value: 'understand', label: 'Understanding of Penalties', description: 'I understand violations may result in warnings, suspensions, or expulsion from the league' },
      ]},
      { id: 'appeal_process', type: 'checkboxes', label: 'Appeal Process', required: true, options: [
        { value: 'understand_appeal', label: 'Appeal Process', description: 'I understand I have the right to appeal any disciplinary action through the proper channels' },
      ]},
    ],
  },
  {
    id: 'commitment', label: 'Commitment', icon: 'Pen',
    fields: [
      { id: 'commitment_statement', type: 'textarea', label: 'Personal Commitment', placeholder: 'Optionally share your personal commitment to sportsmanship...', rows: 3 },
      { id: 'typed_signature', type: 'text', label: 'Typed Signature', placeholder: 'Type your full legal name', required: true, hint: 'By typing your name you agree to uphold this code of conduct' },
      { id: 'signature_date', type: 'text', label: 'Date', placeholder: 'YYYY-MM-DD', required: true },
    ],
  },
];

const DRAFT_KEY = 'code_of_conduct_draft';

export function CodeOfConductForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/code-of-conduct', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Code of Conduct" subtitle="Review and acknowledge the league code of conduct" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Acknowledgment" />;
}
