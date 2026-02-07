import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, Users, Flag, Trophy, Settings
} from "lucide-react";
import MultiDivisionScheduler from "../components/commissioner/MultiDivisionScheduler";
import RefAssignor from "../components/commissioner/RefAssignor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LeagueCommissionerDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: teams = [] } = useQuery({
    queryKey: ['league-teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const { data: scheduleItems = [] } = useQuery({
    queryKey: ['league-schedule'],
    queryFn: () => base44.entities.ScheduleItem.list('-date'),
  });

  const gamesNeedingRefs = scheduleItems.filter(item => 
    item.type === 'game' && 
    new Date(item.date) >= new Date() &&
    !item.referee_assigned
  ).length;

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
            League Commissioner
          </h1>
          <p className="text-sm md:text-base text-white/40">Multi-division scheduler & referee management</p>
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
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mb-2 md:mb-3" />
              <p className="text-2xl md:text-3xl font-bold text-white">{scheduleItems.length}</p>
              <p className="text-xs md:text-sm text-white/40">Games Scheduled</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardContent className="p-4 md:p-6">
              <Flag className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mb-2 md:mb-3" />
              <p className="text-2xl md:text-3xl font-bold text-white">{gamesNeedingRefs}</p>
              <p className="text-xs md:text-sm text-white/40">Need Refs</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardContent className="p-4 md:p-6">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mb-2 md:mb-3" />
              <p className="text-2xl md:text-3xl font-bold text-white">4</p>
              <p className="text-xs md:text-sm text-white/40">Divisions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="scheduler" className="space-y-4 md:space-y-6">
          <TabsList className="bg-white/[0.05] border-white/[0.06] w-full justify-start overflow-x-auto">
            <TabsTrigger value="scheduler" className="gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Multi-Division</span> Scheduler
            </TabsTrigger>
            <TabsTrigger value="refs" className="gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
              <Flag className="w-4 h-4" />
              <span className="hidden sm:inline">Ref</span> Assignor
            </TabsTrigger>
            <TabsTrigger value="standings" className="gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
              <Trophy className="w-4 h-4" />
              Standings
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scheduler">
            <MultiDivisionScheduler teams={teams} scheduleItems={scheduleItems} />
          </TabsContent>

          <TabsContent value="refs">
            <RefAssignor scheduleItems={scheduleItems} />
          </TabsContent>

          <TabsContent value="standings">
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardContent className="p-8 md:p-12 text-center">
                <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
                <p className="text-sm md:text-base text-white/40">Standings management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardContent className="p-8 md:p-12 text-center">
                <Settings className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
                <p className="text-sm md:text-base text-white/40">League settings coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}