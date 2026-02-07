import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Trophy, Calendar, DollarSign, TrendingUp, 
  BarChart3, Video, Plus, Clock, Target 
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin();
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const { data: teams = [] } = useQuery({
    queryKey: ['teams', user?.email],
    queryFn: () => base44.entities.Team.filter({ coach_email: user?.email }),
    enabled: !!user,
    initialData: []
  });

  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations', user?.email],
    queryFn: () => base44.entities.Organization.filter({ owner_email: user?.email }),
    enabled: !!user,
    initialData: []
  });

  const { data: upcomingGames = [] } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.filter({ status: 'scheduled' }),
    enabled: !!user,
    initialData: []
  });

  const { data: recentPosts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const posts = await base44.entities.Post.list('-created_date', 10);
      return posts;
    },
    enabled: !!user,
    initialData: []
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-white/50">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userType = user?.user_type || 'player';

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
      {/* Header */}
      <div className="bg-white/[0.07] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                Welcome back, {user?.full_name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-sm md:text-base text-white/50 mt-1">Here's what's happening with your sports world</p>
            </div>
            <Link to={createPageUrl("Feed")}>
              <Button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 min-h-[44px] min-w-[44px] px-4">
                <Plus className="w-4 h-4 mr-2" />
                Quick Actions
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Quick Stats - Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16" />
            <CardHeader className="relative z-10 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <Users className="w-6 h-6 md:w-8 md:h-8" />
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 p-4 md:p-6 pt-0">
              <div className="text-2xl md:text-3xl font-bold mb-1">{teams.length}</div>
              <p className="text-sm md:text-base text-blue-100">Your Teams</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16" />
            <CardHeader className="relative z-10 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <Trophy className="w-6 h-6 md:w-8 md:h-8" />
                <Target className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 p-4 md:p-6 pt-0">
              <div className="text-2xl md:text-3xl font-bold mb-1">{upcomingGames.length}</div>
              <p className="text-sm md:text-base text-purple-100">Upcoming Games</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16" />
            <CardHeader className="relative z-10 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <Video className="w-6 h-6 md:w-8 md:h-8" />
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 p-4 md:p-6 pt-0">
              <div className="text-2xl md:text-3xl font-bold mb-1">{recentPosts.length}</div>
              <p className="text-sm md:text-base text-green-100">Recent Posts</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-orange-500 to-pink-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16" />
            <CardHeader className="relative z-10 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <DollarSign className="w-6 h-6 md:w-8 md:h-8" />
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 p-4 md:p-6 pt-0">
              <div className="text-2xl md:text-3xl font-bold mb-1">$0</div>
              <p className="text-sm md:text-base text-orange-100">Revenue This Month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Larger */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Target className="w-5 h-5 text-orange-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  <Link to={createPageUrl("LiveGame")}>
                    <Button variant="outline" className="w-full min-h-[72px] md:h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-300 transition-all">
                      <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                      <span className="text-xs md:text-sm font-medium">Start Live Game</span>
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Feed")}>
                    <Button variant="outline" className="w-full min-h-[72px] md:h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all">
                      <Video className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      <span className="text-xs md:text-sm font-medium">Share Post</span>
                    </Button>
                  </Link>
                  <Link to={createPageUrl("TeamManagement")}>
                    <Button variant="outline" className="w-full min-h-[72px] md:h-20 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                      <span className="text-xs md:text-sm font-medium">Manage Team</span>
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full min-h-[72px] md:h-20 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-300 transition-all">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    <span className="text-xs md:text-sm font-medium">Schedule Game</span>
                  </Button>
                  <Button variant="outline" className="w-full min-h-[72px] md:h-20 flex flex-col items-center justify-center gap-2 hover:bg-pink-50 hover:border-pink-300 transition-all">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
                    <span className="text-xs md:text-sm font-medium">Send Invoice</span>
                  </Button>
                  <Link to={createPageUrl("PlayerProfile")}>
                    <Button variant="outline" className="w-full min-h-[72px] md:h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                      <Trophy className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                      <span className="text-xs md:text-sm font-medium">View Stats</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                {recentPosts.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {recentPosts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.05] transition-colors min-h-[44px]">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {post.author_email?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm md:text-base font-medium text-white">{post.author_email}</p>
                          <p className="text-sm md:text-base text-white/50 truncate">{post.content}</p>
                          <p className="text-xs text-white/30 mt-1">
                            {new Date(post.created_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-8 text-white/40">
                    <Video className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 text-white/20" />
                    <p className="text-sm md:text-base">No recent activity yet</p>
                    <Link to={createPageUrl("Feed")}>
                      <Button variant="link" className="text-orange-600 mt-2 min-h-[44px]">
                        Create your first post
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Upcoming Games */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Upcoming Games</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                {upcomingGames.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingGames.slice(0, 3).map((game) => (
                      <div key={game.id} className="p-3 bg-[#0f0f0f] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-white/30" />
                          <span className="text-sm md:text-base text-white/50">
                            {new Date(game.game_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm md:text-base font-medium text-white">{game.location}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-white/40 capitalize">{game.sport}</span>
                          <Link to={createPageUrl("LiveGame")}>
                            <Button size="sm" variant="ghost" className="text-orange-600 hover:text-orange-700 min-h-[44px] min-w-[44px]">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-white/40">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-white/20" />
                    <p className="text-sm md:text-base">No upcoming games</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Teams */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Your Teams</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                {teams.length > 0 ? (
                  <div className="space-y-3">
                    {teams.map((team) => (
                      <Link key={team.id} to={createPageUrl("TeamManagement")}>
                        <div className="p-3 bg-white/[0.05] rounded-lg hover:from-orange-50 hover:to-pink-50 transition-all cursor-pointer min-h-[44px]">
                          <p className="text-sm md:text-base font-medium text-white">{team.name}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-white/40 capitalize">{team.sport}</span>
                            <span className="text-xs font-medium text-white/50">
                              {team.wins || 0}W - {team.losses || 0}L
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-white/40">
                    <Users className="w-10 h-10 mx-auto mb-2 text-white/20" />
                    <p className="text-sm md:text-base">No teams yet</p>
                    <Button variant="link" className="text-orange-600 text-sm mt-1 min-h-[44px]">
                      Create a team
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}