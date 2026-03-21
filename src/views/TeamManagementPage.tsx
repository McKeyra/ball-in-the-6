'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Users, Shield, Calendar, MapPin, Clock as ClockIcon } from 'lucide-react';

/* ---------- Types ---------- */
interface Player {
  first_name: string;
  last_name: string;
  number: number;
  position: string;
  height?: string;
}

interface StaffMember {
  name: string;
  title: string;
}

interface Game {
  id: string;
  home_team_name: string;
  away_team_name: string;
  home_score: number;
  away_score: number;
  game_date: string;
  game_time?: string;
  location?: string;
  status: string;
}

interface Team {
  id: string;
  team_name: string;
  division: string;
  team_color: string;
  logo_url?: string;
  roster?: Player[];
  staff?: StaffMember[];
}

/* ---------- Component ---------- */
export function TeamManagementPage(): React.ReactElement {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'roster' | 'staff' | 'games'>('roster');

  const { data: team = null, isLoading } = useQuery<Team | null>({
    queryKey: ['team-management', teamId],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) throw new Error('Failed to fetch team');
      return res.json();
    },
    enabled: !!teamId,
  });

  const { data: teamGames = [] } = useQuery<Game[]>({
    queryKey: ['team-games', teamId],
    queryFn: async () => {
      const res = await fetch(`/api/games?sport=basketball`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!teamId,
  });

  const upcomingGames = teamGames.filter((g) => g.status === 'not_started' || g.status === 'scheduled');
  const historicalGames = teamGames.filter((g) => g.status === 'finished' || g.status === 'completed');

  if (isLoading || !team) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-xl text-white/60">Loading team...</div>
      </div>
    );
  }

  const getOpponentName = (game: Game): string => {
    return game.home_team_name === team.team_name ? game.away_team_name : game.home_team_name;
  };

  const getGameResult = (game: Game): string => {
    const isHome = game.home_team_name === team.team_name;
    const teamScore = isHome ? game.home_score : game.away_score;
    const opponentScore = isHome ? game.away_score : game.home_score;
    if (teamScore > opponentScore) return 'W';
    if (teamScore < opponentScore) return 'L';
    return 'T';
  };

  const tabs = [
    { id: 'roster' as const, label: 'Roster' },
    { id: 'staff' as const, label: 'Staff' },
    { id: 'games' as const, label: 'Game Log' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/teams/list"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md"
              style={{
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                background: '#0f0f0f',
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {team.logo_url ? (
              <img
                src={team.logo_url}
                alt={team.team_name}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.15)' }}
              />
            ) : (
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl"
                style={{ background: team.team_color || '#666', boxShadow: '4px 4px 8px rgba(0,0,0,0.15)' }}
              >
                {team.team_name.charAt(0)}
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90">{team.team_name}</h1>
              <p className="text-sm md:text-base text-white/60">{team.division}</p>
            </div>
          </div>

          <Link
            href={`/teams/${teamId}/edit`}
            className="flex items-center gap-2 min-h-[44px] px-4 rounded-md"
            style={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <span>Edit</span>
            <span className="px-2 md:px-3 py-1 rounded-lg font-semibold text-sm" style={{ background: 'rgba(255,255,255,0.2)' }}>
              Team
            </span>
          </Link>
        </div>

        {/* Tabs */}
        <div
          className="grid grid-cols-3 mb-4 md:mb-6 p-1 rounded-xl"
          style={{
            background: '#0f0f0f',
            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] text-sm md:text-base rounded-lg font-medium ${
                activeTab === tab.id ? 'bg-[#c9a962] text-[#0f0f0f]' : 'text-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Roster Tab */}
        {activeTab === 'roster' && (
          <div
            className="p-4 md:p-6 rounded-3xl"
            style={{
              background: '#0f0f0f',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
            }}
          >
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
              <h2 className="text-xl md:text-2xl font-bold text-white/70">Roster</h2>
              <span className="ml-auto text-xs md:text-sm text-white/40">{team.roster?.length || 0} players</span>
            </div>

            <div className="space-y-3">
              {team.roster && team.roster.length > 0 ? (
                team.roster.map((player, index) => (
                  <div
                    key={index}
                    className="p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4 min-h-[44px]"
                    style={{
                      background: '#0f0f0f',
                      boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                    }}
                  >
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-white text-base md:text-lg"
                      style={{ background: team.team_color || '#666' }}
                    >
                      {player.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white/90 text-sm md:text-base truncate">
                        {player.first_name} {player.last_name}
                      </div>
                      <div className="text-xs md:text-sm text-white/40">
                        {player.position}
                        {player.height && ` - ${player.height}`}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 md:py-8 text-white/40 text-sm md:text-base">No players added yet</div>
              )}
            </div>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div
            className="p-4 md:p-6 rounded-3xl"
            style={{
              background: '#0f0f0f',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
            }}
          >
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
              <h2 className="text-xl md:text-2xl font-bold text-white/70">Staff</h2>
              <span className="ml-auto text-xs md:text-sm text-white/40">{team.staff?.length || 0} members</span>
            </div>
            <div className="space-y-3">
              {team.staff && team.staff.length > 0 ? (
                team.staff.map((member, index) => (
                  <div
                    key={index}
                    className="p-3 md:p-4 rounded-2xl min-h-[44px]"
                    style={{
                      background: '#0f0f0f',
                      boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                    }}
                  >
                    <div className="font-semibold text-white/90 text-sm md:text-base">{member.name}</div>
                    <div className="text-xs md:text-sm text-white/40">{member.title}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 md:py-8 text-white/40 text-sm md:text-base">No staff members added yet</div>
              )}
            </div>
          </div>
        )}

        {/* Game Log Tab */}
        {activeTab === 'games' && (
          <div
            ref={scrollRef}
            className="p-4 md:p-6 rounded-3xl max-h-[500px] md:max-h-[600px] overflow-y-auto"
            style={{
              background: '#0f0f0f',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
            }}
          >
            <div className="flex items-center gap-2 mb-4 md:mb-6 sticky top-0 bg-[#0f0f0f] py-2 z-10">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
              <h2 className="text-xl md:text-2xl font-bold text-white/70">Game Log</h2>
            </div>

            {historicalGames.length > 0 && (
              <div className="mb-4 md:mb-6">
                <h3 className="text-xs md:text-sm font-semibold text-white/40 uppercase mb-3">Past Games</h3>
                <div className="space-y-3">
                  {historicalGames.map((game) => {
                    const result = getGameResult(game);
                    const isHome = game.home_team_name === team.team_name;
                    const teamScore = isHome ? game.home_score : game.away_score;
                    const opponentScore = isHome ? game.away_score : game.home_score;

                    return (
                      <div
                        key={game.id}
                        className="p-3 md:p-4 rounded-2xl min-h-[44px]"
                        style={{
                          background: '#0f0f0f',
                          boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs md:text-sm flex-shrink-0 ${
                                result === 'W' ? 'bg-green-500' : result === 'L' ? 'bg-red-500' : 'bg-gray-500'
                              }`}
                            >
                              {result}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-white/90 text-sm md:text-base truncate">
                                vs {getOpponentName(game)}
                              </div>
                              <div className="text-xs md:text-sm text-white/40">
                                {game.game_date} {game.game_time && `- ${game.game_time}`}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xl md:text-2xl font-bold text-white/90">
                              {teamScore} - {opponentScore}
                            </div>
                            {game.status === 'finished' && <div className="text-[10px] md:text-xs text-white/40">Final</div>}
                          </div>
                        </div>
                        {game.location && (
                          <div className="flex items-center gap-1 text-[10px] md:text-xs text-white/40 mt-2">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{game.location}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {upcomingGames.length > 0 && (
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-white/40 uppercase mb-3">Upcoming Games</h3>
                <div className="space-y-3">
                  {upcomingGames.map((game) => (
                    <div
                      key={game.id}
                      className="p-3 md:p-4 rounded-2xl min-h-[44px]"
                      style={{
                        background: '#0f0f0f',
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white/90 text-sm md:text-base truncate">
                            vs {getOpponentName(game)}
                          </div>
                          <div className="text-xs md:text-sm text-white/40 flex items-center gap-1.5 md:gap-2 mt-1">
                            <ClockIcon className="w-3 h-3 flex-shrink-0" />
                            {game.game_date} {game.game_time && `- ${game.game_time}`}
                          </div>
                          {game.location && (
                            <div className="flex items-center gap-1 text-[10px] md:text-xs text-white/40 mt-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{game.location}</span>
                            </div>
                          )}
                        </div>
                        <div
                          className="px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-semibold flex-shrink-0 text-white"
                          style={{ background: team.team_color || '#666' }}
                        >
                          {game.status === 'not_started' ? 'Scheduled' : game.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {upcomingGames.length === 0 && historicalGames.length === 0 && (
              <div className="text-center py-8 md:py-12 text-white/40 text-sm md:text-base">No games scheduled yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
