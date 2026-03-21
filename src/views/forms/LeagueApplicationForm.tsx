'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'league_info', label: 'League Information', icon: 'Trophy',
    fields: [
      { id: 'league_name', type: 'text', label: 'League Name', placeholder: 'Greater Toronto Basketball League', required: true },
      { id: 'sport', type: 'text', label: 'Sport', placeholder: 'Basketball', required: true },
      { id: 'founded_year', type: 'select', label: 'Year Founded', options: Array.from({ length: 50 }, (_, i) => { const y = new Date().getFullYear() - i; return { value: String(y), label: String(y) }; }) },
      { id: 'description', type: 'textarea', label: 'League Description', placeholder: 'Describe your league...', rows: 4 },
      { id: 'logo', type: 'upload', label: 'League Logo', accept: 'image/*' },
    ],
  },
  {
    id: 'structure', label: 'League Structure', icon: 'Layers',
    fields: [
      { id: 'divisions', type: 'pills', label: 'Divisions', required: true, options: [
        { value: 'recreational', label: 'Recreational' }, { value: 'competitive', label: 'Competitive' },
        { value: 'elite', label: 'Elite/Rep' }, { value: 'development', label: 'Development' },
      ]},
      { id: 'age_groups', type: 'checkboxes', label: 'Age Groups', required: true, options: [
        { value: 'u8', label: 'Under 8' }, { value: 'u10', label: 'Under 10' }, { value: 'u12', label: 'Under 12' },
        { value: 'u14', label: 'Under 14' }, { value: 'u16', label: 'Under 16' }, { value: 'u18', label: 'Under 18' },
        { value: 'adult', label: 'Adult (18+)' }, { value: 'senior', label: 'Senior (35+)' },
      ]},
      { id: 'team_count', type: 'text', label: 'Estimated Number of Teams', placeholder: 'e.g., 20' },
      { id: 'skill_levels', type: 'pills', label: 'Skill Levels', options: [
        { value: 'beginner', label: 'Beginner' }, { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }, { value: 'all', label: 'All Levels' },
      ]},
    ],
  },
  {
    id: 'facilities', label: 'Facilities', icon: 'Building',
    fields: [
      { id: 'primary_venue', type: 'text', label: 'Primary Venue', placeholder: 'Venue name', required: true },
      { id: 'venue_address', type: 'text', label: 'Venue Address', placeholder: 'Full address', required: true },
      { id: 'backup_venues', type: 'textarea', label: 'Backup Venues', placeholder: 'List alternate venues' },
      { id: 'facility_features', type: 'checkboxes', label: 'Facility Features', options: [
        { value: 'full_court', label: 'Full Court' }, { value: 'scoreboard', label: 'Electronic Scoreboard' },
        { value: 'bleachers', label: 'Bleachers/Seating' }, { value: 'change_rooms', label: 'Change Rooms' },
        { value: 'parking', label: 'Parking Available' }, { value: 'accessible', label: 'Wheelchair Accessible' },
      ]},
    ],
  },
  {
    id: 'schedule', label: 'Schedule', icon: 'Calendar',
    fields: [
      { id: 'season_type', type: 'cards', label: 'Season Type', columns: 2, options: [
        { value: 'fall_winter', label: 'Fall/Winter', description: 'September to March' },
        { value: 'spring_summer', label: 'Spring/Summer', description: 'April to August' },
        { value: 'year_round', label: 'Year Round', description: 'Continuous seasons' },
      ]},
      { id: 'season_start', type: 'text', label: 'Season Start', placeholder: 'YYYY-MM-DD' },
      { id: 'season_end', type: 'text', label: 'Season End', placeholder: 'YYYY-MM-DD' },
      { id: 'game_frequency', type: 'select', label: 'Game Frequency', options: [
        { value: '1_per_week', label: '1 game per week' }, { value: '2_per_week', label: '2 games per week' },
        { value: 'varies', label: 'Varies by division' },
      ]},
      { id: 'game_days', type: 'pills', label: 'Game Days', options: [
        { value: 'monday', label: 'Mon' }, { value: 'tuesday', label: 'Tue' }, { value: 'wednesday', label: 'Wed' },
        { value: 'thursday', label: 'Thu' }, { value: 'friday', label: 'Fri' }, { value: 'saturday', label: 'Sat' },
        { value: 'sunday', label: 'Sun' },
      ]},
    ],
  },
  {
    id: 'leadership', label: 'Leadership', icon: 'Users',
    fields: [
      { id: 'commissioner_name', type: 'text', label: 'Commissioner/Director Name', placeholder: 'Full name', required: true },
      { id: 'commissioner_email', type: 'text', label: 'Commissioner Email', placeholder: 'email@example.com', required: true },
      { id: 'commissioner_phone', type: 'text', label: 'Commissioner Phone', placeholder: '(416) 555-0123', required: true },
      { id: 'board_members', type: 'textarea', label: 'Board Members', placeholder: 'List board members and their roles' },
      { id: 'league_website', type: 'text', label: 'League Website', placeholder: 'https://league.com' },
      { id: 'social_media', type: 'text', label: 'Social Media', placeholder: '@leaguename on Instagram' },
    ],
  },
];

const DRAFT_KEY = 'league_application_draft';

export function LeagueApplicationForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/league-application', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="League Application" subtitle="Apply to register a new league" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Application" />;
}
