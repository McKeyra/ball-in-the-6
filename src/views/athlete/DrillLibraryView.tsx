'use client';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const PROGRESSION_STEPS: Record<number, string[]> = {
  1: ['Learn the basic movement', 'Practice at walking speed'],
  2: ['Add tempo to the drill', 'Do 3 sets of 10 reps', 'Film yourself for form check'],
  3: ['Increase speed to game-pace', 'Add a defender or obstacle', 'Combine with a secondary skill'],
  4: ['Execute under fatigue', 'Add decision-making element', 'Perform in scrimmage context', 'Track completion rate'],
  5: ['Master at game speed with live defense', 'Teach the drill to a teammate', 'Perform under pressure in competition'],
};

export function DrillLibraryView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [filterPosition, setFilterPosition] = useState('ALL');
  const [expandedDrill, setExpandedDrill] = useState<number | null>(null);
  const drills = sportConfig.drills || [];
  const positionOptions = useMemo(() => {
    const codes = new Set(drills.map((d) => d.position));
    codes.add('ALL');
    return ['ALL', ...sportConfig.positions.map((p) => p.code)].filter((code) => code === 'ALL' || codes.has(code) || codes.has('ALL'));
  }, [drills, sportConfig.positions]);
  const filteredDrills = useMemo(() => filterPosition === 'ALL' ? drills : drills.filter((d) => d.position === filterPosition || d.position === 'ALL'), [drills, filterPosition]);
  const renderStars = (difficulty: number) => Array.from({ length: 5 }, (_, i) => (<span key={i} className={i < difficulty ? 'text-yellow-400' : 'text-neutral-700'}>{String.fromCodePoint(0x2605)}</span>));

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{String.fromCodePoint(0x1F4CB)}</span>
        <h1 className="text-2xl font-bold text-white">Drill Library</h1>
        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>
      <p className="text-neutral-400 text-sm">Position-specific drills to sharpen your game. Click a drill for progression steps.</p>
      <div className="flex flex-wrap gap-2">
        {positionOptions.map((code) => (
          <button key={code} onClick={() => setFilterPosition(code)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border', filterPosition === code ? 'bg-neutral-700 text-white border-neutral-600' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600')}>
            {code}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrills.map((drill, idx) => {
          const isExpanded = expandedDrill === idx;
          const posConfig = sportConfig.positions.find((p) => p.code === drill.position);
          const color = posConfig?.color || sportConfig.color;
          return (
            <div key={idx} className={cn('bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer transition-all', isExpanded && 'sm:col-span-2 lg:col-span-3 border-neutral-600')} onClick={() => setExpandedDrill(isExpanded ? null : idx)}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-white">{drill.name}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${color}20`, color }}>{drill.position}</span>
                </div>
                <div className="flex items-center gap-1 mb-2"><span className="text-xs text-neutral-500 mr-1">Difficulty:</span>{renderStars(drill.difficulty)}</div>
                <p className="text-sm text-neutral-400">{drill.description}</p>
                {drill.equipment && drill.equipment.length > 0 && (<div className="flex flex-wrap gap-1 mt-3">{drill.equipment.map((eq) => (<span key={eq} className="px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-400 border border-neutral-700">{eq}</span>))}</div>)}
                {(!drill.equipment || drill.equipment.length === 0) && (<div className="mt-3 text-xs text-neutral-500 italic">No equipment needed</div>)}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-neutral-800">
                    <h4 className="text-sm font-semibold text-neutral-300 mb-3">Progression Steps (Level {drill.difficulty})</h4>
                    <div className="space-y-2">
                      {(PROGRESSION_STEPS[drill.difficulty] || PROGRESSION_STEPS[3]).map((step, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-neutral-800/50">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ backgroundColor: `${color}20`, color }}>{i + 1}</span>
                          <span className="text-sm text-neutral-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {filteredDrills.length === 0 && (<div className="text-center py-12 text-neutral-500">No drills found for this position filter.</div>)}
    </div>
  );
}
