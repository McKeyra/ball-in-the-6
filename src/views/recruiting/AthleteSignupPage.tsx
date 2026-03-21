'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { User, Users, Ruler, GraduationCap, Target, CheckCircle, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Parent Account', icon: Users },
  { id: 2, label: 'Athlete Basics', icon: User },
  { id: 3, label: 'Physical', icon: Ruler },
  { id: 4, label: 'Athletic', icon: GraduationCap },
  { id: 5, label: 'Recruiting', icon: Target },
  { id: 6, label: 'Review', icon: CheckCircle },
];

const SPORTS = ['Basketball', 'Soccer', 'Football', 'Baseball', 'Hockey', 'Track & Field', 'Swimming', 'Volleyball', 'Tennis'];
const POSITION_MAP: Record<string, string[]> = {
  Basketball: ['PG', 'SG', 'SF', 'PF', 'C'],
  Soccer: ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'],
  Football: ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K'],
  Hockey: ['C', 'LW', 'RW', 'D', 'G'],
};

const GOAL_OPTIONS = [
  'NCAA D1 Scholarship', 'NCAA D2 Scholarship', 'NCAA D3 Roster',
  'USports', 'NAIA', 'Professional Development', 'Camp Invites',
  'Exposure & Visibility', 'Academic & Athletic Balance',
];

const AVAILABILITY_TYPES = ['Showcases', 'Camps', 'Combines', 'Unofficial Visits', 'Official Visits', 'Phone Calls'];

interface FormState {
  parent_name: string; parent_email: string; parent_phone: string;
  name: string; dob: string; sport: string; position: string; photoPreview: string;
  height_ft: string; height_in: string; weight: string; wingspan: string; vertical: string; dominant_hand: string;
  team: string; league: string; coach_name: string; school: string; gpa: string;
  statement: string; goals: string[]; available_types: string[];
}

const INITIAL_FORM: FormState = {
  parent_name: '', parent_email: '', parent_phone: '',
  name: '', dob: '', sport: '', position: '', photoPreview: '',
  height_ft: '', height_in: '', weight: '', wingspan: '', vertical: '', dominant_hand: 'Right',
  team: '', league: '', coach_name: '', school: '', gpa: '',
  statement: '', goals: [], available_types: [],
};

function ReviewField({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <div>
      <span className="text-slate-400">{label}:</span>
      <span className="text-white ml-1">{value || 'Not set'}</span>
    </div>
  );
}

