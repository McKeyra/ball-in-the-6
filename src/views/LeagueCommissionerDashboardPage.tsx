'use client';

import { useState } from 'react';
import { Calendar, Users, Flag, Trophy, Settings } from 'lucide-react';

/* ---------- Types ---------- */
interface ScheduleItem {
  id: string;
  type: string;
  date: string;
  referee_assigned: boolean;
}

type TabId = 'scheduler' | 'refs' | 'standings' | 'settings';

/* ---------- Component ---------- */
export function LeagueCommissionerDashboardPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabId>('scheduler');

  // TODO: Replace with fetch('/api/teams') + TanStack Query
  const teamsCount = 0;
  // TODO: Replace with fetch('/api/schedule?sort=-date') + TanStack Query
  const scheduleItemsCount = 0;
  const gamesNeedingRefs = 0;

  const tabs: { id: TabId; label: string; icon: typeof Calendar; mobileLabel?: string }[] = [
    { id: 'scheduler', label: 'Multi-Division Scheduler', mobileLabel: 'Scheduler', icon: Calendar },
    { id: 'refs', label: 'Ref Assignor', mobileLabel: 'Refs', icon: Flag },
    { id: 'standings', label: 'Standings', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">League Commissioner</h1>
          <p className="text-sm md:text-base text-white/40">Multi-division scheduler & referee management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { icon: Users, color: 'text-[#c9a962]', value: teamsCount, label: 'Teams' },
            { icon: Calendar, color: 'text-blue-400', value: scheduleItemsCount, label: 'Games Scheduled' },
            { icon: Flag, color: 'text-yellow-400', value: gamesNeedingRefs, label: 'Need Refs' },
            { icon: Trophy, color: 'text-purple-400', value: 4, label: 'Divisions' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-4 md:p-6">
                <Icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color} mb-2 md:mb-3`} />
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/40">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-4 md:mb-6 bg-white/[0.05] border border-white/[0.06] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 md:gap-2 min-h-[44px] px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id ? 'bg-[#c9a962] text-[#0f0f0f]' : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.mobileLabel || tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'scheduler' && (
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-8 md:p-12 text-center">
            <Calendar className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
            <p className="text-sm md:text-base text-white/40">Multi-Division Scheduler - TODO: Build scheduler component</p>
          </div>
        )}

        {activeTab === 'refs' && (
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-8 md:p-12 text-center">
            <Flag className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
            <p className="text-sm md:text-base text-white/40">Ref Assignor - TODO: Build ref assignment component</p>
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-8 md:p-12 text-center">
            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
            <p className="text-sm md:text-base text-white/40">Standings management coming soon</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-8 md:p-12 text-center">
            <Settings className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
            <p className="text-sm md:text-base text-white/40">League settings coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
