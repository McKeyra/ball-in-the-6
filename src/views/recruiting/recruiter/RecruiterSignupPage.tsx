'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  User,
  Building2,
  Briefcase,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Upload,
  Clock,
} from 'lucide-react';

// TODO: Replace with actual API route

interface StepConfig {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  { id: 1, label: 'Account', icon: User },
  { id: 2, label: 'Organization', icon: Building2 },
  { id: 3, label: 'Profile', icon: Briefcase },
  { id: 4, label: 'Verification', icon: ShieldCheck },
];

const ORG_TYPES = [
  'University / College', 'High School', 'Club / Academy',
  'Independent Scout', 'Agency', 'Other',
] as const;

const LEAGUES = [
  'NCAA Division I', 'NCAA Division II', 'NCAA Division III',
  'NAIA', 'USports', 'CCAA', 'OSBA', 'NPA', 'AAU', 'Other',
] as const;

const SPORTS = [
  'Basketball', 'Soccer', 'Football', 'Baseball', 'Hockey',
  'Track & Field', 'Swimming', 'Volleyball', 'Tennis',
] as const;

interface RecruiterFormState {
  email: string;
  account_type: string;
  password: string;
  org_name: string;
  org_type: string;
  league: string;
  city: string;
  title: string;
  linkedin: string;
  sports: string[];
  bio: string;
  verification_doc: File | null;
}

const INITIAL_FORM: RecruiterFormState = {
  email: '', account_type: 'recruiter', password: '',
  org_name: '', org_type: '', league: '', city: '',
  title: '', linkedin: '', sports: [], bio: '',
  verification_doc: null,
};

export function RecruiterSignupPage(): React.ReactElement {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RecruiterFormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: Replace with fetch('/api/recruiting/recruiter/signup', { method: 'POST', body: JSON.stringify(data) })
      return data;
    },
    onSuccess: () => setSubmitted(true),
  });

  const updateField = <K extends keyof RecruiterFormState>(field: K, value: RecruiterFormState[K]): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSport = (sport: string): void => {
    setForm((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter((s) => s !== sport)
        : [...prev.sports, sport],
    }));
  };

  const handleSubmit = (): void => {
    submitMutation.mutate({
      email: form.email,
      account_type: form.account_type,
      organization_name: form.org_name,
      organization_type: form.org_type,
      league: form.league,
      city: form.city,
      title: form.title,
      linkedin_url: form.linkedin,
      sports: form.sports,
      bio: form.bio,
      status: 'pending_verification',
    });
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return form.email.trim().length > 0 && form.password.length >= 8;
      case 2: return form.org_name.trim().length > 0 && form.org_type.length > 0;
      case 3: return form.title.trim().length > 0 && form.sports.length > 0;
      default: return true;
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Verification Pending</h1>
        <p className="text-slate-400">
          Your recruiter account is under review. You will receive an email within 24-48 hours
          once your credentials have been verified.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recruiter Signup</h1>
        <p className="text-slate-400 text-sm mt-1">Create your recruiter account in 4 simple steps.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isComplete = s.id < step;
          return (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive && 'bg-red-600 text-white',
                isComplete && 'bg-slate-800 text-green-400 cursor-pointer',
                !isActive && !isComplete && 'bg-slate-900 text-slate-500 cursor-default'
              )}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Step 1: Account */}
      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Account Details</h2></div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Email</label>
              <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="recruiter@university.edu" className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Account Type</label>
              <select value={form.account_type} onChange={(e) => updateField('account_type', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm">
                <option value="recruiter">Recruiter</option>
                <option value="scout">Scout</option>
                <option value="coach">Coach</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Password</label>
              <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Minimum 8 characters" className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none" />
              <p className="text-xs text-slate-500">{form.password.length}/8 characters minimum</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Organization */}
      {step === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Organization</h2></div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Organization Name</label>
              <input value={form.org_name} onChange={(e) => updateField('org_name', e.target.value)} placeholder="e.g. University of Toronto" className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Organization Type</label>
              <select value={form.org_type} onChange={(e) => updateField('org_type', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm">
                <option value="">Select type</option>
                {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">League / Conference</label>
              <select value={form.league} onChange={(e) => updateField('league', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm">
                <option value="">Select league</option>
                {LEAGUES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">City</label>
              <input value={form.city} onChange={(e) => updateField('city', e.target.value)} placeholder="Toronto, ON" className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Profile */}
      {step === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Your Profile</h2></div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Title / Role</label>
              <input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. Head Recruiter, Assistant Coach" className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">LinkedIn URL (optional)</label>
              <input value={form.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/yourname" className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none" />
            </div>
            <div className="space-y-3">
              <label className="text-sm text-slate-300">Sports You Recruit For</label>
              <div className="grid grid-cols-3 gap-2">
                {SPORTS.map((sport) => (
                  <button key={sport} onClick={() => toggleSport(sport)} className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors',
                    form.sports.includes(sport) ? 'bg-red-600/20 border-red-600 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  )}>
                    <input type="checkbox" checked={form.sports.includes(sport)} readOnly className="pointer-events-none rounded" />
                    {sport}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Bio</label>
              <textarea value={form.bio} onChange={(e) => updateField('bio', e.target.value)} placeholder="Brief description of your recruiting experience..." rows={4} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none resize-none" />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Verification */}
      {step === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Verification</h2></div>
          <div className="p-4 space-y-4">
            <div className="p-4 rounded-lg bg-blue-600/10 border border-blue-600/30">
              <p className="text-sm text-blue-400 font-medium mb-1">Verification Required</p>
              <p className="text-xs text-slate-400">Upload a document confirming your affiliation. Verification typically takes 24-48 hours.</p>
            </div>
            <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/30 cursor-pointer hover:border-slate-600 transition-colors" onClick={() => document.getElementById('verify-doc')?.click()}>
              {form.verification_doc ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
                  <p className="text-sm text-green-400">{form.verification_doc.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Click to change</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <p className="text-sm text-slate-300">Upload Verification Document</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, JPG, or PNG (max 10MB)</p>
                </>
              )}
              <input id="verify-doc" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => updateField('verification_doc', e.target.files?.[0] || null)} />
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Summary</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-slate-400">Email:</span><span className="text-white">{form.email}</span>
                <span className="text-slate-400">Organization:</span><span className="text-white">{form.org_name}</span>
                <span className="text-slate-400">Type:</span><span className="text-white">{form.org_type}</span>
                <span className="text-slate-400">Title:</span><span className="text-white">{form.title}</span>
                <span className="text-slate-400">Sports:</span><span className="text-white">{form.sports.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button className="flex items-center border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm disabled:opacity-50" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>
        {step < 4 ? (
          <button className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors" onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors" onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? 'Submitting...' : 'Submit for Verification'}
          </button>
        )}
      </div>
    </div>
  );
}
