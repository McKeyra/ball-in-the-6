'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Trophy,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { SPORT_CONFIGS } from '@/types/sports';
import type { SportConfig, SportStanding } from '@/types/sports';
import { getSportData } from '@/lib/sports-data';

/* ---------- Sort Types ---------- */

type SortKey =
  | 'rank'
  | 'wins'
  | 'losses'
  | 'ties'
  | 'points'
  | 'winPct'
  | 'pointsFor'
  | 'pointsAgainst'
  | 'diff'
  | 'streak'
  | 'gamesBack';

type SortDirection = 'asc' | 'desc';

const parseStreak = (streak: string): number => {
  const char = streak.charAt(0);
  const num = parseInt(streak.slice(1), 10);
  if (char === 'W') return num;
  if (char === 'L') return -num;
  return 0;
};

/* ---------- Column Header ---------- */

const SortableHeader: React.FC<{
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  className?: string;
  color: string;
}> = ({ label, sortKey, currentSort, direction, onSort, className, color }) => {
  const isActive = currentSort === sortKey;
  return (
    <th className={cn('pb-3 pt-2 cursor-pointer select-none group', className)}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-0.5 mx-auto"
      >
        <span
          className={cn(
            'text-[9px] font-mono uppercase tracking-wider transition-colors',
            isActive ? 'font-black' : 'text-neutral-300 group-hover:text-neutral-500',
          )}
          style={isActive ? { color } : undefined}
        >
          {label}
        </span>
        {isActive && (
          direction === 'desc'
            ? <ChevronDown className="h-2.5 w-2.5" style={{ color }} />
            : <ChevronUp className="h-2.5 w-2.5" style={{ color }} />
        )}
      </button>
    </th>
  );
};

/* ---------- Conference Filter ---------- */

const ConferenceFilter: React.FC<{
  config: SportConfig;
  active: string;
  onChange: (v: string) => void;
}> = ({ config, active, onChange }) => {
  if (!config.conferenceNames) return null;

  const options = ['All', ...config.conferenceNames];

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-3.5 w-3.5 text-neutral-300" />
      <div className="flex gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              'rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all',
              active === opt
                ? 'text-white shadow-sm'
                : 'bg-neutral-100/60 text-neutral-400 hover:text-neutral-600',
            )}
            style={active === opt ? { backgroundColor: config.color } : undefined}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ================================================================
   STANDINGS PAGE
   ================================================================ */

