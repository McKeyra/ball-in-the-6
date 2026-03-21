'use client';

import { useState, useMemo, useRef } from 'react';
import { useSport } from '@/lib/athlete/sport-context';

function RadarChartWidget({ dimensions, playerScores, goatScores, playerColor }: {
  dimensions: Array<{ key: string; label: string; goatScore: number }>;
  playerScores: Record<string, number>;
  goatScores: Record<string, number>;
  playerColor: string;
}): React.ReactElement {
  const size = 220;
  const center = size / 2;
  const radius = (size / 2) - 30;
  const angleStep = (2 * Math.PI) / dimensions.length;

  const getPoint = (i: number, value: number): { x: number; y: number } => {
    const angle = angleStep * i - Math.PI / 2;
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
        const pts = dimensions.map((_, i) => getPoint(i, level));
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={level} d={d} fill="none" stroke="#404040" strokeWidth="0.5" />;
      })}
      {dimensions.map((_, i) => {
        const end = getPoint(i, 100);
        return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="#404040" strokeWidth="0.5" />;
      })}
      <path d={goatPath} fill="rgba(200, 255, 0, 0.08)" stroke="#c8ff00" strokeWidth="1" strokeDasharray="3,3" />
      <path d={playerPath} fill={`${playerColor}25`} stroke={playerColor} strokeWidth="1.5" />
      {playerPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={playerColor} />)}
      {dimensions.map((d, i) => {
        const lp = getPoint(i, 118);
        return <text key={d.key} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" className="fill-neutral-500 text-[7px] font-medium">{d.label}</text>;
      })}
    </svg>
  );
}

