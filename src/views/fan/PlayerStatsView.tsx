'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

const DIMENSIONS = ['PHYS', 'SKIL', 'RFIT', 'OUTP', 'CEIL', 'MIND'] as const;

interface TrendInfo {
  symbol: string;
  color: string;
  label: string;
}

interface PlayerData {
  id: string;
  name: string;
  number: number;
  position: string;
  team: string;
  scores: Record<string, number>;
  trend: string;
  insight: string;
  hotTake: string;
  recentLine: string;
  disclaimer: string;
}

const TREND_ICONS: Record<string, TrendInfo> = {
  up: { symbol: '\u2191', color: 'text-emerald-400', label: 'Trending Up' },
  steady: { symbol: '\u2192', color: 'text-amber-400', label: 'Steady' },
  down: { symbol: '\u2193', color: 'text-red-400', label: 'Trending Down' },
};

interface ApiPlayer {
  id: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  number?: number;
  jersey_number?: number;
  position?: string;
  team?: string;
  team_abbr?: string;
  scores?: Record<string, number>;
  trend?: string;
  insight?: string;
  hot_take?: string;
  recent_line?: string;
  disclaimer?: string;
}

function mapApiPlayer(p: ApiPlayer): PlayerData {
  return {
    id: p.id,
    name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
    number: p.number || p.jersey_number || 0,
    position: p.position || '-',
    team: p.team || p.team_abbr || '-',
    scores: p.scores || { PHYS: 0, SKIL: 0, RFIT: 0, OUTP: 0, CEIL: 0, MIND: 0 },
    trend: p.trend || 'steady',
    insight: p.insight || 'No analysis available yet.',
    hotTake: p.hot_take || '',
    recentLine: p.recent_line || '-',
    disclaimer: p.disclaimer || 'AI-generated analysis based on statistical trends. Not financial advice.',
  };
}

function RadarChart({ scores, size = 140 }: { scores: Record<string, number>; size?: number }): React.ReactElement {
  const center = size / 2;
  const radius = (size / 2) - 20;
  const angleStep = (2 * Math.PI) / DIMENSIONS.length;

  const getPoint = (dimIndex: number, value: number): { x: number; y: number } => {
    const angle = angleStep * dimIndex - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const gridLevels = [25, 50, 75, 100];
  const dataPoints = DIMENSIONS.map((_, i) => getPoint(i, scores[DIMENSIONS[i]] || 0));
  const pathD = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {gridLevels.map((level) => {
        const points = DIMENSIONS.map((_, i) => getPoint(i, level));
        const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={level} d={d} fill="none" stroke="#404040" strokeWidth="0.5" />;
      })}

      {DIMENSIONS.map((_, i) => {
        const end = getPoint(i, 100);
        return (
          <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="#404040" strokeWidth="0.5" />
        );
      })}

      <path d={pathD} fill="rgba(220, 38, 38, 0.15)" stroke="#dc2626" strokeWidth="1.5" />

      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#dc2626" />
      ))}

      {DIMENSIONS.map((dim, i) => {
        const labelPoint = getPoint(i, 120);
        return (
          <text
            key={dim}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-neutral-500 text-[8px] font-medium"
          >
            {dim}
          </text>
        );
      })}
    </svg>
  );
}

function PlayerCard({ player }: { player: PlayerData }): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const composite = Math.round(
    DIMENSIONS.reduce((sum, d) => sum + (player.scores[d] || 0), 0) / DIMENSIONS.length
  );
  const trendInfo = TREND_ICONS[player.trend] || TREND_ICONS.steady;

  return (
    <div
      className={cn(
        'bg-neutral-900/80 border border-neutral-800 rounded-xl cursor-pointer transition-all duration-300',
        'hover:border-neutral-700',
        expanded && 'border-red-600/30',
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-lg font-bold text-red-500">
            #{player.number}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-sm truncate">{player.name}</h3>
              <span className={cn('text-sm font-bold', trendInfo.color)}>
                {trendInfo.symbol}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
              <span>{player.position}</span>
              <span>|</span>
              <span>{player.team}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              'text-2xl font-bold tabular-nums',
              composite >= 85 ? 'text-emerald-400' : composite >= 75 ? 'text-amber-400' : 'text-neutral-400',
            )}>
              {composite}
            </div>
            <span className="text-[10px] text-neutral-600">AI6 Score</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-neutral-800 space-y-4">
            <RadarChart scores={player.scores} />

            <div className="grid grid-cols-6 gap-1">
              {DIMENSIONS.map((dim) => {
                const val = player.scores[dim] || 0;
                return (
                  <div key={dim} className="text-center">
                    <div className={cn(
                      'text-xs font-bold tabular-nums',
                      val >= 85 ? 'text-emerald-400' : val >= 75 ? 'text-amber-400' : 'text-neutral-400',
                    )}>
                      {val}
                    </div>
                    <div className="text-[8px] text-neutral-600">{dim}</div>
                  </div>
                );
              })}
            </div>

            <div className="bg-neutral-800/50 rounded-lg p-3 space-y-2">
              <p className="text-xs text-neutral-300 leading-relaxed">{player.insight}</p>
              <p className="text-xs text-red-400 italic">{player.hotTake}</p>
            </div>

            <div className="bg-neutral-800/30 rounded p-2 text-center">
              <p className="text-xs font-mono text-white font-medium">{player.recentLine}</p>
            </div>

            <p className="text-[9px] text-neutral-600 italic">{player.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PlayerStatsView(): React.ReactElement {
  const { data: apiPlayers = [], isLoading } = useQuery<ApiPlayer[]>({
    queryKey: ['fan-player-stats'],
    queryFn: async () => {
      const res = await fetch('/api/players?sport=basketball');
      if (!res.ok) throw new Error('Failed to fetch players');
      return res.json();
    },
  });

  const players = apiPlayers.map(mapApiPlayer);

  return (
    <div className="max-w-lg mx-auto space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Player Breakdown</h1>
        <span className="text-xs text-neutral-500">AI6 Scoring</span>
      </div>

      <p className="text-xs text-neutral-500">
        Tap a player to view detailed breakdown, radar chart, and insights.
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-neutral-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 bg-neutral-800 rounded" />
                  <div className="h-3 w-16 bg-neutral-800 rounded" />
                </div>
                <div className="h-8 w-10 bg-neutral-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-8 text-center">
          <p className="text-neutral-500 text-sm">No player data available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}
