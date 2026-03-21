'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SportsMeta {
  label: string;
  emoji: string;
}

interface Line {
  id: number;
  sport: string;
  game: string;
  time: string;
  openLine: string;
  currentLine: string;
  movement: number;
  direction: string;
  openTotal: string;
  currentTotal: string;
  totalMovement: number;
  totalDirection: string;
  sharpMoney: boolean;
  sharpSide: string | null;
  note: string;
}

const SPORTS_META: Record<string, SportsMeta> = {
  nba: { label: 'NBA', emoji: '\u{1F3C0}' },
  nfl: { label: 'NFL', emoji: '\u{1F3C8}' },
  mlb: { label: 'MLB', emoji: '\u26BE' },
  nhl: { label: 'NHL', emoji: '\u{1F3D2}' },
  soccer: { label: 'Soccer', emoji: '\u26BD' },
};

const MOCK_LINES: Line[] = [
  {
    id: 1, sport: 'nba', game: 'TOR vs BOS', time: '7:30 PM',
    openLine: 'BOS -7.5', currentLine: 'BOS -6', movement: 1.5, direction: 'down',
    openTotal: '224.5', currentTotal: '226', totalMovement: 1.5, totalDirection: 'up',
    sharpMoney: true, sharpSide: 'TOR', note: 'Heavy sharp action on TOR ATS',
  },
  {
    id: 2, sport: 'nba', game: 'LAL vs GSW', time: '10:00 PM',
    openLine: 'GSW -3', currentLine: 'GSW -3.5', movement: 0.5, direction: 'up',
    openTotal: '226', currentTotal: '228.5', totalMovement: 2.5, totalDirection: 'up',
    sharpMoney: false, sharpSide: null, note: 'Public pushing the over',
  },
  {
    id: 3, sport: 'nba', game: 'MIL vs MIA', time: '8:00 PM',
    openLine: 'MIL -4', currentLine: 'MIL -4.5', movement: 0.5, direction: 'up',
    openTotal: '218', currentTotal: '216.5', totalMovement: 1.5, totalDirection: 'down',
    sharpMoney: true, sharpSide: 'MIL', note: 'Giannis prop bets spiking',
  },
  {
    id: 4, sport: 'nfl', game: 'KC vs BUF', time: '4:25 PM',
    openLine: 'BUF -2.5', currentLine: 'BUF -1', movement: 1.5, direction: 'down',
    openTotal: '49.5', currentTotal: '47.5', totalMovement: 2, totalDirection: 'down',
    sharpMoney: true, sharpSide: 'KC', note: 'Reverse line movement on KC',
  },
  {
    id: 5, sport: 'nba', game: 'DEN vs PHX', time: '9:30 PM',
    openLine: 'DEN -1.5', currentLine: 'DEN -2.5', movement: 1, direction: 'up',
    openTotal: '230', currentTotal: '229', totalMovement: 1, totalDirection: 'down',
    sharpMoney: false, sharpSide: null, note: 'Steady market, slight Nuggets lean',
  },
  {
    id: 6, sport: 'mlb', game: 'NYY vs BOS', time: '7:05 PM',
    openLine: 'NYY -145', currentLine: 'NYY -155', movement: 10, direction: 'up',
    openTotal: '8.5', currentTotal: '8', totalMovement: 0.5, totalDirection: 'down',
    sharpMoney: true, sharpSide: 'NYY', note: 'Pitcher matchup driving movement',
  },
  {
    id: 7, sport: 'nhl', game: 'TOR vs MTL', time: '7:00 PM',
    openLine: 'TOR -155', currentLine: 'TOR -170', movement: 15, direction: 'up',
    openTotal: '6', currentTotal: '5.5', totalMovement: 0.5, totalDirection: 'down',
    sharpMoney: false, sharpSide: null, note: 'Public heavy on Leafs ML',
  },
  {
    id: 8, sport: 'nba', game: 'CLE vs IND', time: '7:00 PM',
    openLine: 'CLE -2.5', currentLine: 'CLE -3.5', movement: 1, direction: 'up',
    openTotal: '225', currentTotal: '223.5', totalMovement: 1.5, totalDirection: 'down',
    sharpMoney: true, sharpSide: 'CLE', note: 'Cavs defense metrics driving action',
  },
  {
    id: 9, sport: 'soccer', game: 'ARS vs MCI', time: '12:30 PM',
    openLine: 'ARS +110', currentLine: 'ARS +115', movement: 5, direction: 'down',
    openTotal: '2.5', currentTotal: '2.5', totalMovement: 0, totalDirection: 'steady',
    sharpMoney: false, sharpSide: null, note: 'City squad news pending',
  },
];

