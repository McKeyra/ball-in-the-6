'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SportMeta {
  id: string;
  label: string;
  emoji: string;
}

interface MonthlyROI {
  month: string;
  roi: number;
}

interface SeasonStats {
  totalPicks: number;
  winRate: number;
  roi: number;
  streak: string;
  topPickWinRate: number;
  monthlyROI: MonthlyROI[];
}

interface RecentPick {
  id: number;
  sport: string;
  matchup: string;
  pick: string;
  confidence: number;
  result: string;
  odds: string;
}

interface QuickLink {
  label: string;
  path: string;
  icon: string;
}

const SPORTS: SportMeta[] = [
  { id: 'nba', label: 'NBA', emoji: '\u{1F3C0}' },
  { id: 'nfl', label: 'NFL', emoji: '\u{1F3C8}' },
  { id: 'mlb', label: 'MLB', emoji: '\u26BE' },
  { id: 'nhl', label: 'NHL', emoji: '\u{1F3D2}' },
  { id: 'soccer', label: 'Soccer', emoji: '\u26BD' },
  { id: 'ncaab', label: 'NCAAB', emoji: '\u{1F3C0}' },
  { id: 'ncaaf', label: 'NCAAF', emoji: '\u{1F3C8}' },
  { id: 'mma', label: 'MMA', emoji: '\u{1F94A}' },
  { id: 'tennis', label: 'Tennis', emoji: '\u{1F3BE}' },
  { id: 'golf', label: 'Golf', emoji: '\u26F3' },
  { id: 'esports', label: 'Esports', emoji: '\u{1F3AE}' },
];

const QUICK_LINKS: QuickLink[] = [
  { label: "Today's Picks", path: '/vance/picks', icon: 'P' },
  { label: 'Reports', path: '/vance/reports', icon: 'R' },
  { label: 'Players', path: '/vance/players', icon: 'AI6' },
  { label: 'Line Movement', path: '/vance/line-movement', icon: 'L' },
];

const SEASON_STATS: SeasonStats = {
  totalPicks: 847,
  winRate: 61.3,
  roi: 14.7,
  streak: 'W4',
  topPickWinRate: 72.1,
  monthlyROI: [
    { month: 'Oct', roi: 8.2 },
    { month: 'Nov', roi: 12.4 },
    { month: 'Dec', roi: 18.9 },
    { month: 'Jan', roi: 11.2 },
    { month: 'Feb', roi: 16.8 },
    { month: 'Mar', roi: 14.7 },
  ],
};

const RECENT_PICKS: RecentPick[] = [
  { id: 1, sport: 'nba', matchup: 'TOR vs BOS', pick: 'TOR +6.5', confidence: 88, result: 'won', odds: '-110' },
  { id: 2, sport: 'nba', matchup: 'LAL vs GSW', pick: 'Over 224.5', confidence: 85, result: 'won', odds: '-105' },
  { id: 3, sport: 'nfl', matchup: 'KC vs BUF', pick: 'KC -3', confidence: 82, result: 'lost', odds: '-110' },
  { id: 4, sport: 'nba', matchup: 'MIL vs PHI', pick: 'MIL ML', confidence: 79, result: 'won', odds: '-145' },
  { id: 5, sport: 'mlb', matchup: 'NYY vs BOS', pick: 'Under 8.5', confidence: 76, result: 'pending', odds: '-115' },
];

function MiniROIChart({ data }: { data: MonthlyROI[] }): React.ReactElement {
  const max = Math.max(...data.map((d) => d.roi), 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className={cn(
              'w-full rounded-t transition-all',
              d.roi >= 15 ? 'bg-emerald-500' : d.roi >= 10 ? 'bg-amber-500' : 'bg-neutral-600',
            )}
            style={{ height: `${Math.max((d.roi / max) * 100, 5)}%` }}
          />
          <span className="text-[7px] text-neutral-600">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export function VanceDashboard(): React.ReactElement {
  const stats = SEASON_STATS;
  const recentPicks = RECENT_PICKS;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 via-red-950/20 to-neutral-900 border border-neutral-800 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">Vance</h1>
            <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">AI6 Sports Intelligence</span>
          </div>
          <p className="text-xs text-neutral-400 mb-4">AI-powered picks across 11 sports</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white tabular-nums">{stats.totalPicks}</div>
              <div className="text-[10px] text-neutral-500">Total Picks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400 tabular-nums">{stats.winRate}%</div>
              <div className="text-[10px] text-neutral-500">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#C9A92C] tabular-nums">+{stats.roi}%</div>
              <div className="text-[10px] text-neutral-500">Season ROI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sport Filter Bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {SPORTS.map((sport) => (
          <Link
            key={sport.id}
            href={`/vance/picks?sport=${sport.id}`}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-red-600/30 transition-all shrink-0"
          >
            <span className="text-sm">{sport.emoji}</span>
            <span className="text-[10px] text-neutral-400 font-medium">{sport.label}</span>
          </Link>
        ))}
      </div>

      {/* ROI Chart + Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
          <h3 className="text-xs text-neutral-500 mb-3">Monthly ROI Trend</h3>
          <MiniROIChart data={stats.monthlyROI} />
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
          <h3 className="text-xs text-neutral-500 mb-3">Current Session</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className={cn(
                'text-xl font-bold',
                stats.streak.startsWith('W') ? 'text-emerald-400' : 'text-red-400',
              )}>
                {stats.streak}
              </div>
              <div className="text-[10px] text-neutral-600">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#C9A92C]">{stats.topPickWinRate}%</div>
              <div className="text-[10px] text-neutral-600">Top Pick WR</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Top Picks */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Recent Picks</h3>
          <Link href="/vance/picks" className="text-[10px] text-red-400 hover:text-red-300 transition-colors">
            View All
          </Link>
        </div>
        <div className="space-y-1.5">
          {recentPicks.map((pick) => (
            <div
              key={pick.id}
              className="flex items-center justify-between py-2 px-2 rounded hover:bg-neutral-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{SPORTS.find((s) => s.id === pick.sport)?.emoji || ''}</span>
                <div>
                  <p className="text-xs text-white font-medium">{pick.matchup}</p>
                  <p className="text-[10px] text-neutral-500">{pick.pick} ({pick.odds})</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded',
                  pick.confidence >= 85 ? 'bg-[#C9A92C]/10 text-[#C9A92C]' :
                  pick.confidence >= 70 ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-blue-500/10 text-blue-400',
                )}>
                  {pick.confidence}%
                </span>
                <span className={cn(
                  'text-[10px] font-bold uppercase',
                  pick.result === 'won' ? 'text-emerald-400' :
                  pick.result === 'lost' ? 'text-red-400' :
                  'text-neutral-500',
                )}>
                  {pick.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className="bg-neutral-900/80 border border-neutral-800 rounded-xl cursor-pointer hover:border-red-600/50 transition-all p-3 text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center mx-auto mb-1">
              <span className="text-[10px] font-bold text-red-500">{link.icon}</span>
            </div>
            <p className="text-[10px] text-neutral-300">{link.label}</p>
          </Link>
        ))}
      </div>

      <p className="text-[9px] text-neutral-700 text-center">
        Vance AI predictions are for entertainment and informational purposes only. Not financial advice. Please gamble responsibly.
      </p>
    </div>
  );
}
