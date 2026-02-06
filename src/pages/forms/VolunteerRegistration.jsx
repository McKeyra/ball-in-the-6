import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { User, Heart, Calendar, Briefcase, Shield, CheckCircle } from "lucide-react";

// Volunteer Registration Form Configuration
const VOLUNTEER_SECTIONS = [
  {
    id: "personal",
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
        placeholder: "volunteer@example.com",
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
        id: "connection_to_league",
        type: "select",
        label: "Connection to the League",
        options: [
          { value: "parent", label: "Parent of Player" },
          { value: "grandparent", label: "Grandparent of Player" },
          { value: "sibling", label: "Sibling of Player" },
          { value: "former_player", label: "Former Player" },
          { value: "community_member", label: "Community Member" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    id: "interests",
    label: "Volunteer Interests",
    icon: "Heart",
    fields: [
      {
        id: "volunteer_roles",
        type: "checkboxes",
        label: "Roles You're Interested In",
        required: true,
        hint: "Select all roles you'd like to help with",
        options: [
          {
            value: "scorekeeper",
            label: "Scorekeeper",
            description: "Keep score during games using the scoreboard",
            icon: "Hash",
          },
          {
            value: "shot_clock",
            label: "Shot Clock Operator",
            description: "Operate the shot clock during games",
            icon: "Timer",
          },
          {
            value: "announcer",
            label: "Game Announcer",
            description: "Announce player names and game events",
            icon: "Mic",
          },
          {
            value: "concession",
            label: "Concession Stand",
            description: "Help run the snack bar during games",
            icon: "Coffee",
          },
          {
            value: "setup_cleanup",
            label: "Setup & Cleanup",
            description: "Help set up and take down equipment",
            icon: "Box",
          },
          {
            value: "registration_table",
            label: "Registration Table",
            description: "Check in players and families at events",
            icon: "ClipboardCheck",
          },
          {
            value: "photography",
            label: "Photography",
            description: "Take photos at games and events",
            icon: "Camera",
          },
          {
            value: "team_parent",
            label: "Team Parent",
            description: "Coordinate team communications and activities",
            icon: "Users",
          },
          {
            value: "event_coordinator",
            label: "Event Coordinator",
            description: "Help plan and run special events",
            icon: "Calendar",
          },
          {
            value: "fundraising",
            label: "Fundraising",
            description: "Help with fundraising initiatives",
            icon: "DollarSign",
          },
        ],
      },
      {
        id: "role_preference",
        type: "cards",
        label: "Role Preference",
        columns: 2,
        options: [
          {
            value: "game_day",
            label: "Game Day Help",
            description: "Prefer helping during games",
            icon: "Whistle",
          },
          {
            value: "behind_scenes",
            label: "Behind the Scenes",
            description: "Prefer administrative/planning tasks",
            icon: "Settings",
          },
          {
            value: "both",
            label: "Both",
            description: "Happy to help with anything",
            icon: "Heart",
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
        id: "frequency",
        type: "cards",
        label: "How Often Can You Volunteer?",
        required: true,
        columns: 2,
        options: [
          {
            value: "weekly",
            label: "Weekly",
            description: "Available every week",
            icon: "Calendar",
          },
          {
            value: "biweekly",
            label: "Bi-Weekly",
            description: "Available every other week",
            icon: "CalendarDays",
          },
          {
            value: "monthly",
            label: "Monthly",
            description: "Once or twice a month",
            icon: "CalendarRange",
          },
          {
            value: "occasional",
            label: "Occasional",
            description: "Special events only",
            icon: "Star",
          },
        ],
      },
      {
        id: "available_days",
        type: "pills",
        label: "Available Days",
        hint: "Select all days you can volunteer",
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
        id: "event_types",
        type: "pills",
        label: "Events Available For",
        hint: "Select all that apply",
        options: [
          { value: "regular_games", label: "Regular Season Games" },
          { value: "playoffs", label: "Playoff Games" },
          { value: "tournaments", label: "Tournaments" },
          { value: "tryouts", label: "Tryouts" },
          { value: "special_events", label: "Special Events" },
          { value: "fundraisers", label: "Fundraisers" },
        ],
      },
      {
        id: "start_date",
        type: "text",
        label: "Available Starting",
        placeholder: "YYYY-MM-DD",
        hint: "When can you start volunteering?",
      },
    ],
  },
  {
    id: "skills",
    label: "Skills & Experience",
    icon: "Briefcase",
    fields: [
      {
        id: "relevant_experience",
        type: "textarea",
        label: "Relevant Experience",
        placeholder: "Describe any relevant volunteer or work experience",
        hint: "e.g., coaching, event planning, customer service",
      },
      {
        id: "special_skills",
        type: "pills",
        label: "Special Skills",
        hint: "Select any that apply",
        options: [
          { value: "first_aid", label: "First Aid Certified" },
          { value: "cpr", label: "CPR Certified" },
          { value: "food_handling", label: "Food Handler Certificate" },
          { value: "photography", label: "Photography" },
          { value: "video", label: "Videography" },
          { value: "graphic_design", label: "Graphic Design" },
          { value: "social_media", label: "Social Media" },
          { value: "accounting", label: "Accounting/Finance" },
          { value: "marketing", label: "Marketing" },
          { value: "web_development", label: "Web Development" },
        ],
      },
      {
        id: "languages",
        type: "pills",
        label: "Languages Spoken",
        hint: "Select all that apply",
        options: [
          { value: "english", label: "English" },
          { value: "french", label: "French" },
          { value: "spanish", label: "Spanish" },
          { value: "mandarin", label: "Mandarin" },
          { value: "cantonese", label: "Cantonese" },
          { value: "punjabi", label: "Punjabi" },
          { value: "tagalog", label: "Tagalog" },
          { value: "portuguese", label: "Portuguese" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "additional_info",
        type: "textarea",
        label: "Anything Else We Should Know?",
        placeholder: "Any additional information you'd like to share",
      },
    ],
  },
  {
    id: "background",
    label: "Background Check",
    icon: "Shield",
    fields: [
      {
        id: "over_18",
        type: "checkboxes",
        label: "Age Verification",
        required: true,
        options: [
          {
            value: "confirmed",
            label: "I am 18 years of age or older",
            description: "Required to volunteer with youth programs",
          },
        ],
      },
      {
        id: "background_check_status",
        type: "cards",
        label: "Background Check Status",
        columns: 2,
        options: [
          {
            value: "completed",
            label: "Already Completed",
            description: "I have a current vulnerable sector check",
            icon: "CheckCircle",
          },
          {
            value: "willing",
            label: "Willing to Complete",
            description: "I will complete one if required",
            icon: "FileCheck",
          },
        ],
      },
      {
        id: "background_check_date",
        type: "text",
        label: "Background Check Date",
        placeholder: "YYYY-MM-DD",
        hint: "If you have a current check, when was it completed?",
      },
      {
        id: "background_consent",
        type: "checkboxes",
        label: "Background Check Consent",
        required: true,
        options: [
          {
            value: "consent",
            label: "I Consent to Background Check",
            description: "I consent to a vulnerable sector background check as required for volunteering with youth",
          },
        ],
      },
      {
        id: "code_of_conduct",
        type: "checkboxes",
        label: "Code of Conduct",
        required: true,
        options: [
          {
            value: "accepted",
            label: "I Accept the Code of Conduct",
            description: "I agree to uphold the league's volunteer code of conduct",
          },
        ],
      },
      {
        id: "photo_release",
        type: "checkboxes",
        label: "Photo Release",
        options: [
          {
            value: "consent",
            label: "Photo Release Consent",
            description: "I consent to photos of me being used for league promotion",
          },
        ],
      },
    ],
  },
];

// Preview Component
function VolunteerPreview({ data }) {
  const getRoleIcon = (role) => {
    const icons = {
      scorekeeper: "#",
      shot_clock: "T",
      announcer: "M",
      concession: "C",
      setup_cleanup: "B",
      registration_table: "R",
      photography: "P",
      team_parent: "TP",
      event_coordinator: "E",
      fundraising: "$",
    };
    return icons[role] || "V";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Volunteer Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#c9a962]/20 flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#c9a962]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {data.first_name || data.last_name
                ? `${data.first_name || ""} ${data.last_name || ""}`.trim()
                : "Volunteer Name"}
            </h3>
            <p className="text-white/40 text-sm capitalize">
              {data.frequency || "Frequency"} Volunteer | {data.connection_to_league?.replace(/_/g, " ") || "Connection"}
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

      {/* Volunteer Roles */}
      {data.volunteer_roles?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Interested Roles
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.volunteer_roles.map((role) => (
              <span
                key={role}
                className="px-3 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-sm font-medium capitalize"
              >
                {role.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

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

      {/* Skills */}
      {data.special_skills?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Special Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.special_skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium capitalize"
              >
                {skill.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Languages
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 rounded-full bg-white/[0.08] text-white/80 text-sm font-medium capitalize"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Background Check Status */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
          Verification Status
        </h4>
        <div className="space-y-2">
          {data.over_18?.includes("confirmed") && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5" />
              </div>
              <span>Age Verified (18+)</span>
            </div>
          )}
          {data.background_consent?.includes("consent") && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <Shield className="w-2.5 h-2.5" />
              </div>
              <span>Background Check Consented</span>
            </div>
          )}
          {data.code_of_conduct?.includes("accepted") && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5" />
              </div>
              <span>Code of Conduct Accepted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VolunteerRegistration() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createVolunteerMutation = useMutation({
    mutationFn: async (data) => {
      const volunteerData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        connection_to_league: data.connection_to_league,
        volunteer_roles: data.volunteer_roles,
        role_preference: data.role_preference,
        frequency: data.frequency,
        available_days: data.available_days,
        available_times: data.available_times,
        event_types: data.event_types,
        start_date: data.start_date,
        relevant_experience: data.relevant_experience,
        special_skills: data.special_skills,
        languages: data.languages,
        additional_info: data.additional_info,
        over_18: data.over_18,
        background_check_status: data.background_check_status,
        background_check_date: data.background_check_date,
        background_consent: data.background_consent,
        code_of_conduct: data.code_of_conduct,
        photo_release: data.photo_release,
        status: "pending_review",
        created_date: new Date().toISOString(),
      };

      return base44.entities.Volunteer.create(volunteerData);
    },
    onSuccess: (newVolunteer) => {
      localStorage.removeItem("volunteer_registration_draft");
      navigate(`/VolunteerDetail?id=${newVolunteer.id}`);
    },
  });

  const handleSubmit = (data) => {
    createVolunteerMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("volunteer_registration_draft", JSON.stringify(data));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("volunteer_registration_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Volunteer Registration"
        subtitle="Join our community of volunteers and help make basketball happen"
        sections={VOLUNTEER_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={VolunteerPreview}
        submitLabel={createVolunteerMutation.isPending ? "Submitting..." : "Submit Application"}
        skipLabel="Save as Draft"
        defaultMode="form"
      />
    </div>
  );
}
