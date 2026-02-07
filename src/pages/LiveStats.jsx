import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3, PlayCircle, Activity, Trophy, Users, ChevronRight,
  Clock, TrendingUp, Eye, ClipboardList, Tv
} from 'lucide-react';

export default function LiveStats() {
  // Fetch active/recent games
  const { data: games = [], isLoading } = useQuery({
    queryKey: ['live-games'],
    queryFn: () => base44.entities.Game.list('-game_date', 20),
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['live-teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || team?.team_name || 'TBD';
  };

  const liveGames = games.filter(g => g.status === 'live' || g.status === 'in_progress');
  const recentGames = games.filter(g => g.status === 'completed').slice(0, 5);
  const upcomingGames = games.filter(g => g.status === 'scheduled' || !g.status).slice(0, 5);

  const quickLinks = [
    { label: 'Court View', page: 'CourtView', icon: PlayCircle, desc: 'Interactive court with live tracking' },
    { label: 'Live Game', page: 'LiveGame', icon: Tv, desc: 'Manage and score active games' },
    { label: 'Box Score', page: 'BoxScore', icon: ClipboardList, desc: 'Detailed game statistics' },
    { label: 'Game View', page: 'GameView', icon: Eye, desc: 'View game details and lineups' },
    { label: 'Detailed Game', page: 'DetailedGameView', icon: BarChart3, desc: 'Quarter-by-quarter breakdown' },
    { label: 'Standings', page: 'Standings', icon: Trophy, desc: 'League standings and rankings' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Live Stats</h1>
              <p className="text-white/40 text-sm">Real-time game statistics across all active games</p>
            </div>
          </div>
        </div>

        {/* Live Games */}
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-lg font-semibold text-white">Live Now</h2>
            <span className="text-sm text-white/40 ml-auto">{liveGames.length} active</span>
          </div>

          {liveGames.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">No games currently in progress</p>
              <p className="text-sm text-white/30 mt-1">Live games will appear here when they start</p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveGames.map((game) => (
                <Link
                  key={game.id}
                  to={`${createPageUrl('LiveGame')}?gameId=${game.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <PlayCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {game.home_team_name || getTeamName(game.homeTeamId)} vs {game.away_team_name || getTeamName(game.awayTeamId)}
                      </p>
                      <p className="text-sm text-white/40">
                        {game.home_score || 0} - {game.away_score || 0}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent & Upcoming Games Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Recent Games */}
          <div className="rounded-2xl bg-white/[0.05] border border-white/[0.06] p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#c9a962]" />
              Recent Results
            </h2>
            {recentGames.length === 0 ? (
              <p className="text-white/40 text-center py-6">No completed games yet</p>
            ) : (
              <div className="space-y-2">
                {recentGames.map((game) => (
                  <Link
                    key={game.id}
                    to={`${createPageUrl('BoxScore')}?gameId=${game.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                  >
                    <div>
                      <p className="text-sm text-white/80">
                        {game.home_team_name || getTeamName(game.homeTeamId)} vs {game.away_team_name || getTeamName(game.awayTeamId)}
                      </p>
                      <p className="text-xs text-white/40">
                        Final: {game.home_score || 0} - {game.away_score || 0}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Games */}
          <div className="rounded-2xl bg-white/[0.05] border border-white/[0.06] p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#4A90E2]" />
              Upcoming Games
            </h2>
            {upcomingGames.length === 0 ? (
              <p className="text-white/40 text-center py-6">No upcoming games scheduled</p>
            ) : (
              <div className="space-y-2">
                {upcomingGames.map((game) => (
                  <Link
                    key={game.id}
                    to={`${createPageUrl('GameSetup')}?gameId=${game.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                  >
                    <div>
                      <p className="text-sm text-white/80">
                        {game.home_team_name || getTeamName(game.homeTeamId)} vs {game.away_team_name || getTeamName(game.awayTeamId)}
                      </p>
                      <p className="text-xs text-white/40">
                        {game.game_date ? new Date(game.game_date).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl bg-white/[0.05] border border-white/[0.06] p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#c9a962]" />
            Game Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#c9a962]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#c9a962]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-white/90">{link.label}</p>
                    <p className="text-[12px] text-white/40 truncate">{link.desc}</p>
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
