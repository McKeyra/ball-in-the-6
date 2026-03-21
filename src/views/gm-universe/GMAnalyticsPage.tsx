'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ComparisonPlayer {
  id: string;
  name: string;
  stats: Record<string, number>;
}

const COMPARISON_PLAYERS: ComparisonPlayer[] = [
  { id: 'c1', name: 'Scottie Barnes', stats: { scoring: 88, playmaking: 82, defense: 85, rebounding: 80, shooting: 72, athleticism: 90 } },
  { id: 'c2', name: 'Jayson Tatum', stats: { scoring: 92, playmaking: 78, defense: 80, rebounding: 76, shooting: 86, athleticism: 84 } },
  { id: 'c3', name: 'Jaylen Brown', stats: { scoring: 87, playmaking: 72, defense: 82, rebounding: 74, shooting: 80, athleticism: 88 } },
  { id: 'c4', name: 'Immanuel Quickley', stats: { scoring: 80, playmaking: 84, defense: 70, rebounding: 60, shooting: 82, athleticism: 76 } },
  { id: 'c5', name: 'RJ Barrett', stats: { scoring: 82, playmaking: 76, defense: 74, rebounding: 72, shooting: 70, athleticism: 80 } },
];

interface LeagueLeader { name: string; team: string; value: number; }

const LEAGUE_LEADERS: Record<string, LeagueLeader[]> = {
  scoring: [
    { name: 'Luka Doncic', team: 'DAL', value: 33.8 }, { name: 'Shai Gilgeous-Alexander', team: 'OKC', value: 31.2 },
    { name: 'Giannis Antetokounmpo', team: 'MIL', value: 30.5 }, { name: 'Jayson Tatum', team: 'BOS', value: 28.4 },
    { name: 'Kevin Durant', team: 'PHX', value: 27.8 }, { name: 'Joel Embiid', team: 'PHI', value: 27.3 },
    { name: 'Anthony Edwards', team: 'MIN', value: 26.9 }, { name: 'Devin Booker', team: 'PHX', value: 26.1 },
    { name: 'LeBron James', team: 'LAL', value: 25.7 }, { name: 'Scottie Barnes', team: 'TOR', value: 24.2 },
  ],
  rebounding: [
    { name: 'Domantas Sabonis', team: 'SAC', value: 13.4 }, { name: 'Nikola Jokic', team: 'DEN', value: 12.8 },
    { name: 'Giannis Antetokounmpo', team: 'MIL', value: 11.9 }, { name: 'Rudy Gobert', team: 'MIN', value: 11.5 },
    { name: 'Anthony Davis', team: 'LAL', value: 11.2 }, { name: 'Joel Embiid', team: 'PHI', value: 10.8 },
    { name: 'Jakob Poeltl', team: 'TOR', value: 10.6 }, { name: 'Bam Adebayo', team: 'MIA', value: 10.2 },
    { name: 'Karl-Anthony Towns', team: 'NYK', value: 9.8 }, { name: 'Steven Adams', team: 'HOU', value: 9.5 },
  ],
  assists: [
    { name: 'Tyrese Haliburton', team: 'IND', value: 10.8 }, { name: 'Trae Young', team: 'ATL', value: 10.4 },
    { name: 'Luka Doncic', team: 'DAL', value: 9.8 }, { name: 'Nikola Jokic', team: 'DEN', value: 9.2 },
    { name: 'LaMelo Ball', team: 'CHA', value: 8.4 }, { name: 'James Harden', team: 'LAC', value: 8.1 },
    { name: 'Dejounte Murray', team: 'NOP', value: 7.8 }, { name: 'Immanuel Quickley', team: 'TOR', value: 7.5 },
    { name: 'Fred VanVleet', team: 'HOU', value: 7.2 }, { name: 'Shai Gilgeous-Alexander', team: 'OKC', value: 6.8 },
  ],
};

