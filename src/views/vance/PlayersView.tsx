'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  ai6Score: number;
  trend: string;
  trendText: string;
  category: string;
}

interface TrendConfig {
  symbol: string;
  color: string;
  label: string;
}

const MOCK_PLAYERS: Player[] = [
  { id: 'vp1', name: 'Shai Gilgeous-Alexander', team: 'OKC', position: 'PG', ai6Score: 96, trend: 'up', trendText: 'MVP-caliber stretch, 32+ PPG last 15 games', category: 'elite' },
  { id: 'vp2', name: 'Nikola Jokic', team: 'DEN', position: 'C', ai6Score: 95, trend: 'steady', trendText: 'Consistent triple-double machine, per usual', category: 'elite' },
  { id: 'vp3', name: 'Luka Doncic', team: 'DAL', position: 'PG', ai6Score: 94, trend: 'up', trendText: 'Improved defense and reduced turnovers', category: 'elite' },
  { id: 'vp4', name: 'Giannis Antetokounmpo', team: 'MIL', position: 'PF', ai6Score: 93, trend: 'steady', trendText: 'Dominant as always, slight FT improvement', category: 'elite' },
  { id: 'vp5', name: 'Jayson Tatum', team: 'BOS', position: 'SF', ai6Score: 91, trend: 'down', trendText: 'Minor efficiency dip, still elite scorer', category: 'elite' },
  { id: 'vp6', name: 'Anthony Edwards', team: 'MIN', position: 'SG', ai6Score: 89, trend: 'up', trendText: 'Explosive scoring, improved playmaking', category: 'star' },
  { id: 'vp7', name: 'Scottie Barnes', team: 'TOR', position: 'SF', ai6Score: 88, trend: 'up', trendText: 'Breakout season, all-star caliber play', category: 'star' },
  { id: 'vp8', name: 'Jaylen Brown', team: 'BOS', position: 'SG', ai6Score: 87, trend: 'steady', trendText: 'Consistent two-way force', category: 'star' },
  { id: 'vp9', name: 'Kevin Durant', team: 'PHX', position: 'SF', ai6Score: 86, trend: 'down', trendText: 'Age catching up, but still scores at will', category: 'star' },
  { id: 'vp10', name: 'Chet Holmgren', team: 'OKC', position: 'C', ai6Score: 84, trend: 'up', trendText: 'Sophomore leap, elite rim protection', category: 'star' },
  { id: 'vp11', name: 'Immanuel Quickley', team: 'TOR', position: 'PG', ai6Score: 82, trend: 'up', trendText: 'Thriving as primary ball handler', category: 'star' },
  { id: 'vp12', name: 'RJ Barrett', team: 'TOR', position: 'SG', ai6Score: 80, trend: 'steady', trendText: 'Solid all-around play, needs efficiency bump', category: 'star' },
  { id: 'vp13', name: 'Domantas Sabonis', team: 'SAC', position: 'C', ai6Score: 83, trend: 'steady', trendText: 'Board monster, great passer for a big', category: 'star' },
  { id: 'vp14', name: 'Tyrese Haliburton', team: 'IND', position: 'PG', ai6Score: 81, trend: 'down', trendText: 'Slight regression from last year peak', category: 'star' },
  { id: 'vp15', name: 'Gradey Dick', team: 'TOR', position: 'SG', ai6Score: 76, trend: 'up', trendText: 'Shooting 42% from three, breakout candidate', category: 'rising' },
  { id: 'vp16', name: 'Jakob Poeltl', team: 'TOR', position: 'C', ai6Score: 74, trend: 'steady', trendText: 'Reliable screen-setter and rim protector', category: 'solid' },
  { id: 'vp17', name: 'Jalen Williams', team: 'OKC', position: 'SF', ai6Score: 85, trend: 'up', trendText: 'Most versatile young wing in the league', category: 'star' },
  { id: 'vp18', name: 'Austin Reaves', team: 'LAL', position: 'SG', ai6Score: 79, trend: 'up', trendText: 'Undrafted to all-star consideration', category: 'rising' },
];

const TREND_CONFIG: Record<string, TrendConfig> = {
  up: { symbol: '\u2191', color: 'text-emerald-400', label: 'Trending Up' },
  steady: { symbol: '\u2192', color: 'text-amber-400', label: 'Steady' },
  down: { symbol: '\u2193', color: 'text-red-400', label: 'Trending Down' },
};

function getScoreColor(score: number): { text: string; bg: string } {
  if (score >= 90) return { text: 'text-[#C9A92C]', bg: 'bg-[#C9A92C]/10 border-[#C9A92C]/30' };
  if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  if (score >= 70) return { text: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
  return { text: 'text-neutral-400', bg: 'bg-neutral-700/50 border-neutral-600/30' };
}

function PlayerCard({ player }: { player: Player }): React.ReactElement {
  const scoreColor = getScoreColor(player.ai6Score);
  const trend = TREND_CONFIG[player.trend] || TREND_CONFIG.steady;

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all p-3">
      <div className="flex items-center gap-3">
        <div className={cn('w-12 h-12 rounded-lg border flex items-center justify-center', scoreColor.bg)}>
          <span className={cn('text-lg font-bold tabular-nums', scoreColor.text)}>
            {player.ai6Score}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm text-white font-semibold truncate">{player.name}</h3>
            <span className={cn('text-sm font-bold', trend.color)}>{trend.symbol}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
            <span>{player.team}</span>
            <span>|</span>
            <span>{player.position}</span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{player.trendText}</p>
        </div>
      </div>
    </div>
  );
}

export function PlayersView(): React.ReactElement {
  const [sortBy, setSortBy] = useState('score');
  const [trendFilter, setTrendFilter] = useState('all');

  const players = MOCK_PLAYERS;

  const filtered = useMemo(() => {
    let result = [...players];
    if (trendFilter !== 'all') result = result.filter((p) => p.trend === trendFilter);
    if (sortBy === 'score') result.sort((a, b) => b.ai6Score - a.ai6Score);
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'trend') {
      const trendOrder: Record<string, number> = { up: 0, steady: 1, down: 2 };
      result.sort((a, b) => (trendOrder[a.trend] ?? 1) - (trendOrder[b.trend] ?? 1));
    }
    return result;
  }, [players, sortBy, trendFilter]);

  return (
    <div className="max-w-lg mx-auto space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Player Ratings</h1>
        <span className="text-xs text-neutral-500">AI6 Scoring</span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'up', label: '\u2191 Up' },
            { id: 'steady', label: '\u2192 Steady' },
            { id: 'down', label: '\u2193 Down' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTrendFilter(opt.id)}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-all',
                trendFilter === opt.id ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          {[
            { key: 'score', label: 'Score' },
            { key: 'name', label: 'Name' },
            { key: 'trend', label: 'Trend' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={cn(
                'px-2 py-1 rounded text-[10px] font-medium transition-all',
                sortBy === opt.key ? 'bg-neutral-700 text-white' : 'bg-neutral-800/50 text-neutral-500',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Score Legend */}
      <div className="flex gap-3 flex-wrap text-[9px] text-neutral-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#C9A92C]" /> 90+ Elite</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400" /> 80+ Star</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-400" /> 70+ Rising</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-neutral-500" /> &lt;70 Solid</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 text-sm">No players match your filters.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}
