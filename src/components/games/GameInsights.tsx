'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Zap, Target } from 'lucide-react';

interface KeyMatchup {
  playerA: string;
  playerB: string;
  analysis: string;
}

interface PlayerImpact {
  name: string;
  team: 'home' | 'away';
  rating: number;
  note: string;
}

interface GameInsightsProps {
  homeTeamName: string;
  awayTeamName: string;
  homeTeamColor: string;
  awayTeamColor: string;
  winProbability: { home: number; away: number };
  momentum: 'home' | 'away' | 'neutral';
  predictedScore: { home: number; away: number };
  keyMatchup: KeyMatchup;
  playerImpacts: PlayerImpact[];
  analysisText: string;
}

export const GameInsights: React.FC<GameInsightsProps> = ({
  homeTeamName,
  awayTeamName,
  homeTeamColor,
  awayTeamColor,
  winProbability,
  momentum,
  predictedScore,
  keyMatchup,
  playerImpacts,
  analysisText,
}) => {
  const momentumLabel =
    momentum === 'home'
      ? homeTeamName
      : momentum === 'away'
        ? awayTeamName
        : 'Even';
  const momentumColor =
    momentum === 'home'
      ? homeTeamColor
      : momentum === 'away'
        ? awayTeamColor
        : '#a3a3a3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-[20px] border border-neutral-200/60 bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
          Game Insights
        </h3>
        <div className="flex items-center gap-1.5 rounded-full bg-[#c8ff00]/10 px-3 py-1">
          <Sparkles className="h-3 w-3 text-[#c8ff00]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#9ab800]">
            Powered by AI6
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Analysis Text */}
        <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-4">
          <p className="text-xs text-neutral-600 leading-relaxed">
            {analysisText}
          </p>
        </div>

        {/* Win Probability */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Win Probability
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-neutral-700 w-24 truncate text-right">
              {awayTeamName}
            </span>
            <div className="flex-1 flex h-4 rounded-full overflow-hidden bg-neutral-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${winProbability.away}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                className="h-full rounded-l-full flex items-center justify-end pr-2"
                style={{ backgroundColor: awayTeamColor }}
              >
                {winProbability.away >= 20 && (
                  <span className="text-[9px] font-black text-white">
                    {winProbability.away}%
                  </span>
                )}
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${winProbability.home}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                className="h-full rounded-r-full flex items-center justify-start pl-2"
                style={{ backgroundColor: homeTeamColor }}
              >
                {winProbability.home >= 20 && (
                  <span className="text-[9px] font-black text-white">
                    {winProbability.home}%
                  </span>
                )}
              </motion.div>
            </div>
            <span className="text-xs font-bold text-neutral-700 w-24 truncate">
              {homeTeamName}
            </span>
          </div>
        </div>

        {/* Momentum + Predicted Score */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Momentum
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: momentumColor }}
              />
              <span className="text-sm font-bold text-neutral-800">
                {momentumLabel}
              </span>
            </div>
            <motion.div
              className="mt-2 h-1 rounded-full bg-neutral-200 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: momentumColor }}
                initial={{ width: '0%' }}
                animate={{
                  width:
                    momentum === 'neutral'
                      ? '50%'
                      : momentum === 'home'
                        ? '75%'
                        : '75%',
                }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </motion.div>
          </div>

          <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Target className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Predicted Final
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-black text-neutral-800">
                {predictedScore.away}
              </span>
              <span className="text-neutral-300 text-xs">-</span>
              <span className="font-mono text-lg font-black text-neutral-800">
                {predictedScore.home}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">
              {awayTeamName} vs {homeTeamName}
            </p>
          </div>
        </div>

        {/* Key Matchup */}
        <div className="rounded-xl border border-[#c8ff00]/20 bg-[#c8ff00]/[0.04] p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Zap className="h-3.5 w-3.5 text-[#c8ff00]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#9ab800]">
              Key Matchup
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-neutral-800">
              {keyMatchup.playerA}
            </span>
            <span className="text-[10px] font-mono text-neutral-300">vs</span>
            <span className="text-sm font-bold text-neutral-800">
              {keyMatchup.playerB}
            </span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {keyMatchup.analysis}
          </p>
        </div>

        {/* Player Impact Ratings */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">
            Player Impact Ratings
          </h4>
          <div className="space-y-2">
            {playerImpacts.map((impact, idx) => (
              <motion.div
                key={impact.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      impact.team === 'home'
                        ? homeTeamColor
                        : awayTeamColor,
                  }}
                />
                <span className="text-xs font-bold text-neutral-700 w-28 truncate">
                  {impact.name}
                </span>
                <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#c8ff00]"
                    initial={{ width: 0 }}
                    animate={{ width: `${impact.rating}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.8 + idx * 0.1,
                    }}
                  />
                </div>
                <span className="font-mono text-xs font-bold text-neutral-800 w-8 text-right">
                  {impact.rating}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
