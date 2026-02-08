import { useState, useRef } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, Shield, Calendar, MapPin, Clock as ClockIcon } from "lucide-react";

export default function TeamManagement() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get('teamId');
  const scrollRef = useRef(null);
  
  const [upcomingSkip, setUpcomingSkip] = useState(0);
  const [historicalSkip, setHistoricalSkip] = useState(0);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true);
  const [hasMoreHistorical, setHasMoreHistorical] = useState(true);

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const teams = await base44.entities.Team.filter({ id: teamId });
      return teams[0];
    },
    enabled: !!teamId,
  });

  const { data: upcomingGames = [], refetch: refetchUpcoming } = useQuery({
    queryKey: ['upcomingGames', teamId, upcomingSkip],
    queryFn: async () => {
      if (!team) return [];
      
      const allGames = await base44.entities.Game.list('-game_date', 50);
      const today = new Date().toISOString().split('T')[0];
      
      const filtered = allGames.filter(game => {
        const matchesTeam = game.home_team_name === team.team_name || game.away_team_name === team.team_name;
        const isFuture = game.game_date && game.game_date >= today;
        return matchesTeam && isFuture;
      }).sort((a, b) => a.game_date?.localeCompare(b.game_date) || 0);
      
      const paginated = filtered.slice(upcomingSkip, upcomingSkip + 10);
      setHasMoreUpcoming(paginated.length === 10 && upcomingSkip + 10 < filtered.length);
      
      return paginated;
    },
    enabled: !!team,
  });

  const { data: historicalGames = [], refetch: refetchHistorical } = useQuery({
    queryKey: ['historicalGames', teamId, historicalSkip],
    queryFn: async () => {
      if (!team) return [];
      
      const allGames = await base44.entities.Game.list('-game_date', 50);
      const today = new Date().toISOString().split('T')[0];
      
      const filtered = allGames.filter(game => {
        const matchesTeam = game.home_team_name === team.team_name || game.away_team_name === team.team_name;
        const isPast = game.game_date && game.game_date < today;
        return matchesTeam && isPast;
      }).sort((a, b) => b.game_date?.localeCompare(a.game_date) || 0);
      
      const paginated = filtered.slice(historicalSkip, historicalSkip + 10);
      setHasMoreHistorical(paginated.length === 10 && historicalSkip + 10 < filtered.length);
      
      return paginated;
    },
    enabled: !!team,
  });

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    // Scroll to bottom - load more upcoming
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMoreUpcoming) {
      setUpcomingSkip(prev => prev + 10);
    }
    
    // Scroll to top - load more historical
    if (scrollTop <= 50 && hasMoreHistorical) {
      setHistoricalSkip(prev => prev + 10);
    }
  };

  if (isLoading || !team) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-xl text-white/60">Loading team...</div>
      </div>
    );
  }

  const getOpponentName = (game) => {
    return game.home_team_name === team.team_name ? game.away_team_name : game.home_team_name;
  };

  const getGameResult = (game) => {
    const isHome = game.home_team_name === team.team_name;
    const teamScore = isHome ? game.home_score : game.away_score;
    const opponentScore = isHome ? game.away_score : game.home_score;
    
    if (teamScore > opponentScore) return 'W';
    if (teamScore < opponentScore) return 'L';
    return 'T';
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(createPageUrl("TeamList"))}
              className="min-h-[44px] min-w-[44px]"
              style={{
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                background: '#0f0f0f'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            {team.logo_url ? (
              <img
                src={team.logo_url}
                alt={team.team_name}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                style={{
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.15)'
                }}
              />
            ) : (
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl"
                style={{
                  background: team.team_color || '#666',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.15)'
                }}
              >
                {team.team_name.charAt(0)}
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90">{team.team_name}</h1>
              <p className="text-sm md:text-base text-white/60">{team.division}</p>
            </div>
          </div>

          <Button
            onClick={() => navigate(createPageUrl("EditTeam") + `?teamId=${teamId}`)}
            className="flex items-center gap-2 min-h-[44px]"
            style={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
              border: 'none'
            }}
          >
            <span>Edit</span>
            <span
              className="px-2 md:px-3 py-1 rounded-lg font-semibold text-sm"
              style={{
                background: 'rgba(255,255,255,0.2)',
              }}
            >
              Team
            </span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="roster" className="w-full">
          <TabsList
            className="grid w-full grid-cols-3 mb-4 md:mb-6"
            style={{
              background: '#0f0f0f',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
              padding: '4px',
              borderRadius: '12px'
            }}
          >
            <TabsTrigger value="roster" className="min-h-[44px] text-sm md:text-base">Roster</TabsTrigger>
            <TabsTrigger value="staff" className="min-h-[44px] text-sm md:text-base">Staff</TabsTrigger>
            <TabsTrigger value="games" className="min-h-[44px] text-sm md:text-base">Game Log</TabsTrigger>
          </TabsList>

          {/* Roster Tab */}
          <TabsContent value="roster">
            <div
              className="p-4 md:p-6 rounded-3xl"
              style={{
                background: '#0f0f0f',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
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
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
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
                          {player.height && ` • ${player.height}`}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-white/40 text-sm md:text-base">
                    No players added yet
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff">
            <div
              className="p-4 md:p-6 rounded-3xl"
              style={{
                background: '#0f0f0f',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
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
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                      }}
                    >
                      <div className="font-semibold text-white/90 text-sm md:text-base">{member.name}</div>
                      <div className="text-xs md:text-sm text-white/40">{member.title}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-white/40 text-sm md:text-base">
                    No staff members added yet
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Game Log Tab */}
          <TabsContent value="games">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="p-4 md:p-6 rounded-3xl max-h-[500px] md:max-h-[600px] overflow-y-auto"
              style={{
                background: '#0f0f0f',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
              }}
            >
              <div className="flex items-center gap-2 mb-4 md:mb-6 sticky top-0 bg-[#0f0f0f] py-2 z-10">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
                <h2 className="text-xl md:text-2xl font-bold text-white/70">Game Log</h2>
              </div>

              {/* Historical Games */}
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
                            boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
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
                                  {game.game_date} {game.game_time && `• ${game.game_time}`}
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-xl md:text-2xl font-bold text-white/90">
                                {teamScore} - {opponentScore}
                              </div>
                              {game.status === 'finished' && (
                                <div className="text-[10px] md:text-xs text-white/40">Final</div>
                              )}
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

              {/* Upcoming Games */}
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
                          boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-white/90 text-sm md:text-base truncate">
                              vs {getOpponentName(game)}
                            </div>
                            <div className="text-xs md:text-sm text-white/40 flex items-center gap-1.5 md:gap-2 mt-1">
                              <ClockIcon className="w-3 h-3 flex-shrink-0" />
                              {game.game_date} {game.game_time && `• ${game.game_time}`}
                            </div>
                            {game.location && (
                              <div className="flex items-center gap-1 text-[10px] md:text-xs text-white/40 mt-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{game.location}</span>
                              </div>
                            )}
                          </div>
                          <div
                            className="px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-semibold flex-shrink-0"
                            style={{
                              background: team.team_color || '#666',
                              color: 'white'
                            }}
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
                <div className="text-center py-8 md:py-12 text-white/40 text-sm md:text-base">
                  No games scheduled yet
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}