export function ExportProfileView(): React.ReactElement {
  const { sportConfig, activeSport } = useSport();
  const printRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState({
    name: '', position: sportConfig.positions[0]?.code || '', age: '', height: '', weight: '', team: '', persona: '', overallRating: '',
  });
  const [scores, setScores] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const position = sportConfig.positions.find((p) => p.code === profile.position);
  const dimensions = position?.radarDimensions || [];
  const goatScores = useMemo(() => {
    const map: Record<string, number> = {};
    dimensions.forEach((d) => { map[d.key] = d.goatScore; });
    return map;
  }, [dimensions]);

  const updateProfile = (key: string, value: string): void => { setProfile((prev) => ({ ...prev, [key]: value })); };
  const updateScore = (key: string, value: string): void => { setScores((prev) => ({ ...prev, [key]: parseInt(value) || 0 })); };

  const avgScore = useMemo(() => {
    const vals = Object.values(scores).filter((v) => v > 0);
    return vals.length === 0 ? 0 : Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [scores]);

  const exportJson = (): void => {
    const data = { profile, sport: activeSport, sportName: sportConfig.name, position: position ? { code: position.code, name: position.name, archetype: position.archetype } : null, scores, averageScore: avgScore, exported_at: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `scouting-profile-${profile.name || 'athlete'}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = (): void => { window.print(); };

  const shareLink = async (): Promise<void> => {
    const data = btoa(JSON.stringify({ ...profile, scores, sport: activeSport }));
    const url = `${window.location.origin}/athlete/export-profile?data=${data}`;
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* silent */ }
  };

  const inputClass = "w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500";

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3 print:hidden">
        <span className="text-2xl">{'\u{1F4E4}'}</span>
        <h1 className="text-2xl font-bold text-white">Export Profile</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 print:hidden space-y-3">
          <h3 className="text-white text-lg font-semibold">Profile Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-neutral-400 block mb-1">Name</label><input value={profile.name} onChange={(e) => updateProfile('name', e.target.value)} className={inputClass} /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Position</label><select value={profile.position} onChange={(e) => updateProfile('position', e.target.value)} className={inputClass}>{sportConfig.positions.map((p) => <option key={p.code} value={p.code}>{p.code} - {p.name}</option>)}</select></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Age</label><input value={profile.age} onChange={(e) => updateProfile('age', e.target.value)} className={inputClass} /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Team</label><input value={profile.team} onChange={(e) => updateProfile('team', e.target.value)} className={inputClass} /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Height</label><input value={profile.height} onChange={(e) => updateProfile('height', e.target.value)} className={inputClass} placeholder={`6'2"`} /></div>
            <div><label className="text-xs text-neutral-400 block mb-1">Weight</label><input value={profile.weight} onChange={(e) => updateProfile('weight', e.target.value)} className={inputClass} placeholder="185 lbs" /></div>
          </div>
          <div><label className="text-xs text-neutral-400 block mb-1">Persona / Archetype</label><input value={profile.persona} onChange={(e) => updateProfile('persona', e.target.value)} className={inputClass} placeholder="The Floor General" /></div>
          <div className="pt-4 border-t border-neutral-800">
            <h4 className="text-sm font-medium text-neutral-300 mb-3">Dimension Scores</h4>
            <div className="grid grid-cols-2 gap-2">
              {dimensions.map((d) => (
                <div key={d.key} className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 w-24 truncate">{d.label}</span>
                  <input type="number" min="0" max="100" value={scores[d.key] || ''} onChange={(e) => updateScore(d.key, e.target.value)} className="bg-neutral-800 border border-neutral-700 text-white w-16 h-8 text-center text-sm rounded-lg focus:outline-none focus:border-neutral-500" placeholder="—" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={printRef} className="space-y-4">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl overflow-hidden print:border-gray-300">
            <div className="h-2" style={{ backgroundColor: position?.color || sportConfig.color }} />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: `${(position?.color || sportConfig.color)}20`, border: `2px solid ${position?.color || sportConfig.color}` }}>{profile.position}</div>
                <div>
                  <h2 className="text-xl font-bold text-white">{profile.name || 'Athlete Name'}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
                    <span className="text-sm text-neutral-400">{position?.name} &bull; {position?.archetype}</span>
                  </div>
                </div>
                <div className="ml-auto text-center">
                  <div className="text-3xl font-bold" style={{ color: position?.color }}>{avgScore}</div>
                  <div className="text-xs text-neutral-500">OVR</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[{ label: 'Age', value: profile.age || '-' }, { label: 'Height', value: profile.height || '-' }, { label: 'Weight', value: profile.weight || '-' }, { label: 'Team', value: profile.team || '-' }].map((item) => (
                  <div key={item.label} className="text-center p-2 bg-neutral-800/50 rounded-lg">
                    <div className="text-xs text-neutral-500">{item.label}</div>
                    <div className="text-sm font-medium text-white">{item.value}</div>
                  </div>
                ))}
              </div>
              <RadarChartWidget dimensions={dimensions} playerScores={scores} goatScores={goatScores} playerColor={position?.color || sportConfig.color} />
              {profile.persona && <div className="mt-4 text-center"><span className="text-sm px-3 py-1 rounded" style={{ backgroundColor: `${(position?.color || sportConfig.color)}20`, color: position?.color || sportConfig.color }}>{profile.persona}</span></div>}
              <div className="grid grid-cols-5 gap-2 mt-4">
                {dimensions.map((d) => <div key={d.key} className="text-center"><div className="text-xs text-neutral-500">{d.label}</div><div className="text-sm font-bold text-white">{scores[d.key] || '-'}</div></div>)}
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-700 flex items-center justify-between text-xs text-neutral-500">
                <span>Ball in the 6 &bull; Winners Win Journal</span>
                <span>{new Date().toLocaleDateString('en-CA')}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 print:hidden">
            <button onClick={exportJson} className="flex-1 px-4 py-2 rounded-lg bg-[#c8ff00] text-black text-sm font-medium hover:bg-[#b8ef00] transition-colors">Export JSON</button>
            <button onClick={handlePrint} className="flex-1 px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors">Print Card</button>
            <button onClick={shareLink} className="flex-1 px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors">{copied ? '\u2713 Copied!' : 'Copy Share Link'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
