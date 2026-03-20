'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  CircleDot,
  Goal,
  Hexagon,
  Shield,
  Trophy,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Calendar,
  MapPin,
  Tv,
  Info,
  ArrowRight,
  Crown,
  Clock,
  Target,
  BarChart3,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import Link from 'next/link';
import { SPORT_CONFIGS } from '@/types/sports';
import type { SportConfig, SportStanding, SportLeaderCategory, SportFixture } from '@/types/sports';
import { getSportData } from '@/lib/sports-data';

/* ---------- Icon Map ---------- */

const SPORT_ICONS: Record<string, React.FC<LucideProps>> = {
  CircleDot,
  Goal,
  Hexagon,
  Shield,
};

const getSportIcon = (iconName: string): React.FC<LucideProps> =>
  SPORT_ICONS[iconName] ?? CircleDot;

/* ---------- Hero Section ---------- */

const SportHero: React.FC<{ config: SportConfig; teamCount: number }> = ({ config, teamCount }) => {
  const Icon = getSportIcon(config.icon);

  return (
    <div
      className="relative overflow-hidden rounded-[20px] p-6"
      style={{ backgroundColor: `${config.color}08` }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${config.color}15` }}
          >
            <Icon className="h-7 w-7" style={{ color: config.color }} />
          </div>
          <div>
            <h1
              className="text-2xl font-black tracking-tight"
              style={{ color: config.color }}
            >
              {config.name}
            </h1>
            <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
              {config.scoringSystem === 'points' ? 'Points-based' : 'Goals-based'} &middot;{' '}
              {config.periods} {config.periodLabel}s &middot; {teamCount} teams
            </p>
          </div>
        </div>

        {/* Quick Info Pills */}
        <div className="flex gap-2 flex-wrap mt-4">
          {config.conferenceNames && (
            <span
              className="rounded-xl px-3 py-1.5 text-[10px] font-bold border"
              style={{
                color: config.color,
                backgroundColor: `${config.color}08`,
                borderColor: `${config.color}15`,
              }}
            >
              {config.conferenceNames[0]} &middot; {config.conferenceNames[1]}
            </span>
          )}
          {config.hasOvertime && (
            <span className="rounded-xl bg-neutral-100/80 px-3 py-1.5 text-[10px] font-bold text-neutral-500 border border-neutral-100">
              Overtime
            </span>
          )}
          {config.hasTies && (
            <span className="rounded-xl bg-neutral-100/80 px-3 py-1.5 text-[10px] font-bold text-neutral-500 border border-neutral-100">
              Ties Allowed
            </span>
          )}
        </div>
      </div>

      {/* Decorative */}
      <div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: config.color }}
      />
      <div
        className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full blur-2xl opacity-10"
        style={{ backgroundColor: config.color }}
      />
    </div>
  );
};

/* ---------- Full Standings Table ---------- */

const FullStandingsTable: React.FC<{
  standings: SportStanding[];
  config: SportConfig;
}> = ({ standings, config }) => {
  const playoffLine = config.id === 'football' ? 3 : 6;

  return (
    <div className="rounded-[20px] border border-neutral-200/60 bg-white overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${config.color}15` }}
          >
            <Trophy className="h-4 w-4" style={{ color: config.color }} />
          </div>
          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">Standings</h3>
        </div>
        <Link
          href={`/sports/${config.id}/standings`}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors hover:opacity-70"
          style={{ color: config.color }}
        >
          Full Table
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="overflow-x-auto px-5 pb-5 pt-3">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-[9px] font-mono text-neutral-300 uppercase pb-2 w-6">#</th>
              <th className="text-left text-[9px] font-mono text-neutral-300 uppercase pb-2">Team</th>
              <th className="text-center text-[9px] font-mono text-neutral-300 uppercase pb-2 w-10">W</th>
              <th className="text-center text-[9px] font-mono text-neutral-300 uppercase pb-2 w-10">L</th>
              {(config.hasTies || config.id === 'hockey') && (
                <th className="text-center text-[9px] font-mono text-neutral-300 uppercase pb-2 w-10">
                  {config.hasTies ? 'T' : 'OTL'}
                </th>
              )}
              {(config.id === 'soccer' || config.id === 'hockey' || config.id === 'football') && (
                <th className="text-center text-[9px] font-mono text-neutral-300 uppercase pb-2 w-10">PTS</th>
              )}
              <th className="text-center text-[9px] font-mono text-neutral-300 uppercase pb-2 w-14">
                {config.scoringSystem === 'goals' ? 'GF' : 'PF'}
              </th>
              <th className="text-center text-[9px] font-mono text-neutral-300 uppercase pb-2 w-14">
                {config.scoringSystem === 'goals' ? 'GA' : 'PA'}
              </th>
              <th className="text-center text-[9px] font-mono text-neutral-300 uppercase pb-2 w-12">STRK</th>
              <th className="text-right text-[9px] font-mono text-neutral-300 uppercase pb-2 w-14">GB</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, i) => (
              <tr
                key={team.teamId}
                className={cn(
                  'transition-colors hover:bg-neutral-50/80',
                  i === playoffLine - 1 && 'border-b-2 border-dashed',
                )}
                style={
                  i === playoffLine - 1
                    ? { borderBottomColor: `${config.color}30` }
                    : undefined
                }
              >
                <td className="py-2.5 text-xs font-black text-neutral-300">{i + 1}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: `${team.teamColor}15` }}
                    >
                      <span className="text-[8px] font-black" style={{ color: team.teamColor }}>
                        {team.teamAbbr}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-neutral-900">{team.teamName}</span>
                  </div>
                </td>
                <td className="py-2.5 text-xs font-mono text-neutral-700 text-center">{team.wins}</td>
                <td className="py-2.5 text-xs font-mono text-neutral-700 text-center">{team.losses}</td>
                {(config.hasTies || config.id === 'hockey') && (
                  <td className="py-2.5 text-xs font-mono text-neutral-400 text-center">
                    {config.hasTies ? (team.ties ?? 0) : (team.overtimeLosses ?? 0)}
                  </td>
                )}
                {(config.id === 'soccer' || config.id === 'hockey' || config.id === 'football') && (
                  <td className="py-2.5 text-center">
                    <span
                      className="text-xs font-black font-mono"
                      style={{ color: config.color }}
                    >
                      {team.points}
                    </span>
                  </td>
                )}
                <td className="py-2.5 text-xs font-mono text-neutral-500 text-center">
                  {typeof team.pointsFor === 'number' && team.pointsFor % 1 !== 0
                    ? team.pointsFor.toFixed(1)
                    : team.pointsFor}
                </td>
                <td className="py-2.5 text-xs font-mono text-neutral-500 text-center">
                  {typeof team.pointsAgainst === 'number' && team.pointsAgainst % 1 !== 0
                    ? team.pointsAgainst.toFixed(1)
                    : team.pointsAgainst}
                </td>
                <td className="py-2.5 text-center">
                  <span
                    className={cn(
                      'text-[10px] font-black font-mono',
                      team.streak.startsWith('W')
                        ? 'text-emerald-500'
                        : team.streak.startsWith('L')
                          ? 'text-red-400'
                          : 'text-neutral-400',
                    )}
                  >
                    {team.streak}
                  </span>
                </td>
                <td className="py-2.5 text-xs font-mono text-neutral-400 text-right">
                  {team.gamesBack === 0 ? '—' : team.gamesBack.toFixed(0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Playoff indicator */}
      <div className="flex items-center gap-2 px-5 pb-4">
        <div
          className="h-0.5 w-6 rounded-full"
          style={{ backgroundColor: `${config.color}40` }}
        />
        <span className="text-[9px] font-mono text-neutral-300">Playoff line</span>
      </div>
    </div>
  );
};

