import React, { useMemo } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Calendar, History, Users, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';

export default function TeamPerformance() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get('teamId');

  const { data: team } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const teams = await base44.entities.Team.filter({ id: teamId });
      return teams[0];
    },
    enabled: !!teamId,
    refetchOnWindowFocus: false,
  });

  const { data: games = [] } = useQuery({
    queryKey: ['teamGames', teamId],
    queryFn: () => base44.entities.Game.list('-game_date', 500),
    refetchOnWindowFocus: false,
  });

  const teamGames = useMemo(() => {
    return games.filter(g => g.home_team_id === teamId || g.away_team_id === teamId);
  }, [games, teamId]);

  const finishedGames = teamGames
    .filter(g => g.status === 'finished')
    .sort((a, b) => new Date(a.game_date) - new Date(b.game_date));

  const upcomingGames = teamGames
    .filter(g => g.status === 'not_started')
    .sort((a, b) => new Date(a.game_date) - new Date(b.game_date))
    .slice(0, 5);

  const recentGames = [...finishedGames]
    .sort((a, b) => new Date(b.game_date) - new Date(a.game_date))
    .slice(0, 10);

  // Calculate stats and trends
  const stats = useMemo(() => {
    let wins = 0, losses = 0, pointsFor = 0, pointsAgainst = 0;
    const scoreTrend = [];

    finishedGames.forEach((game, index) => {
      const isHome = game.home_team_id === teamId;
      const teamScore = isHome ? game.home_score : game.away_score;
      const oppScore = isHome ? game.away_score : game.home_score;
      const won = teamScore > oppScore;

      pointsFor += teamScore || 0;
      pointsAgainst += oppScore || 0;
      if (won) wins++; else losses++;

      scoreTrend.push({
        game: index + 1,
        date: game.game_date,
        scored: teamScore,
        allowed: oppScore,
        result: won ? 'W' : 'L',
        opponent: isHome ? game.away_team_name : game.home_team_name
      });
    });

    const gamesPlayed = wins + losses;
    return {
      wins,
      losses,
      winPct: gamesPlayed > 0 ? (wins / gamesPlayed * 100).toFixed(1) : '0.0',
      ppg: gamesPlayed > 0 ? (pointsFor / gamesPlayed).toFixed(1) : '0.0',
      oppg: gamesPlayed > 0 ? (pointsAgainst / gamesPlayed).toFixed(1) : '0.0',
      diff: gamesPlayed > 0 ? ((pointsFor - pointsAgainst) / gamesPlayed).toFixed(1) : '0.0',
      scoreTrend: scoreTrend.slice(-15)
    };
  }, [finishedGames, teamId]);

  if (!team) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-white/60">Loading team data...</div>
      </div>
    );
  }

  const GameResultCard = ({ game }) => {
    const isHome = game.home_team_id === teamId;
    const teamScore = isHome ? game.home_score : game.away_score;
    const oppScore = isHome ? game.away_score : game.home_score;
    const won = teamScore > oppScore;
    const opponent = isHome ? game.away_team_name : game.home_team_name;
    const oppColor = isHome ? game.away_team_color : game.home_team_color;

    return (
      <div 
        className="p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:scale-[1.01] transition-transform"
        style={{
          background: '#0f0f0f',
          boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
        }}
        onClick={() => navigate(createPageUrl("DetailedGameView") + `?gameId=${game.id}`)}
      >
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm`}
          style={{ background: won ? '#22c55e' : '#ef4444' }}
        >
          {won ? 'W' : 'L'}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white/90">
            {isHome ? 'vs' : '@'} {opponent}
          </div>
          <div className="text-sm text-white/40">
            {game.game_date ? format(new Date(game.game_date), 'MMM d, yyyy') : 'No date'}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl text-white/90">{teamScore} - {oppScore}</div>
          <div className="text-xs text-white/40">{game.location || 'TBD'}</div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/30" />
      </div>
    );
  };

  const UpcomingGameCard = ({ game }) => {
    const isHome = game.home_team_id === teamId;
    const opponent = isHome ? game.away_team_name : game.home_team_name;
    const oppColor = isHome ? game.away_team_color : game.home_team_color;

    return (
      <div 
        className="p-4 rounded-xl flex items-center gap-4"
        style={{
          background: '#0f0f0f',
          boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
        }}
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ background: oppColor || '#666' }}
        >
          {opponent?.charAt(0) || '?'}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white/90">
            {isHome ? 'vs' : '@'} {opponent}
          </div>
          <div className="text-sm text-white/40">
            {game.game_date ? format(new Date(game.game_date), 'EEE, MMM d') : 'TBD'} 
            {game.game_time && ` • ${game.game_time}`}
          </div>
        </div>
        <div className="text-sm text-white/40">{game.location || 'TBD'}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(createPageUrl("TeamOverview"))}
              style={{
                background: '#0f0f0f',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ background: team.team_color || '#666' }}
            >
              {team.team_name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white/90">{team.team_name}</h1>
              <p className="text-white/60">{team.league} • {team.division}</p>
            </div>
          </div>

          {/* Stats Summary */}
          <div 
            className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 p-6 rounded-2xl"
            style={{
              background: '#0f0f0f',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
            }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white/90">{stats.wins}-{stats.losses}</div>
              <div className="text-sm text-white/40">Record</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white/90">{stats.winPct}%</div>
              <div className="text-sm text-white/40">Win %</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white/90">{stats.ppg}</div>
              <div className="text-sm text-white/40">PPG</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white/90">{stats.oppg}</div>
              <div className="text-sm text-white/40">Opp PPG</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${parseFloat(stats.diff) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {parseFloat(stats.diff) >= 0 ? '+' : ''}{stats.diff}
              </div>
              <div className="text-sm text-white/40">Diff</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white/90">{team.roster?.length || 0}</div>
              <div className="text-sm text-white/40">Players</div>
            </div>
          </div>

          <Tabs defaultValue="trends" className="w-full">
            <TabsList 
              className="grid w-full grid-cols-3 mb-6"
              style={{
                background: '#0f0f0f',
                boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
                padding: '6px',
                borderRadius: '16px'
              }}
            >
              <TabsTrigger value="trends" className="flex items-center gap-2 py-3">
                <TrendingUp className="w-4 h-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2 py-3">
                <Calendar className="w-4 h-4" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2 py-3">
                <History className="w-4 h-4" />
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends">
              <div className="space-y-6">
                {/* Scoring Trend Chart */}
                <div 
                  className="p-6 rounded-2xl"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
                  }}
                >
                  <h3 className="text-lg font-bold text-white/90 mb-4">Scoring Trend</h3>
                  {stats.scoreTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.scoreTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis dataKey="game" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#0f0f0f', 
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '4px 4px 8px rgba(0,0,0,0.1)'
                          }}
                          formatter={(value, name) => [value, name === 'scored' ? 'Points Scored' : 'Points Allowed']}
                          labelFormatter={(label) => `Game ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="scored" 
                          stroke={team.team_color || '#8884d8'} 
                          strokeWidth={3}
                          dot={{ fill: team.team_color || '#8884d8' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="allowed" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: '#ef4444' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-white/40">No game data available</div>
                  )}
                </div>

                {/* Win/Loss by Game */}
                <div 
                  className="p-6 rounded-2xl"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
                  }}
                >
                  <h3 className="text-lg font-bold text-white/90 mb-4">Point Differential by Game</h3>
                  {stats.scoreTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={stats.scoreTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis dataKey="game" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#0f0f0f', 
                            border: 'none',
                            borderRadius: '12px'
                          }}
                          formatter={(value, name, props) => {
                            const diff = props.payload.scored - props.payload.allowed;
                            return [`${diff > 0 ? '+' : ''}${diff}`, 'Point Diff'];
                          }}
                        />
                        <Bar 
                          dataKey={(d) => d.scored - d.allowed}
                          fill={(d) => d.scored > d.allowed ? '#22c55e' : '#ef4444'}
                        >
                          {stats.scoreTrend.map((entry, index) => (
                            <rect 
                              key={index} 
                              fill={entry.scored > entry.allowed ? '#22c55e' : '#ef4444'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-white/40">No game data available</div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <div className="space-y-3">
                {upcomingGames.length === 0 ? (
                  <div 
                    className="p-12 rounded-2xl text-center"
                    style={{
                      background: '#0f0f0f',
                      boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                    }}
                  >
                    <Calendar className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/40">No upcoming games scheduled</p>
                  </div>
                ) : (
                  upcomingGames.map(game => <UpcomingGameCard key={game.id} game={game} />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="results">
              <div className="space-y-3">
                {recentGames.length === 0 ? (
                  <div 
                    className="p-12 rounded-2xl text-center"
                    style={{
                      background: '#0f0f0f',
                      boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                    }}
                  >
                    <History className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/40">No completed games yet</p>
                  </div>
                ) : (
                  recentGames.map(game => <GameResultCard key={game.id} game={game} />)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}