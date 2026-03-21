'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'personal', label: 'Personal Information', icon: 'User',
    fields: [
      { id: 'first_name', type: 'text', label: 'First Name', placeholder: 'Enter your first name', required: true },
      { id: 'last_name', type: 'text', label: 'Last Name', placeholder: 'Enter your last name', required: true },
      { id: 'email', type: 'text', label: 'Email Address', placeholder: 'volunteer@example.com', required: true },
      { id: 'phone', type: 'text', label: 'Phone Number', placeholder: '(416) 555-0123', required: true },
      { id: 'address', type: 'text', label: 'Address', placeholder: 'Street address' },
      { id: 'city', type: 'text', label: 'City', placeholder: 'Toronto' },
      { id: 'connection_to_league', type: 'select', label: 'Connection to the League', options: [
        { value: 'parent', label: 'Parent of Player' }, { value: 'grandparent', label: 'Grandparent of Player' },
        { value: 'sibling', label: 'Sibling of Player' }, { value: 'former_player', label: 'Former Player' },
        { value: 'community_member', label: 'Community Member' }, { value: 'other', label: 'Other' },
      ]},
    ],
  },
  {
    id: 'interests', label: 'Volunteer Interests', icon: 'Heart',
    fields: [
      { id: 'volunteer_roles', type: 'checkboxes', label: "Roles You're Interested In", required: true, hint: "Select all roles you'd like to help with", options: [
        { value: 'scorekeeper', label: 'Scorekeeper', description: 'Keep score during games using the scoreboard' },
        { value: 'shot_clock', label: 'Shot Clock Operator', description: 'Operate the shot clock during games' },
        { value: 'announcer', label: 'Game Announcer', description: 'Announce player names and game events' },
        { value: 'concession', label: 'Concession Stand', description: 'Help run the snack bar during games' },
        { value: 'setup_cleanup', label: 'Setup & Cleanup', description: 'Help set up and take down equipment' },
        { value: 'registration_table', label: 'Registration Table', description: 'Check in players and families at events' },
        { value: 'photography', label: 'Photography', description: 'Take photos at games and events' },
        { value: 'team_parent', label: 'Team Parent', description: 'Coordinate team communications and activities' },
        { value: 'event_coordinator', label: 'Event Coordinator', description: 'Help plan and run special events' },
        { value: 'fundraising', label: 'Fundraising', description: 'Help with fundraising initiatives' },
      ]},
      { id: 'role_preference', type: 'cards', label: 'Role Preference', columns: 2, options: [
        { value: 'game_day', label: 'Game Day Help', description: 'Prefer helping during games' },
        { value: 'behind_scenes', label: 'Behind the Scenes', description: 'Prefer administrative/planning tasks' },
        { value: 'both', label: 'Both', description: 'Happy to help with anything' },
      ]},
    ],
  },
  {
    id: 'availability', label: 'Availability', icon: 'Calendar',
    fields: [
      { id: 'frequency', type: 'cards', label: 'How Often Can You Volunteer?', required: true, columns: 2, options: [
        { value: 'weekly', label: 'Weekly', description: 'Available every week' },
        { value: 'biweekly', label: 'Bi-Weekly', description: 'Available every other week' },
        { value: 'monthly', label: 'Monthly', description: 'Once or twice a month' },
        { value: 'occasional', label: 'Occasional', description: 'Special events only' },
      ]},
      { id: 'available_days', type: 'pills', label: 'Available Days', hint: 'Select all days you can volunteer', options: [
        { value: 'monday', label: 'Monday' }, { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' }, { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' }, { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' },
      ]},
      { id: 'available_times', type: 'pills', label: 'Available Times', hint: 'Select all time slots that work', options: [
        { value: 'morning', label: 'Morning (8am-12pm)' }, { value: 'afternoon', label: 'Afternoon (12pm-5pm)' },
        { value: 'evening', label: 'Evening (5pm-9pm)' },
      ]},
      { id: 'event_types', type: 'pills', label: 'Events Available For', hint: 'Select all that apply', options: [
        { value: 'regular_games', label: 'Regular Season Games' }, { value: 'playoffs', label: 'Playoff Games' },
        { value: 'tournaments', label: 'Tournaments' }, { value: 'tryouts', label: 'Tryouts' },
        { value: 'special_events', label: 'Special Events' }, { value: 'fundraisers', label: 'Fundraisers' },
      ]},
      { id: 'start_date', type: 'text', label: 'Available Starting', placeholder: 'YYYY-MM-DD', hint: 'When can you start volunteering?' },
    ],
  },
  {
    id: 'skills', label: 'Skills & Experience', icon: 'Briefcase',
    fields: [
      { id: 'relevant_experience', type: 'textarea', label: 'Relevant Experience', placeholder: 'Describe any relevant volunteer or work experience', hint: 'e.g., coaching, event planning, customer service' },
      { id: 'special_skills', type: 'pills', label: 'Special Skills', hint: 'Select any that apply', options: [
        { value: 'first_aid', label: 'First Aid Certified' }, { value: 'cpr', label: 'CPR Certified' },
        { value: 'food_handling', label: 'Food Handler Certificate' }, { value: 'photography', label: 'Photography' },
        { value: 'video', label: 'Videography' }, { value: 'graphic_design', label: 'Graphic Design' },
        { value: 'social_media', label: 'Social Media' }, { value: 'accounting', label: 'Accounting/Finance' },
        { value: 'marketing', label: 'Marketing' }, { value: 'web_development', label: 'Web Development' },
      ]},
      { id: 'languages', type: 'pills', label: 'Languages Spoken', hint: 'Select all that apply', options: [
        { value: 'english', label: 'English' }, { value: 'french', label: 'French' },
        { value: 'spanish', label: 'Spanish' }, { value: 'mandarin', label: 'Mandarin' },
        { value: 'cantonese', label: 'Cantonese' }, { value: 'punjabi', label: 'Punjabi' },
        { value: 'tagalog', label: 'Tagalog' }, { value: 'portuguese', label: 'Portuguese' },
        { value: 'other', label: 'Other' },
      ]},
      { id: 'additional_info', type: 'textarea', label: 'Anything Else We Should Know?', placeholder: "Any additional information you'd like to share" },
    ],
  },
  {
    id: 'background', label: 'Background Check', icon: 'Shield',
    fields: [
      { id: 'over_18', type: 'checkboxes', label: 'Age Verification', required: true, options: [
        { value: 'confirmed', label: 'I am 18 years of age or older', description: 'Required to volunteer with youth programs' },
      ]},
      { id: 'background_check_status', type: 'cards', label: 'Background Check Status', columns: 2, options: [
        { value: 'completed', label: 'Already Completed', description: 'I have a current vulnerable sector check' },
        { value: 'willing', label: 'Willing to Complete', description: 'I will complete one if required' },
      ]},
      { id: 'background_check_date', type: 'text', label: 'Background Check Date', placeholder: 'YYYY-MM-DD', hint: 'If you have a current check, when was it completed?' },
      { id: 'background_consent', type: 'checkboxes', label: 'Background Check Consent', required: true, options: [
        { value: 'consent', label: 'I Consent to Background Check', description: 'I consent to a vulnerable sector background check as required for volunteering with youth' },
      ]},
      { id: 'code_of_conduct', type: 'checkboxes', label: 'Code of Conduct', required: true, options: [
        { value: 'accepted', label: 'I Accept the Code of Conduct', description: "I agree to uphold the league's volunteer code of conduct" },
      ]},
      { id: 'photo_release', type: 'checkboxes', label: 'Photo Release', options: [
        { value: 'consent', label: 'Photo Release Consent', description: 'I consent to photos of me being used for league promotion' },
      ]},
    ],
  },
];

const DRAFT_KEY = 'volunteer_registration_draft';

export function VolunteerRegistrationForm(): React.ReactElement {
  const router = useRouter();

  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const draft = localStorage.getItem(DRAFT_KEY); return draft ? JSON.parse(draft) : {}; } catch { return {}; }
  }, []);

  const handleSave = useCallback((data: Record<string, unknown>): void => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }, []);

  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try {
      await fetch('/api/forms/volunteer-registration', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      localStorage.removeItem(DRAFT_KEY);
      router.push('/forms');
    } catch (error) { console.error('Failed to submit:', error); }
  }, [router]);

  return (
    <FormBuilder
      title="Volunteer Registration"
      subtitle="Join our community of volunteers and help make basketball happen"
      sections={SECTIONS}
      initialData={initialData}
      onSubmit={handleSubmit}
      onSave={handleSave}
      submitLabel="Submit Application"
    />
  );
}
