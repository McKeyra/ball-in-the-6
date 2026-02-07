import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, DollarSign, TrendingUp, Users, Settings, 
  Palette, Bell, Globe, BarChart3
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OrgPresidentDashboard() {
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

  const mockFinancials = {
    revenue: 125450,
    expenses: 87230,
    profit: 38220,
    programs: [
      { name: 'Rep Teams', revenue: 65000, participants: 85 },
      { name: 'House League', revenue: 42000, participants: 120 },
      { name: 'Private Training', revenue: 18450, participants: 35 },
    ]
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
            Organization President
          </h1>
          <p className="text-sm md:text-base text-white/40">White-label app & consolidated financials</p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                <span className="text-xs px-2 py-1 bg-green-500/30 text-green-300 rounded">+12%</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">${(mockFinancials.revenue / 1000).toFixed(1)}K</p>
              <p className="text-xs md:text-sm text-white/50">Total Revenue</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                <span className="text-xs px-2 py-1 bg-blue-500/30 text-blue-300 rounded">YTD</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">${(mockFinancials.profit / 1000).toFixed(1)}K</p>
              <p className="text-xs md:text-sm text-white/50">Net Profit</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">240</p>
              <p className="text-xs md:text-sm text-white/50">Total Members</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="app" className="space-y-4 md:space-y-6">
          <TabsList className="bg-white/[0.05] border-white/[0.06] w-full justify-start overflow-x-auto">
            <TabsTrigger value="app" className="gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">White-Label</span> App
            </TabsTrigger>
            <TabsTrigger value="financials" className="gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
              <BarChart3 className="w-4 h-4" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
              <Palette className="w-4 h-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="app">
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#c9a962]/20 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-[#c9a962]" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">White-Label Mobile App</CardTitle>
                      <p className="text-xs md:text-sm text-white/40">Your brand in App Store & Google Play</p>
                    </div>
                  </div>
                  <Button className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90 min-h-[44px] w-full sm:w-auto">
                    Launch App Builder
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* App Preview */}
                  <div className="p-4 md:p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/[0.06]">
                    <div className="aspect-[9/19] bg-black rounded-2xl md:rounded-3xl p-2 shadow-2xl mx-auto max-w-[200px] md:max-w-xs">
                      <div className="w-full h-full bg-gradient-to-br from-[#c9a962] to-yellow-500 rounded-xl md:rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <Smartphone className="w-10 h-10 md:w-16 md:h-16 text-[#0A0A0A] mx-auto mb-2 md:mb-4" />
                          <p className="text-lg md:text-2xl font-bold text-[#0A0A0A]">
                            {organization?.name || 'Your Org'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* App Configuration */}
                  <div className="space-y-3 md:space-y-4">
                    <div className="p-3 md:p-4 bg-white/[0.05] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs md:text-sm text-white/40">App Status</span>
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                          In Review
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-white/50">Pending Apple & Google approval</p>
                    </div>

                    <div className="p-3 md:p-4 bg-white/[0.05] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs md:text-sm text-white/40">App Name</span>
                        <Button size="sm" variant="ghost" className="text-[#c9a962] min-h-[44px]">
                          Edit
                        </Button>
                      </div>
                      <p className="text-sm md:text-base text-white font-medium">{organization?.name || 'Your Organization'} Sports</p>
                    </div>

                    <div className="p-3 md:p-4 bg-white/[0.05] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs md:text-sm text-white/40">Bundle ID</span>
                        <Button size="sm" variant="ghost" className="text-[#c9a962] min-h-[44px]">
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-white/40 font-mono">com.yourorg.sportsapp</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="outline" className="border-white/[0.06] min-h-[44px] text-sm md:text-base">
                        <Globe className="w-4 h-4 mr-2" />
                        Preview Web
                      </Button>
                      <Button variant="outline" className="border-white/[0.06] min-h-[44px] text-sm md:text-base">
                        <Bell className="w-4 h-4 mr-2" />
                        Push Notifications
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials">
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <BarChart3 className="w-5 h-5 text-[#c9a962]" />
                  Consolidated P&L by Season/Division
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
                {mockFinancials.programs.map((program, idx) => (
                  <div key={idx} className="p-3 md:p-4 bg-white/[0.05] rounded-lg border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm md:text-base font-semibold text-white">{program.name}</p>
                        <p className="text-xs md:text-sm text-white/40">{program.participants} participants</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg md:text-2xl font-bold text-[#c9a962]">
                          ${(program.revenue / 1000).toFixed(1)}K
                        </p>
                        <p className="text-xs text-white/40">Revenue</p>
                      </div>
                    </div>
                    <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#c9a962] to-green-400"
                        style={{ width: `${(program.revenue / mockFinancials.revenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-white/[0.06] min-h-[44px] text-sm md:text-base">
                  Export Financial Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardContent className="p-8 md:p-12 text-center">
                <Palette className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
                <p className="text-sm md:text-base text-white/40">Branding customization coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardContent className="p-8 md:p-12 text-center">
                <Settings className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
                <p className="text-sm md:text-base text-white/40">Organization settings coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}