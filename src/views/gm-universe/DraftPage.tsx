'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProspectAttributes {
  scoring: number;
  playmaking: number;
  defense: number;
  athleticism: number;
  shooting: number;
  iq: number;
}

interface Prospect {
  id: string;
  rank: number;
  name: string;
  position: string;
  college: string;
  overall: number;
  potential: number;
  comparison: string;
  age: number;
  height: string;
  weight: number;
  attributes: ProspectAttributes;
  scoutReport: string;
}

const PROSPECTS: Prospect[] = [
  { id: 'd1', rank: 1, name: 'Cooper Flagg', position: 'SF', college: 'Duke', overall: 86, potential: 96, comparison: 'Jayson Tatum', age: 19, height: "6'9", weight: 205, attributes: { scoring: 88, playmaking: 82, defense: 85, athleticism: 90, shooting: 78, iq: 87 }, scoutReport: 'Elite two-way wing with the versatility to guard multiple positions. Elite motor, competitive fire. Needs to improve three-point consistency but the mechanics are there.' },
  { id: 'd2', rank: 2, name: 'Airious Bailey', position: 'SG', college: 'Alabama', overall: 84, potential: 93, comparison: 'Dwyane Wade', age: 19, height: "6'5", weight: 210, attributes: { scoring: 90, playmaking: 78, defense: 80, athleticism: 92, shooting: 76, iq: 80 }, scoutReport: 'Explosive scorer with elite athleticism. Can get to the rim at will. Must improve perimeter shooting and decision-making in pick-and-roll.' },
  { id: 'd3', rank: 3, name: 'Dylan Harper', position: 'PG', college: 'Rutgers', overall: 83, potential: 91, comparison: 'James Harden', age: 19, height: "6'4", weight: 195, attributes: { scoring: 86, playmaking: 88, defense: 72, athleticism: 80, shooting: 82, iq: 85 }, scoutReport: 'Skilled combo guard with elite scoring instincts. Great at creating for others. Defensive effort is inconsistent but has the tools to be average.' },
  { id: 'd4', rank: 4, name: 'Ace Bailey', position: 'SF', college: 'Rutgers', overall: 82, potential: 92, comparison: 'Paul George', age: 19, height: "6'9", weight: 215, attributes: { scoring: 85, playmaking: 74, defense: 80, athleticism: 88, shooting: 80, iq: 78 }, scoutReport: 'Long, versatile wing who can score at all three levels. Needs to add strength and improve handle but the upside is enormous.' },
  { id: 'd5', rank: 5, name: 'VJ Edgecombe', position: 'SG', college: 'Baylor', overall: 81, potential: 90, comparison: 'Victor Oladipo', age: 20, height: "6'5", weight: 195, attributes: { scoring: 84, playmaking: 76, defense: 82, athleticism: 90, shooting: 74, iq: 78 }, scoutReport: 'Athletic guard with explosive first step. High-level defender with great instincts. Shooting is the question mark.' },
  { id: 'd6', rank: 6, name: 'Kon Knueppel', position: 'SF', college: 'Duke', overall: 80, potential: 87, comparison: 'Klay Thompson', age: 20, height: "6'7", weight: 210, attributes: { scoring: 82, playmaking: 78, defense: 76, athleticism: 74, shooting: 90, iq: 86 }, scoutReport: 'Elite shooter with great size. Smart player who makes the right play. Not the most athletic but very skilled and crafty.' },
  { id: 'd7', rank: 7, name: 'Tre Johnson', position: 'SG', college: 'Texas', overall: 80, potential: 89, comparison: 'Bradley Beal', age: 19, height: "6'5", weight: 190, attributes: { scoring: 86, playmaking: 74, defense: 72, athleticism: 82, shooting: 84, iq: 76 }, scoutReport: 'Shot-making guard with incredible scoring upside. Can heat up quickly from anywhere. Needs to improve defensive effort and playmaking.' },
  { id: 'd8', rank: 8, name: 'Egor Demin', position: 'PG', college: 'BYU', overall: 79, potential: 88, comparison: 'Luka Doncic', age: 19, height: "6'9", weight: 190, attributes: { scoring: 78, playmaking: 86, defense: 70, athleticism: 72, shooting: 80, iq: 88 }, scoutReport: 'Oversized point guard with elite vision and feel. International pedigree. Needs to add strength and improve defensive positioning.' },
  { id: 'd9', rank: 9, name: 'Nolan Traore', position: 'PG', college: 'Intl (France)', overall: 78, potential: 90, comparison: 'Tony Parker', age: 19, height: "6'4", weight: 180, attributes: { scoring: 80, playmaking: 84, defense: 74, athleticism: 86, shooting: 72, iq: 82 }, scoutReport: 'Lightning-quick point guard with elite speed. Great passer in transition. Shooting consistency needs work.' },
  { id: 'd10', rank: 10, name: 'Khaman Maluach', position: 'C', college: 'Duke', overall: 78, potential: 89, comparison: 'Rudy Gobert', age: 19, height: "7'2", weight: 250, attributes: { scoring: 72, playmaking: 60, defense: 90, athleticism: 82, shooting: 52, iq: 76 }, scoutReport: 'Massive rim protector with elite shot-blocking instincts. Moves well for his size. Offensive game is raw.' },
  { id: 'd11', rank: 11, name: 'Jalil Bethea', position: 'SG', college: 'Miami', overall: 77, potential: 86, comparison: 'Devin Booker', age: 19, height: "6'5", weight: 185, attributes: { scoring: 84, playmaking: 72, defense: 68, athleticism: 78, shooting: 86, iq: 74 }, scoutReport: 'Silky smooth scorer with deep range. Shot creation ability is special. Must improve defensive consistency and effort.' },
  { id: 'd12', rank: 12, name: 'Jeremiah Fears', position: 'PG', college: 'Oklahoma', overall: 77, potential: 87, comparison: 'Ja Morant', age: 19, height: "6'4", weight: 185, attributes: { scoring: 82, playmaking: 80, defense: 70, athleticism: 88, shooting: 72, iq: 76 }, scoutReport: 'Dynamic, explosive guard who plays above the rim. Great in transition. Needs to improve half-court decision-making.' },
];

