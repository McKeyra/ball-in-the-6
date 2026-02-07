import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Scale, Check, Calendar, User, Shield } from "lucide-react";

// Code of Conduct Form Configuration
const CONDUCT_SECTIONS = [
  {
    id: "role",
    label: "Your Role",
    icon: "User",
    description: "Select the role that best describes your participation",
    fields: [
      {
        id: "participant_role",
        type: "pills",
        label: "I am signing as a",
        required: true,
        maxSelect: 1,
        options: [
          { value: "player", label: "Player" },
          { value: "parent", label: "Parent/Guardian" },
          { value: "coach", label: "Coach" },
          { value: "spectator", label: "Spectator" },
        ],
        hint: "This Code of Conduct applies to all participants regardless of role",
      },
      {
        id: "participant_name",
        type: "text",
        label: "Your Full Name",
        placeholder: "Enter your full legal name",
        required: true,
      },
      {
        id: "team_affiliation",
        type: "text",
        label: "Team Affiliation (if applicable)",
        placeholder: "Team name or 'N/A'",
        hint: "Enter the team you are associated with",
      },
    ],
  },
  {
    id: "acknowledgments",
    label: "Code Acknowledgments",
    icon: "Scale",
    description: "Please read and acknowledge each principle of our Code of Conduct",
    fields: [
      {
        id: "sportsmanship",
        type: "checkboxes",
        label: "Sportsmanship",
        required: true,
        options: [
          {
            value: "sportsmanship_accepted",
            label: "I Commit to Good Sportsmanship",
            description:
              "I will demonstrate respect for the game by playing fairly, accepting outcomes gracefully, and congratulating opponents regardless of the result. I will not engage in unsportsmanlike conduct including taunting, excessive celebration, or deliberate attempts to humiliate others.",
          },
        ],
      },
      {
        id: "respect_officials",
        type: "checkboxes",
        label: "Respect for Officials",
        required: true,
        options: [
          {
            value: "officials_accepted",
            label: "I Will Respect All Officials and Staff",
            description:
              "I will treat all referees, league officials, coaches, and staff members with respect and courtesy. I will accept officiating decisions without argument, understanding that officials are doing their best. I will not use abusive language, gestures, or behavior toward any official.",
          },
        ],
      },
      {
        id: "no_violence",
        type: "checkboxes",
        label: "Zero Tolerance for Violence",
        required: true,
        options: [
          {
            value: "violence_accepted",
            label: "I Agree to Zero Tolerance for Violence",
            description:
              "I understand that any form of physical violence, threats of violence, fighting, or aggressive physical contact outside of normal game play is strictly prohibited. This includes verbal abuse, bullying, hazing, and intimidation. I understand that violations may result in immediate removal and potential ban.",
          },
        ],
      },
      {
        id: "social_media_policy",
        type: "checkboxes",
        label: "Social Media Policy",
        required: true,
        options: [
          {
            value: "social_media_accepted",
            label: "I Will Follow the Social Media Policy",
            description:
              "I agree not to post any content on social media that is harmful, defamatory, or embarrassing to players, coaches, officials, or the organization. I will not share photos or videos of minors without proper consent. I understand that negative posts may result in disciplinary action.",
          },
        ],
      },
    ],
  },
  {
    id: "consequences",
    label: "Understanding Consequences",
    icon: "AlertTriangle",
    description: "Acknowledge that violations have real consequences",
    fields: [
      {
        id: "understand_penalties",
        type: "checkboxes",
        label: "Disciplinary Actions",
        required: true,
        options: [
          {
            value: "penalties_understood",
            label: "I Understand Penalties May Apply",
            description:
              "I acknowledge that violations of this Code of Conduct may result in disciplinary action including: verbal or written warnings, temporary suspension from games or practices, season-long suspension, permanent ban from the organization, and potential notification to other leagues or authorities as appropriate.",
          },
        ],
      },
      {
        id: "appeal_process",
        type: "checkboxes",
        label: "Appeal Process",
        options: [
          {
            value: "appeal_acknowledged",
            label: "I Understand the Appeal Process",
            description:
              "I understand that I have the right to appeal any disciplinary decision in writing within 7 days of notification. Appeals will be reviewed by the league conduct committee, and their decision will be final.",
          },
        ],
      },
    ],
  },
  {
    id: "commitment",
    label: "Commitment & Signature",
    icon: "FileSignature",
    description: "Finalize your commitment to upholding our standards",
    fields: [
      {
        id: "commitment_statement",
        type: "checkboxes",
        label: "Personal Commitment",
        required: true,
        options: [
          {
            value: "committed",
            label: "I Commit to Upholding This Code of Conduct",
            description:
              "I have read, understood, and agree to abide by this Code of Conduct. I understand that my participation in Ball in the 6 programs is contingent upon my adherence to these standards. I will be a positive ambassador for the sport and this organization.",
          },
        ],
      },
      {
        id: "typed_signature",
        type: "text",
        label: "Type Your Full Legal Name as Signature",
        placeholder: "Type your full name exactly",
        required: true,
        hint: "By typing your name, you confirm your agreement to this Code of Conduct",
      },
      {
        id: "signature_date",
        type: "text",
        label: "Today's Date",
        placeholder: "YYYY-MM-DD",
        required: true,
      },
    ],
  },
];

