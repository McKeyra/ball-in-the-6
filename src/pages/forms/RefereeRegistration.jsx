import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { User } from "lucide-react";

// Referee Registration Form Configuration
const REFEREE_SECTIONS = [
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
        placeholder: "referee@example.com",
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
        label: "Home Address",
        placeholder: "Street address",
      },
      {
        id: "city",
        type: "text",
        label: "City",
        placeholder: "Toronto",
        required: true,
      },
      {
        id: "postal_code",
        type: "text",
        label: "Postal Code",
        placeholder: "M5V 1A1",
      },
    ],
  },
  {
    id: "qualifications",
    label: "Qualifications",
    icon: "Award",
    fields: [
      {
        id: "certification_level",
        type: "cards",
        label: "Certification Level",
        required: true,
        columns: 2,
        options: [
          {
            value: "none",
            label: "No Certification",
            description: "New to officiating, willing to train",
            icon: "UserPlus",
          },
          {
            value: "level_1",
            label: "Level 1 - Community",
            description: "Basic certification for recreational games",
            icon: "Award",
          },
          {
            value: "level_2",
            label: "Level 2 - Provincial",
            description: "Certified for competitive play",
            icon: "Medal",
          },
          {
            value: "level_3",
            label: "Level 3 - National",
            description: "Advanced certification",
            icon: "Trophy",
          },
        ],
      },
      {
        id: "certification_number",
        type: "text",
        label: "Certification Number",
        placeholder: "Enter your certification number",
        hint: "If applicable",
      },
      {
        id: "years_experience",
        type: "select",
        label: "Years of Officiating Experience",
        required: true,
        options: [
          { value: "0", label: "No experience" },
          { value: "1-2", label: "1-2 years" },
          { value: "3-5", label: "3-5 years" },
          { value: "6-10", label: "6-10 years" },
          { value: "10+", label: "10+ years" },
        ],
      },
      {
        id: "game_levels",
        type: "pills",
        label: "Game Levels Officiated",
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
        label: "Age Groups Preferred",
        hint: "Select all you're comfortable with",
        options: [
          { value: "u10", label: "U10" },
          { value: "u12", label: "U12" },
          { value: "u14", label: "U14" },
          { value: "u16", label: "U16" },
          { value: "u18", label: "U18" },
          { value: "adult", label: "Adult" },
        ],
      },
      {
        id: "rules_knowledge",
        type: "cards",
        label: "Rules Knowledge",
        required: true,
        columns: 2,
        options: [
          {
            value: "basic",
            label: "Basic",
            description: "Know fundamental rules",
            icon: "Book",
          },
          {
            value: "intermediate",
            label: "Intermediate",
            description: "Comfortable with most situations",
            icon: "BookOpen",
          },
          {
            value: "advanced",
            label: "Advanced",
            description: "Expert knowledge of rules",
            icon: "Library",
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
        hint: "Select all days you can officiate",
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
          { value: "evening", label: "Evening (5pm-10pm)" },
        ],
      },
      {
        id: "travel_radius",
        type: "select",
        label: "Travel Radius",
        required: true,
        options: [
          { value: "5km", label: "Up to 5 km" },
          { value: "10km", label: "Up to 10 km" },
          { value: "25km", label: "Up to 25 km" },
          { value: "50km", label: "Up to 50 km" },
          { value: "unlimited", label: "No limit" },
        ],
      },
      {
        id: "games_per_week",
        type: "select",
        label: "Games Per Week",
        required: true,
        hint: "Maximum number of games you can officiate weekly",
        options: [
          { value: "1-2", label: "1-2 games" },
          { value: "3-5", label: "3-5 games" },
          { value: "6-10", label: "6-10 games" },
          { value: "10+", label: "10+ games" },
        ],
      },
      {
        id: "tournament_available",
        type: "checkboxes",
        label: "Tournament Availability",
        options: [
          {
            value: "weekday_tournaments",
            label: "Weekday Tournaments",
            description: "Available for tournaments during the week",
          },
          {
            value: "weekend_tournaments",
            label: "Weekend Tournaments",
            description: "Available for weekend tournaments",
          },
          {
            value: "holiday_tournaments",
            label: "Holiday Tournaments",
            description: "Available during holiday periods",
          },
        ],
      },
    ],
  },
  {
    id: "equipment",
    label: "Equipment & Uniform",
    icon: "Shirt",
    fields: [
      {
        id: "uniform_size_shirt",
        type: "select",
        label: "Referee Shirt Size",
        required: true,
        options: [
          { value: "xs", label: "Extra Small" },
          { value: "s", label: "Small" },
          { value: "m", label: "Medium" },
          { value: "l", label: "Large" },
          { value: "xl", label: "XL" },
          { value: "xxl", label: "XXL" },
          { value: "xxxl", label: "XXXL" },
        ],
      },
      {
        id: "uniform_size_pants",
        type: "select",
        label: "Referee Pants Size",
        required: true,
        options: [
          { value: "28", label: "28" },
          { value: "30", label: "30" },
          { value: "32", label: "32" },
          { value: "34", label: "34" },
          { value: "36", label: "36" },
          { value: "38", label: "38" },
          { value: "40", label: "40" },
          { value: "42", label: "42" },
          { value: "44", label: "44" },
        ],
      },
      {
        id: "has_own_uniform",
        type: "checkboxes",
        label: "Equipment Owned",
        hint: "Check items you already own",
        options: [
          { value: "referee_shirt", label: "Referee Shirt", description: "Official black/white striped shirt" },
          { value: "referee_pants", label: "Referee Pants", description: "Official black pants" },
          { value: "whistle", label: "Whistle", description: "Fox 40 or equivalent" },
          { value: "lanyard", label: "Whistle Lanyard", description: "Finger grip or neck lanyard" },
        ],
      },
      {
        id: "whistle_preference",
        type: "pills",
        label: "Whistle Preference",
        maxSelect: 1,
        options: [
          { value: "fox40_classic", label: "Fox 40 Classic" },
          { value: "fox40_mini", label: "Fox 40 Mini" },
          { value: "acme_thunderer", label: "Acme Thunderer" },
          { value: "electronic", label: "Electronic" },
          { value: "no_preference", label: "No Preference" },
        ],
      },
    ],
  },
  {
    id: "payment",
    label: "Payment Information",
    icon: "CreditCard",
    fields: [
      {
        id: "rate_preference",
        type: "cards",
        label: "Rate Preference",
        required: true,
        columns: 2,
        options: [
          {
            value: "standard",
            label: "Standard Rate",
            description: "League standard per-game rate",
            icon: "DollarSign",
          },
          {
            value: "volunteer",
            label: "Volunteer",
            description: "No payment required",
            icon: "Heart",
          },
          {
            value: "negotiable",
            label: "Negotiable",
            description: "Open to discussion",
            icon: "MessageSquare",
          },
        ],
      },
      {
        id: "payment_method",
        type: "pills",
        label: "Preferred Payment Method",
        maxSelect: 1,
        options: [
          { value: "direct_deposit", label: "Direct Deposit" },
          { value: "etransfer", label: "E-Transfer" },
          { value: "cheque", label: "Cheque" },
          { value: "cash", label: "Cash" },
        ],
      },
      {
        id: "bank_name",
        type: "text",
        label: "Bank Name",
        placeholder: "Enter bank name for direct deposit",
        hint: "Required for direct deposit",
      },
      {
        id: "bank_transit",
        type: "text",
        label: "Transit Number",
        placeholder: "5 digits",
        hint: "Required for direct deposit",
      },
      {
        id: "bank_institution",
        type: "text",
        label: "Institution Number",
        placeholder: "3 digits",
        hint: "Required for direct deposit",
      },
      {
        id: "bank_account",
        type: "text",
        label: "Account Number",
        placeholder: "Account number",
        hint: "Required for direct deposit",
      },
      {
        id: "etransfer_email",
        type: "text",
        label: "E-Transfer Email",
        placeholder: "email@example.com",
        hint: "For e-transfer payments",
      },
      {
        id: "payment_consent",
        type: "checkboxes",
        label: "Payment Agreement",
        required: true,
        options: [
          {
            value: "terms_accepted",
            label: "Payment Terms",
            description: "I understand payments are processed bi-weekly and agree to the league payment terms",
          },
        ],
      },
    ],
  },
];

