import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Calendar, Star, Truck, ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";

// Event Feedback Form Configuration
const EVENT_SECTIONS = [
  {
    id: "event",
    label: "Event Information",
    icon: "Calendar",
    fields: [
      {
        id: "event_name",
        type: "select",
        label: "Select Event",
        required: true,
        placeholder: "Choose the event you attended",
        options: [
          { value: "spring_classic_2026", label: "Spring Classic 2026" },
          { value: "summer_showcase_2026", label: "Summer Showcase 2026" },
          { value: "fall_invitational_2025", label: "Fall Invitational 2025" },
          { value: "winter_tournament_2025", label: "Winter Tournament 2025-26" },
          { value: "skills_camp_march", label: "Skills Camp - March" },
          { value: "all_star_weekend", label: "All-Star Weekend" },
          { value: "championship_finals", label: "Championship Finals" },
        ],
      },
      {
        id: "attendee_role",
        type: "pills",
        label: "Your Role at the Event",
        required: true,
        maxSelect: 1,
        options: [
          { value: "player", label: "Player" },
          { value: "parent", label: "Parent/Guardian" },
          { value: "coach", label: "Coach" },
          { value: "spectator", label: "Spectator" },
        ],
      },
    ],
  },
  {
    id: "experience",
    label: "Overall Experience",
    icon: "Star",
    fields: [
      {
        id: "overall_rating",
        type: "cards",
        label: "Overall Event Rating",
        required: true,
        columns: 5,
        hint: "How would you rate the event overall?",
        options: [
          { value: "1", label: "1", icon: "Star", description: "Poor" },
          { value: "2", label: "2", icon: "Star", description: "Below Average" },
          { value: "3", label: "3", icon: "Star", description: "Average" },
          { value: "4", label: "4", icon: "Star", description: "Good" },
          { value: "5", label: "5", icon: "Star", description: "Excellent" },
        ],
      },
      {
        id: "venue_rating",
        type: "cards",
        label: "Venue Quality",
        required: true,
        columns: 5,
        hint: "Rate the quality of the venue and facilities",
        options: [
          { value: "1", label: "1", icon: "Star", description: "Poor" },
          { value: "2", label: "2", icon: "Star", description: "Below Average" },
          { value: "3", label: "3", icon: "Star", description: "Average" },
          { value: "4", label: "4", icon: "Star", description: "Good" },
          { value: "5", label: "5", icon: "Star", description: "Excellent" },
        ],
      },
      {
        id: "organization_rating",
        type: "cards",
        label: "Event Organization",
        required: true,
        columns: 5,
        hint: "How well was the event organized?",
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
    id: "logistics",
    label: "Logistics & Communication",
    icon: "Truck",
    fields: [
      {
        id: "registration_ease",
        type: "cards",
        label: "Registration Process",
        required: true,
        columns: 5,
        hint: "How easy was it to register for the event?",
        options: [
          { value: "1", label: "1", icon: "Star", description: "Very Difficult" },
          { value: "2", label: "2", icon: "Star", description: "Difficult" },
          { value: "3", label: "3", icon: "Star", description: "Neutral" },
          { value: "4", label: "4", icon: "Star", description: "Easy" },
          { value: "5", label: "5", icon: "Star", description: "Very Easy" },
        ],
      },
      {
        id: "schedule_clarity",
        type: "cards",
        label: "Schedule Clarity",
        required: true,
        columns: 5,
        hint: "How clear was the event schedule?",
        options: [
          { value: "1", label: "1", icon: "Star", description: "Very Confusing" },
          { value: "2", label: "2", icon: "Star", description: "Confusing" },
          { value: "3", label: "3", icon: "Star", description: "Neutral" },
          { value: "4", label: "4", icon: "Star", description: "Clear" },
          { value: "5", label: "5", icon: "Star", description: "Very Clear" },
        ],
      },
      {
        id: "event_communication",
        type: "cards",
        label: "Event Communication",
        required: true,
        columns: 5,
        hint: "How well were updates and information communicated?",
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
    label: "Highlights",
    icon: "ThumbsUp",
    fields: [
      {
        id: "event_highlights",
        type: "checkboxes",
        label: "What did you enjoy most about the event?",
        hint: "Select all that apply",
        options: [
          { value: "competition_level", label: "Level of Competition", description: "Quality of games/matches" },
          { value: "venue_facilities", label: "Venue & Facilities", description: "Courts, seating, amenities" },
          { value: "officiating", label: "Officiating", description: "Quality of referees" },
          { value: "atmosphere", label: "Atmosphere", description: "Energy and excitement" },
          { value: "food_concessions", label: "Food & Concessions", description: "Available refreshments" },
          { value: "awards_ceremony", label: "Awards/Ceremony", description: "Recognition and prizes" },
          { value: "networking", label: "Networking", description: "Meeting other families" },
          { value: "schedule_flow", label: "Schedule Flow", description: "Games ran smoothly" },
        ],
      },
      {
        id: "highlight_details",
        type: "textarea",
        label: "What was the best part of the event?",
        placeholder: "Share your favorite moment or highlight from the event...",
        rows: 3,
      },
    ],
  },
  {
    id: "issues",
    label: "Issues Encountered",
    icon: "ThumbsDown",
    fields: [
      {
        id: "event_issues",
        type: "checkboxes",
        label: "Did you experience any issues?",
        hint: "Select all that apply",
        options: [
          { value: "parking", label: "Parking Problems", description: "Insufficient or difficult parking" },
          { value: "long_waits", label: "Long Wait Times", description: "Delays between games" },
          { value: "poor_communication", label: "Poor Communication", description: "Missing or unclear info" },
          { value: "schedule_changes", label: "Schedule Changes", description: "Unexpected alterations" },
          { value: "facility_issues", label: "Facility Issues", description: "Problems with venue" },
          { value: "officiating_issues", label: "Officiating Issues", description: "Concerns with refs" },
          { value: "safety_concerns", label: "Safety Concerns", description: "Safety-related problems" },
          { value: "overcrowding", label: "Overcrowding", description: "Too many people" },
        ],
      },
      {
        id: "issue_details",
        type: "textarea",
        label: "Please describe any issues you encountered",
        placeholder: "Provide details about any problems you experienced...",
        rows: 4,
        hint: "Be specific so we can address these issues",
      },
    ],
  },
  {
    id: "suggestions",
    label: "Suggestions",
    icon: "Lightbulb",
    fields: [
      {
        id: "improvement_suggestions",
        type: "textarea",
        label: "How could we improve future events?",
        placeholder: "Share your ideas and suggestions for making our events better...",
        rows: 5,
        hint: "Your feedback helps us plan better events",
      },
      {
        id: "would_attend_again",
        type: "pills",
        label: "Would you attend this event again?",
        required: true,
        maxSelect: 1,
        options: [
          { value: "definitely", label: "Definitely" },
          { value: "probably", label: "Probably" },
          { value: "maybe", label: "Maybe" },
          { value: "unlikely", label: "Unlikely" },
          { value: "no", label: "No" },
        ],
      },
    ],
  },
];

// Preview Component
function EventFeedbackPreview({ data }) {
  const overallScore = parseInt(data.overall_rating) || 0;
  const venueScore = parseInt(data.venue_rating) || 0;
  const orgScore = parseInt(data.organization_rating) || 0;
  const regScore = parseInt(data.registration_ease) || 0;
  const scheduleScore = parseInt(data.schedule_clarity) || 0;
  const commScore = parseInt(data.event_communication) || 0;

  const experienceAvg = (overallScore + venueScore + orgScore) / 3;
  const logisticsAvg = (regScore + scheduleScore + commScore) / 3;
  const totalAvg = ((experienceAvg + logisticsAvg) / 2).toFixed(1);

  const getScoreColor = (score) => {
    if (score >= 4) return "text-emerald-400";
    if (score >= 3) return "text-[#c9a962]";
    if (score >= 2) return "text-yellow-400";
    return "text-red-400";
  };

  const getStarDisplay = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= score ? "text-[#c9a962] fill-[#c9a962]" : "text-white/20"}`}
        />
      );
    }
    return stars;
  };

  const eventDisplayName = data.event_name ?
    data.event_name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) :
    "Event Name";

  return (
    <div className="space-y-4">
      {/* Event Rating Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#c9a962]/20 to-transparent border border-[#c9a962]/30 p-5">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
          Event Rating
        </h4>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-1">
            {eventDisplayName}
          </h3>
          <p className="text-white/40 text-sm capitalize">
            Attended as: {data.attendee_role?.[0] || "—"}
          </p>
        </div>

        <div className="text-center py-4 border-t border-white/[0.1]">
          <div className={`text-5xl font-bold ${getScoreColor(parseFloat(totalAvg))}`}>
            {totalAvg > 0 ? totalAvg : "—"}
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            {getStarDisplay(Math.round(parseFloat(totalAvg)))}
          </div>
          <div className="text-white/40 text-sm mt-1">Overall Rating</div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
          Score Breakdown
        </h4>

        <div className="space-y-4">
          <div>
            <div className="text-white/40 text-xs uppercase mb-2">Experience</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white/[0.04]">
                <div className={`text-lg font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore || "—"}
                </div>
                <div className="text-white/40 text-xs">Overall</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.04]">
                <div className={`text-lg font-bold ${getScoreColor(venueScore)}`}>
                  {venueScore || "—"}
                </div>
                <div className="text-white/40 text-xs">Venue</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.04]">
                <div className={`text-lg font-bold ${getScoreColor(orgScore)}`}>
                  {orgScore || "—"}
                </div>
                <div className="text-white/40 text-xs">Organization</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-white/40 text-xs uppercase mb-2">Logistics</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white/[0.04]">
                <div className={`text-lg font-bold ${getScoreColor(regScore)}`}>
                  {regScore || "—"}
                </div>
                <div className="text-white/40 text-xs">Registration</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.04]">
                <div className={`text-lg font-bold ${getScoreColor(scheduleScore)}`}>
                  {scheduleScore || "—"}
                </div>
                <div className="text-white/40 text-xs">Schedule</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.04]">
                <div className={`text-lg font-bold ${getScoreColor(commScore)}`}>
                  {commScore || "—"}
                </div>
                <div className="text-white/40 text-xs">Communication</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      {data.event_highlights?.length > 0 && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-2">
            Highlights
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.event_highlights.slice(0, 4).map((highlight) => (
              <span
                key={highlight}
                className="px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-400 text-xs font-medium capitalize"
              >
                {highlight.replace(/_/g, " ")}
              </span>
            ))}
            {data.event_highlights.length > 4 && (
              <span className="px-2 py-1 text-white/40 text-xs">
                +{data.event_highlights.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Issues */}
      {data.event_issues?.length > 0 && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <h4 className="text-sm font-semibold text-red-400/80 uppercase tracking-wide mb-2">
            Issues Reported
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.event_issues.map((issue) => (
              <span
                key={issue}
                className="px-2 py-1 rounded-full bg-red-400/20 text-red-400 text-xs font-medium capitalize"
              >
                {issue.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Return Intent */}
      {data.would_attend_again && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Would Attend Again</span>
            <span className={`font-medium capitalize ${
              data.would_attend_again[0] === "definitely" || data.would_attend_again[0] === "probably"
                ? "text-emerald-400"
                : data.would_attend_again[0] === "maybe"
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}>
              {data.would_attend_again[0] || "—"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventFeedback() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data) => {
      const feedbackData = {
        type: "event_feedback",
        event_name: data.event_name,
        attendee_role: data.attendee_role?.[0],
        overall_rating: parseInt(data.overall_rating),
        venue_rating: parseInt(data.venue_rating),
        organization_rating: parseInt(data.organization_rating),
        registration_ease: parseInt(data.registration_ease),
        schedule_clarity: parseInt(data.schedule_clarity),
        event_communication: parseInt(data.event_communication),
        event_highlights: data.event_highlights,
        highlight_details: data.highlight_details,
        event_issues: data.event_issues,
        issue_details: data.issue_details,
        improvement_suggestions: data.improvement_suggestions,
        would_attend_again: data.would_attend_again?.[0],
        submitted_at: new Date().toISOString(),
      };

      return base44.entities.Feedback.create(feedbackData);
    },
    onSuccess: () => {
      localStorage.removeItem("event_feedback_draft");
      navigate("/Dashboard");
    },
  });

  const handleSubmit = (data) => {
    submitFeedbackMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("event_feedback_draft", JSON.stringify(data));
  };

  const initialData = useMemo(() => {
    try {
      const draft = localStorage.getItem("event_feedback_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Event Feedback"
        subtitle="Share your experience from the tournament or event"
        sections={EVENT_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={EventFeedbackPreview}
        submitLabel={submitFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
        skipLabel="Skip"
        defaultMode="form"
      />
    </div>
  );
}