export function LineMovementView(): React.ReactElement {
  const [sportFilter, setSportFilter] = useState('all');
  const [sharpOnly, setSharpOnly] = useState(false);

  const lines = MOCK_LINES;

  const filtered = useMemo(() => {
    let result = [...lines];
    if (sportFilter !== 'all') result = result.filter((l) => l.sport === sportFilter);
    if (sharpOnly) result = result.filter((l) => l.sharpMoney);
    return result;
  }, [lines, sportFilter, sharpOnly]);

  const activeSports = useMemo(() => {
    const sportSet = new Set(lines.map((l) => l.sport));
    return ['all', ...Array.from(sportSet)];
  }, [lines]);

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Line Movement</h1>
        <span className="text-xs text-neutral-500">{filtered.length} games</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {activeSports.map((sport) => (
            <button
              key={sport}
              onClick={() => setSportFilter(sport)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1',
                sportFilter === sport ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700',
              )}
            >
              {sport !== 'all' && <span className="text-sm">{SPORTS_META[sport]?.emoji}</span>}
              {sport === 'all' ? 'All' : SPORTS_META[sport]?.label || sport}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSharpOnly(!sharpOnly)}
          className={cn(
            'px-2.5 py-1 rounded text-xs font-medium transition-all ml-auto',
            sharpOnly ? 'bg-[#C9A92C]/20 text-[#C9A92C] border border-[#C9A92C]/30' : 'bg-neutral-800 text-neutral-400',
          )}
        >
          Sharp Money
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-2 px-2 text-neutral-500">Game</th>
              <th className="text-center py-2 px-1 text-neutral-500">Time</th>
              <th className="text-center py-2 px-1 text-neutral-500">Open</th>
              <th className="text-center py-2 px-1 text-neutral-500">Current</th>
              <th className="text-center py-2 px-1 text-neutral-500">Move</th>
              <th className="text-center py-2 px-1 text-neutral-500">Total</th>
              <th className="text-center py-2 px-1 text-neutral-500">Sharp</th>
              <th className="text-left py-2 px-2 text-neutral-500">Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((line) => (
              <tr key={line.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{SPORTS_META[line.sport]?.emoji}</span>
                    <span className="text-white font-medium">{line.game}</span>
                  </div>
                </td>
                <td className="py-2.5 px-1 text-center text-neutral-500">{line.time}</td>
                <td className="py-2.5 px-1 text-center text-neutral-400">{line.openLine}</td>
                <td className="py-2.5 px-1 text-center text-white font-medium">{line.currentLine}</td>
                <td className="py-2.5 px-1 text-center">
                  <span className={cn(
                    'font-bold flex items-center justify-center gap-0.5',
                    line.direction === 'up' ? 'text-emerald-400' : line.direction === 'down' ? 'text-red-400' : 'text-neutral-500',
                  )}>
                    {line.direction === 'up' ? '\u2191' : line.direction === 'down' ? '\u2193' : '-'}
                    {line.movement}
                  </span>
                </td>
                <td className="py-2.5 px-1 text-center">
                  <span className="text-neutral-300">{line.currentTotal}</span>
                  {line.totalMovement > 0 && (
                    <span className={cn(
                      'text-[9px] ml-1',
                      line.totalDirection === 'up' ? 'text-emerald-400' : 'text-red-400',
                    )}>
                      {line.totalDirection === 'up' ? '\u2191' : '\u2193'}{line.totalMovement}
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-1 text-center">
                  {line.sharpMoney ? (
                    <span className="text-[10px] font-bold text-[#C9A92C] bg-[#C9A92C]/10 px-1.5 py-0.5 rounded">
                      {line.sharpSide}
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-600">-</span>
                  )}
                </td>
                <td className="py-2.5 px-2 text-[10px] text-neutral-500 max-w-[180px] truncate">
                  {line.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {filtered.map((line) => (
          <div key={line.id} className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{SPORTS_META[line.sport]?.emoji}</span>
                <span className="text-xs text-white font-medium">{line.game}</span>
              </div>
              <span className="text-[10px] text-neutral-500">{line.time}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-center">
                <p className="text-[9px] text-neutral-600">Open</p>
                <p className="text-[10px] text-neutral-400">{line.openLine}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-neutral-600">Current</p>
                <p className="text-xs text-white font-bold">{line.currentLine}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-neutral-600">Movement</p>
                <p className={cn(
                  'text-xs font-bold',
                  line.direction === 'up' ? 'text-emerald-400' : line.direction === 'down' ? 'text-red-400' : 'text-neutral-500',
                )}>
                  {line.direction === 'up' ? '\u2191' : '\u2193'} {line.movement}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500">
                  O/U: {line.currentTotal}
                  {line.totalMovement > 0 && (
                    <span className={cn(
                      'ml-0.5',
                      line.totalDirection === 'up' ? 'text-emerald-400' : 'text-red-400',
                    )}>
                      ({line.totalDirection === 'up' ? '+' : '-'}{line.totalMovement})
                    </span>
                  )}
                </span>
              </div>
              {line.sharpMoney && (
                <span className="text-[9px] font-bold text-[#C9A92C] bg-[#C9A92C]/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                  SHARP: {line.sharpSide}
                </span>
              )}
            </div>

            {line.note && (
              <p className="text-[9px] text-neutral-600 mt-1.5">{line.note}</p>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500 text-sm">No lines match your filters.</p>
        </div>
      )}

      <p className="text-[9px] text-neutral-700 text-center">
        Line data is simulated for demonstration. Sharp money indicators are based on AI6 models, not actual betting data.
      </p>
    </div>
  );
}
