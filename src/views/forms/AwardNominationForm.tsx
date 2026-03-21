'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'award', label: 'Award Category', icon: 'Trophy', description: 'Select the award you wish to nominate for',
    fields: [
      { id: 'awardCategory', type: 'cards', label: 'Select Award Category', required: true, columns: 2, options: [
        { value: 'mvp', label: 'MVP', description: 'Most Valuable Player of the season' },
        { value: 'most_improved', label: 'Most Improved', description: 'Greatest development and growth' },
        { value: 'sportsmanship', label: 'Sportsmanship', description: 'Excellence in character and fair play' },
        { value: 'rookie', label: 'Rookie of the Year', description: 'Outstanding first-year player' },
        { value: 'leadership', label: 'Leadership Award', description: 'Inspiring teammates on and off court' },
        { value: 'coaches_choice', label: "Coach's Choice", description: 'Special recognition from coaching staff' },
      ]},
    ],
  },
  {
    id: 'nominee', label: 'Nominee Information', icon: 'User', description: 'Details about the player being nominated',
    fields: [
      { id: 'playerName', type: 'text', label: 'Player Name', placeholder: 'Enter the full name of the player', required: true },
      { id: 'team', type: 'text', label: 'Team', placeholder: 'Team name', required: true },
      { id: 'position', type: 'select', label: 'Position', placeholder: 'Select position', required: true, options: [
        { value: 'point_guard', label: 'Point Guard' }, { value: 'shooting_guard', label: 'Shooting Guard' },
        { value: 'small_forward', label: 'Small Forward' }, { value: 'power_forward', label: 'Power Forward' },
        { value: 'center', label: 'Center' },
      ]},
    ],
  },
  {
    id: 'achievements', label: 'Achievements', icon: 'Star', description: 'Highlight key accomplishments and standout moments',
    fields: [
      { id: 'statsHighlights', type: 'text', label: 'Stats Highlights', placeholder: 'e.g., 25.3 PPG, 8.2 APG, 45% 3PT', hint: 'Key statistics that showcase their performance' },
      { id: 'keyMoments', type: 'textarea', label: 'Key Moments', placeholder: 'Describe memorable plays, clutch performances, or defining moments...', rows: 4, hint: 'Share specific games or plays that stood out' },
    ],
  },
  {
    id: 'testimonial', label: 'Testimonial', icon: 'Heart', description: 'Share why this player deserves recognition',
    fields: [
      { id: 'whyDeserving', type: 'textarea', label: 'Why They Deserve This Award', placeholder: 'Explain what makes this player exceptional and why they should be recognized...', rows: 6, required: true, hint: 'Maximum 200 words - be specific and heartfelt' },
    ],
  },
  {
    id: 'nominator', label: 'Your Information', icon: 'Users', description: 'Tell us about yourself',
    fields: [
      { id: 'nominatorName', type: 'text', label: 'Your Name', placeholder: 'Enter your full name', required: true },
      { id: 'relationship', type: 'select', label: 'Relationship to Nominee', placeholder: 'Select your relationship', required: true, options: [
        { value: 'coach', label: 'Coach' }, { value: 'teammate', label: 'Teammate' },
        { value: 'parent', label: 'Parent/Guardian' }, { value: 'fan', label: 'Fan' },
        { value: 'league_official', label: 'League Official' }, { value: 'other', label: 'Other' },
      ]},
      { id: 'contact', type: 'text', label: 'Contact Email', placeholder: 'your.email@example.com', required: true, hint: 'We may reach out for verification' },
    ],
  },
];

const DRAFT_KEY = 'award_nomination_draft';

export function AwardNominationForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/award-nomination', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Award Nomination" subtitle="Recognize outstanding players in our community" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Nomination" />;
}
