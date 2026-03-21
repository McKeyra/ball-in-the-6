'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { simulateGame } from '@/lib/gm-universe/game-sim';
import type { GameResult } from '@/lib/gm-universe/game-sim';

interface Player {
  id: string;
  name: string;
  position: string;
  overall: number;
}

interface BoxScoreEntry {
  id: string;
  name: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fgMade: number;
  fgAttempted: number;
  threeMade: number;
  threeAttempted: number;
}

interface PlayEntry {
  quarter: number;
  time: string;
  homeScore: number;
  awayScore: number;
  description: string;
  type: string;
  made?: boolean;
  isHomeOffense: boolean;
  momentum: number;
}

const HOME_TEAM: Player[] = [
  { id: 'h1', name: 'Scottie Barnes', position: 'SF', overall: 88 },
  { id: 'h2', name: 'Immanuel Quickley', position: 'PG', overall: 82 },
  { id: 'h3', name: 'RJ Barrett', position: 'SG', overall: 80 },
  { id: 'h4', name: 'Jakob Poeltl', position: 'C', overall: 79 },
  { id: 'h5', name: 'Gradey Dick', position: 'SG', overall: 76 },
];

const AWAY_TEAM: Player[] = [
  { id: 'a1', name: 'Jayson Tatum', position: 'SF', overall: 92 },
  { id: 'a2', name: 'Jaylen Brown', position: 'SG', overall: 87 },
  { id: 'a3', name: 'Derrick White', position: 'PG', overall: 82 },
  { id: 'a4', name: 'Kristaps Porzingis', position: 'C', overall: 85 },
  { id: 'a5', name: 'Jrue Holiday', position: 'PG', overall: 83 },
];

function ShotChart({ plays }: { plays: PlayEntry[] }): React.ReactElement {
  const shotPlays = plays.filter((p) => p.type && ['three_pointer', 'mid_range', 'layup', 'dunk'].includes(p.type));
  return (
    <div className="relative w-full aspect-[1.6] bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 100">
        <rect x="2" y="2" width="156" height="96" fill="none" stroke="#334155" strokeWidth="0.5" />
        <line x1="80" y1="2" x2="80" y2="98" stroke="#334155" strokeWidth="0.5" />
        <circle cx="80" cy="50" r="12" fill="none" stroke="#334155" strokeWidth="0.5" />
        <path d="M 2 20 Q 30 50 2 80" fill="none" stroke="#334155" strokeWidth="0.5" />
        <path d="M 158 20 Q 130 50 158 80" fill="none" stroke="#334155" strokeWidth="0.5" />
        <rect x="2" y="30" width="22" height="40" fill="none" stroke="#334155" strokeWidth="0.5" />
        <rect x="136" y="30" width="22" height="40" fill="none" stroke="#334155" strokeWidth="0.5" />
      </svg>
      {shotPlays.slice(-40).map((play, i) => {
        const x = play.isHomeOffense
          ? (play.type === 'three_pointer' ? 120 + Math.random() * 30 : 130 + Math.random() * 20)
          : (play.type === 'three_pointer' ? 10 + Math.random() * 30 : 10 + Math.random() * 20);
        const y = 15 + Math.random() * 70;
        return (
          <div key={i} className={cn('absolute w-2 h-2 rounded-full transition-all', play.made ? 'bg-emerald-500' : 'bg-red-500/50')}
            style={{ left: `${(x / 160) * 100}%`, top: `${(y / 100) * 100}%` }} title={play.description} />
        );
      })}
      <div className="absolute bottom-1 right-2 flex gap-2">
        <span className="flex items-center gap-1 text-[8px] text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Made</span>
        <span className="flex items-center gap-1 text-[8px] text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50" /> Missed</span>
      </div>
    </div>
  );
}