const CHAMPIONSHIP_ODDS = [
  { team: 'Boston Celtics', abbr: 'BOS', odds: 22.5 }, { team: 'Oklahoma City Thunder', abbr: 'OKC', odds: 18.0 },
  { team: 'Denver Nuggets', abbr: 'DEN', odds: 12.5 }, { team: 'Milwaukee Bucks', abbr: 'MIL', odds: 10.0 },
  { team: 'Cleveland Cavaliers', abbr: 'CLE', odds: 8.0 }, { team: 'New York Knicks', abbr: 'NYK', odds: 6.5 },
  { team: 'Minnesota Timberwolves', abbr: 'MIN', odds: 5.0 }, { team: 'Dallas Mavericks', abbr: 'DAL', odds: 4.5 },
  { team: 'Phoenix Suns', abbr: 'PHX', odds: 3.5 }, { team: 'Toronto Raptors', abbr: 'TOR', odds: 2.0 },
];

const MVP_PREDICTIONS = [
  { name: 'Shai Gilgeous-Alexander', team: 'OKC', probability: 32 }, { name: 'Luka Doncic', team: 'DAL', probability: 22 },
  { name: 'Nikola Jokic', team: 'DEN', probability: 18 }, { name: 'Giannis Antetokounmpo', team: 'MIL', probability: 12 },
  { name: 'Jayson Tatum', team: 'BOS', probability: 8 }, { name: 'Scottie Barnes', team: 'TOR', probability: 3 },
];

const DIMENSIONS = ['scoring', 'playmaking', 'defense', 'rebounding', 'shooting', 'athleticism'] as const;

function SpiderChart({ player1, player2, size = 200 }: { player1: ComparisonPlayer; player2: ComparisonPlayer; size?: number }): React.ReactElement {
  const center = size / 2;
  const radius = (size / 2) - 30;
  const angleStep = (2 * Math.PI) / DIMENSIONS.length;
  const getPoint = (dimIndex: number, value: number): { x: number; y: number } => {
    const angle = angleStep * dimIndex - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };
  const gridLevels = [25, 50, 75, 100];
  const p1Points = DIMENSIONS.map((d, i) => getPoint(i, player1.stats[d]));
  const p2Points = DIMENSIONS.map((d, i) => getPoint(i, player2.stats[d]));
  const p1Path = p1Points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const p2Path = p2Points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {gridLevels.map((level) => {
        const points = DIMENSIONS.map((_, i) => getPoint(i, level));
        const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={level} d={d} fill="none" stroke="#334155" strokeWidth="0.5" />;
      })}
      {DIMENSIONS.map((_, i) => {
        const end = getPoint(i, 100);
        return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="#334155" strokeWidth="0.5" />;
      })}
      <path d={p1Path} fill="rgba(220, 38, 38, 0.15)" stroke="#dc2626" strokeWidth="1.5" />
      <path d={p2Path} fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth="1.5" />
      {DIMENSIONS.map((dim, i) => {
        const labelPoint = getPoint(i, 118);
        return <text key={dim} x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[9px] font-medium capitalize">{dim}</text>;
      })}
    </svg>
  );
}

