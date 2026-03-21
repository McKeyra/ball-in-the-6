'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

function RadarChartWidget({ dimensions, playerScores, goatScores, playerColor = '#c8ff00', goatColor = '#F59E0B' }: { dimensions: Array<{ key: string; label: string; goatScore: number }>; playerScores: Record<string, number>; goatScores: Record<string, number>; playerColor?: string; goatColor?: string }): React.ReactElement {
  const size = 280;
  const center = size / 2;
  const radius = (size / 2) - 30;
  const angleStep = (2 * Math.PI) / dimensions.length;
  const getPoint = (dimIndex: number, value: number) => {
    const angle = angleStep * dimIndex - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };
  const gridLevels = [25, 50, 75, 100];
  const playerPoints = dimensions.map((d, i) => getPoint(i, playerScores[d.key] || 0));
  const goatPoints = dimensions.map((d, i) => getPoint(i, goatScores[d.key] || 0));
  const playerPath = playerPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const goatPath = goatPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {gridLevels.map((level) => {
        const points = dimensions.map((_, i) => getPoint(i, level));
        const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={level} d={d} fill="none" stroke="#334155" strokeWidth="0.5" />;
      })}
      {dimensions.map((_, i) => {
        const end = getPoint(i, 100);
        return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="#334155" strokeWidth="0.5" />;
      })}
      <path d={goatPath} fill={`${goatColor}15`} stroke={goatColor} strokeWidth="1" strokeDasharray="4,4" />
      <path d={playerPath} fill={`${playerColor}20`} stroke={playerColor} strokeWidth="2" />
      {playerPoints.map((p, i) => (<circle key={i} cx={p.x} cy={p.y} r="3" fill={playerColor} />))}
      {dimensions.map((dim, i) => {
        const labelPoint = getPoint(i, 118);
        return <text key={dim.key} x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" className="fill-neutral-500 text-[8px] font-medium">{dim.label}</text>;
      })}
    </svg>
  );
}

export function ScoutingRadarView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [selectedPosition, setSelectedPosition] = useState(sportConfig.positions[0]?.code || '');
  const [scores, setScores] = useState<Record<string, number>>({});
  const position = sportConfig.positions.find((p) => p.code === selectedPosition);
  const dimensions = position?.radarDimensions || [];
  const goatScores = useMemo(() => {
    const map: Record<string, number> = {};
    dimensions.forEach((d) => { map[d.key] = d.goatScore; });
    return map;
  }, [dimensions]);
  const analysis = useMemo(() => {
    if (dimensions.length === 0) return { strengths: [] as Array<{ key: string; label: string; playerScore: number }>, weaknesses: [] as Array<{ key: string; label: string; playerScore: number }>, avgScore: 0 };
    const scored = dimensions.map((d) => ({ ...d, playerScore: scores[d.key] || 0 }));
    const sorted = [...scored].sort((a, b) => b.playerScore - a.playerScore);
    const total = scored.reduce((sum, d) => sum + d.playerScore, 0);
    return { strengths: sorted.slice(0, 3), weaknesses: sorted.slice(-3).reverse(), avgScore: Math.round(total / dimensions.length) };
  }, [dimensions, scores]);

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{String.fromCodePoint(0x1F4E1)}</span>
        <h1 className="text-2xl font-bold text-white">Scouting Radar</h1>
        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sportConfig.positions.map((pos) => (
          <button key={pos.code} onClick={() => { setSelectedPosition(pos.code); setScores({}); }}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all border', selectedPosition === pos.code ? 'text-white border-transparent' : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:border-neutral-500')}
            style={selectedPosition === pos.code ? { backgroundColor: `${pos.color}30`, borderColor: pos.color, color: pos.color } : undefined}>
            {pos.code} - {pos.name}
          </button>
        ))}
      </div>
      {position && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-5">
            <h3 className="text-white text-lg font-semibold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: position.color }} />
              {position.name} Dimensions
            </h3>
            {dimensions.map((dim) => (
              <div key={dim.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-300">{dim.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-white">{scores[dim.key] || 0}</span>
                    <span className="text-xs text-neutral-500">/ {dim.goatScore}</span>
                  </div>
                </div>
                <input type="range" min={0} max={100} step={1} value={scores[dim.key] || 0}
                  onChange={(e) => setScores((prev) => ({ ...prev, [dim.key]: parseInt(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none bg-neutral-700 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c8ff00]" />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
              <h3 className="text-white text-lg font-semibold mb-4">Radar: You vs {position.goat}</h3>
              <RadarChartWidget dimensions={dimensions} playerScores={scores} goatScores={goatScores} playerColor={position.color} goatColor="#F59E0B" />
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="text-white text-lg font-semibold">Analysis</h3>
              <div className="text-center"><div className="text-3xl font-bold text-white">{analysis.avgScore}</div><div className="text-xs text-neutral-400">Average Score</div></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-2">{String.fromCodePoint(0x2B06)} Strengths</h4>
                  {analysis.strengths.map((s) => (<div key={s.key} className="flex items-center justify-between py-1"><span className="text-xs text-neutral-300">{s.label}</span><span className="text-xs font-medium text-green-400">{s.playerScore}</span></div>))}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-2">{String.fromCodePoint(0x2B07)} Weaknesses</h4>
                  {analysis.weaknesses.map((w) => (<div key={w.key} className="flex items-center justify-between py-1"><span className="text-xs text-neutral-300">{w.label}</span><span className="text-xs font-medium text-red-400">{w.playerScore}</span></div>))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
