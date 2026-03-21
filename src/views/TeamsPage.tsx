'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Users, Trophy } from 'lucide-react';

/* ---------- Types ---------- */
interface TeamFormData {
  name: string;
  sport: string;
  age_group: string;
  season: string;
  color: string;
}

interface Team {
  id: string;
  name: string;
  sport: string;
  age_group: string;
  season: string;
  color: string;
  logo_url?: string;
  wins?: number;
  losses?: number;
  ties?: number;
}

const SPORT_COLORS: Record<string, string> = {
  basketball: '#FF6B35',
  hockey: '#004E89',
  soccer: '#2ECC40',
  baseball: '#B91D73',
  football: '#8B4513',
  volleyball: '#FFD700',
  lacrosse: '#9C27B0',
};

/* ---------- Component ---------- */
export function TeamsPage(): React.ReactElement {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [rosterOpen, setRosterOpen] = useState(false);

  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    sport: 'basketball',
    age_group: '',
    season: '',
    color: '#c9a962',
  });

  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ['teams', { sport: 'basketball' }],
    queryFn: async () => {
      const res = await fetch('/api/teams?sport=basketball');
      if (!res.ok) throw new Error('Failed to fetch teams');
      return res.json();
    },
  });

  const handleCreate = (): void => {
    // TODO: POST /api/teams with formData
    setCreateOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Teams</h1>
            <p className="text-sm md:text-base text-white/40">Manage rosters, assign members & track records</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] min-w-[44px] px-4 md:px-6 rounded-md font-medium flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Team
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/[0.05] border border-white/[0.06] rounded-lg overflow-hidden animate-pulse">
                <div className="h-24 bg-white/[0.08]" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-32 bg-white/[0.08] rounded" />
                  <div className="h-4 w-24 bg-white/[0.06] rounded" />
                  <div className="h-12 bg-white/[0.05] rounded-lg" />
                  <div className="h-11 bg-white/[0.05] rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white/[0.05] border border-white/[0.06] hover:border-[#c9a962]/50 transition-all overflow-hidden rounded-lg group"
            >
              <div
                className="h-24 relative"
                style={{
                  background: `linear-gradient(135deg, ${team.color || SPORT_COLORS[team.sport]} 0%, ${team.color || SPORT_COLORS[team.sport]}66 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                {team.logo_url && (
                  <img src={team.logo_url} alt={team.name} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
                )}
              </div>

              <div className="p-4">
                <div className="text-lg flex items-center justify-between font-semibold">
                  <span>{team.name}</span>
                  <span className="text-xs px-2 py-1 bg-white/[0.08] rounded">{team.sport}</span>
                </div>
                <p className="text-sm text-white/40">{team.age_group} &bull; {team.season}</p>
              </div>

              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/[0.05] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#c9a962]" />
                    <span className="text-sm">Record</span>
                  </div>
                  <span className="font-semibold">
                    {team.wins || 0}-{team.losses || 0}-{team.ties || 0}
                  </span>
                </div>

                <Link
                  href={`/teams/${team.id}/management`}
                  className="w-full border border-white/[0.06] hover:border-[#c9a962]/50 min-h-[44px] rounded-md flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Manage Roster
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}

        {!isLoading && teams.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-bold text-white/60 mb-2">No Teams Yet</h3>
            <p className="text-white/40 mb-6">Create your first team to get started</p>
            <button
              onClick={() => setCreateOpen(true)}
              className="bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] px-6 rounded-md font-medium inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Team
            </button>
          </div>
        )}

        {/* Create Team Dialog */}
        {createOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setCreateOpen(false)}>
            <div className="bg-[#121212] border border-white/[0.06] text-white rounded-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-4">Create New Team</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Team Name</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Elite Raptors U14"
                    className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Sport</label>
                    <select
                      value={formData.sport}
                      onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                    >
                      <option value="basketball">Basketball</option>
                      <option value="hockey">Hockey</option>
                      <option value="soccer">Soccer</option>
                      <option value="baseball">Baseball</option>
                      <option value="football">Football</option>
                      <option value="volleyball">Volleyball</option>
                      <option value="lacrosse">Lacrosse</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Age Group</label>
                    <input
                      value={formData.age_group}
                      onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                      placeholder="e.g., U12, U14"
                      className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/60">Season</label>
                  <input
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    placeholder="e.g., Winter 2024"
                    className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/60">Team Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-20 h-10 bg-white/[0.05] border border-white/[0.06] rounded-md cursor-pointer"
                    />
                    <input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreate}
                  className="w-full bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] rounded-md font-medium"
                  disabled={!formData.name}
                >
                  Create Team
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