export function GMAnalyticsPage(): React.ReactElement {
  const [player1Id, setPlayer1Id] = useState('c1');
  const [player2Id, setPlayer2Id] = useState('c2');
  const [leaderCategory, setLeaderCategory] = useState('scoring');
  const player1 = COMPARISON_PLAYERS.find((p) => p.id === player1Id);
  const player2 = COMPARISON_PLAYERS.find((p) => p.id === player2Id);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-white">Analytics</h1>
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-4">
          <TabsTrigger value="comparison" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-[10px]">Compare</TabsTrigger>
          <TabsTrigger value="leaders" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-[10px]">Leaders</TabsTrigger>
          <TabsTrigger value="championship" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-[10px]">Title Odds</TabsTrigger>
          <TabsTrigger value="mvp" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-[10px]">MVP</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select value={player1Id} onValueChange={setPlayer1Id}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white text-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">{COMPARISON_PLAYERS.map((p) => <SelectItem key={p.id} value={p.id} className="text-white text-xs">{p.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={player2Id} onValueChange={setPlayer2Id}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white text-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">{COMPARISON_PLAYERS.map((p) => <SelectItem key={p.id} value={p.id} className="text-white text-xs">{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-1 rounded bg-red-500" /> {player1?.name}</span>
                <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-1 rounded bg-blue-500" /> {player2?.name}</span>
              </div>
              {player1 && player2 && <SpiderChart player1={player1} player2={player2} />}
              <div className="mt-4 space-y-2">
                {DIMENSIONS.map((dim) => (
                  <div key={dim} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-20 capitalize">{dim}</span>
                    <div className="flex-1 flex items-center gap-1">
                      <span className="text-[10px] text-red-400 w-6 text-right tabular-nums">{player1?.stats[dim]}</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                        <div className="absolute left-0 h-full bg-red-500/50 rounded-full" style={{ width: `${player1?.stats[dim]}%` }} />
                        <div className="absolute left-0 h-full bg-blue-500/50 rounded-full" style={{ width: `${player2?.stats[dim]}%` }} />
                      </div>
                      <span className="text-[10px] text-blue-400 w-6 tabular-nums">{player2?.stats[dim]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaders" className="mt-4 space-y-3">
          <div className="flex gap-1.5">
            {Object.keys(LEAGUE_LEADERS).map((cat) => (
              <button key={cat} onClick={() => setLeaderCategory(cat)} className={cn('px-3 py-1 rounded-full text-xs font-medium capitalize transition-all', leaderCategory === cat ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700')}>{cat}</button>
            ))}
          </div>
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-4">
              <div className="space-y-1">
                {LEAGUE_LEADERS[leaderCategory]?.map((player, i) => {
                  const isTOR = player.team === 'TOR';
                  const max = LEAGUE_LEADERS[leaderCategory][0]?.value ?? 1;
                  return (
                    <div key={i} className={cn('flex items-center gap-2 py-1.5 rounded px-2', isTOR && 'bg-red-600/5')}>
                      <span className={cn('w-5 text-right text-xs font-bold', i < 3 ? 'text-amber-400' : 'text-slate-600')}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('text-xs font-medium truncate', isTOR ? 'text-red-400' : 'text-white')}>{player.name}</span>
                          <span className="text-[9px] text-slate-600">{player.team}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                          <div className={cn('h-full rounded-full', isTOR ? 'bg-red-500' : 'bg-slate-600')} style={{ width: `${(player.value / max) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white tabular-nums w-10 text-right">{player.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="championship" className="mt-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Championship Probability</h3>
              <div className="space-y-2">
                {CHAMPIONSHIP_ODDS.map((team, i) => {
                  const isTOR = team.abbr === 'TOR';
                  return (
                    <div key={team.abbr} className={cn('flex items-center gap-2 py-1.5 px-2 rounded', isTOR && 'bg-red-600/5')}>
                      <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                      <span className={cn('text-xs font-medium flex-1', isTOR ? 'text-red-400' : 'text-white')}>{team.team}</span>
                      <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', isTOR ? 'bg-red-500' : i === 0 ? 'bg-amber-500' : 'bg-slate-600')} style={{ width: `${(team.odds / 25) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white tabular-nums w-12 text-right">{team.odds}%</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mvp" className="mt-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-white mb-3">MVP Race</h3>
              <div className="space-y-3">
                {MVP_PREDICTIONS.map((player, i) => {
                  const isTOR = player.team === 'TOR';
                  return (
                    <div key={i} className={cn('flex items-center gap-3 py-2 border-b border-slate-800/50 last:border-0', isTOR && 'bg-red-600/5 rounded px-2')}>
                      <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold', i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-500')}>{i + 1}</span>
                      <div className="flex-1">
                        <p className={cn('text-xs font-medium', isTOR ? 'text-red-400' : 'text-white')}>{player.name}</p>
                        <p className="text-[10px] text-slate-500">{player.team}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{player.probability}%</p>
                        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full', isTOR ? 'bg-red-500' : 'bg-amber-500')} style={{ width: `${(player.probability / 35) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
