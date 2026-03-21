'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  User,
  Dumbbell,
  DollarSign,
  CalendarDays,
  MapPin,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  X,
} from 'lucide-react';

// TODO: Replace with actual API route

interface StepConfig {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  { id: 1, label: 'Profile', icon: User },
  { id: 2, label: 'Sports', icon: Dumbbell },
  { id: 3, label: 'Rates', icon: DollarSign },
  { id: 4, label: 'Availability', icon: CalendarDays },
  { id: 5, label: 'Location', icon: MapPin },
  { id: 6, label: 'Documents', icon: FileText },
  { id: 7, label: 'Review', icon: CheckCircle },
];

const SPORTS = [
  'Basketball', 'Soccer', 'Football', 'Baseball', 'Hockey',
  'Track & Field', 'Swimming', 'Volleyball', 'Tennis',
] as const;

const SPECIALIZATIONS = [
  'Shooting', 'Ball Handling', 'Strength & Conditioning', 'Speed Training',
  'Agility', 'Positional Training', 'Game IQ', 'Film Study',
  'Recovery & Mobility', 'Mental Performance', 'Nutrition Coaching',
] as const;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const TIME_SLOTS = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
] as const;

interface LocationType {
  value: string;
  label: string;
  desc: string;
}

const LOCATION_TYPES: LocationType[] = [
  { value: 'facility', label: 'My Facility', desc: 'Athletes come to your location' },
  { value: 'client', label: 'Client Location', desc: 'You travel to the athlete' },
  { value: 'virtual', label: 'Virtual', desc: 'Online training sessions' },
  { value: 'public', label: 'Public Space', desc: 'Parks, outdoor courts, etc.' },
];

interface TrainerFormState {
  name: string;
  bio: string;
  photo: File | null;
  photoPreview: string;
  sports: string[];
  specializations: string[];
  hourly_rate: string;
  group_rate: string;
  package_5: string;
  package_10: string;
  availability: Record<string, string[]>;
  location_types: string[];
  service_radius: string;
  facility_address: string;
  police_check: File | null;
  first_aid: File | null;
  insurance: File | null;
}

const INITIAL_FORM: TrainerFormState = {
  name: '',
  bio: '',
  photo: null,
  photoPreview: '',
  sports: [],
  specializations: [],
  hourly_rate: '',
  group_rate: '',
  package_5: '',
  package_10: '',
  availability: {},
  location_types: [],
  service_radius: '10',
  facility_address: '',
  police_check: null,
  first_aid: null,
  insurance: null,
};

interface DocConfig {
  key: 'police_check' | 'first_aid' | 'insurance';
  label: string;
  required: boolean;
}

interface ReviewSectionProps {
  title: string;
  children: React.ReactNode;
}

function ReviewSection({ title, children }: ReviewSectionProps): React.ReactElement {
  return (
    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}

interface DocStatusProps {
  label: string;
  file: File | null;
}

function DocStatus({ label, file }: DocStatusProps): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-2 h-2 rounded-full', file ? 'bg-green-500' : 'bg-slate-600')} />
      <span className="text-slate-300">{label}:</span>
      <span className={file ? 'text-green-400' : 'text-slate-500'}>
        {file ? file.name : 'Not uploaded'}
      </span>
    </div>
  );
}

