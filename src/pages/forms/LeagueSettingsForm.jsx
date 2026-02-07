import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Trophy, Layers, BookOpen, Calendar, Award } from "lucide-react";

// League Settings Form Configuration
const LEAGUE_SECTIONS = [
  {
    id: "league",
    label: "League Information",
    icon: "Trophy",
    description: "Basic league details and branding",
    fields: [
      {
        id: "league_name",
        type: "text",
        label: "League Name",
        placeholder: "Greater Toronto Basketball League",
        required: true,
      },
      {
        id: "description",
        type: "textarea",
        label: "League Description",
        placeholder: "Describe your league's mission and values...",
        rows: 3,
        hint: "This will appear on your league's public profile",
      },
      {
        id: "logo",
        type: "upload",
        label: "League Logo",
        accept: "image/*",
        hint: "PNG or SVG recommended, minimum 200x200 pixels",
      },
      {
        id: "founded_year",
        type: "select",
        label: "Year Founded",
        options: Array.from({ length: 50 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return { value: String(year), label: String(year) };
        }),
      },
    ],
  },
  {
    id: "structure",
    label: "League Structure",
    icon: "Layers",
    description: "Divisions, age groups, and categories",
    fields: [
      {
        id: "divisions",
        type: "checkboxes",
        label: "Divisions",
        required: true,
        hint: "Select all divisions in your league",
        options: [
          { value: "recreational", label: "Recreational", description: "Emphasis on fun and participation", icon: "Smile" },
          { value: "competitive", label: "Competitive", description: "Regular season with playoffs", icon: "Trophy" },
          { value: "elite", label: "Elite/Rep", description: "Travel teams and tournaments", icon: "Star" },
          { value: "development", label: "Development", description: "Skill-building focused", icon: "TrendingUp" },
        ],
      },
      {
        id: "age_groups",
        type: "pills",
        label: "Age Groups",
        required: true,
        hint: "Select all age groups your league supports",
        options: [
          { value: "u6", label: "U6" },
          { value: "u8", label: "U8" },
          { value: "u10", label: "U10" },
          { value: "u12", label: "U12" },
          { value: "u14", label: "U14" },
          { value: "u16", label: "U16" },
          { value: "u18", label: "U18" },
          { value: "adult", label: "Adult" },
          { value: "senior", label: "35+" },
        ],
      },
      {
        id: "gender_categories",
        type: "pills",
        label: "Gender Categories",
        required: true,
        options: [
          { value: "boys", label: "Boys" },
          { value: "girls", label: "Girls" },
          { value: "coed", label: "Co-Ed" },
          { value: "mens", label: "Men's" },
          { value: "womens", label: "Women's" },
        ],
      },
    ],
  },
  {
    id: "rules",
    label: "Game Rules",
    icon: "BookOpen",
    description: "Configure game rules and regulations",
    fields: [
      {
        id: "game_length",
        type: "cards",
        label: "Game Length",
        required: true,
        columns: 2,
        options: [
          { value: "2x20", label: "2 x 20 min halves", description: "40 minutes total", icon: "Clock" },
          { value: "4x8", label: "4 x 8 min quarters", description: "32 minutes total", icon: "Clock" },
          { value: "4x10", label: "4 x 10 min quarters", description: "40 minutes total", icon: "Clock" },
          { value: "4x12", label: "4 x 12 min quarters", description: "48 minutes total (NBA)", icon: "Clock" },
        ],
      },
      {
        id: "overtime_rules",
        type: "cards",
        label: "Overtime Rules",
        required: true,
        columns: 2,
        options: [
          { value: "none", label: "No Overtime", description: "Games can end in a tie", icon: "Minus" },
          { value: "single_5", label: "5-Minute OT", description: "Single 5-minute overtime period", icon: "Clock" },
          { value: "sudden_death", label: "Sudden Death", description: "First to score wins", icon: "Zap" },
          { value: "double_3", label: "Double 3-Min OT", description: "Up to two 3-minute OT periods", icon: "RefreshCw" },
        ],
      },
      {
        id: "mercy_rule",
        type: "cards",
        label: "Mercy Rule",
        columns: 2,
        options: [
          { value: "none", label: "No Mercy Rule", description: "Games play to completion", icon: "X" },
          { value: "running_20", label: "Running Clock at +20", description: "Clock runs continuously at 20+ point lead", icon: "FastForward" },
          { value: "running_30", label: "Running Clock at +30", description: "Clock runs continuously at 30+ point lead", icon: "FastForward" },
          { value: "end_40", label: "Game Ends at +40", description: "Game ends if lead reaches 40 points", icon: "StopCircle" },
        ],
      },
      {
        id: "technical_rules",
        type: "checkboxes",
        label: "Technical Rules",
        options: [
          { value: "shot_clock", label: "Shot Clock", description: "24 or 30 second shot clock" },
          { value: "three_point", label: "3-Point Line", description: "Three-point shots count as 3" },
          { value: "backcourt", label: "Backcourt Violation", description: "10-second backcourt rule" },
          { value: "lane_violation", label: "Lane Violations", description: "3-second lane violation" },
        ],
      },
    ],
  },
  {
    id: "scheduling",
    label: "Season Scheduling",
    icon: "Calendar",
    description: "Season dates and game frequency",
    fields: [
      {
        id: "season_start",
        type: "text",
        label: "Season Start Date",
        placeholder: "YYYY-MM-DD",
        required: true,
      },
      {
        id: "season_end",
        type: "text",
        label: "Season End Date",
        placeholder: "YYYY-MM-DD",
        required: true,
      },
      {
        id: "games_per_week",
        type: "select",
        label: "Games Per Team Per Week",
        required: true,
        options: [
          { value: "1", label: "1 game per week" },
          { value: "2", label: "2 games per week" },
          { value: "3", label: "3 games per week" },
          { value: "varies", label: "Varies by division" },
        ],
      },
      {
        id: "playoff_format",
        type: "cards",
        label: "Playoff Format",
        required: true,
        columns: 2,
        options: [
          { value: "none", label: "No Playoffs", description: "Regular season only", icon: "Calendar" },
          { value: "single_elim", label: "Single Elimination", description: "One loss and you're out", icon: "Zap" },
          { value: "double_elim", label: "Double Elimination", description: "Two losses to eliminate", icon: "RefreshCw" },
          { value: "best_of_3", label: "Best of 3 Series", description: "Series-based playoffs", icon: "Trophy" },
        ],
      },
      {
        id: "playoff_teams",
        type: "select",
        label: "Playoff Teams (per division)",
        options: [
          { value: "4", label: "Top 4 teams" },
          { value: "6", label: "Top 6 teams" },
          { value: "8", label: "Top 8 teams" },
          { value: "all", label: "All teams qualify" },
        ],
      },
    ],
  },
  {
    id: "standings",
    label: "Standings & Points",
    icon: "Award",
    description: "Configure how standings are calculated",
    fields: [
      {
        id: "points_win",
        type: "select",
        label: "Points for a Win",
        required: true,
        options: [
          { value: "1", label: "1 point" },
          { value: "2", label: "2 points" },
          { value: "3", label: "3 points" },
        ],
      },
      {
        id: "points_loss",
        type: "select",
        label: "Points for a Loss",
        required: true,
        options: [
          { value: "0", label: "0 points" },
          { value: "1", label: "1 point" },
        ],
      },
      {
        id: "points_tie",
        type: "select",
        label: "Points for a Tie",
        required: true,
        options: [
          { value: "0", label: "0 points" },
          { value: "1", label: "1 point" },
          { value: "1.5", label: "1.5 points" },
        ],
      },
      {
        id: "tiebreakers",
        type: "checkboxes",
        label: "Tiebreaker Order",
        required: true,
        hint: "Select and order tiebreakers (priority order)",
        options: [
          { value: "head_to_head", label: "Head-to-Head Record", description: "Record between tied teams", icon: "Users" },
          { value: "point_diff", label: "Point Differential", description: "Points scored minus allowed", icon: "TrendingUp" },
          { value: "points_for", label: "Points Scored", description: "Total points scored", icon: "Target" },
          { value: "points_against", label: "Points Allowed", description: "Fewest points allowed", icon: "Shield" },
          { value: "coin_flip", label: "Coin Flip", description: "Random determination", icon: "Circle" },
        ],
      },
    ],
  },
];

