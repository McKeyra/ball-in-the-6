import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { User, Star, ThumbsUp, Lightbulb, MessageCircle, Shield } from "lucide-react";

// Coach Evaluation Form Configuration
const EVALUATION_SECTIONS = [
  {
    id: "coach",
    label: "Coach Information",
    icon: "User",
    fields: [
      {
        id: "coach_name",
        type: "select",
        label: "Select Coach",
        required: true,
        placeholder: "Choose the coach to evaluate",
        options: [
          { value: "coach_smith", label: "Coach Smith" },
          { value: "coach_johnson", label: "Coach Johnson" },
          { value: "coach_williams", label: "Coach Williams" },
          { value: "coach_brown", label: "Coach Brown" },
          { value: "coach_davis", label: "Coach Davis" },
          { value: "coach_miller", label: "Coach Miller" },
        ],
      },
      {
        id: "team",
        type: "select",
        label: "Team",
        required: true,
        placeholder: "Select your team",
        options: [
          { value: "u10_thunder", label: "U10 Thunder" },
          { value: "u12_lightning", label: "U12 Lightning" },
          { value: "u14_storm", label: "U14 Storm" },
          { value: "u16_titans", label: "U16 Titans" },
          { value: "u18_elite", label: "U18 Elite" },
        ],
      },
      {
        id: "season",
        type: "select",
        label: "Season",
        required: true,
        placeholder: "Select the season",
        options: [
          { value: "fall_2025", label: "Fall 2025" },
          { value: "winter_2025", label: "Winter 2025-26" },
          { value: "spring_2026", label: "Spring 2026" },
          { value: "summer_2026", label: "Summer 2026" },
        ],
      },
    ],
  },
  {
    id: "ratings",
    label: "Performance Ratings",
    icon: "Star",
    fields: [
      {
        id: "communication_rating",
        type: "cards",
        label: "Communication",
        required: true,
        columns: 5,
        hint: "How well does the coach communicate with players and parents?",
        options: [
          { value: "1", label: "1", icon: "Star", description: "Poor" },
          { value: "2", label: "2", icon: "Star", description: "Below Average" },
          { value: "3", label: "3", icon: "Star", description: "Average" },
          { value: "4", label: "4", icon: "Star", description: "Good" },
          { value: "5", label: "5", icon: "Star", description: "Excellent" },
        ],
      },
      {
        id: "knowledge_rating",
        type: "cards",
        label: "Basketball Knowledge",
        required: true,
        columns: 5,
        hint: "Rate the coach's understanding and teaching of the game",
        options: [
          { value: "1", label: "1", icon: "Star", description: "Poor" },
          { value: "2", label: "2", icon: "Star", description: "Below Average" },
          { value: "3", label: "3", icon: "Star", description: "Average" },
          { value: "4", label: "4", icon: "Star", description: "Good" },
          { value: "5", label: "5", icon: "Star", description: "Excellent" },
        ],
      },
      {
        id: "development_rating",
        type: "cards",
        label: "Player Development",
        required: true,
        columns: 5,
        hint: "How effective is the coach at developing players' skills?",
        options: [
          { value: "1", label: "1", icon: "Star", description: "Poor" },
          { value: "2", label: "2", icon: "Star", description: "Below Average" },
          { value: "3", label: "3", icon: "Star", description: "Average" },
          { value: "4", label: "4", icon: "Star", description: "Good" },
          { value: "5", label: "5", icon: "Star", description: "Excellent" },
        ],
      },
      {
        id: "fairness_rating",
        type: "cards",
        label: "Fairness & Equal Treatment",
        required: true,
        columns: 5,
        hint: "Does the coach treat all players fairly and equally?",
        options: [
          { value: "1", label: "1", icon: "Star", description: "Poor" },
          { value: "2", label: "2", icon: "Star", description: "Below Average" },
          { value: "3", label: "3", icon: "Star", description: "Average" },
          { value: "4", label: "4", icon: "Star", description: "Good" },
          { value: "5", label: "5", icon: "Star", description: "Excellent" },
        ],
      },
    ],
  },
  {
    id: "strengths",
    label: "Coach Strengths",
    icon: "ThumbsUp",
    fields: [
      {
        id: "coach_strengths",
        type: "checkboxes",
        label: "What does this coach do well?",
        hint: "Select all that apply",
        options: [
          { value: "motivating", label: "Motivating Players", description: "Inspires and encourages the team" },
          { value: "teaching_fundamentals", label: "Teaching Fundamentals", description: "Excellent at basics" },
          { value: "game_strategy", label: "Game Strategy", description: "Smart play calling and tactics" },
          { value: "positive_attitude", label: "Positive Attitude", description: "Maintains positivity" },
          { value: "patience", label: "Patient & Understanding", description: "Takes time with players" },
          { value: "organization", label: "Well Organized", description: "Structured practices and games" },
          { value: "inclusive", label: "Inclusive", description: "Makes everyone feel valued" },
          { value: "adaptable", label: "Adaptable", description: "Adjusts to situations" },
          { value: "role_model", label: "Great Role Model", description: "Sets good example" },
          { value: "conflict_resolution", label: "Handles Conflicts Well", description: "Resolves issues calmly" },
        ],
      },
    ],
  },
  {
    id: "improvements",
    label: "Areas to Improve",
    icon: "Lightbulb",
    fields: [
      {
        id: "improvement_areas",
        type: "checkboxes",
        label: "What areas could the coach improve?",
        hint: "Select areas where you'd like to see growth",
        options: [
          { value: "communication", label: "Communication", description: "Clearer updates and feedback" },
          { value: "equal_playing_time", label: "Playing Time Distribution", description: "More balanced minutes" },
          { value: "individual_attention", label: "Individual Attention", description: "More one-on-one coaching" },
          { value: "practice_variety", label: "Practice Variety", description: "More diverse drills" },
          { value: "game_management", label: "Game Management", description: "Better in-game decisions" },
          { value: "parent_interaction", label: "Parent Interaction", description: "Better parent communication" },
          { value: "punctuality", label: "Punctuality", description: "Starting/ending on time" },
          { value: "technical_skills", label: "Technical Instruction", description: "More skill-focused training" },
        ],
      },
    ],
  },
  {
    id: "comments",
    label: "Additional Comments",
    icon: "MessageCircle",
    fields: [
      {
        id: "open_feedback",
        type: "textarea",
        label: "Open Feedback",
        placeholder: "Share any additional thoughts, specific examples, or suggestions for the coach...",
        rows: 6,
        hint: "Be specific and constructive in your feedback",
      },
    ],
  },
  {
    id: "anonymous",
    label: "Submission Options",
    icon: "Shield",
    fields: [
      {
        id: "is_anonymous",
        type: "pills",
        label: "Would you like to submit anonymously?",
        required: true,
        maxSelect: 1,
        hint: "Anonymous submissions help ensure honest feedback",
        options: [
          { value: "yes", label: "Yes, keep anonymous" },
          { value: "no", label: "No, include my name" },
        ],
      },
      {
        id: "contact_permission",
        type: "checkboxes",
        label: "May we follow up with you?",
        hint: "Only if you chose not to be anonymous",
        options: [
          { value: "follow_up", label: "Yes, you may contact me to discuss my feedback" },
        ],
      },
    ],
  },
];

