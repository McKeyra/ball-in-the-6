'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'personal', label: 'Personal Information', icon: 'User',
    fields: [
      { id: 'full_legal_name', type: 'text', label: 'Full Legal Name', placeholder: 'As it appears on government ID', required: true },
      { id: 'date_of_birth', type: 'text', label: 'Date of Birth', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'sin_last_4', type: 'text', label: 'SIN (Last 4 Digits)', placeholder: 'XXXX', hint: 'Used for identity verification only', required: true },
      { id: 'other_names', type: 'text', label: 'Other Names Used', placeholder: 'Maiden name, former names, aliases', hint: 'List all names you have previously used' },
    ],
  },
  {
    id: 'address', label: 'Address History', icon: 'MapPin',
    fields: [
      { id: 'current_address', type: 'text', label: 'Current Address', placeholder: 'Full street address', required: true },
      { id: 'current_city', type: 'text', label: 'City', placeholder: 'Toronto', required: true },
      { id: 'current_province', type: 'text', label: 'Province', placeholder: 'Ontario', required: true },
      { id: 'current_postal', type: 'text', label: 'Postal Code', placeholder: 'M5V 1A1', required: true },
      { id: 'years_at_current', type: 'select', label: 'Years at Current Address', options: [
        { value: 'less_1', label: 'Less than 1 year' }, { value: '1_3', label: '1-3 years' },
        { value: '3_5', label: '3-5 years' }, { value: '5_plus', label: '5+ years' },
      ]},
      { id: 'previous_addresses', type: 'textarea', label: 'Previous Addresses (last 5 years)', placeholder: 'List previous addresses if less than 5 years at current', hint: 'Include city, province, and dates' },
    ],
  },
  {
    id: 'consent', label: 'Consent', icon: 'Shield',
    fields: [
      { id: 'authorize_check', type: 'checkboxes', label: 'Authorization', required: true, options: [
        { value: 'criminal_check', label: 'Criminal Record Check', description: 'I authorize a Canadian Police Information Centre (CPIC) criminal record check' },
        { value: 'vulnerable_sector', label: 'Vulnerable Sector Check', description: 'I authorize a vulnerable sector screening as I will be working with youth' },
      ]},
      { id: 'understand_results', type: 'checkboxes', label: 'Understanding', required: true, options: [
        { value: 'results_shared', label: 'Results Sharing', description: 'I understand results will be shared with authorized league administrators only' },
        { value: 'may_deny', label: 'Eligibility Decision', description: 'I understand a record may affect my eligibility to volunteer or coach' },
      ]},
      { id: 'information_accuracy', type: 'checkboxes', label: 'Accuracy', required: true, options: [
        { value: 'accurate', label: 'Information Accuracy', description: 'I certify all information provided is true and accurate to the best of my knowledge' },
      ]},
    ],
  },
  {
    id: 'declaration', label: 'Declaration', icon: 'Pen',
    fields: [
      { id: 'truthfulness', type: 'checkboxes', label: 'Truthfulness Declaration', required: true, options: [
        { value: 'truthful', label: 'Declaration of Truthfulness', description: 'I declare that all information provided in this form is true and complete. I understand that providing false information may result in immediate disqualification.' },
      ]},
      { id: 'data_consent', type: 'checkboxes', label: 'Data Privacy Consent', required: true, options: [
        { value: 'data_consent', label: 'Data Privacy', description: 'I consent to the collection and processing of my personal data for the purpose of conducting this background check in accordance with PIPEDA.' },
      ]},
      { id: 'typed_signature', type: 'text', label: 'Typed Signature', placeholder: 'Type your full legal name', required: true, hint: 'By typing your name you authorize this background check' },
      { id: 'signature_date', type: 'text', label: 'Date', placeholder: 'YYYY-MM-DD', required: true },
    ],
  },
];

const DRAFT_KEY = 'background_check_draft';

export function BackgroundCheckForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/background-check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Background Check Consent" subtitle="Authorize a background check for volunteer or coaching roles" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Consent" />;
}
