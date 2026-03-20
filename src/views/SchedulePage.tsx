'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Zap,
  MapPin,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface ScheduleGame {
  id: string;
  homeTeam: { name: string; color: string; record: string };
  awayTeam: { name: string; color: string; record: string };
  time: string;
  venue: string;
  league: string;
  status: 'upcoming' | 'live' | 'final';
  homeScore?: number;
  awayScore?: number;
}

interface DaySchedule {
  date: Date;
  games: ScheduleGame[];
}

/* ------------------------------------------------------------------ */
/*  Mock Data — 2 weeks of games                                      */
/* ------------------------------------------------------------------ */

const TODAY = new Date();
const DAY_MS = 86400000;

const makeDate = (offset: number): Date => {
  const d = new Date(TODAY.getTime() + offset * DAY_MS);
  d.setHours(0, 0, 0, 0);
  return d;
};

const LEAGUES = ['All', 'Pro', 'Collegiate', 'High School', 'Elementary'] as const;
type LeagueFilter = (typeof LEAGUES)[number];

const SCHEDULE_DATA: DaySchedule[] = [
  {
    date: makeDate(-3),
    games: [
      { id: 'sg-01', homeTeam: { name: 'Scarborough Elite', color: '#64748b', record: '8-5' }, awayTeam: { name: 'East York Wolves', color: '#6b7280', record: '9-4' }, time: '7:00 PM', venue: 'Pan Am Centre', league: 'Pro', status: 'final', homeScore: 78, awayScore: 72 },
    ],
  },
  {
    date: makeDate(-2),
    games: [
      { id: 'sg-02', homeTeam: { name: 'UofT Varsity Blues', color: '#1d4ed8', record: '14-2' }, awayTeam: { name: 'TMU Bold', color: '#7c3aed', record: '11-5' }, time: '6:00 PM', venue: 'Goldring Centre', league: 'Collegiate', status: 'final', homeScore: 81, awayScore: 74 },
      { id: 'sg-03', homeTeam: { name: 'Oakwood Barons', color: '#8b5cf6', record: '16-0' }, awayTeam: { name: 'Birchmount Park CI', color: '#e11d48', record: '9-7' }, time: '4:00 PM', venue: 'Oakwood CI Gym', league: 'High School', status: 'final', homeScore: 68, awayScore: 55 },
    ],
  },
  {
    date: makeDate(-1),
    games: [
      { id: 'sg-04', homeTeam: { name: 'Rexdale Runs', color: '#ef4444', record: '7-6' }, awayTeam: { name: 'SJPII Panthers', color: '#3b82f6', record: '10-3' }, time: '7:30 PM', venue: 'Driftwood CC', league: 'Pro', status: 'final', homeScore: 65, awayScore: 72 },
    ],
  },
  {
    date: makeDate(0),
    games: [
      { id: 'sg-05', homeTeam: { name: 'Scarborough Elite', color: '#64748b', record: '8-6' }, awayTeam: { name: 'B.M.T. Titans', color: '#f97316', record: '12-2' }, time: '4:22 Q3', venue: 'Pan Am Centre', league: 'Pro', status: 'live', homeScore: 48, awayScore: 54 },
      { id: 'sg-06', homeTeam: { name: 'Northside Kings', color: '#10b981', record: '11-3' }, awayTeam: { name: 'Rexdale Runs', color: '#ef4444', record: '7-7' }, time: '8:15 Q4', venue: 'Downsview Park', league: 'Pro', status: 'live', homeScore: 61, awayScore: 67 },
      { id: 'sg-07', homeTeam: { name: 'East York Wolves', color: '#6b7280', record: '9-5' }, awayTeam: { name: 'SJPII Panthers', color: '#3b82f6', record: '10-4' }, time: '7:30 PM', venue: "L'Amoreaux SC", league: 'Pro', status: 'upcoming' },
      { id: 'sg-08', homeTeam: { name: 'Oakwood Barons', color: '#8b5cf6', record: '16-1' }, awayTeam: { name: 'Eastern Commerce', color: '#f59e0b', record: '13-4' }, time: '6:10 Q3', venue: 'Oakwood CI Gym', league: 'High School', status: 'live', homeScore: 62, awayScore: 58 },
    ],
  },
  {
    date: makeDate(1),
    games: [
      { id: 'sg-09', homeTeam: { name: 'B.M.T. Titans', color: '#f97316', record: '12-2' }, awayTeam: { name: 'Northside Kings', color: '#10b981', record: '11-3' }, time: '2:00 PM', venue: 'Pan Am Centre', league: 'Pro', status: 'upcoming' },
      { id: 'sg-10', homeTeam: { name: 'York Lions', color: '#dc2626', record: '9-7' }, awayTeam: { name: 'Humber Hawks', color: '#0ea5e9', record: '12-4' }, time: '8:00 PM', venue: 'Tait McKenzie', league: 'Collegiate', status: 'upcoming' },
    ],
  },
  {
    date: makeDate(2),
    games: [
      { id: 'sg-11', homeTeam: { name: 'Sir Wilfrid Laurier', color: '#16a34a', record: '10-7' }, awayTeam: { name: 'Westview Wildcats', color: '#0891b2', record: '14-3' }, time: '4:00 PM', venue: 'Westview Secondary', league: 'High School', status: 'upcoming' },
    ],
  },
  {
    date: makeDate(3),
    games: [
      { id: 'sg-12', homeTeam: { name: 'Scarborough Elite', color: '#64748b', record: '8-6' }, awayTeam: { name: 'Rexdale Runs', color: '#ef4444', record: '7-7' }, time: '7:00 PM', venue: 'Malvern CC', league: 'Pro', status: 'upcoming' },
      { id: 'sg-13', homeTeam: { name: 'Seneca Sting', color: '#eab308', record: '8-8' }, awayTeam: { name: 'George Brown', color: '#059669', record: '6-10' }, time: '6:00 PM', venue: 'Seneca @ York', league: 'Collegiate', status: 'upcoming' },
    ],
  },
  {
    date: makeDate(4),
    games: [
      { id: 'sg-14', homeTeam: { name: 'Willow Park Jr.', color: '#f97316', record: '8-0' }, awayTeam: { name: 'Glamorgan Jr.', color: '#6366f1', record: '6-2' }, time: '3:30 PM', venue: 'Willow Park PS', league: 'Elementary', status: 'upcoming' },
    ],
  },
  {
    date: makeDate(5),
    games: [
      { id: 'sg-15', homeTeam: { name: 'East York Wolves', color: '#6b7280', record: '9-5' }, awayTeam: { name: 'B.M.T. Titans', color: '#f97316', record: '12-2' }, time: '7:30 PM', venue: 'East York CC', league: 'Pro', status: 'upcoming' },
    ],
  },
  {
    date: makeDate(6),
    games: [],
  },
  {
    date: makeDate(7),
    games: [
      { id: 'sg-16', homeTeam: { name: 'Northside Kings', color: '#10b981', record: '11-3' }, awayTeam: { name: 'Scarborough Elite', color: '#64748b', record: '8-6' }, time: '2:00 PM', venue: 'Downsview Park', league: 'Pro', status: 'upcoming' },
      { id: 'sg-17', homeTeam: { name: 'UofT Varsity Blues', color: '#1d4ed8', record: '14-2' }, awayTeam: { name: 'York Lions', color: '#dc2626', record: '9-7' }, time: '7:00 PM', venue: 'Goldring Centre', league: 'Collegiate', status: 'upcoming' },
    ],
  },
  {
    date: makeDate(8),
    games: [
      { id: 'sg-18', homeTeam: { name: 'Cedarbrae CI', color: '#475569', record: '7-10' }, awayTeam: { name: 'Oakwood Barons', color: '#8b5cf6', record: '16-1' }, time: '4:00 PM', venue: 'Cedarbrae CI', league: 'High School', status: 'upcoming' },
    ],
  },
  {
    date: makeDate(9),
    games: [
      { id: 'sg-19', homeTeam: { name: 'SJPII Panthers', color: '#3b82f6', record: '10-4' }, awayTeam: { name: 'Rexdale Runs', color: '#ef4444', record: '7-7' }, time: '7:30 PM', venue: 'SJPII Gym', league: 'Pro', status: 'upcoming' },
    ],
  },
  {
    date: makeDate(10),
    games: [
      { id: 'sg-20', homeTeam: { name: 'Poplar Road PS', color: '#84cc16', record: '5-3' }, awayTeam: { name: 'Cedarbrook PS', color: '#ec4899', record: '7-1' }, time: '3:30 PM', venue: 'Cedarbrook PS', league: 'Elementary', status: 'upcoming' },
      { id: 'sg-21', homeTeam: { name: 'TMU Bold', color: '#7c3aed', record: '11-5' }, awayTeam: { name: 'Humber Hawks', color: '#0ea5e9', record: '12-4' }, time: '7:00 PM', venue: 'TMU Athletic Centre', league: 'Collegiate', status: 'upcoming' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helper                                                            */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const formatDay = (d: Date): string => `${WEEKDAYS[d.getDay()]}`;
const formatDate = (d: Date): string => `${MONTHS[d.getMonth()]} ${d.getDate()}`;

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getWeekStart = (d: Date): Date => {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  return result;
};

/* ------------------------------------------------------------------ */
/*  Game Card                                                         */
/* ------------------------------------------------------------------ */

const ScheduleGameCard: React.FC<{ game: ScheduleGame; index: number }> = ({
  game,
  index,
}) => {
  const router = useRouter();
  const isLive = game.status === 'live';
  const isFinal = game.status === 'final';

  return (
    <motion.button
      type="button"
      onClick={() => router.push(`/games/${game.id}`)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="w-full rounded-2xl border border-neutral-200/60 bg-white p-4 text-left hover:border-neutral-300 hover:shadow-sm transition-all"
    >
      {/* Status row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isLive && (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
                Live &middot; {game.time}
              </span>
            </>
          )}
          {isFinal && (
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Final
            </span>
          )}
          {game.status === 'upcoming' && (
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              {game.time}
            </span>
          )}
        </div>
        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-300 rounded-md bg-neutral-50 px-2 py-0.5">
          {game.league}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ backgroundColor: `${game.awayTeam.color}18` }}
          >
            <Zap className="h-4 w-4" style={{ color: game.awayTeam.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-neutral-800 truncate">
              {game.awayTeam.name}
            </p>
            <p className="text-[10px] font-mono text-neutral-300">
              {game.awayTeam.record}
            </p>
          </div>
        </div>

        {(isLive || isFinal) && game.awayScore !== undefined && game.homeScore !== undefined ? (
          <div className="flex items-center gap-2 px-3">
            <span className={cn('font-mono text-lg font-black', game.awayScore > (game.homeScore ?? 0) ? 'text-neutral-900' : 'text-neutral-400')}>
              {game.awayScore}
            </span>
            <span className="text-neutral-200 text-xs">-</span>
            <span className={cn('font-mono text-lg font-black', (game.homeScore ?? 0) > game.awayScore ? 'text-neutral-900' : 'text-neutral-400')}>
              {game.homeScore}
            </span>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-neutral-200 px-3">VS</span>
        )}

        <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <p className="text-xs font-bold text-neutral-800 truncate">
              {game.homeTeam.name}
            </p>
            <p className="text-[10px] font-mono text-neutral-300">
              {game.homeTeam.record}
            </p>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ backgroundColor: `${game.homeTeam.color}18` }}
          >
            <Zap className="h-4 w-4" style={{ color: game.homeTeam.color }} />
          </div>
        </div>
      </div>

      {/* Venue */}
      <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-neutral-300">
        <MapPin className="h-3 w-3" />
        <span>{game.venue}</span>
      </div>
    </motion.button>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Schedule Page                                                */
/* ------------------------------------------------------------------ */

export const SchedulePage: React.FC = () => {
  const router = useRouter();
  const todayNorm = new Date(TODAY);
  todayNorm.setHours(0, 0, 0, 0);

  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(todayNorm));
  const [selectedDay, setSelectedDay] = useState<Date>(todayNorm);
  const [leagueFilter, setLeagueFilter] = useState<LeagueFilter>('All');
  const [direction, setDirection] = useState<1 | -1>(1);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart.getTime() + i * DAY_MS);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, [weekStart]);

  const gamesForDay = useMemo(() => {
    const dayData = SCHEDULE_DATA.find((ds) => isSameDay(ds.date, selectedDay));
    if (!dayData) return [];
    if (leagueFilter === 'All') return dayData.games;
    return dayData.games.filter(
      (g) => g.league.toLowerCase() === leagueFilter.toLowerCase()
    );
  }, [selectedDay, leagueFilter]);

  const navigateWeek = (dir: 1 | -1): void => {
    setDirection(dir);
    setWeekStart((prev) => {
      const next = new Date(prev.getTime() + dir * 7 * DAY_MS);
      next.setHours(0, 0, 0, 0);
      return next;
    });
  };

  const goToToday = (): void => {
    setDirection(1);
    setWeekStart(getWeekStart(todayNorm));
    setSelectedDay(todayNorm);
  };

  const isToday = (d: Date): boolean => isSameDay(d, todayNorm);
  const isSelected = (d: Date): boolean => isSameDay(d, selectedDay);

  const getGameCountForDay = (d: Date): number => {
    const dayData = SCHEDULE_DATA.find((ds) => isSameDay(ds.date, d));
    return dayData?.games.length ?? 0;
  };

  const hasLiveGames = (d: Date): boolean => {
    const dayData = SCHEDULE_DATA.find((ds) => isSameDay(ds.date, d));
    return dayData?.games.some((g) => g.status === 'live') ?? false;
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/games')}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100/60 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                  Schedule
                </h1>
                <p className="text-[10px] font-mono text-neutral-400">
                  {formatDate(weekDays[0])} &mdash; {formatDate(weekDays[6])}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToToday}
                className="flex items-center gap-1.5 rounded-xl bg-[#c8ff00]/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#9ab800] hover:bg-[#c8ff00]/20 transition-colors"
              >
                <Calendar className="h-3 w-3" />
                Today
              </button>
            </div>
          </div>

          {/* Week navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateWeek(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100/60 text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={weekStart.toISOString()}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.25 }}
                className="flex flex-1 gap-1"
              >
                {weekDays.map((day) => {
                  const gameCount = getGameCountForDay(day);
                  const live = hasLiveGames(day);

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-0.5 rounded-xl py-2 transition-all',
                        isSelected(day)
                          ? 'bg-neutral-900 text-white'
                          : isToday(day)
                            ? 'bg-[#c8ff00]/10 text-neutral-700'
                            : 'text-neutral-400 hover:bg-neutral-50'
                      )}
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {formatDay(day)}
                      </span>
                      <span
                        className={cn(
                          'text-lg font-black',
                          isSelected(day) ? 'text-white' : 'text-neutral-800'
                        )}
                      >
                        {day.getDate()}
                      </span>
                      <div className="flex items-center gap-1">
                        {live && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                          </span>
                        )}
                        {gameCount > 0 && !live && (
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              isSelected(day)
                                ? 'bg-[#c8ff00]'
                                : 'bg-neutral-200'
                            )}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => navigateWeek(1)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100/60 text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* League filter */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto no-scrollbar">
            {LEAGUES.map((league) => (
              <button
                key={league}
                type="button"
                onClick={() => setLeagueFilter(league)}
                className={cn(
                  'shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all',
                  leagueFilter === league
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-300 hover:text-neutral-500'
                )}
              >
                {league === 'All' && <Filter className="h-3 w-3" />}
                {league}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Games list */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-neutral-900">
            {isToday(selectedDay)
              ? 'Today'
              : `${WEEKDAYS[selectedDay.getDay()]}, ${formatDate(selectedDay)}`}
          </h2>
          <span className="text-[10px] font-mono text-neutral-300">
            {gamesForDay.length} game{gamesForDay.length !== 1 ? 's' : ''}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedDay.toISOString()}-${leagueFilter}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {gamesForDay.length > 0 ? (
              gamesForDay.map((game, idx) => (
                <ScheduleGameCard key={game.id} game={game} index={idx} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <Calendar className="h-10 w-10 text-neutral-200 mb-3" />
                <p className="text-sm font-bold text-neutral-400">
                  No games scheduled
                </p>
                <p className="text-[10px] text-neutral-300 mt-1">
                  Check back later for updates
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
