import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Trophy, UserCircle, MapPin, Clock } from "lucide-react";

// League Application Form Configuration
const LEAGUE_SECTIONS = [
  {
    id: "league_info",
    label: "League Information",
    icon: "Trophy",
    fields: [
      {
        id: "league_name",
        type: "text",
        label: "League Name",
        placeholder: "Greater Toronto Basketball League",
        required: true,
        hint: "Official name of your league",
      },
      {
        id: "sport",
        type: "select",
        label: "Primary Sport",
        required: true,
        options: [
          { value: "basketball", label: "Basketball" },
          { value: "volleyball", label: "Volleyball" },
          { value: "soccer", label: "Soccer" },
          { value: "flag_football", label: "Flag Football" },
          { value: "softball", label: "Softball" },
          { value: "hockey", label: "Ball Hockey" },
          { value: "multi_sport", label: "Multi-Sport" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "founded_year",
        type: "select",
        label: "Year Founded",
        required: true,
        options: Array.from({ length: 50 }, (_, i) => ({
          value: String(2025 - i),
          label: String(2025 - i),
        })),
      },
      {
        id: "description",
        type: "textarea",
        label: "League Description",
        placeholder: "Describe your league's mission, history, and what makes it unique...",
        rows: 4,
        required: true,
        hint: "This will be displayed on your league profile",
      },
      {
        id: "league_logo",
        type: "upload",
        label: "League Logo",
        accept: "image/*",
        hint: "PNG or SVG, minimum 400x400px",
      },
    ],
  },
  {
    id: "structure",
    label: "League Structure",
    icon: "Users",
    fields: [
      {
        id: "divisions",
        type: "pills",
        label: "Divisions Offered",
        hint: "Select all divisions your league operates",
        required: true,
        options: [
          { value: "mens", label: "Men's" },
          { value: "womens", label: "Women's" },
          { value: "coed", label: "Co-Ed" },
          { value: "youth_boys", label: "Youth Boys" },
          { value: "youth_girls", label: "Youth Girls" },
          { value: "senior", label: "Senior (35+)" },
          { value: "masters", label: "Masters (50+)" },
        ],
      },
      {
        id: "age_groups",
        type: "checkboxes",
        label: "Age Groups",
        hint: "Select all age categories",
        required: true,
        options: [
          { value: "u8", label: "Under 8", description: "Ages 6-7" },
          { value: "u10", label: "Under 10", description: "Ages 8-9" },
          { value: "u12", label: "Under 12", description: "Ages 10-11" },
          { value: "u14", label: "Under 14", description: "Ages 12-13" },
          { value: "u16", label: "Under 16", description: "Ages 14-15" },
          { value: "u18", label: "Under 18", description: "Ages 16-17" },
          { value: "adult", label: "Adult (18+)", description: "Ages 18 and over" },
          { value: "open", label: "Open", description: "All ages welcome" },
        ],
      },
      {
        id: "team_count",
        type: "select",
        label: "Number of Teams",
        required: true,
        options: [
          { value: "under_10", label: "Less than 10 teams" },
          { value: "10_20", label: "10-20 teams" },
          { value: "20_50", label: "20-50 teams" },
          { value: "50_100", label: "50-100 teams" },
          { value: "over_100", label: "100+ teams" },
        ],
      },
      {
        id: "skill_levels",
        type: "pills",
        label: "Skill Levels",
        options: [
          { value: "recreational", label: "Recreational" },
          { value: "intermediate", label: "Intermediate" },
          { value: "competitive", label: "Competitive" },
          { value: "elite", label: "Elite/Rep" },
        ],
      },
    ],
  },
  {
    id: "facilities",
    label: "Facilities",
    icon: "Building",
    fields: [
      {
        id: "primary_venue",
        type: "text",
        label: "Primary Venue Name",
        placeholder: "Toronto Community Center",
        required: true,
      },
      {
        id: "primary_venue_address",
        type: "text",
        label: "Primary Venue Address",
        placeholder: "123 Main Street, Toronto, ON M5A 1A1",
        required: true,
      },
      {
        id: "backup_venues",
        type: "textarea",
        label: "Backup/Secondary Venues",
        placeholder: "List additional venues used by the league, one per line...",
        rows: 3,
        hint: "Include name and address for each venue",
      },
      {
        id: "facility_features",
        type: "checkboxes",
        label: "Facility Features",
        options: [
          { value: "indoor", label: "Indoor Courts", icon: "Building" },
          { value: "outdoor", label: "Outdoor Courts", icon: "Sun" },
          { value: "scoreboard", label: "Electronic Scoreboard", icon: "Monitor" },
          { value: "locker_rooms", label: "Locker Rooms", icon: "Lock" },
          { value: "parking", label: "Free Parking", icon: "Car" },
          { value: "accessibility", label: "Wheelchair Accessible", icon: "Accessibility" },
          { value: "concessions", label: "Concession Stand", icon: "Coffee" },
          { value: "livestream", label: "Livestream Capability", icon: "Video" },
        ],
      },
    ],
  },
  {
    id: "schedule",
    label: "Season & Schedule",
    icon: "Calendar",
    fields: [
      {
        id: "season_type",
        type: "cards",
        label: "Season Type",
        required: true,
        columns: 2,
        options: [
          {
            value: "fall_winter",
            label: "Fall/Winter",
            description: "September - March",
            icon: "Snowflake",
          },
          {
            value: "spring_summer",
            label: "Spring/Summer",
            description: "April - August",
            icon: "Sun",
          },
          {
            value: "year_round",
            label: "Year-Round",
            description: "Continuous seasons",
            icon: "Calendar",
          },
          {
            value: "custom",
            label: "Custom Schedule",
            description: "Non-standard season dates",
            icon: "Settings",
          },
        ],
      },
      {
        id: "season_start",
        type: "text",
        label: "Typical Season Start",
        placeholder: "September",
        hint: "Month when seasons typically begin",
      },
      {
        id: "season_end",
        type: "text",
        label: "Typical Season End",
        placeholder: "March",
        hint: "Month when seasons typically end",
      },
      {
        id: "game_frequency",
        type: "select",
        label: "Game Frequency",
        required: true,
        options: [
          { value: "weekly", label: "Once per week" },
          { value: "biweekly", label: "Twice per week" },
          { value: "weekend", label: "Weekends only" },
          { value: "tournament", label: "Tournament format" },
          { value: "flexible", label: "Flexible scheduling" },
        ],
      },
      {
        id: "game_days",
        type: "pills",
        label: "Primary Game Days",
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
    ],
  },
  {
    id: "leadership",
    label: "Leadership & Contact",
    icon: "UserCircle",
    fields: [
      {
        id: "commissioner_name",
        type: "text",
        label: "Commissioner / President Name",
        placeholder: "Jane Doe",
        required: true,
      },
      {
        id: "commissioner_email",
        type: "text",
        label: "Commissioner Email",
        placeholder: "commissioner@league.com",
        required: true,
      },
      {
        id: "commissioner_phone",
        type: "text",
        label: "Commissioner Phone",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "board_members",
        type: "textarea",
        label: "Board Members / Key Staff",
        placeholder: "List key leadership team members and their roles...\n\nExample:\nVice President - John Smith\nTreasurer - Mary Johnson\nSecretary - Bob Wilson",
        rows: 5,
        hint: "Include name and role for each person",
      },
      {
        id: "league_website",
        type: "text",
        label: "League Website",
        placeholder: "https://www.yourleague.com",
      },
      {
        id: "social_media",
        type: "textarea",
        label: "Social Media Links",
        placeholder: "Instagram: @yourleague\nTwitter: @yourleague\nFacebook: /yourleague",
        rows: 3,
      },
    ],
  },
];

// Preview Component
function LeaguePreview({ data }) {
  const logoUrl = data.league_logo?.name ? URL.createObjectURL(data.league_logo) : null;

  return (
    <div className="space-y-4">
      {/* League Profile Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#c9a962]/20 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Trophy className="w-8 h-8 text-[#c9a962]" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {data.league_name || "League Name"}
            </h3>
            <p className="text-white/40 text-sm capitalize">
              {data.sport?.replace(/_/g, " ") || "Sport"} {data.founded_year && `- Est. ${data.founded_year}`}
            </p>
          </div>
        </div>

        {data.description && (
          <p className="text-white/60 text-sm mb-4 line-clamp-3">{data.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40 text-xs">Teams</span>
            <p className="text-white font-medium capitalize">
              {data.team_count?.replace(/_/g, " ") || "--"}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40 text-xs">Season</span>
            <p className="text-white font-medium capitalize">
              {data.season_type?.replace(/_/g, " ") || "--"}
            </p>
          </div>
        </div>
      </div>

      {/* Divisions */}
      {data.divisions?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Divisions
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.divisions.map((div) => (
              <span
                key={div}
                className="px-2 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-xs font-medium capitalize"
              >
                {div.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Age Groups */}
      {data.age_groups?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Age Groups
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.age_groups.map((age) => (
              <span
                key={age}
                className="px-2 py-1 rounded-full bg-white/[0.1] text-white/70 text-xs font-medium uppercase"
              >
                {age}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Primary Venue */}
      {data.primary_venue && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Primary Venue
          </h4>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#c9a962] mt-0.5" />
            <div>
              <p className="text-white font-medium">{data.primary_venue}</p>
              {data.primary_venue_address && (
                <p className="text-white/50 text-sm">{data.primary_venue_address}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Commissioner */}
      {data.commissioner_name && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Commissioner
          </h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c9a962]/20 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-[#c9a962]" />
            </div>
            <div>
              <p className="text-white font-medium">{data.commissioner_name}</p>
              <p className="text-white/50 text-sm">{data.commissioner_email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Game Schedule */}
      {data.game_days?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Game Days
          </h4>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            <span className="text-white/70 text-sm capitalize">
              {data.game_days.join(", ")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeagueApplication() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createLeagueMutation = useMutation({
    mutationFn: async (data) => {
      // Upload logo if present
      let logoUrl = null;
      if (data.league_logo && data.league_logo instanceof File) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: data.league_logo });
        logoUrl = file_url;
      }

      const leagueData = {
        league_name: data.league_name,
        sport: data.sport,
        founded_year: data.founded_year,
        description: data.description,
        logo_url: logoUrl,
        divisions: data.divisions,
        age_groups: data.age_groups,
        team_count: data.team_count,
        skill_levels: data.skill_levels,
        primary_venue: data.primary_venue,
        primary_venue_address: data.primary_venue_address,
        backup_venues: data.backup_venues,
        facility_features: data.facility_features,
        season_type: data.season_type,
        season_start: data.season_start,
        season_end: data.season_end,
        game_frequency: data.game_frequency,
        game_days: data.game_days,
        commissioner_name: data.commissioner_name,
        commissioner_email: data.commissioner_email,
        commissioner_phone: data.commissioner_phone,
        board_members: data.board_members,
        league_website: data.league_website,
        social_media: data.social_media,
        status: "pending",
        application_type: "league",
        created_date: new Date().toISOString(),
      };

      return base44.entities.Application.create(leagueData);
    },
    onSuccess: (newApplication) => {
      localStorage.removeItem("league_application_draft");
      navigate(`/applications?id=${newApplication.id}&type=league`);
    },
  });

  const handleSubmit = (data) => {
    createLeagueMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    const saveData = { ...data };
    if (saveData.league_logo instanceof File) {
      saveData.league_logo = { name: saveData.league_logo.name, saved: true };
    }
    localStorage.setItem("league_application_draft", JSON.stringify(saveData));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("league_application_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="League Application"
        subtitle="Join the Ball in the 6 organization network"
        sections={LEAGUE_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={LeaguePreview}
        submitLabel={createLeagueMutation.isPending ? "Submitting..." : "Submit Application"}
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
