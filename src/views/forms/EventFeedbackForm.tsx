'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'event', label: 'Event Information', icon: 'Calendar',
    fields: [
      { id: 'event_name', type: 'select', label: 'Event', required: true, options: [
        { value: 'season_opener', label: 'Season Opener' }, { value: 'all_star_game', label: 'All-Star Game' },
        { value: 'skills_challenge', label: 'Skills Challenge' }, { value: 'tournament', label: 'End-of-Season Tournament' },
        { value: 'awards_banquet', label: 'Awards Banquet' }, { value: 'camp', label: 'Basketball Camp' },
        { value: 'other', label: 'Other Event' },
      ]},
      { id: 'attendee_role', type: 'pills', label: 'Your Role', required: true, maxSelect: 1, options: [
        { value: 'player', label: 'Player' }, { value: 'parent', label: 'Parent' },
        { value: 'coach', label: 'Coach' }, { value: 'volunteer', label: 'Volunteer' },
        { value: 'spectator', label: 'Spectator' },
      ]},
    ],
  },
  {
    id: 'experience', label: 'Overall Experience', icon: 'Star',
    fields: [
      { id: 'overall_rating', type: 'cards', label: 'Overall Rating', required: true, columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
      { id: 'venue_rating', type: 'cards', label: 'Venue Rating', required: true, columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
      { id: 'organization_rating', type: 'cards', label: 'Organization Rating', required: true, columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
    ],
  },
  {
    id: 'logistics', label: 'Logistics', icon: 'Settings',
    fields: [
      { id: 'registration_ease', type: 'cards', label: 'Registration Ease', columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
      { id: 'schedule_clarity', type: 'cards', label: 'Schedule Clarity', columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
      { id: 'event_communication', type: 'cards', label: 'Event Communication', columns: 5, options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
    ],
  },
  {
    id: 'highlights', label: 'Highlights', icon: 'Trophy',
    fields: [
      { id: 'event_highlights', type: 'checkboxes', label: 'Event Highlights', options: [
        { value: 'competition', label: 'Level of Competition' }, { value: 'atmosphere', label: 'Atmosphere' },
        { value: 'venue', label: 'Venue Quality' }, { value: 'organization', label: 'Organization' },
        { value: 'food', label: 'Food/Refreshments' }, { value: 'entertainment', label: 'Entertainment' },
        { value: 'prizes', label: 'Prizes/Awards' }, { value: 'networking', label: 'Networking Opportunities' },
      ]},
      { id: 'highlight_details', type: 'textarea', label: 'Highlight Details', placeholder: 'What stood out most?', rows: 3 },
    ],
  },
  {
    id: 'issues', label: 'Issues', icon: 'AlertCircle',
    fields: [
      { id: 'event_issues', type: 'checkboxes', label: 'Issues Encountered', options: [
        { value: 'parking', label: 'Parking Difficulties' }, { value: 'delays', label: 'Schedule Delays' },
        { value: 'communication', label: 'Poor Communication' }, { value: 'facilities', label: 'Facility Problems' },
        { value: 'safety', label: 'Safety Concerns' }, { value: 'crowding', label: 'Overcrowding' },
        { value: 'cost', label: 'Cost Too High' }, { value: 'accessibility', label: 'Accessibility Issues' },
      ]},
      { id: 'issue_details', type: 'textarea', label: 'Issue Details', placeholder: 'Describe any problems...' },
    ],
  },
  {
    id: 'suggestions', label: 'Suggestions', icon: 'Lightbulb',
    fields: [
      { id: 'improvement_suggestions', type: 'textarea', label: 'Improvement Suggestions', placeholder: 'How could this event be better?', rows: 4 },
      { id: 'would_attend_again', type: 'pills', label: 'Would You Attend Again?', maxSelect: 1, options: [
        { value: 'definitely', label: 'Definitely' }, { value: 'probably', label: 'Probably' },
        { value: 'not_sure', label: 'Not Sure' }, { value: 'probably_not', label: 'Probably Not' },
      ]},
    ],
  },
];

const DRAFT_KEY = 'event_feedback_draft';

export function EventFeedbackForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/event-feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Event Feedback" subtitle="Share your experience from a recent event" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Feedback" />;
}