export const StandingsPage: React.FC<{ sportId: string }> = ({ sportId }) => {
  const config = SPORT_CONFIGS[sportId];
  const sportData = getSportData(sportId);

  const [conference, setConference] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      // Default sort directions
      setSortDir(
        key === 'wins' || key === 'points' || key === 'winPct' || key === 'pointsFor' || key === 'diff'
          ? 'desc'
          : 'asc',
      );
    }
  };

  const sorted = useMemo(() => {
    if (!sportData) return [];

    let list = [...sportData.standings];

    // Filter by conference
    if (conference !== 'All') {
      list = list.filter((t) => t.conference === conference);
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'rank':
          cmp = a.gamesBack - b.gamesBack;
          break;
        case 'wins':
          cmp = a.wins - b.wins;
          break;
        case 'losses':
          cmp = a.losses - b.losses;
          break;
        case 'ties':
          cmp = (a.ties ?? 0) - (b.ties ?? 0);
          break;
        case 'points':
          cmp = (a.points ?? 0) - (b.points ?? 0);
          break;
        case 'winPct':
          cmp = (a.winPct ?? 0) - (b.winPct ?? 0);
          break;
        case 'pointsFor':
          cmp = a.pointsFor - b.pointsFor;
          break;
        case 'pointsAgainst':
          cmp = a.pointsAgainst - b.pointsAgainst;
          break;
        case 'diff':
          cmp = (a.pointsFor - a.pointsAgainst) - (b.pointsFor - b.pointsAgainst);
          break;
        case 'streak':
          cmp = parseStreak(a.streak) - parseStreak(b.streak);
          break;
        case 'gamesBack':
          cmp = a.gamesBack - b.gamesBack;
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [sportData, conference, sortKey, sortDir]);

  if (!config || !sportData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-24">
        <div className="text-center">
          <h1 className="text-2xl font-black text-neutral-900 mb-2">Sport Not Found</h1>
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

  const showTiesCol = config.hasTies || config.id === 'hockey';
  const showPointsCol = config.id === 'soccer' || config.id === 'hockey' || config.id === 'football';
  const pfLabel = config.scoringSystem === 'goals' ? 'GF' : 'PF';
  const paLabel = config.scoringSystem === 'goals' ? 'GA' : 'PA';
  const tieLabel = config.hasTies ? 'T' : 'OTL';
  const playoffLine = config.id === 'football' ? 3 : 6;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href={`/sports/${config.id}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100/80 text-neutral-500 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-neutral-900 tracking-tight">
                {config.name} Standings
              </h1>
              <p className="text-[10px] font-mono text-neutral-400">
                {sorted.length} teams &middot; {conference === 'All' ? 'All conferences' : conference}
              </p>
            </div>
          </div>

          <ConferenceFilter
            config={config}
            active={conference}
            onChange={setConference}
          />
        </div>
      </div>

      {/* Standings Table */}
      <div className="px-4 pt-5">
        <div className="rounded-[20px] border border-neutral-200/60 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="border-b border-neutral-100">
                  <SortableHeader label="#" sortKey="rank" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-left pl-5 w-8" color={config.color} />
                  <th className="text-left text-[9px] font-mono text-neutral-300 uppercase pb-3 pt-2">Team</th>
                  <SortableHeader label="W" sortKey="wins" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-center w-12" color={config.color} />
                  <SortableHeader label="L" sortKey="losses" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-center w-12" color={config.color} />
                  {showTiesCol && (
                    <SortableHeader label={tieLabel} sortKey="ties" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-center w-12" color={config.color} />
                  )}
                  {showPointsCol && (
                    <SortableHeader label="PTS" sortKey="points" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-center w-12" color={config.color} />
                  )}
                  {!showPointsCol && (
                    <SortableHeader label="PCT" sortKey="winPct" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-center w-14" color={config.color} />
                  )}
                  <SortableHeader label={pfLabel} sortKey="pointsFor" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-center w-14" color={config.color} />
                  <SortableHeader label={paLabel} sortKey="pointsAgainst" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-center w-14" color={config.color} />
                  <SortableHeader label="DIFF" sortKey="diff" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-center w-14" color={config.color} />
                  <SortableHeader label="STRK" sortKey="streak" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-center w-14" color={config.color} />
                  <th className="text-center text-[9px] font-mono text-neutral-300 uppercase pb-3 pt-2 w-16">L10</th>
                  <SortableHeader label="GB" sortKey="gamesBack" currentSort={sortKey} direction={sortDir} onSort={handleSort} className="text-right pr-5 w-12" color={config.color} />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sorted.map((team, i) => {
                    const diff = team.pointsFor - team.pointsAgainst;
                    const diffStr = diff > 0 ? `+${typeof diff === 'number' && diff % 1 !== 0 ? diff.toFixed(1) : diff}` : `${typeof diff === 'number' && diff % 1 !== 0 ? diff.toFixed(1) : diff}`;

                    return (
                      <motion.tr
                        key={team.teamId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={cn(
                          'transition-colors hover:bg-neutral-50/80 group',
                          i === playoffLine - 1 && 'border-b-2 border-dashed',
                        )}
                        style={
                          i === playoffLine - 1
                            ? { borderBottomColor: `${config.color}30` }
                            : undefined
                        }
                      >
                        <td className="py-3 pl-5">
                          <span className="text-xs font-black text-neutral-300">{i + 1}</span>
                        </td>
                        <td className="py-3">
                          <Link
                            href={`/sports/${config.id}`}
                            className="flex items-center gap-2.5 group/team"
                          >
                            <div
                              className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center transition-transform group-hover/team:scale-110"
                              style={{ backgroundColor: `${team.teamColor}15` }}
                            >
                              <span className="text-[8px] font-black" style={{ color: team.teamColor }}>
                                {team.teamAbbr}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-neutral-900 truncate group-hover/team:underline">{team.teamName}</p>
                              {team.conference && (
                                <p className="text-[9px] font-mono text-neutral-300">
                                  {team.conference}{team.division ? ` · ${team.division}` : ''}
                                </p>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="py-3 text-center">
                          <span className="text-xs font-mono font-bold text-neutral-700">{team.wins}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="text-xs font-mono text-neutral-700">{team.losses}</span>
                        </td>
                        {showTiesCol && (
                          <td className="py-3 text-center">
                            <span className="text-xs font-mono text-neutral-400">
                              {config.hasTies ? (team.ties ?? 0) : (team.overtimeLosses ?? 0)}
                            </span>
                          </td>
                        )}
                        {showPointsCol && (
                          <td className="py-3 text-center">
                            <span
                              className="text-xs font-black font-mono"
                              style={{ color: config.color }}
                            >
                              {team.points}
                            </span>
                          </td>
                        )}
                        {!showPointsCol && (
                          <td className="py-3 text-center">
                            <span className="text-xs font-mono text-neutral-600">
                              .{((team.winPct ?? 0) * 1000).toFixed(0).padStart(3, '0')}
                            </span>
                          </td>
                        )}
                        <td className="py-3 text-center">
                          <span className="text-xs font-mono text-neutral-500">
                            {typeof team.pointsFor === 'number' && team.pointsFor % 1 !== 0
                              ? team.pointsFor.toFixed(1)
                              : team.pointsFor}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="text-xs font-mono text-neutral-500">
                            {typeof team.pointsAgainst === 'number' && team.pointsAgainst % 1 !== 0
                              ? team.pointsAgainst.toFixed(1)
                              : team.pointsAgainst}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={cn(
                              'text-xs font-mono font-bold',
                              diff > 0 ? 'text-emerald-500' : diff < 0 ? 'text-red-400' : 'text-neutral-400',
                            )}
                          >
                            {diffStr}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={cn(
                              'text-[10px] font-black font-mono px-2 py-0.5 rounded-md',
                              team.streak.startsWith('W')
                                ? 'text-emerald-600 bg-emerald-50'
                                : team.streak.startsWith('L')
                                  ? 'text-red-500 bg-red-50'
                                  : 'text-neutral-400 bg-neutral-50',
                            )}
                          >
                            {team.streak}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="text-[10px] font-mono text-neutral-400">{team.lastTen}</span>
                        </td>
                        <td className="py-3 text-right pr-5">
                          <span className="text-xs font-mono text-neutral-400">
                            {team.gamesBack === 0 ? '—' : team.gamesBack.toFixed(0)}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Playoff indicator legend */}
          <div className="flex items-center gap-3 px-5 py-4 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <div
                className="h-0.5 w-6 rounded-full border-b-2 border-dashed"
                style={{ borderColor: `${config.color}40` }}
              />
              <span className="text-[9px] font-mono text-neutral-300">Playoff cutoff</span>
            </div>
            <span className="text-[9px] text-neutral-200">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-emerald-500">W</span>
              <span className="text-[9px] text-neutral-200">=</span>
              <span className="text-[9px] font-mono text-neutral-300">Win streak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-red-400">L</span>
              <span className="text-[9px] text-neutral-200">=</span>
              <span className="text-[9px] font-mono text-neutral-300">Loss streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="px-4 pt-6 flex justify-center gap-3">
        <Link
          href={`/sports/${config.id}`}
          className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 px-5 py-2.5 text-xs font-bold text-neutral-500 transition-all hover:border-neutral-300 hover:text-neutral-700 hover:shadow-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {config.name}
        </Link>
        <Link
          href="/sports"
          className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 px-5 py-2.5 text-xs font-bold text-neutral-500 transition-all hover:border-neutral-300 hover:text-neutral-700 hover:shadow-sm"
        >
          All Sports
        </Link>
      </div>
    </div>
  );
};
