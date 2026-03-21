'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const DEFAULT_AFFIRMATIONS = [
  'I am prepared and I trust my training.',
  'I compete with confidence and composure.',
  'I am the hardest worker in the room.',
  'I embrace pressure — it makes me better.',
  'My team is better because I am on it.',
];

const VISUALIZATION_STEPS = [
  'Find a quiet, comfortable space. Close your eyes.',
  'Breathe deeply 5 times. Feel your body relax.',
  'Picture the venue — the lights, the sounds, the energy.',
  'See yourself warming up with confidence and focus.',
  'Visualize executing your best plays perfectly.',
  'Feel the emotion of making a game-changing play.',
  'See the final buzzer/whistle — you performed at your best.',
  'Open your eyes slowly. Carry that confidence with you.',
];

const PRE_GAME_CHECKLIST = [
  'Arrive early and walk the venue',
  'Dynamic warm-up complete',
  'Visualization session (5 min)',
  'Review game plan and responsibilities',
  'Affirmations — say 3 out loud',
  'Box breathing — 2 minutes',
  'Positive conversation with a teammate',
  'Put on your game face — it is time',
];

const SLUMP_RECOVERY = [
  { step: 1, title: 'Acknowledge It', description: 'Slumps are normal. Every great athlete has been through one. Name it without judgment. "I am in a slump and that is okay."' },
  { step: 2, title: 'Go Back to Basics', description: 'Strip your game down to fundamentals. Focus on the simplest version of your skills. Build back from the foundation.' },
  { step: 3, title: 'Change the Narrative', description: 'Instead of "I can\'t do anything right," say "I am building momentum." Review your best highlights. Remember who you are.' },
];

const CRISIS_RESOURCES = [
  { name: 'Kids Help Phone', number: '1-800-668-6868', description: 'Canada-wide, 24/7' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'US & Canada, 24/7' },
  { name: 'Suicide Prevention', number: '988', description: 'National Suicide Prevention, 24/7' },
  { name: 'Athlete Mental Health', number: 'athletesforhope.org', description: 'Resources for athletes' },
];

const BREATHING_PHASES = ['Inhale', 'Hold', 'Exhale', 'Hold'] as const;
const PHASE_DURATION = 4;

function BreathingExercise(): React.ReactElement {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [seconds, setSeconds] = useState(PHASE_DURATION);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setPhase((p) => {
            const next = (p + 1) % BREATHING_PHASES.length;
            if (next === 0) setCycles((c) => c + 1);
            return next;
          });
          return PHASE_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const toggle = (): void => {
    if (active) {
      setActive(false);
      setPhase(0);
      setSeconds(PHASE_DURATION);
    } else {
      setActive(true);
      setCycles(0);
    }
  };

  const scale = phase === 0 ? 1 + ((PHASE_DURATION - seconds) / PHASE_DURATION) * 0.3
    : phase === 2 ? 1.3 - ((PHASE_DURATION - seconds) / PHASE_DURATION) * 0.3
    : phase === 1 ? 1.3 : 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-[#c8ff00]/10 border-2 border-[#c8ff00]/30 transition-transform duration-1000"
          style={{ transform: `scale(${scale})` }}
        />
        <div className="relative text-center">
          <div className="text-2xl font-bold text-white">{seconds}</div>
          <div className="text-xs text-[#c8ff00]">{active ? BREATHING_PHASES[phase] : 'Ready'}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            active ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#c8ff00] text-black hover:bg-[#b8ef00]'
          )}
        >
          {active ? 'Stop' : 'Start'}
        </button>
        {cycles > 0 && <span className="text-xs text-neutral-500">{cycles} cycles</span>}
      </div>
    </div>
  );
}

