import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Users, Trophy, Target, Clock } from "lucide-react";

export default function PlayerProfiles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ['persistentPlayers'],
    queryFn: () => base44.entities.PersistentPlayer.list(),
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const getTeamById = (teamId) => teams.find(t => t.id === teamId);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = 
      `${player.first_name} ${player.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.jersey_number?.toString() || '').includes(searchTerm);
    
    const matchesTeam = teamFilter === 'all' || player.team_id === teamFilter;
    const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
    const matchesStatus = statusFilter === 'all' || player.status === statusFilter;
    
    return matchesSearch && matchesTeam && matchesPosition && matchesStatus;
  });

  const getPlayerAvg = (player, stat) => {
    if (!player.career_games || player.career_games === 0) return '0.0';
    return (player[stat] / player.career_games).toFixed(1);
  };

  if (playersLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-xl text-white/60">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white/90">Player Profiles</h1>
            <p className="text-sm md:text-base text-white/60">{players.length} registered players</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("PlayerManagement"))}
            className="min-h-[44px]"
            style={{
              backgroundColor: '#c9a962',
              color: '#0f0f0f',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Player
          </Button>
        </div>

        {/* Filters */}
        <div
          className="p-3 md:p-4 rounded-xl md:rounded-2xl mb-4 md:mb-6"
          style={{
            background: '#0f0f0f',
            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                placeholder="Search by name or jersey..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/[0.07] min-h-[44px] text-sm md:text-base"
              />
            </div>
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="bg-white/[0.07] min-h-[44px] text-sm">
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="min-h-[44px]">All Teams</SelectItem>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id} className="min-h-[44px]">{team.team_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="bg-white/[0.07] min-h-[44px] text-sm">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="min-h-[44px]">All Positions</SelectItem>
                <SelectItem value="PG" className="min-h-[44px]">Point Guard</SelectItem>
                <SelectItem value="SG" className="min-h-[44px]">Shooting Guard</SelectItem>
                <SelectItem value="SF" className="min-h-[44px]">Small Forward</SelectItem>
                <SelectItem value="PF" className="min-h-[44px]">Power Forward</SelectItem>
                <SelectItem value="C" className="min-h-[44px]">Center</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/[0.07] min-h-[44px] text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="min-h-[44px]">All Status</SelectItem>
                <SelectItem value="active" className="min-h-[44px]">Active</SelectItem>
                <SelectItem value="injured" className="min-h-[44px]">Injured</SelectItem>
                <SelectItem value="inactive" className="min-h-[44px]">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div
            className="p-8 md:p-12 rounded-2xl md:rounded-3xl text-center"
            style={{
              background: '#0f0f0f',
              boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)'
            }}
          >
            <Users className="w-12 h-12 md:w-16 md:h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-white/70 mb-2">No Players Found</h3>
            <p className="text-sm md:text-base text-white/40 mb-4">
              {searchTerm || teamFilter !== 'all' || positionFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first player'}
            </p>
            <Button
              onClick={() => navigate(createPageUrl("PlayerManagement"))}
              className="min-h-[44px]"
              style={{ backgroundColor: '#c9a962', color: '#0f0f0f' }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredPlayers.map((player) => {
              const team = getTeamById(player.team_id);
              return (
                <button
                  key={player.id}
                  onClick={() => navigate(createPageUrl("PlayerManagement") + `?playerId=${player.id}`)}
                  className="text-left rounded-2xl md:rounded-3xl p-4 md:p-5 hover:scale-[1.02] transition-transform min-h-[44px]"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)'
                  }}
                >
                  {/* Player Header */}
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    {player.photo_url ? (
                      <img
                        src={player.photo_url}
                        alt={player.first_name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                        style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.15)' }}
                      />
                    ) : (
                      <div
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-white text-lg md:text-xl flex-shrink-0"
                        style={{
                          background: team?.team_color || '#666',
                          boxShadow: '4px 4px 8px rgba(0,0,0,0.15)'
                        }}
                      >
                        {player.jersey_number || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base md:text-lg text-white/90 truncate">
                        {player.first_name} {player.last_name}
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/40">
                        <span className="font-semibold">{player.position}</span>
                        {player.height && <span className="hidden sm:inline">• {player.height}</span>}
                      </div>
                      {team && (
                        <div className="flex items-center gap-1 mt-1">
                          <div
                            className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                            style={{ background: team.team_color }}
                          />
                          <span className="text-xs text-white/60 truncate">{team.team_name}</span>
                        </div>
                      )}
                    </div>
                    {player.status && player.status !== 'active' && (
                      <span className={`px-2 py-1 rounded-lg text-[10px] md:text-xs font-semibold flex-shrink-0 ${
                        player.status === 'injured' ? 'bg-red-500/20 text-red-400' : 'bg-white/[0.06] text-white/60'
                      }`}>
                        {player.status}
                      </span>
                    )}
                  </div>

                  {/* Career Stats */}
                  <div
                    className="rounded-xl p-2.5 md:p-3"
                    style={{
                      background: '#0f0f0f',
                      boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)'
                    }}
                  >
                    <div className="flex items-center gap-1 mb-2 text-[10px] md:text-xs text-white/40">
                      <Trophy className="w-3 h-3" />
                      <span>Career Stats ({player.career_games || 0} games)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 md:gap-2 text-center">
                      <div>
                        <div className="text-base md:text-lg font-bold text-white/90">{getPlayerAvg(player, 'career_points')}</div>
                        <div className="text-[10px] md:text-xs text-white/40">PPG</div>
                      </div>
                      <div>
                        <div className="text-base md:text-lg font-bold text-white/90">{getPlayerAvg(player, 'career_rebounds')}</div>
                        <div className="text-[10px] md:text-xs text-white/40">RPG</div>
                      </div>
                      <div>
                        <div className="text-base md:text-lg font-bold text-white/90">{getPlayerAvg(player, 'career_assists')}</div>
                        <div className="text-[10px] md:text-xs text-white/40">APG</div>
                      </div>
                      <div>
                        <div className="text-base md:text-lg font-bold text-white/90">{getPlayerAvg(player, 'career_steals')}</div>
                        <div className="text-[10px] md:text-xs text-white/40">SPG</div>
                      </div>
                    </div>
                  </div>

                  {/* Shooting Stats */}
                  {(player.career_fga > 0 || player.career_three_pa > 0 || player.career_fta > 0) && (
                    <div className="flex justify-around mt-2 md:mt-3 text-[10px] md:text-xs text-white/40">
                      {player.career_fga > 0 && (
                        <div className="text-center">
                          <span className="font-semibold text-white/70">
                            {((player.career_fgm / player.career_fga) * 100).toFixed(1)}%
                          </span>
                          <span className="ml-1">FG</span>
                        </div>
                      )}
                      {player.career_three_pa > 0 && (
                        <div className="text-center">
                          <span className="font-semibold text-white/70">
                            {((player.career_three_pm / player.career_three_pa) * 100).toFixed(1)}%
                          </span>
                          <span className="ml-1">3PT</span>
                        </div>
                      )}
                      {player.career_fta > 0 && (
                        <div className="text-center">
                          <span className="font-semibold text-white/70">
                            {((player.career_ftm / player.career_fta) * 100).toFixed(1)}%
                          </span>
                          <span className="ml-1">FT</span>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}