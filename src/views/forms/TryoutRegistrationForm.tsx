'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'player', label: 'Player Information', icon: 'User',
    fields: [
      { id: 'player_first_name', type: 'text', label: 'Player First Name', placeholder: "Enter player's first name", required: true },
      { id: 'player_last_name', type: 'text', label: 'Player Last Name', placeholder: "Enter player's last name", required: true },
      { id: 'date_of_birth', type: 'text', label: 'Date of Birth', placeholder: 'YYYY-MM-DD', required: true, hint: 'Must meet age requirements for the division' },
      { id: 'gender', type: 'pills', label: 'Gender', required: true, maxSelect: 1, options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
      { id: 'tryout_division', type: 'select', label: 'Tryout Division', required: true, options: [
        { value: 'u10_rep', label: 'U10 Rep' }, { value: 'u12_rep', label: 'U12 Rep' }, { value: 'u14_rep', label: 'U14 Rep' },
        { value: 'u16_rep', label: 'U16 Rep' }, { value: 'u18_rep', label: 'U18 Rep' },
      ]},
      { id: 'current_team', type: 'text', label: 'Current Team/Club', placeholder: 'Enter current team name', hint: 'If currently playing for a team' },
      { id: 'school', type: 'text', label: 'School', placeholder: 'Enter school name' },
      { id: 'grade', type: 'select', label: 'Grade', options: Array.from({ length: 10 }, (_, i) => ({ value: String(i + 3), label: `Grade ${i + 3}` })) },
    ],
  },
  {
    id: 'stats', label: 'Player Stats', icon: 'BarChart3',
    fields: [
      { id: 'primary_position', type: 'cards', label: 'Primary Position', required: true, columns: 3, options: [
        { value: 'point_guard', label: 'Point Guard', description: 'PG - Floor general' },
        { value: 'shooting_guard', label: 'Shooting Guard', description: 'SG - Scorer' },
        { value: 'small_forward', label: 'Small Forward', description: 'SF - Versatile' },
        { value: 'power_forward', label: 'Power Forward', description: 'PF - Inside presence' },
        { value: 'center', label: 'Center', description: 'C - Paint protector' },
      ]},
      { id: 'secondary_position', type: 'pills', label: 'Secondary Position', hint: 'Select if you can play another position', maxSelect: 1, options: [
        { value: 'point_guard', label: 'PG' }, { value: 'shooting_guard', label: 'SG' }, { value: 'small_forward', label: 'SF' },
        { value: 'power_forward', label: 'PF' }, { value: 'center', label: 'C' },
      ]},
      { id: 'height_feet', type: 'select', label: 'Height (Feet)', required: true, options: [
        { value: '4', label: '4 feet' }, { value: '5', label: '5 feet' }, { value: '6', label: '6 feet' }, { value: '7', label: '7 feet' },
      ]},
      { id: 'height_inches', type: 'select', label: 'Height (Inches)', required: true, options: Array.from({ length: 12 }, (_, i) => ({ value: String(i), label: `${i} inch${i !== 1 ? 'es' : ''}` })) },
      { id: 'years_playing', type: 'select', label: 'Years Playing Basketball', required: true, options: [
        { value: '1', label: 'Less than 1 year' }, { value: '1-2', label: '1-2 years' }, { value: '3-4', label: '3-4 years' },
        { value: '5-6', label: '5-6 years' }, { value: '7+', label: '7+ years' },
      ]},
      { id: 'rep_experience', type: 'cards', label: 'Rep/Travel Team Experience', required: true, columns: 2, options: [
        { value: 'none', label: 'No Rep Experience', description: 'First time trying out for rep' },
        { value: '1_year', label: '1 Year', description: 'Played one season of rep' },
        { value: '2_3_years', label: '2-3 Years', description: 'Multiple rep seasons' },
        { value: '4_plus', label: '4+ Years', description: 'Extensive rep experience' },
      ]},
      { id: 'strengths', type: 'pills', label: 'Player Strengths', hint: 'Select up to 4', maxSelect: 4, options: [
        { value: 'shooting', label: 'Shooting' }, { value: 'ball_handling', label: 'Ball Handling' },
        { value: 'passing', label: 'Passing' }, { value: 'defense', label: 'Defense' },
        { value: 'rebounding', label: 'Rebounding' }, { value: 'athleticism', label: 'Athleticism' },
        { value: 'basketball_iq', label: 'Basketball IQ' }, { value: 'leadership', label: 'Leadership' },
      ]},
    ],
  },
  {
    id: 'video', label: 'Highlight Video', icon: 'Video',
    fields: [
      { id: 'video_upload', type: 'upload', label: 'Upload Highlight Video', accept: 'video/*', hint: 'Upload a highlight video (max 5 minutes, MP4 preferred)' },
      { id: 'video_link', type: 'text', label: 'Or Provide Video Link', placeholder: 'https://youtube.com/watch?v=...', hint: 'YouTube, Vimeo, or other video hosting link' },
      { id: 'video_description', type: 'textarea', label: 'Video Description', placeholder: "Describe what's shown in the video (games, skills, etc.)" },
      { id: 'recent_stats', type: 'textarea', label: 'Recent Season Stats (Optional)', placeholder: 'e.g., PPG: 12.5, RPG: 5.2, APG: 3.1', hint: 'Include any notable statistics from recent seasons' },
    ],
  },
  {
    id: 'goals', label: 'Goals & Commitment', icon: 'Target',
    fields: [
      { id: 'why_tryout', type: 'textarea', label: 'Why Are You Trying Out?', placeholder: 'Tell us why you want to play rep basketball', required: true, hint: 'What motivates you? What are your basketball goals?' },
      { id: 'commitment_level', type: 'cards', label: 'Commitment Level', required: true, columns: 2, options: [
        { value: 'fully_committed', label: 'Fully Committed', description: 'Basketball is my top priority' },
        { value: 'high', label: 'High Commitment', description: 'Will attend most practices/games' },
        { value: 'moderate', label: 'Moderate', description: 'Other activities may conflict occasionally' },
      ]},
      { id: 'known_conflicts', type: 'textarea', label: 'Known Schedule Conflicts', placeholder: 'List any known conflicts (other sports, family vacations, etc.)', hint: 'Be honest - we understand players have other commitments' },
      { id: 'travel_willing', type: 'checkboxes', label: 'Travel Commitment', required: true, options: [
        { value: 'tournaments', label: 'Available for Tournaments', description: 'Willing to travel for weekend tournaments' },
        { value: 'overnight', label: 'Available for Overnight Travel', description: 'Willing to travel for out-of-town tournaments requiring hotel stays' },
      ]},
      { id: 'coachable', type: 'checkboxes', label: 'Player Commitment', required: true, options: [
        { value: 'coachable', label: 'Open to Coaching', description: 'Player is receptive to coaching and constructive feedback' },
        { value: 'team_first', label: 'Team-First Attitude', description: 'Player prioritizes team success over individual stats' },
      ]},
    ],
  },
  {
    id: 'consent', label: 'Parent Consent', icon: 'FileCheck',
    fields: [
      { id: 'parent_name', type: 'text', label: 'Parent/Guardian Name', placeholder: 'Full name of parent or guardian', required: true },
      { id: 'parent_email', type: 'text', label: 'Parent Email', placeholder: 'parent@example.com', required: true },
      { id: 'parent_phone', type: 'text', label: 'Parent Phone', placeholder: '(416) 555-0123', required: true },
      { id: 'emergency_contact', type: 'text', label: 'Emergency Contact (if different)', placeholder: 'Name and phone number' },
      { id: 'tryout_consent', type: 'checkboxes', label: 'Tryout Consent', required: true, options: [
        { value: 'participation', label: 'Tryout Participation Consent', description: 'I give consent for my child to participate in the tryout' },
        { value: 'medical', label: 'Medical Authorization', description: 'I authorize emergency medical treatment if needed' },
        { value: 'evaluation', label: 'Evaluation Consent', description: 'I understand my child will be evaluated and team placement is not guaranteed' },
      ]},
      { id: 'fee_acknowledgment', type: 'checkboxes', label: 'Fee Acknowledgment', required: true, options: [
        { value: 'tryout_fee', label: 'Tryout Fee', description: 'I understand there is a non-refundable tryout fee of $25' },
        { value: 'team_fees', label: 'Team Fees', description: 'I understand rep team fees range from $800-$1500 depending on division' },
      ]},
      { id: 'parent_signature', type: 'text', label: 'Parent/Guardian Signature', placeholder: 'Type your full legal name', required: true, hint: 'By typing your name, you confirm all information is accurate and consent is given' },
      { id: 'signature_date', type: 'text', label: 'Date', placeholder: 'YYYY-MM-DD', required: true },
    ],
  },
];

const DRAFT_KEY = 'tryout_registration_draft';

export function TryoutRegistrationForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/tryout-registration', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Rep Team Tryout Registration" subtitle="Register for competitive rep team tryouts" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Registration" />;
}
