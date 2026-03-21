'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'game-info', label: 'Game Information', icon: 'Clipboard',
    fields: [
      { id: 'game_date', type: 'text', label: 'Game Date', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'home_team', type: 'text', label: 'Home Team', placeholder: 'Home team name', required: true },
      { id: 'away_team', type: 'text', label: 'Away Team', placeholder: 'Away team name', required: true },
      { id: 'home_score', type: 'text', label: 'Home Score', placeholder: '0', required: true },
      { id: 'away_score', type: 'text', label: 'Away Score', placeholder: '0', required: true },
      { id: 'game_result', type: 'cards', label: 'Game Result', required: true, columns: 3, options: [
        { value: 'win', label: 'Win', description: 'We won' },
        { value: 'loss', label: 'Loss', description: 'We lost' },
        { value: 'tie', label: 'Tie', description: 'Game tied' },
      ]},
      { id: 'team_rating', type: 'cards', label: 'Team Performance Rating', required: true, columns: 5, options: [
        { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' },
        { value: '4', label: '4' }, { value: '5', label: '5' },
      ]},
    ],
  },
  {
    id: 'performance', label: 'Performance Notes', icon: 'TrendingUp',
    fields: [
      { id: 'highlights', type: 'textarea', label: 'Game Highlights', placeholder: 'Key plays and positive moments...', rows: 4 },
      { id: 'areas_to_improve', type: 'textarea', label: 'Areas to Improve', placeholder: 'Things to work on...', rows: 4 },
    ],
  },
  {
    id: 'player-notes', label: 'Player Notes', icon: 'Users',
    fields: [
      { id: 'standout_players', type: 'text', label: 'Standout Players', placeholder: 'Names of players who excelled' },
      { id: 'injury_details', type: 'textarea', label: 'Injury Details', placeholder: 'Document any injuries that occurred', hint: 'Include player name, injury type, and status' },
    ],
  },
  {
    id: 'issues', label: 'Issues & Incidents', icon: 'AlertTriangle',
    fields: [
      { id: 'incidents', type: 'cards', label: 'Any Incidents?', columns: 2, options: [
        { value: 'yes', label: 'Yes', description: 'An incident occurred' },
        { value: 'no', label: 'No', description: 'No incidents' },
      ]},
      { id: 'incident_description', type: 'textarea', label: 'Incident Description', placeholder: 'Describe the incident...', hint: 'If yes above' },
      { id: 'referee_feedback', type: 'textarea', label: 'Referee Feedback', placeholder: 'Any feedback on officiating...' },
    ],
  },
  {
    id: 'next-steps', label: 'Next Steps', icon: 'ArrowRight',
    fields: [
      { id: 'practice_focus', type: 'checkboxes', label: 'Practice Focus Areas', options: [
        { value: 'shooting', label: 'Shooting' }, { value: 'defense', label: 'Defense' },
        { value: 'passing', label: 'Passing' }, { value: 'rebounding', label: 'Rebounding' },
        { value: 'conditioning', label: 'Conditioning' }, { value: 'plays', label: 'Play Execution' },
      ]},
      { id: 'lineup_changes', type: 'textarea', label: 'Lineup Changes', placeholder: 'Any changes for next game...' },
      { id: 'additional_notes', type: 'textarea', label: 'Additional Notes', placeholder: 'Any other notes...' },
    ],
  },
];

const DRAFT_KEY = 'game_report_draft';

export function GameReportForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/game-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Game Report" subtitle="Submit your post-game report" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Report" />;
}
