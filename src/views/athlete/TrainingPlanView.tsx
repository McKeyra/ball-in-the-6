'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const OFF_SEASON_PROGRAM = {
  title: 'Off-Season Development (3 Days/Week)', weeks: '8-12 weeks',
  days: [
    { name: 'Day 1 \u2014 Strength & Power', exercises: [{ name: 'Barbell Squat', sets: 4, reps: '6-8', rest: '120s' }, { name: 'Bench Press', sets: 4, reps: '6-8', rest: '120s' }, { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: '90s' }, { name: 'Pull-Ups', sets: 3, reps: '8-12', rest: '90s' }, { name: 'Box Jumps', sets: 3, reps: '5', rest: '120s' }, { name: 'Plank Hold', sets: 3, reps: '45s', rest: '60s' }] },
    { name: 'Day 2 \u2014 Speed & Agility', exercises: [{ name: '10m Sprint Starts', sets: 6, reps: '1', rest: '90s' }, { name: 'Lateral Shuttle', sets: 4, reps: '4 each', rest: '60s' }, { name: 'T-Drill', sets: 4, reps: '1', rest: '90s' }, { name: '5-10-5 Drill', sets: 4, reps: '1', rest: '90s' }, { name: 'Sport-Specific Skill Work', sets: 1, reps: '20 min', rest: '-' }, { name: 'Core Circuit', sets: 3, reps: '10 each', rest: '30s' }] },
    { name: 'Day 3 \u2014 Hypertrophy & Conditioning', exercises: [{ name: 'Goblet Squat', sets: 3, reps: '12-15', rest: '60s' }, { name: 'DB Shoulder Press', sets: 3, reps: '10-12', rest: '60s' }, { name: 'Single-Leg RDL', sets: 3, reps: '10 each', rest: '60s' }, { name: 'Bent-Over Row', sets: 3, reps: '10-12', rest: '60s' }, { name: 'Walking Lunges', sets: 3, reps: '12 each', rest: '60s' }, { name: 'Conditioning Intervals', sets: 6, reps: '30s on / 30s off', rest: '-' }] },
  ],
};

const IN_SEASON_PROGRAM = {
  title: 'In-Season Maintenance (2 Days/Week)', weeks: 'Season-long',
  days: [
    { name: 'Day 1 \u2014 Full Body Strength (48h+ before game)', exercises: [{ name: 'Trap Bar Deadlift', sets: 3, reps: '5', rest: '120s' }, { name: 'DB Bench Press', sets: 3, reps: '8', rest: '90s' }, { name: 'Single-Arm DB Row', sets: 3, reps: '8 each', rest: '60s' }, { name: 'Split Squat', sets: 2, reps: '8 each', rest: '60s' }, { name: 'Anti-Rotation Press', sets: 2, reps: '10 each', rest: '60s' }] },
    { name: 'Day 2 \u2014 Movement & Recovery', exercises: [{ name: 'Foam Rolling', sets: 1, reps: '10 min', rest: '-' }, { name: 'Band Pull-Aparts', sets: 3, reps: '15', rest: '30s' }, { name: 'Bodyweight Squats', sets: 2, reps: '15', rest: '30s' }, { name: 'Hip Mobility Circuit', sets: 2, reps: '8 each', rest: '30s' }, { name: 'Light Conditioning', sets: 1, reps: '15 min', rest: '-' }] },
  ],
};

type ExerciseDay = { name: string; exercises: Array<{ name: string; sets: number; reps: string; rest: string }> };

export function TrainingPlanView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [selectedStage, setSelectedStage] = useState(sportConfig.stages[0]?.id || 'youth');
  const [programTab, setProgramTab] = useState<'offseason' | 'inseason'>('offseason');
  const stage = sportConfig.stages.find((s) => s.id === selectedStage);
  const program = programTab === 'offseason' ? OFF_SEASON_PROGRAM : IN_SEASON_PROGRAM;

  const renderTable = (day: ExerciseDay) => (
    <div key={day.name} className="mb-6">
      <h4 className="text-sm font-semibold text-white mb-3">{day.name}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-neutral-700"><th className="text-left py-2 px-3 text-neutral-400 font-medium">Exercise</th><th className="text-center py-2 px-3 text-neutral-400 font-medium">Sets</th><th className="text-center py-2 px-3 text-neutral-400 font-medium">Reps</th><th className="text-center py-2 px-3 text-neutral-400 font-medium">Rest</th></tr></thead>
          <tbody>{day.exercises.map((ex, i) => (<tr key={i} className="border-b border-neutral-800 hover:bg-neutral-800/50"><td className="py-2 px-3 text-neutral-300">{ex.name}</td><td className="py-2 px-3 text-center text-neutral-300">{ex.sets}</td><td className="py-2 px-3 text-center text-neutral-300">{ex.reps}</td><td className="py-2 px-3 text-center text-neutral-500">{ex.rest}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{String.fromCodePoint(0x1F4AA)}</span>
        <h1 className="text-2xl font-bold text-white">Training Plan</h1>
        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>
      <p className="text-neutral-400 text-sm">Periodized training programs adapted for your career stage.</p>
      <div className="flex flex-wrap gap-2">
        {sportConfig.stages.map((s) => (
          <button key={s.id} onClick={() => setSelectedStage(s.id)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all border', selectedStage === s.id ? 'text-white border-transparent' : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:border-neutral-500')}
            style={selectedStage === s.id ? { backgroundColor: `${s.color}30`, borderColor: s.color, color: s.color } : undefined}>
            {s.label} ({s.ageRange})
          </button>
        ))}
      </div>
      {stage && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} /><h3 className="text-lg font-semibold text-white">{stage.label}</h3><span className="px-2 py-0.5 rounded border border-neutral-600 text-neutral-400 text-xs">Ages {stage.ageRange}</span></div>
          <p className="text-sm text-neutral-400 italic mb-3">{stage.philosophy}</p>
          <div className="flex flex-wrap gap-2">{stage.keyFocus.map((focus) => (<span key={focus} className="px-2 py-0.5 rounded border border-neutral-700 text-neutral-300 text-xs">{focus}</span>))}</div>
        </div>
      )}
      <div className="flex gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-lg w-fit">
        <button onClick={() => setProgramTab('offseason')} className={cn('px-3 py-1.5 rounded text-sm font-medium transition-all', programTab === 'offseason' ? 'bg-neutral-700 text-white' : 'text-neutral-400')}>Off-Season</button>
        <button onClick={() => setProgramTab('inseason')} className={cn('px-3 py-1.5 rounded text-sm font-medium transition-all', programTab === 'inseason' ? 'bg-neutral-700 text-white' : 'text-neutral-400')}>In-Season</button>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <h3 className="text-white text-lg font-semibold mb-1">{program.title}</h3>
        <p className="text-xs text-neutral-500 mb-4">Duration: {program.weeks}</p>
        {program.days.map(renderTable)}
      </div>
    </div>
  );
}