// Preview Component
function RefereePreview({ data }) {
  const getCertificationLabel = (level) => {
    const labels = {
      none: "No Certification",
      level_1: "Level 1 - Community",
      level_2: "Level 2 - Provincial",
      level_3: "Level 3 - National",
    };
    return labels[level] || level;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Referee Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#c9a962]/20 flex items-center justify-center">
            <User className="w-8 h-8 text-[#c9a962]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {data.first_name || data.last_name
                ? `${data.first_name || ""} ${data.last_name || ""}`.trim()
                : "Referee Name"}
            </h3>
            <p className="text-white/40 text-sm">
              {data.city || "City"} | {data.years_experience || "0"} years exp.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Certification</span>
            <p className="text-white font-medium text-xs">
              {data.certification_level ? getCertificationLabel(data.certification_level) : "---"}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Travel Radius</span>
            <p className="text-white font-medium">{data.travel_radius || "---"}</p>
          </div>
        </div>
      </div>

      {/* Game Levels */}
      {data.game_levels?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Game Levels
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.game_levels.map((level) => (
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

      {/* Equipment */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
          Uniform Size
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Shirt</span>
            <p className="text-white font-medium uppercase">{data.uniform_size_shirt || "---"}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Pants</span>
            <p className="text-white font-medium">{data.uniform_size_pants || "---"}</p>
          </div>
        </div>
      </div>

      {/* Payment */}
      {data.rate_preference && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Payment
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-sm">Rate</span>
              <span className="text-white font-medium capitalize">
                {data.rate_preference.replace(/_/g, " ")}
              </span>
            </div>
            {data.payment_method && (
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-sm">Method</span>
                <span className="text-white font-medium capitalize">
                  {data.payment_method?.[0]?.replace(/_/g, " ") || "---"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Age Groups */}
      {data.age_groups?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Age Groups
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.age_groups.map((age) => (
              <span
                key={age}
                className="px-3 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-sm font-medium uppercase"
              >
                {age}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RefereeRegistration() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createRefereeMutation = useMutation({
    mutationFn: async (data) => {
      const refereeData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        certification_level: data.certification_level,
        certification_number: data.certification_number,
        years_experience: data.years_experience,
        game_levels: data.game_levels,
        age_groups: data.age_groups,
        rules_knowledge: data.rules_knowledge,
        available_days: data.available_days,
        available_times: data.available_times,
        travel_radius: data.travel_radius,
        games_per_week: data.games_per_week,
        tournament_available: data.tournament_available,
        uniform_size_shirt: data.uniform_size_shirt,
        uniform_size_pants: data.uniform_size_pants,
        has_own_uniform: data.has_own_uniform,
        whistle_preference: data.whistle_preference,
        rate_preference: data.rate_preference,
        payment_method: data.payment_method,
        bank_info: data.payment_method?.[0] === "direct_deposit" ? {
          bank_name: data.bank_name,
          transit: data.bank_transit,
          institution: data.bank_institution,
          account: data.bank_account,
        } : null,
        etransfer_email: data.etransfer_email,
        status: "pending_review",
        created_date: new Date().toISOString(),
      };

      return base44.entities.Referee.create(refereeData);
    },
    onSuccess: (newReferee) => {
      localStorage.removeItem("referee_registration_draft");
      navigate(`/RefereeDetail?id=${newReferee.id}`);
    },
  });

  const handleSubmit = (data) => {
    createRefereeMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("referee_registration_draft", JSON.stringify(data));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("referee_registration_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Referee Registration"
        subtitle="Sign up to officiate games in our basketball league"
        sections={REFEREE_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={RefereePreview}
        submitLabel={createRefereeMutation.isPending ? "Submitting..." : "Submit Registration"}
        skipLabel="Save as Draft"
        defaultMode="form"
      />
    </div>
  );
}
