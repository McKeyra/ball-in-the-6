'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'participant', label: 'Participant Information', icon: 'User',
    fields: [
      { id: 'participant_name', type: 'text', label: 'Participant Name', placeholder: 'Full name', required: true },
      { id: 'date_of_birth', type: 'text', label: 'Date of Birth', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'parent_guardian', type: 'text', label: 'Parent/Guardian Name', placeholder: 'If participant is under 18', hint: 'Required for participants under 18' },
    ],
  },
  {
    id: 'waivers', label: 'Waivers & Consents', icon: 'FileText',
    fields: [
      { id: 'liability_waiver', type: 'checkboxes', label: 'Liability Waiver', required: true, options: [
        { value: 'accept_risk', label: 'Assumption of Risk', description: 'I understand that basketball involves physical contact and risk of injury. I voluntarily assume all risks.' },
        { value: 'release_liability', label: 'Release of Liability', description: 'I release Ball in the 6, its coaches, officials, and volunteers from liability for injuries.' },
      ]},
      { id: 'photo_video', type: 'checkboxes', label: 'Photo/Video Release', options: [
        { value: 'photo_consent', label: 'Photo & Video Consent', description: 'I consent to photos and videos being taken and used for promotional purposes, social media, and website.' },
      ]},
      { id: 'medical_auth', type: 'checkboxes', label: 'Medical Authorization', required: true, options: [
        { value: 'emergency_treatment', label: 'Emergency Medical Treatment', description: 'I authorize emergency medical treatment if the participant requires immediate care and I cannot be reached.' },
      ]},
    ],
  },
  {
    id: 'signature', label: 'Signature', icon: 'Pen',
    fields: [
      { id: 'typed_signature', type: 'text', label: 'Typed Signature', placeholder: 'Type your full legal name', required: true, hint: 'By typing your name you acknowledge you have read and agree to all terms above' },
      { id: 'signature_date', type: 'text', label: 'Date', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'signer_capacity', type: 'select', label: 'Signing As', required: true, options: [
        { value: 'self', label: 'Myself (18+)' }, { value: 'parent', label: 'Parent/Guardian' },
        { value: 'legal_guardian', label: 'Legal Guardian' },
      ]},
      { id: 'final_confirmation', type: 'checkboxes', label: 'Final Confirmation', required: true, options: [
        { value: 'confirmed', label: 'I confirm all information provided is accurate and I have read all waivers thoroughly' },
      ]},
    ],
  },
];

const DRAFT_KEY = 'waiver_consent_draft';

export function WaiverConsentForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/waiver-consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Waiver & Consent" subtitle="Review and sign required waivers" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Waiver" />;
}
