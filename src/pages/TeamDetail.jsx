import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Calendar, 
  CreditCard, 
  Trophy, 
  FileText, 
  User, 
  Users,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function TeamDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get('id');
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("roster");

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
        // In a real app we'd fetch by ID, but for now list and find (since .get(id) might not be available in this specific SDK version or for safety)
        // Actually SDK usually has .get(id). Let's try .list and find for safety with the mock data we just created.
        const teams = await base44.entities.Team.list();
        return teams.find(t => t.id === teamId) || teams[0]; // Fallback to first if not found for demo
    }
  });

  // Mock connections for visual grouping
  const getParents = (playerIndex) => {
      const parents = [
          [{ name: "Mike Johnson", relation: "Father" }, { name: "Lisa Johnson", relation: "Mother" }],
          [{ name: "Sarah Connor", relation: "Mother" }],
          [{ name: "John Doe", relation: "Father" }],
          [{ name: "Jane Smith", relation: "Mother" }]
      ];
      return parents[playerIndex % parents.length];
  };

  if (isLoading) return <div className="p-4 md:p-10 text-white text-center">Loading Team Details...</div>;
  if (!team) return <div className="p-4 md:p-10 text-white text-center">Team not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <Link to={createPageUrl('LeagueManagement')}>
          <Button variant="ghost" className="text-white/40 hover:text-white min-h-[44px] min-w-[44px]">
            <ArrowLeft className="mr-2" size={20}/> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">{team.name}</h1>
          <p className="text-sm md:text-base text-white/40">{team.age_group} • {team.gender} • {team.division}</p>
        </div>
      </div>

      {/* Coaches Section */}
      <div className="neu-flat p-4 md:p-6 rounded-2xl mb-6 md:mb-8">
        <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2 text-sm md:text-base">
          <Users size={18}/> Coaching Staff
        </h3>
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 -mx-2 px-2">
          {team.staff?.map((coach, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[80px] md:min-w-[100px]">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-purple-900/20 border-2 border-purple-500/50 flex items-center justify-center text-purple-400 font-bold text-lg md:text-xl">
                {coach.name.charAt(0)}
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-xs md:text-sm">{coach.name}</div>
                <div className="text-[10px] md:text-xs text-white/30">{coach.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 md:gap-3 mb-6 md:mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 md:left-4 top-3 md:top-3.5 text-white/30" size={18} />
          <input
            type="text"
            placeholder="Search players, parents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input w-full pl-10 md:pl-12 pr-4 py-3 rounded-xl bg-[#121212] text-white text-sm md:text-base min-h-[44px]"
          />
        </div>
        <Button className="bg-white/[0.08] hover:bg-white/[0.10] text-white rounded-xl px-4 md:px-6 min-h-[44px] min-w-[44px]">
          <Filter size={20} />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="roster" onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent gap-2 md:gap-4 mb-4 md:mb-6 flex-wrap h-auto justify-start">
          <TabsTrigger value="roster" className="neu-tab data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-white/40 text-sm md:text-base min-h-[44px]">Roster</TabsTrigger>
          <TabsTrigger value="schedule" className="neu-tab data-[state=active]:bg-green-600 data-[state=active]:text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-white/40 text-sm md:text-base min-h-[44px]">Schedule</TabsTrigger>
          <TabsTrigger value="payments" className="neu-tab data-[state=active]:bg-yellow-600 data-[state=active]:text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-white/40 text-sm md:text-base min-h-[44px]">Payments</TabsTrigger>
          <TabsTrigger value="results" className="neu-tab data-[state=active]:bg-red-600 data-[state=active]:text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-white/40 text-sm md:text-base min-h-[44px]">Results</TabsTrigger>
          <TabsTrigger value="accounting" className="neu-tab data-[state=active]:bg-cyan-600 data-[state=active]:text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-white/40 text-sm md:text-base min-h-[44px]">Accounting</TabsTrigger>
        </TabsList>

          <TabsContent value="roster" className="space-y-3 md:space-y-4 animate-in fade-in">
            {team.roster?.map((player, i) => (
              <div key={i} className="neu-flat p-3 md:p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 group hover:bg-white/[0.07] active:bg-white/[0.07] transition-colors">
                {/* Player Info */}
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm md:text-base">
                    {player.number}
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-bold text-white">{player.name}</div>
                    <div className="text-xs md:text-sm text-white/30">{player.position} • {player.height}</div>
                  </div>
                </div>

                {/* Visual Connection Line (Mobile hidden) */}
                <div className="hidden md:block flex-1 border-b border-dashed border-white/[0.08] mx-8 relative top-1"></div>

                {/* Parents Group */}
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <div className="text-[10px] md:text-xs text-white/60 font-bold uppercase tracking-wider mr-1 md:mr-2">Connected<br/>Parents</div>
                  {getParents(i).map((parent, pIndex) => (
                    <div key={pIndex} className="flex items-center gap-1.5 md:gap-2 bg-white/[0.04] rounded-full pr-2 md:pr-3 pl-1 py-1 border border-white/5 min-h-[44px]">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white/50">
                        {parent.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[10px] md:text-xs text-white font-bold">{parent.name}</div>
                        <div className="text-[9px] md:text-[10px] text-white/30 leading-none">{parent.relation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {(!team.roster || team.roster.length === 0) && <div className="text-center text-white/30 py-8 md:py-10 text-sm md:text-base">No players on roster.</div>}
          </TabsContent>

          <TabsContent value="schedule" className="neu-flat p-6 md:p-8 rounded-2xl text-center text-white/30">
            <Calendar size={40} className="mx-auto mb-4 opacity-50 md:w-12 md:h-12" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Team Schedule</h3>
            <p className="text-sm md:text-base">Game fixtures and practice times will appear here.</p>
          </TabsContent>

          <TabsContent value="payments" className="neu-flat p-6 md:p-8 rounded-2xl text-center text-white/30">
            <CreditCard size={40} className="mx-auto mb-4 opacity-50 md:w-12 md:h-12" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Payment Status</h3>
            <p className="text-sm md:text-base">Track team fees and player payments.</p>
          </TabsContent>

          <TabsContent value="results" className="neu-flat p-6 md:p-8 rounded-2xl text-center text-white/30">
            <Trophy size={40} className="mx-auto mb-4 opacity-50 md:w-12 md:h-12" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Season Results</h3>
            <p className="text-sm md:text-base">Match outcomes and box scores.</p>
          </TabsContent>

          <TabsContent value="accounting" className="neu-flat p-6 md:p-8 rounded-2xl text-center text-white/30">
            <FileText size={40} className="mx-auto mb-4 opacity-50 md:w-12 md:h-12" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Team Accounting</h3>
            <p className="text-sm md:text-base">Financial reports and connection tracking.</p>
          </TabsContent>

      </Tabs>
    </div>
  );
}