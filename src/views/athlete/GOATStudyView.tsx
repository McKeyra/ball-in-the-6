'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const GOAT_DEEP_DIVE: Record<string, Record<string, { stats: string; highlights: string[]; studyNotes: string }>> = {
  basketball: {
    PG: { stats: 'Career: 19.5 PPG, 11.2 APG, 7.2 RPG', highlights: ['5x NBA Champion', '3x Finals MVP', '3x MVP', 'All-time triple-double leader at retirement'], studyNotes: "Study Magic's no-look passes, transition vision, and ability to play all 5 positions." },
    SG: { stats: 'Career: 30.1 PPG, 6.2 RPG, 5.3 APG', highlights: ['6x NBA Champion', '6x Finals MVP', '5x MVP', '10x Scoring champion'], studyNotes: "Study MJ's footwork, mid-range mastery, defensive intensity, and killer instinct." },
    SF: { stats: 'Career: 27.1 PPG, 7.5 RPG, 7.4 APG', highlights: ['4x NBA Champion', '4x Finals MVP', '4x MVP', 'All-time scoring leader'], studyNotes: "Study LeBron's court vision from the wing, physical dominance, and playmaking at his size." },
    PF: { stats: 'Career: 19.0 PPG, 10.8 RPG, 3.0 APG', highlights: ['5x NBA Champion', '3x Finals MVP', '2x MVP', '15x All-NBA'], studyNotes: "Study Duncan's bank shot, fundamental footwork, and selfless leadership style." },
    C: { stats: 'Career: 24.6 PPG, 11.2 RPG, 2.6 BPG', highlights: ['6x NBA Champion', '6x MVP', '2x Finals MVP', 'All-time scoring leader for decades'], studyNotes: "Study Kareem's sky hook, longevity habits, and positioning on both ends." },
  },
};

export function GOATStudyView(): React.ReactElement {
  const { sportConfig, activeSport } = useSport();
  const [selectedPosition, setSelectedPosition] = useState(sportConfig.positions[0]?.code || '');
  const position = sportConfig.positions.find((p) => p.code === selectedPosition);
  const deepDive = GOAT_DEEP_DIVE[activeSport]?.[selectedPosition];

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F410}'}</span>
        <h1 className="text-2xl font-bold text-white">GOAT Study</h1>
        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>
      <p className="text-neutral-400 text-sm">Learn from the Greatest Of All Time at every position. Study their game, understand their strengths.</p>
      <div className="flex flex-wrap gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
        {sportConfig.positions.map((pos) => (
          <button key={pos.code} onClick={() => setSelectedPosition(pos.code)}
            className={cn('px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-all', selectedPosition === pos.code ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white')}>
            {pos.code}
          </button>
        ))}
      </div>
      {position && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="h-1" style={{ backgroundColor: position.color }} />
          <div className="p-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shrink-0" style={{ backgroundColor: `${position.color}20`, border: `2px solid ${position.color}40` }}>{position.code}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{position.goat}</h2>
                  <span className="px-2 py-0.5 rounded border border-neutral-600 text-neutral-400 text-xs">{position.goatCountry}</span>
                </div>
                <p className="text-sm mt-1" style={{ color: position.color }}>{position.name} &mdash; {position.archetype}</p>
                {deepDive && (
                  <div className="mt-4 space-y-4">
                    <div><h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Career Stats</h4><p className="text-sm text-neutral-300">{deepDive.stats}</p></div>
                    <div><h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Career Highlights</h4><div className="flex flex-wrap gap-2">{deepDive.highlights.map((h, i) => (<span key={i} className="px-2 py-0.5 rounded border border-neutral-700 text-neutral-300 text-xs">{h}</span>))}</div></div>
                    <div><h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Study Notes</h4><p className="text-sm text-neutral-300 italic leading-relaxed">{deepDive.studyNotes}</p></div>
                  </div>
                )}
                {!deepDive && (
                  <div className="mt-4"><h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Study Notes</h4><p className="text-sm text-neutral-400">Study {position.goat}&apos;s mastery of the {position.name} position. Focus on the key dimensions that made them the GOAT: {position.radarDimensions.slice(0, 3).map((d) => d.label).join(', ')}.</p></div>
                )}
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">GOAT Dimension Scores</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {position.radarDimensions.map((dim) => (
                      <div key={dim.key} className="text-center">
                        <div className="text-xs text-neutral-400">{dim.label}</div>
                        <div className="text-sm font-bold mt-0.5" style={{ color: dim.goatScore >= 95 ? position.color : '#94a3b8' }}>{dim.goatScore}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Film Study Resources</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Full Game Film', 'Highlights Reel', 'Breakdown Analysis', 'Interview / Mindset'].map((link) => (
                      <button key={link} className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-neutral-400 hover:text-white hover:border-neutral-500 transition-all">{'\u{1F3AC}'} {link}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
