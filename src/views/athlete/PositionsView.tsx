'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

export function PositionsView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [expandedPosition, setExpandedPosition] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{sportConfig.emoji}</span>
        <h1 className="text-2xl font-bold text-white">Positions</h1>
        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>
      <p className="text-neutral-400 text-sm">Explore every position in {sportConfig.name}. Click a position to see its 10 scouting dimensions.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sportConfig.positions.map((pos) => {
          const isExpanded = expandedPosition === pos.code;
          return (
            <div
              key={pos.code}
              className={cn('bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer transition-all duration-300', isExpanded && 'border-neutral-600 sm:col-span-2 lg:col-span-3')}
              onClick={() => setExpandedPosition(isExpanded ? null : pos.code)}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0" style={{ backgroundColor: `${pos.color}25`, border: `2px solid ${pos.color}` }}>
                    {pos.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white">{pos.name}</h3>
                    <p className="text-sm mt-0.5" style={{ color: pos.color }}>{pos.archetype}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-neutral-500">GOAT:</span>
                      <span className="text-sm text-neutral-300 font-medium">{pos.goat}</span>
                      <span className="text-xs text-neutral-500">({pos.goatCountry})</span>
                    </div>
                  </div>
                  <span className={cn('text-neutral-500 transition-transform text-lg', isExpanded && 'rotate-180')}>{String.fromCharCode(0x25BC)}</span>
                </div>
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-neutral-800">
                    <h4 className="text-sm font-semibold text-neutral-300 mb-3">10 Scouting Dimensions</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {pos.radarDimensions.map((dim) => (
                        <div key={dim.key} className="bg-neutral-800/60 rounded-lg p-3 text-center border border-neutral-700/50">
                          <div className="text-sm font-medium text-white">{dim.label}</div>
                          <div className="mt-2">
                            <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${dim.goatScore}%`, backgroundColor: pos.color }} />
                            </div>
                            <div className="text-xs text-neutral-400 mt-1">GOAT: {dim.goatScore}</div>
                          </div>
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
    </div>
  );
}
