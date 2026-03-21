'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface StandingsRow {
  team: string;
  abbr: string;
  w: number;
  l: number;
  home: string;
  away: string;
  streak: string;
  gb: string;
}

interface GameResult {
  outcome: 'W' | 'L';
  score: string;
}

interface ScheduleGame {
  id: number;
  date: string;
  opponent: string;
  location: 'Home' | 'Away';
  result: GameResult | null;
}

const EAST_STANDINGS: StandingsRow[] = [
  { team: 'Boston Celtics', abbr: 'BOS', w: 48, l: 14, home: '28-3', away: '20-11', streak: 'W5', gb: '-' },
  { team: 'Cleveland Cavaliers', abbr: 'CLE', w: 44, l: 18, home: '25-6', away: '19-12', streak: 'W2', gb: '4' },
  { team: 'Milwaukee Bucks', abbr: 'MIL', w: 42, l: 20, home: '24-7', away: '18-13', streak: 'L1', gb: '6' },
  { team: 'New York Knicks', abbr: 'NYK', w: 40, l: 22, home: '23-8', away: '17-14', streak: 'W3', gb: '8' },
  { team: 'Toronto Raptors', abbr: 'TOR', w: 34, l: 28, home: '20-11', away: '14-17', streak: 'L2', gb: '14' },
  { team: 'Miami Heat', abbr: 'MIA', w: 33, l: 29, home: '19-12', away: '14-17', streak: 'W1', gb: '15' },
  { team: 'Philadelphia 76ers', abbr: 'PHI', w: 32, l: 30, home: '20-11', away: '12-19', streak: 'L3', gb: '16' },
  { team: 'Indiana Pacers', abbr: 'IND', w: 31, l: 31, home: '18-13', away: '13-18', streak: 'W1', gb: '17' },
  { team: 'Orlando Magic', abbr: 'ORL', w: 30, l: 32, home: '18-13', away: '12-19', streak: 'L1', gb: '18' },
  { team: 'Chicago Bulls', abbr: 'CHI', w: 28, l: 34, home: '16-15', away: '12-19', streak: 'L2', gb: '20' },
  { team: 'Atlanta Hawks', abbr: 'ATL', w: 26, l: 36, home: '15-16', away: '11-20', streak: 'W1', gb: '22' },
  { team: 'Brooklyn Nets', abbr: 'BKN', w: 22, l: 40, home: '14-17', away: '8-23', streak: 'L4', gb: '26' },
  { team: 'Charlotte Hornets', abbr: 'CHA', w: 18, l: 44, home: '12-19', away: '6-25', streak: 'L1', gb: '30' },
  { team: 'Detroit Pistons', abbr: 'DET', w: 15, l: 47, home: '10-21', away: '5-26', streak: 'L6', gb: '33' },
  { team: 'Washington Wizards', abbr: 'WAS', w: 12, l: 50, home: '8-23', away: '4-27', streak: 'L3', gb: '36' },
];

