'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'league', label: 'League Information', icon: 'Trophy', description: 'Basic league details and branding',
    fields: [
      { id: 'league_name', type: 'text', label: 'League Name', placeholder: 'Greater Toronto Basketball League', required: true },
      { id: 'description', type: 'textarea', label: 'League Description', placeholder: "Describe your league's mission and values...", rows: 3, hint: "This will appear on your league's public profile" },
      { id: 'logo', type: 'upload', label: 'League Logo', accept: 'image/*', hint: 'PNG or SVG recommended, minimum 200x200 pixels' },
      { id: 'founded_year', type: 'select', label: 'Year Founded', options: Array.from({ length: 50 }, (_, i) => { const y = new Date().getFullYear() - i; return { value: String(y), label: String(y) }; }) },
    ],
  },
  {
    id: 'structure', label: 'League Structure', icon: 'Layers', description: 'Divisions, age groups, and categories',
    fields: [
      { id: 'divisions', type: 'checkboxes', label: 'Divisions', required: true, hint: 'Select all divisions in your league', options: [
        { value: 'recreational', label: 'Recreational', description: 'Emphasis on fun and participation' },
        { value: 'competitive', label: 'Competitive', description: 'Regular season with playoffs' },
        { value: 'elite', label: 'Elite/Rep', description: 'Travel teams and tournaments' },
        { value: 'development', label: 'Development', description: 'Skill-building focused' },
      ]},
      { id: 'age_groups', type: 'pills', label: 'Age Groups', required: true, hint: 'Select all age groups your league supports', options: [
        { value: 'u6', label: 'U6' }, { value: 'u8', label: 'U8' }, { value: 'u10', label: 'U10' },
        { value: 'u12', label: 'U12' }, { value: 'u14', label: 'U14' }, { value: 'u16', label: 'U16' },
        { value: 'u18', label: 'U18' }, { value: 'adult', label: 'Adult' }, { value: 'senior', label: '35+' },
      ]},
      { id: 'gender_categories', type: 'pills', label: 'Gender Categories', required: true, options: [
        { value: 'boys', label: 'Boys' }, { value: 'girls', label: 'Girls' }, { value: 'coed', label: 'Co-Ed' },
        { value: 'mens', label: "Men's" }, { value: 'womens', label: "Women's" },
      ]},
    ],
  },
  {
    id: 'rules', label: 'Game Rules', icon: 'BookOpen', description: 'Configure game rules and regulations',
    fields: [
      { id: 'game_length', type: 'cards', label: 'Game Length', required: true, columns: 2, options: [
        { value: '2x20', label: '2 x 20 min halves', description: '40 minutes total' },
        { value: '4x8', label: '4 x 8 min quarters', description: '32 minutes total' },
        { value: '4x10', label: '4 x 10 min quarters', description: '40 minutes total' },
        { value: '4x12', label: '4 x 12 min quarters', description: '48 minutes total (NBA)' },
      ]},
      { id: 'overtime_rules', type: 'cards', label: 'Overtime Rules', required: true, columns: 2, options: [
        { value: 'none', label: 'No Overtime', description: 'Games can end in a tie' },
        { value: 'single_5', label: '5-Minute OT', description: 'Single 5-minute overtime period' },
        { value: 'sudden_death', label: 'Sudden Death', description: 'First to score wins' },
        { value: 'double_3', label: 'Double 3-Min OT', description: 'Up to two 3-minute OT periods' },
      ]},
      { id: 'mercy_rule', type: 'cards', label: 'Mercy Rule', columns: 2, options: [
        { value: 'none', label: 'No Mercy Rule', description: 'Games play to completion' },
        { value: 'running_20', label: 'Running Clock at +20', description: 'Clock runs continuously at 20+ point lead' },
        { value: 'running_30', label: 'Running Clock at +30', description: 'Clock runs continuously at 30+ point lead' },
        { value: 'end_40', label: 'Game Ends at +40', description: 'Game ends if lead reaches 40 points' },
      ]},
      { id: 'technical_rules', type: 'checkboxes', label: 'Technical Rules', options: [
        { value: 'shot_clock', label: 'Shot Clock', description: '24 or 30 second shot clock' },
        { value: 'three_point', label: '3-Point Line', description: 'Three-point shots count as 3' },
        { value: 'backcourt', label: 'Backcourt Violation', description: '10-second backcourt rule' },
        { value: 'lane_violation', label: 'Lane Violations', description: '3-second lane violation' },
      ]},
    ],
  },
  {
    id: 'scheduling', label: 'Season Scheduling', icon: 'Calendar', description: 'Season dates and game frequency',
    fields: [
      { id: 'season_start', type: 'text', label: 'Season Start Date', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'season_end', type: 'text', label: 'Season End Date', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'games_per_week', type: 'select', label: 'Games Per Team Per Week', required: true, options: [
        { value: '1', label: '1 game per week' }, { value: '2', label: '2 games per week' },
        { value: '3', label: '3 games per week' }, { value: 'varies', label: 'Varies by division' },
      ]},
      { id: 'playoff_format', type: 'cards', label: 'Playoff Format', required: true, columns: 2, options: [
        { value: 'none', label: 'No Playoffs', description: 'Regular season only' },
        { value: 'single_elim', label: 'Single Elimination', description: "One loss and you're out" },
        { value: 'double_elim', label: 'Double Elimination', description: 'Two losses to eliminate' },
        { value: 'best_of_3', label: 'Best of 3 Series', description: 'Series-based playoffs' },
      ]},
      { id: 'playoff_teams', type: 'select', label: 'Playoff Teams (per division)', options: [
        { value: '4', label: 'Top 4 teams' }, { value: '6', label: 'Top 6 teams' },
        { value: '8', label: 'Top 8 teams' }, { value: 'all', label: 'All teams qualify' },
      ]},
    ],
  },
  {
    id: 'standings', label: 'Standings & Points', icon: 'Award', description: 'Configure how standings are calculated',
    fields: [
      { id: 'points_win', type: 'select', label: 'Points for a Win', required: true, options: [
        { value: '1', label: '1 point' }, { value: '2', label: '2 points' }, { value: '3', label: '3 points' },
      ]},
      { id: 'points_loss', type: 'select', label: 'Points for a Loss', required: true, options: [
        { value: '0', label: '0 points' }, { value: '1', label: '1 point' },
      ]},
      { id: 'points_tie', type: 'select', label: 'Points for a Tie', required: true, options: [
        { value: '0', label: '0 points' }, { value: '1', label: '1 point' }, { value: '1.5', label: '1.5 points' },
      ]},
      { id: 'tiebreakers', type: 'checkboxes', label: 'Tiebreaker Order', required: true, hint: 'Select and order tiebreakers (priority order)', options: [
        { value: 'head_to_head', label: 'Head-to-Head Record', description: 'Record between tied teams' },
        { value: 'point_diff', label: 'Point Differential', description: 'Points scored minus allowed' },
        { value: 'points_for', label: 'Points Scored', description: 'Total points scored' },
        { value: 'points_against', label: 'Points Allowed', description: 'Fewest points allowed' },
        { value: 'coin_flip', label: 'Coin Flip', description: 'Random determination' },
      ]},
    ],
  },
];

const DRAFT_KEY = 'league_settings_draft';

export function LeagueSettingsForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/league-settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="League Settings" subtitle="Configure your league structure, rules, and scheduling" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Save League Settings" />;
}
