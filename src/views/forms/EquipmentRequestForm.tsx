'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'team', label: 'Team Information', icon: 'Users',
    fields: [
      { id: 'team_name', type: 'text', label: 'Team Name', placeholder: 'Enter team name', required: true },
      { id: 'contact_name', type: 'text', label: 'Contact Name', placeholder: 'Full name', required: true },
      { id: 'contact_email', type: 'text', label: 'Contact Email', placeholder: 'email@example.com', required: true },
      { id: 'contact_phone', type: 'text', label: 'Contact Phone', placeholder: '(416) 555-0123', required: true },
    ],
  },
  {
    id: 'items', label: 'Equipment Items', icon: 'Package',
    fields: [
      { id: 'item_types', type: 'checkboxes', label: 'Items Needed', required: true, options: [
        { value: 'jerseys', label: 'Jerseys' }, { value: 'shorts', label: 'Shorts' },
        { value: 'basketballs', label: 'Basketballs' }, { value: 'practice_jerseys', label: 'Practice Jerseys' },
        { value: 'warm_ups', label: 'Warm-Up Suits' }, { value: 'bags', label: 'Equipment Bags' },
        { value: 'water_bottles', label: 'Water Bottles' }, { value: 'first_aid', label: 'First Aid Kit' },
      ]},
      { id: 'quantities', type: 'textarea', label: 'Quantities Needed', placeholder: 'List quantities for each item selected above', required: true },
      { id: 'sizes', type: 'pills', label: 'Sizes Needed', options: [
        { value: 'ys', label: 'YS' }, { value: 'ym', label: 'YM' }, { value: 'yl', label: 'YL' },
        { value: 'yxl', label: 'YXL' }, { value: 'as', label: 'AS' }, { value: 'am', label: 'AM' },
        { value: 'al', label: 'AL' }, { value: 'axl', label: 'AXL' }, { value: 'axxl', label: 'AXXL' },
      ]},
    ],
  },
  {
    id: 'customization', label: 'Customization', icon: 'Paintbrush',
    fields: [
      { id: 'include_names', type: 'cards', label: 'Include Player Names?', columns: 2, options: [
        { value: 'yes', label: 'Yes', description: 'Add names to jerseys' },
        { value: 'no', label: 'No', description: 'No names needed' },
      ]},
      { id: 'player_names', type: 'textarea', label: 'Player Names & Numbers', placeholder: 'List player names and jersey numbers', hint: 'One per line: Name - Number' },
      { id: 'logo_placement', type: 'checkboxes', label: 'Logo Placement', options: [
        { value: 'front_chest', label: 'Front Chest' }, { value: 'back', label: 'Back' },
        { value: 'sleeve', label: 'Sleeve' }, { value: 'shorts', label: 'Shorts' },
      ]},
      { id: 'logo_file', type: 'upload', label: 'Team Logo File', accept: 'image/*,.svg,.ai', hint: 'Vector format preferred (SVG, AI)' },
      { id: 'custom_notes', type: 'textarea', label: 'Customization Notes', placeholder: 'Any special instructions...' },
    ],
  },
  {
    id: 'delivery', label: 'Delivery', icon: 'Truck',
    fields: [
      { id: 'delivery_type', type: 'cards', label: 'Delivery Method', columns: 2, options: [
        { value: 'pickup', label: 'Pickup', description: 'Pick up from league office' },
        { value: 'delivery', label: 'Delivery', description: 'Ship to address' },
      ]},
      { id: 'delivery_address', type: 'text', label: 'Delivery Address', placeholder: 'Full address (if delivery)' },
      { id: 'delivery_deadline', type: 'text', label: 'Needed By Date', placeholder: 'YYYY-MM-DD', required: true },
    ],
  },
  {
    id: 'payment', label: 'Payment', icon: 'CreditCard',
    fields: [
      { id: 'payment_method', type: 'cards', label: 'Payment Method', columns: 2, options: [
        { value: 'credit_card', label: 'Credit Card' }, { value: 'etransfer', label: 'E-Transfer' },
        { value: 'cheque', label: 'Cheque' }, { value: 'invoice', label: 'Invoice Team' },
      ]},
      { id: 'po_number', type: 'text', label: 'PO Number', placeholder: 'If applicable' },
      { id: 'budget_code', type: 'text', label: 'Budget Code', placeholder: 'If applicable' },
      { id: 'billing_name', type: 'text', label: 'Billing Contact', placeholder: 'Full name', required: true },
      { id: 'approver_name', type: 'text', label: 'Approver Name', placeholder: 'Person authorizing this order', required: true },
    ],
  },
];

const DRAFT_KEY = 'equipment_request_draft';

export function EquipmentRequestForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/equipment-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Equipment Request" subtitle="Request equipment for your team" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Request" />;
}