const DRAFT_ORDER = [
  'WAS', 'DET', 'CHA', 'POR', 'SAS', 'UTA', 'BKN', 'HOU', 'ATL', 'CHI',
  'MEM', 'NOP', 'TOR', 'ORL', 'IND', 'PHI', 'MIA', 'NYK', 'SAC', 'LAC',
  'LAL', 'GSW', 'DAL', 'PHX', 'MIN', 'DEN', 'MIL', 'CLE', 'BOS', 'OKC',
];

function AttributeBar({ label, value }: { label: string; value: number }): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 w-16">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', value >= 85 ? 'bg-emerald-500' : value >= 75 ? 'bg-amber-500' : 'bg-slate-500')}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={cn('text-[10px] font-bold tabular-nums w-6 text-right', value >= 85 ? 'text-emerald-400' : value >= 75 ? 'text-amber-400' : 'text-slate-400')}>
        {value}
      </span>
    </div>
  );
}

function ProspectCard({ prospect }: { prospect: Prospect }): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={cn('bg-slate-900/80 border-slate-800 cursor-pointer transition-all', 'hover:border-slate-700', expanded && 'border-red-600/30')}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-slate-600 w-6 text-right">{prospect.rank}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm text-white font-semibold truncate">{prospect.name}</h3>
              <span className="text-[10px] text-slate-500">{prospect.position}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>{prospect.college}</span><span>|</span><span>{prospect.height} / {prospect.weight}lbs</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-2">
              <div>
                <span className={cn('text-sm font-bold', prospect.overall >= 82 ? 'text-emerald-400' : prospect.overall >= 78 ? 'text-amber-400' : 'text-slate-400')}>{prospect.overall}</span>
                <span className="text-[9px] text-slate-600 ml-1">OVR</span>
              </div>
              <div>
                <span className={cn('text-sm font-bold', prospect.potential >= 90 ? 'text-purple-400' : prospect.potential >= 85 ? 'text-blue-400' : 'text-slate-400')}>{prospect.potential}</span>
                <span className="text-[9px] text-slate-600 ml-1">POT</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-600">Comp: {prospect.comparison}</p>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              {Object.entries(prospect.attributes).map(([key, val]) => (
                <AttributeBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} />
              ))}
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider mb-1">Scout Report</p>
              <p className="text-xs text-slate-300 leading-relaxed">{prospect.scoutReport}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DraftPage(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Draft Board</h1>
        <span className="text-xs text-slate-500">{PROSPECTS.length} prospects</span>
      </div>

      <Card className="bg-slate-900/80 border-slate-800">
        <CardContent className="p-3">
          <h3 className="text-[10px] text-slate-600 font-medium uppercase tracking-wider mb-2">Draft Order</h3>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {DRAFT_ORDER.map((team, i) => (
              <div key={i} className={cn('px-2 py-1 rounded text-[10px] font-bold shrink-0', team === 'TOR' ? 'bg-red-600/20 text-red-400' : 'bg-slate-800 text-slate-500')}>
                {i + 1}. {team}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {PROSPECTS.map((prospect) => (
          <ProspectCard key={prospect.id} prospect={prospect} />
        ))}
      </div>
    </div>
  );
}
