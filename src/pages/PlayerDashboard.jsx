import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Trophy, Target, Calendar, DollarSign, 
  GraduationCap, Shirt, FileText, BarChart3, Star
} from "lucide-react";

export default function PlayerDashboard() {
  const [user, setUser] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    base44.auth.me().then(async (userData) => {
      setUser(userData);
      if (userData.player_id) {
        const playerData = await base44.entities.Player.filter({ id: userData.player_id });
        setPlayer(playerData[0]);
      }
    });
  }, []);

  const { data: stats = [] } = useQuery({
    queryKey: ['player-stats-dash'],
    queryFn: () => base44.entities.LiveStat.filter({ player_id: player?.id }, '-created_date', 20),
    enabled: !!player?.id,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['player-teams-dash'],
    queryFn: async () => {
      if (!player?.id) return [];
      const members = await base44.entities.TeamMember.filter({ player_id: player.id });
      const teamPromises = members.map(m => base44.entities.Team.filter({ id: m.team_id }));
      const teamResults = await Promise.all(teamPromises);
      return teamResults.flat();
    },
    enabled: !!player?.id,
  });

  const sportColors = {
    basketball: 'from-orange-500 to-red-500',
    hockey: 'from-blue-600 to-cyan-500',
    soccer: 'from-green-500 to-emerald-500',
    baseball: 'from-red-600 to-pink-500',
    football: 'from-amber-600 to-orange-500',
    volleyball: 'from-yellow-500 to-orange-400',
    lacrosse: 'from-purple-500 to-pink-500',
  };

  const profileColor = player?.primary_sport && sportColors[player.primary_sport] || 'from-[#c9a962] to-yellow-500';

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
            Welcome back, {player?.first_name || user?.full_name?.split(' ')[0]}
          </h1>
          <p className="text-sm md:text-base text-white/40">Your athlete dashboard & brand hub</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/[0.06]">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-[#c9a962]" />
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{teams.length}</p>
              <p className="text-xs md:text-sm text-white/40">Active Teams</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/[0.06]">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{stats.length}</p>
              <p className="text-xs md:text-sm text-white/40">Stats Logged</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/[0.06]">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                <span className="text-xs text-white/40">New</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">$0</p>
              <p className="text-xs md:text-sm text-white/40">NIL Earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/[0.06]">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">85%</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">17/20</p>
              <p className="text-xs md:text-sm text-white/40">Goals Complete</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* NIL Merch Store */}
            <Card className="bg-gradient-to-br from-[#c9a962]/10 to-yellow-500/10 border-[#c9a962]/30 overflow-hidden">
              <div className={`h-24 md:h-32 bg-gradient-to-br ${profileColor} relative`}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shirt className="w-12 h-12 md:w-16 md:h-16 text-white opacity-50" />
                </div>
              </div>
              <CardContent className="p-4 md:p-6 -mt-6 md:-mt-8 relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#c9a962] rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg">
                  <Shirt className="w-6 h-6 md:w-8 md:h-8 text-[#0f0f0f]" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">Your NIL Merch Store</h3>
                <p className="text-sm md:text-base text-white/50 mb-4">
                  Launch your personal brand. Sell custom gear with your name, number & logo.
                  <span className="text-[#c9a962] font-semibold"> You keep 90%.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 flex-1 min-h-[44px]">
                    Launch Store
                  </Button>
                  <Button variant="outline" className="border-white/[0.06] min-h-[44px]">
                    View Samples
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* College Recruiting Resume */}
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">College Recruiting Resume</CardTitle>
                    <p className="text-xs md:text-sm text-white/40">NCAA-compliant PDF + highlight reel</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                  {player?.grad_year ? `Class of ${player.grad_year}` : 'Set Grad Year'}
                </span>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  <div className="text-center p-2 md:p-3 bg-white/[0.05] rounded-lg">
                    <p className="text-lg md:text-2xl font-bold text-white">{player?.height || '-'}</p>
                    <p className="text-xs text-white/40">Height</p>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-white/[0.05] rounded-lg">
                    <p className="text-lg md:text-2xl font-bold text-white">{player?.weight || '-'}</p>
                    <p className="text-xs text-white/40">Weight</p>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-white/[0.05] rounded-lg">
                    <p className="text-lg md:text-2xl font-bold text-white">{player?.position || '-'}</p>
                    <p className="text-xs text-white/40">Position</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 border-white/[0.06] min-h-[44px] text-sm md:text-base">
                    <FileText className="w-4 h-4 mr-2" />
                    Edit Resume
                  </Button>
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600 min-h-[44px] text-sm md:text-base">
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Performance */}
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <BarChart3 className="w-5 h-5 text-[#c9a962]" />
                  Recent Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                {stats.length === 0 ? (
                  <p className="text-sm md:text-base text-white/40 text-center py-6 md:py-8">No stats recorded yet</p>
                ) : (
                  <div className="space-y-2">
                    {stats.slice(0, 5).map((stat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.05] rounded-lg min-h-[44px]">
                        <div>
                          <p className="text-sm md:text-base font-medium text-white capitalize">
                            {stat.stat_type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-white/40">
                            {new Date(stat.created_date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-[#c9a962]">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-2">
                <Link to={createPageUrl("PlayerProfile")}>
                  <Button variant="outline" className="w-full justify-start border-white/[0.06] min-h-[44px] text-sm md:text-base">
                    <Trophy className="w-4 h-4 mr-3" />
                    My Brand Page
                  </Button>
                </Link>
                <Link to={createPageUrl("Feed")}>
                  <Button variant="outline" className="w-full justify-start border-white/[0.06] min-h-[44px] text-sm md:text-base">
                    <Star className="w-4 h-4 mr-3" />
                    View Feed
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start border-white/[0.06] min-h-[44px] text-sm md:text-base">
                  <DollarSign className="w-4 h-4 mr-3" />
                  Track Earnings
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Games */}
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Calendar className="w-5 h-5 text-[#c9a962]" />
                  Next Game
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="p-3 md:p-4 bg-white/[0.05] rounded-lg">
                  <p className="text-xs md:text-sm text-white/40 mb-1">Saturday, Nov 16</p>
                  <p className="text-sm md:text-base font-semibold text-white mb-2">vs Toronto Elite</p>
                  <p className="text-xs md:text-sm text-white/40">7:00 PM - Home Court</p>
                </div>
              </CardContent>
            </Card>

            {/* Training Progress */}
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Target className="w-5 h-5 text-green-400" />
                  Training Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-3">
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span className="text-white/40">Ball Handling</span>
                    <span className="text-white font-semibold">85%</span>
                  </div>
                  <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#c9a962] to-green-400 w-[85%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span className="text-white/40">Shooting Form</span>
                    <span className="text-white font-semibold">60%</span>
                  </div>
                  <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[60%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span className="text-white/40">Conditioning</span>
                    <span className="text-white font-semibold">92%</span>
                  </div>
                  <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 w-[92%]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}