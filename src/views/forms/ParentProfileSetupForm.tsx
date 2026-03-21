'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'personal', label: 'Personal Information', icon: 'User', description: 'Your basic contact information',
    fields: [
      { id: 'first_name', type: 'text', label: 'First Name', placeholder: 'Jane', required: true },
      { id: 'last_name', type: 'text', label: 'Last Name', placeholder: 'Smith', required: true },
      { id: 'email', type: 'text', label: 'Email Address', placeholder: 'jane.smith@example.com', required: true, hint: "We'll use this for important notifications" },
      { id: 'phone', type: 'text', label: 'Phone Number', placeholder: '(416) 555-0123', required: true },
      { id: 'photo', type: 'upload', label: 'Profile Photo', accept: 'image/*', hint: 'JPG, PNG up to 5MB' },
    ],
  },
  {
    id: 'children', label: 'Children', icon: 'Users', description: 'Add your children who participate in sports',
    fields: [
      { id: 'child_1_name', type: 'text', label: 'Child 1 - Full Name', placeholder: 'Alex Smith', required: true },
      { id: 'child_1_dob', type: 'text', label: 'Child 1 - Date of Birth', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'child_1_team', type: 'text', label: 'Child 1 - Team', placeholder: 'Toronto Thunder U12' },
      { id: 'child_2_name', type: 'text', label: 'Child 2 - Full Name (Optional)', placeholder: 'Jordan Smith' },
      { id: 'child_2_dob', type: 'text', label: 'Child 2 - Date of Birth', placeholder: 'YYYY-MM-DD' },
      { id: 'child_2_team', type: 'text', label: 'Child 2 - Team', placeholder: 'Toronto Thunder U10' },
      { id: 'child_3_name', type: 'text', label: 'Child 3 - Full Name (Optional)', placeholder: 'Sam Smith' },
      { id: 'child_3_dob', type: 'text', label: 'Child 3 - Date of Birth', placeholder: 'YYYY-MM-DD' },
      { id: 'child_3_team', type: 'text', label: 'Child 3 - Team', placeholder: 'Toronto Thunder U8' },
    ],
  },
  {
    id: 'preferences', label: 'Notification Preferences', icon: 'Bell', description: 'How would you like to be notified?',
    fields: [
      { id: 'notifications', type: 'checkboxes', label: 'Notification Methods', hint: 'Select all that apply', options: [
        { value: 'email', label: 'Email', description: 'Receive updates via email' },
        { value: 'sms', label: 'SMS', description: 'Text message alerts' },
        { value: 'push', label: 'Push Notifications', description: 'In-app notifications' },
      ]},
      { id: 'language', type: 'select', label: 'Preferred Language', required: true, options: [
        { value: 'en', label: 'English' }, { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' }, { value: 'zh', label: 'Chinese (Simplified)' },
        { value: 'pt', label: 'Portuguese' },
      ]},
    ],
  },
  {
    id: 'emergency', label: 'Emergency Information', icon: 'Heart', description: 'Important emergency contact details',
    fields: [
      { id: 'emergency_contact_name', type: 'text', label: 'Alternate Emergency Contact Name', placeholder: 'John Smith', required: true, hint: "Someone we can contact if we can't reach you" },
      { id: 'emergency_contact_phone', type: 'text', label: 'Emergency Contact Phone', placeholder: '(416) 555-0456', required: true },
      { id: 'emergency_contact_relationship', type: 'select', label: 'Relationship', required: true, options: [
        { value: 'spouse', label: 'Spouse/Partner' }, { value: 'grandparent', label: 'Grandparent' },
        { value: 'sibling', label: 'Sibling' }, { value: 'aunt_uncle', label: 'Aunt/Uncle' },
        { value: 'family_friend', label: 'Family Friend' }, { value: 'neighbor', label: 'Neighbor' },
        { value: 'other', label: 'Other' },
      ]},
      { id: 'medical_authorization', type: 'checkboxes', label: 'Medical Authorization', required: true, options: [
        { value: 'emergency_treatment', label: 'Emergency Treatment Authorization', description: 'I authorize emergency medical treatment for my child(ren) if I cannot be reached' },
        { value: 'medical_info_release', label: 'Medical Information Release', description: 'I consent to sharing medical information with coaches for safety purposes' },
      ]},
      { id: 'medical_notes', type: 'textarea', label: 'Medical Notes & Allergies', placeholder: 'List any allergies, medical conditions, or medications...', hint: 'This information will be kept confidential and shared only with necessary staff' },
    ],
  },
  {
    id: 'communication', label: 'Communication Preferences', icon: 'Mail', description: 'Stay updated with news and events',
    fields: [
      { id: 'communication_prefs', type: 'checkboxes', label: 'I would like to receive:', options: [
        { value: 'newsletter', label: 'Weekly Newsletter', description: 'League news, tips, and highlights' },
        { value: 'event_alerts', label: 'Event Alerts', description: 'Notifications about upcoming events and tournaments' },
        { value: 'game_reminders', label: 'Game Reminders', description: 'Reminders 24 hours before scheduled games' },
        { value: 'practice_updates', label: 'Practice Updates', description: 'Practice schedule changes and cancellations' },
        { value: 'volunteer_opportunities', label: 'Volunteer Opportunities', description: 'Ways to get involved with the team' },
      ]},
      { id: 'quiet_hours', type: 'pills', label: 'Quiet Hours (No notifications)', hint: 'Select time periods when you prefer not to receive notifications', maxSelect: 1, options: [
        { value: 'none', label: 'No Quiet Hours' }, { value: 'night', label: '10 PM - 7 AM' },
        { value: 'work', label: '9 AM - 5 PM' }, { value: 'evening', label: '6 PM - 9 PM' },
      ]},
    ],
  },
];

const DRAFT_KEY = 'parent_profile_draft';

export function ParentProfileSetupForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/parent-profile-setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Parent Profile Setup" subtitle="Complete your profile to access the parent portal" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Complete Setup" />;
}
