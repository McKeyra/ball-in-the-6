'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Save, User, Ruler, GraduationCap, Target, Lock, CheckCircle } from 'lucide-react';

const SECTIONS = [
  { id: 'personal', label: 'Personal Information', icon: User },
  { id: 'athletic', label: 'Athletic Profile', icon: Ruler },
  { id: 'academic', label: 'Academic Information', icon: GraduationCap },
  { id: 'recruiting', label: 'Recruiting Preferences', icon: Target },
  { id: 'privacy', label: 'Privacy Settings', icon: Lock },
] as const;

function CollapsibleSection({ label, icon: Icon, isOpen, onToggle, children, saved, onSave, saving }: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  saved: boolean;
  onSave: () => void;
  saving: boolean;
}): React.ReactElement {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg"><Icon className="w-4 h-4 text-red-500" /></div>
          <span className="text-sm font-semibold text-white">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Saved
            </span>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          <div className="border-t border-slate-800" />
          {children}
          <div className="flex justify-end pt-2">
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1" onClick={onSave} disabled={saving}>
              <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save Section'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProfileBuilderPage(): React.ReactElement {
  const [openSections, setOpenSections] = useState<string[]>(['personal']);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const toggleSection = (id: string): void => {
    setOpenSections((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const getField = (key: string): string => form[key] ?? '';
  const setField = (key: string, value: string): void => setForm((prev) => ({ ...prev, [key]: value }));

  const saveSection = (section: string): void => {
    // TODO: POST to /api/recruiting/profile-builder
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Builder</h1>
        <p className="text-slate-400 text-sm mt-1">Build and update your recruiting profile section by section.</p>
      </div>

      <CollapsibleSection label="Personal Information" icon={User} isOpen={openSections.includes('personal')} onToggle={() => toggleSection('personal')} saved={savedSection === 'personal'} onSave={() => saveSection('personal')} saving={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">Full Name</label>
            <input value={getField('name')} onChange={(e) => setField('name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">City</label>
            <input value={getField('city')} onChange={(e) => setField('city', e.target.value)} placeholder="Toronto, ON" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-slate-300 text-sm">Bio</label>
          <textarea value={getField('bio')} onChange={(e) => setField('bio', e.target.value)} placeholder="Tell recruiters about yourself..." rows={4} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
        </div>
      </CollapsibleSection>

      <CollapsibleSection label="Athletic Profile" icon={Ruler} isOpen={openSections.includes('athletic')} onToggle={() => toggleSection('athletic')} saved={savedSection === 'athletic'} onSave={() => saveSection('athletic')} saving={false}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-2"><label className="text-slate-300 text-sm">Sport</label><input value={getField('sport')} onChange={(e) => setField('sport', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
          <div className="space-y-2"><label className="text-slate-300 text-sm">Position</label><input value={getField('position')} onChange={(e) => setField('position', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
          <div className="space-y-2"><label className="text-slate-300 text-sm">Team</label><input value={getField('team')} onChange={(e) => setField('team', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection label="Academic Information" icon={GraduationCap} isOpen={openSections.includes('academic')} onToggle={() => toggleSection('academic')} saved={savedSection === 'academic'} onSave={() => saveSection('academic')} saving={false}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-2"><label className="text-slate-300 text-sm">School</label><input value={getField('school')} onChange={(e) => setField('school', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
          <div className="space-y-2"><label className="text-slate-300 text-sm">GPA</label><input type="number" step="0.01" value={getField('gpa')} onChange={(e) => setField('gpa', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
          <div className="space-y-2"><label className="text-slate-300 text-sm">Graduation Year</label><input type="number" value={getField('graduation_year')} onChange={(e) => setField('graduation_year', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" /></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection label="Recruiting Preferences" icon={Target} isOpen={openSections.includes('recruiting')} onToggle={() => toggleSection('recruiting')} saved={savedSection === 'recruiting'} onSave={() => saveSection('recruiting')} saving={false}>
        <div className="space-y-2">
          <label className="text-slate-300 text-sm">Personal Statement</label>
          <textarea value={getField('recruiting_statement')} onChange={(e) => setField('recruiting_statement', e.target.value)} rows={4} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm" />
        </div>
      </CollapsibleSection>

      <CollapsibleSection label="Privacy Settings" icon={Lock} isOpen={openSections.includes('privacy')} onToggle={() => toggleSection('privacy')} saved={savedSection === 'privacy'} onSave={() => saveSection('privacy')} saving={false}>
        <div className="space-y-4">
          {[
            { key: 'show_contact_info', label: 'Show Contact Information', desc: 'Allow recruiters to see your contact details' },
            { key: 'show_academics', label: 'Show Academic Info', desc: 'Display GPA and test scores on your profile' },
            { key: 'show_stats', label: 'Show Stats', desc: 'Make season statistics visible to recruiters' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div>
                <p className="text-sm text-white">{setting.label}</p>
                <p className="text-xs text-slate-400">{setting.desc}</p>
              </div>
              <button className="w-10 h-6 rounded-full bg-green-600 relative" onClick={() => {}}>
                <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-all" />
              </button>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
