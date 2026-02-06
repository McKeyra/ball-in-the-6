import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Gauge, MessageSquare, Tags, Phone } from "lucide-react";

// NPS Survey Form Configuration
const NPS_SECTIONS = [
  {
    id: "score",
    label: "Your Score",
    icon: "Gauge",
    fields: [
      {
        id: "nps_score",
        type: "cards",
        label: "How likely are you to recommend Ball in the 6 to a friend or colleague?",
        required: true,
        columns: 11,
        hint: "0 = Not at all likely, 10 = Extremely likely",
        options: [
          { value: "0", label: "0", description: "Not at all likely" },
          { value: "1", label: "1", description: "" },
          { value: "2", label: "2", description: "" },
          { value: "3", label: "3", description: "" },
          { value: "4", label: "4", description: "" },
          { value: "5", label: "5", description: "Neutral" },
          { value: "6", label: "6", description: "" },
          { value: "7", label: "7", description: "" },
          { value: "8", label: "8", description: "" },
          { value: "9", label: "9", description: "" },
          { value: "10", label: "10", description: "Extremely likely" },
        ],
      },
    ],
  },
  {
    id: "reason",
    label: "Tell Us More",
    icon: "MessageSquare",
    fields: [
      {
        id: "score_reason",
        type: "textarea",
        label: "What's the primary reason for your score?",
        required: true,
        placeholder: "Please share what influenced your rating...",
        rows: 5,
        hint: "Your honest feedback helps us improve",
      },
    ],
  },
  {
    id: "category",
    label: "Key Factors",
    icon: "Tags",
    fields: [
      {
        id: "main_factors",
        type: "pills",
        label: "Which areas most influenced your score?",
        hint: "Select the top factors that affected your rating",
        maxSelect: 3,
        options: [
          { value: "coaching", label: "Coaching Quality" },
          { value: "facilities", label: "Facilities" },
          { value: "organization", label: "Organization" },
          { value: "value", label: "Value for Money" },
          { value: "community", label: "Community & Culture" },
          { value: "communication", label: "Communication" },
          { value: "player_development", label: "Player Development" },
          { value: "game_experience", label: "Game Experience" },
        ],
      },
      {
        id: "factor_details",
        type: "checkboxes",
        label: "What specific aspects stand out?",
        hint: "Select all that apply to your experience",
        options: [
          { value: "coach_knowledge", label: "Coach Knowledge", description: "Expertise in basketball" },
          { value: "coach_communication", label: "Coach Communication", description: "Clear and timely updates" },
          { value: "skill_improvement", label: "Skill Improvement", description: "Noticeable player growth" },
          { value: "fun_environment", label: "Fun Environment", description: "Enjoyable atmosphere" },
          { value: "fair_treatment", label: "Fair Treatment", description: "Equal opportunities" },
          { value: "well_organized", label: "Well Organized", description: "Smooth operations" },
          { value: "good_value", label: "Good Value", description: "Worth the investment" },
          { value: "friendly_community", label: "Friendly Community", description: "Welcoming people" },
          { value: "quality_facilities", label: "Quality Facilities", description: "Good courts/equipment" },
          { value: "convenient_schedule", label: "Convenient Schedule", description: "Works for families" },
        ],
      },
    ],
  },
  {
    id: "followup",
    label: "Follow-Up",
    icon: "Phone",
    fields: [
      {
        id: "can_contact",
        type: "checkboxes",
        label: "May we contact you to discuss your feedback?",
        hint: "We'd love to learn more about your experience",
        options: [
          { value: "yes", label: "Yes, you may contact me", description: "I'm open to a follow-up conversation" },
        ],
      },
      {
        id: "contact_email",
        type: "text",
        label: "Email Address",
        placeholder: "your.email@example.com",
        hint: "Only required if you selected yes above",
      },
      {
        id: "contact_phone",
        type: "text",
        label: "Phone Number (optional)",
        placeholder: "(416) 555-0123",
        hint: "If you prefer a phone call",
      },
      {
        id: "best_time",
        type: "pills",
        label: "Best time to reach you?",
        maxSelect: 2,
        options: [
          { value: "morning", label: "Morning" },
          { value: "afternoon", label: "Afternoon" },
          { value: "evening", label: "Evening" },
          { value: "weekend", label: "Weekend" },
        ],
      },
    ],
  },
];

