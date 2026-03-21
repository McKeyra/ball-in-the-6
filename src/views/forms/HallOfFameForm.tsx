'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'nominee', label: 'Nominee Information', icon: 'User', description: 'Tell us about the person being nominated for the Hall of Fame',
    fields: [
      { id: 'nomineeName', type: 'text', label: 'Full Name', placeholder: 'Enter the full name of the nominee', required: true },
      { id: 'yearsActive', type: 'text', label: 'Years Active', placeholder: 'e.g., 1995-2010', required: true, hint: 'The period they were actively involved' },
      { id: 'roles', type: 'pills', label: 'Roles', required: true, hint: 'Select all roles that apply', options: [
        { value: 'player', label: 'Player' }, { value: 'coach', label: 'Coach' },
        { value: 'volunteer', label: 'Volunteer' }, { value: 'contributor', label: 'Contributor' },
      ]},
    ],
  },
  {
    id: 'career', label: 'Career Highlights', icon: 'Trophy', description: 'Document their achievements and contributions',
    fields: [
      { id: 'teams', type: 'text', label: 'Teams / Organizations', placeholder: 'e.g., Toronto Raptors Youth, Scarborough Warriors', hint: 'List all teams or organizations they were part of' },
      { id: 'achievements', type: 'textarea', label: 'Major Achievements', placeholder: 'Championships won, MVP awards, coaching milestones...', rows: 4, required: true, hint: 'List their most significant accomplishments' },
      { id: 'recordsHeld', type: 'textarea', label: 'Records Held', placeholder: 'Any records or firsts they achieved...', rows: 3, hint: 'Include any league records, firsts, or notable statistics' },
    ],
  },
  {
    id: 'impact', label: 'Legacy & Impact', icon: 'Heart', description: 'Share their lasting contribution to the community',
    fields: [
      { id: 'communityContribution', type: 'textarea', label: 'Community Contribution', placeholder: 'How have they given back to the basketball community...', rows: 4, hint: 'Volunteer work, fundraising, community programs, etc.' },
      { id: 'mentorship', type: 'textarea', label: 'Mentorship', placeholder: 'Players they have mentored, coaching impact, guidance provided...', rows: 4, hint: 'Describe how they have helped develop others' },
      { id: 'legacy', type: 'textarea', label: 'Lasting Legacy', placeholder: 'What lasting impact have they made on the sport and community...', rows: 5, required: true, hint: 'The mark they have left that will endure' },
    ],
  },
  {
    id: 'supporting', label: 'Supporting Materials', icon: 'Upload', description: 'Upload photos and documents to support the nomination',
    fields: [
      { id: 'photos', type: 'upload', label: 'Photos', multiple: true, accept: 'image/*', hint: 'Upload photos of the nominee (action shots, ceremonies, etc.)' },
      { id: 'documents', type: 'upload', label: 'Supporting Documents', multiple: true, accept: '.pdf,.doc,.docx', hint: 'News articles, certificates, letters of recommendation' },
    ],
  },
  {
    id: 'nominators', label: 'Nominators', icon: 'Users', description: 'Primary nominator and supporting endorsements',
    fields: [
      { id: 'primaryNominatorName', type: 'text', label: 'Primary Nominator Name', placeholder: 'Your full name', required: true },
      { id: 'primaryNominatorEmail', type: 'text', label: 'Primary Nominator Email', placeholder: 'your.email@example.com', required: true },
      { id: 'primaryNominatorPhone', type: 'text', label: 'Primary Nominator Phone', placeholder: '(416) 555-0123' },
      { id: 'supporter1Name', type: 'text', label: 'First Supporter Name', placeholder: 'Full name of first supporter', required: true, hint: 'Someone who can vouch for this nomination' },
      { id: 'supporter1Email', type: 'text', label: 'First Supporter Email', placeholder: 'supporter1@example.com', required: true },
      { id: 'supporter2Name', type: 'text', label: 'Second Supporter Name', placeholder: 'Full name of second supporter', required: true, hint: 'Another person who endorses this nomination' },
      { id: 'supporter2Email', type: 'text', label: 'Second Supporter Email', placeholder: 'supporter2@example.com', required: true },
    ],
  },
];

const DRAFT_KEY = 'hall_of_fame_draft';

export function HallOfFameForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/hall-of-fame', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Hall of Fame Nomination" subtitle="Honor those who have made an indelible mark on our basketball community" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Nomination" />;
}
