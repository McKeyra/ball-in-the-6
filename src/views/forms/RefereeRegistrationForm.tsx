'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const REFEREE_SECTIONS: FormSection[] = [
  {
    id: 'personal',
    label: 'Personal Information',
    icon: 'User',
    fields: [
      { id: 'first_name', type: 'text', label: 'First Name', placeholder: 'Enter your first name', required: true },
      { id: 'last_name', type: 'text', label: 'Last Name', placeholder: 'Enter your last name', required: true },
      { id: 'email', type: 'text', label: 'Email Address', placeholder: 'referee@example.com', required: true },
      { id: 'phone', type: 'text', label: 'Phone Number', placeholder: '(416) 555-0123', required: true },
      { id: 'address', type: 'text', label: 'Home Address', placeholder: 'Street address' },
      { id: 'city', type: 'text', label: 'City', placeholder: 'Toronto', required: true },
      { id: 'postal_code', type: 'text', label: 'Postal Code', placeholder: 'M5V 1A1' },
    ],
  },
  {
    id: 'qualifications',
    label: 'Qualifications',
    icon: 'Award',
    fields: [
      {
        id: 'certification_level', type: 'cards', label: 'Certification Level', required: true, columns: 2,
        options: [
          { value: 'none', label: 'No Certification', description: 'New to officiating, willing to train' },
          { value: 'level_1', label: 'Level 1 - Community', description: 'Basic certification for recreational games' },
          { value: 'level_2', label: 'Level 2 - Provincial', description: 'Certified for competitive play' },
          { value: 'level_3', label: 'Level 3 - National', description: 'Advanced certification' },
        ],
      },
      { id: 'certification_number', type: 'text', label: 'Certification Number', placeholder: 'Enter your certification number', hint: 'If applicable' },
      {
        id: 'years_experience', type: 'select', label: 'Years of Officiating Experience', required: true,
        options: [
          { value: '0', label: 'No experience' }, { value: '1-2', label: '1-2 years' },
          { value: '3-5', label: '3-5 years' }, { value: '6-10', label: '6-10 years' },
          { value: '10+', label: '10+ years' },
        ],
      },
      {
        id: 'game_levels', type: 'pills', label: 'Game Levels Officiated', hint: 'Select all that apply',
        options: [
          { value: 'recreational', label: 'Recreational' }, { value: 'house_league', label: 'House League' },
          { value: 'rep', label: 'Rep/Travel' }, { value: 'high_school', label: 'High School' },
          { value: 'college', label: 'College/University' }, { value: 'professional', label: 'Professional' },
        ],
      },
      {
        id: 'age_groups', type: 'pills', label: 'Age Groups Preferred', hint: "Select all you're comfortable with",
        options: [
          { value: 'u10', label: 'U10' }, { value: 'u12', label: 'U12' }, { value: 'u14', label: 'U14' },
          { value: 'u16', label: 'U16' }, { value: 'u18', label: 'U18' }, { value: 'adult', label: 'Adult' },
        ],
      },
      {
        id: 'rules_knowledge', type: 'cards', label: 'Rules Knowledge', required: true, columns: 2,
        options: [
          { value: 'basic', label: 'Basic', description: 'Know fundamental rules' },
          { value: 'intermediate', label: 'Intermediate', description: 'Comfortable with most situations' },
          { value: 'advanced', label: 'Advanced', description: 'Expert knowledge of rules' },
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
        id: 'available_days', type: 'pills', label: 'Available Days', required: true, hint: 'Select all days you can officiate',
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
          { value: 'evening', label: 'Evening (5pm-10pm)' },
        ],
      },
      {
        id: 'travel_radius', type: 'select', label: 'Travel Radius', required: true,
        options: [
          { value: '5km', label: 'Up to 5 km' }, { value: '10km', label: 'Up to 10 km' },
          { value: '25km', label: 'Up to 25 km' }, { value: '50km', label: 'Up to 50 km' },
          { value: 'unlimited', label: 'No limit' },
        ],
      },
      {
        id: 'games_per_week', type: 'select', label: 'Games Per Week', required: true, hint: 'Maximum number of games you can officiate weekly',
        options: [
          { value: '1-2', label: '1-2 games' }, { value: '3-5', label: '3-5 games' },
          { value: '6-10', label: '6-10 games' }, { value: '10+', label: '10+ games' },
        ],
      },
      {
        id: 'tournament_available', type: 'checkboxes', label: 'Tournament Availability',
        options: [
          { value: 'weekday_tournaments', label: 'Weekday Tournaments', description: 'Available for tournaments during the week' },
          { value: 'weekend_tournaments', label: 'Weekend Tournaments', description: 'Available for weekend tournaments' },
          { value: 'holiday_tournaments', label: 'Holiday Tournaments', description: 'Available during holiday periods' },
        ],
      },
    ],
  },
  {
    id: 'equipment',
    label: 'Equipment & Uniform',
    icon: 'Shirt',
    fields: [
      {
        id: 'uniform_size_shirt', type: 'select', label: 'Referee Shirt Size', required: true,
        options: [
          { value: 'xs', label: 'Extra Small' }, { value: 's', label: 'Small' }, { value: 'm', label: 'Medium' },
          { value: 'l', label: 'Large' }, { value: 'xl', label: 'XL' }, { value: 'xxl', label: 'XXL' },
          { value: 'xxxl', label: 'XXXL' },
        ],
      },
      {
        id: 'uniform_size_pants', type: 'select', label: 'Referee Pants Size', required: true,
        options: [
          { value: '28', label: '28' }, { value: '30', label: '30' }, { value: '32', label: '32' },
          { value: '34', label: '34' }, { value: '36', label: '36' }, { value: '38', label: '38' },
          { value: '40', label: '40' }, { value: '42', label: '42' }, { value: '44', label: '44' },
        ],
      },
      {
        id: 'has_own_uniform', type: 'checkboxes', label: 'Equipment Owned', hint: 'Check items you already own',
        options: [
          { value: 'referee_shirt', label: 'Referee Shirt', description: 'Official black/white striped shirt' },
          { value: 'referee_pants', label: 'Referee Pants', description: 'Official black pants' },
          { value: 'whistle', label: 'Whistle', description: 'Fox 40 or equivalent' },
          { value: 'lanyard', label: 'Whistle Lanyard', description: 'Finger grip or neck lanyard' },
        ],
      },
      {
        id: 'whistle_preference', type: 'pills', label: 'Whistle Preference', maxSelect: 1,
        options: [
          { value: 'fox40_classic', label: 'Fox 40 Classic' }, { value: 'fox40_mini', label: 'Fox 40 Mini' },
          { value: 'acme_thunderer', label: 'Acme Thunderer' }, { value: 'electronic', label: 'Electronic' },
          { value: 'no_preference', label: 'No Preference' },
        ],
      },
    ],
  },
  {
    id: 'payment',
    label: 'Payment Information',
    icon: 'CreditCard',
    fields: [
      {
        id: 'rate_preference', type: 'cards', label: 'Rate Preference', required: true, columns: 2,
        options: [
          { value: 'standard', label: 'Standard Rate', description: 'League standard per-game rate' },
          { value: 'volunteer', label: 'Volunteer', description: 'No payment required' },
          { value: 'negotiable', label: 'Negotiable', description: 'Open to discussion' },
        ],
      },
      {
        id: 'payment_method', type: 'pills', label: 'Preferred Payment Method', maxSelect: 1,
        options: [
          { value: 'direct_deposit', label: 'Direct Deposit' }, { value: 'etransfer', label: 'E-Transfer' },
          { value: 'cheque', label: 'Cheque' }, { value: 'cash', label: 'Cash' },
        ],
      },
      { id: 'bank_name', type: 'text', label: 'Bank Name', placeholder: 'Enter bank name for direct deposit', hint: 'Required for direct deposit' },
      { id: 'bank_transit', type: 'text', label: 'Transit Number', placeholder: '5 digits', hint: 'Required for direct deposit' },
      { id: 'bank_institution', type: 'text', label: 'Institution Number', placeholder: '3 digits', hint: 'Required for direct deposit' },
      { id: 'bank_account', type: 'text', label: 'Account Number', placeholder: 'Account number', hint: 'Required for direct deposit' },
      { id: 'etransfer_email', type: 'text', label: 'E-Transfer Email', placeholder: 'email@example.com', hint: 'For e-transfer payments' },
      {
        id: 'payment_consent', type: 'checkboxes', label: 'Payment Agreement', required: true,
        options: [
          { value: 'terms_accepted', label: 'Payment Terms', description: 'I understand payments are processed bi-weekly and agree to the league payment terms' },
        ],
      },
    ],
  },
];

const DRAFT_KEY = 'referee_registration_draft';

export function RefereeRegistrationForm(): React.ReactElement {
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
      await fetch('/api/forms/referee-registration', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      localStorage.removeItem(DRAFT_KEY);
      router.push('/forms');
    } catch (error) { console.error('Failed to submit:', error); }
  }, [router]);

  return (
    <FormBuilder
      title="Referee Registration"
      subtitle="Sign up to officiate games in our basketball league"
      sections={REFEREE_SECTIONS}
      initialData={initialData}
      onSubmit={handleSubmit}
      onSave={handleSave}
      submitLabel="Submit Registration"
    />
  );
}
