'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const STAGE_TRAINING: Record<string, { sessions: Array<{ day: string; focus: string; duration: string; notes: string }>; organizations: string[] }> = {
  youth: { sessions: [{ day: 'Mon', focus: 'Multi-sport play', duration: '60 min', notes: 'Fun-based games, coordination' }, { day: 'Wed', focus: 'Fundamental skills', duration: '60 min', notes: 'Basic sport skills + movement' }, { day: 'Sat', focus: 'Game day', duration: '60 min', notes: 'Small-sided games, equal time' }], organizations: ['Community recreation centers', 'YMCA / YWCA programs', 'Local sport clubs', 'School intramural programs', 'Parks & Recreation leagues'] },
  school: { sessions: [{ day: 'Mon', focus: 'Strength & conditioning', duration: '75 min', notes: 'Position-specific training' }, { day: 'Tue', focus: 'Team practice', duration: '90 min', notes: 'Tactical and skills' }, { day: 'Thu', focus: 'Team practice', duration: '90 min', notes: 'Game preparation' }, { day: 'Fri', focus: 'Film + recovery', duration: '60 min', notes: 'Film study & mobility' }, { day: 'Sat', focus: 'Game day', duration: 'Full game', notes: 'Competition' }], organizations: ['High school varsity programs', 'AAU / Club travel teams', 'Provincial sport organizations', 'National talent identification camps', 'Summer elite development camps'] },
  university: { sessions: [{ day: 'Mon', focus: 'Weights + film', duration: '120 min', notes: 'AM lift, PM film study' }, { day: 'Tue', focus: 'Full practice', duration: '120 min', notes: 'Team tactical work' }, { day: 'Wed', focus: 'Recovery + skills', duration: '90 min', notes: 'Individual skill work' }, { day: 'Thu', focus: 'Full practice', duration: '120 min', notes: 'Game prep' }, { day: 'Fri', focus: 'Shootaround / walk-through', duration: '60 min', notes: 'Light prep' }, { day: 'Sat', focus: 'Game day', duration: 'Full game', notes: 'Competition' }], organizations: ['USports (Canada)', 'NCAA D1 / D2 / D3 (USA)', 'CCAA (Canadian Colleges)', 'NAIA programs', 'National team development'] },
  professional: { sessions: [{ day: 'Mon', focus: 'Weights + individual work', duration: '150 min', notes: 'AM lift, skill refinement' }, { day: 'Tue', focus: 'Full practice', duration: '120 min', notes: 'System work, scrimmage' }, { day: 'Wed', focus: 'Recovery + film', duration: '90 min', notes: 'Treatment, video, nutrition' }, { day: 'Thu', focus: 'Game prep', duration: '90 min', notes: 'Shootaround, scout report' }, { day: 'Fri', focus: 'Game', duration: 'Full game', notes: 'Competition' }, { day: 'Sat', focus: 'Travel / Game', duration: 'Variable', notes: 'Back-to-back or travel' }, { day: 'Sun', focus: 'Recovery', duration: '60 min', notes: 'Active recovery, treatment' }], organizations: ['Professional leagues (NBA, NHL, MLS, etc.)', 'Development leagues (G-League, AHL, etc.)', 'International professional leagues', 'Olympic/National teams', 'Private training facilities'] },
};

export function StageSelectorView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const stages = (sportConfig as unknown as Record<string, unknown>).stages as Array<{ id: string; label: string; ageRange: string; color: string; philosophy: string; keyFocus: string[]; restrictions: string[] }> || [];
  const activeStage = stages.find((s) => s.id === selectedStage);
  const training = selectedStage ? STAGE_TRAINING[selectedStage] || null : null;

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F3D7}\u{FE0F}'}</span>
        <h1 className="text-2xl font-bold text-white">Stage Selector</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>
      <p className="text-neutral-400 text-sm">Deep dive into each career stage. Philosophy, key focus areas, training programs, and organizations.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const isSelected = selectedStage === stage.id;
          return (
            <button key={stage.id} onClick={() => setSelectedStage(isSelected ? null : stage.id)} className={cn('text-left p-5 rounded-xl border transition-all', isSelected ? 'bg-neutral-800 scale-[1.02]' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/50')} style={isSelected ? { borderColor: stage.color, boxShadow: `0 0 20px ${stage.color}15` } : undefined}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-3" style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>{stage.label.charAt(0)}</div>
              <h3 className="text-lg font-semibold text-white">{stage.label}</h3>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>Ages {stage.ageRange}</span>
              <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{stage.philosophy}</p>
            </button>
          );
        })}
      </div>

      {activeStage && training && (
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="h-1.5" style={{ backgroundColor: activeStage.color }} />
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${activeStage.color}20`, color: activeStage.color }}>{activeStage.label.charAt(0)}</div>
                <div><h2 className="text-xl font-bold text-white">{activeStage.label}</h2><span className="text-sm text-neutral-400">Ages {activeStage.ageRange}</span></div>
              </div>
              <div><h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Philosophy</h4><p className="text-sm text-neutral-300 italic leading-relaxed">{activeStage.philosophy}</p></div>
              <div><h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Key Focus Areas</h4><div className="flex flex-wrap gap-2">{activeStage.keyFocus.map((focus) => <span key={focus} className="text-xs text-neutral-300 border border-neutral-700 rounded-full px-2 py-1">{focus}</span>)}</div></div>
              {activeStage.restrictions.length > 0 && (
                <div><h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Restrictions & Notes</h4><div className="space-y-1">{activeStage.restrictions.map((r) => <div key={r} className="flex items-start gap-2 text-sm text-neutral-400"><span className="text-yellow-400 mt-0.5">{'\u26A0'}</span><span>{r}</span></div>)}</div></div>
              )}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Training Template</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-neutral-700"><th className="text-left py-2 px-3 text-neutral-400 font-medium">Day</th><th className="text-left py-2 px-3 text-neutral-400 font-medium">Focus</th><th className="text-center py-2 px-3 text-neutral-400 font-medium">Duration</th><th className="text-left py-2 px-3 text-neutral-400 font-medium">Notes</th></tr></thead>
                <tbody>
                  {training.sessions.map((session, i) => (
                    <tr key={i} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                      <td className="py-2 px-3 font-medium" style={{ color: activeStage.color }}>{session.day}</td>
                      <td className="py-2 px-3 text-neutral-300">{session.focus}</td>
                      <td className="py-2 px-3 text-center text-neutral-400">{session.duration}</td>
                      <td className="py-2 px-3 text-neutral-500">{session.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Organizations & Programs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {training.organizations.map((org) => (
                <div key={org} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                  <div className="w-2 h-6 rounded-full shrink-0" style={{ backgroundColor: activeStage.color }} />
                  <span className="text-sm text-neutral-300">{org}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
