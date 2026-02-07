import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Video, Trophy } from "lucide-react";

// Tryout Registration Form Configuration
const TRYOUT_SECTIONS = [
  {
    id: "player",
    label: "Player Information",
    icon: "User",
    fields: [
      {
        id: "player_first_name",
        type: "text",
        label: "Player First Name",
        placeholder: "Enter player's first name",
        required: true,
      },
      {
        id: "player_last_name",
        type: "text",
        label: "Player Last Name",
        placeholder: "Enter player's last name",
        required: true,
      },
      {
        id: "date_of_birth",
        type: "text",
        label: "Date of Birth",
        placeholder: "YYYY-MM-DD",
        required: true,
        hint: "Must meet age requirements for the division",
      },
      {
        id: "gender",
        type: "pills",
        label: "Gender",
        required: true,
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ],
        maxSelect: 1,
      },
      {
        id: "tryout_division",
        type: "select",
        label: "Tryout Division",
        required: true,
        options: [
          { value: "u10_rep", label: "U10 Rep" },
          { value: "u12_rep", label: "U12 Rep" },
          { value: "u14_rep", label: "U14 Rep" },
          { value: "u16_rep", label: "U16 Rep" },
          { value: "u18_rep", label: "U18 Rep" },
        ],
      },
      {
        id: "current_team",
        type: "text",
        label: "Current Team/Club",
        placeholder: "Enter current team name",
        hint: "If currently playing for a team",
      },
      {
        id: "school",
        type: "text",
        label: "School",
        placeholder: "Enter school name",
      },
      {
        id: "grade",
        type: "select",
        label: "Grade",
        options: [
          { value: "3", label: "Grade 3" },
          { value: "4", label: "Grade 4" },
          { value: "5", label: "Grade 5" },
          { value: "6", label: "Grade 6" },
          { value: "7", label: "Grade 7" },
          { value: "8", label: "Grade 8" },
          { value: "9", label: "Grade 9" },
          { value: "10", label: "Grade 10" },
          { value: "11", label: "Grade 11" },
          { value: "12", label: "Grade 12" },
        ],
      },
    ],
  },
  {
    id: "stats",
    label: "Player Stats",
    icon: "BarChart3",
    fields: [
      {
        id: "primary_position",
        type: "cards",
        label: "Primary Position",
        required: true,
        columns: 3,
        options: [
          {
            value: "point_guard",
            label: "Point Guard",
            description: "PG - Floor general",
            icon: "Navigation",
          },
          {
            value: "shooting_guard",
            label: "Shooting Guard",
            description: "SG - Scorer",
            icon: "Target",
          },
          {
            value: "small_forward",
            label: "Small Forward",
            description: "SF - Versatile",
            icon: "Shuffle",
          },
          {
            value: "power_forward",
            label: "Power Forward",
            description: "PF - Inside presence",
            icon: "Shield",
          },
          {
            value: "center",
            label: "Center",
            description: "C - Paint protector",
            icon: "Maximize",
          },
        ],
      },
      {
        id: "secondary_position",
        type: "pills",
        label: "Secondary Position",
        hint: "Select if you can play another position",
        options: [
          { value: "point_guard", label: "PG" },
          { value: "shooting_guard", label: "SG" },
          { value: "small_forward", label: "SF" },
          { value: "power_forward", label: "PF" },
          { value: "center", label: "C" },
        ],
        maxSelect: 1,
      },
      {
        id: "height_feet",
        type: "select",
        label: "Height (Feet)",
        required: true,
        options: [
          { value: "4", label: "4 feet" },
          { value: "5", label: "5 feet" },
          { value: "6", label: "6 feet" },
          { value: "7", label: "7 feet" },
        ],
      },
      {
        id: "height_inches",
        type: "select",
        label: "Height (Inches)",
        required: true,
        options: [
          { value: "0", label: "0 inches" },
          { value: "1", label: "1 inch" },
          { value: "2", label: "2 inches" },
          { value: "3", label: "3 inches" },
          { value: "4", label: "4 inches" },
          { value: "5", label: "5 inches" },
          { value: "6", label: "6 inches" },
          { value: "7", label: "7 inches" },
          { value: "8", label: "8 inches" },
          { value: "9", label: "9 inches" },
          { value: "10", label: "10 inches" },
          { value: "11", label: "11 inches" },
        ],
      },
      {
        id: "years_playing",
        type: "select",
        label: "Years Playing Basketball",
        required: true,
        options: [
          { value: "1", label: "Less than 1 year" },
          { value: "1-2", label: "1-2 years" },
          { value: "3-4", label: "3-4 years" },
          { value: "5-6", label: "5-6 years" },
          { value: "7+", label: "7+ years" },
        ],
      },
      {
        id: "rep_experience",
        type: "cards",
        label: "Rep/Travel Team Experience",
        required: true,
        columns: 2,
        options: [
          {
            value: "none",
            label: "No Rep Experience",
            description: "First time trying out for rep",
            icon: "Star",
          },
          {
            value: "1_year",
            label: "1 Year",
            description: "Played one season of rep",
            icon: "Award",
          },
          {
            value: "2_3_years",
            label: "2-3 Years",
            description: "Multiple rep seasons",
            icon: "Medal",
          },
          {
            value: "4_plus",
            label: "4+ Years",
            description: "Extensive rep experience",
            icon: "Trophy",
          },
        ],
      },
      {
        id: "strengths",
        type: "pills",
        label: "Player Strengths",
        hint: "Select up to 4",
        options: [
          { value: "shooting", label: "Shooting" },
          { value: "ball_handling", label: "Ball Handling" },
          { value: "passing", label: "Passing" },
          { value: "defense", label: "Defense" },
          { value: "rebounding", label: "Rebounding" },
          { value: "athleticism", label: "Athleticism" },
          { value: "basketball_iq", label: "Basketball IQ" },
          { value: "leadership", label: "Leadership" },
        ],
        maxSelect: 4,
      },
    ],
  },
  {
    id: "video",
    label: "Highlight Video",
    icon: "Video",
    fields: [
      {
        id: "video_upload",
        type: "upload",
        label: "Upload Highlight Video",
        accept: "video/*",
        hint: "Upload a highlight video (max 5 minutes, MP4 preferred)",
      },
      {
        id: "video_link",
        type: "text",
        label: "Or Provide Video Link",
        placeholder: "https://youtube.com/watch?v=...",
        hint: "YouTube, Vimeo, or other video hosting link",
      },
      {
        id: "video_description",
        type: "textarea",
        label: "Video Description",
        placeholder: "Describe what's shown in the video (games, skills, etc.)",
      },
      {
        id: "recent_stats",
        type: "textarea",
        label: "Recent Season Stats (Optional)",
        placeholder: "e.g., PPG: 12.5, RPG: 5.2, APG: 3.1",
        hint: "Include any notable statistics from recent seasons",
      },
    ],
  },
  {
    id: "goals",
    label: "Goals & Commitment",
    icon: "Target",
    fields: [
      {
        id: "why_tryout",
        type: "textarea",
        label: "Why Are You Trying Out?",
        placeholder: "Tell us why you want to play rep basketball",
        required: true,
        hint: "What motivates you? What are your basketball goals?",
      },
      {
        id: "commitment_level",
        type: "cards",
        label: "Commitment Level",
        required: true,
        columns: 2,
        options: [
          {
            value: "fully_committed",
            label: "Fully Committed",
            description: "Basketball is my top priority",
            icon: "Flame",
          },
          {
            value: "high",
            label: "High Commitment",
            description: "Will attend most practices/games",
            icon: "TrendingUp",
          },
          {
            value: "moderate",
            label: "Moderate",
            description: "Other activities may conflict occasionally",
            icon: "Scale",
          },
        ],
      },
      {
        id: "known_conflicts",
        type: "textarea",
        label: "Known Schedule Conflicts",
        placeholder: "List any known conflicts (other sports, family vacations, etc.)",
        hint: "Be honest - we understand players have other commitments",
      },
      {
        id: "travel_willing",
        type: "checkboxes",
        label: "Travel Commitment",
        required: true,
        options: [
          {
            value: "tournaments",
            label: "Available for Tournaments",
            description: "Willing to travel for weekend tournaments",
          },
          {
            value: "overnight",
            label: "Available for Overnight Travel",
            description: "Willing to travel for out-of-town tournaments requiring hotel stays",
          },
        ],
      },
      {
        id: "coachable",
        type: "checkboxes",
        label: "Player Commitment",
        required: true,
        options: [
          {
            value: "coachable",
            label: "Open to Coaching",
            description: "Player is receptive to coaching and constructive feedback",
          },
          {
            value: "team_first",
            label: "Team-First Attitude",
            description: "Player prioritizes team success over individual stats",
          },
        ],
      },
    ],
  },
  {
    id: "consent",
    label: "Parent Consent",
    icon: "FileCheck",
    fields: [
      {
        id: "parent_name",
        type: "text",
        label: "Parent/Guardian Name",
        placeholder: "Full name of parent or guardian",
        required: true,
      },
      {
        id: "parent_email",
        type: "text",
        label: "Parent Email",
        placeholder: "parent@example.com",
        required: true,
      },
      {
        id: "parent_phone",
        type: "text",
        label: "Parent Phone",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "emergency_contact",
        type: "text",
        label: "Emergency Contact (if different)",
        placeholder: "Name and phone number",
      },
      {
        id: "tryout_consent",
        type: "checkboxes",
        label: "Tryout Consent",
        required: true,
        options: [
          {
            value: "participation",
            label: "Tryout Participation Consent",
            description: "I give consent for my child to participate in the tryout",
          },
          {
            value: "medical",
            label: "Medical Authorization",
            description: "I authorize emergency medical treatment if needed",
          },
          {
            value: "evaluation",
            label: "Evaluation Consent",
            description: "I understand my child will be evaluated and team placement is not guaranteed",
          },
        ],
      },
      {
        id: "fee_acknowledgment",
        type: "checkboxes",
        label: "Fee Acknowledgment",
        required: true,
        options: [
          {
            value: "tryout_fee",
            label: "Tryout Fee",
            description: "I understand there is a non-refundable tryout fee of $25",
          },
          {
            value: "team_fees",
            label: "Team Fees",
            description: "I understand rep team fees range from $800-$1500 depending on division",
          },
        ],
      },
      {
        id: "parent_signature",
        type: "text",
        label: "Parent/Guardian Signature",
        placeholder: "Type your full legal name",
        required: true,
        hint: "By typing your name, you confirm all information is accurate and consent is given",
      },
      {
        id: "signature_date",
        type: "text",
        label: "Date",
        placeholder: "YYYY-MM-DD",
        required: true,
      },
    ],
  },
];

