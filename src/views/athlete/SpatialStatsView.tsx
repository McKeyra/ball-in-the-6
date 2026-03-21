'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

interface Zone {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

interface CourtConfig {
  width: number;
  height: number;
  label: string;
  zones: Zone[];
  lines: (w: number, h: number) => React.ReactElement;
}

const COURT_CONFIGS: Record<string, CourtConfig> = {
  court: {
    width: 500,
    height: 470,
    label: 'Basketball Court',
    zones: [
      { name: 'Paint', x: 180, y: 330, w: 140, h: 140, color: '#EF444440' },
      { name: 'Mid-Range Left', x: 50, y: 250, w: 130, h: 120, color: '#3B82F640' },
      { name: 'Mid-Range Right', x: 320, y: 250, w: 130, h: 120, color: '#3B82F640' },
      { name: 'Three-Point Left', x: 20, y: 100, w: 140, h: 150, color: '#10B98140' },
      { name: 'Three-Point Right', x: 340, y: 100, w: 140, h: 150, color: '#10B98140' },
      { name: 'Three-Point Top', x: 160, y: 50, w: 180, h: 120, color: '#10B98140' },
      { name: 'Free Throw', x: 200, y: 280, w: 100, h: 50, color: '#F59E0B40' },
    ],
    lines: (w: number, h: number) => (
      <>
        <rect x="0" y="0" width={w} height={h} fill="none" stroke="#404040" strokeWidth="2" rx="4" />
        <circle cx={w / 2} cy={h - 10} r="60" fill="none" stroke="#404040" strokeWidth="1.5" />
        <rect x={w / 2 - 80} y={h - 190} width="160" height="190" fill="none" stroke="#404040" strokeWidth="1.5" />
        <line x1="0" y1={h * 0.45} x2={w} y2={h * 0.45} stroke="#404040" strokeWidth="0.5" strokeDasharray="4,4" />
        <path d={`M 30,${h} Q ${w / 2},${h * 0.25} ${w - 30},${h}`} fill="none" stroke="#404040" strokeWidth="1.5" />
      </>
    ),
  },
  rink: {
    width: 500,
    height: 250,
    label: 'Hockey Rink',
    zones: [
      { name: 'Offensive Zone', x: 340, y: 20, w: 140, h: 210, color: '#EF444440' },
      { name: 'Neutral Zone', x: 175, y: 20, w: 150, h: 210, color: '#3B82F640' },
      { name: 'Defensive Zone', x: 20, y: 20, w: 140, h: 210, color: '#10B98140' },
      { name: 'Crease (Off)', x: 430, y: 95, w: 40, h: 60, color: '#F59E0B40' },
      { name: 'Crease (Def)', x: 30, y: 95, w: 40, h: 60, color: '#F59E0B40' },
    ],
    lines: (w: number, h: number) => (
      <>
        <rect x="0" y="0" width={w} height={h} fill="none" stroke="#404040" strokeWidth="2" rx="20" />
        <line x1={w * 0.33} y1="0" x2={w * 0.33} y2={h} stroke="#3B82F6" strokeWidth="1.5" opacity="0.5" />
        <line x1={w * 0.67} y1="0" x2={w * 0.67} y2={h} stroke="#3B82F6" strokeWidth="1.5" opacity="0.5" />
        <line x1={w * 0.5} y1="0" x2={w * 0.5} y2={h} stroke="#EF4444" strokeWidth="2" opacity="0.5" />
        <circle cx={w * 0.5} cy={h * 0.5} r="25" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.4" />
      </>
    ),
  },
  field: {
    width: 500,
    height: 340,
    label: 'Soccer Field',
    zones: [
      { name: 'Penalty Area', x: 370, y: 80, w: 110, h: 180, color: '#EF444440' },
      { name: 'Midfield', x: 190, y: 20, w: 120, h: 300, color: '#3B82F640' },
      { name: 'Defensive Third', x: 20, y: 20, w: 170, h: 300, color: '#10B98140' },
      { name: 'Attacking Third', x: 310, y: 20, w: 170, h: 300, color: '#F59E0B40' },
    ],
    lines: (w: number, h: number) => (
      <>
        <rect x="0" y="0" width={w} height={h} fill="none" stroke="#404040" strokeWidth="2" />
        <line x1={w / 2} y1="0" x2={w / 2} y2={h} stroke="#404040" strokeWidth="1.5" />
        <circle cx={w / 2} cy={h / 2} r="40" fill="none" stroke="#404040" strokeWidth="1.5" />
        <rect x={w - 80} y={h / 2 - 60} width="80" height="120" fill="none" stroke="#404040" strokeWidth="1.5" />
        <rect x="0" y={h / 2 - 60} width="80" height="120" fill="none" stroke="#404040" strokeWidth="1.5" />
      </>
    ),
  },
};

const MARKER_TYPES = [
  { value: 'made', label: 'Made', color: '#10B981' },
  { value: 'missed', label: 'Missed', color: '#EF4444' },
  { value: 'assist', label: 'Assist', color: '#3B82F6' },
] as const;

interface Marker {
  x: number;
  y: number;
  type: string;
  id: number;
}

export function SpatialStatsView(): React.ReactElement {
  const { sportConfig } = useSport();
  const svgRef = useRef<SVGSVGElement>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [markerType, setMarkerType] = useState('made');

  const courtType = (sportConfig as unknown as Record<string, unknown>).courtType as string || 'court';
  const config = COURT_CONFIGS[courtType] || COURT_CONFIGS.court;

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = config.width / rect.width;
    const scaleY = config.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setMarkers((prev) => [...prev, { x, y, type: markerType, id: Date.now() }]);
  }, [markerType, config]);

  const clearMarkers = (): void => setMarkers([]);

  const zoneSummary = useMemo(() => {
    const summary: Record<string, { total: number; made: number; missed: number; pct: number }> = {};
    config.zones.forEach((zone) => {
      const inZone = markers.filter(
        (m) => m.x >= zone.x && m.x <= zone.x + zone.w && m.y >= zone.y && m.y <= zone.y + zone.h
      );
      const made = inZone.filter((m) => m.type === 'made').length;
      const missed = inZone.filter((m) => m.type === 'missed').length;
      const total = made + missed;
      summary[zone.name] = {
        total: inZone.length,
        made,
        missed,
        pct: total > 0 ? Math.round((made / total) * 100) : 0,
      };
    });
    return summary;
  }, [markers, config.zones]);

  const totalStats = useMemo(() => {
    const made = markers.filter((m) => m.type === 'made').length;
    const missed = markers.filter((m) => m.type === 'missed').length;
    const assists = markers.filter((m) => m.type === 'assist').length;
    const total = made + missed;
    return {
      made,
      missed,
      assists,
      total: markers.length,
      pct: total > 0 ? Math.round((made / total) * 100) : 0,
    };
  }, [markers]);

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F5FA}\u{FE0F}'}</span>
        <h1 className="text-2xl font-bold text-white">Spatial Stats</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>
          {sportConfig.name}
        </span>
      </div>

      <p className="text-neutral-400 text-sm">
        Click on the {config.label.toLowerCase()} to place markers. Track where your shots/plays happen.
      </p>

      {/* Marker type selector */}
      <div className="flex items-center gap-3">
        {MARKER_TYPES.map((mt) => (
          <button
            key={mt.value}
            onClick={() => setMarkerType(mt.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
              markerType === mt.value
                ? 'border-transparent text-white'
                : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:border-neutral-500'
            )}
            style={markerType === mt.value
              ? { backgroundColor: `${mt.color}30`, borderColor: mt.color, color: mt.color }
              : undefined
            }
          >
            {mt.label}
          </button>
        ))}
        <button
          onClick={clearMarkers}
          className="ml-auto px-3 py-2 rounded-lg text-sm text-neutral-400 border border-neutral-700 hover:border-neutral-500 transition-all"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Court/Field/Rink */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${config.width} ${config.height}`}
              className="w-full h-auto cursor-crosshair"
              onClick={handleClick}
            >
              <rect width={config.width} height={config.height} fill="#0a0a0a" rx="4" />
              {config.zones.map((zone) => (
                <rect
                  key={zone.name}
                  x={zone.x}
                  y={zone.y}
                  width={zone.w}
                  height={zone.h}
                  fill={zone.color}
                  rx="4"
                />
              ))}
              {config.lines(config.width, config.height)}
              {markers.map((m) => {
                const mt = MARKER_TYPES.find((t) => t.value === m.type);
                return (
                  <g key={m.id}>
                    <circle cx={m.x} cy={m.y} r="6" fill={mt?.color || '#fff'} opacity="0.8" />
                    <circle cx={m.x} cy={m.y} r="3" fill="#fff" opacity="0.9" />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Made', value: totalStats.made, color: '#10B981' },
                { label: 'Missed', value: totalStats.missed, color: '#EF4444' },
                { label: 'Assists', value: totalStats.assists, color: '#3B82F6' },
                { label: 'FG%', value: `${totalStats.pct}%`, color: sportConfig.color },
              ].map((s) => (
                <div key={s.label} className="bg-neutral-800/50 rounded-lg p-2 text-center border border-neutral-700/50">
                  <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-neutral-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Zone Breakdown</h3>
            <div className="space-y-2">
              {config.zones.map((zone) => {
                const data = zoneSummary[zone.name] || { total: 0, made: 0, missed: 0, pct: 0 };
                if (data.total === 0) return null;
                return (
                  <div key={zone.name} className="flex items-center justify-between py-1 border-b border-neutral-800">
                    <span className="text-xs text-neutral-400">{zone.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-green-400">{data.made}M</span>
                      <span className="text-xs text-red-400">{data.missed}X</span>
                      <span className="text-xs font-medium text-white">{data.pct}%</span>
                    </div>
                  </div>
                );
              })}
              {markers.length === 0 && (
                <p className="text-xs text-neutral-500 italic text-center py-4">
                  Click on the {config.label.toLowerCase()} to add markers
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
