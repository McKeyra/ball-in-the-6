'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'facility', label: 'Facility Information', icon: 'Building',
    fields: [
      { id: 'facility_name', type: 'text', label: 'Facility Name', placeholder: 'Enter facility name', required: true },
      { id: 'facility_address', type: 'text', label: 'Street Address', placeholder: 'Full street address', required: true },
      { id: 'facility_city', type: 'text', label: 'City', placeholder: 'Toronto', required: true },
      { id: 'facility_postal', type: 'text', label: 'Postal Code', placeholder: 'M5V 1A1', required: true },
      { id: 'facility_type', type: 'cards', label: 'Facility Type', required: true, columns: 2, options: [
        { value: 'gymnasium', label: 'Gymnasium', description: 'Indoor basketball gym' },
        { value: 'recreation_center', label: 'Recreation Center', description: 'Multi-purpose rec center' },
        { value: 'community_center', label: 'Community Center', description: 'Community facility' },
        { value: 'school', label: 'School Gym', description: 'School gymnasium' },
        { value: 'sports_complex', label: 'Sports Complex', description: 'Large multi-court facility' },
        { value: 'outdoor', label: 'Outdoor Court', description: 'Outdoor basketball court' },
      ]},
      { id: 'photos', type: 'upload', label: 'Facility Photos', accept: 'image/*', multiple: true, hint: 'Upload photos of courts and amenities' },
    ],
  },
  {
    id: 'specs', label: 'Specifications', icon: 'Ruler',
    fields: [
      { id: 'court_count', type: 'select', label: 'Number of Courts', required: true, options: [
        { value: '1', label: '1 court' }, { value: '2', label: '2 courts' }, { value: '3', label: '3 courts' },
        { value: '4', label: '4 courts' }, { value: '5+', label: '5+ courts' },
      ]},
      { id: 'court_dimensions', type: 'text', label: 'Court Dimensions', placeholder: 'e.g., 84x50 feet (full size)' },
      { id: 'floor_type', type: 'select', label: 'Floor Type', options: [
        { value: 'hardwood', label: 'Hardwood' }, { value: 'rubber', label: 'Rubber' },
        { value: 'vinyl', label: 'Vinyl/Sport Tile' }, { value: 'concrete', label: 'Concrete' },
      ]},
      { id: 'ceiling_height', type: 'text', label: 'Ceiling Height', placeholder: 'e.g., 25 feet' },
      { id: 'amenities', type: 'checkboxes', label: 'Amenities', options: [
        { value: 'scoreboard', label: 'Electronic Scoreboard' }, { value: 'shot_clock', label: 'Shot Clocks' },
        { value: 'bleachers', label: 'Bleachers/Seating' }, { value: 'change_rooms', label: 'Change Rooms' },
        { value: 'showers', label: 'Showers' }, { value: 'parking', label: 'Parking' },
        { value: 'accessible', label: 'Wheelchair Accessible' }, { value: 'wifi', label: 'Wi-Fi' },
        { value: 'concession', label: 'Concession Area' }, { value: 'storage', label: 'Equipment Storage' },
        { value: 'sound_system', label: 'Sound System' }, { value: 'ac', label: 'Air Conditioning' },
      ]},
      { id: 'seating_capacity', type: 'text', label: 'Seating Capacity', placeholder: 'e.g., 200' },
    ],
  },
  {
    id: 'availability', label: 'Availability', icon: 'Calendar',
    fields: [
      { id: 'available_days', type: 'pills', label: 'Available Days', required: true, options: [
        { value: 'monday', label: 'Mon' }, { value: 'tuesday', label: 'Tue' }, { value: 'wednesday', label: 'Wed' },
        { value: 'thursday', label: 'Thu' }, { value: 'friday', label: 'Fri' }, { value: 'saturday', label: 'Sat' },
        { value: 'sunday', label: 'Sun' },
      ]},
      { id: 'weekday_hours', type: 'text', label: 'Weekday Available Hours', placeholder: 'e.g., 6pm - 10pm' },
      { id: 'weekend_hours', type: 'text', label: 'Weekend Available Hours', placeholder: 'e.g., 8am - 6pm' },
      { id: 'blackout_dates', type: 'textarea', label: 'Blackout Dates', placeholder: 'List any dates the facility is unavailable' },
      { id: 'minimum_booking', type: 'select', label: 'Minimum Booking Duration', options: [
        { value: '1hr', label: '1 hour' }, { value: '2hr', label: '2 hours' }, { value: '3hr', label: '3 hours' },
        { value: 'half_day', label: 'Half day' }, { value: 'full_day', label: 'Full day' },
      ]},
    ],
  },
  {
    id: 'rates', label: 'Rates & Pricing', icon: 'DollarSign',
    fields: [
      { id: 'hourly_rate', type: 'text', label: 'Hourly Rate', placeholder: 'e.g., $75/hour' },
      { id: 'peak_rate', type: 'text', label: 'Peak Rate (evenings/weekends)', placeholder: 'e.g., $95/hour' },
      { id: 'off_peak_rate', type: 'text', label: 'Off-Peak Rate', placeholder: 'e.g., $55/hour' },
      { id: 'package_deals', type: 'textarea', label: 'Package Deals', placeholder: 'Describe any bulk or season booking discounts' },
      { id: 'payment_terms', type: 'checkboxes', label: 'Payment Terms Accepted', options: [
        { value: 'monthly', label: 'Monthly Invoicing' }, { value: 'per_booking', label: 'Per Booking' },
        { value: 'seasonal', label: 'Seasonal Contract' }, { value: 'deposit', label: 'Deposit Required' },
      ]},
      { id: 'deposit_required', type: 'text', label: 'Deposit Amount', placeholder: 'e.g., 25% or $500', hint: 'If deposit is required' },
    ],
  },
  {
    id: 'contact', label: 'Contact Information', icon: 'Phone',
    fields: [
      { id: 'manager_name', type: 'text', label: 'Facility Manager Name', placeholder: 'Full name', required: true },
      { id: 'manager_email', type: 'text', label: 'Manager Email', placeholder: 'manager@facility.com', required: true },
      { id: 'manager_phone', type: 'text', label: 'Manager Phone', placeholder: '(416) 555-0123', required: true },
      { id: 'booking_email', type: 'text', label: 'Booking Email', placeholder: 'bookings@facility.com', hint: 'For booking inquiries' },
      { id: 'emergency_contact', type: 'text', label: 'Emergency Contact', placeholder: 'Name and phone for emergencies' },
    ],
  },
];

const DRAFT_KEY = 'facility_partner_draft';

export function FacilityPartnerForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/facility-partner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Facility Partnership" subtitle="Register your facility as a league venue partner" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Application" />;
}
