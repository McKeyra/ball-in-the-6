'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'event', label: 'Event Details', icon: 'Calendar',
    fields: [
      { id: 'event_type', type: 'cards', label: 'Event Type', required: true, columns: 2, options: [
        { value: 'regular_game', label: 'Regular Game', description: 'Scheduled league game' },
        { value: 'practice', label: 'Practice', description: 'Team practice session' },
        { value: 'tournament', label: 'Tournament', description: 'Multi-game tournament' },
        { value: 'tryout', label: 'Tryout', description: 'Player evaluations' },
        { value: 'camp', label: 'Camp/Clinic', description: 'Training camp or clinic' },
        { value: 'special_event', label: 'Special Event', description: 'Awards, fundraiser, etc.' },
      ]},
      { id: 'event_name', type: 'text', label: 'Event Name', placeholder: 'e.g., U14 Championship Game', required: true },
      { id: 'event_date', type: 'text', label: 'Event Date', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'start_time', type: 'text', label: 'Start Time', placeholder: 'HH:MM', required: true },
      { id: 'end_time', type: 'text', label: 'End Time', placeholder: 'HH:MM', required: true },
      { id: 'recurring', type: 'cards', label: 'Recurring Event?', columns: 2, options: [
        { value: 'yes', label: 'Yes', description: 'Repeating event' },
        { value: 'no', label: 'No', description: 'One-time event' },
      ]},
      { id: 'recurring_end', type: 'text', label: 'Recurring Until', placeholder: 'YYYY-MM-DD', hint: 'If recurring' },
    ],
  },
  {
    id: 'facility', label: 'Facility Preferences', icon: 'Building',
    fields: [
      { id: 'venue', type: 'text', label: 'Preferred Venue', placeholder: 'Venue name', required: true },
      { id: 'court_preference', type: 'cards', label: 'Court Preference', columns: 2, options: [
        { value: 'full', label: 'Full Court', description: 'Need full basketball court' },
        { value: 'half', label: 'Half Court', description: 'Half court is sufficient' },
        { value: 'multiple', label: 'Multiple Courts', description: 'Need more than one court' },
        { value: 'no_preference', label: 'No Preference' },
      ]},
      { id: 'specific_court', type: 'text', label: 'Specific Court', placeholder: 'e.g., Court A, Main Gym' },
      { id: 'backup_venue', type: 'text', label: 'Backup Venue', placeholder: 'Alternative if preferred is unavailable' },
    ],
  },
  {
    id: 'requirements', label: 'Requirements', icon: 'Settings',
    fields: [
      { id: 'equipment_needed', type: 'checkboxes', label: 'Equipment Needed', options: [
        { value: 'scoreboard', label: 'Scoreboard' }, { value: 'shot_clocks', label: 'Shot Clocks' },
        { value: 'basketballs', label: 'Game Basketballs' }, { value: 'score_table', label: 'Score Table & Chairs' },
        { value: 'cones', label: 'Cones/Markers' }, { value: 'first_aid', label: 'First Aid Kit' },
        { value: 'sound_system', label: 'Sound System/PA' }, { value: 'projector', label: 'Projector/Screen' },
      ]},
      { id: 'setup_time', type: 'text', label: 'Setup Time Needed', placeholder: 'e.g., 30 minutes before' },
      { id: 'cleanup_time', type: 'text', label: 'Cleanup Time Needed', placeholder: 'e.g., 15 minutes after' },
      { id: 'special_requests', type: 'textarea', label: 'Special Requests', placeholder: 'Any additional setup requirements...' },
    ],
  },
  {
    id: 'attendees', label: 'Attendees', icon: 'Users',
    fields: [
      { id: 'expected_attendance', type: 'text', label: 'Expected Attendance', placeholder: 'Total number of people expected' },
      { id: 'teams_involved', type: 'text', label: 'Teams Involved', placeholder: 'List team names' },
      { id: 'spectators', type: 'cards', label: 'Spectators Expected?', columns: 2, options: [
        { value: 'yes_many', label: 'Yes, Many', description: '50+ spectators' },
        { value: 'yes_few', label: 'Yes, Few', description: 'Under 50' },
        { value: 'no', label: 'No Spectators' },
      ]},
      { id: 'organizer_name', type: 'text', label: 'Organizer Name', placeholder: 'Your full name', required: true },
      { id: 'organizer_email', type: 'text', label: 'Organizer Email', placeholder: 'email@example.com', required: true },
      { id: 'organizer_phone', type: 'text', label: 'Organizer Phone', placeholder: '(416) 555-0123', required: true },
    ],
  },
  {
    id: 'confirmation', label: 'Confirmation', icon: 'CheckCircle',
    fields: [
      { id: 'terms', type: 'checkboxes', label: 'Terms & Conditions', required: true, options: [
        { value: 'facility_rules', label: 'Facility Rules', description: 'I agree to follow all facility rules and guidelines' },
        { value: 'cleanup', label: 'Cleanup Responsibility', description: 'I agree to leave the facility in the same condition' },
        { value: 'cancellation', label: 'Cancellation Policy', description: 'I understand the 48-hour cancellation policy' },
        { value: 'liability', label: 'Liability', description: 'I accept liability for any damages during our booking' },
      ]},
      { id: 'payment_acknowledge', type: 'cards', label: 'Payment Acknowledgment', columns: 2, options: [
        { value: 'will_pay', label: 'Will Pay', description: 'I understand payment is due upon confirmation' },
        { value: 'pre_paid', label: 'Pre-Paid', description: 'Payment has been arranged' },
      ]},
    ],
  },
];

const DRAFT_KEY = 'facility_booking_draft';

export function FacilityBookingForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/facility-booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Facility Booking" subtitle="Book a facility for your event" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Booking" />;
}
