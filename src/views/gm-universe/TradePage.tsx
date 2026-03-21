'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { evaluateTrade, type TradeEvaluation } from '@/lib/gm-universe/trade-evaluator';

interface PlayerContract {
  salary: number;
  years: number;
  type: string;
}

interface TradeablePlayer {
  id: string;
  name: string;
  position: string;
  overall: number;
  age: number;
  potential: number;
  contract: PlayerContract;
}

interface TradeTeam {
  id: string;
  name: string;
  players: TradeablePlayer[];
}

interface TradeRecord {
  id: number;
  team: string;
  given: string[];
  received: string[];
  rating: TradeEvaluation['rating'];
  date: string;
}

const MY_PLAYERS: TradeablePlayer[] = [
  { id: 't1', name: 'Scottie Barnes', position: 'SF', overall: 88, age: 23, potential: 94, contract: { salary: 26400000, years: 4, type: 'max' } },
  { id: 't2', name: 'Immanuel Quickley', position: 'PG', overall: 82, age: 25, potential: 85, contract: { salary: 18000000, years: 3, type: 'market' } },
  { id: 't3', name: 'RJ Barrett', position: 'SG', overall: 80, age: 24, potential: 84, contract: { salary: 23800000, years: 3, type: 'market' } },
  { id: 't4', name: 'Jakob Poeltl', position: 'C', overall: 79, age: 29, potential: 79, contract: { salary: 19500000, years: 2, type: 'market' } },
  { id: 't5', name: 'Gradey Dick', position: 'SG', overall: 76, age: 21, potential: 86, contract: { salary: 5200000, years: 3, type: 'rookie' } },
  { id: 't6', name: 'Gary Trent Jr.', position: 'SG', overall: 77, age: 25, potential: 79, contract: { salary: 16500000, years: 2, type: 'market' } },
  { id: 't7', name: 'Kelly Olynyk', position: 'PF', overall: 74, age: 33, potential: 74, contract: { salary: 13000000, years: 1, type: 'market' } },
  { id: 't8', name: 'Bruce Brown', position: 'SG', overall: 75, age: 28, potential: 75, contract: { salary: 6500000, years: 2, type: 'team_friendly' } },
];

const TRADE_TEAMS: TradeTeam[] = [
  {
    id: 'BOS', name: 'Boston Celtics',
    players: [
      { id: 'b1', name: 'Jaylen Brown', position: 'SG', overall: 87, age: 27, potential: 88, contract: { salary: 49500000, years: 4, type: 'max' } },
      { id: 'b2', name: 'Derrick White', position: 'PG', overall: 82, age: 30, potential: 82, contract: { salary: 18400000, years: 3, type: 'market' } },
      { id: 'b3', name: 'Robert Williams', position: 'C', overall: 78, age: 27, potential: 82, contract: { salary: 12000000, years: 2, type: 'team_friendly' } },
      { id: 'b4', name: 'Payton Pritchard', position: 'PG', overall: 75, age: 26, potential: 77, contract: { salary: 7000000, years: 3, type: 'team_friendly' } },
    ],
  },
  {
    id: 'LAL', name: 'Los Angeles Lakers',
    players: [
      { id: 'l1', name: 'Austin Reaves', position: 'SG', overall: 80, age: 26, potential: 82, contract: { salary: 12400000, years: 4, type: 'team_friendly' } },
      { id: 'l2', name: 'Rui Hachimura', position: 'PF', overall: 77, age: 26, potential: 80, contract: { salary: 17000000, years: 3, type: 'market' } },
      { id: 'l3', name: 'Jarred Vanderbilt', position: 'PF', overall: 74, age: 25, potential: 77, contract: { salary: 11000000, years: 3, type: 'market' } },
      { id: 'l4', name: 'Max Christie', position: 'SG', overall: 71, age: 21, potential: 80, contract: { salary: 2200000, years: 2, type: 'rookie' } },
    ],
  },
  {
    id: 'OKC', name: 'Oklahoma City Thunder',
    players: [
      { id: 'o1', name: 'Jalen Williams', position: 'SF', overall: 84, age: 23, potential: 90, contract: { salary: 8200000, years: 2, type: 'rookie' } },
      { id: 'o2', name: 'Chet Holmgren', position: 'C', overall: 82, age: 22, potential: 92, contract: { salary: 10900000, years: 3, type: 'rookie' } },
      { id: 'o3', name: 'Luguentz Dort', position: 'SG', overall: 76, age: 25, potential: 78, contract: { salary: 15400000, years: 3, type: 'market' } },
      { id: 'o4', name: 'Isaiah Joe', position: 'SG', overall: 72, age: 25, potential: 74, contract: { salary: 3000000, years: 2, type: 'team_friendly' } },
    ],
  },
];

interface RatingConfig {
  color: string;
  bg: string;
  label: string;
}

const RATING_CONFIG: Record<TradeEvaluation['rating'], RatingConfig> = {
  great: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', label: 'GREAT TRADE' },
  fair: { color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30', label: 'FAIR TRADE' },
  unfair: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', label: 'UNFAIR TRADE' },
};

interface PlayerChipProps {
  player: TradeablePlayer;
  selected: boolean;
  onClick: () => void;
}

function PlayerChip({ player, selected, onClick }: PlayerChipProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg border text-left transition-all w-full',
        selected
          ? 'border-red-500 bg-red-500/10'
          : 'border-slate-800 bg-slate-800/50 hover:border-slate-700',
      )}
    >
      <span className={cn(
        'text-sm font-bold w-7 text-center',
        player.overall >= 85 ? 'text-emerald-400' : player.overall >= 78 ? 'text-amber-400' : 'text-slate-400',
      )}>
        {player.overall}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white font-medium truncate">{player.name}</p>
        <p className="text-[10px] text-slate-500">
          {player.position} | Age {player.age} | ${(player.contract.salary / 1000000).toFixed(1)}M
        </p>
      </div>
    </button>
  );
}

