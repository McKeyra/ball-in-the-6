'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface TeamScore {
  name: string;
  color: string;
  score: number;
  record: string;
  quarterScores: number[];
}

interface ScoreboardProps {
  homeTeam: TeamScore;
  awayTeam: TeamScore;
  period: string;
  gameClock: string;
  isLive: boolean;
  status: 'live' | 'final' | 'upcoming';
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  homeTeam,
  awayTeam,
  period,
  gameClock,
  isLive,
  status,
}) => {
  const [clock, setClock] = useState(gameClock);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setTick((prev) => !prev);
      setClock((prev) => {
        const parts = prev.split(':');
        if (parts.length !== 2) return prev;
        let minutes = parseInt(parts[0], 10);
        let seconds = parseInt(parts[1], 10);
        if (seconds === 0) {
          if (minutes === 0) return prev;
          minutes -= 1;
          seconds = 59;
        } else {
          seconds -= 1;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[20px] border border-neutral-200/60 bg-white p-6"
    >
      {/* Live badge */}
      {isLive && (
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
            Live
          </span>
        </div>
      )}

      {status === 'final' && (
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Final
          </span>
        </div>
      )}

      {/* Period & Clock */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          {period}
        </span>
        {isLive && (
          <motion.span
            animate={{ opacity: tick ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-lg font-black text-neutral-900"
          >
            {clock}
          </motion.span>
        )}
      </div>

      {/* Teams & Scores */}
      <div className="flex items-center justify-between gap-4">
        {/* Away Team */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${awayTeam.color}18` }}
          >
            <Zap className="h-7 w-7" style={{ color: awayTeam.color }} />
          </div>
          <p className="text-sm font-bold text-neutral-700 text-center">
            {awayTeam.name}
          </p>
          <p className="text-[10px] font-mono text-neutral-400">
            {awayTeam.record}
          </p>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-4">
          <motion.span
            key={`away-${awayTeam.score}`}
            initial={{ scale: 1.2, color: '#c8ff00' }}
            animate={{ scale: 1, color: awayTeam.score >= homeTeam.score ? '#171717' : '#a3a3a3' }}
            transition={{ duration: 0.5 }}
            className="font-mono text-5xl font-black"
          >
            {awayTeam.score}
          </motion.span>
          <span className="text-lg font-mono text-neutral-200">:</span>
          <motion.span
            key={`home-${homeTeam.score}`}
            initial={{ scale: 1.2, color: '#c8ff00' }}
            animate={{ scale: 1, color: homeTeam.score >= awayTeam.score ? '#171717' : '#a3a3a3' }}
            transition={{ duration: 0.5 }}
            className="font-mono text-5xl font-black"
          >
            {homeTeam.score}
          </motion.span>
        </div>

        {/* Home Team */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${homeTeam.color}18` }}
          >
            <Zap className="h-7 w-7" style={{ color: homeTeam.color }} />
          </div>
          <p className="text-sm font-bold text-neutral-700 text-center">
            {homeTeam.name}
          </p>
          <p className="text-[10px] font-mono text-neutral-400">
            {homeTeam.record}
          </p>
        </div>
      </div>

      {/* Quarter Scores Breakdown */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="pb-2 text-left text-[10px] font-mono uppercase tracking-widest text-neutral-300 w-[120px]">
                Team
              </th>
              {quarters.map((q) => (
                <th
                  key={q}
                  className="pb-2 text-[10px] font-mono uppercase tracking-widest text-neutral-300 w-12"
                >
                  {q}
                </th>
              ))}
              <th className="pb-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400 w-14">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-50">
              <td className="py-2 text-left text-xs font-bold text-neutral-600 truncate max-w-[120px]">
                {awayTeam.name}
              </td>
              {awayTeam.quarterScores.map((qs, i) => (
                <td
                  key={i}
                  className="py-2 font-mono text-xs text-neutral-500"
                >
                  {qs}
                </td>
              ))}
              <td className="py-2 font-mono text-sm font-black text-neutral-900">
                {awayTeam.score}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-left text-xs font-bold text-neutral-600 truncate max-w-[120px]">
                {homeTeam.name}
              </td>
              {homeTeam.quarterScores.map((qs, i) => (
                <td
                  key={i}
                  className="py-2 font-mono text-xs text-neutral-500"
                >
                  {qs}
                </td>
              ))}
              <td className="py-2 font-mono text-sm font-black text-neutral-900">
                {homeTeam.score}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
