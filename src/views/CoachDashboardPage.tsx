'use client';

import { useState } from 'react';
import {
  Users, BarChart3, ClipboardList, MessageSquare,
  TrendingUp, Clock, Award, Target,
} from 'lucide-react';

/* ---------- Types ---------- */
interface UpcomingGame {
  id: string;
  title: string;
  date: string;
  time: string;
}

type TabId = 'lineup' | 'analytics' | 'messages';

/* ---------- Component ---------- */
export function CoachDashboardPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabId>('lineup');

  // TODO: Replace with fetch('/api/teams') + TanStack Query
  const teamsCount = 0;
  // TODO: Replace with fetch('/api/schedule?type=game&upcoming=true&limit=3')
  const upcomingGames: UpcomingGame[] = [];

  const tabs: { id: TabId; label: string; mobileLabel?: string; icon: typeof ClipboardList }[] = [
    { id: 'lineup', label: 'Lineup Builder', mobileLabel: 'Lineup', icon: ClipboardList },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">Coach Dashboard</h1>
          <p className="text-sm md:text-base text-white/40">Lineup builder, analytics & team management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { icon: Users, color: 'text-[#c9a962]', value: teamsCount, label: 'Teams' },
            { icon: TrendingUp, color: 'text-green-400', value: '12-3', label: 'Season Record' },
            { icon: Award, color: 'text-yellow-400', value: '85%', label: 'Win Rate' },
            { icon: Target, color: 'text-blue-400', value: '92.5', label: 'Avg Points' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/[0.06] overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 min-h-[44px] px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
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

            {activeTab === 'lineup' && (
              <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-8 md:p-12 text-center">
                <ClipboardList className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
                <p className="text-sm md:text-base text-white/40">Lineup Builder - TODO: Build lineup component</p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-8 md:p-12 text-center">
                <BarChart3 className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
                <p className="text-sm md:text-base text-white/40">Playing Time Analytics - TODO: Build analytics component</p>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-8 md:p-12 text-center">
                <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-4" />
                <p className="text-sm md:text-base text-white/40">Team messaging coming soon</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Upcoming Games */}
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4">Next Games</h3>
              {upcomingGames.length === 0 ? (
                <p className="text-white/40 text-sm md:text-base">No upcoming games</p>
              ) : (
                <div className="space-y-3">
                  {upcomingGames.map((game) => (
                    <div key={game.id} className="p-3 bg-white/[0.05] rounded-lg">
                      <p className="text-sm md:text-base font-semibold text-white mb-1">{game.title}</p>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/40">
                        <Clock className="w-3 h-3" />
                        {new Date(game.date).toLocaleDateString()} - {game.time}
                      </div>
                      <button className="w-full mt-2 bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] rounded-md font-medium text-sm">
                        Set Lineup
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full justify-start border border-white/[0.06] min-h-[44px] rounded-md flex items-center gap-3 px-3 text-sm md:text-base text-white/70 hover:bg-white/[0.05]">
                  <ClipboardList className="w-4 h-4" /> Create Practice Plan
                </button>
                <button className="w-full justify-start border border-white/[0.06] min-h-[44px] rounded-md flex items-center gap-3 px-3 text-sm md:text-base text-white/70 hover:bg-white/[0.05]">
                  <BarChart3 className="w-4 h-4" /> View Team Stats
                </button>
                <button className="w-full justify-start border border-white/[0.06] min-h-[44px] rounded-md flex items-center gap-3 px-3 text-sm md:text-base text-white/70 hover:bg-white/[0.05]">
                  <MessageSquare className="w-4 h-4" /> Message Parents
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
