'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { TrendingUp, Users, Calendar, Target } from 'lucide-react';

/* ---------- Types ---------- */
interface Stat {
  label: string;
  value: string;
  icon: typeof Target;
}

interface GameResult {
  opponent: string;
  score: string;
  result: 'W' | 'L';
  date: string;
}

interface PlayerStat {
  name: string;
  points: number;
  position: string;
}

interface TeamDashboardData {
  name?: string;
  wins?: number;
  losses?: number;
  ties?: number;
  ppg?: number;
  player_count?: number;
  upcoming_games?: number;
  recent_games?: GameResult[];
  top_scorers?: PlayerStat[];
}

/* ---------- Component ---------- */
export function TeamDashboardPage(): React.ReactElement {
  const params = useParams();
  const teamId = params.id as string;

  const { data: dashboardData, isLoading } = useQuery<TeamDashboardData>({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) throw new Error('Failed to fetch team dashboard');
      return res.json();
    },
    enabled: !!teamId,
  });

  const teamName = dashboardData?.name || 'Team';
  const wins = dashboardData?.wins || 0;
  const losses = dashboardData?.losses || 0;
  const playerCount = dashboardData?.player_count || 0;

  const stats: Stat[] = [
    { label: 'Record', value: `${wins}-${losses}`, icon: Target },
    { label: 'PPG', value: String(dashboardData?.ppg || 0), icon: TrendingUp },
    { label: 'Players', value: String(playerCount), icon: Users },
    { label: 'Games', value: String(dashboardData?.upcoming_games || 0), icon: Calendar },
  ];

  const games: GameResult[] = dashboardData?.recent_games || [];
  const players: PlayerStat[] = dashboardData?.top_scorers || [];

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 pb-24 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1e2749 100%)' }}>
        <div className="text-xl text-white/60 animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8 pb-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1e2749 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(123, 44, 191, 0.1) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <h1
          className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)',
          }}
        >
          {teamName} Dashboard
        </h1>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-4 md:p-6 rounded-xl md:rounded-2xl relative group transition-all duration-300 hover:scale-105"
                style={{
                  background: '#1a1a1a',
                  boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(30, 39, 73, 0.6)',
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl md:rounded-t-2xl"
                  style={{ background: 'linear-gradient(90deg, #c9a962, #c9a962)' }}
                />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm" style={{ color: '#b4bcd0' }}>{stat.label}</span>
                  <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#c9a962' }} />
                </div>
                <div
                  className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)' }}
                >
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Recent Games */}
          <div
            className="p-4 md:p-6 rounded-xl md:rounded-2xl relative"
            style={{
              background: '#1a1a1a',
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(30, 39, 73, 0.6)',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-xl md:rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, #c9a962, #c9a962)' }}
            />
            <h2
              className="text-lg md:text-2xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)' }}
            >
              Recent Games
            </h2>
            <div className="space-y-3 md:space-y-4">
              {games.map((game, idx) => (
                <div
                  key={idx}
                  className="p-3 md:p-4 rounded-lg md:rounded-xl relative min-h-[44px]"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(21, 27, 61, 0.5)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 md:gap-3 mb-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ background: '#c9a962' }} />
                        <span className="text-sm md:text-lg font-semibold text-white">vs {game.opponent}</span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{
                            background: game.result === 'W' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: game.result === 'W' ? '#10b981' : '#ef4444',
                          }}
                        >
                          {game.result}
                        </span>
                      </div>
                      <div className="text-xs md:text-sm" style={{ color: '#b4bcd0' }}>{game.date}</div>
                    </div>
                    <div
                      className="text-lg md:text-2xl font-bold bg-clip-text text-transparent"
                      style={{ backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)' }}
                    >
                      {game.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Player Leaderboard */}
          <div
            className="p-4 md:p-6 rounded-xl md:rounded-2xl relative"
            style={{
              background: '#1a1a1a',
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(30, 39, 73, 0.6)',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-xl md:rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, #c9a962, #c9a962)' }}
            />
            <h2
              className="text-lg md:text-2xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)' }}
            >
              Top Scorers
            </h2>
            <div className="space-y-2 md:space-y-3">
              {players.map((player, idx) => (
                <div
                  key={idx}
                  className="p-3 md:p-4 rounded-lg md:rounded-xl flex items-center justify-between min-h-[44px]"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(21, 27, 61, 0.5)',
                  }}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base text-white"
                      style={{ background: 'linear-gradient(135deg, #c9a962, #c9a962)' }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-sm md:text-base font-semibold text-white">{player.name}</div>
                      <div className="text-xs" style={{ color: '#b4bcd0' }}>{player.position}</div>
                    </div>
                  </div>
                  <div
                    className="text-lg md:text-2xl font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)' }}
                  >
                    {player.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