// Preview Component - League Config Summary
function LeaguePreview({ data }) {
  return (
    <div className="space-y-4">
      {/* League Header */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#c9a962]/20 flex items-center justify-center overflow-hidden">
            {data.logo ? (
              <img
                src={URL.createObjectURL(data.logo)}
                alt="League Logo"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <Trophy className="w-8 h-8 text-[#c9a962]" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">
              {data.league_name || "League Name"}
            </h3>
            {data.founded_year && (
              <p className="text-white/40 text-sm">Est. {data.founded_year}</p>
            )}
          </div>
        </div>
        {data.description && (
          <p className="text-white/60 text-sm mt-3 line-clamp-2">{data.description}</p>
        )}
      </div>

      {/* Structure Summary */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          League Structure
        </h4>

        <div className="space-y-3">
          {data.divisions?.length > 0 && (
            <div>
              <span className="text-white/40 text-xs">Divisions</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.divisions.map((div) => (
                  <span
                    key={div}
                    className="px-2 py-0.5 rounded bg-[#c9a962]/20 text-[#c9a962] text-xs capitalize"
                  >
                    {div}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.age_groups?.length > 0 && (
            <div>
              <span className="text-white/40 text-xs">Age Groups</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.age_groups.map((age) => (
                  <span
                    key={age}
                    className="px-2 py-0.5 rounded bg-blue-400/20 text-blue-400 text-xs uppercase"
                  >
                    {age}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.gender_categories?.length > 0 && (
            <div>
              <span className="text-white/40 text-xs">Categories</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.gender_categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-0.5 rounded bg-purple-400/20 text-purple-400 text-xs capitalize"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Rules */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Game Rules
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 rounded-lg bg-white/[0.04]">
            <span className="text-white/40 text-xs">Game Length</span>
            <p className="text-white font-medium">{data.game_length || "Not set"}</p>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.04]">
            <span className="text-white/40 text-xs">Overtime</span>
            <p className="text-white font-medium capitalize">
              {data.overtime_rules?.replace(/_/g, " ") || "Not set"}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.04] col-span-2">
            <span className="text-white/40 text-xs">Mercy Rule</span>
            <p className="text-white font-medium capitalize">
              {data.mercy_rule?.replace(/_/g, " ") || "None"}
            </p>
          </div>
        </div>
      </div>

      {/* Season Info */}
      {(data.season_start || data.season_end) && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Season
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">Start</span>
              <span className="text-white">{data.season_start || "TBD"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">End</span>
              <span className="text-white">{data.season_end || "TBD"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Games/Week</span>
              <span className="text-white">{data.games_per_week || "TBD"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Playoffs</span>
              <span className="text-white capitalize">
                {data.playoff_format?.replace(/_/g, " ") || "TBD"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Standings Points */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Points System
        </h4>
        <div className="flex gap-4">
          <div className="flex-1 text-center p-3 rounded-lg bg-emerald-400/10">
            <p className="text-2xl font-bold text-emerald-400">{data.points_win || "—"}</p>
            <p className="text-xs text-white/40">Win</p>
          </div>
          <div className="flex-1 text-center p-3 rounded-lg bg-yellow-400/10">
            <p className="text-2xl font-bold text-yellow-400">{data.points_tie || "—"}</p>
            <p className="text-xs text-white/40">Tie</p>
          </div>
          <div className="flex-1 text-center p-3 rounded-lg bg-red-400/10">
            <p className="text-2xl font-bold text-red-400">{data.points_loss || "—"}</p>
            <p className="text-xs text-white/40">Loss</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeagueSettingsForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leagueId = searchParams.get("id");
  const [savedData, setSavedData] = useState(null);

  const updateLeagueMutation = useMutation({
    mutationFn: async (data) => {
      const leagueSettings = {
        name: data.league_name,
        description: data.description,
        logo: data.logo?.name || null,
        founded_year: data.founded_year,
        structure: {
          divisions: data.divisions,
          age_groups: data.age_groups,
          gender_categories: data.gender_categories,
        },
        rules: {
          game_length: data.game_length,
          overtime_rules: data.overtime_rules,
          mercy_rule: data.mercy_rule,
          technical_rules: data.technical_rules,
        },
        scheduling: {
          season_start: data.season_start,
          season_end: data.season_end,
          games_per_week: data.games_per_week,
          playoff_format: data.playoff_format,
          playoff_teams: data.playoff_teams,
        },
        standings: {
          points_win: parseInt(data.points_win) || 2,
          points_loss: parseInt(data.points_loss) || 0,
          points_tie: parseFloat(data.points_tie) || 1,
          tiebreakers: data.tiebreakers,
        },
        updated_date: new Date().toISOString(),
      };

      if (leagueId) {
        return base44.entities.League.update(leagueId, leagueSettings);
      } else {
        leagueSettings.status = "active";
        leagueSettings.created_date = new Date().toISOString();
        return base44.entities.League.create(leagueSettings);
      }
    },
    onSuccess: (league) => {
      localStorage.removeItem("league_settings_draft");
      navigate(`/LeagueManagement?id=${league.id || leagueId}`);
    },
  });

  const handleSubmit = (data) => {
    updateLeagueMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("league_settings_draft", JSON.stringify(data));
  };

  // Load draft from localStorage
  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("league_settings_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="League Settings"
        subtitle="Configure your league's structure, rules, and scheduling"
        sections={LEAGUE_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={LeaguePreview}
        submitLabel={updateLeagueMutation.isPending ? "Saving..." : "Save League Settings"}
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
