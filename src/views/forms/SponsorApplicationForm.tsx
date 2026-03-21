'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import type { FormSection } from '@/components/forms/FormBuilder';

const SECTIONS: FormSection[] = [
  {
    id: 'company', label: 'Company Information', icon: 'Building',
    fields: [
      { id: 'company_name', type: 'text', label: 'Company Name', placeholder: 'Enter company name', required: true },
      { id: 'industry', type: 'text', label: 'Industry', placeholder: 'e.g., Technology, Food & Beverage' },
      { id: 'website', type: 'text', label: 'Company Website', placeholder: 'https://company.com' },
      { id: 'logo', type: 'upload', label: 'Company Logo', accept: 'image/*', hint: 'PNG or SVG, transparent background preferred' },
    ],
  },
  {
    id: 'contact', label: 'Contact Person', icon: 'User',
    fields: [
      { id: 'contact_name', type: 'text', label: 'Contact Name', placeholder: 'Full name', required: true },
      { id: 'contact_title', type: 'text', label: 'Title/Position', placeholder: 'e.g., Marketing Director' },
      { id: 'contact_email', type: 'text', label: 'Email', placeholder: 'contact@company.com', required: true },
      { id: 'contact_phone', type: 'text', label: 'Phone', placeholder: '(416) 555-0123', required: true },
    ],
  },
  {
    id: 'sponsorship', label: 'Sponsorship Details', icon: 'Star',
    fields: [
      { id: 'tier_preference', type: 'cards', label: 'Sponsorship Tier', required: true, columns: 1, options: [
        { value: 'platinum', label: 'Platinum - $10,000+', description: 'Logo on jerseys, website, banners, social media, event naming rights' },
        { value: 'gold', label: 'Gold - $5,000-$9,999', description: 'Logo on website, banners, social media features' },
        { value: 'silver', label: 'Silver - $2,500-$4,999', description: 'Logo on website and event programs' },
        { value: 'bronze', label: 'Bronze - $1,000-$2,499', description: 'Logo on website and social media mention' },
        { value: 'community', label: 'Community - Under $1,000', description: 'Social media mention and newsletter feature' },
      ]},
      { id: 'budget_range', type: 'text', label: 'Budget Range', placeholder: 'e.g., $5,000-$7,500' },
      { id: 'sponsorship_goals', type: 'checkboxes', label: 'Sponsorship Goals', options: [
        { value: 'brand_awareness', label: 'Brand Awareness', description: 'Increase visibility in the community' },
        { value: 'community_engagement', label: 'Community Engagement', description: 'Connect with local families' },
        { value: 'employee_engagement', label: 'Employee Engagement', description: 'Volunteer and team building opportunities' },
        { value: 'lead_generation', label: 'Lead Generation', description: 'Reach potential customers' },
        { value: 'corporate_social_responsibility', label: 'CSR', description: 'Corporate social responsibility initiatives' },
      ]},
      { id: 'target_audience', type: 'pills', label: 'Target Audience', options: [
        { value: 'parents', label: 'Parents' }, { value: 'youth', label: 'Youth' },
        { value: 'families', label: 'Families' }, { value: 'coaches', label: 'Coaches' },
        { value: 'general_public', label: 'General Public' },
      ]},
    ],
  },
  {
    id: 'marketing', label: 'Marketing & Activation', icon: 'Megaphone',
    fields: [
      { id: 'activation_ideas', type: 'textarea', label: 'Activation Ideas', placeholder: 'Describe any specific activation ideas you have...', hint: 'e.g., product sampling, contest, halftime show' },
      { id: 'previous_sponsorships', type: 'textarea', label: 'Previous Sponsorships', placeholder: 'List any previous sports or community sponsorships' },
      { id: 'social_media_handles', type: 'text', label: 'Social Media Handles', placeholder: '@company on Instagram, Twitter, etc.' },
    ],
  },
  {
    id: 'terms', label: 'Terms & Agreement', icon: 'FileText',
    fields: [
      { id: 'terms_accepted', type: 'checkboxes', label: 'Sponsorship Terms', required: true, options: [
        { value: 'payment_terms', label: 'Payment Terms', description: 'I understand sponsorship payments are due within 30 days of agreement' },
        { value: 'logo_usage', label: 'Logo Usage Rights', description: 'I grant permission to use our company logo for league promotional materials' },
        { value: 'exclusivity', label: 'Non-Exclusivity', description: 'I understand this is a non-exclusive sponsorship arrangement' },
      ]},
    ],
  },
];

const DRAFT_KEY = 'sponsor_application_draft';

export function SponsorApplicationForm(): React.ReactElement {
  const router = useRouter();
  const initialData = useMemo((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
  }, []);
  const handleSave = useCallback((data: Record<string, unknown>): void => { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); }, []);
  const handleSubmit = useCallback(async (data: Record<string, unknown>): Promise<void> => {
    try { await fetch('/api/forms/sponsor-application', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); localStorage.removeItem(DRAFT_KEY); router.push('/forms'); } catch (e) { console.error('Failed to submit:', e); }
  }, [router]);

  return <FormBuilder title="Sponsor Application" subtitle="Partner with us to grow youth basketball in the 6" sections={SECTIONS} initialData={initialData} onSubmit={handleSubmit} onSave={handleSave} submitLabel="Submit Application" />;
}
