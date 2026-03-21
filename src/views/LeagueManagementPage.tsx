'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Users, Calendar, PlayCircle, BarChart3 } from 'lucide-react';

/* ---------- Types ---------- */
interface Team {
  id: string;
  team_name: string;
  division: string;
  team_color: string;
}

interface Game {
  id: string;
  home_team_name: string;
  away_team_name: string;
  home_score: number;
  away_score: number;
  game_date: string;
  status: string;
}

type TabId = 'games' | 'teams' | 'schedule';

/* ---------- Component ---------- */
export function LeagueManagementPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabId>('games');

  // TODO: Replace with fetch('/api/teams') + TanStack Query
  const teams: Team[] = [];
  // TODO: Replace with fetch('/api/games?sort=-game_date&limit=100') + TanStack Query
  const games: Game[] = [];

  const tabs: { id: TabId; label: string; icon: typeof Trophy }[] = [
    { id: 'games', label: 'Games', icon: Trophy },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="p-4 md:p-6 lg:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 mb-1 md:mb-2">League Management</h1>
              <p className="text-sm md:text-base text-white/60">Manage games, teams, and schedules across all divisions</p>
            </div>
            <Link
              href="/games/court-view"
              className="min-h-[44px] w-full md:w-auto flex items-center justify-center gap-2 px-4 rounded-md font-medium"
              style={{ background: '#c9a962', color: 'white', boxShadow: '0 10px 26px rgba(0,0,0,.10)' }}
            >
              <PlayCircle className="w-5 h-5" />
              Go to Court View
            </Link>
          </div>

          {/* Quick Action */}
          <Link
            href="/teams/list"
            className="mb-4 md:mb-6 min-h-[44px] w-full md:w-auto inline-flex items-center gap-2 px-4 py-2 rounded-md"
            style={{ background: '#1a1a1a', color: 'rgba(255,255,255,0.7)', boxShadow: '0 10px 26px rgba(0,0,0,.10)' }}
          >
            <BarChart3 className="w-4 h-4" />
            View Standings & Team Performance
          </Link>

          {/* Tabs */}
          <div
            className="grid w-full grid-cols-3 mb-4 md:mb-6 p-1 rounded-2xl"
            style={{ background: '#1a1a1a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1 md:gap-2 py-3 text-sm md:text-base min-h-[44px] rounded-xl font-medium transition-all ${
                    activeTab === tab.id ? 'bg-[#c9a962] text-[#0f0f0f]' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'games' && (
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-8 md:p-12 text-center">
              <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white/20 mx-auto mb-4" />
              <p className="text-sm md:text-base text-white/40">Games section - connect to API</p>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-8 md:p-12 text-center">
              <Users className="w-12 h-12 md:w-16 md:h-16 text-white/20 mx-auto mb-4" />
              <p className="text-sm md:text-base text-white/40">Teams section - connect to API</p>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-8 md:p-12 text-center">
              <Calendar className="w-12 h-12 md:w-16 md:h-16 text-white/20 mx-auto mb-4" />
              <p className="text-sm md:text-base text-white/40">Schedule section - connect to API</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