// Role badge colors
const ROLE_COLORS = {
  player: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400" },
  parent: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400" },
  coach: { bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-400" },
  spectator: { bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-400" },
};

// Preview Component - Conduct Agreement Card
function ConductPreview({ data }) {
  const role = data.participant_role?.[0];
  const roleColor = ROLE_COLORS[role] || ROLE_COLORS.player;

  const acknowledgments = [
    { key: "sportsmanship", label: "Sportsmanship", value: "sportsmanship_accepted" },
    { key: "respect_officials", label: "Respect Officials", value: "officials_accepted" },
    { key: "no_violence", label: "Zero Tolerance Violence", value: "violence_accepted" },
    { key: "social_media_policy", label: "Social Media Policy", value: "social_media_accepted" },
    { key: "understand_penalties", label: "Understand Penalties", value: "penalties_understood" },
  ];

  const acknowledgedCount = acknowledgments.filter(
    (ack) => data[ack.key]?.includes(ack.value)
  ).length;

  const isComplete =
    acknowledgedCount === acknowledgments.length &&
    data.commitment_statement?.includes("committed") &&
    data.typed_signature;

  return (
    <div className="space-y-4">
      {/* Agreement Card */}
      <div className="rounded-xl bg-gradient-to-br from-[#c9a962]/20 to-transparent border border-[#c9a962]/30 overflow-hidden">
        {/* Card Header */}
        <div className="bg-[#c9a962]/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#c9a962]" />
            <span className="text-[#c9a962] text-xs font-bold uppercase tracking-wide">
              Code of Conduct
            </span>
          </div>
          <div className="text-xs text-white/40">
            {new Date().getFullYear()} Season
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-4">
          {/* Participant Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center">
              <User className="w-6 h-6 text-white/40" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">
                {data.participant_name || "Your Name"}
              </p>
              <p className="text-white/40 text-sm">
                {data.team_affiliation || "Team Affiliation"}
              </p>
            </div>
          </div>

          {/* Role Badge */}
          {role && (
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${roleColor.bg} ${roleColor.border} border`}
            >
              <Shield className={`w-3 h-3 ${roleColor.text}`} />
              <span className={`text-sm font-medium capitalize ${roleColor.text}`}>
                {role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Acknowledgments Checklist */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wide">
            Acknowledgments
          </h4>
          <span className="text-xs text-white/40">
            {acknowledgedCount}/{acknowledgments.length}
          </span>
        </div>
        <div className="space-y-2">
          {acknowledgments.map((ack) => {
            const isChecked = data[ack.key]?.includes(ack.value);
            return (
              <div key={ack.key} className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isChecked ? "bg-emerald-500/20" : "bg-white/[0.05]"
                  }`}
                >
                  {isChecked ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  )}
                </div>
                <span
                  className={`text-sm ${isChecked ? "text-white" : "text-white/40"}`}
                >
                  {ack.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Commitment Status */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">
          Commitment
        </h4>
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              data.commitment_statement?.includes("committed")
                ? "bg-emerald-500/20"
                : "bg-white/[0.05]"
            }`}
          >
            {data.commitment_statement?.includes("committed") ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-white/20" />
            )}
          </div>
          <span
            className={`text-sm ${
              data.commitment_statement?.includes("committed")
                ? "text-white"
                : "text-white/40"
            }`}
          >
            Personal Commitment Made
          </span>
        </div>
      </div>

      {/* Signature Block */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">
          Signature
        </h4>
        {data.typed_signature ? (
          <>
            <p
              className="text-lg font-script text-[#c9a962] italic"
              style={{ fontFamily: "cursive" }}
            >
              {data.typed_signature}
            </p>
            <div className="flex items-center gap-2 mt-2 text-white/40 text-sm">
              <Calendar className="w-3 h-3" />
              <span>{data.signature_date || "Date pending"}</span>
            </div>
          </>
        ) : (
          <p className="text-white/40 text-sm italic">Awaiting signature...</p>
        )}
      </div>

      {/* Status Badge */}
      <div
        className={`rounded-xl p-4 text-center ${
          isComplete
            ? "bg-emerald-500/10 border border-emerald-500/30"
            : "bg-amber-500/10 border border-amber-500/30"
        }`}
      >
        <span
          className={`text-sm font-medium ${
            isComplete ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {isComplete ? "Agreement Complete" : "Please Complete All Sections"}
        </span>
      </div>
    </div>
  );
}

export default function CodeOfConduct() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const submitConductMutation = useMutation({
    mutationFn: async (data) => {
      const conductData = {
        participant_role: data.participant_role?.[0],
        participant_name: data.participant_name,
        team_affiliation: data.team_affiliation,
        sportsmanship_acknowledged: data.sportsmanship?.includes("sportsmanship_accepted"),
        respect_officials_acknowledged: data.respect_officials?.includes("officials_accepted"),
        no_violence_acknowledged: data.no_violence?.includes("violence_accepted"),
        social_media_acknowledged: data.social_media_policy?.includes("social_media_accepted"),
        penalties_understood: data.understand_penalties?.includes("penalties_understood"),
        appeal_acknowledged: data.appeal_process?.includes("appeal_acknowledged"),
        commitment_made: data.commitment_statement?.includes("committed"),
        signature: data.typed_signature,
        signature_date: data.signature_date,
        signed_at: new Date().toISOString(),
        status: "active",
        season: new Date().getFullYear().toString(),
      };

      return base44.entities.CodeOfConduct.create(conductData);
    },
    onSuccess: (result) => {
      localStorage.removeItem("code_of_conduct_draft");
      navigate("/Dashboard");
    },
  });

  const handleSubmit = (data) => {
    submitConductMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("code_of_conduct_draft", JSON.stringify(data));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("code_of_conduct_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Code of Conduct Agreement"
        subtitle="Please read and acknowledge our community standards"
        sections={CONDUCT_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={ConductPreview}
        submitLabel={submitConductMutation.isPending ? "Submitting..." : "Sign Agreement"}
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
