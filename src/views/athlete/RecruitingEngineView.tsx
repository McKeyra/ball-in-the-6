'use client';

import { useState, useMemo } from 'react';
import { useSport } from '@/lib/athlete/sport-context';

const TEMPLATE_SECTIONS = {
  subject: 'Prospective Student-Athlete — {{athleteName}} — {{position}} — {{sport}}',
  body: `Dear Coach {{coachName}},

My name is {{athleteName}}, and I am a {{position}} currently playing {{sport}} at {{currentTeam}}. I am writing to express my sincere interest in the {{school}} {{programName}} program.

Here is a brief overview of my athletic profile:

ATHLETIC PROFILE
- Position: {{position}}
- Height/Weight: {{height}} / {{weight}}
- Current Team: {{currentTeam}}
- Graduation Year: {{gradYear}}

KEY STATS (Season Averages)
{{stats}}

ACADEMIC PROFILE
- GPA: {{gpa}}
- SAT/ACT: {{testScore}}

I believe my skills, work ethic, and character would be a strong fit for your program. I would welcome the opportunity to discuss how I could contribute to your team.

I have attached my highlight video and full scouting profile for your review.

Thank you for your time and consideration.

Respectfully,
{{athleteName}}
{{email}}
{{phone}}`,
};

export function RecruitingEngineView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [fields, setFields] = useState({
    athleteName: '', position: sportConfig.positions[0]?.code || '', coachName: '', school: '',
    programName: '', currentTeam: '', height: '', weight: '', gradYear: '', gpa: '',
    testScore: '', stats: '', email: '', phone: '',
  });
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  const updateField = (key: string, value: string): void => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const renderedSubject = useMemo(() => {
    let text = TEMPLATE_SECTIONS.subject;
    text = text.replace('{{athleteName}}', fields.athleteName || '[Your Name]');
    text = text.replace('{{position}}', fields.position || '[Position]');
    text = text.replace('{{sport}}', sportConfig.name);
    return text;
  }, [fields, sportConfig.name]);

  const renderedBody = useMemo(() => {
    let text = TEMPLATE_SECTIONS.body;
    Object.entries(fields).forEach(([key, value]) => {
      text = text.replaceAll(`{{${key}}}`, value || `[${key}]`);
    });
    text = text.replace('{{sport}}', sportConfig.name);
    return text;
  }, [fields, sportConfig.name]);

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(`Subject: ${renderedSubject}\n\n${renderedBody}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const exportAsJson = (): void => {
    const data = { template: 'recruiting_email', fields, subject: renderedSubject, body: renderedBody, created_at: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recruiting-email-${fields.school || 'draft'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const inputClass = "w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500";

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F4E7}'}</span>
        <h1 className="text-2xl font-bold text-white">Recruiting Engine</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>
      <p className="text-neutral-400 text-sm">Build a professional recruiting email. Fill in your details and get a polished outreach template.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h3 className="text-white text-lg font-semibold">Your Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-neutral-400 block mb-1">Your Name</label><input value={fields.athleteName} onChange={(e) => updateField('athleteName', e.target.value)} className={inputClass} placeholder="First Last" /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Position</label><input value={fields.position} onChange={(e) => updateField('position', e.target.value)} className={inputClass} placeholder="PG" /></div>
          </div>
          <div className="border-t border-neutral-800 pt-4">
            <h4 className="text-sm font-medium text-neutral-300 mb-3">Target School</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-neutral-400 block mb-1">Coach Name</label><input value={fields.coachName} onChange={(e) => updateField('coachName', e.target.value)} className={inputClass} placeholder="Coach Smith" /></div>
              <div><label className="text-xs text-neutral-400 block mb-1">School</label><input value={fields.school} onChange={(e) => updateField('school', e.target.value)} className={inputClass} placeholder="University of Toronto" /></div>
            </div>
            <div className="mt-3"><label className="text-xs text-neutral-400 block mb-1">Program Name</label><input value={fields.programName} onChange={(e) => updateField('programName', e.target.value)} className={inputClass} placeholder="Varsity Blues Basketball" /></div>
          </div>
          <div className="border-t border-neutral-800 pt-4">
            <h4 className="text-sm font-medium text-neutral-300 mb-3">Athletic Info</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-neutral-400 block mb-1">Current Team</label><input value={fields.currentTeam} onChange={(e) => updateField('currentTeam', e.target.value)} className={inputClass} placeholder="Team name" /></div>
              <div><label className="text-xs text-neutral-400 block mb-1">Grad Year</label><input value={fields.gradYear} onChange={(e) => updateField('gradYear', e.target.value)} className={inputClass} placeholder="2027" /></div>
              <div><label className="text-xs text-neutral-400 block mb-1">Height</label><input value={fields.height} onChange={(e) => updateField('height', e.target.value)} className={inputClass} placeholder={`6'2"`} /></div>
              <div><label className="text-xs text-neutral-400 block mb-1">Weight</label><input value={fields.weight} onChange={(e) => updateField('weight', e.target.value)} className={inputClass} placeholder="185 lbs" /></div>
            </div>
            <div className="mt-3"><label className="text-xs text-neutral-400 block mb-1">Key Stats (Season Averages)</label><textarea value={fields.stats} onChange={(e) => updateField('stats', e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="18.5 PPG | 5.2 APG | 3.1 RPG" /></div>
          </div>
          <div className="border-t border-neutral-800 pt-4">
            <h4 className="text-sm font-medium text-neutral-300 mb-3">Academic & Contact</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-neutral-400 block mb-1">GPA</label><input value={fields.gpa} onChange={(e) => updateField('gpa', e.target.value)} className={inputClass} placeholder="3.5" /></div>
              <div><label className="text-xs text-neutral-400 block mb-1">SAT/ACT</label><input value={fields.testScore} onChange={(e) => updateField('testScore', e.target.value)} className={inputClass} placeholder="1200" /></div>
              <div><label className="text-xs text-neutral-400 block mb-1">Email</label><input value={fields.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} placeholder="you@email.com" /></div>
              <div><label className="text-xs text-neutral-400 block mb-1">Phone</label><input value={fields.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} placeholder="(416) 555-0123" /></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
            <h3 className="text-white text-lg font-semibold">Email Preview</h3>
            <div><div className="text-xs text-neutral-500 mb-1">Subject</div><div className="text-sm text-white font-medium p-2 bg-neutral-800 rounded">{renderedSubject}</div></div>
            <div><div className="text-xs text-neutral-500 mb-1">Body</div><div className="text-sm text-neutral-300 p-3 bg-neutral-800 rounded whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto">{renderedBody}</div></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyToClipboard} className="flex-1 px-4 py-2 rounded-lg bg-[#c8ff00] text-black text-sm font-medium hover:bg-[#b8ef00] transition-colors">{copied ? '\u2713 Copied!' : 'Copy to Clipboard'}</button>
            <button onClick={exportAsJson} className="flex-1 px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors">{exported ? '\u2713 Exported!' : 'Export JSON'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
