'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const SALARY_CAP = 136000000;

interface QuickLink {
  label: string;
  path: string;
  icon: string;
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'Roster', path: '/gm-universe/roster', icon: 'R' },
  { label: 'Trade', path: '/gm-universe/trade', icon: 'T' },
  { label: 'Season', path: '/gm-universe/season', icon: 'S' },
  { label: 'Draft', path: '/gm-universe/draft', icon: 'D' },
  { label: 'Free Agency', path: '/gm-universe/free-agency', icon: 'FA' },
  { label: 'Analytics', path: '/gm-universe/analytics', icon: 'A' },
];

interface SelectedTeam {
  id: string;
  name: string;
  arena: string;
  color: string;
}

function getSelectedTeam(): SelectedTeam | null {
  try {
    const raw = localStorage.getItem('gm_selected_team');
    return raw ? JSON.parse(raw) as SelectedTeam : null;
  } catch {
    return null;
  }
}

interface DashboardData {
  capSpace: { total: number; used: number };
  standings: { conference: string; position: number; wins: number; losses: number };
  nextGame: { opponent: string; oppAbbr: string; date: string; location: string };
  topPerformers: { name: string; ppg: number; rpg: number; apg: number; overall: number }[];
}

function getMockDashboardData(): DashboardData {
  return {
    capSpace: { total: SALARY_CAP, used: 118500000 },
    standings: { conference: 'Eastern', position: 5, wins: 34, losses: 28 },
    nextGame: { opponent: 'Boston Celtics', oppAbbr: 'BOS', date: 'Tomorrow 7:30 PM', location: 'Home' },
    topPerformers: [
      { name: 'Scottie Barnes', ppg: 24.2, rpg: 8.1, apg: 6.3, overall: 88 },
      { name: 'Immanuel Quickley', ppg: 18.7, rpg: 3.2, apg: 7.5, overall: 82 },
      { name: 'RJ Barrett', ppg: 19.4, rpg: 5.8, apg: 3.9, overall: 80 },
    ],
  };
}

export function GMDashboardPage(): React.ReactElement {
  const router = useRouter();
  const team = getSelectedTeam();

  const data = useMemo(() => getMockDashboardData(), []);

  if (!team) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-white">No Team Selected</h2>
        <p className="text-sm text-slate-400">Pick a team to start your GM career.</p>
        <Button onClick={() => router.push('/gm-universe')} className="bg-red-600 hover:bg-red-700 text-white">
          Select Team
        </Button>
      </div>
    );
  }

  const capUsedPct = Math.round((data.capSpace.used / data.capSpace.total) * 100);
  const capRemaining = data.capSpace.total - data.capSpace.used;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white"
          style={{ backgroundColor: team.color }}
        >
          {team.id}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{team.name}</h1>
          <p className="text-xs text-slate-400">GM Mode | {team.arena}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/gm-universe')}
          className="ml-auto border-slate-700 text-slate-400 hover:bg-slate-800 text-xs"
        >
          Switch Team
        </Button>
      </div>

      <Card className="bg-slate-900/80 border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">Salary Cap</h3>
            <span className="text-xs text-slate-400">
              ${(data.capSpace.used / 1000000).toFixed(1)}M / ${(data.capSpace.total / 1000000).toFixed(0)}M
            </span>
          </div>
          <Progress value={capUsedPct} className="h-2 bg-slate-800" />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-slate-600">{capUsedPct}% used</span>
            <span className={cn(
              'text-[10px] font-medium',
              capRemaining > 10000000 ? 'text-emerald-400' : capRemaining > 0 ? 'text-amber-400' : 'text-red-400',
            )}>
              ${(capRemaining / 1000000).toFixed(1)}M remaining
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="bg-slate-900/80 border-slate-800">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Standings</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">#{data.standings.position}</div>
                <div className="text-[10px] text-slate-500">{data.standings.conference} Conf</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{data.standings.wins}-{data.standings.losses}</div>
                <div className="text-[10px] text-slate-500">Record</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Next Game</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                {data.nextGame.oppAbbr}
              </div>
              <div>
                <p className="text-sm text-white font-medium">vs {data.nextGame.opponent}</p>
                <p className="text-[10px] text-slate-500">{data.nextGame.date} | {data.nextGame.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/80 border-slate-800">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Top Performers</h3>
          <div className="space-y-3">
            {data.topPerformers.map((player, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
                    i === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400',
                  )}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs text-white font-medium">{player.name}</p>
                    <p className="text-[10px] text-slate-500">{player.ppg} PPG | {player.rpg} RPG | {player.apg} APG</p>
                  </div>
                </div>
                <div className={cn(
                  'text-sm font-bold',
                  player.overall >= 85 ? 'text-emerald-400' : player.overall >= 80 ? 'text-amber-400' : 'text-slate-400',
                )}>
                  {player.overall}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {QUICK_LINKS.map((link) => (
          <Card
            key={link.path}
            className="bg-slate-900/80 border-slate-800 cursor-pointer hover:border-red-600/50 transition-all"
            onClick={() => router.push(link.path)}
          >
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center mx-auto mb-1">
                <span className="text-xs font-bold text-red-500">{link.icon}</span>
              </div>
              <p className="text-[10px] text-slate-300">{link.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
