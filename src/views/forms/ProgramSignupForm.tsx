'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'participant', label: 'Participant Information', icon: 'User',
    fields: [
      { id: 'participant_first_name', type: 'text', label: 'Participant First Name', placeholder: 'Enter first name', required: true },
      { id: 'participant_last_name', type: 'text', label: 'Participant Last Name', placeholder: 'Enter last name', required: true },
      { id: 'date_of_birth', type: 'text', label: 'Date of Birth', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'age', type: 'select', label: 'Age', required: true, options: Array.from({ length: 14 }, (_, i) => ({ value: i < 13 ? String(i + 5) : '18+', label: i < 13 ? `${i + 5} years old` : '18+ years old' })) },
      { id: 'gender', type: 'pills', label: 'Gender', maxSelect: 1, options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }] },
      { id: 'skill_level', type: 'cards', label: 'Skill Level', required: true, columns: 2, options: [
        { value: 'beginner', label: 'Beginner', description: 'New to basketball, learning basics' },
        { value: 'intermediate', label: 'Intermediate', description: 'Knows fundamentals, developing skills' },
        { value: 'advanced', label: 'Advanced', description: 'Strong skills, competitive player' },
        { value: 'elite', label: 'Elite', description: 'High-level, rep experience' },
      ]},
      { id: 't_shirt_size', type: 'select', label: 'T-Shirt Size', required: true, options: [
        { value: 'yxs', label: 'Youth XS' }, { value: 'ys', label: 'Youth S' }, { value: 'ym', label: 'Youth M' },
        { value: 'yl', label: 'Youth L' }, { value: 'yxl', label: 'Youth XL' }, { value: 'as', label: 'Adult S' },
        { value: 'am', label: 'Adult M' }, { value: 'al', label: 'Adult L' }, { value: 'axl', label: 'Adult XL' },
        { value: 'axxl', label: 'Adult XXL' },
      ]},
    ],
  },
  {
    id: 'program', label: 'Program Selection', icon: 'CalendarDays',
    fields: [
      { id: 'program_type', type: 'cards', label: 'Select Program', required: true, columns: 2, options: [
        { value: 'skills_camp', label: 'Skills Development Camp', description: 'Intensive skill-building program' },
        { value: 'shooting_clinic', label: 'Shooting Clinic', description: 'Focus on shooting mechanics' },
        { value: 'basketball_101', label: 'Basketball 101', description: 'Introduction to basketball basics' },
        { value: 'elite_training', label: 'Elite Training Program', description: 'Advanced training for competitive players' },
        { value: 'summer_camp', label: 'Summer Basketball Camp', description: 'Week-long summer program' },
        { value: 'march_break', label: 'March Break Camp', description: 'March break intensive' },
        { value: 'holiday_camp', label: 'Holiday Camp', description: 'Winter holiday program' },
        { value: 'weekend_clinic', label: 'Weekend Clinic', description: 'Single weekend session' },
      ]},
      { id: 'session_dates', type: 'select', label: 'Session Dates', required: true, options: [
        { value: 'jan_13_17', label: 'January 13-17, 2026' }, { value: 'feb_17_21', label: 'February 17-21, 2026 (March Break)' },
        { value: 'mar_16_20', label: 'March 16-20, 2026' }, { value: 'apr_13_17', label: 'April 13-17, 2026' },
        { value: 'jun_29_jul_3', label: 'June 29 - July 3, 2026' }, { value: 'jul_6_10', label: 'July 6-10, 2026' },
        { value: 'jul_13_17', label: 'July 13-17, 2026' }, { value: 'jul_20_24', label: 'July 20-24, 2026' },
        { value: 'jul_27_31', label: 'July 27-31, 2026' }, { value: 'aug_3_7', label: 'August 3-7, 2026' },
        { value: 'aug_10_14', label: 'August 10-14, 2026' }, { value: 'aug_17_21', label: 'August 17-21, 2026' },
        { value: 'aug_24_28', label: 'August 24-28, 2026' }, { value: 'dec_21_23', label: 'December 21-23, 2026 (Holiday)' },
        { value: 'dec_28_30', label: 'December 28-30, 2026 (Holiday)' },
      ]},
      { id: 'session_time', type: 'pills', label: 'Preferred Session Time', required: true, maxSelect: 1, options: [
        { value: 'morning', label: 'Morning (9am-12pm)' }, { value: 'afternoon', label: 'Afternoon (1pm-4pm)' },
        { value: 'full_day', label: 'Full Day (9am-4pm)' },
      ]},
      { id: 'location_preference', type: 'select', label: 'Location Preference', options: [
        { value: 'downsview', label: 'Downsview Park' }, { value: 'scarborough', label: 'Scarborough Sports Centre' },
        { value: 'etobicoke', label: 'Etobicoke Olympium' }, { value: 'north_york', label: 'North York Civic Centre' },
        { value: 'no_preference', label: 'No Preference' },
      ]},
      { id: 'extended_care', type: 'checkboxes', label: 'Extended Care Options', hint: 'Additional fees apply', options: [
        { value: 'before_care', label: 'Before Care (8am-9am)', description: 'Early drop-off option (+$25/week)' },
        { value: 'after_care', label: 'After Care (4pm-5:30pm)', description: 'Late pick-up option (+$35/week)' },
      ]},
      { id: 'additional_weeks', type: 'checkboxes', label: 'Register for Additional Weeks?', hint: 'Save 10% when registering for multiple weeks', options: [
        { value: 'week_2', label: 'Add 2nd Week', description: '10% discount applied' },
        { value: 'week_3', label: 'Add 3rd Week', description: '10% discount applied' },
        { value: 'week_4', label: 'Add 4th Week', description: '10% discount applied' },
      ]},
    ],
  },
  {
    id: 'medical', label: 'Medical Information', icon: 'Heart',
    fields: [
      { id: 'allergies', type: 'textarea', label: 'Allergies', placeholder: 'List any allergies (food, medication, environmental)', hint: 'Leave blank if none' },
      { id: 'medical_conditions', type: 'textarea', label: 'Medical Conditions', placeholder: 'List any medical conditions we should be aware of' },
      { id: 'medications', type: 'textarea', label: 'Medications', placeholder: 'List any medications the participant takes' },
      { id: 'dietary_restrictions', type: 'pills', label: 'Dietary Restrictions', hint: 'Select all that apply (for snacks provided)', options: [
        { value: 'none', label: 'None' }, { value: 'vegetarian', label: 'Vegetarian' }, { value: 'vegan', label: 'Vegan' },
        { value: 'gluten_free', label: 'Gluten-Free' }, { value: 'dairy_free', label: 'Dairy-Free' },
        { value: 'nut_free', label: 'Nut-Free' }, { value: 'halal', label: 'Halal' }, { value: 'kosher', label: 'Kosher' },
      ]},
      { id: 'emergency_contact_name', type: 'text', label: 'Emergency Contact Name', placeholder: 'Full name', required: true },
      { id: 'emergency_contact_phone', type: 'text', label: 'Emergency Contact Phone', placeholder: '(416) 555-0123', required: true },
      { id: 'emergency_contact_relationship', type: 'text', label: 'Relationship to Participant', placeholder: 'e.g., Parent, Guardian, Aunt', required: true },
      { id: 'authorized_pickup', type: 'textarea', label: 'Authorized Pickup Persons', placeholder: 'List names of people authorized to pick up the participant', hint: 'Include names and relationship' },
    ],
  },
  {
    id: 'payment', label: 'Payment Information', icon: 'CreditCard',
    fields: [
      { id: 'payment_method', type: 'cards', label: 'Payment Method', required: true, columns: 2, options: [
        { value: 'credit_card', label: 'Credit Card', description: 'Pay now with credit card' },
        { value: 'debit', label: 'Debit Card', description: 'Pay now with debit' },
        { value: 'etransfer', label: 'E-Transfer', description: 'Send payment via e-transfer' },
        { value: 'installments', label: 'Payment Plan', description: 'Split into 2 payments' },
      ]},
      { id: 'promo_code', type: 'text', label: 'Promo Code', placeholder: 'Enter promo code if you have one', hint: 'Discount will be applied at checkout' },
      { id: 'sibling_discount', type: 'checkboxes', label: 'Sibling Discount', options: [
        { value: 'sibling', label: 'Sibling Enrolled', description: '10% sibling discount applies if another family member is registered' },
      ]},
      { id: 'sibling_name', type: 'text', label: 'Sibling Name (if applicable)', placeholder: 'Name of sibling registered' },
      { id: 'billing_name', type: 'text', label: 'Billing Name', placeholder: 'Name on card or account', required: true },
      { id: 'billing_email', type: 'text', label: 'Billing Email', placeholder: 'email@example.com', required: true, hint: 'Receipt will be sent to this email' },
      { id: 'billing_phone', type: 'text', label: 'Billing Phone', placeholder: '(416) 555-0123', required: true },
      { id: 'billing_address', type: 'text', label: 'Billing Address', placeholder: 'Street address' },
      { id: 'billing_city', type: 'text', label: 'City', placeholder: 'Toronto' },
      { id: 'billing_postal', type: 'text', label: 'Postal Code', placeholder: 'M5V 1A1' },
    ],
  },
  {
    id: 'waivers', label: 'Waivers & Agreements', icon: 'FileCheck',
    fields: [
      { id: 'waivers_accepted', type: 'checkboxes', label: 'Required Agreements', required: true, options: [
        { value: 'liability_waiver', label: 'Liability Waiver', description: 'I acknowledge the inherent risks of basketball activities and release the organization from liability' },
        { value: 'photo_release', label: 'Photo & Video Release', description: 'I consent to photos and videos being taken and used for promotional purposes' },
        { value: 'medical_consent', label: 'Medical Treatment Authorization', description: 'I authorize emergency medical treatment if I cannot be reached' },
        { value: 'code_of_conduct', label: 'Code of Conduct', description: 'Participant agrees to follow the program code of conduct' },
      ]},
      { id: 'refund_policy', type: 'checkboxes', label: 'Refund Policy', required: true, options: [
        { value: 'acknowledged', label: 'I Acknowledge the Refund Policy', description: 'Full refund up to 14 days before program start. 50% refund up to 7 days. No refund within 7 days.' },
      ]},
      { id: 'health_screening', type: 'checkboxes', label: 'Health Screening', required: true, options: [
        { value: 'confirmed', label: 'Health Screening Confirmation', description: 'I confirm the participant is in good health and fit to participate in physical activities' },
      ]},
      { id: 'parent_signature', type: 'text', label: 'Parent/Guardian Signature', placeholder: 'Type your full legal name', required: true, hint: 'By typing your name, you confirm all information is accurate' },
      { id: 'signature_date', type: 'text', label: 'Date', placeholder: 'YYYY-MM-DD', required: true },
    ],
  },
];

const DRAFT_KEY = 'program_signup_draft';

export function ProgramSignupForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/program-signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Program Registration" subtitle="Sign up for basketball camps and clinics" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Complete Registration" />;
}
