'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'incident', label: 'Incident Details', icon: 'AlertTriangle',
    fields: [
      { id: 'incident_date', type: 'text', label: 'Date of Incident', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'incident_time', type: 'text', label: 'Time of Incident', placeholder: 'HH:MM', required: true },
      { id: 'location', type: 'text', label: 'Location', placeholder: 'Where did the incident occur?', required: true },
      { id: 'incident_type', type: 'cards', label: 'Incident Type', required: true, columns: 1, options: [
        { value: 'injury', label: 'Injury', description: 'Physical injury during play or at venue' },
        { value: 'behavioral', label: 'Behavioral', description: 'Unsportsmanlike conduct or behavioral issue' },
        { value: 'facility', label: 'Facility', description: 'Facility-related safety issue' },
      ]},
      { id: 'severity', type: 'cards', label: 'Severity Level', required: true, columns: 2, options: [
        { value: 'minor', label: 'Minor', description: 'No medical attention needed' },
        { value: 'moderate', label: 'Moderate', description: 'First aid administered' },
        { value: 'serious', label: 'Serious', description: 'Medical attention required' },
        { value: 'critical', label: 'Critical', description: 'Emergency services called' },
      ]},
    ],
  },
  {
    id: 'people-involved', label: 'People Involved', icon: 'Users',
    fields: [
      { id: 'primary_person', type: 'text', label: 'Primary Person Involved', placeholder: 'Full name', required: true },
      { id: 'primary_role', type: 'select', label: 'Role', required: true, options: [
        { value: 'player', label: 'Player' }, { value: 'coach', label: 'Coach' },
        { value: 'referee', label: 'Referee' }, { value: 'spectator', label: 'Spectator' },
        { value: 'volunteer', label: 'Volunteer' }, { value: 'staff', label: 'Staff' },
      ]},
      { id: 'primary_contact', type: 'text', label: 'Contact Information', placeholder: 'Phone or email' },
      { id: 'other_people', type: 'textarea', label: 'Other People Involved', placeholder: 'List names and roles of others involved' },
    ],
  },
  {
    id: 'description', label: 'Description', icon: 'FileText',
    fields: [
      { id: 'what_happened', type: 'textarea', label: 'What Happened?', placeholder: 'Provide a detailed account of the incident...', required: true, rows: 6 },
      { id: 'immediate_response', type: 'textarea', label: 'Immediate Response Taken', placeholder: 'What actions were taken immediately?', rows: 4 },
      { id: 'contributing_factors', type: 'checkboxes', label: 'Contributing Factors', options: [
        { value: 'wet_floor', label: 'Wet/Slippery Floor' }, { value: 'equipment', label: 'Equipment Issue' },
        { value: 'overcrowding', label: 'Overcrowding' }, { value: 'poor_lighting', label: 'Poor Lighting' },
        { value: 'aggressive_play', label: 'Aggressive Play' }, { value: 'unsupervised', label: 'Lack of Supervision' },
      ]},
    ],
  },
  {
    id: 'witnesses', label: 'Witnesses', icon: 'Eye',
    fields: [
      { id: 'has_witnesses', type: 'cards', label: 'Were There Witnesses?', columns: 2, options: [
        { value: 'yes', label: 'Yes', description: 'Witnesses present' },
        { value: 'no', label: 'No', description: 'No witnesses' },
      ]},
      { id: 'witness_details', type: 'textarea', label: 'Witness Details', placeholder: 'Names and contact info of witnesses', hint: 'If witnesses were present' },
    ],
  },
  {
    id: 'action-taken', label: 'Action Taken', icon: 'CheckCircle',
    fields: [
      { id: 'first_aid', type: 'cards', label: 'First Aid Administered', columns: 1, options: [
        { value: 'yes', label: 'Yes - First aid was provided' },
        { value: 'no', label: 'No - Not required' },
        { value: 'ems', label: 'EMS Called' },
      ]},
      { id: 'disciplinary_action', type: 'checkboxes', label: 'Disciplinary Action', options: [
        { value: 'verbal_warning', label: 'Verbal Warning' }, { value: 'written_warning', label: 'Written Warning' },
        { value: 'ejection', label: 'Ejection from Game' }, { value: 'suspension', label: 'Suspension Recommended' },
      ]},
      { id: 'follow_up_required', type: 'checkboxes', label: 'Follow-Up Required', options: [
        { value: 'medical_follow_up', label: 'Medical Follow-Up' }, { value: 'investigation', label: 'Further Investigation' },
        { value: 'parent_notification', label: 'Parent Notification' }, { value: 'league_notification', label: 'League Office Notification' },
      ]},
      { id: 'reporter_name', type: 'text', label: 'Report Filed By', placeholder: 'Your full name', required: true },
      { id: 'reporter_role', type: 'text', label: 'Your Role', placeholder: 'e.g., Head Coach', required: true },
    ],
  },
];

const DRAFT_KEY = 'incident_report_draft';

export function IncidentReportForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/incident-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Incident Report" subtitle="Document and report an incident" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Report" />;
}
