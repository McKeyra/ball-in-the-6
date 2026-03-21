'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'score', label: 'Recommendation Score', icon: 'Star',
    fields: [
      { id: 'nps_score', type: 'cards', label: 'How likely are you to recommend Ball in the 6 to a friend?', required: true, columns: 5, options: Array.from({ length: 11 }, (_, i) => ({ value: String(i), label: String(i), description: i === 0 ? 'Not likely' : i === 10 ? 'Extremely likely' : undefined })) },
    ],
  },
  {
    id: 'reason', label: 'Your Reasoning', icon: 'MessageSquare',
    fields: [
      { id: 'score_reason', type: 'textarea', label: 'Why did you give this score?', placeholder: 'Tell us more about your experience...', required: true, rows: 5 },
    ],
  },
  {
    id: 'category', label: 'Key Factors', icon: 'List',
    fields: [
      { id: 'main_factors', type: 'pills', label: 'Main Factors for Your Score', maxSelect: 3, hint: 'Select up to 3', options: [
        { value: 'coaching', label: 'Coaching' }, { value: 'organization', label: 'Organization' },
        { value: 'community', label: 'Community' }, { value: 'facilities', label: 'Facilities' },
        { value: 'value', label: 'Value for Money' }, { value: 'communication', label: 'Communication' },
        { value: 'development', label: 'Player Development' }, { value: 'safety', label: 'Safety' },
      ]},
      { id: 'factor_details', type: 'checkboxes', label: 'Specific Feedback', options: [
        { value: 'great_coaches', label: 'Great Coaching Staff' }, { value: 'well_organized', label: 'Well Organized League' },
        { value: 'fun_atmosphere', label: 'Fun Atmosphere' }, { value: 'good_facilities', label: 'Good Facilities' },
        { value: 'fair_play', label: 'Fair Play Emphasis' }, { value: 'skill_development', label: 'Good Skill Development' },
        { value: 'inclusive', label: 'Inclusive Environment' }, { value: 'affordable', label: 'Affordable' },
        { value: 'needs_improvement', label: 'Needs Improvement Overall' }, { value: 'too_expensive', label: 'Too Expensive' },
      ]},
    ],
  },
  {
    id: 'followup', label: 'Follow-Up', icon: 'Phone',
    fields: [
      { id: 'can_contact', type: 'checkboxes', label: 'Follow-Up Permission', options: [
        { value: 'yes', label: 'You may contact me to discuss my feedback' },
      ]},
      { id: 'contact_email', type: 'text', label: 'Email', placeholder: 'email@example.com', hint: 'If you permitted contact' },
      { id: 'contact_phone', type: 'text', label: 'Phone', placeholder: '(416) 555-0123' },
      { id: 'best_time', type: 'pills', label: 'Best Time to Reach You', maxSelect: 1, options: [
        { value: 'morning', label: 'Morning' }, { value: 'afternoon', label: 'Afternoon' },
        { value: 'evening', label: 'Evening' }, { value: 'anytime', label: 'Anytime' },
      ]},
    ],
  },
];

const DRAFT_KEY = 'nps_survey_draft';

export function NPSSurveyForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/nps-survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="NPS Survey" subtitle="How likely are you to recommend us?" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Survey" />;
}
