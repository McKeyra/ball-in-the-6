'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'business', label: 'Business Information', icon: 'Building',
    fields: [
      { id: 'business_name', type: 'text', label: 'Business Name', placeholder: 'Enter business name', required: true },
      { id: 'business_type', type: 'cards', label: 'Business Type', required: true, columns: 2, options: [
        { value: 'food', label: 'Food & Beverage', description: 'Prepared food or drinks' },
        { value: 'merchandise', label: 'Merchandise', description: 'Sports gear, apparel, accessories' },
        { value: 'services', label: 'Services', description: 'Photography, training, etc.' },
        { value: 'other', label: 'Other', description: 'Other type of vendor' },
      ]},
      { id: 'business_license', type: 'text', label: 'Business License Number', placeholder: 'Enter license number' },
      { id: 'health_permit', type: 'text', label: 'Health Permit Number', placeholder: 'Required for food vendors' },
      { id: 'years_in_business', type: 'select', label: 'Years in Business', options: [
        { value: 'new', label: 'New business' }, { value: '1-2', label: '1-2 years' },
        { value: '3-5', label: '3-5 years' }, { value: '5+', label: '5+ years' },
      ]},
    ],
  },
  {
    id: 'products', label: 'Products & Services', icon: 'Package',
    fields: [
      { id: 'product_description', type: 'textarea', label: 'Product/Service Description', placeholder: 'Describe what you offer...', required: true, rows: 4 },
      { id: 'menu_items', type: 'textarea', label: 'Menu/Product List', placeholder: 'List items and prices', rows: 4 },
      { id: 'price_range', type: 'text', label: 'Price Range', placeholder: 'e.g., $5-$15' },
      { id: 'dietary_options', type: 'pills', label: 'Dietary Options Available', options: [
        { value: 'vegetarian', label: 'Vegetarian' }, { value: 'vegan', label: 'Vegan' },
        { value: 'gluten_free', label: 'Gluten-Free' }, { value: 'nut_free', label: 'Nut-Free' },
        { value: 'halal', label: 'Halal' }, { value: 'kosher', label: 'Kosher' },
      ]},
      { id: 'product_photos', type: 'upload', label: 'Product Photos', accept: 'image/*', multiple: true },
    ],
  },
  {
    id: 'requirements', label: 'Setup Requirements', icon: 'Settings',
    fields: [
      { id: 'booth_size', type: 'select', label: 'Booth Size Needed', options: [
        { value: 'small', label: 'Small (6x6 ft)' }, { value: 'medium', label: 'Medium (10x10 ft)' },
        { value: 'large', label: 'Large (10x20 ft)' },
      ]},
      { id: 'power_requirements', type: 'checkboxes', label: 'Power Requirements', options: [
        { value: 'standard', label: 'Standard 120V Outlet' }, { value: 'high_voltage', label: 'High Voltage (240V)' },
        { value: 'generator', label: 'Own Generator' }, { value: 'none', label: 'No Power Needed' },
      ]},
      { id: 'water_required', type: 'cards', label: 'Water Access Required', columns: 2, options: [
        { value: 'yes', label: 'Yes', description: 'Need water access' },
        { value: 'no', label: 'No', description: 'No water needed' },
      ]},
      { id: 'setup_time', type: 'text', label: 'Setup Time Needed', placeholder: 'e.g., 1 hour' },
      { id: 'teardown_time', type: 'text', label: 'Teardown Time Needed', placeholder: 'e.g., 30 minutes' },
      { id: 'special_requirements', type: 'textarea', label: 'Special Requirements', placeholder: 'Any other setup needs...' },
    ],
  },
  {
    id: 'insurance', label: 'Insurance & Certificates', icon: 'Shield',
    fields: [
      { id: 'liability_insurance', type: 'cards', label: 'Liability Insurance', required: true, columns: 2, options: [
        { value: 'current', label: 'Currently Insured', description: 'Have valid liability insurance' },
        { value: 'will_obtain', label: 'Will Obtain', description: 'Will get insurance before event' },
      ]},
      { id: 'insurance_provider', type: 'text', label: 'Insurance Provider', placeholder: 'Provider name' },
      { id: 'policy_number', type: 'text', label: 'Policy Number', placeholder: 'Enter policy number' },
      { id: 'insurance_expiry', type: 'text', label: 'Insurance Expiry Date', placeholder: 'YYYY-MM-DD' },
      { id: 'insurance_proof', type: 'upload', label: 'Proof of Insurance', accept: '.pdf,image/*', hint: 'Upload certificate of insurance' },
      { id: 'food_safety_cert', type: 'upload', label: 'Food Safety Certificate', accept: '.pdf,image/*', hint: 'Required for food vendors' },
    ],
  },
  {
    id: 'contact', label: 'Contact Information', icon: 'Phone',
    fields: [
      { id: 'owner_name', type: 'text', label: 'Owner/Manager Name', placeholder: 'Full name', required: true },
      { id: 'owner_email', type: 'text', label: 'Email', placeholder: 'email@business.com', required: true },
      { id: 'owner_phone', type: 'text', label: 'Phone', placeholder: '(416) 555-0123', required: true },
      { id: 'website', type: 'text', label: 'Business Website', placeholder: 'https://business.com' },
      { id: 'previous_events', type: 'textarea', label: 'Previous Event Experience', placeholder: 'List previous events you have vended at' },
    ],
  },
];

const DRAFT_KEY = 'vendor_application_draft';

export function VendorApplicationForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/vendor-application', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Vendor Application" subtitle="Apply to be a vendor at our events" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Application" />;
}
