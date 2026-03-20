'use client';

import { motion } from 'motion/react';
import {
  Plus,
  Trophy,
  Clock,
  CheckCircle2,
  Radio,
  MapPin,
  Edit3,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type GameStatus = 'live' | 'upcoming' | 'final';

interface AdminGame {
  id: string;
  teamA: { name: string; score: number; color: string };
  teamB: { name: string; score: number; color: string };
  status: GameStatus;
  venue: string;
  time: string;
  level: string;
}

const ADMIN_GAMES: AdminGame[] = [
  { id: 'ag-001', teamA: { name: 'B.M.T. Titans', score: 54, color: '#f97316' }, teamB: { name: 'Scarborough Elite', score: 48, color: '#64748b' }, status: 'live', venue: 'Pan Am Centre', time: 'Q3 4:22', level: 'Pro' },
  { id: 'ag-002', teamA: { name: 'Northside Kings', score: 67, color: '#10b981' }, teamB: { name: 'Rexdale Runs', score: 61, color: '#ef4444' }, status: 'live', venue: 'Downsview Park', time: 'Q4 8:15', level: 'Pro' },
  { id: 'ag-003', teamA: { name: 'UofT Varsity Blues', score: 81, color: '#1d4ed8' }, teamB: { name: 'TMU Bold', score: 74, color: '#7c3aed' }, status: 'live', venue: 'Goldring Centre', time: 'Q4 2:41', level: 'Collegiate' },
  { id: 'ag-004', teamA: { name: 'East York Wolves', score: 0, color: '#6b7280' }, teamB: { name: 'SJPII Panthers', score: 0, color: '#3b82f6' }, status: 'upcoming', venue: "L'Amoreaux Complex", time: 'Today 7:30 PM', level: 'Pro' },
  { id: 'ag-005', teamA: { name: 'B.M.T. Titans', score: 0, color: '#f97316' }, teamB: { name: 'Northside Kings', score: 0, color: '#10b981' }, status: 'upcoming', venue: 'Pan Am Centre', time: 'Tomorrow 2:00 PM', level: 'Pro' },
  { id: 'ag-006', teamA: { name: 'York Lions', score: 0, color: '#dc2626' }, teamB: { name: 'Humber Hawks', score: 0, color: '#0ea5e9' }, status: 'upcoming', venue: 'Tait McKenzie Centre', time: 'Today 8:00 PM', level: 'Collegiate' },
  { id: 'ag-007', teamA: { name: 'Oakwood Barons', score: 62, color: '#8b5cf6' }, teamB: { name: 'Eastern Commerce', score: 58, color: '#f59e0b' }, status: 'final', venue: 'Oakwood CI Gym', time: 'Final', level: 'High School' },
  { id: 'ag-008', teamA: { name: 'Scarborough Elite', score: 72, color: '#64748b' }, teamB: { name: 'Rexdale Runs', score: 65, color: '#ef4444' }, status: 'final', venue: 'Malvern CC', time: 'Final', level: 'Pro' },
];

const STATUS_CONFIG: Record<GameStatus, { label: string; icon: typeof Radio; className: string; dotClass: string }> = {
  live: { label: 'Live', icon: Radio, className: 'bg-accent-red/[0.08] text-accent-red', dotClass: 'bg-accent-red animate-pulse' },
  upcoming: { label: 'Upcoming', icon: Clock, className: 'bg-accent-blue/[0.08] text-accent-blue', dotClass: 'bg-accent-blue' },
  final: { label: 'Final', icon: CheckCircle2, className: 'bg-neutral-100 text-neutral-600', dotClass: 'bg-neutral-400' },
};

export default function GamesPage(): React.ReactElement {
  const liveGames = ADMIN_GAMES.filter((g) => g.status === 'live');
  const upcomingGames = ADMIN_GAMES.filter((g) => g.status === 'upcoming');
  const finalGames = ADMIN_GAMES.filter((g) => g.status === 'final');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Games</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage game schedules, scores, and results
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800">
          <Plus size={16} />
          Add Game
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {([
          { status: 'live' as const, count: liveGames.length, icon: Radio, color: 'bg-accent-red/[0.08] text-accent-red' },
          { status: 'upcoming' as const, count: upcomingGames.length, icon: Calendar, color: 'bg-accent-blue/[0.08] text-accent-blue' },
          { status: 'final' as const, count: finalGames.length, icon: CheckCircle2, color: 'bg-neutral-100 text-neutral-600' },
        ]).map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.status}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="rounded-[20px] border border-black/[0.06] bg-white p-4"
            >
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-2xl', item.color)}>
                <Icon size={18} />
              </div>
              <p className="mt-2 font-mono text-2xl font-black text-neutral-900">{item.count}</p>
              <p className="text-xs capitalize text-neutral-500">{item.status} Games</p>
            </motion.div>
          );
        })}
      </div>

      {/* Live games */}
      {liveGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-[20px] border border-accent-red/20 bg-white p-5"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-red opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-red" />
            </span>
            <h2 className="text-sm font-bold text-neutral-900">Live Now</h2>
          </div>
          <div className="mt-4 space-y-3">
            {liveGames.map((game) => (
              <GameRow key={game.id} game={game} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming games */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-5"
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-accent-blue" />
          <h2 className="text-sm font-bold text-neutral-900">Upcoming</h2>
        </div>
        <div className="mt-4 space-y-3">
          {upcomingGames.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </div>
      </motion.div>

      {/* Completed games */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-5"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-neutral-400" />
          <h2 className="text-sm font-bold text-neutral-900">Completed</h2>
        </div>
        <div className="mt-4 space-y-3">
          {finalGames.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </div>
      </motion.div>

      {/* Score entry placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="rounded-[20px] border border-dashed border-black/[0.1] bg-white p-8 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface">
          <Edit3 size={20} className="text-neutral-400" />
        </div>
        <h3 className="mt-3 text-sm font-bold text-neutral-900">Score Entry</h3>
        <p className="mt-1 text-xs text-neutral-500">
          Select a live game above to enter real-time scores and stats
        </p>
      </motion.div>
    </div>
  );
}

function GameRow({ game }: { game: AdminGame }): React.ReactElement {
  const statusCfg = STATUS_CONFIG[game.status];

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/[0.04] p-3 transition-colors hover:bg-surface/30">
      {/* Teams */}
      <div className="flex flex-1 items-center gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: game.teamA.color }}
          />
          <span className="truncate text-sm font-semibold text-neutral-900">{game.teamA.name}</span>
          {game.status !== 'upcoming' && (
            <span className="shrink-0 font-mono text-sm font-black text-neutral-900">{game.teamA.score}</span>
          )}
        </div>

        <span className="shrink-0 text-xs font-bold text-neutral-300">VS</span>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          {game.status !== 'upcoming' && (
            <span className="shrink-0 font-mono text-sm font-black text-neutral-900">{game.teamB.score}</span>
          )}
          <span className="truncate text-sm font-semibold text-neutral-900">{game.teamB.name}</span>
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: game.teamB.color }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="hidden items-center gap-3 sm:flex">
        <span className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500">
          {game.level}
        </span>
        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <MapPin size={12} />
          <span className="max-w-[120px] truncate">{game.venue}</span>
        </div>
        <span className={cn('inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold', statusCfg.className)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg.dotClass)} />
          {game.status === 'live' ? game.time : statusCfg.label}
        </span>
      </div>
    </div>
  );
}
