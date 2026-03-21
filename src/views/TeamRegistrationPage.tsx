'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';

interface FormData {
  name: string;
  division: string;
  skill_level: string[];
  gender: string[];
  season: string;
  league_type: string;
  head_coach_name: string;
  head_coach_email: string;
  head_coach_phone: string;
  preferred_days: string[];
  expected_roster_size: string;
  [key: string]: unknown;
}

export function TeamRegistrationPage(): React.ReactElement {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    division: '',
    skill_level: [],
    gender: [],
    season: '',
    league_type: '',
    head_coach_name: '',
    head_coach_email: '',
    head_coach_phone: '',
    preferred_days: [],
    expected_roster_size: '',
  });

  const initialData = useMemo(() => {
    try {
      const draft = localStorage.getItem('team_registration_draft');
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  const handleSubmit = (): void => {
    // TODO: POST /api/teams/register
    router.push('/teams');
  };

  const handleSave = (): void => {
    localStorage.setItem('team_registration_draft', JSON.stringify(formData));
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Team Registration</h1>
          <p className="text-sm md:text-base text-white/40">Register your team for the upcoming season</p>
        </div>

        {/* Preview Card */}
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4 md:p-6 mb-6">
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-[#c9a962]/20 flex items-center justify-center">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-[#c9a962]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-white truncate">{formData.name || 'Team Name'}</h3>
              <p className="text-white/40 text-xs md:text-sm">
                {formData.division ? formData.division.toUpperCase() : 'Division'} - {formData.skill_level?.[0] || 'Skill Level'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Team Info */}
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Team Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Team Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Toronto Thunder"
                  className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Division *</label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  >
                    <option value="">Select</option>
                    <option value="u10">U10</option>
                    <option value="u12">U12</option>
                    <option value="u14">U14</option>
                    <option value="u16">U16</option>
                    <option value="u18">U18</option>
                    <option value="adult">Adult</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Season *</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                  >
                    <option value="">Select</option>
                    <option value="spring2026">Spring 2026</option>
                    <option value="summer2026">Summer 2026</option>
                    <option value="fall2026">Fall 2026</option>
                    <option value="winter2026">Winter 2026-27</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Coaching */}
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Coaching Staff</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Head Coach Name *</label>
                <input
                  value={formData.head_coach_name}
                  onChange={(e) => setFormData({ ...formData, head_coach_name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Head Coach Email *</label>
                <input
                  value={formData.head_coach_email}
                  onChange={(e) => setFormData({ ...formData, head_coach_email: e.target.value })}
                  placeholder="coach@example.com"
                  className="w-full bg-white/[0.05] border border-white/[0.06] rounded-md px-3 py-2 text-white min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              className="flex-1 border border-white/[0.06] min-h-[44px] rounded-md font-medium hover:bg-white/[0.05]"
            >
              Save as Draft
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] rounded-md font-medium"
              disabled={!formData.name}
            >
              Register Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
