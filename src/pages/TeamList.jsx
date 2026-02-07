import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

export default function TeamList() {
  const navigate = useNavigate();

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
    initialData: [],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-xl text-white/60">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 mb-1 md:mb-2">Teams</h1>
            <p className="text-sm md:text-base text-white/60">Manage your basketball teams</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("CreateTeam"))}
            className="min-h-[44px] px-4 md:px-6 font-semibold"
            style={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
              border: 'none'
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Team
          </Button>
        </div>

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <div
            className="p-8 md:p-12 rounded-3xl text-center"
            style={{
              background: '#0f0f0f',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
            }}
          >
            <Users className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 text-white/30" />
            <h3 className="text-xl md:text-2xl font-bold text-white/70 mb-2">No Teams Yet</h3>
            <p className="text-sm md:text-base text-white/40 mb-6">Create your first team to get started</p>
            <Button
              onClick={() => navigate(createPageUrl("CreateTeam"))}
              className="min-h-[44px] px-6"
              style={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                boxShadow: '4px 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Team
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => navigate(createPageUrl("TeamManagement") + `?teamId=${team.id}`)}
                className="cursor-pointer group active:scale-[0.98] hover:scale-[1.02] transition-transform min-h-[44px]"
                style={{
                  background: '#0f0f0f',
                  boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
                  borderRadius: '24px',
                  padding: '20px'
                }}
              >
                {/* Team Logo/Color */}
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  {team.logo_url ? (
                    <img
                      src={team.logo_url}
                      alt={team.team_name}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
                      style={{
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.15)'
                      }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl"
                      style={{
                        background: team.team_color || '#666',
                        boxShadow: '3px 3px 6px rgba(0,0,0,0.15)'
                      }}
                    >
                      {team.team_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-white/90 truncate">{team.team_name}</h3>
                    <p className="text-xs md:text-sm text-white/40">{team.division}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-around pt-4 border-t border-white/[0.06]">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-white/70">{team.roster?.length || 0}</div>
                    <div className="text-xs text-white/40">Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-white/70">{team.staff?.length || 0}</div>
                    <div className="text-xs text-white/40">Staff</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}