// Preview Component
function NPSPreview({ data }) {
  const npsScore = parseInt(data.nps_score);
  const hasScore = !isNaN(npsScore);

  const getNPSCategory = (score) => {
    if (score >= 9) return { label: "Promoter", color: "emerald", description: "Loyal enthusiast" };
    if (score >= 7) return { label: "Passive", color: "yellow", description: "Satisfied but unenthusiastic" };
    return { label: "Detractor", color: "red", description: "Unhappy customer" };
  };

  const category = hasScore ? getNPSCategory(npsScore) : null;

  const getScoreBackgroundStyle = () => {
    if (!hasScore) return "from-white/10 to-transparent border-white/20";
    if (npsScore >= 9) return "from-emerald-500/30 to-emerald-500/5 border-emerald-500/50";
    if (npsScore >= 7) return "from-yellow-500/30 to-yellow-500/5 border-yellow-500/50";
    return "from-red-500/30 to-red-500/5 border-red-500/50";
  };

  const getScoreTextColor = () => {
    if (!hasScore) return "text-white/40";
    if (npsScore >= 9) return "text-emerald-400";
    if (npsScore >= 7) return "text-yellow-400";
    return "text-red-400";
  };

  const getCategoryBadgeStyle = () => {
    if (!category) return "";
    if (category.color === "emerald") return "bg-emerald-400/20 text-emerald-400 border-emerald-400/30";
    if (category.color === "yellow") return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30";
    return "bg-red-400/20 text-red-400 border-red-400/30";
  };

  // Score scale visualization
  const renderScoreScale = () => {
    return (
      <div className="flex items-center justify-between gap-1 mt-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const isSelected = npsScore === num;
          const isDetractor = num <= 6;
          const isPassive = num >= 7 && num <= 8;
          const isPromoter = num >= 9;

          let bgColor = "bg-white/[0.08]";
          if (isSelected) {
            if (isDetractor) bgColor = "bg-red-500";
            else if (isPassive) bgColor = "bg-yellow-500";
            else if (isPromoter) bgColor = "bg-emerald-500";
          }

          return (
            <div
              key={num}
              className={`
                w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium
                transition-all duration-300
                ${bgColor}
                ${isSelected ? "text-black scale-125 shadow-lg" : "text-white/40"}
              `}
            >
              {num}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* NPS Score Display */}
      <div className={`rounded-2xl bg-gradient-to-br ${getScoreBackgroundStyle()} border p-5`}>
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4">
          NPS Score
        </h4>

        <div className="text-center">
          <div className={`text-7xl font-bold ${getScoreTextColor()} transition-colors duration-300`}>
            {hasScore ? npsScore : "—"}
          </div>

          {category && (
            <div className="mt-3">
              <span className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                border ${getCategoryBadgeStyle()}
              `}>
                <span className={`w-2 h-2 rounded-full ${
                  category.color === "emerald" ? "bg-emerald-400" :
                  category.color === "yellow" ? "bg-yellow-400" : "bg-red-400"
                }`} />
                {category.label}
              </span>
              <p className="text-white/40 text-xs mt-2">{category.description}</p>
            </div>
          )}
        </div>

        {/* Score Scale */}
        {renderScoreScale()}

        {/* Scale Labels */}
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-red-400/60">Detractor</span>
          <span className="text-yellow-400/60">Passive</span>
          <span className="text-emerald-400/60">Promoter</span>
        </div>
      </div>

      {/* Key Factors */}
      {data.main_factors?.length > 0 && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-2">
            Key Factors
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.main_factors.map((factor) => (
              <span
                key={factor}
                className="px-3 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-sm font-medium capitalize border border-[#c9a962]/30"
              >
                {factor.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Specific Aspects */}
      {data.factor_details?.length > 0 && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-2">
            Standout Aspects
          </h4>
          <div className="space-y-1">
            {data.factor_details.slice(0, 5).map((detail) => (
              <div key={detail} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c9a962]" />
                <span className="text-white/70 capitalize">{detail.replace(/_/g, " ")}</span>
              </div>
            ))}
            {data.factor_details.length > 5 && (
              <div className="text-white/40 text-xs pl-3">
                +{data.factor_details.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Preview */}
      {data.score_reason && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-2">
            Feedback
          </h4>
          <p className="text-white/70 text-sm line-clamp-3">
            "{data.score_reason}"
          </p>
        </div>
      )}

      {/* Contact Preference */}
      {data.can_contact?.includes("yes") && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Open to Follow-Up</span>
          </div>
          {data.contact_email && (
            <p className="text-white/60 text-xs mt-2">{data.contact_email}</p>
          )}
          {data.best_time?.length > 0 && (
            <p className="text-white/40 text-xs mt-1">
              Best time: {data.best_time.join(", ")}
            </p>
          )}
        </div>
      )}

      {/* NPS Explanation */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">
          About NPS
        </h4>
        <div className="space-y-1 text-xs text-white/30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500/50" />
            <span>9-10: Promoters - Loyal enthusiasts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <span>7-8: Passives - Satisfied but vulnerable</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/50" />
            <span>0-6: Detractors - Unhappy customers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NPSSurvey() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const submitNPSMutation = useMutation({
    mutationFn: async (data) => {
      const npsScore = parseInt(data.nps_score);
      let category = "detractor";
      if (npsScore >= 9) category = "promoter";
      else if (npsScore >= 7) category = "passive";

      const npsData = {
        type: "nps_survey",
        nps_score: npsScore,
        nps_category: category,
        score_reason: data.score_reason,
        main_factors: data.main_factors,
        factor_details: data.factor_details,
        can_contact: data.can_contact?.includes("yes"),
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        best_time: data.best_time,
        submitted_at: new Date().toISOString(),
      };

      return base44.entities.Survey.create(npsData);
    },
    onSuccess: () => {
      localStorage.removeItem("nps_survey_draft");
      navigate("/Dashboard");
    },
  });

  const handleSubmit = (data) => {
    submitNPSMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("nps_survey_draft", JSON.stringify(data));
  };

  const initialData = useMemo(() => {
    try {
      const draft = localStorage.getItem("nps_survey_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Quick Feedback Survey"
        subtitle="Help us understand how we're doing with one simple question"
        sections={NPS_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={NPSPreview}
        submitLabel={submitNPSMutation.isPending ? "Submitting..." : "Submit Feedback"}
        skipLabel="Skip"
        defaultMode="wizard"
      />
    </div>
  );
}
