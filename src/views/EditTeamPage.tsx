'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Plus, Trash2, AlertCircle } from 'lucide-react';

interface PlayerEntry {
  _id: string;
  first_name: string;
  last_name: string;
  number: string;
  position: string;
  height: string;
}

interface StaffEntry {
  _id: string;
  name: string;
  title: string;
}

interface TeamData {
  team_name: string;
  division: string;
  team_color: string;
  logo_url: string;
  roster: PlayerEntry[];
  staff: StaffEntry[];
}

export function EditTeamPage(): React.ReactElement {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoading = false;

  useEffect(() => {
    void (async (): Promise<void> => {
      try {
        const res = await fetch(`/api/teams/${teamId}`);
        if (!res.ok) throw new Error('Failed to fetch team');
        const data = await res.json();
        setTeamData({
          team_name: data.name ?? data.team_name ?? '',
          division: data.division ?? '',
          team_color: data.color ?? data.team_color ?? '#000000',
          logo_url: data.logo_url ?? '',
          roster: data.roster ?? [],
          staff: data.staff ?? [],
        });
      } catch {
        setTeamData({
          team_name: '',
          division: '',
          team_color: '#000000',
          logo_url: '',
          roster: [],
          staff: [],
        });
      }
    })();
  }, [teamId]);

  if (isLoading || !teamData) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-xl text-white/60">Loading team...</div>
      </div>
    );
  }

  const addPlayer = (): void => {
    setTeamData({
      ...teamData,
      roster: [...teamData.roster, { _id: crypto.randomUUID(), first_name: '', last_name: '', number: '', position: 'PG', height: '' }],
    });
  };

  const removePlayer = (id: string): void => {
    setTeamData({ ...teamData, roster: teamData.roster.filter((p) => p._id !== id) });
  };

  const updatePlayer = (id: string, field: string, value: string): void => {
    setTeamData({
      ...teamData,
      roster: teamData.roster.map((p) => (p._id === id ? { ...p, [field]: value } : p)),
    });
  };

  const addStaff = (): void => {
    setTeamData({
      ...teamData,
      staff: [...teamData.staff, { _id: crypto.randomUUID(), name: '', title: '' }],
    });
  };

  const removeStaff = (id: string): void => {
    setTeamData({ ...teamData, staff: teamData.staff.filter((s) => s._id !== id) });
  };

  const updateStaff = (id: string, field: string, value: string): void => {
    setTeamData({
      ...teamData,
      staff: teamData.staff.map((s) => (s._id === id ? { ...s, [field]: value } : s)),
    });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // TODO: PUT /api/teams/${teamId}
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(`/teams/${teamId}/management`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 md:gap-4 mb-6">
          <Link
            href={`/teams/${teamId}/management`}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md"
            style={{ boxShadow: '0 10px 26px rgba(0,0,0,.10)', background: '#1a1a1a' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white/90">Edit Team</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Team Info */}
          <div className="p-4 md:p-6 rounded-3xl" style={{ background: '#1a1a1a', boxShadow: '0 10px 26px rgba(0,0,0,.10)' }}>
            <h2 className="text-lg md:text-xl font-semibold text-white/70 mb-4">Team Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Team Name</label>
                <input
                  value={teamData.team_name}
                  onChange={(e) => setTeamData({ ...teamData, team_name: e.target.value })}
                  required
                  className="w-full bg-white/[0.07] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Division</label>
                <input
                  value={teamData.division}
                  onChange={(e) => setTeamData({ ...teamData, division: e.target.value })}
                  required
                  className="w-full bg-white/[0.07] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Team Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={teamData.team_color} onChange={(e) => setTeamData({ ...teamData, team_color: e.target.value })} className="w-16 h-10 rounded-lg cursor-pointer" />
                  <input
                    value={teamData.team_color}
                    onChange={(e) => setTeamData({ ...teamData, team_color: e.target.value })}
                    className="flex-1 bg-white/[0.07] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Roster */}
          <div className="p-4 md:p-6 rounded-3xl" style={{ background: '#1a1a1a', boxShadow: '0 10px 26px rgba(0,0,0,.10)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-white/70">Roster</h2>
              <button type="button" onClick={addPlayer} className="flex items-center gap-2 min-h-[44px] px-3 rounded-md" style={{ background: '#10b981', color: 'white' }}>
                <Plus className="w-4 h-4" /> Add Player
              </button>
            </div>
            <div className="space-y-4">
              {teamData.roster.map((player) => (
                <div key={player._id} className="p-3 md:p-4 rounded-2xl" style={{ background: '#1a1a1a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
                    <input placeholder="First Name" value={player.first_name} onChange={(e) => updatePlayer(player._id, 'first_name', e.target.value)} className="bg-white/[0.07] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]" />
                    <input placeholder="Last Name" value={player.last_name} onChange={(e) => updatePlayer(player._id, 'last_name', e.target.value)} className="bg-white/[0.07] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]" />
                    <input placeholder="#" type="number" min="0" max="99" value={player.number} onChange={(e) => updatePlayer(player._id, 'number', e.target.value)} className="bg-white/[0.07] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]" />
                    <select value={player.position} onChange={(e) => updatePlayer(player._id, 'position', e.target.value)} className="bg-white/[0.07] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]">
                      <option value="PG">PG</option><option value="SG">SG</option><option value="SF">SF</option><option value="PF">PF</option><option value="C">C</option>
                    </select>
                    <input placeholder="Height" value={player.height} onChange={(e) => updatePlayer(player._id, 'height', e.target.value)} className="bg-white/[0.07] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]" />
                    <button type="button" onClick={() => removePlayer(player._id)} className="text-red-500 min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff */}
          <div className="p-4 md:p-6 rounded-3xl" style={{ background: '#1a1a1a', boxShadow: '0 10px 26px rgba(0,0,0,.10)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-white/70">Coaching Staff</h2>
              <button type="button" onClick={addStaff} className="flex items-center gap-2 min-h-[44px] px-3 rounded-md" style={{ background: '#10b981', color: 'white' }}>
                <Plus className="w-4 h-4" /> Add Staff
              </button>
            </div>
            <div className="space-y-4">
              {teamData.staff.map((member) => (
                <div key={member._id} className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  <input placeholder="Name" value={member.name} onChange={(e) => updateStaff(member._id, 'name', e.target.value)} className="bg-white/[0.07] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]" />
                  <input placeholder="Title" value={member.title} onChange={(e) => updateStaff(member._id, 'title', e.target.value)} className="bg-white/[0.07] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]" />
                  <button type="button" onClick={() => removeStaff(member._id)} className="text-red-500 min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link href={`/teams/${teamId}/management`} className="flex-1 min-h-[44px] border border-white/[0.06] rounded-md flex items-center justify-center">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="flex-1 min-h-[44px] rounded-md" style={{ background: '#10b981', color: 'white' }}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