function BoxScoreTable({ boxScore, teamName }: { boxScore: BoxScoreEntry[]; teamName: string }): React.ReactElement {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left py-1 px-1 text-slate-500">{teamName}</th>
            {['MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO', 'FG', '3PT'].map((h) => (
              <th key={h} className="text-center py-1 px-1 text-slate-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {boxScore.map((p) => (
            <tr key={p.id} className="border-b border-slate-800/30">
              <td className="py-1 px-1 text-white font-medium">{p.name}</td>
              <td className="py-1 px-1 text-center text-slate-400">{p.minutes}</td>
              <td className="py-1 px-1 text-center text-white font-bold">{p.points}</td>
              <td className="py-1 px-1 text-center text-slate-300">{p.rebounds}</td>
              <td className="py-1 px-1 text-center text-slate-300">{p.assists}</td>
              <td className="py-1 px-1 text-center text-slate-400">{p.steals}</td>
              <td className="py-1 px-1 text-center text-slate-400">{p.blocks}</td>
              <td className="py-1 px-1 text-center text-slate-400">{p.turnovers}</td>
              <td className="py-1 px-1 text-center text-slate-400">{p.fgMade}/{p.fgAttempted}</td>
              <td className="py-1 px-1 text-center text-slate-400">{p.threeMade}/{p.threeAttempted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GameSimPage(): React.ReactElement {
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [visiblePlays, setVisiblePlays] = useState<PlayEntry[]>([]);
  const playLogRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    setVisiblePlays([]);

    const result = simulateGame(HOME_TEAM, AWAY_TEAM);
    setGameResult(result);

    let idx = 0;
    timerRef.current = setInterval(() => {
      if (idx < result.playByPlay.length) {
        setVisiblePlays((prev) => [...prev, result.playByPlay[idx] as PlayEntry]);
        idx++;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsSimulating(false);
      }
    }, 150);
  }, []);

  const skipToEnd = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameResult) {
      setVisiblePlays(gameResult.playByPlay as PlayEntry[]);
      setIsSimulating(false);
    }
  }, [gameResult]);

  useEffect(() => {
    if (playLogRef.current) playLogRef.current.scrollTop = playLogRef.current.scrollHeight;
  }, [visiblePlays.length]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const currentPlay = visiblePlays[visiblePlays.length - 1];
  const momentum = currentPlay?.momentum ?? 50;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Game Simulation</h1>
        {!isSimulating && !gameResult && (
          <Button onClick={startSimulation} className="bg-red-600 hover:bg-red-700 text-white text-xs" size="sm">Simulate Game</Button>
        )}
        {isSimulating && (
          <Button onClick={skipToEnd} variant="outline" className="border-slate-700 text-slate-300 text-xs" size="sm">Skip to End</Button>
        )}
        {!isSimulating && gameResult && (
          <Button onClick={() => { setGameResult(null); setVisiblePlays([]); }} variant="outline" className="border-slate-700 text-slate-300 text-xs" size="sm">New Game</Button>
        )}
      </div>

      {!gameResult && !isSimulating && (
        <Card className="bg-slate-900/80 border-slate-800">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl bg-[#CE1141] flex items-center justify-center text-lg font-bold text-white mx-auto mb-2">TOR</div>
                <p className="text-sm text-white font-medium">Raptors</p>
                <p className="text-[10px] text-slate-500">Home</p>
              </div>
              <span className="text-2xl font-bold text-slate-600">VS</span>
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl bg-[#007A33] flex items-center justify-center text-lg font-bold text-white mx-auto mb-2">BOS</div>
                <p className="text-sm text-white font-medium">Celtics</p>
                <p className="text-[10px] text-slate-500">Away</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">Press Simulate Game to start</p>
          </CardContent>
        </Card>
      )}

      {(isSimulating || gameResult) && (
        <>
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-xs text-slate-400 mb-1">TOR</p>
                  <p className="text-3xl font-bold text-white tabular-nums">{currentPlay?.homeScore ?? 0}</p>
                </div>
                <div className="text-center px-4">
                  {currentPlay && <p className="text-xs text-slate-500">Q{currentPlay.quarter} | {currentPlay.time}</p>}
                  {!isSimulating && gameResult && <p className="text-xs font-bold text-red-500 mt-1">FINAL</p>}
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs text-slate-400 mb-1">BOS</p>
                  <p className="text-3xl font-bold text-white tabular-nums">{currentPlay?.awayScore ?? 0}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[9px] text-slate-600">
                  <span>BOS Momentum</span><span>TOR Momentum</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#007A33] transition-all duration-300 rounded-l-full" style={{ width: `${100 - momentum}%` }} />
                  <div className="h-full bg-[#CE1141] transition-all duration-300 rounded-r-full" style={{ width: `${momentum}%` }} />
                </div>
              </div>
              {gameResult && (
                <div className="mt-3 flex justify-center gap-2">
                  {gameResult.quarterScores.home.map((_, qi) => (
                    <div key={qi} className="text-center px-2">
                      <p className="text-[9px] text-slate-600 mb-0.5">{qi < 4 ? `Q${qi + 1}` : 'OT'}</p>
                      <p className="text-[10px] text-slate-300 tabular-nums">{gameResult.quarterScores.home[qi]}-{gameResult.quarterScores.away[qi]}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <ShotChart plays={visiblePlays} />

          <Tabs defaultValue="plays" className="w-full">
            <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-3">
              <TabsTrigger value="plays" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-xs">Play-by-Play</TabsTrigger>
              <TabsTrigger value="home-box" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-xs">TOR Box</TabsTrigger>
              <TabsTrigger value="away-box" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-xs">BOS Box</TabsTrigger>
            </TabsList>
            <TabsContent value="plays" className="mt-3">
              <Card className="bg-slate-900/80 border-slate-800">
                <CardContent className="p-2">
                  <div ref={playLogRef} className="max-h-[400px] overflow-y-auto space-y-0.5">
                    {visiblePlays.map((play, i) => (
                      <div key={i} className={cn('flex items-start gap-2 py-1 px-2 rounded text-[10px] animate-in fade-in duration-150', play.isHomeOffense ? 'bg-red-900/10' : 'bg-green-900/10')}>
                        <span className="text-slate-600 shrink-0 w-8 tabular-nums">Q{play.quarter} {play.time}</span>
                        <span className={cn('shrink-0 w-12 text-right tabular-nums font-mono', play.made === true ? 'text-emerald-400' : play.made === false ? 'text-red-400' : 'text-slate-400')}>{play.homeScore}-{play.awayScore}</span>
                        <span className="text-slate-300">{play.description}</span>
                      </div>
                    ))}
                    {visiblePlays.length === 0 && <p className="text-center py-8 text-slate-600 text-xs">Waiting for game to start...</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="home-box" className="mt-3">
              <Card className="bg-slate-900/80 border-slate-800">
                <CardContent className="p-2">
                  <BoxScoreTable boxScore={(gameResult?.homeBoxScore ?? []) as BoxScoreEntry[]} teamName="Toronto Raptors" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="away-box" className="mt-3">
              <Card className="bg-slate-900/80 border-slate-800">
                <CardContent className="p-2">
                  <BoxScoreTable boxScore={(gameResult?.awayBoxScore ?? []) as BoxScoreEntry[]} teamName="Boston Celtics" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {!isSimulating && gameResult && (
            <Card className="bg-slate-900/80 border-slate-800">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Game Leaders</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['points', 'rebounds', 'assists'] as const).map((stat) => {
                    const allPlayers = [...(gameResult.homeBoxScore ?? []), ...(gameResult.awayBoxScore ?? [])] as BoxScoreEntry[];
                    const leader = allPlayers.reduce<BoxScoreEntry | null>((best, p) => (p[stat] > (best?.[stat] ?? 0) ? p : best), null);
                    return (
                      <div key={stat} className="text-center">
                        <p className="text-[9px] text-slate-600 uppercase">{stat}</p>
                        <p className="text-lg font-bold text-white">{leader?.[stat] ?? 0}</p>
                        <p className="text-[10px] text-slate-400 truncate">{leader?.name ?? '-'}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
