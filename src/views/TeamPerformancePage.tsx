'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Calendar, History, ChevronRight } from 'lucide-react';

/* ---------- Types ---------- */
interface Game {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_team_name: string;
  away_team_name: string;
  home_team_color?: string;
  away_team_color?: string;
  home_score: number;
  away_score: number;
  status: string;
  game_date: string;
  game_time?: string;
  location?: string;
}

interface Team {
  id: string;
  team_name: string;
  team_color: string;
  league?: string;
  division?: string;
  roster?: unknown[];
}

/* ---------- Component ---------- */
export function TeamPerformancePage(): React.ReactElement {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const [activeTab, setActiveTab] = useState<'trends' | 'schedule' | 'results'>('trends');

  const { data: team = null } = useQuery<Team | null>({
    queryKey: ['team-performance', teamId],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) throw new Error('Failed to fetch team');
      return res.json();
    },
    enabled: !!teamId,
  });

  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ['team-performance-games'],
    queryFn: async () => {
      const res = await fetch('/api/games?sport=basketball');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const teamGames = useMemo(() => {
    return games.filter((g) => g.home_team_id === teamId || g.away_team_id === teamId);
  }, [games, teamId]);

  const finishedGames = teamGames
    .filter((g) => g.status === 'finished')
    .sort((a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime());

  const upcomingGames = teamGames
    .filter((g) => g.status === 'not_started')
    .sort((a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime())
    .slice(0, 5);

  const recentGames = [...finishedGames]
    .sort((a, b) => new Date(b.game_date).getTime() - new Date(a.game_date).getTime())
    .slice(0, 10);

  const stats = useMemo(() => {
    let wins = 0;
    let losses = 0;
    let pointsFor = 0;
    let pointsAgainst = 0;

    finishedGames.forEach((game) => {
      const isHome = game.home_team_id === teamId;
      const teamScore = isHome ? game.home_score : game.away_score;
      const oppScore = isHome ? game.away_score : game.home_score;
      const won = teamScore > oppScore;

      pointsFor += teamScore || 0;
      pointsAgainst += oppScore || 0;
      if (won) wins++;
      else losses++;
    });

    const gamesPlayed = wins + losses;
    return {
      wins,
      losses,
      winPct: gamesPlayed > 0 ? (wins / gamesPlayed * 100).toFixed(1) : '0.0',
      ppg: gamesPlayed > 0 ? (pointsFor / gamesPlayed).toFixed(1) : '0.0',
      oppg: gamesPlayed > 0 ? (pointsAgainst / gamesPlayed).toFixed(1) : '0.0',
      diff: gamesPlayed > 0 ? ((pointsFor - pointsAgainst) / gamesPlayed).toFixed(1) : '0.0',
    };
  }, [finishedGames, teamId]);

  if (!team) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-white/60">Loading team data...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'trends' as const, label: 'Trends', icon: TrendingUp },
    { id: 'schedule' as const, label: 'Upcoming', icon: Calendar },
    { id: 'results' as const, label: 'Results', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="p-4 md:p-6 lg:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
            <Link
              href={`/teams/${teamId}/overview`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md"
              style={{
                background: '#0f0f0f',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div
              className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl flex-shrink-0"
              style={{ background: team.team_color || '#666' }}
            >
              {team.team_name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 truncate">{team.team_name}</h1>
              <p className="text-sm md:text-base text-white/60">{team.league} - {team.division}</p>
            </div>
          </div>

          {/* Stats Summary */}
          <div
            className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-4 md:mb-6 p-4 md:p-6 rounded-2xl"
            style={{
              background: '#0f0f0f',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
            }}
          >
            <div className="text-center">
              <div className="text-xl md:text-3xl font-bold text-white/90">{stats.wins}-{stats.losses}</div>
              <div className="text-xs md:text-sm text-white/40">Record</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-3xl font-bold text-white/90">{stats.winPct}%</div>
              <div className="text-xs md:text-sm text-white/40">Win %</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-3xl font-bold text-white/90">{stats.ppg}</div>
              <div className="text-xs md:text-sm text-white/40">PPG</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-3xl font-bold text-white/90">{stats.oppg}</div>
              <div className="text-xs md:text-sm text-white/40">Opp PPG</div>
            </div>
            <div className="text-center">
              <div className={`text-xl md:text-3xl font-bold ${parseFloat(stats.diff) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {parseFloat(stats.diff) >= 0 ? '+' : ''}{stats.diff}
              </div>
              <div className="text-xs md:text-sm text-white/40">Diff</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-3xl font-bold text-white/90">{team.roster?.length || 0}</div>
              <div className="text-xs md:text-sm text-white/40">Players</div>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="grid grid-cols-3 mb-4 md:mb-6 p-1 rounded-2xl"
            style={{
              background: '#0f0f0f',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 min-h-[44px] text-sm md:text-base rounded-xl font-medium ${
                    activeTab === tab.id ? 'bg-[#c9a962] text-[#0f0f0f]' : 'text-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Trends Tab - Chart placeholder */}
          {activeTab === 'trends' && (
            <div className="space-y-4 md:space-y-6">
              <div
                className="p-4 md:p-6 rounded-2xl"
                style={{
                  background: '#0f0f0f',
                  boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                }}
              >
                <h3 className="text-base md:text-lg font-bold text-white/90 mb-3 md:mb-4">Scoring Trend</h3>
                {/* TODO: Add recharts LineChart component */}
                <div className="flex items-center justify-center h-[250px] text-white/40">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-white/20" />
                    <p>Scoring trend chart - install recharts to enable</p>
                  </div>
                </div>
              </div>

              <div
                className="p-4 md:p-6 rounded-2xl"
                style={{
                  background: '#0f0f0f',
                  boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                }}
              >
                <h3 className="text-base md:text-lg font-bold text-white/90 mb-3 md:mb-4">Point Differential by Game</h3>
                <div className="flex items-center justify-center h-[180px] text-white/40">
                  <p>Bar chart - install recharts to enable</p>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-3">
              {upcomingGames.length === 0 ? (
                <div
                  className="p-8 md:p-12 rounded-2xl text-center"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
                  }}
                >
                  <Calendar className="w-10 h-10 md:w-12 md:h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/40 text-sm md:text-base">No upcoming games scheduled</p>
                </div>
              ) : (
                upcomingGames.map((game) => {
                  const isHome = game.home_team_id === teamId;
                  const opponent = isHome ? game.away_team_name : game.home_team_name;
                  const oppColor = isHome ? game.away_team_color : game.home_team_color;

                  return (
                    <div
                      key={game.id}
                      className="p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4 min-h-[44px]"
                      style={{
                        background: '#0f0f0f',
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                      }}
                    >
                      <div
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: oppColor || '#666' }}
                      >
                        {opponent?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white/90 text-sm md:text-base truncate">
                          {isHome ? 'vs' : '@'} {opponent}
                        </div>
                        <div className="text-xs md:text-sm text-white/40">
                          {game.game_date}
                          {game.game_time && ` - ${game.game_time}`}
                        </div>
                      </div>
                      <div className="text-xs md:text-sm text-white/40 flex-shrink-0">{game.location || 'TBD'}</div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-3">
              {recentGames.length === 0 ? (
                <div
                  className="p-8 md:p-12 rounded-2xl text-center"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
                  }}
                >
                  <History className="w-10 h-10 md:w-12 md:h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/40 text-sm md:text-base">No completed games yet</p>
                </div>
              ) : (
                recentGames.map((game) => {
                  const isHome = game.home_team_id === teamId;
                  const teamScore = isHome ? game.home_score : game.away_score;
                  const oppScore = isHome ? game.away_score : game.home_score;
                  const won = teamScore > oppScore;
                  const opponent = isHome ? game.away_team_name : game.home_team_name;

                  return (
                    <div
                      key={game.id}
                      className="p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4 cursor-pointer hover:scale-[1.01] transition-transform min-h-[44px]"
                      style={{
                        background: '#0f0f0f',
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                      }}
                      onClick={() => router.push(`/games/${game.id}/detailed`)}
                    >
                      <div
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-white text-xs md:text-sm flex-shrink-0"
                        style={{ background: won ? '#22c55e' : '#ef4444' }}
                      >
                        {won ? 'W' : 'L'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white/90 text-sm md:text-base truncate">
                          {isHome ? 'vs' : '@'} {opponent}
                        </div>
                        <div className="text-xs md:text-sm text-white/40">{game.game_date}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-lg md:text-xl text-white/90">{teamScore} - {oppScore}</div>
                        <div className="text-[10px] md:text-xs text-white/40">{game.location || 'TBD'}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white/30 flex-shrink-0" />
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
