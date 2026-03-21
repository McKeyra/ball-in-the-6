'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, Calendar, CreditCard, Trophy, FileText, Users } from 'lucide-react';

interface Player {
  number: string;
  name: string;
  position: string;
  height: string;
}

interface Coach {
  name: string;
  title: string;
}

export function TeamDetailPage(): React.ReactElement {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.id as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('roster');

  const { data: teamData, isLoading } = useQuery<{
    name: string;
    age_group: string;
    gender: string;
    division: string;
    roster: Player[];
    staff: Coach[];
  }>({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) throw new Error('Failed to fetch team');
      return res.json();
    },
    enabled: !!teamId,
  });

  const team = teamData || { name: 'Loading...', age_group: '', gender: '', division: '', roster: [] as Player[], staff: [] as Coach[] };

  const getParents = (playerIndex: number): { name: string; relation: string }[] => {
    const parents = [
      [{ name: 'Mike Johnson', relation: 'Father' }, { name: 'Lisa Johnson', relation: 'Mother' }],
      [{ name: 'Sarah Connor', relation: 'Mother' }],
      [{ name: 'John Doe', relation: 'Father' }],
      [{ name: 'Jane Smith', relation: 'Mother' }],
    ];
    return parents[playerIndex % parents.length];
  };

  if (isLoading) return <div className="p-4 md:p-10 text-white text-center">Loading Team Details...</div>;

  const tabs = [
    { id: 'roster', label: 'Roster', activeColor: 'bg-blue-600' },
    { id: 'schedule', label: 'Schedule', activeColor: 'bg-green-600' },
    { id: 'payments', label: 'Payments', activeColor: 'bg-yellow-600' },
    { id: 'results', label: 'Results', activeColor: 'bg-red-600' },
    { id: 'accounting', label: 'Accounting', activeColor: 'bg-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Link href="/teams">
            <button className="text-white/40 hover:text-white min-h-[44px] min-w-[44px] flex items-center px-3 rounded-md">
              <ArrowLeft className="mr-2" size={20} /> Back
            </button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">{team.name}</h1>
            <p className="text-sm md:text-base text-white/40">{team.age_group} &bull; {team.gender} &bull; {team.division}</p>
          </div>
        </div>

        {/* Coaches Section */}
        <div className="bg-white/[0.05] border border-white/[0.06] p-4 md:p-6 rounded-2xl mb-6 md:mb-8">
          <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2 text-sm md:text-base">
            <Users size={18} /> Coaching Staff
          </h3>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2">
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

        {/* Search */}
        <div className="flex gap-2 md:gap-3 mb-6 md:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 md:left-4 top-3 md:top-3.5 text-white/30" size={18} />
            <input
              type="text"
              placeholder="Search players, parents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-3 rounded-xl bg-[#121212] text-white text-sm md:text-base min-h-[44px] border border-white/[0.06]"
            />
          </div>
          <button className="bg-white/[0.08] hover:bg-white/[0.10] text-white rounded-xl px-4 md:px-6 min-h-[44px] min-w-[44px]">
            <Filter size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-4 md:mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-sm md:text-base min-h-[44px] transition-colors ${activeTab === tab.id ? `${tab.activeColor} text-white` : 'text-white/40 bg-white/[0.05]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'roster' && (
          <div className="space-y-3 md:space-y-4">
            {team.roster?.map((player, i) => (
              <div key={i} className="bg-white/[0.05] border border-white/[0.06] p-3 md:p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm md:text-base">
                    {player.number}
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-bold text-white">{player.name}</div>
                    <div className="text-xs md:text-sm text-white/30">{player.position} &bull; {player.height}</div>
                  </div>
                </div>
                <div className="hidden md:block flex-1 border-b border-dashed border-white/[0.08] mx-8 relative top-1" />
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <div className="text-[10px] md:text-xs text-white/60 font-bold uppercase tracking-wider mr-1 md:mr-2">Connected<br />Parents</div>
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
            {(!team.roster || team.roster.length === 0) && (
              <div className="text-center text-white/30 py-8 md:py-10 text-sm md:text-base">No players on roster.</div>
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white/[0.05] border border-white/[0.06] p-6 md:p-8 rounded-2xl text-center text-white/30">
            <Calendar size={40} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Team Schedule</h3>
            <p className="text-sm md:text-base">Game fixtures and practice times will appear here.</p>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white/[0.05] border border-white/[0.06] p-6 md:p-8 rounded-2xl text-center text-white/30">
            <CreditCard size={40} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Payment Status</h3>
            <p className="text-sm md:text-base">Track team fees and player payments.</p>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-white/[0.05] border border-white/[0.06] p-6 md:p-8 rounded-2xl text-center text-white/30">
            <Trophy size={40} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Season Results</h3>
            <p className="text-sm md:text-base">Match outcomes and box scores.</p>
          </div>
        )}

        {activeTab === 'accounting' && (
          <div className="bg-white/[0.05] border border-white/[0.06] p-6 md:p-8 rounded-2xl text-center text-white/30">
            <FileText size={40} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Team Accounting</h3>
            <p className="text-sm md:text-base">Financial reports and connection tracking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
