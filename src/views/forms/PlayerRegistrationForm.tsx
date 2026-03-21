'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const PLAYER_SECTIONS: FormSection[] = [
  {
    id: 'player_info',
    label: 'Player Information',
    icon: 'User',
    fields: [
      { id: 'first_name', type: 'text', label: 'First Name', placeholder: "Enter player's first name", required: true },
      { id: 'last_name', type: 'text', label: 'Last Name', placeholder: "Enter player's last name", required: true },
      { id: 'date_of_birth', type: 'text', label: 'Date of Birth', placeholder: 'YYYY-MM-DD', required: true, hint: 'Player must meet age requirements for division' },
      {
        id: 'gender', type: 'pills', label: 'Gender', required: true, maxSelect: 1,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
        ],
      },
      { id: 'photo', type: 'upload', label: 'Player Photo', accept: 'image/*', hint: 'Upload a recent photo for team roster and ID card' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact Information',
    icon: 'Phone',
    fields: [
      { id: 'parent_name', type: 'text', label: 'Parent/Guardian Name', placeholder: 'Full name of parent or guardian', required: true },
      { id: 'parent_email', type: 'text', label: 'Email Address', placeholder: 'parent@example.com', required: true },
      { id: 'parent_phone', type: 'text', label: 'Phone Number', placeholder: '(416) 555-0123', required: true },
      { id: 'emergency_contact_name', type: 'text', label: 'Emergency Contact Name', placeholder: 'Alternative contact name', required: true },
      { id: 'emergency_contact_phone', type: 'text', label: 'Emergency Contact Phone', placeholder: '(416) 555-0456', required: true },
      { id: 'emergency_contact_relationship', type: 'text', label: 'Relationship to Player', placeholder: 'e.g., Grandparent, Aunt, Family Friend' },
    ],
  },
  {
    id: 'medical',
    label: 'Medical Information',
    icon: 'Heart',
    fields: [
      { id: 'allergies', type: 'textarea', label: 'Allergies', placeholder: 'List any allergies (food, medication, environmental)', hint: 'Leave blank if none' },
      { id: 'medical_conditions', type: 'textarea', label: 'Medical Conditions', placeholder: 'List any medical conditions we should be aware of', hint: 'e.g., Asthma, Diabetes, Epilepsy' },
      { id: 'medications', type: 'textarea', label: 'Current Medications', placeholder: 'List any medications the player takes regularly' },
      { id: 'doctor_name', type: 'text', label: 'Family Doctor Name', placeholder: 'Dr. Smith' },
      { id: 'doctor_phone', type: 'text', label: "Doctor's Phone Number", placeholder: '(416) 555-0789' },
      { id: 'health_card_number', type: 'text', label: 'Health Card Number', placeholder: 'Ontario Health Card Number', hint: 'For emergency medical situations only' },
    ],
  },
  {
    id: 'preferences',
    label: 'Player Preferences',
    icon: 'Settings',
    fields: [
      {
        id: 'preferred_position', type: 'pills', label: 'Preferred Position', maxSelect: 2, hint: 'Select up to 2 positions',
        options: [
          { value: 'point_guard', label: 'Point Guard' },
          { value: 'shooting_guard', label: 'Shooting Guard' },
          { value: 'small_forward', label: 'Small Forward' },
          { value: 'power_forward', label: 'Power Forward' },
          { value: 'center', label: 'Center' },
          { value: 'no_preference', label: 'No Preference' },
        ],
      },
      {
        id: 'skill_level', type: 'cards', label: 'Skill Level', required: true, columns: 2,
        options: [
          { value: 'beginner', label: 'Beginner', description: 'New to basketball, learning fundamentals' },
          { value: 'intermediate', label: 'Intermediate', description: 'Knows basics, developing skills' },
          { value: 'advanced', label: 'Advanced', description: 'Strong skills, competitive experience' },
          { value: 'elite', label: 'Elite', description: 'High-level player, rep/travel experience' },
        ],
      },
      { id: 'previous_experience', type: 'textarea', label: 'Previous Basketball Experience', placeholder: 'Describe any previous teams, leagues, or training', hint: 'Include years played and any notable achievements' },
      {
        id: 'jersey_size', type: 'select', label: 'Jersey Size', required: true,
        options: [
          { value: 'ys', label: 'Youth Small' }, { value: 'ym', label: 'Youth Medium' },
          { value: 'yl', label: 'Youth Large' }, { value: 'yxl', label: 'Youth XL' },
          { value: 'as', label: 'Adult Small' }, { value: 'am', label: 'Adult Medium' },
          { value: 'al', label: 'Adult Large' }, { value: 'axl', label: 'Adult XL' },
          { value: 'axxl', label: 'Adult XXL' },
        ],
      },
    ],
  },
  {
    id: 'waivers',
    label: 'Waivers & Agreements',
    icon: 'FileCheck',
    fields: [
      {
        id: 'waivers_accepted', type: 'checkboxes', label: 'Required Agreements', required: true,
        options: [
          { value: 'liability_waiver', label: 'Liability Waiver', description: 'I acknowledge the inherent risks of basketball and release the league from liability for injuries' },
          { value: 'photo_release', label: 'Photo & Media Release', description: 'I consent to photos and videos of my child being used for league promotion' },
          { value: 'code_of_conduct', label: 'Code of Conduct', description: "I agree to uphold the league's code of conduct for players and parents" },
        ],
      },
      {
        id: 'medical_consent', type: 'checkboxes', label: 'Medical Consent', required: true,
        options: [
          { value: 'medical_treatment', label: 'Medical Treatment Authorization', description: 'I authorize emergency medical treatment if I cannot be reached' },
        ],
      },
      { id: 'parent_signature', type: 'text', label: 'Parent/Guardian Signature', placeholder: 'Type your full legal name', required: true, hint: 'By typing your name, you confirm all information is accurate' },
      { id: 'signature_date', type: 'text', label: 'Date', placeholder: 'YYYY-MM-DD', required: true },
    ],
  },
];

const DRAFT_KEY = 'player_registration_draft';

export function PlayerRegistrationForm(): React.ReactElement {
  const router = useRouter();

  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  const handleSave = useCallback((data: Record<string, unknown>): void => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }, []);

  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try {
      await fetch('/api/forms/player-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      localStorage.removeItem(DRAFT_KEY);
      router.push('/forms');
    } catch (error) {
      console.error('Failed to submit player registration:', error);
    }
  }, [router]);

  return (
    <FormBuilder
      title="Player Registration"
      subtitle="Register your child for the upcoming basketball season"
      sections={PLAYER_SECTIONS}
      initialData={initialData}
      onSubmit={handleSubmit}
      onSave={handleSave}
      submitLabel="Register Player"
    />
  );
}
