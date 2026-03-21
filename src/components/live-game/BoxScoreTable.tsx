'use client';

import { cn } from '@/lib/utils';

interface PlayerStatRow {
  id: string;
  playerId: string;
  playerName: string;
  playerNumber: number;
  playerPosition: string;
  minutes: number;
  points: number;
  fgMade: number;
  fgAttempts: number;
  threeMade: number;
  threeAttempts: number;
  ftMade: number;
  ftAttempts: number;
  offRebounds: number;
  defRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
}

interface BoxScoreTableProps {
  teamName: string;
  teamColor: string;
  players: PlayerStatRow[];
  isSelected?: boolean;
  selectedPlayerId?: string;
  onSelectPlayer?: (playerId: string) => void;
}

export function BoxScoreTable({
  teamName,
  teamColor,
  players,
  selectedPlayerId,
  onSelectPlayer,
}: BoxScoreTableProps): React.ReactElement {
  const totals = players.reduce(
    (acc, p) => ({
      points: acc.points + p.points,
      fgMade: acc.fgMade + p.fgMade,
      fgAttempts: acc.fgAttempts + p.fgAttempts,
      threeMade: acc.threeMade + p.threeMade,
      threeAttempts: acc.threeAttempts + p.threeAttempts,
      ftMade: acc.ftMade + p.ftMade,
      ftAttempts: acc.ftAttempts + p.ftAttempts,
      rebounds: acc.rebounds + p.offRebounds + p.defRebounds,
      assists: acc.assists + p.assists,
      steals: acc.steals + p.steals,
      blocks: acc.blocks + p.blocks,
      turnovers: acc.turnovers + p.turnovers,
    }),
    { points: 0, fgMade: 0, fgAttempts: 0, threeMade: 0, threeAttempts: 0, ftMade: 0, ftAttempts: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0 },
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: teamColor }} />
        <h3 className="text-sm font-black text-neutral-900">{teamName}</h3>
        <span className="ml-auto text-lg font-black text-neutral-900">{totals.points}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-400">
              <th className="sticky left-0 bg-white px-3 py-2 text-left font-bold uppercase tracking-wider">Player</th>
              <th className="px-2 py-2 text-center font-bold">PTS</th>
              <th className="px-2 py-2 text-center font-bold">FG</th>
              <th className="px-2 py-2 text-center font-bold">3PT</th>
              <th className="px-2 py-2 text-center font-bold">FT</th>
              <th className="px-2 py-2 text-center font-bold">REB</th>
              <th className="px-2 py-2 text-center font-bold">AST</th>
              <th className="hidden sm:table-cell px-2 py-2 text-center font-bold">STL</th>
              <th className="hidden sm:table-cell px-2 py-2 text-center font-bold">BLK</th>
              <th className="hidden sm:table-cell px-2 py-2 text-center font-bold">TOV</th>
              <th className="hidden sm:table-cell px-2 py-2 text-center font-bold">PF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {players.map((p) => (
              <tr
                key={p.id}
                onClick={() => onSelectPlayer?.(p.playerId)}
                className={cn(
                  'transition-colors cursor-pointer',
                  selectedPlayerId === p.playerId ? 'bg-[#c8ff00]/10' : 'hover:bg-neutral-50',
                )}
              >
                <td className="sticky left-0 bg-inherit px-3 py-2 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-400">#{p.playerNumber}</span>
                    <span className="font-bold text-neutral-900">{p.playerName}</span>
                    <span className="text-[10px] text-neutral-400">{p.playerPosition}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-center font-black text-neutral-900">{p.points}</td>
                <td className="px-2 py-2 text-center text-neutral-600">{p.fgMade}/{p.fgAttempts}</td>
                <td className="px-2 py-2 text-center text-neutral-600">{p.threeMade}/{p.threeAttempts}</td>
                <td className="px-2 py-2 text-center text-neutral-600">{p.ftMade}/{p.ftAttempts}</td>
                <td className="px-2 py-2 text-center text-neutral-600">{p.offRebounds + p.defRebounds}</td>
                <td className="px-2 py-2 text-center text-neutral-600">{p.assists}</td>
                <td className="hidden sm:table-cell px-2 py-2 text-center text-neutral-400">{p.steals}</td>
                <td className="hidden sm:table-cell px-2 py-2 text-center text-neutral-400">{p.blocks}</td>
                <td className="hidden sm:table-cell px-2 py-2 text-center text-neutral-400">{p.turnovers}</td>
                <td className="hidden sm:table-cell px-2 py-2 text-center text-neutral-400">{p.fouls}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-neutral-200 bg-neutral-50">
              <td className="sticky left-0 bg-neutral-50 px-3 py-2 text-left font-black text-neutral-600 uppercase text-[10px] tracking-widest">Totals</td>
              <td className="px-2 py-2 text-center font-black text-neutral-900">{totals.points}</td>
              <td className="px-2 py-2 text-center text-neutral-600">{totals.fgMade}/{totals.fgAttempts}</td>
              <td className="px-2 py-2 text-center text-neutral-600">{totals.threeMade}/{totals.threeAttempts}</td>
              <td className="px-2 py-2 text-center text-neutral-600">{totals.ftMade}/{totals.ftAttempts}</td>
              <td className="px-2 py-2 text-center text-neutral-600">{totals.rebounds}</td>
              <td className="px-2 py-2 text-center text-neutral-600">{totals.assists}</td>
              <td className="hidden sm:table-cell px-2 py-2 text-center text-neutral-400">{totals.steals}</td>
              <td className="hidden sm:table-cell px-2 py-2 text-center text-neutral-400">{totals.blocks}</td>
              <td className="hidden sm:table-cell px-2 py-2 text-center text-neutral-400">{totals.turnovers}</td>
              <td className="hidden sm:table-cell px-2 py-2 text-center text-neutral-400">-</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
