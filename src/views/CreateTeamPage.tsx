'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Upload, AlertCircle } from 'lucide-react';

interface PlayerEntry {
  _id: string;
  first_name: string;
  last_name: string;
  jersey_number: string;
  position: string;
  height: string;
}

interface StaffEntry {
  _id: string;
  name: string;
  title: string;
}

export function CreateTeamPage(): React.ReactElement {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [division, setDivision] = useState('');
  const [teamColor, setTeamColor] = useState('#000435');
  const [logoUrl, setLogoUrl] = useState('');
  const [roster, setRoster] = useState<PlayerEntry[]>([
    { _id: crypto.randomUUID(), first_name: '', last_name: '', jersey_number: '', position: 'PG', height: '' },
  ]);
  const [staff, setStaff] = useState<StaffEntry[]>([
    { _id: crypto.randomUUID(), name: '', title: 'Head Coach' },
  ]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPlayer = (): void => {
    setRoster([...roster, { _id: crypto.randomUUID(), first_name: '', last_name: '', jersey_number: '', position: 'PG', height: '' }]);
  };

  const handleRemovePlayer = (id: string): void => {
    setRoster(roster.filter((p) => p._id !== id));
  };

  const handlePlayerChange = (id: string, field: string, value: string): void => {
    setRoster(roster.map((p) => (p._id === id ? { ...p, [field]: value } : p)));
    if (validationErrors[`player_${id}_${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`player_${id}_${field}`];
      setValidationErrors(newErrors);
    }
  };

  const handleAddStaff = (): void => {
    setStaff([...staff, { _id: crypto.randomUUID(), name: '', title: 'Assistant Coach' }]);
  };

  const handleRemoveStaff = (id: string): void => {
    setStaff(staff.filter((s) => s._id !== id));
  };

  const handleStaffChange = (id: string, field: string, value: string): void => {
    setStaff(staff.map((s) => (s._id === id ? { ...s, [field]: value } : s)));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // TODO: POST /api/teams with teamData + roster + staff
    setIsSubmitting(true);
    setTimeout(() => {
      router.push('/teams/list');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Link
            href="/teams/list"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md"
            style={{ boxShadow: '0 10px 26px rgba(0,0,0,.10)', background: '#1a1a1a' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white/90">Create Team</h1>
            <p className="text-sm md:text-base text-white/60">Set up a new basketball team</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Team Info */}
          <div className="p-4 md:p-6 rounded-3xl" style={{ background: '#1a1a1a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}>
            <h2 className="text-lg md:text-xl font-bold text-white/70 mb-4">Team Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Team Name *</label>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Division *</label>
                <input
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-white/60 mb-2 block">Team Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={teamColor} onChange={(e) => setTeamColor(e.target.value)} className="w-16 h-10 rounded-lg cursor-pointer" />
                  <input
                    value={teamColor}
                    onChange={(e) => setTeamColor(e.target.value)}
                    className="flex-1 bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Roster */}
          <div className="p-4 md:p-6 rounded-3xl" style={{ background: '#1a1a1a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white/70">Roster</h2>
              <button
                type="button"
                onClick={handleAddPlayer}
                className="min-h-[44px] px-3 rounded-md flex items-center gap-1 text-sm"
                style={{ background: '#c9a962', color: 'white' }}
              >
                <Plus className="w-4 h-4" />
                Add Player
              </button>
            </div>
            <div className="space-y-4">
              {roster.map((player) => (
                <div key={player._id} className="grid grid-cols-2 md:grid-cols-6 gap-2 items-start">
                  <input
                    value={player.first_name}
                    onChange={(e) => handlePlayerChange(player._id, 'first_name', e.target.value)}
                    placeholder="First Name"
                    className="bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  />
                  <input
                    value={player.last_name}
                    onChange={(e) => handlePlayerChange(player._id, 'last_name', e.target.value)}
                    placeholder="Last Name"
                    className="bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={player.jersey_number}
                    onChange={(e) => handlePlayerChange(player._id, 'jersey_number', e.target.value)}
                    placeholder="#"
                    className="bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  />
                  <select
                    value={player.position}
                    onChange={(e) => handlePlayerChange(player._id, 'position', e.target.value)}
                    className="bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  >
                    <option value="PG">PG</option>
                    <option value="SG">SG</option>
                    <option value="SF">SF</option>
                    <option value="PF">PF</option>
                    <option value="C">C</option>
                  </select>
                  <input
                    value={player.height}
                    onChange={(e) => handlePlayerChange(player._id, 'height', e.target.value)}
                    placeholder="Height"
                    className="bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player._id)}
                    disabled={roster.length === 1}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/40 hover:text-red-400 disabled:opacity-30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Staff */}
          <div className="p-4 md:p-6 rounded-3xl" style={{ background: '#1a1a1a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white/70">Staff</h2>
              <button
                type="button"
                onClick={handleAddStaff}
                className="min-h-[44px] px-3 rounded-md flex items-center gap-1 text-sm"
                style={{ background: '#c9a962', color: 'white' }}
              >
                <Plus className="w-4 h-4" />
                Add Staff
              </button>
            </div>
            <div className="space-y-3">
              {staff.map((member) => (
                <div key={member._id} className="grid grid-cols-2 md:grid-cols-3 gap-2 items-start">
                  <input
                    value={member.name}
                    onChange={(e) => handleStaffChange(member._id, 'name', e.target.value)}
                    placeholder="Name"
                    className="bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  />
                  <input
                    value={member.title}
                    onChange={(e) => handleStaffChange(member._id, 'title', e.target.value)}
                    placeholder="Title"
                    className="bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStaff(member._id)}
                    disabled={staff.length === 1}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/40 hover:text-red-400 disabled:opacity-30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/teams/list" className="flex-1 min-h-[44px] border border-white/[0.06] rounded-md flex items-center justify-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 min-h-[44px] font-semibold rounded-md"
              style={{ background: '#c9a962', color: 'white' }}
            >
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
