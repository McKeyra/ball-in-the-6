import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Users, Calendar, Store, TrendingUp, Plus, 
  ArrowRight, Sparkles, Target, DollarSign 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrgDashboard() {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    base44.auth.me().then(async (userData) => {
      setUser(userData);
      if (userData.organization_id) {
        const org = await base44.entities.Organization.filter({ id: userData.organization_id });
        setOrganization(org[0]);
      }
    });
  }, []);

  const { data: programs = [] } = useQuery({
    queryKey: ['programs'],
    queryFn: () => base44.entities.Program.list('-created_date'),
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const { data: scheduleItems = [] } = useQuery({
    queryKey: ['schedule'],
    queryFn: () => base44.entities.ScheduleItem.list(),
  });

  const upcomingGames = scheduleItems
    .filter(item => new Date(item.date) >= new Date() && item.type === 'game')
    .slice(0, 3);

  const stats = [
    { 
      label: "Active Programs", 
      value: programs.filter(p => p.status === 'active').length,
      icon: Target,
      color: "from-[#c9a962] to-yellow-400"
    },
    { 
      label: "Total Teams", 
      value: teams.length,
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    { 
      label: "Upcoming Games", 
      value: upcomingGames.length,
      icon: Calendar,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      label: "Revenue (Mock)", 
      value: "$12,450",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500"
    },
  ];

  const quickActions = [
    { 
      title: "Create Program", 
      icon: Plus, 
      link: createPageUrl("Programs"),
      desc: "Launch new training, league, or tournament"
    },
    { 
      title: "Add Game", 
      icon: Calendar, 
      link: createPageUrl("Schedule"),
      desc: "Schedule game, practice, or event"
    },
    { 
      title: "Team Store", 
      icon: Store, 
      link: createPageUrl("Store"),
      desc: "Create merch drop or team store"
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
              Welcome back{user && `, ${user.full_name.split(' ')[0]}`}
            </h1>
            <p className="text-sm md:text-base text-white/40">
              {organization?.name || "Your Organization"} - {organization?.sport || "Multi-Sport"}
            </p>
          </div>
          <Button className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 font-semibold min-h-[44px] w-full sm:w-auto">
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-white/[0.05] border-white/[0.06] overflow-hidden group hover:scale-105 transition-transform">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/40">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {quickActions.map((action, idx) => (
              <Link key={idx} to={action.link}>
                <Card className="bg-white/[0.05] border-white/[0.06] hover:border-[#c9a962]/50 transition-all group cursor-pointer min-h-[44px]">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-[#c9a962]/20 flex items-center justify-center mb-3">
                          <action.icon className="w-5 h-5 text-[#c9a962]" />
                        </div>
                        <h3 className="text-sm md:text-base font-semibold mb-1">{action.title}</h3>
                        <p className="text-xs md:text-sm text-white/40">{action.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-[#c9a962] group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Calendar className="w-5 h-5 text-[#c9a962]" />
                Upcoming Games
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 space-y-3">
              {upcomingGames.length === 0 ? (
                <p className="text-white/40 text-sm md:text-base">No upcoming games scheduled</p>
              ) : (
                upcomingGames.map((game) => (
                  <div key={game.id} className="flex justify-between items-center p-3 bg-white/[0.05] rounded-lg min-h-[44px]">
                    <div>
                      <p className="text-sm md:text-base font-medium">{game.title}</p>
                      <p className="text-xs md:text-sm text-white/40">{new Date(game.date).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs bg-[#c9a962]/20 text-[#c9a962] px-2 py-1 rounded">
                      {game.home_away}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/[0.05] border-white/[0.06]">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Users className="w-5 h-5 text-[#c9a962]" />
                Active Programs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 space-y-3">
              {programs.filter(p => p.status === 'active').slice(0, 3).length === 0 ? (
                <p className="text-white/40 text-sm md:text-base">No active programs</p>
              ) : (
                programs.filter(p => p.status === 'active').slice(0, 3).map((program) => (
                  <div key={program.id} className="flex justify-between items-center p-3 bg-white/[0.05] rounded-lg min-h-[44px]">
                    <div>
                      <p className="text-sm md:text-base font-medium">{program.name}</p>
                      <p className="text-xs md:text-sm text-white/40">{program.type.replace(/_/g, ' ')}</p>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {program.current_participants}/{program.max_participants || '-'}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}