export function TradePage(): React.ReactElement {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [mySelected, setMySelected] = useState<Set<string>>(new Set());
  const [theirSelected, setTheirSelected] = useState<Set<string>>(new Set());
  const [tradeHistory, setTradeHistory] = useState<TradeRecord[]>([]);
  const [evaluation, setEvaluation] = useState<TradeEvaluation | null>(null);

  const tradeTeam = useMemo(
    () => TRADE_TEAMS.find((t) => t.id === selectedTeamId),
    [selectedTeamId],
  );

  const toggleMy = useCallback((id: string): void => {
    setMySelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setEvaluation(null);
  }, []);

  const toggleTheir = useCallback((id: string): void => {
    setTheirSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setEvaluation(null);
  }, []);

  const handleEvaluate = useCallback((): void => {
    const given = MY_PLAYERS.filter((p) => mySelected.has(p.id));
    const received = tradeTeam?.players.filter((p) => theirSelected.has(p.id)) ?? [];
    const result = evaluateTrade(given, received);
    setEvaluation(result);
  }, [mySelected, theirSelected, tradeTeam]);

  const handleExecute = useCallback((): void => {
    if (!evaluation || evaluation.rating === 'unfair' || !tradeTeam) return;
    const given = MY_PLAYERS.filter((p) => mySelected.has(p.id));
    const received = tradeTeam.players.filter((p) => theirSelected.has(p.id));
    setTradeHistory((prev) => [
      {
        id: Date.now(),
        team: tradeTeam.name,
        given: given.map((p) => p.name),
        received: received.map((p) => p.name),
        rating: evaluation.rating,
        date: new Date().toLocaleDateString(),
      },
      ...prev,
    ]);
    setMySelected(new Set());
    setTheirSelected(new Set());
    setEvaluation(null);
  }, [evaluation, mySelected, theirSelected, tradeTeam]);

  const mySalaryOut = MY_PLAYERS.filter((p) => mySelected.has(p.id)).reduce((s, p) => s + p.contract.salary, 0);
  const theirSalaryIn = (tradeTeam?.players ?? []).filter((p) => theirSelected.has(p.id)).reduce((s, p) => s + p.contract.salary, 0);
  const SALARY_TOLERANCE = 5000000;
  const salaryMatch = Math.abs(mySalaryOut - theirSalaryIn) <= Math.max(mySalaryOut, theirSalaryIn) * 0.25 + SALARY_TOLERANCE;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-white">Trade Center</h1>

      <Card className="bg-slate-900/80 border-slate-800">
        <CardContent className="p-4">
          <label className="text-xs text-slate-400 mb-2 block">Trade Partner</label>
          <Select value={selectedTeamId} onValueChange={(v: string) => { setSelectedTeamId(v); setTheirSelected(new Set()); setEvaluation(null); }}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select a team to trade with" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {TRADE_TEAMS.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-white hover:bg-slate-700">
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTeamId && tradeTeam && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Your Players</h3>
                <span className="text-[10px] text-slate-500">
                  Out: ${(mySalaryOut / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                {MY_PLAYERS.map((player) => (
                  <PlayerChip
                    key={player.id}
                    player={player}
                    selected={mySelected.has(player.id)}
                    onClick={() => toggleMy(player.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">{tradeTeam.name}</h3>
                <span className="text-[10px] text-slate-500">
                  In: ${(theirSalaryIn / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                {tradeTeam.players.map((player) => (
                  <PlayerChip
                    key={player.id}
                    player={player}
                    selected={theirSelected.has(player.id)}
                    onClick={() => toggleTheir(player.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTeamId && (mySelected.size > 0 || theirSelected.size > 0) && (
        <Card className="bg-slate-900/80 border-slate-800">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Salary Match</span>
              <span className={cn(
                'text-xs font-bold',
                salaryMatch ? 'text-emerald-400' : 'text-red-400',
              )}>
                {salaryMatch ? 'VALID' : 'SALARY MISMATCH'}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleEvaluate}
                disabled={mySelected.size === 0 || theirSelected.size === 0}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs"
                size="sm"
              >
                Evaluate Trade
              </Button>
              {evaluation && evaluation.rating !== 'unfair' && (
                <Button
                  onClick={handleExecute}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs"
                  size="sm"
                >
                  Execute Trade
                </Button>
              )}
            </div>

            {evaluation && (
              <div className={cn(
                'p-3 rounded-lg border',
                RATING_CONFIG[evaluation.rating].bg,
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-xs font-bold', RATING_CONFIG[evaluation.rating].color)}>
                    {RATING_CONFIG[evaluation.rating].label}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Value: {evaluation.givenValue} vs {evaluation.receivedValue}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{evaluation.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tradeHistory.length > 0 && (
        <Card className="bg-slate-900/80 border-slate-800">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Trade History</h3>
            <div className="space-y-2">
              {tradeHistory.map((trade) => (
                <div key={trade.id} className="p-2 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300">with {trade.team}</span>
                    <span className={cn('text-[10px] font-bold', RATING_CONFIG[trade.rating].color)}>
                      {trade.rating.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Sent: {trade.given.join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Received: {trade.received.join(', ')}
                  </p>
                  <p className="text-[9px] text-slate-600 mt-1">{trade.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
