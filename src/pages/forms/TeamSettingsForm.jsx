import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Shield, Palette, Share2, FileText, MessageSquare, Image } from "lucide-react";

// Color Options for Color Picker Cards
const COLOR_OPTIONS = [
  { value: "#c9a962", label: "Gold", color: "#c9a962" },
  { value: "#3b82f6", label: "Blue", color: "#3b82f6" },
  { value: "#ef4444", label: "Red", color: "#ef4444" },
  { value: "#22c55e", label: "Green", color: "#22c55e" },
  { value: "#8b5cf6", label: "Purple", color: "#8b5cf6" },
  { value: "#f97316", label: "Orange", color: "#f97316" },
  { value: "#06b6d4", label: "Cyan", color: "#06b6d4" },
  { value: "#ec4899", label: "Pink", color: "#ec4899" },
  { value: "#000000", label: "Black", color: "#000000" },
  { value: "#ffffff", label: "White", color: "#ffffff" },
  { value: "#1e3a5f", label: "Navy", color: "#1e3a5f" },
  { value: "#7c3aed", label: "Violet", color: "#7c3aed" },
];

// Team Settings Form Configuration
const TEAM_SECTIONS = [
  {
    id: "identity",
    label: "Team Identity",
    icon: "Shield",
    description: "Basic team branding and identification",
    fields: [
      {
        id: "team_name",
        type: "text",
        label: "Team Name",
        placeholder: "Toronto Thunder",
        required: true,
      },
      {
        id: "abbreviation",
        type: "text",
        label: "Abbreviation",
        placeholder: "TOR",
        required: true,
        hint: "3-4 letter abbreviation for scoreboards and stats",
      },
      {
        id: "logo",
        type: "upload",
        label: "Team Logo",
        accept: "image/*",
        hint: "PNG or SVG recommended, transparent background preferred",
      },
      {
        id: "motto",
        type: "text",
        label: "Team Motto",
        placeholder: "Strike with Thunder",
        hint: "Optional team slogan or motto",
      },
    ],
  },
  {
    id: "colors",
    label: "Team Colors",
    icon: "Palette",
    description: "Choose your team's primary and secondary colors",
    fields: [
      {
        id: "primary_color",
        type: "cards",
        label: "Primary Color",
        required: true,
        columns: 4,
        options: COLOR_OPTIONS.map((c) => ({
          value: c.value,
          label: c.label,
          description: "",
          color: c.color,
        })),
      },
      {
        id: "secondary_color",
        type: "cards",
        label: "Secondary Color",
        required: true,
        columns: 4,
        options: COLOR_OPTIONS.map((c) => ({
          value: c.value,
          label: c.label,
          description: "",
          color: c.color,
        })),
      },
    ],
  },
  {
    id: "social",
    label: "Social Media",
    icon: "Share2",
    description: "Connect your team's social media accounts",
    fields: [
      {
        id: "instagram",
        type: "text",
        label: "Instagram Handle",
        placeholder: "@torontothunder",
        hint: "Include the @ symbol",
      },
      {
        id: "twitter",
        type: "text",
        label: "Twitter/X Handle",
        placeholder: "@torontothunder",
        hint: "Include the @ symbol",
      },
      {
        id: "website",
        type: "text",
        label: "Team Website",
        placeholder: "https://torontothunder.com",
      },
      {
        id: "youtube",
        type: "text",
        label: "YouTube Channel",
        placeholder: "https://youtube.com/@torontothunder",
      },
    ],
  },
  {
    id: "policies",
    label: "Team Policies",
    icon: "FileText",
    description: "Set attendance and behavior policies",
    fields: [
      {
        id: "practice_attendance",
        type: "select",
        label: "Required Practice Attendance",
        required: true,
        options: [
          { value: "50", label: "50% Minimum" },
          { value: "60", label: "60% Minimum" },
          { value: "70", label: "70% Minimum" },
          { value: "80", label: "80% Minimum" },
          { value: "90", label: "90% Minimum" },
          { value: "none", label: "No Requirement" },
        ],
      },
      {
        id: "late_policy",
        type: "cards",
        label: "Late Arrival Policy",
        required: true,
        columns: 2,
        options: [
          {
            value: "strict",
            label: "Strict",
            description: "Players late to games may not start",
            icon: "AlertTriangle",
          },
          {
            value: "moderate",
            label: "Moderate",
            description: "Warning system for repeated lateness",
            icon: "Clock",
          },
          {
            value: "flexible",
            label: "Flexible",
            description: "Understanding of occasional lateness",
            icon: "Check",
          },
          {
            value: "none",
            label: "No Policy",
            description: "No formal late policy",
            icon: "Minus",
          },
        ],
      },
      {
        id: "playing_time_policy",
        type: "cards",
        label: "Playing Time Policy",
        columns: 2,
        options: [
          {
            value: "equal",
            label: "Equal Playing Time",
            description: "All players get similar minutes",
            icon: "Equal",
          },
          {
            value: "merit",
            label: "Merit-Based",
            description: "Based on practice attendance and effort",
            icon: "Trophy",
          },
          {
            value: "competitive",
            label: "Competitive",
            description: "Best players play more in close games",
            icon: "Target",
          },
          {
            value: "development",
            label: "Development Focus",
            description: "Prioritize player development over winning",
            icon: "TrendingUp",
          },
        ],
      },
      {
        id: "code_of_conduct",
        type: "textarea",
        label: "Team Code of Conduct",
        placeholder: "Outline expected behavior for players and parents...",
        rows: 4,
      },
    ],
  },
  {
    id: "communication",
    label: "Communication Settings",
    icon: "MessageSquare",
    description: "Team communication channels and parent portal settings",
    fields: [
      {
        id: "group_chat_link",
        type: "text",
        label: "Team Group Chat Link",
        placeholder: "https://chat.whatsapp.com/...",
        hint: "WhatsApp, Slack, Discord, or other group chat link",
      },
      {
        id: "parent_portal_access",
        type: "checkboxes",
        label: "Parent Portal Access",
        hint: "What can parents view in the portal?",
        options: [
          { value: "schedule", label: "Game & Practice Schedule", icon: "Calendar" },
          { value: "stats", label: "Player Statistics", icon: "BarChart" },
          { value: "roster", label: "Team Roster & Contact Info", icon: "Users" },
          { value: "documents", label: "Team Documents", icon: "FileText" },
          { value: "photos", label: "Team Photos & Media", icon: "Image" },
          { value: "finances", label: "Team Finances", icon: "DollarSign" },
        ],
      },
      {
        id: "notification_settings",
        type: "checkboxes",
        label: "Automatic Notifications",
        hint: "What should trigger automatic notifications to parents?",
        options: [
          { value: "game_reminder", label: "Game Reminders (24hr before)", icon: "Bell" },
          { value: "practice_reminder", label: "Practice Reminders", icon: "Clock" },
          { value: "schedule_change", label: "Schedule Changes", icon: "RefreshCw" },
          { value: "score_update", label: "Live Score Updates", icon: "Zap" },
        ],
      },
    ],
  },
];

