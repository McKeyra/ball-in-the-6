'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const PATHWAY_STAGES = [
  { id: 'park', icon: '\u{1F3DE}\u{FE0F}', title: 'Park / Rec', ageRange: '4-8', color: '#84CC16', description: 'First exposure to sport through play. Community programs and recreation leagues.', organizations: ['Local community centers', 'YMCA / YWCA', 'Parks & Recreation', 'Church leagues'], requirements: ['None — just show up and play', 'Basic equipment (often provided)', 'Parent/guardian registration'], timeline: '1-3 years of free play and exploration' },
  { id: 'club', icon: '\u{1F3C5}', title: 'Club / House League', ageRange: '7-14', color: '#F59E0B', description: 'Structured competition with coaching. Introduction to positions, rules, and teamwork.', organizations: ['Local sport clubs', 'House leagues', 'School intramurals', 'After-school programs'], requirements: ['Registration fee ($100-500)', 'Basic equipment', 'Commitment to practice schedule', 'Good sportsmanship'], timeline: '2-5 years of development and competition' },
  { id: 'school', icon: '\u{1F3EB}', title: 'School / Regional', ageRange: '12-18', color: '#10B981', description: 'Competitive school teams and regional club programs. Position specialization begins.', organizations: ['High school teams', 'Travel/rep teams', 'Provincial sport organizations', 'AAU / Minor leagues'], requirements: ['Tryout process', 'Academic eligibility', 'Increased training commitment', 'Possible travel schedule'], timeline: '4-6 years of competitive development' },
  { id: 'provincial', icon: '\u{1F3C6}', title: 'Provincial / State', ageRange: '15-19', color: '#3B82F6', description: 'Elite regional competition. Represents province/state at national qualifiers.', organizations: ['Provincial sport organizations', 'Team Ontario/Quebec/BC etc.', 'State teams (USA)', 'National talent ID camps'], requirements: ['Selection through tryouts or performance', 'Year-round training commitment', 'Travel for competitions', 'Strong academic standing'], timeline: '2-4 years at elite junior level' },
  { id: 'national', icon: '\u{1F1E8}\u{1F1E6}', title: 'National', ageRange: '16-23', color: '#8B5CF6', description: 'Representing your country at international competitions. USports / NCAA recruitment.', organizations: ['National sport organizations', 'USports (Canada)', 'NCAA (USA)', 'Junior national teams', 'Development academies'], requirements: ['Elite performance metrics', 'Full-time training commitment', 'Eligibility (academic + amateur)', 'Physical and mental health standards'], timeline: '4-6 years at national level' },
  { id: 'professional', icon: '\u{1F31F}', title: 'Professional', ageRange: '18+', color: '#EF4444', description: 'Earning a living through your sport. Competing at the highest level worldwide.', organizations: ['Professional leagues (NBA, NHL, MLS, etc.)', 'International leagues', 'Olympic programs', 'Professional development leagues'], requirements: ['Elite talent and proven performance', 'Agent representation', 'Contract negotiation', 'Career and financial planning'], timeline: 'Average career: 5-15 years depending on sport' },
];

export function PathwayNavigatorView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F6E4}\u{FE0F}'}</span>
        <h1 className="text-2xl font-bold text-white">Pathway Navigator</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>

      <p className="text-neutral-400 text-sm">The athlete development roadmap from park play to professional. Click each stage to learn more.</p>

      <div className="relative">
        <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-lime-500 via-blue-500 to-red-500 opacity-30 hidden sm:block" />

        <div className="space-y-4">
          {PATHWAY_STAGES.map((stage, idx) => {
            const isSelected = selectedStage === stage.id;
            return (
              <div key={stage.id} className="relative">
                <button
                  onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                  className={cn(
                    'w-full text-left transition-all flex items-start gap-4 p-4 rounded-xl border',
                    isSelected ? 'bg-neutral-800 border-neutral-600' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50'
                  )}
                >
                  <div className="relative z-10">
                    <div
                      className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all', isSelected && 'scale-110')}
                      style={{ backgroundColor: `${stage.color}15`, border: `2px solid ${isSelected ? stage.color : stage.color + '40'}` }}
                    >
                      {stage.icon}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{stage.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>Ages {stage.ageRange}</span>
                    </div>
                    <p className="text-sm text-neutral-400 mt-1">{stage.description}</p>

                    {isSelected && (
                      <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-300 mb-2">Organizations</h4>
                          <div className="flex flex-wrap gap-2">
                            {stage.organizations.map((org) => (
                              <span key={org} className="text-xs text-neutral-300 border border-neutral-700 rounded-full px-2 py-1">{org}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-300 mb-2">Requirements</h4>
                          <div className="space-y-1">
                            {stage.requirements.map((req) => (
                              <div key={req} className="flex items-start gap-2">
                                <span className="text-neutral-500 mt-0.5">{'\u2022'}</span>
                                <span className="text-sm text-neutral-400">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                          <span className="text-xs text-neutral-500">Timeline: </span>
                          <span className="text-sm text-neutral-300">{stage.timeline}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {idx < PATHWAY_STAGES.length - 1 && !isSelected && (
                    <div className="text-neutral-600 self-center text-lg">{'\u276F'}</div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
