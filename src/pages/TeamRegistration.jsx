import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Users, Trophy, Calendar, DollarSign, FileText } from "lucide-react";

// Team Registration Form Configuration
const TEAM_SECTIONS = [
  {
    id: "basics",
    label: "Team Information",
    icon: "Users",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Team Name",
        placeholder: "Toronto Thunder",
        required: true,
        hint: "Choose a unique name that represents your team",
      },
      {
        id: "division",
        type: "select",
        label: "Division",
        required: true,
        options: [
          { value: "u10", label: "U10 (Under 10)" },
          { value: "u12", label: "U12 (Under 12)" },
          { value: "u14", label: "U14 (Under 14)" },
          { value: "u16", label: "U16 (Under 16)" },
          { value: "u18", label: "U18 (Under 18)" },
          { value: "adult", label: "Adult (18+)" },
          { value: "senior", label: "Senior (35+)" },
        ],
      },
      {
        id: "skill_level",
        type: "pills",
        label: "Skill Level",
        required: true,
        options: ["Recreational", "Competitive", "Elite", "Development"],
        maxSelect: 1,
      },
      {
        id: "gender",
        type: "pills",
        label: "Team Gender",
        required: true,
        options: ["Boys", "Girls", "Co-ed"],
        maxSelect: 1,
      },
    ],
  },
  {
    id: "season",
    label: "Season & League",
    icon: "Trophy",
    fields: [
      {
        id: "season",
        type: "select",
        label: "Season",
        required: true,
        options: [
          { value: "spring2026", label: "Spring 2026" },
          { value: "summer2026", label: "Summer 2026" },
          { value: "fall2026", label: "Fall 2026" },
          { value: "winter2026", label: "Winter 2026-27" },
        ],
      },
      {
        id: "league_type",
        type: "cards",
        label: "League Type",
        required: true,
        columns: 3,
        options: [
          {
            value: "house",
            label: "House League",
            description: "Recreational play, emphasis on fun and development",
            icon: "Home",
          },
          {
            value: "rep",
            label: "Rep League",
            description: "Competitive play with tryouts and travel",
            icon: "Trophy",
          },
          {
            value: "tournament",
            label: "Tournament Only",
            description: "Weekend tournaments without regular season",
            icon: "Award",
          },
        ],
      },
      {
        id: "preferred_days",
        type: "pills",
        label: "Preferred Practice Days",
        hint: "Select all days that work for your team",
        options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
    ],
  },
  {
    id: "coaching",
    label: "Coaching Staff",
    icon: "Users",
    fields: [
      {
        id: "head_coach_name",
        type: "text",
        label: "Head Coach Name",
        placeholder: "John Smith",
        required: true,
      },
      {
        id: "head_coach_email",
        type: "text",
        label: "Head Coach Email",
        placeholder: "coach@example.com",
        required: true,
      },
      {
        id: "head_coach_phone",
        type: "text",
        label: "Head Coach Phone",
        placeholder: "(416) 555-0123",
      },
      {
        id: "assistant_coaches",
        type: "textarea",
        label: "Assistant Coaches",
        placeholder: "List assistant coach names, one per line",
        hint: "Optional - can be added later",
      },
      {
        id: "coaching_certifications",
        type: "checkboxes",
        label: "Coaching Certifications",
        hint: "Check all that apply to your coaching staff",
        columns: 2,
        options: [
          { value: "nccp", label: "NCCP Certified", description: "National Coaching Certification" },
          { value: "first_aid", label: "First Aid", description: "Current first aid certification" },
          { value: "police_check", label: "Police Check", description: "Background check completed" },
          { value: "concussion", label: "Concussion Training", description: "Rowan's Law training" },
        ],
      },
    ],
  },
  {
    id: "registration",
    label: "Registration Details",
    icon: "FileText",
    fields: [
      {
        id: "expected_roster_size",
        type: "select",
        label: "Expected Roster Size",
        required: true,
        options: [
          { value: "8-10", label: "8-10 players" },
          { value: "10-12", label: "10-12 players" },
          { value: "12-15", label: "12-15 players" },
          { value: "15+", label: "15+ players" },
        ],
      },
      {
        id: "registration_type",
        type: "cards",
        label: "Registration Type",
        required: true,
        columns: 2,
        options: [
          {
            value: "team",
            label: "Team Registration",
            description: "Register the entire team at once",
            icon: "Users",
          },
          {
            value: "individual",
            label: "Individual Players",
            description: "Players register individually and get assigned",
            icon: "User",
          },
        ],
      },
      {
        id: "special_requests",
        type: "textarea",
        label: "Special Requests or Notes",
        placeholder: "Any accommodations, scheduling conflicts, or other notes...",
        hint: "Optional - share anything we should know",
      },
      {
        id: "terms_accepted",
        type: "checkboxes",
        label: "Terms & Agreements",
        required: true,
        options: [
          { value: "code_of_conduct", label: "Code of Conduct", description: "I agree to the league code of conduct" },
          { value: "photo_release", label: "Photo Release", description: "I consent to team photos being used for promotion" },
          { value: "liability_waiver", label: "Liability Waiver", description: "I acknowledge the risks of participation" },
        ],
      },
    ],
  },
];

