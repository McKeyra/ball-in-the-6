'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'player', label: 'Player Information', icon: 'User',
    fields: [
      { id: 'player_name', type: 'text', label: 'Player Name', placeholder: 'Full name', required: true },
      { id: 'date_of_birth', type: 'text', label: 'Date of Birth', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'blood_type', type: 'select', label: 'Blood Type', options: [
        { value: 'a_pos', label: 'A+' }, { value: 'a_neg', label: 'A-' }, { value: 'b_pos', label: 'B+' },
        { value: 'b_neg', label: 'B-' }, { value: 'ab_pos', label: 'AB+' }, { value: 'ab_neg', label: 'AB-' },
        { value: 'o_pos', label: 'O+' }, { value: 'o_neg', label: 'O-' }, { value: 'unknown', label: 'Unknown' },
      ]},
      { id: 'allergies', type: 'textarea', label: 'Allergies', placeholder: 'List all known allergies...', hint: 'Include food, medication, and environmental allergies' },
    ],
  },
  {
    id: 'conditions', label: 'Medical Conditions', icon: 'Heart',
    fields: [
      { id: 'conditions', type: 'checkboxes', label: 'Medical Conditions', options: [
        { value: 'asthma', label: 'Asthma', description: 'Requires inhaler or medication' },
        { value: 'diabetes', label: 'Diabetes', description: 'Type 1 or Type 2' },
        { value: 'epilepsy', label: 'Epilepsy', description: 'Seizure disorder' },
        { value: 'heart_condition', label: 'Heart Condition', description: 'Any cardiac issues' },
        { value: 'concussion_history', label: 'Previous Concussion', description: 'History of head injury' },
      ]},
      { id: 'condition_notes', type: 'textarea', label: 'Condition Details', placeholder: 'Provide details about any conditions checked above...' },
      { id: 'medications', type: 'textarea', label: 'Current Medications', placeholder: 'List all medications, dosage, and frequency', required: true },
    ],
  },
  {
    id: 'insurance', label: 'Health Insurance', icon: 'Shield',
    fields: [
      { id: 'insurance_provider', type: 'text', label: 'Insurance Provider', placeholder: 'e.g., Ontario Health (OHIP)' },
      { id: 'policy_number', type: 'text', label: 'Policy/Health Card Number', placeholder: 'Enter number' },
      { id: 'group_number', type: 'text', label: 'Group Number', placeholder: 'If applicable' },
    ],
  },
  {
    id: 'physician', label: 'Physician Information', icon: 'Stethoscope',
    fields: [
      { id: 'doctor_name', type: 'text', label: 'Family Doctor Name', placeholder: 'Dr. Smith' },
      { id: 'doctor_phone', type: 'text', label: 'Doctor Phone', placeholder: '(416) 555-0123' },
      { id: 'hospital_preference', type: 'text', label: 'Preferred Hospital', placeholder: 'e.g., SickKids, Toronto General' },
    ],
  },
  {
    id: 'emergency', label: 'Emergency Contacts', icon: 'Phone',
    fields: [
      { id: 'emergency1_name', type: 'text', label: 'Emergency Contact 1 - Name', placeholder: 'Full name', required: true },
      { id: 'emergency1_relationship', type: 'text', label: 'Relationship', placeholder: 'e.g., Parent', required: true },
      { id: 'emergency1_phone', type: 'text', label: 'Phone', placeholder: '(416) 555-0123', required: true },
      { id: 'emergency2_name', type: 'text', label: 'Emergency Contact 2 - Name', placeholder: 'Full name', required: true },
      { id: 'emergency2_relationship', type: 'text', label: 'Relationship', placeholder: 'e.g., Grandparent', required: true },
      { id: 'emergency2_phone', type: 'text', label: 'Phone', placeholder: '(416) 555-0456', required: true },
    ],
  },
];

const DRAFT_KEY = 'medical_form_draft';

export function MedicalFormForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/medical-form', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Medical Information Form" subtitle="Provide important medical information for player safety" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Medical Form" />;
}
