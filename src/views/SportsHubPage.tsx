'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  CircleDot,
  Goal,
  Hexagon,
  Shield,
  Trophy,
  ChevronRight,
  TrendingUp,
  Calendar,
  ArrowRight,
  MapPin,
  Crown,
  Tv,
  Layers,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import Link from 'next/link';
import { SPORT_CONFIGS, CORE_SPORT_IDS, ALL_SPORT_COUNT } from '@/types/sports';
import type { SportId, SportConfig, SportStanding, SportLeaderCategory, SportFixture } from '@/types/sports';
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

/* ---------- Sport Selector Card ---------- */

const SportSelectorCard: React.FC<{
  config: SportConfig;
  isActive: boolean;
  onSelect: () => void;
}> = ({ config, isActive, onSelect }) => {
  const Icon = getSportIcon(config.icon);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative shrink-0 flex flex-col items-center gap-2.5 rounded-[20px] px-6 py-5 transition-all duration-300 border',
        isActive
          ? 'border-neutral-300/60 shadow-lg scale-[1.02]'
          : 'border-neutral-200/40 bg-white hover:border-neutral-200/80 hover:shadow-sm',
      )}
      style={
        isActive
          ? { backgroundColor: config.colorDim, borderColor: `${config.color}30` }
          : undefined
      }
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300',
          isActive ? 'scale-110' : 'bg-neutral-100 group-hover:bg-neutral-50',
        )}
        style={
          isActive
            ? { backgroundColor: `${config.color}20` }
            : undefined
        }
      >
        <Icon
          className={cn('h-6 w-6 transition-colors duration-300', !isActive && 'text-neutral-400 group-hover:text-neutral-600')}
          style={isActive ? { color: config.color } : undefined}
        />
      </div>
      <span
        className={cn(
          'text-xs font-black uppercase tracking-wider transition-colors duration-300',
          !isActive && 'text-neutral-400 group-hover:text-neutral-600',
        )}
        style={isActive ? { color: config.color } : undefined}
      >
        {config.name}
      </span>
      {isActive && (
        <motion.div
          layoutId="sport-indicator"
          className="absolute -bottom-px left-1/2 -translate-x-1/2 h-1 w-8 rounded-full"
          style={{ backgroundColor: config.color }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );
};

/* ---------- Mini Standings Table ---------- */

const MiniStandingsTable: React.FC<{
  standings: SportStanding[];
  config: SportConfig;
}> = ({ standings, config }) => {
  const top5 = standings.slice(0, 5);
  const playoffLine = 4;

  return (
    <div className="rounded-[20px] border border-neutral-200/60 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
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

      <div className="space-y-0">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr_40px_40px_40px_50px] items-center gap-2 px-2 pb-2 border-b border-neutral-100">
          <span className="w-5 text-[9px] font-mono text-neutral-300">#</span>
          <span className="text-[9px] font-mono text-neutral-300 uppercase">Team</span>
          <span className="text-[9px] font-mono text-neutral-300 text-center">W</span>
          <span className="text-[9px] font-mono text-neutral-300 text-center">L</span>
          <span className="text-[9px] font-mono text-neutral-300 text-center">{config.hasTies ? 'T' : config.id === 'hockey' ? 'OTL' : ''}</span>
          <span className="text-[9px] font-mono text-neutral-300 text-right">GB</span>
        </div>

        {top5.map((team, i) => (
          <div key={team.teamId}>
            <div
              className={cn(
                'grid grid-cols-[auto_1fr_40px_40px_40px_50px] items-center gap-2 px-2 py-2.5 rounded-xl transition-colors hover:bg-neutral-50/80',
              )}
            >
              <span className="w-5 text-xs font-black text-neutral-300">{i + 1}</span>
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="h-5 w-5 rounded-md shrink-0"
                  style={{ backgroundColor: `${team.teamColor}20` }}
                />
                <span className="text-xs font-bold text-neutral-900 truncate">{team.teamName}</span>
              </div>
              <span className="text-xs font-mono text-neutral-700 text-center">{team.wins}</span>
              <span className="text-xs font-mono text-neutral-700 text-center">{team.losses}</span>
              <span className="text-xs font-mono text-neutral-400 text-center">
                {config.hasTies ? (team.ties ?? 0) : config.id === 'hockey' ? (team.overtimeLosses ?? 0) : ''}
              </span>
              <span className="text-xs font-mono text-neutral-400 text-right">
                {team.gamesBack === 0 ? '—' : team.gamesBack.toFixed(0)}
              </span>
            </div>
            {i === playoffLine - 1 && i < top5.length - 1 && (
              <div className="mx-2 border-b border-dashed border-neutral-200/80" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Leaders Card ---------- */

const LeadersCard: React.FC<{
  leaderCategories: SportLeaderCategory[];
  config: SportConfig;
}> = ({ leaderCategories, config }) => {
  const [activeCat, setActiveCat] = useState(0);
  const cat = leaderCategories[activeCat];
  if (!cat) return null;

  return (
    <div className="rounded-[20px] border border-neutral-200/60 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${config.color}15` }}
          >
            <TrendingUp className="h-4 w-4" style={{ color: config.color }} />
          </div>
          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">League Leaders</h3>
        </div>
        <Link
          href={`/sports/${config.id}`}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors hover:opacity-70"
          style={{ color: config.color }}
        >
          View All
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
        {leaderCategories.map((lc, i) => (
          <button
            key={lc.category.key}
            type="button"
            onClick={() => setActiveCat(i)}
            className={cn(
              'shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all',
              i === activeCat
                ? 'text-white shadow-sm'
                : 'bg-neutral-100/60 text-neutral-400 hover:text-neutral-600',
            )}
            style={i === activeCat ? { backgroundColor: config.color } : undefined}
          >
            {lc.category.abbr}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cat.category.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-1"
        >
          {cat.leaders.slice(0, 5).map((leader, i) => (
            <div
              key={leader.playerId}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                i === 0 ? '' : 'hover:bg-neutral-50/80',
              )}
              style={i === 0 ? { backgroundColor: `${config.color}08` } : undefined}
            >
              <span className={cn('text-xs font-black w-5', i === 0 ? '' : 'text-neutral-300')} style={i === 0 ? { color: config.color } : undefined}>
                {leader.rank}
              </span>
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-black shrink-0',
                  i === 0 ? 'text-white' : 'bg-neutral-100 text-neutral-500',
                )}
                style={i === 0 ? { backgroundColor: config.color } : undefined}
              >
                {leader.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-neutral-900 truncate">{leader.playerName}</p>
                <p className="text-[10px] text-neutral-400 font-mono">{leader.teamAbbr}</p>
              </div>
              <span
                className={cn('text-sm font-black font-mono', i === 0 ? '' : 'text-neutral-700')}
                style={i === 0 ? { color: config.color } : undefined}
              >
                {cat.category.unit === '%' ? leader.value.toFixed(1) : leader.value.toLocaleString()}
              </span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ---------- Upcoming Games Card ---------- */

const UpcomingGamesCard: React.FC<{
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
        <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">Upcoming</h3>
      </div>
      <Link
        href={`/sports/${config.id}`}
        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors hover:opacity-70"
        style={{ color: config.color }}
      >
        Schedule
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>

    <div className="space-y-3">
      {fixtures.map((fixture) => (
        <div
          key={fixture.id}
          className="rounded-2xl border border-neutral-100 p-4 transition-all hover:border-neutral-200/80 hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              {fixture.date} &middot; {fixture.time}
            </span>
            {fixture.broadcast && (
              <span className="flex items-center gap-1 text-[9px] font-mono text-neutral-300">
                <Tv className="h-3 w-3" />
                {fixture.broadcast}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div
                className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center"
                style={{ backgroundColor: `${fixture.awayColor}15` }}
              >
                <span className="text-[9px] font-black" style={{ color: fixture.awayColor }}>
                  {fixture.awayAbbr}
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-700 truncate">{fixture.awayTeam}</span>
            </div>
            <span className="text-[9px] font-mono text-neutral-300 px-3">@</span>
            <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
              <span className="text-xs font-bold text-neutral-900 truncate text-right">{fixture.homeTeam}</span>
              <div
                className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center"
                style={{ backgroundColor: `${fixture.homeColor}15` }}
              >
                <span className="text-[9px] font-black" style={{ color: fixture.homeColor }}>
                  {fixture.homeAbbr}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-neutral-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{fixture.venue}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ---------- Explore All Sports Teaser ---------- */

const ExploreTeaser: React.FC = () => (
  <div className="rounded-[20px] border border-dashed border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-6 text-center">
    <div className="flex justify-center mb-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c8ff00]/10">
        <Layers className="h-6 w-6 text-[#c8ff00]" />
      </div>
    </div>
    <h3 className="text-lg font-black text-neutral-900 mb-1">Explore All {ALL_SPORT_COUNT} Sports</h3>
    <p className="text-xs text-neutral-400 mb-4 max-w-xs mx-auto">
      From basketball to cricket, lacrosse to swimming — Ball in the 6 covers every sport in Toronto.
    </p>
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {['Baseball', 'Tennis', 'Golf', 'Cricket', 'Rugby', 'Volleyball', 'Lacrosse', 'Swimming'].map((sport) => (
        <span
          key={sport}
          className="rounded-full bg-neutral-100/80 px-3 py-1 text-[10px] font-bold text-neutral-400"
        >
          {sport}
        </span>
      ))}
      <span className="rounded-full bg-neutral-100/80 px-3 py-1 text-[10px] font-bold text-neutral-300">
        +{ALL_SPORT_COUNT - 12} more
      </span>
    </div>
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-2xl bg-[#c8ff00] px-6 py-3 text-xs font-black text-neutral-900 uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-[#c8ff00]/20 active:scale-95"
    >
      Coming Soon
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
);

/* ================================================================
   MAIN HUB PAGE
   ================================================================ */

export const SportsHubPage: React.FC = () => {
  const [activeSport, setActiveSport] = useState<SportId>('basketball');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConfig = SPORT_CONFIGS[activeSport];
  const sportData = getSportData(activeSport);

  if (!activeConfig || !sportData) return null;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Sports</h1>
              <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                {CORE_SPORT_IDS.length} sports live &middot; {ALL_SPORT_COUNT} coming
              </p>
            </div>
            <Crown className="h-5 w-5 text-[#c8ff00]/40" />
          </div>

          {/* Sport Selector */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1"
          >
            {CORE_SPORT_IDS.map((sportId) => {
              const cfg = SPORT_CONFIGS[sportId];
              if (!cfg) return null;
              return (
                <SportSelectorCard
                  key={sportId}
                  config={cfg}
                  isActive={activeSport === sportId}
                  onSelect={() => setActiveSport(sportId)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSport}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="px-4 pt-5 space-y-4"
        >
          {/* Sport Hero Banner */}
          <div
            className="rounded-[20px] p-5 relative overflow-hidden"
            style={{ backgroundColor: `${activeConfig.color}08` }}
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2
                  className="text-xl font-black tracking-tight"
                  style={{ color: activeConfig.color }}
                >
                  {activeConfig.name}
                </h2>
                <p className="text-[10px] font-mono text-neutral-400 mt-1">
                  {sportData.standings.length} teams &middot; {sportData.fixtures.length} upcoming &middot;{' '}
                  {sportData.leaderCategories.length} stat categories
                </p>
              </div>
              <Link
                href={`/sports/${activeConfig.id}`}
                className="flex items-center gap-1.5 rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:shadow-lg active:scale-95"
                style={{ backgroundColor: activeConfig.color }}
              >
                Explore
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/4"
              style={{ backgroundColor: activeConfig.color }}
            />
          </div>

          {/* Standings */}
          <MiniStandingsTable standings={sportData.standings} config={activeConfig} />

          {/* Leaders */}
          <LeadersCard leaderCategories={sportData.leaderCategories} config={activeConfig} />

          {/* Upcoming */}
          <UpcomingGamesCard fixtures={sportData.fixtures} config={activeConfig} />
        </motion.div>
      </AnimatePresence>

      {/* Explore All Sports Teaser */}
      <div className="px-4 pt-6">
        <ExploreTeaser />
      </div>
    </div>
  );
};
