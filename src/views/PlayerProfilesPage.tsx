'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, UserPlus, Users, Trophy } from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface Team {
  id: string;
  team_name: string;
  team_color: string;
}

interface PersistentPlayer {
  id: string;
  first_name: string;
  last_name: string;
  jersey_number?: number;
  position: string;
  height?: string;
  status?: string;
  team_id?: string;
  photo_url?: string;
  career_games: number;
  career_points: number;
  career_rebounds: number;
  career_assists: number;
  career_steals: number;
  career_fgm: number;
  career_fga: number;
  career_three_pm: number;
  career_three_pa: number;
  career_ftm: number;
  career_fta: number;
}

export function PlayerProfilesPage(): React.ReactElement {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: players = [], isLoading: playersLoading } = useQuery<PersistentPlayer[]>({
    queryKey: ['player-profiles'],
    queryFn: async () => {
      const res = await fetch('/api/players?sport=basketball');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['profiles-teams'],
    queryFn: async () => {
      const res = await fetch('/api/teams?sport=basketball');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const getTeamById = (teamId?: string): Team | undefined =>
    teams.find((t) => t.id === teamId);

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      `${player.first_name} ${player.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.jersey_number?.toString() || '').includes(searchTerm);
    const matchesTeam = teamFilter === 'all' || player.team_id === teamFilter;
    const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
    const matchesStatus = statusFilter === 'all' || player.status === statusFilter;
    return matchesSearch && matchesTeam && matchesPosition && matchesStatus;
  });

  const getPlayerAvg = (player: PersistentPlayer, stat: keyof PersistentPlayer): string => {
    if (!player.career_games || player.career_games === 0) return '0.0';
    return ((player[stat] as number) / player.career_games).toFixed(1);
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
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Player Profiles</h1>
            <p className="text-sm md:text-base text-white/60">{players.length} registered players</p>
          </div>
          <button
            onClick={() => router.push('/players/management')}
            className="min-h-[44px] bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add New Player
          </button>
        </div>

        {/* Filters */}
        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl mb-4 md:mb-6 bg-white/[0.05] border border-white/[0.06]">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                placeholder="Search by name or jersey..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white/[0.07] min-h-[44px] text-sm md:text-base rounded-lg border border-white/[0.06] text-white placeholder:text-white/30 px-3"
              />
            </div>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="bg-white/[0.07] min-h-[44px] text-sm rounded-lg border border-white/[0.06] text-white px-3"
            >
              <option value="all">All Teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.team_name}</option>
              ))}
            </select>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="bg-white/[0.07] min-h-[44px] text-sm rounded-lg border border-white/[0.06] text-white px-3"
            >
              <option value="all">All Positions</option>
              <option value="PG">Point Guard</option>
              <option value="SG">Shooting Guard</option>
              <option value="SF">Small Forward</option>
              <option value="PF">Power Forward</option>
              <option value="C">Center</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/[0.07] min-h-[44px] text-sm rounded-lg border border-white/[0.06] text-white px-3"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="injured">Injured</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="p-8 md:p-12 rounded-2xl text-center bg-white/[0.05] border border-white/[0.06]">
            <Users className="w-12 h-12 md:w-16 md:h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-white/70 mb-2">No Players Found</h3>
            <p className="text-sm md:text-base text-white/40 mb-4">
              {searchTerm || teamFilter !== 'all' || positionFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first player'}
            </p>
            <button
              onClick={() => router.push('/players/management')}
              className="min-h-[44px] bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Player
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredPlayers.map((player) => {
              const team = getTeamById(player.team_id);
              return (
                <button
                  key={player.id}
                  onClick={() => router.push(`/players/management?playerId=${player.id}`)}
                  className="text-left rounded-2xl p-4 md:p-5 hover:scale-[1.02] transition-transform min-h-[44px] bg-white/[0.05] border border-white/[0.06]"
                >
                  {/* Player Header */}
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    {player.photo_url ? (
                      <img
                        src={player.photo_url}
                        alt={player.first_name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-white text-lg md:text-xl flex-shrink-0"
                        style={{ background: team?.team_color || '#666' }}
                      >
                        {player.jersey_number || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base md:text-lg text-white truncate">
                        {player.first_name} {player.last_name}
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/40">
                        <span className="font-semibold">{player.position}</span>
                        {player.height && <span className="hidden sm:inline">&bull; {player.height}</span>}
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
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] md:text-xs font-semibold flex-shrink-0 ${
                          player.status === 'injured' ? 'bg-red-500/20 text-red-400' : 'bg-white/[0.06] text-white/60'
                        }`}
                      >
                        {player.status}
                      </span>
                    )}
                  </div>

                  {/* Career Stats */}
                  <div className="rounded-xl p-2.5 md:p-3 bg-white/[0.08] border border-white/[0.08]">
                    <div className="flex items-center gap-1 mb-2 text-[10px] md:text-xs text-white/40">
                      <Trophy className="w-3 h-3" />
                      <span>Career Stats ({player.career_games || 0} games)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 md:gap-2 text-center">
                      <div>
                        <div className="text-base md:text-lg font-bold text-white">{getPlayerAvg(player, 'career_points')}</div>
                        <div className="text-[10px] md:text-xs text-white/40">PPG</div>
                      </div>
                      <div>
                        <div className="text-base md:text-lg font-bold text-white">{getPlayerAvg(player, 'career_rebounds')}</div>
                        <div className="text-[10px] md:text-xs text-white/40">RPG</div>
                      </div>
                      <div>
                        <div className="text-base md:text-lg font-bold text-white">{getPlayerAvg(player, 'career_assists')}</div>
                        <div className="text-[10px] md:text-xs text-white/40">APG</div>
                      </div>
                      <div>
                        <div className="text-base md:text-lg font-bold text-white">{getPlayerAvg(player, 'career_steals')}</div>
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
