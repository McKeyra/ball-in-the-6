'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'coach', label: 'Coach Information', icon: 'User',
    fields: [
      { id: 'coach_name', type: 'text', label: 'Coach Name', placeholder: 'Enter coach name', required: true },
      { id: 'team', type: 'text', label: 'Team', placeholder: 'Team name', required: true },
      { id: 'season', type: 'select', label: 'Season', required: true, options: [
        { value: 'fall_2025', label: 'Fall 2025' }, { value: 'winter_2026', label: 'Winter 2026' },
        { value: 'spring_2026', label: 'Spring 2026' }, { value: 'summer_2026', label: 'Summer 2026' },
      ]},
    ],
  },
  {
    id: 'ratings', label: 'Ratings', icon: 'Star',
    fields: [
      { id: 'communication', type: 'cards', label: 'Communication Skills', required: true, columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
      { id: 'knowledge', type: 'cards', label: 'Basketball Knowledge', required: true, columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
      { id: 'development', type: 'cards', label: 'Player Development', required: true, columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
      { id: 'fairness', type: 'cards', label: 'Fairness & Equal Treatment', required: true, columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
    ],
  },
  {
    id: 'strengths', label: 'Coach Strengths', icon: 'ThumbsUp',
    fields: [
      { id: 'coach_strengths', type: 'checkboxes', label: 'Coach Strengths', options: [
        { value: 'patient', label: 'Patient with Players' }, { value: 'organized', label: 'Well Organized' },
        { value: 'motivating', label: 'Motivating' }, { value: 'technical', label: 'Strong Technical Knowledge' },
        { value: 'positive', label: 'Positive Attitude' }, { value: 'inclusive', label: 'Inclusive of All Players' },
        { value: 'prepared', label: 'Well Prepared for Practices' }, { value: 'communicative', label: 'Good Parent Communication' },
        { value: 'fun', label: 'Makes It Fun' }, { value: 'role_model', label: 'Great Role Model' },
      ]},
    ],
  },
  {
    id: 'improvements', label: 'Areas for Improvement', icon: 'TrendingUp',
    fields: [
      { id: 'improvement_areas', type: 'checkboxes', label: 'Areas to Improve', options: [
        { value: 'communication', label: 'Parent Communication' }, { value: 'playing_time', label: 'Equal Playing Time' },
        { value: 'practice_variety', label: 'Practice Variety' }, { value: 'game_strategy', label: 'Game Strategy' },
        { value: 'patience', label: 'Patience with Beginners' }, { value: 'punctuality', label: 'Punctuality' },
        { value: 'feedback', label: 'Individual Player Feedback' }, { value: 'organization', label: 'Organization' },
      ]},
    ],
  },
  {
    id: 'comments', label: 'Open Feedback', icon: 'MessageSquare',
    fields: [
      { id: 'open_feedback', type: 'textarea', label: 'Additional Comments', placeholder: 'Share any other thoughts about the coaching...', rows: 6 },
    ],
  },
  {
    id: 'anonymous', label: 'Submission Options', icon: 'Eye',
    fields: [
      { id: 'anonymous', type: 'pills', label: 'Submit Anonymously?', maxSelect: 1, options: [
        { value: 'yes', label: 'Yes, Anonymous' }, { value: 'no', label: 'No, Include My Name' },
      ]},
      { id: 'contact_permission', type: 'checkboxes', label: 'Contact Permission', options: [
        { value: 'can_contact', label: 'League May Contact Me', description: 'Allow the league to follow up on my feedback' },
      ]},
      { id: 'contact_email', type: 'text', label: 'Contact Email', placeholder: 'email@example.com', hint: 'If you allowed contact above' },
    ],
  },
];

const DRAFT_KEY = 'coach_evaluation_draft';

export function CoachEvaluationForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/coach-evaluation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Coach Evaluation" subtitle="Evaluate your team's coaching staff" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Evaluation" />;
}
