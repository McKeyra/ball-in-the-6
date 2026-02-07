import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";

// Season Survey Form Configuration
const SEASON_SECTIONS = [
  {
    id: "overall",
    label: "Overall Experience",
    icon: "Star",
    fields: [
      {
        id: "season_rating",
        type: "cards",
        label: "How would you rate this season overall?",
        required: true,
        columns: 5,
        options: [
          { value: "1", label: "1", description: "Very Poor" },
          { value: "2", label: "2", description: "Poor" },
          { value: "3", label: "3", description: "Fair" },
          { value: "4", label: "4", description: "Average" },
          { value: "5", label: "5", description: "Good" },
          { value: "6", label: "6", description: "Above Average" },
          { value: "7", label: "7", description: "Very Good" },
          { value: "8", label: "8", description: "Great" },
          { value: "9", label: "9", description: "Excellent" },
          { value: "10", label: "10", description: "Outstanding" },
        ],
      },
      {
        id: "would_recommend",
        type: "pills",
        label: "Would you recommend our league to other families?",
        required: true,
        maxSelect: 1,
        options: [
          { value: "definitely_yes", label: "Definitely Yes" },
          { value: "probably_yes", label: "Probably Yes" },
          { value: "not_sure", label: "Not Sure" },
          { value: "probably_no", label: "Probably No" },
          { value: "definitely_no", label: "Definitely No" },
        ],
      },
    ],
  },
  {
    id: "experience",
    label: "Experience Details",
    icon: "TrendingUp",
    fields: [
      {
        id: "coaching_quality",
        type: "cards",
        label: "Coaching Quality",
        required: true,
        columns: 5,
        hint: "Rate the overall quality of coaching this season",
        options: [
          { value: "1", label: "1", icon: "Star", description: "Poor" },
          { value: "2", label: "2", icon: "Star", description: "Below Average" },
          { value: "3", label: "3", icon: "Star", description: "Average" },
          { value: "4", label: "4", icon: "Star", description: "Good" },
          { value: "5", label: "5", icon: "Star", description: "Excellent" },
        ],
      },
      {
        id: "organization_quality",
        type: "cards",
        label: "Organization & Administration",
        required: true,
        columns: 5,
        hint: "Rate the league organization and administration",
        options: [
          { value: "1", label: "1", icon: "Star", description: "Poor" },
          { value: "2", label: "2", icon: "Star", description: "Below Average" },
          { value: "3", label: "3", icon: "Star", description: "Average" },
          { value: "4", label: "4", icon: "Star", description: "Good" },
          { value: "5", label: "5", icon: "Star", description: "Excellent" },
        ],
      },
      {
        id: "communication_quality",
        type: "cards",
        label: "Communication",
        required: true,
        columns: 5,
        hint: "Rate the communication from coaches and league",
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
    id: "highlights",
    label: "Season Highlights",
    icon: "Award",
    fields: [
      {
        id: "best_moment",
        type: "textarea",
        label: "What was the best moment of the season?",
        placeholder: "Share a memorable moment, achievement, or highlight from this season...",
        rows: 4,
        hint: "Help us understand what made this season special",
      },
      {
        id: "player_growth",
        type: "checkboxes",
        label: "In which areas did your player grow?",
        hint: "Select all areas where you noticed improvement",
        options: [
          { value: "skills", label: "Basketball Skills", description: "Shooting, dribbling, passing" },
          { value: "teamwork", label: "Teamwork", description: "Working with teammates" },
          { value: "confidence", label: "Confidence", description: "Self-belief and courage" },
          { value: "fitness", label: "Physical Fitness", description: "Strength, endurance, agility" },
          { value: "sportsmanship", label: "Sportsmanship", description: "Fair play and respect" },
          { value: "leadership", label: "Leadership", description: "Taking initiative" },
          { value: "game_understanding", label: "Game Understanding", description: "Basketball IQ" },
        ],
      },
    ],
  },
  {
    id: "improvements",
    label: "Areas for Improvement",
    icon: "MessageSquare",
    fields: [
      {
        id: "what_could_be_better",
        type: "textarea",
        label: "What could we do better next season?",
        placeholder: "Share your suggestions for how we can improve the experience...",
        rows: 5,
        hint: "Your feedback helps us improve for everyone",
      },
      {
        id: "improvement_areas",
        type: "checkboxes",
        label: "Which areas need the most improvement?",
        options: [
          { value: "scheduling", label: "Game Scheduling", description: "Game times and locations" },
          { value: "facilities", label: "Facilities", description: "Gyms and equipment" },
          { value: "communication", label: "Communication", description: "Updates and notifications" },
          { value: "coaching", label: "Coaching", description: "Training and development" },
          { value: "refs", label: "Officiating", description: "Referees and game management" },
          { value: "fees", label: "Fees & Value", description: "Cost vs value received" },
        ],
      },
    ],
  },
  {
    id: "future",
    label: "Future Plans",
    icon: "CalendarCheck",
    fields: [
      {
        id: "returning_next_season",
        type: "pills",
        label: "Are you planning to return next season?",
        required: true,
        maxSelect: 1,
        options: [
          { value: "definitely", label: "Definitely" },
          { value: "likely", label: "Likely" },
          { value: "undecided", label: "Undecided" },
          { value: "unlikely", label: "Unlikely" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "refer_friends",
        type: "cards",
        label: "How many friends/families might you refer to our league?",
        columns: 5,
        options: [
          { value: "0", label: "None", description: "Not planning to refer" },
          { value: "1-2", label: "1-2", description: "A couple families" },
          { value: "3-5", label: "3-5", description: "A few families" },
          { value: "5+", label: "5+", description: "Many families" },
        ],
      },
      {
        id: "additional_comments",
        type: "textarea",
        label: "Any additional comments?",
        placeholder: "Anything else you'd like to share with us...",
        rows: 3,
      },
    ],
  },
];

// Preview Component
function SurveyPreview({ data }) {
  const seasonRating = parseInt(data.season_rating) || 0;
  const coachingScore = parseInt(data.coaching_quality) || 0;
  const orgScore = parseInt(data.organization_quality) || 0;
  const commScore = parseInt(data.communication_quality) || 0;
  const avgExperienceScore = coachingScore + orgScore + commScore > 0
    ? ((coachingScore + orgScore + commScore) / 3).toFixed(1)
    : 0;

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-emerald-400";
    if (rating >= 6) return "text-[#c9a962]";
    if (rating >= 4) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreColor = (score) => {
    if (score >= 4) return "text-emerald-400";
    if (score >= 3) return "text-[#c9a962]";
    return "text-yellow-400";
  };

  return (
    <div className="space-y-4">
      {/* Overall Rating Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#c9a962]/20 to-transparent border border-[#c9a962]/30 p-5">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
          Satisfaction Summary
        </h4>

        <div className="text-center mb-4">
          <div className={`text-5xl font-bold ${getRatingColor(seasonRating)}`}>
            {seasonRating || "—"}
          </div>
          <div className="text-white/40 text-sm mt-1">Season Rating / 10</div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-white/[0.04]">
            <div className={`text-lg font-bold ${getScoreColor(coachingScore)}`}>
              {coachingScore || "—"}
            </div>
            <div className="text-white/40 text-xs">Coaching</div>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.04]">
            <div className={`text-lg font-bold ${getScoreColor(orgScore)}`}>
              {orgScore || "—"}
            </div>
            <div className="text-white/40 text-xs">Organization</div>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.04]">
            <div className={`text-lg font-bold ${getScoreColor(commScore)}`}>
              {commScore || "—"}
            </div>
            <div className="text-white/40 text-xs">Communication</div>
          </div>
        </div>
      </div>

      {/* Recommendation Status */}
      {data.would_recommend && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              data.would_recommend[0]?.includes("yes") ? "bg-emerald-400" :
              data.would_recommend[0] === "not_sure" ? "bg-yellow-400" : "bg-red-400"
            }`} />
            <span className="text-white capitalize">
              {data.would_recommend[0]?.replace(/_/g, " ") || "—"}
            </span>
          </div>
          <div className="text-white/40 text-xs mt-1">Would Recommend</div>
        </div>
      )}

      {/* Growth Areas */}
      {data.player_growth?.length > 0 && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-2">
            Growth Areas
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.player_growth.map((area) => (
              <span
                key={area}
                className="px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-400 text-xs font-medium capitalize"
              >
                {area.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Return Status */}
      {data.returning_next_season && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Returning Next Season</span>
            <span className={`font-medium capitalize ${
              data.returning_next_season[0] === "definitely" || data.returning_next_season[0] === "likely"
                ? "text-emerald-400"
                : data.returning_next_season[0] === "undecided"
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}>
              {data.returning_next_season[0] || "—"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeasonSurvey() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const submitSurveyMutation = useMutation({
    mutationFn: async (data) => {
      const surveyData = {
        type: "season_survey",
        season_rating: parseInt(data.season_rating),
        would_recommend: data.would_recommend?.[0],
        coaching_quality: parseInt(data.coaching_quality),
        organization_quality: parseInt(data.organization_quality),
        communication_quality: parseInt(data.communication_quality),
        best_moment: data.best_moment,
        player_growth: data.player_growth,
        what_could_be_better: data.what_could_be_better,
        improvement_areas: data.improvement_areas,
        returning_next_season: data.returning_next_season?.[0],
        refer_friends: data.refer_friends,
        additional_comments: data.additional_comments,
        submitted_at: new Date().toISOString(),
      };

      return base44.entities.Survey.create(surveyData);
    },
    onSuccess: () => {
      localStorage.removeItem("season_survey_draft");
      navigate("/Dashboard");
    },
  });

  const handleSubmit = (data) => {
    submitSurveyMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("season_survey_draft", JSON.stringify(data));
  };

  const initialData = useMemo(() => {
    try {
      const draft = localStorage.getItem("season_survey_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="End of Season Survey"
        subtitle="Help us improve by sharing your feedback about this season"
        sections={SEASON_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={SurveyPreview}
        submitLabel={submitSurveyMutation.isPending ? "Submitting..." : "Submit Survey"}
        skipLabel="Skip"
        defaultMode="form"
      />
    </div>
  );
}
