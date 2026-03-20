'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Share2,
  Zap,
  Trophy,
  Target,
  Shield,
  Flame,
  Crosshair,
  Hand,
  Swords,
  Award,
  Brain,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLAYER_DETAILS, PLAYER_GAME_LOGS, PLAYER_HIGHLIGHTS } from '@/lib/player-data';
import { StatGrid } from '@/components/profiles/StatGrid';
import { GameLogTable } from '@/components/players/GameLogTable';
import { CourtDashboard } from '@/components/court/CourtDashboard';
import type { PlayerDetail, PlayerHighlight, HighlightType } from '@/types/player';

/* ------------------------------------------------------------------ */
/*  Highlight Type Config                                              */
/* ------------------------------------------------------------------ */

const HIGHLIGHT_CONFIG: Record<HighlightType, { icon: typeof Zap; color: string; bg: string; border: string }> = {
  dunk: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200/40' },
  three: { icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200/40' },
  assist: { icon: Hand, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200/40' },
  block: { icon: Shield, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200/40' },
  crossover: { icon: Swords, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200/40' },
  'game-winner': { icon: Trophy, color: 'text-[#C8FF00]', bg: 'bg-[#C8FF00]/5', border: 'border-[#C8FF00]/20' },
};

const POSITION_COLORS: Record<string, string> = {
  PG: 'from-purple-500 to-blue-500',
  SG: 'from-orange-500 to-red-500',
  SF: 'from-emerald-500 to-cyan-500',
  PF: 'from-pink-500 to-purple-500',
  C: 'from-yellow-500 to-orange-500',
} as const;

/* ------------------------------------------------------------------ */
/*  Highlight Card                                                     */
/* ------------------------------------------------------------------ */

const HighlightCard: React.FC<{ highlight: PlayerHighlight; index: number }> = ({ highlight, index }) => {
  const config = HIGHLIGHT_CONFIG[highlight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.35 }}
      className={cn(
        'rounded-[20px] border p-4',
        config.border,
        config.bg
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', config.bg)}>
          <Icon className={cn('h-5 w-5', config.color)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-bold text-neutral-900 truncate">
              {highlight.title}
            </h4>
            <span className="shrink-0 text-[10px] font-mono text-neutral-400">
              {highlight.date}
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            {highlight.description}
          </p>
          <span className={cn(
            'mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest',
            config.color,
            config.bg
          )}>
            {highlight.type.replace('-', ' ')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  AI6 Impact Analysis Section                                        */
/* ------------------------------------------------------------------ */

const ImpactAnalysis: React.FC<{ player: PlayerDetail }> = ({ player }) => {
  const offenseScore = Math.round((player.stats.ppg / 30) * 100);
  const efficiencyScore = Math.round(((player.stats.fgPct + player.stats.ftPct) / 2));
  const playmakingScore = Math.round((player.stats.apg / 10) * 100);
  const defenseScore = Math.round(((player.stats.spg + player.stats.bpg) / 4) * 100);
  const overallImpact = Math.round((offenseScore + efficiencyScore + playmakingScore + defenseScore) / 4);

  const dimensions = [
    { label: 'Offense', value: Math.min(offenseScore, 99), color: 'bg-orange-500' },
    { label: 'Efficiency', value: Math.min(efficiencyScore, 99), color: 'bg-emerald-500' },
    { label: 'Playmaking', value: Math.min(playmakingScore, 99), color: 'bg-blue-500' },
    { label: 'Defense', value: Math.min(defenseScore, 99), color: 'bg-red-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-[20px] border border-[#C8FF00]/20 bg-gradient-to-br from-neutral-900 to-neutral-800 p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#C8FF00]">
          <Brain className="h-4 w-4 text-black" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white">AI6 Impact Analysis</h3>
          <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
            Powered by THE KEY
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-[#C8FF00]" />
          <span className="font-mono text-lg font-black text-[#C8FF00]">
            {overallImpact}
          </span>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="space-y-3">
        {dimensions.map((dim, i) => (
          <motion.div
            key={dim.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                {dim.label}
              </span>
              <span className="font-mono text-xs font-bold text-white">
                {dim.value}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-neutral-700 overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', dim.color)}
                initial={{ width: 0 }}
                animate={{ width: `${dim.value}%` }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analysis text */}
      <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="h-3 w-3 text-[#C8FF00]" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#C8FF00]">
            Scouting Report
          </span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          {player.name} is a {player.position === 'PG' ? 'floor general' : player.position === 'SG' ? 'shooting specialist' : player.position === 'SF' ? 'versatile wing' : player.position === 'PF' ? 'paint dominator' : 'rim protector'} averaging {player.stats.ppg} PPG on {player.stats.fgPct}% shooting. {player.stats.apg > 5 ? `Elite playmaker with ${player.stats.apg} APG.` : ''} {player.stats.rpg > 7 ? `Dominant rebounder pulling down ${player.stats.rpg} RPG.` : ''} {player.stats.bpg > 1.5 ? `Defensive anchor with ${player.stats.bpg} BPG.` : ''} A top-tier talent in the Toronto Pro League with consistent production and impact on both ends.
        </p>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export const PlayerDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const player = useMemo(
    () => PLAYER_DETAILS.find((p) => p.id === params.id),
    [params.id]
  );

  const gameLogs = useMemo(
    () => PLAYER_GAME_LOGS[params.id ?? ''] ?? [],
    [params.id]
  );

  const highlights = useMemo(
    () => PLAYER_HIGHLIGHTS[params.id ?? ''] ?? [],
    [params.id]
  );

  if (!player) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-lg font-black text-neutral-900">Player Not Found</p>
          <p className="mt-1 text-sm text-neutral-400">This player does not exist.</p>
          <button
            type="button"
            onClick={() => router.push('/players')}
            className="mt-4 rounded-xl bg-[#C8FF00] px-6 py-2.5 text-sm font-black text-black transition-colors hover:bg-[#d4ff33]"
          >
            Back to Players
          </button>
        </div>
      </div>
    );
  }

  const gradient = POSITION_COLORS[player.position] ?? 'from-gray-500 to-slate-500';

  const seasonStatItems = [
    { label: 'PPG', value: player.stats.ppg, decimals: 1 },
    { label: 'RPG', value: player.stats.rpg, decimals: 1 },
    { label: 'APG', value: player.stats.apg, decimals: 1 },
    { label: 'SPG', value: player.stats.spg, decimals: 1 },
    { label: 'BPG', value: player.stats.bpg, decimals: 1 },
    { label: 'FG%', value: player.stats.fgPct, suffix: '%', decimals: 1 },
    { label: '3PT%', value: player.stats.threePct, suffix: '%', decimals: 1 },
    { label: 'FT%', value: player.stats.ftPct, suffix: '%', decimals: 1 },
  ];

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/players')}
            className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Players</span>
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100/60 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <div className="px-4 pt-4 space-y-5">
        {/* ============================================================ */}
        {/*  Hero Section                                                */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[20px] border border-neutral-200/60 bg-white overflow-hidden"
        >
          {/* Gradient banner */}
          <div className={cn('h-24 bg-gradient-to-br relative', gradient)}>
            <div className="absolute inset-0 bg-black/20" />
            <span className="absolute bottom-2 right-4 font-mono text-[64px] font-black leading-none text-white/15 select-none">
              {player.number}
            </span>
          </div>

          {/* Player info */}
          <div className="relative px-5 pb-5">
            {/* Avatar - overlaps banner */}
            <div className="relative -mt-10 mb-3">
              <div
                className={cn(
                  'flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-black text-white ring-4 ring-white shadow-lg',
                  gradient
                )}
              >
                {player.name.charAt(0)}
                {player.name.split(' ')[1]?.charAt(0) ?? ''}
              </div>
              <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-black text-white ring-2 ring-white">
                {player.number}
              </div>
            </div>

            {/* Name & details */}
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              {player.name}
            </h1>
            <p className="text-sm font-bold text-neutral-500 mt-0.5">
              {player.team}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="rounded-full bg-[#C8FF00] px-3 py-1 text-[11px] font-black text-black">
                {player.position}
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold text-neutral-600">
                #{player.number}
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold text-neutral-600">
                {player.height}
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold text-neutral-600">
                {player.weight} lbs
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold text-neutral-600">
                Age {player.age}
              </span>
            </div>

            <p className="text-[10px] font-mono text-neutral-400 mt-2">
              {player.school}
            </p>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/*  Season Averages                                             */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-5 w-5 text-[#C8FF00]" />
            <h2 className="text-lg font-black text-neutral-900 tracking-tight">
              Season Averages
            </h2>
            <span className="ml-auto text-[10px] font-mono text-neutral-400">
              {player.stats.gamesPlayed} GP &middot; {player.stats.mpg} MPG
            </span>
          </div>
          <StatGrid
            stats={seasonStatItems}
            columns={4}
            accentText="text-neutral-500"
            accentBg="bg-neutral-50"
            accentBorder="border-neutral-200"
          />
        </motion.div>

        {/* ============================================================ */}
        {/*  Game Log                                                    */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <GameLogTable games={gameLogs} />
        </motion.div>

        {/* ============================================================ */}
        {/*  Highlights                                                  */}
        {/* ============================================================ */}
        {highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame className="h-5 w-5 text-[#C8FF00]" />
              <h2 className="text-lg font-black text-neutral-900 tracking-tight">
                Highlights
              </h2>
            </div>
            <div className="space-y-3">
              {highlights.map((hl, i) => (
                <HighlightCard key={hl.id} highlight={hl} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/*  Shot Chart                                                  */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <CourtDashboard />
        </motion.div>

        {/* ============================================================ */}
        {/*  Bio                                                         */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="rounded-[20px] border border-neutral-200/60 bg-white p-5"
        >
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-3">
            About
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {player.bio}
          </p>

          {/* Social links */}
          {(player.socialLinks.instagram || player.socialLinks.twitter || player.socialLinks.tiktok) && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
              {player.socialLinks.instagram && (
                <span className="text-[11px] font-bold text-neutral-400">
                  IG: <span className="text-neutral-600">{player.socialLinks.instagram}</span>
                </span>
              )}
              {player.socialLinks.twitter && (
                <span className="text-[11px] font-bold text-neutral-400">
                  X: <span className="text-neutral-600">{player.socialLinks.twitter}</span>
                </span>
              )}
              {player.socialLinks.tiktok && (
                <span className="text-[11px] font-bold text-neutral-400">
                  TT: <span className="text-neutral-600">{player.socialLinks.tiktok}</span>
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* ============================================================ */}
        {/*  Accolades                                                   */}
        {/* ============================================================ */}
        {player.accolades.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="rounded-[20px] border border-neutral-200/60 bg-white p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-[#C8FF00]" />
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Accolades
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {player.accolades.map((accolade, i) => (
                <motion.span
                  key={accolade}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.25 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C8FF00]/20 bg-[#C8FF00]/5 px-3 py-1.5 text-xs font-bold text-neutral-700"
                >
                  <Trophy className="h-3 w-3 text-[#C8FF00]" />
                  {accolade}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/*  AI6 Impact Analysis                                         */}
        {/* ============================================================ */}
        <ImpactAnalysis player={player} />
      </div>
    </div>
  );
};
