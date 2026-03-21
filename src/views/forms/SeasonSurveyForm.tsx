'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'overall', label: 'Overall Experience', icon: 'Star',
    fields: [
      { id: 'season_rating', type: 'cards', label: 'Rate This Season', required: true, columns: 5, options: Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
      { id: 'would_recommend', type: 'pills', label: 'Would You Recommend?', required: true, maxSelect: 1, options: [
        { value: 'definitely', label: 'Definitely' }, { value: 'probably', label: 'Probably' },
        { value: 'not_sure', label: 'Not Sure' }, { value: 'probably_not', label: 'Probably Not' },
        { value: 'definitely_not', label: 'Definitely Not' },
      ]},
    ],
  },
  {
    id: 'experience', label: 'Experience Details', icon: 'Clipboard',
    fields: [
      { id: 'coaching_quality', type: 'cards', label: 'Coaching Quality', required: true, columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
      { id: 'organization_quality', type: 'cards', label: 'Organization & Administration', required: true, columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
      { id: 'communication_quality', type: 'cards', label: 'Communication', required: true, columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
    ],
  },
  {
    id: 'highlights', label: 'Season Highlights', icon: 'Trophy',
    fields: [
      { id: 'best_moment', type: 'textarea', label: 'Best Moment of the Season', placeholder: 'Share your favorite memory...', rows: 4 },
      { id: 'player_growth', type: 'checkboxes', label: 'Areas of Player Growth', options: [
        { value: 'skills', label: 'Basketball Skills' }, { value: 'teamwork', label: 'Teamwork' },
        { value: 'confidence', label: 'Confidence' }, { value: 'sportsmanship', label: 'Sportsmanship' },
        { value: 'fitness', label: 'Physical Fitness' }, { value: 'friendships', label: 'Friendships' },
        { value: 'leadership', label: 'Leadership' },
      ]},
    ],
  },
  {
    id: 'improvements', label: 'Improvements', icon: 'TrendingUp',
    fields: [
      { id: 'what_could_be_better', type: 'textarea', label: 'What Could Be Better?', placeholder: 'Share constructive feedback...', rows: 4 },
      { id: 'improvement_areas', type: 'checkboxes', label: 'Priority Improvement Areas', options: [
        { value: 'scheduling', label: 'Game Scheduling' }, { value: 'facilities', label: 'Facilities' },
        { value: 'coaching', label: 'Coaching Quality' }, { value: 'communication', label: 'Communication' },
        { value: 'registration', label: 'Registration Process' }, { value: 'fees', label: 'Fees & Value' },
      ]},
    ],
  },
  {
    id: 'future', label: 'Looking Ahead', icon: 'ArrowRight',
    fields: [
      { id: 'returning', type: 'pills', label: 'Returning Next Season?', required: true, maxSelect: 1, options: [
        { value: 'yes', label: 'Yes' }, { value: 'maybe', label: 'Maybe' },
        { value: 'no', label: 'No' }, { value: 'undecided', label: 'Undecided' },
      ]},
      { id: 'refer_friends', type: 'cards', label: 'Would You Refer Friends?', columns: 2, options: [
        { value: 'yes', label: 'Yes', description: 'Happy to refer' },
        { value: 'no', label: 'No', description: 'Would not refer' },
      ]},
      { id: 'additional_comments', type: 'textarea', label: 'Additional Comments', placeholder: 'Anything else you want to share...', rows: 4 },
    ],
  },
];

const DRAFT_KEY = 'season_survey_draft';

export function SeasonSurveyForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/season-survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Season Survey" subtitle="Share your feedback about the season" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Survey" />;
}