// Preview Component
function TeamPreview({ data }) {
  return (
    <div className="p-6 space-y-6">
      {/* Team Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#c9a962]/20 flex items-center justify-center">
            <Users className="w-8 h-8 text-[#c9a962]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {data.name || "Team Name"}
            </h3>
            <p className="text-white/40 text-sm">
              {data.division ? data.division.toUpperCase() : "Division"} • {data.skill_level?.[0] || "Skill Level"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Gender</span>
            <p className="text-white font-medium">{data.gender?.[0] || "—"}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Season</span>
            <p className="text-white font-medium">{data.season || "—"}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">League</span>
            <p className="text-white font-medium capitalize">{data.league_type || "—"}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Roster</span>
            <p className="text-white font-medium">{data.expected_roster_size || "—"}</p>
          </div>
        </div>
      </div>

      {/* Coach Info */}
      {data.head_coach_name && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Head Coach
          </h4>
          <p className="text-white font-medium">{data.head_coach_name}</p>
          <p className="text-white/40 text-sm">{data.head_coach_email}</p>
          {data.head_coach_phone && (
            <p className="text-white/40 text-sm">{data.head_coach_phone}</p>
          )}
        </div>
      )}

      {/* Practice Days */}
      {data.preferred_days?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Practice Days
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.preferred_days.map((day) => (
              <span
                key={day}
                className="px-3 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-sm font-medium"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.coaching_certifications?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Certifications
          </h4>
          <div className="space-y-2">
            {data.coaching_certifications.map((cert) => (
              <div key={cert} className="flex items-center gap-2 text-emerald-400 text-sm">
                <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  ✓
                </div>
                <span className="capitalize">{cert.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeamRegistration() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createTeamMutation = useMutation({
    mutationFn: async (data) => {
      // Transform form data to team entity structure
      const teamData = {
        name: data.name,
        division: data.division,
        skill_level: data.skill_level?.[0],
        gender: data.gender?.[0],
        season: data.season,
        league_type: data.league_type,
        head_coach_name: data.head_coach_name,
        head_coach_email: data.head_coach_email,
        head_coach_phone: data.head_coach_phone,
        assistant_coaches: data.assistant_coaches,
        expected_roster_size: data.expected_roster_size,
        registration_type: data.registration_type,
        preferred_practice_days: data.preferred_days,
        coaching_certifications: data.coaching_certifications,
        special_requests: data.special_requests,
        terms_accepted: data.terms_accepted,
        status: "pending",
        created_date: new Date().toISOString(),
      };

      return base44.entities.Team.create(teamData);
    },
    onSuccess: (newTeam) => {
      navigate(`/TeamDetail?id=${newTeam.id}`);
    },
  });

  const handleSubmit = (data) => {
    createTeamMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    // Auto-save to localStorage for recovery
    localStorage.setItem("team_registration_draft", JSON.stringify(data));
  };

  // Load draft from localStorage
  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("team_registration_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Team Registration"
        subtitle="Register your team for the upcoming season"
        sections={TEAM_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={TeamPreview}
        submitLabel={createTeamMutation.isPending ? "Registering..." : "Register Team"}
        skipLabel="Save as Draft"
        defaultMode="form"
      />
    </div>
  );
}