// Preview Component
function TryoutPreview({ data }) {
  const getPositionLabel = (pos) => {
    const positions = {
      point_guard: "Point Guard",
      shooting_guard: "Shooting Guard",
      small_forward: "Small Forward",
      power_forward: "Power Forward",
      center: "Center",
    };
    return positions[pos] || pos;
  };

  const getHeight = () => {
    if (data.height_feet && data.height_inches) {
      return `${data.height_feet}'${data.height_inches}"`;
    }
    return "---";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Player Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#c9a962]/20 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-[#c9a962]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {data.player_first_name || data.player_last_name
                ? `${data.player_first_name || ""} ${data.player_last_name || ""}`.trim()
                : "Player Name"}
            </h3>
            <p className="text-white/40 text-sm">
              {data.tryout_division?.replace(/_/g, " ").toUpperCase() || "Division"} Tryout
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Position</span>
            <p className="text-white font-medium text-xs">
              {data.primary_position ? getPositionLabel(data.primary_position) : "---"}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Height</span>
            <p className="text-white font-medium">{getHeight()}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">DOB</span>
            <p className="text-white font-medium">{data.date_of_birth || "---"}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Years Playing</span>
            <p className="text-white font-medium">{data.years_playing || "---"}</p>
          </div>
        </div>
      </div>

      {/* Current Team */}
      {data.current_team && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Current Team
          </h4>
          <p className="text-white font-medium">{data.current_team}</p>
        </div>
      )}

      {/* Strengths */}
      {data.strengths?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Player Strengths
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.strengths.map((strength) => (
              <span
                key={strength}
                className="px-3 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-sm font-medium capitalize"
              >
                {strength.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Rep Experience */}
      {data.rep_experience && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Rep Experience
          </h4>
          <p className="text-white font-medium capitalize">
            {data.rep_experience.replace(/_/g, " ")}
          </p>
        </div>
      )}

      {/* Video */}
      {(data.video_upload || data.video_link) && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Video className="w-4 h-4" />
            Highlight Video
          </h4>
          {data.video_link && (
            <a
              href={data.video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c9a962] hover:underline text-sm break-all"
            >
              {data.video_link}
            </a>
          )}
          {data.video_upload && !data.video_link && (
            <p className="text-emerald-400 text-sm">Video uploaded</p>
          )}
        </div>
      )}

      {/* Commitment */}
      {data.commitment_level && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Commitment Level
          </h4>
          <p className="text-white font-medium capitalize">
            {data.commitment_level.replace(/_/g, " ")}
          </p>
        </div>
      )}

      {/* Parent Info */}
      {data.parent_name && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Parent/Guardian
          </h4>
          <p className="text-white font-medium">{data.parent_name}</p>
          <p className="text-white/40 text-sm">{data.parent_email}</p>
          {data.parent_phone && (
            <p className="text-white/40 text-sm">{data.parent_phone}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function TryoutRegistration() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createTryoutMutation = useMutation({
    mutationFn: async (data) => {
      const tryoutData = {
        player_first_name: data.player_first_name,
        player_last_name: data.player_last_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender?.[0],
        tryout_division: data.tryout_division,
        current_team: data.current_team,
        school: data.school,
        grade: data.grade,
        primary_position: data.primary_position,
        secondary_position: data.secondary_position?.[0],
        height: `${data.height_feet}'${data.height_inches}"`,
        years_playing: data.years_playing,
        rep_experience: data.rep_experience,
        strengths: data.strengths,
        video_link: data.video_link,
        video_description: data.video_description,
        recent_stats: data.recent_stats,
        why_tryout: data.why_tryout,
        commitment_level: data.commitment_level,
        known_conflicts: data.known_conflicts,
        travel_willing: data.travel_willing,
        coachable: data.coachable,
        parent_name: data.parent_name,
        parent_email: data.parent_email,
        parent_phone: data.parent_phone,
        emergency_contact: data.emergency_contact,
        tryout_consent: data.tryout_consent,
        fee_acknowledgment: data.fee_acknowledgment,
        parent_signature: data.parent_signature,
        signature_date: data.signature_date,
        status: "registered",
        created_date: new Date().toISOString(),
      };

      return base44.entities.TryoutRegistration.create(tryoutData);
    },
    onSuccess: (newTryout) => {
      localStorage.removeItem("tryout_registration_draft");
      navigate(`/TryoutConfirmation?id=${newTryout.id}`);
    },
  });

  const handleSubmit = (data) => {
    createTryoutMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("tryout_registration_draft", JSON.stringify(data));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("tryout_registration_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Rep Team Tryout Registration"
        subtitle="Register for competitive rep team tryouts"
        sections={TRYOUT_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={TryoutPreview}
        submitLabel={createTryoutMutation.isPending ? "Registering..." : "Submit Registration"}
        skipLabel="Save as Draft"
        defaultMode="form"
      />
    </div>
  );
}
