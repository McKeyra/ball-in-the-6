import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { User, Award, CheckCircle } from "lucide-react";

// Coach Registration Form Configuration
const COACH_SECTIONS = [
  {
    id: "personal_info",
    label: "Personal Information",
    icon: "User",
    fields: [
      {
        id: "first_name",
        type: "text",
        label: "First Name",
        placeholder: "Enter your first name",
        required: true,
      },
      {
        id: "last_name",
        type: "text",
        label: "Last Name",
        placeholder: "Enter your last name",
        required: true,
      },
      {
        id: "email",
        type: "text",
        label: "Email Address",
        placeholder: "coach@example.com",
        required: true,
      },
      {
        id: "phone",
        type: "text",
        label: "Phone Number",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "address",
        type: "text",
        label: "Address",
        placeholder: "Street address",
      },
      {
        id: "city",
        type: "text",
        label: "City",
        placeholder: "Toronto",
      },
      {
        id: "photo",
        type: "upload",
        label: "Profile Photo",
        accept: "image/*",
        hint: "Upload a professional photo for your coaching profile",
      },
    ],
  },
  {
    id: "experience",
    label: "Coaching Experience",
    icon: "Briefcase",
    fields: [
      {
        id: "years_coaching",
        type: "select",
        label: "Years of Coaching Experience",
        required: true,
        options: [
          { value: "0", label: "No previous experience" },
          { value: "1-2", label: "1-2 years" },
          { value: "3-5", label: "3-5 years" },
          { value: "6-10", label: "6-10 years" },
          { value: "10+", label: "10+ years" },
        ],
      },
      {
        id: "levels_coached",
        type: "pills",
        label: "Levels Coached",
        hint: "Select all that apply",
        options: [
          { value: "recreational", label: "Recreational" },
          { value: "house_league", label: "House League" },
          { value: "rep", label: "Rep/Travel" },
          { value: "high_school", label: "High School" },
          { value: "college", label: "College/University" },
          { value: "professional", label: "Professional" },
        ],
      },
      {
        id: "age_groups",
        type: "pills",
        label: "Age Groups Coached",
        hint: "Select all that apply",
        options: [
          { value: "u8", label: "U8" },
          { value: "u10", label: "U10" },
          { value: "u12", label: "U12" },
          { value: "u14", label: "U14" },
          { value: "u16", label: "U16" },
          { value: "u18", label: "U18" },
          { value: "adult", label: "Adult" },
        ],
      },
      {
        id: "previous_teams",
        type: "textarea",
        label: "Previous Teams/Organizations",
        placeholder: "List teams or organizations you've coached for",
        hint: "Include team names, years, and your role",
      },
      {
        id: "playing_experience",
        type: "textarea",
        label: "Playing Experience",
        placeholder: "Describe your basketball playing background",
      },
      {
        id: "coaching_philosophy",
        type: "textarea",
        label: "Coaching Philosophy",
        placeholder: "Describe your approach to coaching and player development",
        required: true,
      },
    ],
  },
  {
    id: "certifications",
    label: "Certifications",
    icon: "Award",
    fields: [
      {
        id: "nccp_level",
        type: "select",
        label: "NCCP Certification Level",
        options: [
          { value: "none", label: "No NCCP Certification" },
          { value: "community_initiation", label: "Community Initiation" },
          { value: "community_development", label: "Community Development" },
          { value: "competition_introduction", label: "Competition - Introduction" },
          { value: "competition_development", label: "Competition - Development" },
          { value: "competition_high_performance", label: "Competition - High Performance" },
        ],
      },
      {
        id: "nccp_number",
        type: "text",
        label: "NCCP Number",
        placeholder: "Enter your NCCP number if applicable",
      },
      {
        id: "first_aid",
        type: "cards",
        label: "First Aid Certification",
        columns: 2,
        options: [
          {
            value: "current",
            label: "Currently Certified",
            description: "Valid first aid certification",
            icon: "CheckCircle",
          },
          {
            value: "expired",
            label: "Expired",
            description: "Willing to recertify",
            icon: "Clock",
          },
          {
            value: "none",
            label: "Not Certified",
            description: "Willing to obtain",
            icon: "AlertCircle",
          },
        ],
      },
      {
        id: "first_aid_expiry",
        type: "text",
        label: "First Aid Expiry Date",
        placeholder: "YYYY-MM-DD",
        hint: "If currently certified",
      },
      {
        id: "other_certifications",
        type: "textarea",
        label: "Other Certifications",
        placeholder: "List any other relevant certifications",
        hint: "e.g., CPR, AED, Rowan's Law training, Safe Sport",
      },
      {
        id: "background_check_consent",
        type: "checkboxes",
        label: "Background Check",
        required: true,
        options: [
          {
            value: "consent",
            label: "Background Check Consent",
            description: "I consent to a vulnerable sector background check as required for coaching",
          },
        ],
      },
    ],
  },
  {
    id: "availability",
    label: "Availability",
    icon: "Calendar",
    fields: [
      {
        id: "available_days",
        type: "pills",
        label: "Available Days",
        required: true,
        hint: "Select all days you can coach",
        options: [
          { value: "monday", label: "Monday" },
          { value: "tuesday", label: "Tuesday" },
          { value: "wednesday", label: "Wednesday" },
          { value: "thursday", label: "Thursday" },
          { value: "friday", label: "Friday" },
          { value: "saturday", label: "Saturday" },
          { value: "sunday", label: "Sunday" },
        ],
      },
      {
        id: "available_times",
        type: "pills",
        label: "Available Times",
        hint: "Select all time slots that work",
        options: [
          { value: "morning", label: "Morning (8am-12pm)" },
          { value: "afternoon", label: "Afternoon (12pm-5pm)" },
          { value: "evening", label: "Evening (5pm-9pm)" },
        ],
      },
      {
        id: "seasons",
        type: "pills",
        label: "Seasons Available",
        required: true,
        options: [
          { value: "fall", label: "Fall" },
          { value: "winter", label: "Winter" },
          { value: "spring", label: "Spring" },
          { value: "summer", label: "Summer" },
        ],
      },
      {
        id: "commitment_level",
        type: "cards",
        label: "Commitment Level",
        required: true,
        columns: 2,
        options: [
          {
            value: "head_coach",
            label: "Head Coach",
            description: "Lead the team, primary responsibility",
            icon: "Star",
          },
          {
            value: "assistant",
            label: "Assistant Coach",
            description: "Support the head coach",
            icon: "Users",
          },
          {
            value: "volunteer",
            label: "Volunteer Helper",
            description: "Occasional support as needed",
            icon: "Heart",
          },
          {
            value: "flexible",
            label: "Flexible",
            description: "Open to any role",
            icon: "Shuffle",
          },
        ],
      },
      {
        id: "travel_willing",
        type: "checkboxes",
        label: "Travel",
        options: [
          {
            value: "travel_games",
            label: "Available for Away Games",
            description: "Willing to travel for games and tournaments",
          },
        ],
      },
    ],
  },
  {
    id: "references",
    label: "Professional References",
    icon: "Users",
    fields: [
      {
        id: "reference1_name",
        type: "text",
        label: "Reference 1 - Name",
        placeholder: "Full name",
        required: true,
      },
      {
        id: "reference1_relationship",
        type: "text",
        label: "Reference 1 - Relationship",
        placeholder: "e.g., Previous Athletic Director",
        required: true,
      },
      {
        id: "reference1_phone",
        type: "text",
        label: "Reference 1 - Phone",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "reference1_email",
        type: "text",
        label: "Reference 1 - Email",
        placeholder: "reference@example.com",
      },
      {
        id: "reference2_name",
        type: "text",
        label: "Reference 2 - Name",
        placeholder: "Full name",
        required: true,
      },
      {
        id: "reference2_relationship",
        type: "text",
        label: "Reference 2 - Relationship",
        placeholder: "e.g., Former Head Coach",
        required: true,
      },
      {
        id: "reference2_phone",
        type: "text",
        label: "Reference 2 - Phone",
        placeholder: "(416) 555-0456",
        required: true,
      },
      {
        id: "reference2_email",
        type: "text",
        label: "Reference 2 - Email",
        placeholder: "reference2@example.com",
      },
      {
        id: "reference3_name",
        type: "text",
        label: "Reference 3 - Name (Optional)",
        placeholder: "Full name",
      },
      {
        id: "reference3_relationship",
        type: "text",
        label: "Reference 3 - Relationship",
        placeholder: "e.g., Parent of former player",
      },
      {
        id: "reference3_phone",
        type: "text",
        label: "Reference 3 - Phone",
        placeholder: "(416) 555-0789",
      },
    ],
  },
];

