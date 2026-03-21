'use client';
import { useState } from 'react';
import { useSport } from '@/lib/athlete/sport-context';

const STAGE_KEYS = ['youth', 'school', 'university', 'professional'] as const;

export function BenchmarksView(): React.ReactElement {
  const { sportConfig } = useSport();
  const benchmarks = sportConfig.benchmarks || [];
  const [userScores, setUserScores] = useState<Record<string, string>>({});
  const stages = sportConfig.stages || [];

  const getStageColor = (index: number): string => ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'][index] || '#64748B';

  const getComparison = (bench: (typeof benchmarks)[0], userValue: string) => {
    if (!userValue || isNaN(Number(userValue))) return null;
    const val = Number(userValue);
    const isLowerBetter = bench.unit === 'seconds';
    for (let i = STAGE_KEYS.length - 1; i >= 0; i--) {
      const stageVal = bench[STAGE_KEYS[i]];
      if (isLowerBetter ? val <= stageVal : val >= stageVal) return { stage: STAGE_KEYS[i], color: getStageColor(i) };
    }
    return { stage: 'below youth', color: '#EF4444' };
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{String.fromCodePoint(0x1F4CA)}</span>
        <h1 className="text-2xl font-bold text-white">Benchmarks</h1>
        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>
      <p className="text-neutral-400 text-sm">Physical testing standards by career stage. Input your scores to see where you stand.</p>
      <div className="flex flex-wrap gap-3">{stages.map((stage, i) => (<div key={stage.id} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} /><span className="text-xs text-neutral-400">{stage.label} ({stage.ageRange})</span></div>))}</div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-neutral-700"><th className="text-left py-3 px-4 text-neutral-400 font-medium">Test</th><th className="text-center py-3 px-3 text-neutral-400 font-medium">Unit</th>{stages.map((stage) => (<th key={stage.id} className="text-center py-3 px-3 font-medium" style={{ color: stage.color }}>{stage.label.split(' ')[0]}</th>))}<th className="text-center py-3 px-4 text-neutral-400 font-medium">Your Score</th><th className="text-center py-3 px-3 text-neutral-400 font-medium">Level</th></tr></thead>
          <tbody>{benchmarks.map((bench) => {
            const comparison = getComparison(bench, userScores[bench.name] || '');
            return (
              <tr key={bench.name} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                <td className="py-3 px-4 text-neutral-300 font-medium">{bench.name}</td>
                <td className="py-3 px-3 text-center text-neutral-500">{bench.unit}</td>
                {STAGE_KEYS.map((key) => (<td key={key} className="py-3 px-3 text-center text-neutral-300">{bench[key]}</td>))}
                <td className="py-3 px-4 text-center"><input type="number" value={userScores[bench.name] || ''} onChange={(e) => setUserScores((prev) => ({ ...prev, [bench.name]: e.target.value }))} className="w-20 h-8 text-center bg-neutral-800 border border-neutral-700 text-white rounded mx-auto text-sm" placeholder="\u2014" /></td>
                <td className="py-3 px-3 text-center">{comparison && (<span className="text-xs capitalize px-2 py-0.5 rounded" style={{ backgroundColor: `${comparison.color}20`, color: comparison.color }}>{comparison.stage}</span>)}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