// Preview Component
function EvaluationPreview({ data }) {
  const communicationScore = parseInt(data.communication_rating) || 0;
  const knowledgeScore = parseInt(data.knowledge_rating) || 0;
  const developmentScore = parseInt(data.development_rating) || 0;
  const fairnessScore = parseInt(data.fairness_rating) || 0;

  const totalScore = communicationScore + knowledgeScore + developmentScore + fairnessScore;
  const avgScore = totalScore > 0 ? (totalScore / 4).toFixed(1) : 0;

  const getScoreColor = (score) => {
    if (score >= 4) return "text-emerald-400";
    if (score >= 3) return "text-[#c9a962]";
    if (score >= 2) return "text-yellow-400";
    return "text-red-400";
  };

  const getOverallColor = (avg) => {
    if (avg >= 4) return "from-emerald-500/30 to-emerald-500/5 border-emerald-500/40";
    if (avg >= 3) return "from-[#c9a962]/30 to-[#c9a962]/5 border-[#c9a962]/40";
    if (avg >= 2) return "from-yellow-500/30 to-yellow-500/5 border-yellow-500/40";
    return "from-red-500/30 to-red-500/5 border-red-500/40";
  };

  const coachDisplayName = data.coach_name ?
    data.coach_name.replace(/_/g, " ").replace(/coach /i, "Coach ") :
    "Coach Name";

  return (
    <div className="space-y-4">
      {/* Evaluation Summary Card */}
      <div className={`rounded-2xl bg-gradient-to-br ${getOverallColor(avgScore)} border p-5`}>
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
          Evaluation Summary
        </h4>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-white/[0.1] flex items-center justify-center">
            <User className="w-7 h-7 text-[#c9a962]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white capitalize">
              {coachDisplayName}
            </h3>
            <p className="text-white/40 text-sm">
              {data.team?.replace(/_/g, " ") || "Team"} | {data.season?.replace(/_/g, " ") || "Season"}
            </p>
          </div>
        </div>

        <div className="text-center py-3 border-t border-white/[0.1]">
          <div className={`text-4xl font-bold ${getScoreColor(parseFloat(avgScore))}`}>
            {avgScore || "—"}
          </div>
          <div className="text-white/40 text-sm mt-1">Average Rating / 5</div>
        </div>
      </div>

      {/* Individual Ratings */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
          Rating Breakdown
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Communication</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 rounded-full bg-white/[0.1] overflow-hidden">
                <div
                  className="h-full bg-[#c9a962] rounded-full transition-all duration-300"
                  style={{ width: `${(communicationScore / 5) * 100}%` }}
                />
              </div>
              <span className={`font-medium w-6 text-right ${getScoreColor(communicationScore)}`}>
                {communicationScore || "—"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Knowledge</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 rounded-full bg-white/[0.1] overflow-hidden">
                <div
                  className="h-full bg-[#c9a962] rounded-full transition-all duration-300"
                  style={{ width: `${(knowledgeScore / 5) * 100}%` }}
                />
              </div>
              <span className={`font-medium w-6 text-right ${getScoreColor(knowledgeScore)}`}>
                {knowledgeScore || "—"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Development</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 rounded-full bg-white/[0.1] overflow-hidden">
                <div
                  className="h-full bg-[#c9a962] rounded-full transition-all duration-300"
                  style={{ width: `${(developmentScore / 5) * 100}%` }}
                />
              </div>
              <span className={`font-medium w-6 text-right ${getScoreColor(developmentScore)}`}>
                {developmentScore || "—"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Fairness</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 rounded-full bg-white/[0.1] overflow-hidden">
                <div
                  className="h-full bg-[#c9a962] rounded-full transition-all duration-300"
                  style={{ width: `${(fairnessScore / 5) * 100}%` }}
                />
              </div>
              <span className={`font-medium w-6 text-right ${getScoreColor(fairnessScore)}`}>
                {fairnessScore || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths */}
      {data.coach_strengths?.length > 0 && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-2">
            Strengths Noted
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.coach_strengths.slice(0, 5).map((strength) => (
              <span
                key={strength}
                className="px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-400 text-xs font-medium capitalize"
              >
                {strength.replace(/_/g, " ")}
              </span>
            ))}
            {data.coach_strengths.length > 5 && (
              <span className="px-2 py-1 text-white/40 text-xs">
                +{data.coach_strengths.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Anonymous Status */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${data.is_anonymous?.[0] === "yes" ? "text-emerald-400" : "text-white/40"}`} />
          <span className="text-white text-sm">
            {data.is_anonymous?.[0] === "yes" ? "Anonymous Submission" : "Named Submission"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CoachEvaluation() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const submitEvaluationMutation = useMutation({
    mutationFn: async (data) => {
      const evaluationData = {
        type: "coach_evaluation",
        coach_name: data.coach_name,
        team: data.team,
        season: data.season,
        communication_rating: parseInt(data.communication_rating),
        knowledge_rating: parseInt(data.knowledge_rating),
        development_rating: parseInt(data.development_rating),
        fairness_rating: parseInt(data.fairness_rating),
        coach_strengths: data.coach_strengths,
        improvement_areas: data.improvement_areas,
        open_feedback: data.open_feedback,
        is_anonymous: data.is_anonymous?.[0] === "yes",
        contact_permission: data.contact_permission?.includes("follow_up"),
        submitted_at: new Date().toISOString(),
      };

      return base44.entities.Evaluation.create(evaluationData);
    },
    onSuccess: () => {
      localStorage.removeItem("coach_evaluation_draft");
      navigate("/Dashboard");
    },
  });

  const handleSubmit = (data) => {
    submitEvaluationMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("coach_evaluation_draft", JSON.stringify(data));
  };

  const initialData = useMemo(() => {
    try {
      const draft = localStorage.getItem("coach_evaluation_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Coach Evaluation"
        subtitle="Share your feedback about your child's coach"
        sections={EVALUATION_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={EvaluationPreview}
        submitLabel={submitEvaluationMutation.isPending ? "Submitting..." : "Submit Evaluation"}
        skipLabel="Skip"
        defaultMode="form"
      />
    </div>
  );
}