const WEST_STANDINGS: StandingsRow[] = [
  { team: 'Oklahoma City Thunder', abbr: 'OKC', w: 50, l: 12, home: '28-3', away: '22-9', streak: 'W8', gb: '-' },
  { team: 'Denver Nuggets', abbr: 'DEN', w: 44, l: 18, home: '26-5', away: '18-13', streak: 'W1', gb: '6' },
  { team: 'Minnesota Timberwolves', abbr: 'MIN', w: 42, l: 20, home: '24-7', away: '18-13', streak: 'W3', gb: '8' },
  { team: 'Dallas Mavericks', abbr: 'DAL', w: 38, l: 24, home: '21-10', away: '17-14', streak: 'L1', gb: '12' },
  { team: 'Phoenix Suns', abbr: 'PHX', w: 37, l: 25, home: '22-9', away: '15-16', streak: 'W2', gb: '13' },
  { team: 'Los Angeles Lakers', abbr: 'LAL', w: 36, l: 26, home: '21-10', away: '15-16', streak: 'W1', gb: '14' },
  { team: 'LA Clippers', abbr: 'LAC', w: 35, l: 27, home: '20-11', away: '15-16', streak: 'L2', gb: '15' },
  { team: 'Sacramento Kings', abbr: 'SAC', w: 34, l: 28, home: '19-12', away: '15-16', streak: 'W2', gb: '16' },
  { team: 'Golden State Warriors', abbr: 'GSW', w: 33, l: 29, home: '20-11', away: '13-18', streak: 'L1', gb: '17' },
  { team: 'New Orleans Pelicans', abbr: 'NOP', w: 31, l: 31, home: '18-13', away: '13-18', streak: 'W1', gb: '19' },
  { team: 'Houston Rockets', abbr: 'HOU', w: 28, l: 34, home: '16-15', away: '12-19', streak: 'L3', gb: '22' },
  { team: 'Memphis Grizzlies', abbr: 'MEM', w: 25, l: 37, home: '15-16', away: '10-21', streak: 'W1', gb: '25' },
  { team: 'Utah Jazz', abbr: 'UTA', w: 22, l: 40, home: '14-17', away: '8-23', streak: 'L2', gb: '28' },
  { team: 'San Antonio Spurs', abbr: 'SAS', w: 18, l: 44, home: '12-19', away: '6-25', streak: 'L4', gb: '32' },
  { team: 'Portland Trail Blazers', abbr: 'POR', w: 14, l: 48, home: '10-21', away: '4-27', streak: 'L5', gb: '36' },
];

const SCHEDULE_OPPONENTS = [
  'BOS', 'NYK', 'MIL', 'MIA', 'PHI', 'CLE', 'IND', 'ORL', 'CHI', 'ATL', 'BKN', 'CHA', 'DET', 'WAS',
  'LAL', 'GSW', 'DEN', 'DAL', 'PHX', 'OKC', 'MIN', 'LAC', 'SAC', 'HOU', 'MEM', 'NOP', 'POR', 'UTA', 'SAS',
];

function generateSchedule(): ScheduleGame[] {
  const schedule: ScheduleGame[] = [];
  const startDate = new Date(2025, 9, 22);
  const GAMES_PLAYED = 62;

  for (let i = 0; i < 82; i++) {
    const gameDate = new Date(startDate);
    gameDate.setDate(startDate.getDate() + Math.floor(i * 2.2));
    const opp = SCHEDULE_OPPONENTS[i % SCHEDULE_OPPONENTS.length];
    const isHome = i % 3 !== 0;
    const isPast = i < GAMES_PLAYED;

    const result: GameResult | null = isPast
      ? (Math.random() > 0.45
        ? { outcome: 'W', score: `${100 + Math.floor(Math.random() * 20)}-${90 + Math.floor(Math.random() * 15)}` }
        : { outcome: 'L', score: `${88 + Math.floor(Math.random() * 15)}-${100 + Math.floor(Math.random() * 20)}` })
      : null;

    schedule.push({
      id: i,
      date: gameDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      opponent: opp,
      location: isHome ? 'Home' : 'Away',
      result,
    });
  }
  return schedule;
}

