'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Upload, Save, Trash2 } from 'lucide-react';

/* ---------- Types ---------- */
interface PlayerFormData {
  first_name: string;
  last_name: string;
  jersey_number: string;
  position: string;
  height: string;
  weight: string;
  date_of_birth: string;
  bio: string;
  status: string;
  team_id: string;
  photo_url: string;
}

interface Team {
  id: string;
  team_name: string;
  division: string;
  team_color?: string;
}

interface PlayerData extends PlayerFormData {
  id: string;
  career_games?: number;
  career_points?: number;
  career_rebounds?: number;
  career_assists?: number;
}

const POSITIONS = [
  { value: 'PG', label: 'Point Guard (PG)' },
  { value: 'SG', label: 'Shooting Guard (SG)' },
  { value: 'SF', label: 'Small Forward (SF)' },
  { value: 'PF', label: 'Power Forward (PF)' },
  { value: 'C', label: 'Center (C)' },
];

const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'injured', label: 'Injured' },
  { value: 'inactive', label: 'Inactive' },
];

/* ---------- Component ---------- */
export function PlayerManagementPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerId = searchParams.get('playerId');
  const teamId = searchParams.get('teamId');
  const isNew = !playerId;

  const [formData, setFormData] = useState<PlayerFormData>({
    first_name: '', last_name: '', jersey_number: '', position: 'PG',
    height: '', weight: '', date_of_birth: '', bio: '', status: 'active',
    team_id: teamId || '', photo_url: '',
  });

  const { data: player = null } = useQuery<PlayerData | null>({
    queryKey: ['player-manage', playerId],
    queryFn: async () => {
      if (!playerId) return null;
      const res = await fetch(`/api/players/${playerId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!playerId,
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['teams-for-player'],
    queryFn: async () => {
      const res = await fetch('/api/teams?sport=basketball');
      if (!res.ok) return [];
      return res.json();
    },
  });

  useEffect(() => {
    if (player) {
      setFormData({
        first_name: player.first_name || '', last_name: player.last_name || '',
        jersey_number: player.jersey_number || '', position: player.position || 'PG',
        height: player.height || '', weight: player.weight || '',
        date_of_birth: player.date_of_birth || '', bio: player.bio || '',
        status: player.status || 'active', team_id: player.team_id || '',
        photo_url: player.photo_url || '',
      });
    }
  }, [player]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // TODO: POST/PUT /api/players
    router.back();
  };

  const currentTeam = teams.find((t) => t.id === formData.team_id);

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <button onClick={() => router.back()} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md" style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)', background: '#0f0f0f' }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white/90">{isNew ? 'Add Player' : 'Edit Player'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Photo */}
          <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl" style={{ background: '#0f0f0f', boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)' }}>
            <h2 className="text-base md:text-lg font-semibold text-white/70 mb-3 md:mb-4">Photo</h2>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold text-white" style={{ background: currentTeam?.team_color || '#666', boxShadow: '4px 4px 8px rgba(0,0,0,0.15)' }}>
                {formData.jersey_number || '?'}
              </div>
              <label className="cursor-pointer">
                <div className="px-4 py-3 min-h-[44px] rounded-xl flex items-center gap-2" style={{ background: '#0f0f0f', boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)' }}>
                  <Upload className="w-4 h-4" /><span className="text-sm">Upload Photo</span>
                </div>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl" style={{ background: '#0f0f0f', boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)' }}>
            <h2 className="text-base md:text-lg font-semibold text-white/70 mb-3 md:mb-4">Basic Information</h2>
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium text-white/60 mb-1 block">First Name *</label>
                  <input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required className="w-full bg-white/[0.07] rounded-md px-3 min-h-[44px] text-white border-0 outline-none" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-white/60 mb-1 block">Last Name *</label>
                  <input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required className="w-full bg-white/[0.07] rounded-md px-3 min-h-[44px] text-white border-0 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium text-white/60 mb-1 block">Jersey #</label>
                  <input type="number" min="0" max="99" value={formData.jersey_number} onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })} className="w-full bg-white/[0.07] rounded-md px-3 min-h-[44px] text-white border-0 outline-none" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-white/60 mb-1 block">Position</label>
                  <select value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full bg-white/[0.07] rounded-md px-3 min-h-[44px] text-white border-0 outline-none">
                    {POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs md:text-sm font-medium text-white/60 mb-1 block">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-white/[0.07] rounded-md px-3 min-h-[44px] text-white border-0 outline-none">
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium text-white/60 mb-1 block">Height</label>
                  <input value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} placeholder="e.g., 6'2&quot;" className="w-full bg-white/[0.07] rounded-md px-3 min-h-[44px] text-white border-0 outline-none placeholder-white/30" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-white/60 mb-1 block">Weight</label>
                  <input value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="e.g., 185 lbs" className="w-full bg-white/[0.07] rounded-md px-3 min-h-[44px] text-white border-0 outline-none placeholder-white/30" />
                </div>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-white/60 mb-1 block">Date of Birth</label>
                <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} className="w-full bg-white/[0.07] rounded-md px-3 min-h-[44px] text-white border-0 outline-none" />
              </div>
            </div>
          </div>

          {/* Team Assignment */}
          <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl" style={{ background: '#0f0f0f', boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)' }}>
            <h2 className="text-base md:text-lg font-semibold text-white/70 mb-3 md:mb-4">Team Assignment</h2>
            <select value={formData.team_id || 'none'} onChange={(e) => setFormData({ ...formData, team_id: e.target.value === 'none' ? '' : e.target.value })} className="w-full bg-white/[0.07] rounded-md px-3 min-h-[44px] text-white border-0 outline-none">
              <option value="none">No Team</option>
              {teams.map((team) => <option key={team.id} value={team.id}>{team.team_name} - {team.division}</option>)}
            </select>
          </div>

          {/* Bio */}
          <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl" style={{ background: '#0f0f0f', boxShadow: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)' }}>
            <h2 className="text-base md:text-lg font-semibold text-white/70 mb-3 md:mb-4">Biography</h2>
            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Player biography..." rows={4} className="w-full p-3 rounded-xl bg-white/[0.07] border-0 text-sm md:text-base min-h-[100px] text-white outline-none placeholder-white/30" />
          </div>

          {/* Career Stats (read-only if editing) */}
          {!isNew && player && (
            <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl" style={{ background: '#0f0f0f', boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)' }}>
              <h2 className="text-base md:text-lg font-semibold text-white/70 mb-3 md:mb-4">Career Statistics</h2>
              <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
                {[
                  { value: player.career_games || 0, label: 'Games' },
                  { value: player.career_points || 0, label: 'Points' },
                  { value: player.career_rebounds || 0, label: 'Rebounds' },
                  { value: player.career_assists || 0, label: 'Assists' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-xl md:text-2xl font-bold text-white/90">{s.value}</div>
                    <div className="text-[10px] md:text-xs text-white/40">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            {!isNew && (
              <button type="button" className="text-red-600 border border-red-300 min-h-[44px] rounded-md flex items-center justify-center gap-2 px-4 order-3 sm:order-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
            <button type="button" onClick={() => router.back()} className="flex-1 border border-white/[0.06] min-h-[44px] rounded-md text-white/70 order-2">Cancel</button>
            <button type="submit" className="flex-1 min-h-[44px] rounded-md flex items-center justify-center gap-2 font-medium order-1 sm:order-3" style={{ backgroundColor: '#c9a962', color: '#0f0f0f', boxShadow: '4px 4px 12px rgba(0,0,0,0.2)' }}>
              <Save className="w-4 h-4" /> Save Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
