import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, PlayCircle, BarChart3 } from 'lucide-react';
import GamesSection from '../components/league/GamesSection';
import TeamsSection from '../components/league/TeamsSection';
import ScheduleSection from '../components/league/ScheduleSection';

export default function LeagueManagement() {
  const navigate = useNavigate();

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
    refetchOnWindowFocus: false,
  });

  const { data: games = [] } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list('-game_date', 100),
    refetchOnWindowFocus: false,
  });

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
            <Button
              onClick={() => navigate(createPageUrl("CourtView"))}
              className="min-h-[44px] w-full md:w-auto"
              style={{
                background: '#c9a962',
                color: 'white',
                boxShadow: '0 10px 26px rgba(0,0,0,.10)'
              }}
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Go to Court View
            </Button>
          </div>

          {/* Quick Action: Team Overview */}
          <Button
            onClick={() => navigate(createPageUrl("TeamOverview"))}
            className="mb-4 md:mb-6 min-h-[44px] w-full md:w-auto"
            style={{
              background: '#1a1a1a',
              color: 'rgba(255,255,255,0.7)',
              boxShadow: '0 10px 26px rgba(0,0,0,.10)'
            }}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Standings & Team Performance
          </Button>

          {/* Main Tabs */}
          <Tabs defaultValue="games" className="w-full">
            <TabsList
              className="grid w-full grid-cols-3 mb-4 md:mb-6"
              style={{
                background: '#1a1a1a',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                padding: '4px md:6px',
                borderRadius: '16px',
                height: 'auto'
              }}
            >
              <TabsTrigger
                value="games"
                className="flex items-center justify-center gap-1 md:gap-2 py-3 text-sm md:text-base min-h-[44px]"
              >
                <Trophy className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Games</span>
              </TabsTrigger>
              <TabsTrigger
                value="teams"
                className="flex items-center justify-center gap-1 md:gap-2 py-3 text-sm md:text-base min-h-[44px]"
              >
                <Users className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Teams</span>
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="flex items-center justify-center gap-1 md:gap-2 py-3 text-sm md:text-base min-h-[44px]"
              >
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Schedule</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="games">
              <GamesSection />
            </TabsContent>

            <TabsContent value="teams">
              <TeamsSection />
            </TabsContent>

            <TabsContent value="schedule">
              <ScheduleSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}