function StandingsTable({ standings }: { standings: StandingsRow[] }): React.ReactElement {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left py-2 px-2 text-slate-500 w-6">#</th>
            <th className="text-left py-2 px-2 text-slate-500">Team</th>
            <th className="text-center py-2 px-1 text-slate-500">W</th>
            <th className="text-center py-2 px-1 text-slate-500">L</th>
            <th className="text-center py-2 px-1 text-slate-500">PCT</th>
            <th className="text-center py-2 px-1 text-slate-500">GB</th>
            <th className="text-center py-2 px-1 text-slate-500 hidden sm:table-cell">Home</th>
            <th className="text-center py-2 px-1 text-slate-500 hidden sm:table-cell">Away</th>
            <th className="text-center py-2 px-1 text-slate-500">Strk</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => {
            const pct = (row.w / (row.w + row.l)).toFixed(3).slice(1);
            const isPlayoff = i < 6;
            const isPlayIn = i >= 6 && i < 10;
            const isTOR = row.abbr === 'TOR';
            return (
              <tr
                key={row.abbr}
                className={cn(
                  'border-b border-slate-800/50 transition-colors',
                  isTOR && 'bg-red-600/5',
                  i === 5 && 'border-b-2 border-b-slate-600',
                  i === 9 && 'border-b-2 border-b-slate-700',
                )}
              >
                <td className="py-2 px-2 text-slate-600">{i + 1}</td>
                <td className={cn('py-2 px-2 font-medium', isTOR ? 'text-red-400' : 'text-white')}>
                  <span className="hidden sm:inline">{row.team}</span>
                  <span className="sm:hidden">{row.abbr}</span>
                  {isPlayoff && <span className="text-[8px] ml-1 text-emerald-500">P</span>}
                  {isPlayIn && <span className="text-[8px] ml-1 text-amber-500">PI</span>}
                </td>
                <td className="py-2 px-1 text-center text-slate-300">{row.w}</td>
                <td className="py-2 px-1 text-center text-slate-400">{row.l}</td>
                <td className="py-2 px-1 text-center text-slate-300">{pct}</td>
                <td className="py-2 px-1 text-center text-slate-500">{row.gb}</td>
                <td className="py-2 px-1 text-center text-slate-500 hidden sm:table-cell">{row.home}</td>
                <td className="py-2 px-1 text-center text-slate-500 hidden sm:table-cell">{row.away}</td>
                <td className={cn(
                  'py-2 px-1 text-center font-medium',
                  row.streak.startsWith('W') ? 'text-emerald-400' : 'text-red-400',
                )}>
                  {row.streak}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type ScheduleFilter = 'all' | 'upcoming' | 'past';

export function SeasonPage(): React.ReactElement {
  const schedule = useMemo(() => generateSchedule(), []);
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>('all');

  const filteredSchedule = useMemo(() => {
    if (scheduleFilter === 'past') return schedule.filter((g) => g.result);
    if (scheduleFilter === 'upcoming') return schedule.filter((g) => !g.result);
    return schedule;
  }, [schedule, scheduleFilter]);

  const FILTER_OPTIONS: ScheduleFilter[] = ['all', 'upcoming', 'past'];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-white">Season</h1>

      <Tabs defaultValue="standings" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-3">
          <TabsTrigger value="standings" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-xs">
            Standings
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-xs">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-xs">
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="space-y-4 mt-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Eastern Conference</h3>
              <StandingsTable standings={EAST_STANDINGS} />
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Western Conference</h3>
              <StandingsTable standings={WEST_STANDINGS} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <div className="flex gap-1.5 mb-3">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setScheduleFilter(f)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium capitalize transition-all',
                  scheduleFilter === f ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700',
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-2">
              <div className="max-h-[500px] overflow-y-auto space-y-0.5">
                {filteredSchedule.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between py-2 px-2 rounded hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-600 w-14">{game.date}</span>
                      <span className="text-xs text-white">
                        {game.location === 'Home' ? 'vs' : '@'} {game.opponent}
                      </span>
                      <span className="text-[9px] text-slate-600">{game.location}</span>
                    </div>
                    {game.result ? (
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-bold',
                          game.result.outcome === 'W' ? 'text-emerald-400' : 'text-red-400',
                        )}>
                          {game.result.outcome}
                        </span>
                        <span className="text-[10px] text-slate-500 tabular-nums">
                          {game.result.score}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600">-</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Recent Results</h3>
              <div className="space-y-1">
                {schedule
                  .filter((g) => g.result)
                  .slice(-10)
                  .reverse()
                  .map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between py-2 px-2 border-b border-slate-800/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold',
                          game.result!.outcome === 'W' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400',
                        )}>
                          {game.result!.outcome}
                        </span>
                        <div>
                          <p className="text-xs text-white">
                            {game.location === 'Home' ? 'vs' : '@'} {game.opponent}
                          </p>
                          <p className="text-[10px] text-slate-600">{game.date}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-300 tabular-nums font-mono">{game.result!.score}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