// Preview Component - Team Brand Card
function TeamPreview({ data }) {
  const primaryColor = data.primary_color || "#c9a962";
  const secondaryColor = data.secondary_color || "#3b82f6";

  return (
    <div className="space-y-4">
      {/* Team Brand Card */}
      <div
        className="rounded-2xl border border-white/[0.06] p-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 100%)`
        }}
      >
        {/* Color accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
          }}
        />

        <div className="flex items-center gap-4 mt-2">
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: `${primaryColor}30` }}
          >
            {data.logo ? (
              <img
                src={URL.createObjectURL(data.logo)}
                alt="Team Logo"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <Shield className="w-10 h-10" style={{ color: primaryColor }} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {data.team_name || "Team Name"}
            </h3>
            {data.abbreviation && (
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-bold mt-1"
                style={{ backgroundColor: primaryColor, color: "#000" }}
              >
                {data.abbreviation}
              </span>
            )}
            {data.motto && (
              <p className="text-white/50 text-sm mt-1 italic">"{data.motto}"</p>
            )}
          </div>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border-2 border-white/20"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="text-white/60 text-xs">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border-2 border-white/20"
              style={{ backgroundColor: secondaryColor }}
            />
            <span className="text-white/60 text-xs">Secondary</span>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {(data.instagram || data.twitter || data.website) && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Social Media
          </h4>
          <div className="space-y-2">
            {data.instagram && (
              <p className="text-white/80 text-sm flex items-center gap-2">
                <span className="text-pink-400">Instagram:</span> {data.instagram}
              </p>
            )}
            {data.twitter && (
              <p className="text-white/80 text-sm flex items-center gap-2">
                <span className="text-blue-400">Twitter:</span> {data.twitter}
              </p>
            )}
            {data.website && (
              <p className="text-white/80 text-sm flex items-center gap-2">
                <span className="text-[#c9a962]">Web:</span> {data.website}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Policies Summary */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Policies
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 rounded-lg bg-white/[0.04]">
            <span className="text-white/40 text-xs">Attendance</span>
            <p className="text-white font-medium">
              {data.practice_attendance ? `${data.practice_attendance}%` : "Not set"}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.04]">
            <span className="text-white/40 text-xs">Late Policy</span>
            <p className="text-white font-medium capitalize">
              {data.late_policy || "Not set"}
            </p>
          </div>
        </div>
      </div>

      {/* Parent Portal Access */}
      {data.parent_portal_access?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Parent Portal Access
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.parent_portal_access.map((access) => (
              <span
                key={access}
                className="px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-400 text-xs font-medium capitalize"
              >
                {access}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeamSettingsForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("id");
  const [savedData, setSavedData] = useState(null);

  const updateTeamMutation = useMutation({
    mutationFn: async (data) => {
      const teamSettings = {
        name: data.team_name,
        abbreviation: data.abbreviation,
        logo: data.logo?.name || null,
        motto: data.motto,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        social_media: {
          instagram: data.instagram,
          twitter: data.twitter,
          website: data.website,
          youtube: data.youtube,
        },
        policies: {
          practice_attendance: data.practice_attendance,
          late_policy: data.late_policy,
          playing_time_policy: data.playing_time_policy,
          code_of_conduct: data.code_of_conduct,
        },
        communication: {
          group_chat_link: data.group_chat_link,
          parent_portal_access: data.parent_portal_access,
          notification_settings: data.notification_settings,
        },
        updated_date: new Date().toISOString(),
      };

      if (teamId) {
        return base44.entities.Team.update(teamId, teamSettings);
      } else {
        teamSettings.status = "active";
        teamSettings.created_date = new Date().toISOString();
        return base44.entities.Team.create(teamSettings);
      }
    },
    onSuccess: (team) => {
      localStorage.removeItem("team_settings_draft");
      navigate(`/TeamDetail?id=${team.id || teamId}`);
    },
  });

  const handleSubmit = (data) => {
    updateTeamMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("team_settings_draft", JSON.stringify(data));
  };

  // Load draft from localStorage
  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("team_settings_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Team Settings"
        subtitle="Configure your team's identity, colors, and policies"
        sections={TEAM_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={TeamPreview}
        submitLabel={updateTeamMutation.isPending ? "Saving..." : "Save Team Settings"}
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
