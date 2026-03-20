import type { CourtZone, CourtConfig } from '@/types/court';

/**
 * Half-court SVG zones for a 400x380 viewBox.
 *
 * Court orientation: baseline at bottom (y=380), half-court line at top (y=0).
 * Court width spans x=40 to x=360 (320 units = 50 ft).
 * Court height spans y=0 to y=380 (380 units ~47 ft half court).
 *
 * Key dimensions (scaled):
 *  - 3-point arc radius: ~150 units from basket center (200, 340)
 *  - Restricted area radius: ~26 units
 *  - Free throw line: y=226 (15 ft from baseline)
 *  - Key/lane width: 100 units (x=150 to x=250)
 *  - Corner 3 extends to y=290 then arc begins
 *  - Basket at (200, 346)
 */

const BASKET_X = 200;
const BASKET_Y = 346;

export const COURT_ZONES: CourtZone[] = [
  {
    id: 'restricted-area',
    name: 'Restricted Area',
    path: `M ${BASKET_X - 26} ${BASKET_Y} A 26 26 0 0 1 ${BASKET_X + 26} ${BASKET_Y} L ${BASKET_X + 26} 380 L ${BASKET_X - 26} 380 Z`,
    center: { x: 200, y: 356 },
  },
  {
    id: 'left-block',
    name: 'Left Block',
    path: 'M 150 290 L 174 290 L 174 346 A 26 26 0 0 0 174 346 L 174 380 L 150 380 Z',
    center: { x: 162, y: 335 },
  },
  {
    id: 'right-block',
    name: 'Right Block',
    path: 'M 226 290 L 250 290 L 250 380 L 226 380 L 226 346 A 26 26 0 0 0 226 346 Z',
    center: { x: 238, y: 335 },
  },
  {
    id: 'left-mid-range',
    name: 'Left Mid-Range',
    path: 'M 90 226 L 150 226 L 150 290 L 74 290 Q 78 260 90 226 Z',
    center: { x: 115, y: 260 },
  },
  {
    id: 'right-mid-range',
    name: 'Right Mid-Range',
    path: 'M 250 226 L 310 226 L 322 226 Q 322 260 326 290 L 250 290 L 250 226 Z',
    center: { x: 285, y: 260 },
  },
  {
    id: 'left-elbow',
    name: 'Left Elbow',
    path: 'M 110 170 L 150 170 L 150 226 L 90 226 Q 96 198 110 170 Z',
    center: { x: 128, y: 200 },
  },
  {
    id: 'right-elbow',
    name: 'Right Elbow',
    path: 'M 250 170 L 290 170 L 310 170 Q 310 198 310 226 L 250 226 L 250 170 Z',
    center: { x: 275, y: 200 },
  },
  {
    id: 'top-of-key',
    name: 'Top of Key',
    path: 'M 150 170 L 250 170 L 250 226 L 150 226 Z',
    center: { x: 200, y: 198 },
  },
  {
    id: 'free-throw',
    name: 'Free Throw',
    path: 'M 150 226 L 250 226 L 250 290 L 226 290 L 226 346 A 26 26 0 0 1 174 346 L 174 290 L 150 290 Z',
    center: { x: 200, y: 296 },
  },
  {
    id: 'left-corner-3',
    name: 'Left Corner 3',
    path: 'M 40 290 L 74 290 L 74 380 L 40 380 Z',
    center: { x: 57, y: 335 },
  },
  {
    id: 'right-corner-3',
    name: 'Right Corner 3',
    path: 'M 326 290 L 360 290 L 360 380 L 326 380 Z',
    center: { x: 343, y: 335 },
  },
  {
    id: 'left-wing-3',
    name: 'Left Wing 3',
    path: 'M 40 140 L 110 170 Q 96 198 90 226 Q 78 260 74 290 L 40 290 Z',
    center: { x: 62, y: 220 },
  },
  {
    id: 'right-wing-3',
    name: 'Right Wing 3',
    path: 'M 360 140 L 290 170 Q 310 198 310 226 Q 322 260 326 290 L 360 290 Z',
    center: { x: 338, y: 220 },
  },
  {
    id: 'center-3',
    name: 'Center 3',
    path: 'M 40 0 L 360 0 L 360 140 L 290 170 L 250 170 L 150 170 L 110 170 L 40 140 Z',
    center: { x: 200, y: 100 },
  },
];

export const COURT_CONFIG: CourtConfig = {
  width: 400,
  height: 380,
  zones: COURT_ZONES,
};

/** Returns a fill color based on shooting percentage relative to league average */
export const getHeatColor = (percentage: number, leagueAvg: number): string => {
  const diff = percentage - leagueAvg;

  if (percentage === 0) return 'rgba(150, 150, 150, 0.25)';
  if (diff >= 10) return 'rgba(34, 197, 94, 0.55)';
  if (diff >= 5) return 'rgba(74, 222, 128, 0.45)';
  if (diff >= 0) return 'rgba(163, 230, 53, 0.35)';
  if (diff >= -5) return 'rgba(250, 204, 21, 0.40)';
  if (diff >= -10) return 'rgba(251, 146, 60, 0.45)';
  return 'rgba(239, 68, 68, 0.50)';
};

/** Returns descriptive label for heat level */
export const getHeatLabel = (percentage: number, leagueAvg: number): string => {
  const diff = percentage - leagueAvg;
  if (percentage === 0) return 'No Data';
  if (diff >= 10) return 'On Fire';
  if (diff >= 5) return 'Hot';
  if (diff >= 0) return 'Above Avg';
  if (diff >= -5) return 'Below Avg';
  if (diff >= -10) return 'Cold';
  return 'Ice Cold';
};