// Preview Component
function CoachPreview({ data }) {
  return (
    <div className="p-6 space-y-6">
      {/* Coach Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#c9a962]/20 flex items-center justify-center overflow-hidden">
            {data.photo ? (
              <img
                src={URL.createObjectURL(data.photo)}
                alt="Coach"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-[#c9a962]" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {data.first_name || data.last_name
                ? `${data.first_name || ""} ${data.last_name || ""}`.trim()
                : "Coach Name"}
            </h3>
            <p className="text-white/40 text-sm capitalize">
              {data.commitment_level?.replace(/_/g, " ") || "Role"} | {data.years_coaching || "0"} years exp.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Email</span>
            <p className="text-white font-medium truncate">{data.email || "---"}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Phone</span>
            <p className="text-white font-medium">{data.phone || "---"}</p>
          </div>
        </div>
      </div>

      {/* Experience */}
      {data.levels_coached?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Levels Coached
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.levels_coached.map((level) => (
              <span
                key={level}
                className="px-3 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-sm font-medium capitalize"
              >
                {level.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
          Certifications
        </h4>
        <div className="space-y-2">
          {data.nccp_level && data.nccp_level !== "none" && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <Award className="w-2.5 h-2.5" />
              </div>
              <span className="capitalize">{data.nccp_level.replace(/_/g, " ")}</span>
            </div>
          )}
          {data.first_aid === "current" && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5" />
              </div>
              <span>First Aid Certified</span>
            </div>
          )}
          {data.background_check_consent?.includes("consent") && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5" />
              </div>
              <span>Background Check Consented</span>
            </div>
          )}
        </div>
      </div>

      {/* Availability */}
      {data.available_days?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Available Days
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.available_days.map((day) => (
              <span
                key={day}
                className="px-3 py-1 rounded-full bg-white/[0.08] text-white/80 text-sm font-medium capitalize"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Seasons */}
      {data.seasons?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Seasons
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.seasons.map((season) => (
              <span
                key={season}
                className="px-3 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-sm font-medium capitalize"
              >
                {season}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoachRegistration() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createCoachMutation = useMutation({
    mutationFn: async (data) => {
      const coachData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        years_coaching: data.years_coaching,
        levels_coached: data.levels_coached,
        age_groups: data.age_groups,
        previous_teams: data.previous_teams,
        playing_experience: data.playing_experience,
        coaching_philosophy: data.coaching_philosophy,
        nccp_level: data.nccp_level,
        nccp_number: data.nccp_number,
        first_aid: data.first_aid,
        first_aid_expiry: data.first_aid_expiry,
        other_certifications: data.other_certifications,
        background_check_consent: data.background_check_consent,
        available_days: data.available_days,
        available_times: data.available_times,
        seasons: data.seasons,
        commitment_level: data.commitment_level,
        travel_willing: data.travel_willing,
        references: [
          {
            name: data.reference1_name,
            relationship: data.reference1_relationship,
            phone: data.reference1_phone,
            email: data.reference1_email,
          },
          {
            name: data.reference2_name,
            relationship: data.reference2_relationship,
            phone: data.reference2_phone,
            email: data.reference2_email,
          },
          data.reference3_name ? {
            name: data.reference3_name,
            relationship: data.reference3_relationship,
            phone: data.reference3_phone,
          } : null,
        ].filter(Boolean),
        status: "pending_review",
        created_date: new Date().toISOString(),
      };

      return base44.entities.Coach.create(coachData);
    },
    onSuccess: (newCoach) => {
      localStorage.removeItem("coach_registration_draft");
      navigate(`/CoachDetail?id=${newCoach.id}`);
    },
  });

  const handleSubmit = (data) => {
    createCoachMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("coach_registration_draft", JSON.stringify(data));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("coach_registration_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Coach Application"
        subtitle="Apply to become a coach in our basketball program"
        sections={COACH_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={CoachPreview}
        submitLabel={createCoachMutation.isPending ? "Submitting..." : "Submit Application"}
        skipLabel="Save as Draft"
        defaultMode="form"
      />
    </div>
  );
}
