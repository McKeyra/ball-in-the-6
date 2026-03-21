'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const FILM_STEPS = [
  { step: 1, title: 'Watch the Full Game', description: 'Watch the entire game without pausing. Get a feel for the flow, tempo, and momentum shifts. Note key moments.', tip: 'Write down timestamps of important plays as you watch.', duration: '60-90 min' },
  { step: 2, title: 'Focus on Your Position', description: 'Rewatch focusing only on players in your position. Study their movement, positioning, and decision-making.', tip: 'Cover the ball with your hand to focus on off-ball movement.', duration: '30-45 min' },
  { step: 3, title: 'Note Patterns', description: 'Identify recurring patterns: offensive sets, defensive rotations, transition tendencies. Look for habits.', tip: 'Use a notebook to diagram common plays and patterns.', duration: '20-30 min' },
  { step: 4, title: 'Study Transitions', description: 'Focus on transition moments: offense to defense, defense to offense. Who recovers fastest? Who gets caught?', tip: 'Count how many seconds the best players take to transition.', duration: '15-20 min' },
  { step: 5, title: 'Analyze Defense', description: 'Study defensive schemes, rotations, and communication. Note how defenders handle screens, isolations, and mismatches.', tip: 'Track individual matchups and who wins them.', duration: '20-30 min' },
  { step: 6, title: 'Review Decisions', description: 'For each key play, ask: "What were the options? Why did they choose this one? What would I have done?"', tip: 'Pause before the play develops and predict the outcome.', duration: '20-30 min' },
  { step: 7, title: 'Build Action Plan', description: 'Based on your analysis, create 3 specific things to work on in your next practice. Be concrete and measurable.', tip: 'Write your action items where you will see them before practice.', duration: '10-15 min' },
] as const;

const RESOURCES = [
  { label: 'YouTube Breakdowns', description: 'Search "[sport] film breakdown [position]"' },
  { label: 'League Game Archive', description: 'Official league replay sites and apps' },
  { label: 'Coaching Channels', description: 'BBallBreakdown, Hockey Tutorial, Tifo Football' },
  { label: 'Own Game Footage', description: 'Record your games and review weekly' },
];

export function FilmStudyView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dailyChecked, setDailyChecked] = useState(false);

  const toggleStep = (step: number): void => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  };

  const progress = Math.round((completedSteps.length / FILM_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F3AC}'}</span>
        <h1 className="text-2xl font-bold text-white">Film Study</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>
          {sportConfig.name}
        </span>
      </div>

      <p className="text-neutral-400 text-sm">
        The 7-step film study methodology. Champions study the game as much as they play it.
      </p>

      {/* Progress */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-400">Session Progress</span>
          <span className="text-sm font-medium text-white">{completedSteps.length} / 7 steps</span>
        </div>
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: sportConfig.color }}
          />
        </div>
      </div>

      {/* 7 Steps */}
      <div className="space-y-3">
        {FILM_STEPS.map((step) => {
          const isComplete = completedSteps.includes(step.step);
          return (
            <div
              key={step.step}
              className={cn(
                'bg-neutral-900 border border-neutral-800 rounded-xl transition-all p-5',
                isComplete && 'border-green-500/30 bg-green-500/5'
              )}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStep(step.step)}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all border-2',
                    isComplete
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500'
                  )}
                >
                  {isComplete ? '\u2713' : step.step}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={cn(
                      'font-semibold',
                      isComplete ? 'text-green-400' : 'text-white'
                    )}>
                      {step.title}
                    </h3>
                    <span className="text-xs text-neutral-500">{step.duration}</span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-2">{step.description}</p>
                  <div className="bg-neutral-800/50 rounded-lg p-2 flex items-start gap-2">
                    <span className="text-yellow-400 text-xs mt-0.5">{'\u{1F4A1}'}</span>
                    <span className="text-xs text-neutral-400 italic">{step.tip}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Habit */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDailyChecked(!dailyChecked)}
            className={cn(
              'w-6 h-6 rounded border-2 flex items-center justify-center text-sm transition-all shrink-0',
              dailyChecked
                ? 'bg-[#c8ff00] border-[#c8ff00] text-black'
                : 'border-neutral-600 hover:border-neutral-500'
            )}
          >
            {dailyChecked ? '\u2713' : ''}
          </button>
          <div>
            <h3 className="text-white font-semibold">Daily Film Habit</h3>
            <p className="text-sm text-neutral-400 mt-0.5">
              Watch <span className="text-white font-medium">15 minutes</span> of film every day.
              It compounds. Elite athletes study film as seriously as they train.
            </p>
          </div>
          {dailyChecked && (
            <span className="text-2xl ml-auto">{'\u{1F525}'}</span>
          )}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
        <div className="p-5">
          <h3 className="text-white text-lg font-semibold mb-4">Film Resources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RESOURCES.map((r) => (
              <div
                key={r.label}
                className="p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50 hover:border-neutral-600 transition-all"
              >
                <h4 className="text-sm font-medium text-white">{r.label}</h4>
                <p className="text-xs text-neutral-400 mt-1">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
