import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, BarChart3, ClipboardList, MessageSquare, 
  TrendingUp, Clock, Award, Target
} from "lucide-react";
import LineupBuilder from "../components/coach/LineupBuilder";
import PlayingTimeAnalytics from "../components/coach/PlayingTimeAnalytics";

export default function CoachDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: teams = [] } = useQuery({
    queryKey: ['coach-teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const { data: upcomingGames = [] } = useQuery({
    queryKey: ['coach-games'],
    queryFn: async () => {
      const items = await base44.entities.ScheduleItem.list('-date');
      return items.filter(item => 
        new Date(item.date) >= new Date() && 
        item.type === 'game'
      ).slice(0, 3);
    },
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
            Coach Dashboard
          </h1>
          <p className="text-sm md:text-base text-white/40">Lineup builder, analytics & team management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardContent className="p-4 md:p-6">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-[#c9a962] mb-2 md:mb-3" />
              <p className="text-2xl md:text-3xl font-bold text-white">{teams.length}</p>
              <p className="text-xs md:text-sm text-white/40">Teams</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardContent className="p-4 md:p-6">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-400 mb-2 md:mb-3" />
              <p className="text-2xl md:text-3xl font-bold text-white">12-3</p>
              <p className="text-xs md:text-sm text-white/40">Season Record</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardContent className="p-4 md:p-6">
              <Award className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mb-2 md:mb-3" />
              <p className="text-2xl md:text-3xl font-bold text-white">85%</p>
              <p className="text-xs md:text-sm text-white/40">Win Rate</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardContent className="p-4 md:p-6">
              <Target className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mb-2 md:mb-3" />
              <p className="text-2xl md:text-3xl font-bold text-white">92.5</p>
              <p className="text-xs md:text-sm text-white/40">Avg Points</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <Tabs defaultValue="lineup" className="space-y-4 md:space-y-6">
              <TabsList className="bg-white/[0.05] border-white/[0.06] w-full justify-start overflow-x-auto">
                <TabsTrigger value="lineup" className="gap-2 min-h-[44px] text-xs md:text-sm">
                  <ClipboardList className="w-4 h-4" />
                  <span className="hidden sm:inline">Lineup Builder</span>
                  <span className="sm:hidden">Lineup</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2 min-h-[44px] text-xs md:text-sm">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="messages" className="gap-2 min-h-[44px] text-xs md:text-sm">
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lineup">
                <LineupBuilder teams={teams} />
              </TabsContent>

              <TabsContent value="analytics">
                <PlayingTimeAnalytics teams={teams} />
              </TabsContent>

              <TabsContent value="messages">
                <Card className="bg-white/[0.05] border-white/[0.06]">
                  <CardContent className="p-8 md:p-12 text-center">
                    <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-sm md:text-base text-white/40">Team messaging coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Upcoming Games */}
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Next Games</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-3">
                {upcomingGames.length === 0 ? (
                  <p className="text-white/40 text-sm md:text-base">No upcoming games</p>
                ) : (
                  upcomingGames.map((game) => (
                    <div key={game.id} className="p-3 bg-white/[0.05] rounded-lg">
                      <p className="text-sm md:text-base font-semibold text-white mb-1">{game.title}</p>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/40">
                        <Clock className="w-3 h-3" />
                        {new Date(game.date).toLocaleDateString()} - {game.time}
                      </div>
                      <Button size="sm" className="w-full mt-2 bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px]">
                        Set Lineup
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-2">
                <Button variant="outline" className="w-full justify-start border-white/[0.06] min-h-[44px] text-sm md:text-base">
                  <ClipboardList className="w-4 h-4 mr-3" />
                  Create Practice Plan
                </Button>
                <Button variant="outline" className="w-full justify-start border-white/[0.06] min-h-[44px] text-sm md:text-base">
                  <BarChart3 className="w-4 h-4 mr-3" />
                  View Team Stats
                </Button>
                <Button variant="outline" className="w-full justify-start border-white/[0.06] min-h-[44px] text-sm md:text-base">
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Message Parents
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}