/* ---------- Leader Tables ---------- */

const LeaderTables: React.FC<{
  leaderCategories: SportLeaderCategory[];
  config: SportConfig;
}> = ({ leaderCategories, config }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${config.color}15` }}
      >
        <TrendingUp className="h-4 w-4" style={{ color: config.color }} />
      </div>
      <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">League Leaders</h3>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {leaderCategories.map((lc) => (
        <div
          key={lc.category.key}
          className="rounded-[20px] border border-neutral-200/60 bg-white p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: config.color }}
            >
              {lc.category.label}
            </span>
            <span className="text-[9px] font-mono text-neutral-300 uppercase">{lc.category.abbr}</span>
          </div>

          <div className="space-y-1">
            {lc.leaders.map((leader, i) => (
              <div
                key={leader.playerId}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2 transition-colors',
                  i === 0 ? '' : 'hover:bg-neutral-50/80',
                )}
                style={i === 0 ? { backgroundColor: `${config.color}06` } : undefined}
              >
                <span
                  className={cn('text-xs font-black w-4', i === 0 ? '' : 'text-neutral-300')}
                  style={i === 0 ? { color: config.color } : undefined}
                >
                  {leader.rank}
                </span>
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg text-[9px] font-black shrink-0',
                    i === 0 ? 'text-white' : 'bg-neutral-100 text-neutral-500',
                  )}
                  style={i === 0 ? { backgroundColor: config.color } : undefined}
                >
                  {leader.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-neutral-900 truncate">{leader.playerName}</p>
                  <p className="text-[9px] text-neutral-400 font-mono">{leader.teamAbbr}</p>
                </div>
                <span
                  className={cn('text-sm font-black font-mono', i === 0 ? '' : 'text-neutral-700')}
                  style={i === 0 ? { color: config.color } : undefined}
                >
                  {lc.category.unit === '%' ? leader.value.toFixed(1) : leader.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ---------- Schedule / Fixtures ---------- */

const ScheduleSection: React.FC<{
  fixtures: SportFixture[];
  config: SportConfig;
}> = ({ fixtures, config }) => (
  <div className="rounded-[20px] border border-neutral-200/60 bg-white p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <Calendar className="h-4 w-4" style={{ color: config.color }} />
        </div>
        <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">Upcoming Schedule</h3>
      </div>
    </div>

    <div className="space-y-3">
      {fixtures.map((fixture) => (
        <div
          key={fixture.id}
          className="rounded-2xl border border-neutral-100 p-4 transition-all hover:border-neutral-200/80 hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-neutral-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                {fixture.date} &middot; {fixture.time}
              </span>
            </div>
            {fixture.broadcast && (
              <span className="flex items-center gap-1 text-[9px] font-mono text-neutral-300">
                <Tv className="h-3 w-3" />
                {fixture.broadcast}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center"
                style={{ backgroundColor: `${fixture.awayColor}12` }}
              >
                <span className="text-[10px] font-black" style={{ color: fixture.awayColor }}>
                  {fixture.awayAbbr}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-700 truncate">{fixture.awayTeam}</p>
                <p className="text-[9px] font-mono text-neutral-300">Away</p>
              </div>
            </div>

            <div className="px-4">
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: config.color }}
              >
                VS
              </span>
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-0 justify-end text-right">
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 truncate">{fixture.homeTeam}</p>
                <p className="text-[9px] font-mono text-neutral-300">Home</p>
              </div>
              <div
                className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center"
                style={{ backgroundColor: `${fixture.homeColor}12` }}
              >
                <span className="text-[10px] font-black" style={{ color: fixture.homeColor }}>
                  {fixture.homeAbbr}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-neutral-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{fixture.venue}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ---------- Stats Explanation Card ---------- */

const STAT_EXPLANATIONS: Record<string, { title: string; items: { label: string; desc: string }[] }> = {
  basketball: {
    title: 'Basketball Stats Guide',
    items: [
      { label: 'PPG', desc: 'Points Per Game — Total points scored divided by games played' },
      { label: 'RPG', desc: 'Rebounds Per Game — Offensive + Defensive boards per game' },
      { label: 'APG', desc: 'Assists Per Game — Passes leading to made baskets per game' },
      { label: 'PCT', desc: 'Win Percentage — Wins divided by total games played' },
    ],
  },
  soccer: {
    title: 'Soccer Stats Guide',
    items: [
      { label: 'PTS', desc: 'Points — 3 for a win, 1 for a draw, 0 for a loss' },
      { label: 'GD', desc: 'Goal Difference — Goals For minus Goals Against' },
      { label: 'CS', desc: 'Clean Sheets — Games where the goalkeeper conceded zero goals' },
      { label: 'xG', desc: 'Expected Goals — Statistical probability of shots resulting in goals' },
    ],
  },
  hockey: {
    title: 'Hockey Stats Guide',
    items: [
      { label: 'PTS', desc: 'Points — 2 for a win, 1 for an OT/SO loss, 0 for a regulation loss' },
      { label: 'OTL', desc: 'Overtime Losses — Losses in overtime or shootout (still earn 1 point)' },
      { label: 'SV%', desc: 'Save Percentage — Percentage of shots on goal stopped by the goalie' },
      { label: 'PPG', desc: 'Power Play Goals — Goals scored while opponent has a penalty' },
    ],
  },
  football: {
    title: 'Football Stats Guide',
    items: [
      { label: 'PTS', desc: 'Points — 2 for a win, 1 for a tie, 0 for a loss (CFL)' },
      { label: 'YDS', desc: 'Passing Yards — Total yards gained through the air' },
      { label: 'TD', desc: 'Touchdowns — 6 points for reaching the end zone' },
      { label: 'QBR', desc: 'Quarterback Rating — Composite efficiency metric for passers' },
    ],
  },
};

const StatsExplanationCard: React.FC<{ config: SportConfig }> = ({ config }) => {
  const explanation = STAT_EXPLANATIONS[config.id];
  if (!explanation) return null;

  return (
    <div className="rounded-[20px] border border-neutral-200/60 bg-white p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <Info className="h-4 w-4" style={{ color: config.color }} />
        </div>
        <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
          {explanation.title}
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {explanation.items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-neutral-100 p-3"
          >
            <span
              className="text-xs font-black font-mono"
              style={{ color: config.color }}
            >
              {item.label}
            </span>
            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================================================================
   MAIN DETAIL PAGE
   ================================================================ */

export const SportDetailPage: React.FC<{ sportId: string }> = ({ sportId }) => {
  const config = SPORT_CONFIGS[sportId];
  const sportData = getSportData(sportId);

  if (!config || !sportData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-24">
        <div className="text-center">
          <h1 className="text-2xl font-black text-neutral-900 mb-2">Sport Not Found</h1>
          <p className="text-sm text-neutral-400 mb-4">This sport hasn&apos;t been added yet.</p>
          <Link
            href="/sports"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#c8ff00] px-5 py-2.5 text-xs font-black text-neutral-900 uppercase tracking-wider"
          >
            <ChevronLeft className="h-4 w-4" />
            All Sports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/sports"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100/80 text-neutral-500 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-neutral-900 tracking-tight">{config.name}</h1>
              <p className="text-[10px] font-mono text-neutral-400">
                {sportData.standings.length} teams tracked
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Hero */}
        <SportHero config={config} teamCount={sportData.standings.length} />

        {/* Standings */}
        <FullStandingsTable standings={sportData.standings} config={config} />

        {/* Leaders */}
        <LeaderTables leaderCategories={sportData.leaderCategories} config={config} />

        {/* Schedule */}
        <ScheduleSection fixtures={sportData.fixtures} config={config} />

        {/* Stats Explanation */}
        <StatsExplanationCard config={config} />

        {/* Back to hub */}
        <div className="pt-2 pb-4 flex justify-center">
          <Link
            href="/sports"
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 px-5 py-2.5 text-xs font-bold text-neutral-500 transition-all hover:border-neutral-300 hover:text-neutral-700 hover:shadow-sm"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            All Sports
          </Link>
        </div>
      </div>
    </div>
  );
};
