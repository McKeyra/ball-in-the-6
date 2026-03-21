'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const COACH_SECTIONS: FormSection[] = [
  {
    id: 'personal_info',
    label: 'Personal Information',
    icon: 'User',
    fields: [
      { id: 'first_name', type: 'text', label: 'First Name', placeholder: 'Enter your first name', required: true },
      { id: 'last_name', type: 'text', label: 'Last Name', placeholder: 'Enter your last name', required: true },
      { id: 'email', type: 'text', label: 'Email Address', placeholder: 'coach@example.com', required: true },
      { id: 'phone', type: 'text', label: 'Phone Number', placeholder: '(416) 555-0123', required: true },
      { id: 'address', type: 'text', label: 'Address', placeholder: 'Street address' },
      { id: 'city', type: 'text', label: 'City', placeholder: 'Toronto' },
      { id: 'photo', type: 'upload', label: 'Profile Photo', accept: 'image/*', hint: 'Upload a professional photo for your coaching profile' },
    ],
  },
  {
    id: 'experience',
    label: 'Coaching Experience',
    icon: 'Briefcase',
    fields: [
      {
        id: 'years_coaching', type: 'select', label: 'Years of Coaching Experience', required: true,
        options: [
          { value: '0', label: 'No previous experience' }, { value: '1-2', label: '1-2 years' },
          { value: '3-5', label: '3-5 years' }, { value: '6-10', label: '6-10 years' },
          { value: '10+', label: '10+ years' },
        ],
      },
      {
        id: 'levels_coached', type: 'pills', label: 'Levels Coached', hint: 'Select all that apply',
        options: [
          { value: 'recreational', label: 'Recreational' }, { value: 'house_league', label: 'House League' },
          { value: 'rep', label: 'Rep/Travel' }, { value: 'high_school', label: 'High School' },
          { value: 'college', label: 'College/University' }, { value: 'professional', label: 'Professional' },
        ],
      },
      {
        id: 'age_groups', type: 'pills', label: 'Age Groups Coached', hint: 'Select all that apply',
        options: [
          { value: 'u8', label: 'U8' }, { value: 'u10', label: 'U10' }, { value: 'u12', label: 'U12' },
          { value: 'u14', label: 'U14' }, { value: 'u16', label: 'U16' }, { value: 'u18', label: 'U18' },
          { value: 'adult', label: 'Adult' },
        ],
      },
      { id: 'previous_teams', type: 'textarea', label: 'Previous Teams/Organizations', placeholder: "List teams or organizations you've coached for", hint: 'Include team names, years, and your role' },
      { id: 'playing_experience', type: 'textarea', label: 'Playing Experience', placeholder: 'Describe your basketball playing background' },
      { id: 'coaching_philosophy', type: 'textarea', label: 'Coaching Philosophy', placeholder: 'Describe your approach to coaching and player development', required: true },
    ],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: 'Award',
    fields: [
      {
        id: 'nccp_level', type: 'select', label: 'NCCP Certification Level',
        options: [
          { value: 'none', label: 'No NCCP Certification' },
          { value: 'community_initiation', label: 'Community Initiation' },
          { value: 'community_development', label: 'Community Development' },
          { value: 'competition_introduction', label: 'Competition - Introduction' },
          { value: 'competition_development', label: 'Competition - Development' },
          { value: 'competition_high_performance', label: 'Competition - High Performance' },
        ],
      },
      { id: 'nccp_number', type: 'text', label: 'NCCP Number', placeholder: 'Enter your NCCP number if applicable' },
      {
        id: 'first_aid', type: 'cards', label: 'First Aid Certification', columns: 2,
        options: [
          { value: 'current', label: 'Currently Certified', description: 'Valid first aid certification' },
          { value: 'expired', label: 'Expired', description: 'Willing to recertify' },
          { value: 'none', label: 'Not Certified', description: 'Willing to obtain' },
        ],
      },
      { id: 'first_aid_expiry', type: 'text', label: 'First Aid Expiry Date', placeholder: 'YYYY-MM-DD', hint: 'If currently certified' },
      { id: 'other_certifications', type: 'textarea', label: 'Other Certifications', placeholder: 'List any other relevant certifications', hint: "e.g., CPR, AED, Rowan's Law training, Safe Sport" },
      {
        id: 'background_check_consent', type: 'checkboxes', label: 'Background Check', required: true,
        options: [
          { value: 'consent', label: 'Background Check Consent', description: 'I consent to a vulnerable sector background check as required for coaching' },
        ],
      },
    ],
  },
  {
    id: 'availability',
    label: 'Availability',
    icon: 'Calendar',
    fields: [
      {
        id: 'available_days', type: 'pills', label: 'Available Days', required: true, hint: 'Select all days you can coach',
        options: [
          { value: 'monday', label: 'Monday' }, { value: 'tuesday', label: 'Tuesday' },
          { value: 'wednesday', label: 'Wednesday' }, { value: 'thursday', label: 'Thursday' },
          { value: 'friday', label: 'Friday' }, { value: 'saturday', label: 'Saturday' },
          { value: 'sunday', label: 'Sunday' },
        ],
      },
      {
        id: 'available_times', type: 'pills', label: 'Available Times', hint: 'Select all time slots that work',
        options: [
          { value: 'morning', label: 'Morning (8am-12pm)' },
          { value: 'afternoon', label: 'Afternoon (12pm-5pm)' },
          { value: 'evening', label: 'Evening (5pm-9pm)' },
        ],
      },
      {
        id: 'seasons', type: 'pills', label: 'Seasons Available', required: true,
        options: [
          { value: 'fall', label: 'Fall' }, { value: 'winter', label: 'Winter' },
          { value: 'spring', label: 'Spring' }, { value: 'summer', label: 'Summer' },
        ],
      },
      {
        id: 'commitment_level', type: 'cards', label: 'Commitment Level', required: true, columns: 2,
        options: [
          { value: 'head_coach', label: 'Head Coach', description: 'Lead the team, primary responsibility' },
          { value: 'assistant', label: 'Assistant Coach', description: 'Support the head coach' },
          { value: 'volunteer', label: 'Volunteer Helper', description: 'Occasional support as needed' },
          { value: 'flexible', label: 'Flexible', description: 'Open to any role' },
        ],
      },
      {
        id: 'travel_willing', type: 'checkboxes', label: 'Travel',
        options: [
          { value: 'travel_games', label: 'Available for Away Games', description: 'Willing to travel for games and tournaments' },
        ],
      },
    ],
  },
  {
    id: 'references',
    label: 'Professional References',
    icon: 'Users',
    fields: [
      { id: 'reference1_name', type: 'text', label: 'Reference 1 - Name', placeholder: 'Full name', required: true },
      { id: 'reference1_relationship', type: 'text', label: 'Reference 1 - Relationship', placeholder: 'e.g., Previous Athletic Director', required: true },
      { id: 'reference1_phone', type: 'text', label: 'Reference 1 - Phone', placeholder: '(416) 555-0123', required: true },
      { id: 'reference1_email', type: 'text', label: 'Reference 1 - Email', placeholder: 'reference@example.com' },
      { id: 'reference2_name', type: 'text', label: 'Reference 2 - Name', placeholder: 'Full name', required: true },
      { id: 'reference2_relationship', type: 'text', label: 'Reference 2 - Relationship', placeholder: 'e.g., Former Head Coach', required: true },
      { id: 'reference2_phone', type: 'text', label: 'Reference 2 - Phone', placeholder: '(416) 555-0456', required: true },
      { id: 'reference2_email', type: 'text', label: 'Reference 2 - Email', placeholder: 'reference2@example.com' },
      { id: 'reference3_name', type: 'text', label: 'Reference 3 - Name (Optional)', placeholder: 'Full name' },
      { id: 'reference3_relationship', type: 'text', label: 'Reference 3 - Relationship', placeholder: 'e.g., Parent of former player' },
      { id: 'reference3_phone', type: 'text', label: 'Reference 3 - Phone', placeholder: '(416) 555-0789' },
    ],
  },
];

const DRAFT_KEY = 'coach_registration_draft';

export function CoachRegistrationForm(): React.ReactElement {
  const router = useRouter();

  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      return draft ? JSON.parse(draft) : {};
    } catch { return {}; }
  }, []);

  const handleSave = useCallback((data: Record<string, unknown>): void => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }, []);

  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try {
      await fetch('/api/forms/coach-registration', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      localStorage.removeItem(DRAFT_KEY);
      router.push('/forms');
    } catch (error) { console.error('Failed to submit:', error); }
  }, [router]);

  return (
    <FormBuilder
      title="Coach Application"
      subtitle="Apply to become a coach in our basketball program"
      sections={COACH_SECTIONS}
      initialData={initialData}
      onSubmit={handleSubmit}
      onSave={handleSave}
      submitLabel="Submit Application"
    />
  );
}
