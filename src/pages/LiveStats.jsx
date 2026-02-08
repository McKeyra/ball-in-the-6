import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, PlayCircle, Activity, Trophy, ChevronRight, Users,
  Clock, Eye, ClipboardList, Tv, TrendingUp, Target, Zap,
  Award, Star, Flame, Timer, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export default function LiveStats() {
  const [selectedTab, setSelectedTab] = useState('live');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch games with auto-refresh
  const { data: games = [], isLoading: gamesLoading, refetch: refetchGames } = useQuery({
    queryKey: ['livestats-games'],
    queryFn: () => base44.entities.Game.list('-game_date', 30),
    refetchInterval: autoRefresh ? 10000 : false, // Refresh every 10s if auto-refresh on
  });

  // Fetch teams
  const { data: teams = [] } = useQuery({
    queryKey: ['livestats-teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  // Fetch game events for live games
  const { data: gameEvents = [] } = useQuery({
    queryKey: ['livestats-events'],
    queryFn: () => base44.entities.GameEvent.list('-created_date', 100),
    refetchInterval: autoRefresh ? 5000 : false,
  });

  // Fetch players
  const { data: players = [] } = useQuery({
    queryKey: ['livestats-players'],
    queryFn: () => base44.entities.Player.list(),
  });

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || team?.team_name || 'TBD';
  };

  const getTeamColor = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team?.primary_color || '#c9a962';
  };

  // Categorize games
  const liveGames = games.filter(g => g.status === 'live' || g.status === 'in_progress');
  const recentGames = games.filter(g => g.status === 'completed').slice(0, 10);
  const upcomingGames = games.filter(g => g.status === 'scheduled' || !g.status).slice(0, 10);

  // Calculate stat leaders from recent game events
  const getStatLeaders = () => {
    const playerStats = {};

    gameEvents.forEach(event => {
      if (!event.player_id) return;
      if (!playerStats[event.player_id]) {
        playerStats[event.player_id] = {
          playerId: event.player_id,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
        };
      }

      const stat = playerStats[event.player_id];
      if (event.event_type === 'points' || event.event_type === 'score') {
        stat.points += event.points || 2;
      } else if (event.event_type === 'rebound') {
        stat.rebounds += 1;
      } else if (event.event_type === 'assist') {
        stat.assists += 1;
      } else if (event.event_type === 'steal') {
        stat.steals += 1;
      } else if (event.event_type === 'block') {
        stat.blocks += 1;
      }
    });

    const stats = Object.values(playerStats);
    return {
      points: [...stats].sort((a, b) => b.points - a.points).slice(0, 5),
      rebounds: [...stats].sort((a, b) => b.rebounds - a.rebounds).slice(0, 5),
      assists: [...stats].sort((a, b) => b.assists - a.assists).slice(0, 5),
    };
  };

  const statLeaders = getStatLeaders();

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player?.name || player?.first_name || `Player ${playerId?.slice(0, 4)}`;
  };

  // Quick tools
  const quickLinks = [
    { label: 'Court View', page: 'CourtView', icon: PlayCircle, desc: 'Interactive court tracking', color: '#4A90E2' },
    { label: 'Live Game', page: 'LiveGame', icon: Tv, desc: 'Score active games', color: '#8BC9A8' },
    { label: 'Box Score', page: 'BoxScore', icon: ClipboardList, desc: 'Game statistics', color: '#c9a962' },
    { label: 'Standings', page: 'Standings', icon: Trophy, desc: 'League rankings', color: '#FFB088' },
  ];

  // Tabs
  const tabs = [
    { id: 'live', label: 'Live', icon: Zap, count: liveGames.length },
    { id: 'recent', label: 'Recent', icon: Clock, count: recentGames.length },
    { id: 'upcoming', label: 'Upcoming', icon: Timer, count: upcomingGames.length },
    { id: 'leaders', label: 'Leaders', icon: Award, count: null },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Live Stats</h1>
              <p className="text-white/40 text-sm">Real-time game statistics</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`min-h-[44px] gap-2 ${autoRefresh ? 'border-emerald-500/50 text-emerald-400' : 'border-white/10 text-white/50'}`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
        </div>

        {/* Live Games Alert */}
        {liveGames.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-lg font-semibold text-white">
                  {liveGames.length} Game{liveGames.length > 1 ? 's' : ''} Live Now
                </span>
              </div>
              <div className="grid gap-3">
                {liveGames.map((game) => (
                  <Link
                    key={game.id}
                    to={`${createPageUrl('LiveGame')}?gameId=${game.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg">
                          {game.home_team_name || getTeamName(game.home_team_id)} vs {game.away_team_name || getTeamName(game.away_team_id)}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-white/50">
                          <span>Q{game.quarter || 1}</span>
                          <span>•</span>
                          <span>{game.time_remaining || '12:00'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-3xl font-bold text-white">
                          {game.home_score || 0} - {game.away_score || 0}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => setSelectedTab(tab.id)}
                className={`min-h-[44px] px-4 gap-2 flex-shrink-0 ${
                  isActive
                    ? 'bg-[#c9a962] text-[#0f0f0f]'
                    : 'border-white/[0.06] text-white/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#0f0f0f]/20' : 'bg-white/10'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {liveGames.length === 0 ? (
                <Card className="bg-white/[0.05] border-white/[0.06] p-12 text-center">
                  <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-2">No games currently in progress</p>
                  <p className="text-white/40 text-sm">Live games will appear here when they start</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {liveGames.map(game => (
                    <LiveGameCard key={game.id} game={game} teams={teams} gameEvents={gameEvents} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {selectedTab === 'recent' && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {recentGames.length === 0 ? (
                <Card className="bg-white/[0.05] border-white/[0.06] p-12 text-center">
                  <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">No completed games yet</p>
                </Card>
              ) : (
                recentGames.map(game => (
                  <Link
                    key={game.id}
                    to={`${createPageUrl('BoxScore')}?gameId=${game.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#c9a962]/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-[#c9a962]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {game.home_team_name || getTeamName(game.home_team_id)} vs {game.away_team_name || getTeamName(game.away_team_id)}
                        </p>
                        <p className="text-sm text-white/40">
                          Final: {game.home_score || 0} - {game.away_score || 0}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20" />
                  </Link>
                ))
              )}
            </motion.div>
          )}

          {selectedTab === 'upcoming' && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {upcomingGames.length === 0 ? (
                <Card className="bg-white/[0.05] border-white/[0.06] p-12 text-center">
                  <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">No upcoming games scheduled</p>
                </Card>
              ) : (
                upcomingGames.map(game => (
                  <Link
                    key={game.id}
                    to={`${createPageUrl('GameSetup')}?gameId=${game.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {game.home_team_name || getTeamName(game.home_team_id)} vs {game.away_team_name || getTeamName(game.away_team_id)}
                        </p>
                        <p className="text-sm text-white/40">
                          {game.game_date ? new Date(game.game_date).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20" />
                  </Link>
                ))
              )}
            </motion.div>
          )}

          {selectedTab === 'leaders' && (
            <motion.div
              key="leaders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-3 gap-4"
            >
              {/* Points Leaders */}
              <Card className="bg-white/[0.05] border-white/[0.06] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-[#c9a962]" />
                  <h3 className="font-semibold text-white">Points</h3>
                </div>
                {statLeaders.points.length === 0 ? (
                  <p className="text-white/40 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {statLeaders.points.map((stat, i) => (
                      <div key={stat.playerId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-[#c9a962] text-[#0f0f0f]' : 'bg-white/10 text-white/60'
                          }`}>
                            {i + 1}
                          </span>
                          <span className="text-white/80 text-sm">{getPlayerName(stat.playerId)}</span>
                        </div>
                        <span className="font-bold text-white">{stat.points}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Rebounds Leaders */}
              <Card className="bg-white/[0.05] border-white/[0.06] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Rebounds</h3>
                </div>
                {statLeaders.rebounds.length === 0 ? (
                  <p className="text-white/40 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {statLeaders.rebounds.map((stat, i) => (
                      <div key={stat.playerId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/60'
                          }`}>
                            {i + 1}
                          </span>
                          <span className="text-white/80 text-sm">{getPlayerName(stat.playerId)}</span>
                        </div>
                        <span className="font-bold text-white">{stat.rebounds}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Assists Leaders */}
              <Card className="bg-white/[0.05] border-white/[0.06] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-white">Assists</h3>
                </div>
                {statLeaders.assists.length === 0 ? (
                  <p className="text-white/40 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {statLeaders.assists.map((stat, i) => (
                      <div key={stat.playerId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/60'
                          }`}>
                            {i + 1}
                          </span>
                          <span className="text-white/80 text-sm">{getPlayerName(stat.playerId)}</span>
                        </div>
                        <span className="font-bold text-white">{stat.assists}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Tools */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#c9a962]" />
            Quick Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors group min-h-[100px]"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${link.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: link.color }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/90">{link.label}</p>
                    <p className="text-xs text-white/40">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Live Game Card Component
function LiveGameCard({ game, teams, gameEvents }) {
  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || team?.team_name || 'TBD';
  };

  // Get recent events for this game
  const recentEvents = gameEvents
    .filter(e => e.game_id === game.id)
    .slice(0, 5);

  return (
    <Card className="bg-white/[0.05] border-white/[0.06] overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
      <div className="p-5">
        {/* Scoreboard */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 text-center">
            <p className="text-sm text-white/60 mb-2">{game.home_team_name || getTeamName(game.home_team_id)}</p>
            <p className="text-4xl md:text-5xl font-bold text-white">{game.home_score || 0}</p>
          </div>
          <div className="px-6 text-center">
            <div className="bg-emerald-500/20 px-3 py-1 rounded-full mb-2">
              <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
            </div>
            <p className="text-white/60 text-sm">Q{game.quarter || 1}</p>
            <p className="text-white font-mono">{game.time_remaining || '12:00'}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-sm text-white/60 mb-2">{game.away_team_name || getTeamName(game.away_team_id)}</p>
            <p className="text-4xl md:text-5xl font-bold text-white">{game.away_score || 0}</p>
          </div>
        </div>

        {/* Recent Events */}
        {recentEvents.length > 0 && (
          <div className="border-t border-white/[0.06] pt-4">
            <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Recent Plays</p>
            <div className="space-y-2">
              {recentEvents.map((event, i) => (
                <div key={event.id || i} className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-[#c9a962]" />
                  </div>
                  <span className="text-white/70">
                    {event.description || `${event.event_type} - ${event.points || 0} pts`}
                  </span>
                  <span className="text-white/30 text-xs ml-auto">
                    Q{event.quarter || '?'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`${createPageUrl('LiveGame')}?gameId=${game.id}`}
          className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/30 transition-colors min-h-[48px]"
        >
          <PlayCircle className="w-5 h-5" />
          Watch & Score
        </Link>
      </div>
    </Card>
  );
}