export function TrainerSignupPage(): React.ReactElement {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<TrainerFormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: Replace with fetch('/api/training-marketplace/trainer/signup', { method: 'POST', body: JSON.stringify(data) })
      return data;
    },
    onSuccess: () => setSubmitted(true),
  });

  const updateField = <K extends keyof TrainerFormState>(field: K, value: TrainerFormState[K]): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'sports' | 'specializations' | 'location_types', item: string): void => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const toggleAvailability = (day: string, time: string): void => {
    setForm((prev) => {
      const daySlots = prev.availability[day] ?? [];
      const updated = daySlots.includes(time)
        ? daySlots.filter((t) => t !== time)
        : [...daySlots, time];
      return {
        ...prev,
        availability: { ...prev.availability, [day]: updated },
      };
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateField('photo', file);
    const reader = new FileReader();
    reader.onload = (ev) => updateField('photoPreview', (ev.target?.result as string) ?? '');
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (field: 'police_check' | 'first_aid' | 'insurance', e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) updateField(field, file);
  };

  const handleSubmit = (): void => {
    const payload = {
      name: form.name,
      bio: form.bio,
      sports: form.sports,
      specializations: form.specializations,
      hourly_rate: parseFloat(form.hourly_rate) || 0,
      group_rate: parseFloat(form.group_rate) || 0,
      package_5_rate: parseFloat(form.package_5) || 0,
      package_10_rate: parseFloat(form.package_10) || 0,
      availability: form.availability,
      location_types: form.location_types,
      service_radius_km: parseInt(form.service_radius, 10) || 10,
      facility_address: form.facility_address,
      status: 'pending_review',
    };
    submitMutation.mutate(payload);
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return form.name.trim().length > 0 && form.bio.trim().length > 0;
      case 2: return form.sports.length > 0;
      case 3: return parseFloat(form.hourly_rate) > 0;
      case 4: return Object.values(form.availability).some((slots) => slots.length > 0);
      case 5: return form.location_types.length > 0;
      case 6: return true;
      default: return true;
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Application Submitted</h1>
        <p className="text-slate-400">
          We will review your trainer profile and get back to you within 24-48 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Become a Trainer</h1>
        <p className="text-slate-400 text-sm mt-1">Complete all steps to submit your trainer profile.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isComplete = s.id < step;
          return (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                isActive && 'bg-red-600 text-white',
                isComplete && 'bg-slate-800 text-green-400 cursor-pointer',
                !isActive && !isComplete && 'bg-slate-900 text-slate-500 cursor-default'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Step 1: Profile */}
      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Personal Profile</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => document.getElementById('photo-input')?.click()}
              >
                {form.photoPreview ? (
                  <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-500" />
                )}
              </div>
              <div>
                <p className="text-sm text-white font-medium">Profile Photo</p>
                <p className="text-xs text-slate-400">Upload a professional headshot</p>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your full name"
                className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Tell athletes about your experience, coaching philosophy, and what makes you unique..."
                rows={5}
                className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none resize-none"
              />
              <p className="text-xs text-slate-500">{form.bio.length}/500 characters</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Sports & Specializations */}
      {step === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Sports & Specializations</h2>
          </div>
          <div className="p-4 space-y-6">
            <div className="space-y-3">
              <label className="text-sm text-slate-300">Sports You Train</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SPORTS.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => toggleArrayItem('sports', sport)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border',
                      form.sports.includes(sport)
                        ? 'bg-red-600/20 border-red-600 text-red-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    )}
                  >
                    <input type="checkbox" checked={form.sports.includes(sport)} readOnly className="pointer-events-none rounded" />
                    {sport}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-800" />
            <div className="space-y-3">
              <label className="text-sm text-slate-300">Specializations</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => toggleArrayItem('specializations', spec)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                      form.specializations.includes(spec)
                        ? 'bg-red-600/20 border-red-600 text-red-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    )}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Rates */}
      {step === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Training Rates</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Hourly Rate (1-on-1)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    value={form.hourly_rate}
                    onChange={(e) => updateField('hourly_rate', e.target.value)}
                    placeholder="75"
                    className="w-full bg-slate-800 border border-slate-700 text-white pl-9 px-3 py-2 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Group Rate (per person)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    value={form.group_rate}
                    onChange={(e) => updateField('group_rate', e.target.value)}
                    placeholder="40"
                    className="w-full bg-slate-800 border border-slate-700 text-white pl-9 px-3 py-2 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800" />
            <p className="text-sm text-slate-400 font-medium">Session Packages</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">5-Session Package</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    value={form.package_5}
                    onChange={(e) => updateField('package_5', e.target.value)}
                    placeholder="325"
                    className="w-full bg-slate-800 border border-slate-700 text-white pl-9 px-3 py-2 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                {form.hourly_rate && form.package_5 && (
                  <p className="text-xs text-green-400">
                    Save {Math.round((1 - parseFloat(form.package_5) / (parseFloat(form.hourly_rate) * 5)) * 100)}% vs individual
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">10-Session Package</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    value={form.package_10}
                    onChange={(e) => updateField('package_10', e.target.value)}
                    placeholder="600"
                    className="w-full bg-slate-800 border border-slate-700 text-white pl-9 px-3 py-2 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                {form.hourly_rate && form.package_10 && (
                  <p className="text-xs text-green-400">
                    Save {Math.round((1 - parseFloat(form.package_10) / (parseFloat(form.hourly_rate) * 10)) * 100)}% vs individual
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Availability */}
      {step === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Availability</h2>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-400 mb-4">Select the days and times you are available to train.</p>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-8 gap-1">
                  <div className="p-2" />
                  {DAYS.map((day) => (
                    <div key={day} className="p-2 text-center text-xs font-medium text-slate-400">
                      {day.slice(0, 3)}
                    </div>
                  ))}
                  {TIME_SLOTS.map((time) => (
                    <div key={time} className="contents">
                      <div className="p-2 text-xs text-slate-500 text-right whitespace-nowrap">{time}</div>
                      {DAYS.map((day) => {
                        const isSelected = (form.availability[day] ?? []).includes(time);
                        return (
                          <button
                            key={`${day}-${time}`}
                            onClick={() => toggleAvailability(day, time)}
                            className={cn(
                              'p-2 rounded transition-colors border',
                              isSelected
                                ? 'bg-red-600/30 border-red-600/50'
                                : 'bg-slate-800/50 border-slate-800 hover:bg-slate-700/50'
                            )}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Location */}
      {step === 5 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Training Location</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <label className="text-sm text-slate-300">Where do you train?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LOCATION_TYPES.map((loc) => (
                  <button
                    key={loc.value}
                    onClick={() => toggleArrayItem('location_types', loc.value)}
                    className={cn(
                      'flex flex-col items-start p-4 rounded-lg border transition-colors text-left',
                      form.location_types.includes(loc.value)
                        ? 'bg-red-600/10 border-red-600 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    )}
                  >
                    <span className="text-sm font-medium">{loc.label}</span>
                    <span className="text-xs text-slate-400 mt-1">{loc.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            {form.location_types.includes('facility') && (
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Facility Address</label>
                <input
                  value={form.facility_address}
                  onChange={(e) => updateField('facility_address', e.target.value)}
                  placeholder="123 Main St, Toronto, ON"
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
                />
              </div>
            )}
            {form.location_types.includes('client') && (
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Service Radius (km)</label>
                <select
                  value={form.service_radius}
                  onChange={(e) => updateField('service_radius', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  {[5, 10, 15, 20, 25, 50].map((km) => (
                    <option key={km} value={String(km)}>{km} km</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 6: Documents */}
      {step === 6 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Required Documents</h2>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm text-slate-400">
              Upload your credentials. These are reviewed before your profile goes live.
            </p>
            {([
              { key: 'police_check' as const, label: 'Police Check / Vulnerable Sector Screening', required: true },
              { key: 'first_aid' as const, label: 'First Aid / CPR Certification', required: false },
              { key: 'insurance' as const, label: 'Liability Insurance', required: false },
            ] satisfies DocConfig[]).map((doc) => (
              <div
                key={doc.key}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700"
              >
                <div>
                  <p className="text-sm text-white font-medium">
                    {doc.label}
                    {doc.required && <span className="text-red-400 ml-1">*</span>}
                  </p>
                  {form[doc.key] ? (
                    <p className="text-xs text-green-400 mt-1">{form[doc.key]!.name}</p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, or PNG</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {form[doc.key] && (
                    <button
                      className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors"
                      onClick={() => updateField(doc.key, null)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    className="flex items-center border border-slate-600 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                    onClick={() => document.getElementById(`doc-${doc.key}`)?.click()}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </button>
                  <input
                    id={`doc-${doc.key}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleFileUpload(doc.key, e)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 7: Review */}
      {step === 7 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Review Your Application</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <ReviewSection title="Profile">
                <p className="text-white font-medium">{form.name}</p>
                <p className="text-slate-400 text-sm">{form.bio}</p>
              </ReviewSection>
              <ReviewSection title="Sports">
                <div className="flex flex-wrap gap-1">
                  {form.sports.map((s) => (
                    <span key={s} className="inline-flex items-center border border-red-600/30 text-red-400 text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.specializations.map((s) => (
                    <span key={s} className="inline-flex items-center border border-slate-600 text-slate-300 text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </ReviewSection>
              <ReviewSection title="Rates">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-slate-400">1-on-1:</span>
                  <span className="text-white">${form.hourly_rate}/hr</span>
                  <span className="text-slate-400">Group:</span>
                  <span className="text-white">${form.group_rate || 'N/A'}/person</span>
                  <span className="text-slate-400">5-Session:</span>
                  <span className="text-white">${form.package_5 || 'N/A'}</span>
                  <span className="text-slate-400">10-Session:</span>
                  <span className="text-white">${form.package_10 || 'N/A'}</span>
                </div>
              </ReviewSection>
              <ReviewSection title="Availability">
                <div className="text-sm text-slate-300">
                  {Object.entries(form.availability)
                    .filter(([, slots]) => slots.length > 0)
                    .map(([day, slots]) => (
                      <p key={day}><span className="text-slate-400">{day}:</span> {slots.length} slots</p>
                    ))}
                </div>
              </ReviewSection>
              <ReviewSection title="Location">
                <div className="flex flex-wrap gap-1">
                  {form.location_types.map((t) => (
                    <span key={t} className="inline-flex items-center border border-slate-600 text-slate-300 text-xs capitalize px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </ReviewSection>
              <ReviewSection title="Documents">
                <div className="text-sm space-y-1">
                  <DocStatus label="Police Check" file={form.police_check} />
                  <DocStatus label="First Aid" file={form.first_aid} />
                  <DocStatus label="Insurance" file={form.insurance} />
                </div>
              </ReviewSection>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          className="flex items-center border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-800 transition-colors"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>
        {step < 7 ? (
          <button
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors"
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
          </button>
        )}
      </div>
    </div>
  );
}
