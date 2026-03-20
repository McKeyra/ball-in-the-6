'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { COURT_CONFIG, getHeatColor } from '@/lib/court/zones';
import { LEAGUE_AVERAGES } from '@/types/court';
import type { ShotData, CourtZone } from '@/types/court';

interface InteractiveCourtSVGProps {
  shots: ShotData[];
  selectedZoneId: string | null;
  onZoneSelect: (zoneId: string | null) => void;
  className?: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  zone: CourtZone | null;
  shot: ShotData | null;
}

const EMPTY_TOOLTIP: TooltipState = {
  visible: false,
  x: 0,
  y: 0,
  zone: null,
  shot: null,
};

export const InteractiveCourtSVG: React.FC<InteractiveCourtSVGProps> = ({
  shots,
  selectedZoneId,
  onZoneSelect,
  className,
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>(EMPTY_TOOLTIP);
  const { width, height, zones } = COURT_CONFIG;

  const getShotForZone = useCallback(
    (zoneId: string): ShotData | undefined =>
      shots.find((s) => s.zoneId === zoneId),
    [shots]
  );

  const handleZoneClick = useCallback(
    (zoneId: string): void => {
      onZoneSelect(selectedZoneId === zoneId ? null : zoneId);
    },
    [selectedZoneId, onZoneSelect]
  );

  const handleZoneHover = useCallback(
    (zone: CourtZone, event: React.MouseEvent<SVGPathElement>): void => {
      const svg = event.currentTarget.closest('svg');
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const scaleX = rect.width / width;
      const scaleY = rect.height / height;

      setTooltip({
        visible: true,
        x: zone.center.x * scaleX,
        y: zone.center.y * scaleY - 40,
        zone,
        shot: getShotForZone(zone.id) ?? null,
      });
    },
    [width, height, getShotForZone]
  );

  const handleZoneLeave = useCallback((): void => {
    setTooltip(EMPTY_TOOLTIP);
  }, []);

  return (
    <div className={cn('relative w-full', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ maxHeight: '520px' }}
      >
        {/* Court background */}
        <rect x="0" y="0" width={width} height={height} fill="#fafafa" rx="4" />

        {/* Court boundary */}
        <rect
          x="40"
          y="0"
          width="320"
          height="380"
          fill="none"
          stroke="#d4d4d4"
          strokeWidth="1.5"
        />

        {/* Half-court line */}
        <line x1="40" y1="0" x2="360" y2="0" stroke="#d4d4d4" strokeWidth="1.5" />

        {/* Center circle (half visible at top) */}
        <path
          d="M 140 0 A 60 60 0 0 1 260 0"
          fill="none"
          stroke="#d4d4d4"
          strokeWidth="1"
        />

        {/* Key / lane */}
        <rect
          x="150"
          y="226"
          width="100"
          height="154"
          fill="none"
          stroke="#d4d4d4"
          strokeWidth="1"
        />

        {/* Free throw circle */}
        <circle
          cx="200"
          cy="226"
          r="50"
          fill="none"
          stroke="#d4d4d4"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d="M 150 226 A 50 50 0 0 1 250 226"
          fill="none"
          stroke="#d4d4d4"
          strokeWidth="1"
        />

        {/* 3-point line */}
        <path
          d={`M 40 290 L 74 290 Q 74 190 200 160 Q 326 190 326 290 L 360 290`}
          fill="none"
          stroke="#d4d4d4"
          strokeWidth="1.5"
        />

        {/* Corner 3 lines (vertical portions along sideline) */}
        <line x1="74" y1="290" x2="74" y2="380" stroke="#d4d4d4" strokeWidth="1" />
        <line x1="326" y1="290" x2="326" y2="380" stroke="#d4d4d4" strokeWidth="1" />

        {/* Restricted area arc */}
        <path
          d={`M 174 346 A 26 26 0 0 1 226 346`}
          fill="none"
          stroke="#d4d4d4"
          strokeWidth="1"
        />
        <line x1="174" y1="346" x2="174" y2="380" stroke="#d4d4d4" strokeWidth="1" />
        <line x1="226" y1="346" x2="226" y2="380" stroke="#d4d4d4" strokeWidth="1" />

        {/* Backboard */}
        <line x1="185" y1="355" x2="215" y2="355" stroke="#a3a3a3" strokeWidth="2" />

        {/* Rim */}
        <circle cx="200" cy="346" r="5" fill="none" stroke="#a3a3a3" strokeWidth="1.5" />

        {/* Net indicator */}
        <circle cx="200" cy="346" r="2" fill="#d4d4d4" />

        {/* Lane markers (hash marks) */}
        {[266, 302, 338].map((y) => (
          <g key={y}>
            <line x1="142" y1={y} x2="150" y2={y} stroke="#d4d4d4" strokeWidth="1" />
            <line x1="250" y1={y} x2="258" y2={y} stroke="#d4d4d4" strokeWidth="1" />
          </g>
        ))}

        {/* Clickable zone overlays */}
        {zones.map((zone) => {
          const shot = getShotForZone(zone.id);
          const pct = shot?.percentage ?? 0;
          const leagueAvg = LEAGUE_AVERAGES[zone.id] ?? 40;
          const isSelected = selectedZoneId === zone.id;
          const fillColor = getHeatColor(pct, leagueAvg);

          return (
            <g key={zone.id}>
              <path
                d={zone.path}
                fill={fillColor}
                stroke={isSelected ? '#C8FF00' : 'transparent'}
                strokeWidth={isSelected ? 2.5 : 0}
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: isSelected
                    ? 'drop-shadow(0 0 8px rgba(200, 255, 0, 0.6))'
                    : 'none',
                }}
                onClick={() => handleZoneClick(zone.id)}
                onMouseEnter={(e) => handleZoneHover(zone, e)}
                onMouseLeave={handleZoneLeave}
              />
              {/* Zone percentage label */}
              {shot && shot.attempts > 0 && (
                <text
                  x={zone.center.x}
                  y={zone.center.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none select-none"
                  fill={isSelected ? '#000' : '#525252'}
                  fontSize="11"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                >
                  {pct.toFixed(1)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip overlay */}
      <AnimatePresence>
        {tooltip.visible && tooltip.zone && tooltip.shot && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute pointer-events-none z-50"
            style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
          >
            <div className="rounded-xl bg-neutral-900 px-3 py-2 shadow-xl border border-neutral-700">
              <p className="text-[10px] font-bold text-[#C8FF00] uppercase tracking-wider">
                {tooltip.zone.name}
              </p>
              <p className="text-xs font-mono text-white mt-0.5">
                {tooltip.shot.makes}/{tooltip.shot.attempts}{' '}
                <span className="text-neutral-400">
                  ({tooltip.shot.percentage.toFixed(1)}%)
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heat map legend */}
      <div className="flex items-center justify-center gap-1.5 mt-3 px-4">
        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mr-1">Cold</span>
        <div className="w-4 h-2 rounded-full bg-red-400/50" />
        <div className="w-4 h-2 rounded-full bg-orange-400/45" />
        <div className="w-4 h-2 rounded-full bg-yellow-400/40" />
        <div className="w-4 h-2 rounded-full bg-lime-400/35" />
        <div className="w-4 h-2 rounded-full bg-green-400/45" />
        <div className="w-4 h-2 rounded-full bg-green-500/55" />
        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider ml-1">Hot</span>
      </div>
    </div>
  );
};
