'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const BRAND_COLORS = [
  { value: '#c8ff00', label: 'Lime' }, { value: '#3b82f6', label: 'Blue' }, { value: '#ef4444', label: 'Red' },
  { value: '#22c55e', label: 'Green' }, { value: '#8b5cf6', label: 'Purple' }, { value: '#f97316', label: 'Orange' },
  { value: '#06b6d4', label: 'Cyan' }, { value: '#ec4899', label: 'Pink' }, { value: '#1e3a5f', label: 'Navy' },
  { value: '#0f172a', label: 'Slate' }, { value: '#7c3aed', label: 'Violet' }, { value: '#14b8a6', label: 'Teal' },
];

const SECTIONS: FormSection[] = [
  {
    id: 'organization', label: 'Organization Details', icon: 'Building2', description: 'Basic information about your organization',
    fields: [
      { id: 'org_name', type: 'text', label: 'Organization Name', placeholder: 'Toronto Youth Basketball Association', required: true },
      { id: 'tagline', type: 'text', label: 'Tagline', placeholder: 'Building Champions On and Off the Court', hint: "A short phrase that describes your organization's mission" },
      { id: 'logo', type: 'upload', label: 'Organization Logo', accept: 'image/*', hint: 'PNG or SVG with transparent background, minimum 400x400 pixels' },
      { id: 'website', type: 'text', label: 'Website URL', placeholder: 'https://tyba.org' },
      { id: 'org_type', type: 'cards', label: 'Organization Type', required: true, columns: 2, options: [
        { value: 'nonprofit', label: 'Non-Profit', description: '501(c)(3) or equivalent charity' },
        { value: 'forprofit', label: 'For-Profit', description: 'Business entity' },
        { value: 'school', label: 'School/Education', description: 'School district or educational institution' },
        { value: 'recreation', label: 'Parks & Recreation', description: 'Municipal recreation department' },
      ]},
    ],
  },
  {
    id: 'branding', label: 'Brand Colors', icon: 'Palette', description: "Define your organization's visual identity",
    fields: [
      { id: 'primary_color', type: 'cards', label: 'Primary Brand Color', required: true, columns: 4, options: BRAND_COLORS.map(c => ({ value: c.value, label: c.label, description: '' })) },
      { id: 'secondary_color', type: 'cards', label: 'Secondary Brand Color', required: true, columns: 4, options: BRAND_COLORS.map(c => ({ value: c.value, label: c.label, description: '' })) },
      { id: 'font_preference', type: 'cards', label: 'Font Style Preference', columns: 3, options: [
        { value: 'modern', label: 'Modern', description: 'Clean sans-serif fonts' },
        { value: 'classic', label: 'Classic', description: 'Traditional serif fonts' },
        { value: 'bold', label: 'Bold', description: 'Strong, impactful fonts' },
      ]},
    ],
  },
  {
    id: 'contact', label: 'Contact Information', icon: 'Phone', description: 'How people can reach your organization',
    fields: [
      { id: 'main_email', type: 'text', label: 'Main Email Address', placeholder: 'info@tyba.org', required: true, hint: 'Primary contact email for inquiries' },
      { id: 'support_email', type: 'text', label: 'Support Email', placeholder: 'support@tyba.org', hint: 'For technical support and help requests' },
      { id: 'phone', type: 'text', label: 'Phone Number', placeholder: '(416) 555-0100', required: true },
      { id: 'fax', type: 'text', label: 'Fax Number (Optional)', placeholder: '(416) 555-0101' },
      { id: 'address_line1', type: 'text', label: 'Street Address', placeholder: '123 Sports Complex Drive', required: true },
      { id: 'address_line2', type: 'text', label: 'Suite/Unit (Optional)', placeholder: 'Suite 200' },
      { id: 'city', type: 'text', label: 'City', placeholder: 'Toronto', required: true },
      { id: 'province_state', type: 'text', label: 'Province/State', placeholder: 'Ontario', required: true },
      { id: 'postal_code', type: 'text', label: 'Postal/ZIP Code', placeholder: 'M5V 1A1', required: true },
      { id: 'country', type: 'select', label: 'Country', required: true, options: [
        { value: 'CA', label: 'Canada' }, { value: 'US', label: 'United States' },
        { value: 'UK', label: 'United Kingdom' }, { value: 'AU', label: 'Australia' },
      ]},
    ],
  },
  {
    id: 'integrations', label: 'Integrations', icon: 'Plug', description: 'Connect third-party services',
    fields: [
      { id: 'payment_provider', type: 'cards', label: 'Payment Provider', columns: 2, options: [
        { value: 'stripe', label: 'Stripe', description: 'Credit cards, Apple Pay, Google Pay' },
        { value: 'square', label: 'Square', description: 'In-person and online payments' },
        { value: 'paypal', label: 'PayPal', description: 'PayPal and Venmo' },
        { value: 'none', label: 'No Online Payments', description: 'Handle payments offline' },
      ]},
      { id: 'email_service', type: 'cards', label: 'Email Service', columns: 2, options: [
        { value: 'sendgrid', label: 'SendGrid', description: 'Transactional and marketing emails' },
        { value: 'mailchimp', label: 'Mailchimp', description: 'Email marketing and newsletters' },
        { value: 'ses', label: 'Amazon SES', description: 'High-volume email sending' },
        { value: 'builtin', label: 'Built-in Email', description: 'Use platform default email' },
      ]},
      { id: 'calendar_integration', type: 'checkboxes', label: 'Calendar Integrations', options: [
        { value: 'google', label: 'Google Calendar', description: 'Sync events with Google Calendar' },
        { value: 'outlook', label: 'Outlook Calendar', description: 'Sync with Microsoft Outlook' },
        { value: 'apple', label: 'Apple Calendar', description: 'iCal feed support' },
      ]},
    ],
  },
  {
    id: 'legal', label: 'Legal & Compliance', icon: 'Scale', description: 'Legal documents and policies',
    fields: [
      { id: 'terms_url', type: 'text', label: 'Terms of Service URL', placeholder: 'https://tyba.org/terms' },
      { id: 'privacy_url', type: 'text', label: 'Privacy Policy URL', placeholder: 'https://tyba.org/privacy' },
      { id: 'refund_policy_url', type: 'text', label: 'Refund Policy URL', placeholder: 'https://tyba.org/refunds' },
      { id: 'waiver_url', type: 'text', label: 'Liability Waiver URL', placeholder: 'https://tyba.org/waiver' },
      { id: 'compliance_options', type: 'checkboxes', label: 'Compliance Settings', options: [
        { value: 'gdpr', label: 'GDPR Compliance', description: 'European data protection regulations' },
        { value: 'ccpa', label: 'CCPA Compliance', description: 'California consumer privacy' },
        { value: 'coppa', label: 'COPPA Compliance', description: "Children's online privacy protection" },
        { value: 'pipeda', label: 'PIPEDA Compliance', description: 'Canadian privacy legislation' },
      ]},
      { id: 'tax_id', type: 'text', label: 'Tax ID / EIN', placeholder: '12-3456789', hint: "Your organization's tax identification number" },
    ],
  },
];

const DRAFT_KEY = 'organization_setup_draft';

export function OrganizationSetupForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/organization-setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Organization Setup" subtitle="Configure your organization settings, branding, and integrations" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Save Organization Settings" />;
}