export function MentalGameView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [expandedSection, setExpandedSection] = useState<string | null>('breathing');
  const [affirmations, setAffirmations] = useState(DEFAULT_AFFIRMATIONS);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string): void => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const addAffirmation = (): void => {
    if (newAffirmation.trim()) {
      setAffirmations((prev) => [...prev, newAffirmation.trim()]);
      setNewAffirmation('');
    }
  };

  const removeAffirmation = (index: number): void => {
    setAffirmations((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCheckItem = (item: string): void => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const sections = [
    { key: 'breathing', icon: '\u{1F32C}\u{FE0F}', title: 'Box Breathing' },
    { key: 'visualization', icon: '\u{1F9D8}', title: 'Visualization' },
    { key: 'affirmations', icon: '\u{1F4AC}', title: 'Affirmations' },
    { key: 'pregame', icon: '\u2705', title: 'Pre-Game Routine' },
    { key: 'slump', icon: '\u{1F4AA}', title: 'Slump Recovery' },
    { key: 'crisis', icon: '\u2764\u{FE0F}', title: 'Crisis Resources' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F9E0}'}</span>
        <h1 className="text-2xl font-bold text-white">Mental Game</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>
          {sportConfig.name}
        </span>
      </div>

      <p className="text-neutral-400 text-sm">
        Six mental performance techniques used by elite athletes. Train your mind like you train your body.
      </p>

      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSection === section.key;

          return (
            <div
              key={section.key}
              className={cn(
                'bg-neutral-900 border border-neutral-800 rounded-xl transition-all',
                isExpanded && 'border-neutral-600'
              )}
            >
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full text-left p-5 flex items-center gap-4"
              >
                <span className="text-2xl">{section.icon}</span>
                <h3 className="text-lg font-semibold text-white flex-1">{section.title}</h3>
                <span className={cn(
                  'text-neutral-500 transition-transform',
                  isExpanded && 'rotate-180'
                )}>
                  {'\u25BC'}
                </span>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-0">
                  {section.key === 'breathing' && (
                    <div>
                      <p className="text-sm text-neutral-400 mb-6">
                        Box breathing calms your nervous system before competition. 4 seconds inhale, 4 seconds hold, 4 seconds exhale, 4 seconds hold.
                      </p>
                      <BreathingExercise />
                    </div>
                  )}

                  {section.key === 'visualization' && (
                    <div className="space-y-3">
                      <p className="text-sm text-neutral-400 mb-4">
                        Guided visualization builds neural pathways for peak performance. Do this daily for 5-10 minutes.
                      </p>
                      {VISUALIZATION_STEPS.map((step, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800/50">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-sm text-neutral-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.key === 'affirmations' && (
                    <div className="space-y-4">
                      <p className="text-sm text-neutral-400">
                        Speak these out loud before every game and practice. Add your own.
                      </p>
                      <div className="space-y-2">
                        {affirmations.map((aff, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 group">
                            <span className="text-yellow-400 text-sm">{'\u2B50'}</span>
                            <span className="text-sm text-neutral-300 flex-1 italic">&ldquo;{aff}&rdquo;</span>
                            <button
                              onClick={() => removeAffirmation(i)}
                              className="text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                            >
                              {'\u2715'}
                            </button>
                          </div>
                        ))}
                      </div>
                      <textarea
                        value={newAffirmation}
                        onChange={(e) => setNewAffirmation(e.target.value)}
                        placeholder="Add a new affirmation..."
                        className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg p-3 min-h-[60px] text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
                      />
                      <button
                        onClick={addAffirmation}
                        disabled={!newAffirmation.trim()}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#c8ff00] text-black hover:bg-[#b8ef00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add Affirmation
                      </button>
                    </div>
                  )}

                  {section.key === 'pregame' && (
                    <div className="space-y-3">
                      <p className="text-sm text-neutral-400 mb-4">
                        Complete this checklist before every game. Consistency breeds confidence.
                      </p>
                      {PRE_GAME_CHECKLIST.map((item) => (
                        <div key={item} className="flex items-center gap-3 p-2">
                          <button
                            onClick={() => toggleCheckItem(item)}
                            className={cn(
                              'w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-all shrink-0',
                              checklist[item]
                                ? 'bg-[#c8ff00] border-[#c8ff00] text-black'
                                : 'border-neutral-600 hover:border-neutral-500'
                            )}
                          >
                            {checklist[item] ? '\u2713' : ''}
                          </button>
                          <span className={cn(
                            'text-sm transition-all',
                            checklist[item] ? 'text-green-400 line-through' : 'text-neutral-300'
                          )}>
                            {item}
                          </span>
                        </div>
                      ))}
                      <div className="text-xs text-neutral-500 mt-2">
                        {Object.values(checklist).filter(Boolean).length} / {PRE_GAME_CHECKLIST.length} complete
                      </div>
                    </div>
                  )}

                  {section.key === 'slump' && (
                    <div className="space-y-4">
                      <p className="text-sm text-neutral-400 mb-2">
                        Every athlete hits a slump. Here is how to get out of it.
                      </p>
                      {SLUMP_RECOVERY.map((s) => (
                        <div key={s.step} className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                              style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}
                            >
                              {s.step}
                            </span>
                            <h4 className="text-white font-semibold">{s.title}</h4>
                          </div>
                          <p className="text-sm text-neutral-400 ml-11">{s.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.key === 'crisis' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-neutral-300">
                          If you or someone you know is struggling, these resources are available 24/7.
                          <span className="block mt-1 text-red-400 font-medium">
                            There is no shame in asking for help. It takes strength.
                          </span>
                        </p>
                      </div>
                      {CRISIS_RESOURCES.map((r) => (
                        <div key={r.name} className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
                          <h4 className="text-white font-semibold">{r.name}</h4>
                          <p className="text-lg font-mono mt-1" style={{ color: sportConfig.color }}>
                            {r.number}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">{r.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