export function AthleteSignupPage(): React.ReactElement {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'goals' | 'available_types', item: string): void => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const positions = POSITION_MAP[form.sport] || [];

  const handleSubmit = (): void => {
    // TODO: POST to /api/recruiting/athlete-signup
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Profile Created!</h1>
        <p className="text-slate-400">Your athlete profile is now live. Recruiters can discover you through search. Complete more of your profile to increase visibility.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Athlete Registration</h1>
        <p className="text-slate-400 text-sm mt-1">Create a recruiting profile for your athlete.</p>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isComplete = s.id < step;
          return (
            <button key={s.id} onClick={() => s.id < step && setStep(s.id)} className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
              isActive && 'bg-red-600 text-white',
              isComplete && 'bg-slate-800 text-green-400 cursor-pointer',
              !isActive && !isComplete && 'bg-slate-900 text-slate-500 cursor-default'
            )}>
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-white font-semibold">Parent / Guardian Account</h2>
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">Parent Full Name</label>
            <input value={form.parent_name} onChange={(e) => updateField('parent_name', e.target.value)} placeholder="Jane Doe" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">Parent Email</label>
            <input type="email" value={form.parent_email} onChange={(e) => updateField('parent_email', e.target.value)} placeholder="parent@email.com" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">Phone Number</label>
            <input type="tel" value={form.parent_phone} onChange={(e) => updateField('parent_phone', e.target.value)} placeholder="(416) 555-0123" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-white font-semibold">Athlete Basics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Full Name</label>
              <input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Athlete name" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Date of Birth</label>
              <input type="date" value={form.dob} onChange={(e) => updateField('dob', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Primary Sport</label>
              <select value={form.sport} onChange={(e) => { updateField('sport', e.target.value); updateField('position', ''); }} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm">
                <option value="">Select sport</option>
                {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Position</label>
              <select value={form.position} onChange={(e) => updateField('position', e.target.value)} disabled={positions.length === 0} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-50">
                <option value="">Select position</option>
                {positions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-white font-semibold">Physical Measurements</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Weight (lbs)</label>
              <input type="number" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} placeholder="165" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Wingspan (in)</label>
              <input type="number" value={form.wingspan} onChange={(e) => updateField('wingspan', e.target.value)} placeholder="74" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Vertical (in)</label>
              <input type="number" value={form.vertical} onChange={(e) => updateField('vertical', e.target.value)} placeholder="32" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">Dominant Hand</label>
            <div className="flex gap-2">
              {['Right', 'Left', 'Ambidextrous'].map((h) => (
                <button key={h} onClick={() => updateField('dominant_hand', h)} className={cn('px-4 py-2 rounded-lg text-sm border transition-colors', form.dominant_hand === h ? 'bg-red-600/20 border-red-600 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-300')}>
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-white font-semibold">Athletic & Academic Background</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Current Team</label>
              <input value={form.team} onChange={(e) => updateField('team', e.target.value)} placeholder="Toronto Raptors U17" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">League</label>
              <input value={form.league} onChange={(e) => updateField('league', e.target.value)} placeholder="OSBA" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">Head Coach Name</label>
            <input value={form.coach_name} onChange={(e) => updateField('coach_name', e.target.value)} placeholder="Coach Smith" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">School</label>
              <input value={form.school} onChange={(e) => updateField('school', e.target.value)} placeholder="School name" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">GPA</label>
              <input type="number" step="0.01" value={form.gpa} onChange={(e) => updateField('gpa', e.target.value)} placeholder="3.50" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-white font-semibold">Recruiting Preferences</h2>
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">Personal Statement</label>
            <textarea value={form.statement} onChange={(e) => updateField('statement', e.target.value)} placeholder="What drives you as an athlete?" rows={4} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-3">
            <label className="text-slate-300 text-sm">Goals</label>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((goal) => (
                <button key={goal} onClick={() => toggleArrayItem('goals', goal)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-colors', form.goals.includes(goal) ? 'bg-red-600/20 border-red-600 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600')}>
                  {goal}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-slate-300 text-sm">Available For</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_TYPES.map((type) => (
                <button key={type} onClick={() => toggleArrayItem('available_types', type)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-colors', form.available_types.includes(type) ? 'bg-blue-600/20 border-blue-600 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600')}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-white font-semibold">Review Profile</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <ReviewField label="Athlete" value={form.name} />
            <ReviewField label="Sport" value={`${form.sport} - ${form.position}`} />
            <ReviewField label="Height" value={form.height_ft ? `${form.height_ft}'${form.height_in}"` : 'Not set'} />
            <ReviewField label="Weight" value={form.weight ? `${form.weight} lbs` : 'Not set'} />
            <ReviewField label="School" value={form.school} />
            <ReviewField label="GPA" value={form.gpa} />
            <ReviewField label="Team" value={form.team} />
            <ReviewField label="Parent" value={form.parent_name} />
          </div>
          {form.goals.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {form.goals.map((g) => (
                <span key={g} className="border border-red-600/30 text-red-400 text-[10px] px-1.5 py-0.5 rounded-full">{g}</span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button className="border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm disabled:opacity-50 flex items-center gap-1" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {step < 6 ? (
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1" onClick={() => setStep((s) => s + 1)}>
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm" onClick={handleSubmit}>
            Create Profile
          </button>
        )}
      </div>
    </div>
  );
}
