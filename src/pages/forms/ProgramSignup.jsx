import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { User, CalendarDays, Heart, CreditCard, FileCheck, Dumbbell, Star } from "lucide-react";

// Program Signup Form Configuration
const PROGRAM_SECTIONS = [
  {
    id: "participant",
    label: "Participant Information",
    icon: "User",
    fields: [
      {
        id: "participant_first_name",
        type: "text",
        label: "Participant First Name",
        placeholder: "Enter first name",
        required: true,
      },
      {
        id: "participant_last_name",
        type: "text",
        label: "Participant Last Name",
        placeholder: "Enter last name",
        required: true,
      },
      {
        id: "date_of_birth",
        type: "text",
        label: "Date of Birth",
        placeholder: "YYYY-MM-DD",
        required: true,
      },
      {
        id: "age",
        type: "select",
        label: "Age",
        required: true,
        options: [
          { value: "5", label: "5 years old" },
          { value: "6", label: "6 years old" },
          { value: "7", label: "7 years old" },
          { value: "8", label: "8 years old" },
          { value: "9", label: "9 years old" },
          { value: "10", label: "10 years old" },
          { value: "11", label: "11 years old" },
          { value: "12", label: "12 years old" },
          { value: "13", label: "13 years old" },
          { value: "14", label: "14 years old" },
          { value: "15", label: "15 years old" },
          { value: "16", label: "16 years old" },
          { value: "17", label: "17 years old" },
          { value: "18+", label: "18+ years old" },
        ],
      },
      {
        id: "gender",
        type: "pills",
        label: "Gender",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
        maxSelect: 1,
      },
      {
        id: "skill_level",
        type: "cards",
        label: "Skill Level",
        required: true,
        columns: 2,
        options: [
          {
            value: "beginner",
            label: "Beginner",
            description: "New to basketball, learning basics",
            icon: "Star",
          },
          {
            value: "intermediate",
            label: "Intermediate",
            description: "Knows fundamentals, developing skills",
            icon: "Stars",
          },
          {
            value: "advanced",
            label: "Advanced",
            description: "Strong skills, competitive player",
            icon: "Trophy",
          },
          {
            value: "elite",
            label: "Elite",
            description: "High-level, rep experience",
            icon: "Award",
          },
        ],
      },
      {
        id: "t_shirt_size",
        type: "select",
        label: "T-Shirt Size",
        required: true,
        options: [
          { value: "yxs", label: "Youth XS" },
          { value: "ys", label: "Youth S" },
          { value: "ym", label: "Youth M" },
          { value: "yl", label: "Youth L" },
          { value: "yxl", label: "Youth XL" },
          { value: "as", label: "Adult S" },
          { value: "am", label: "Adult M" },
          { value: "al", label: "Adult L" },
          { value: "axl", label: "Adult XL" },
          { value: "axxl", label: "Adult XXL" },
        ],
      },
    ],
  },
  {
    id: "program",
    label: "Program Selection",
    icon: "CalendarDays",
    fields: [
      {
        id: "program_type",
        type: "cards",
        label: "Select Program",
        required: true,
        columns: 2,
        options: [
          {
            value: "skills_camp",
            label: "Skills Development Camp",
            description: "Intensive skill-building program",
            icon: "Dumbbell",
          },
          {
            value: "shooting_clinic",
            label: "Shooting Clinic",
            description: "Focus on shooting mechanics",
            icon: "Target",
          },
          {
            value: "basketball_101",
            label: "Basketball 101",
            description: "Introduction to basketball basics",
            icon: "BookOpen",
          },
          {
            value: "elite_training",
            label: "Elite Training Program",
            description: "Advanced training for competitive players",
            icon: "Flame",
          },
          {
            value: "summer_camp",
            label: "Summer Basketball Camp",
            description: "Week-long summer program",
            icon: "Sun",
          },
          {
            value: "march_break",
            label: "March Break Camp",
            description: "March break intensive",
            icon: "Calendar",
          },
          {
            value: "holiday_camp",
            label: "Holiday Camp",
            description: "Winter holiday program",
            icon: "Snowflake",
          },
          {
            value: "weekend_clinic",
            label: "Weekend Clinic",
            description: "Single weekend session",
            icon: "Clock",
          },
        ],
      },
      {
        id: "session_dates",
        type: "select",
        label: "Session Dates",
        required: true,
        options: [
          { value: "jan_13_17", label: "January 13-17, 2026" },
          { value: "feb_17_21", label: "February 17-21, 2026 (March Break)" },
          { value: "mar_16_20", label: "March 16-20, 2026" },
          { value: "apr_13_17", label: "April 13-17, 2026" },
          { value: "jun_29_jul_3", label: "June 29 - July 3, 2026" },
          { value: "jul_6_10", label: "July 6-10, 2026" },
          { value: "jul_13_17", label: "July 13-17, 2026" },
          { value: "jul_20_24", label: "July 20-24, 2026" },
          { value: "jul_27_31", label: "July 27-31, 2026" },
          { value: "aug_3_7", label: "August 3-7, 2026" },
          { value: "aug_10_14", label: "August 10-14, 2026" },
          { value: "aug_17_21", label: "August 17-21, 2026" },
          { value: "aug_24_28", label: "August 24-28, 2026" },
          { value: "dec_21_23", label: "December 21-23, 2026 (Holiday)" },
          { value: "dec_28_30", label: "December 28-30, 2026 (Holiday)" },
        ],
      },
      {
        id: "session_time",
        type: "pills",
        label: "Preferred Session Time",
        required: true,
        maxSelect: 1,
        options: [
          { value: "morning", label: "Morning (9am-12pm)" },
          { value: "afternoon", label: "Afternoon (1pm-4pm)" },
          { value: "full_day", label: "Full Day (9am-4pm)" },
        ],
      },
      {
        id: "location_preference",
        type: "select",
        label: "Location Preference",
        options: [
          { value: "downsview", label: "Downsview Park" },
          { value: "scarborough", label: "Scarborough Sports Centre" },
          { value: "etobicoke", label: "Etobicoke Olympium" },
          { value: "north_york", label: "North York Civic Centre" },
          { value: "no_preference", label: "No Preference" },
        ],
      },
      {
        id: "extended_care",
        type: "checkboxes",
        label: "Extended Care Options",
        hint: "Additional fees apply",
        options: [
          {
            value: "before_care",
            label: "Before Care (8am-9am)",
            description: "Early drop-off option (+$25/week)",
          },
          {
            value: "after_care",
            label: "After Care (4pm-5:30pm)",
            description: "Late pick-up option (+$35/week)",
          },
        ],
      },
      {
        id: "additional_weeks",
        type: "checkboxes",
        label: "Register for Additional Weeks?",
        hint: "Save 10% when registering for multiple weeks",
        options: [
          { value: "week_2", label: "Add 2nd Week", description: "10% discount applied" },
          { value: "week_3", label: "Add 3rd Week", description: "10% discount applied" },
          { value: "week_4", label: "Add 4th Week", description: "10% discount applied" },
        ],
      },
    ],
  },
  {
    id: "medical",
    label: "Medical Information",
    icon: "Heart",
    fields: [
      {
        id: "allergies",
        type: "textarea",
        label: "Allergies",
        placeholder: "List any allergies (food, medication, environmental)",
        hint: "Leave blank if none",
      },
      {
        id: "medical_conditions",
        type: "textarea",
        label: "Medical Conditions",
        placeholder: "List any medical conditions we should be aware of",
      },
      {
        id: "medications",
        type: "textarea",
        label: "Medications",
        placeholder: "List any medications the participant takes",
      },
      {
        id: "dietary_restrictions",
        type: "pills",
        label: "Dietary Restrictions",
        hint: "Select all that apply (for snacks provided)",
        options: [
          { value: "none", label: "None" },
          { value: "vegetarian", label: "Vegetarian" },
          { value: "vegan", label: "Vegan" },
          { value: "gluten_free", label: "Gluten-Free" },
          { value: "dairy_free", label: "Dairy-Free" },
          { value: "nut_free", label: "Nut-Free" },
          { value: "halal", label: "Halal" },
          { value: "kosher", label: "Kosher" },
        ],
      },
      {
        id: "emergency_contact_name",
        type: "text",
        label: "Emergency Contact Name",
        placeholder: "Full name",
        required: true,
      },
      {
        id: "emergency_contact_phone",
        type: "text",
        label: "Emergency Contact Phone",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "emergency_contact_relationship",
        type: "text",
        label: "Relationship to Participant",
        placeholder: "e.g., Parent, Guardian, Aunt",
        required: true,
      },
      {
        id: "authorized_pickup",
        type: "textarea",
        label: "Authorized Pickup Persons",
        placeholder: "List names of people authorized to pick up the participant",
        hint: "Include names and relationship",
      },
    ],
  },
  {
    id: "payment",
    label: "Payment Information",
    icon: "CreditCard",
    fields: [
      {
        id: "payment_method",
        type: "cards",
        label: "Payment Method",
        required: true,
        columns: 2,
        options: [
          {
            value: "credit_card",
            label: "Credit Card",
            description: "Pay now with credit card",
            icon: "CreditCard",
          },
          {
            value: "debit",
            label: "Debit Card",
            description: "Pay now with debit",
            icon: "Wallet",
          },
          {
            value: "etransfer",
            label: "E-Transfer",
            description: "Send payment via e-transfer",
            icon: "Send",
          },
          {
            value: "installments",
            label: "Payment Plan",
            description: "Split into 2 payments",
            icon: "Calendar",
          },
        ],
      },
      {
        id: "promo_code",
        type: "text",
        label: "Promo Code",
        placeholder: "Enter promo code if you have one",
        hint: "Discount will be applied at checkout",
      },
      {
        id: "sibling_discount",
        type: "checkboxes",
        label: "Sibling Discount",
        options: [
          {
            value: "sibling",
            label: "Sibling Enrolled",
            description: "10% sibling discount applies if another family member is registered",
          },
        ],
      },
      {
        id: "sibling_name",
        type: "text",
        label: "Sibling Name (if applicable)",
        placeholder: "Name of sibling registered",
      },
      {
        id: "billing_name",
        type: "text",
        label: "Billing Name",
        placeholder: "Name on card or account",
        required: true,
      },
      {
        id: "billing_email",
        type: "text",
        label: "Billing Email",
        placeholder: "email@example.com",
        required: true,
        hint: "Receipt will be sent to this email",
      },
      {
        id: "billing_phone",
        type: "text",
        label: "Billing Phone",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "billing_address",
        type: "text",
        label: "Billing Address",
        placeholder: "Street address",
      },
      {
        id: "billing_city",
        type: "text",
        label: "City",
        placeholder: "Toronto",
      },
      {
        id: "billing_postal",
        type: "text",
        label: "Postal Code",
        placeholder: "M5V 1A1",
      },
    ],
  },
  {
    id: "waivers",
    label: "Waivers & Agreements",
    icon: "FileCheck",
    fields: [
      {
        id: "waivers_accepted",
        type: "checkboxes",
        label: "Required Agreements",
        required: true,
        options: [
          {
            value: "liability_waiver",
            label: "Liability Waiver",
            description: "I acknowledge the inherent risks of basketball activities and release the organization from liability",
          },
          {
            value: "photo_release",
            label: "Photo & Video Release",
            description: "I consent to photos and videos being taken and used for promotional purposes",
          },
          {
            value: "medical_consent",
            label: "Medical Treatment Authorization",
            description: "I authorize emergency medical treatment if I cannot be reached",
          },
          {
            value: "code_of_conduct",
            label: "Code of Conduct",
            description: "Participant agrees to follow the program code of conduct",
          },
        ],
      },
      {
        id: "refund_policy",
        type: "checkboxes",
        label: "Refund Policy",
        required: true,
        options: [
          {
            value: "acknowledged",
            label: "I Acknowledge the Refund Policy",
            description: "Full refund up to 14 days before program start. 50% refund up to 7 days. No refund within 7 days.",
          },
        ],
      },
      {
        id: "health_screening",
        type: "checkboxes",
        label: "Health Screening",
        required: true,
        options: [
          {
            value: "confirmed",
            label: "Health Screening Confirmation",
            description: "I confirm the participant is in good health and fit to participate in physical activities",
          },
        ],
      },
      {
        id: "parent_signature",
        type: "text",
        label: "Parent/Guardian Signature",
        placeholder: "Type your full legal name",
        required: true,
        hint: "By typing your name, you confirm all information is accurate",
      },
      {
        id: "signature_date",
        type: "text",
        label: "Date",
        placeholder: "YYYY-MM-DD",
        required: true,
      },
    ],
  },
];

// Preview Component
function ProgramPreview({ data }) {
  const getProgramLabel = (program) => {
    const programs = {
      skills_camp: "Skills Development Camp",
      shooting_clinic: "Shooting Clinic",
      basketball_101: "Basketball 101",
      elite_training: "Elite Training",
      summer_camp: "Summer Camp",
      march_break: "March Break Camp",
      holiday_camp: "Holiday Camp",
      weekend_clinic: "Weekend Clinic",
    };
    return programs[program] || program;
  };

  const getSessionLabel = (session) => {
    const sessions = {
      jan_13_17: "Jan 13-17, 2026",
      feb_17_21: "Feb 17-21, 2026",
      mar_16_20: "Mar 16-20, 2026",
      apr_13_17: "Apr 13-17, 2026",
      jun_29_jul_3: "Jun 29 - Jul 3, 2026",
      jul_6_10: "Jul 6-10, 2026",
      jul_13_17: "Jul 13-17, 2026",
      jul_20_24: "Jul 20-24, 2026",
      jul_27_31: "Jul 27-31, 2026",
      aug_3_7: "Aug 3-7, 2026",
      aug_10_14: "Aug 10-14, 2026",
      aug_17_21: "Aug 17-21, 2026",
      aug_24_28: "Aug 24-28, 2026",
      dec_21_23: "Dec 21-23, 2026",
      dec_28_30: "Dec 28-30, 2026",
    };
    return sessions[session] || session;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Participant Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#c9a962]/20 flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-[#c9a962]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {data.participant_first_name || data.participant_last_name
                ? `${data.participant_first_name || ""} ${data.participant_last_name || ""}`.trim()
                : "Participant Name"}
            </h3>
            <p className="text-white/40 text-sm">
              Age {data.age || "---"} | {data.skill_level ? data.skill_level.charAt(0).toUpperCase() + data.skill_level.slice(1) : "Skill Level"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">T-Shirt</span>
            <p className="text-white font-medium uppercase">{data.t_shirt_size || "---"}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">DOB</span>
            <p className="text-white font-medium">{data.date_of_birth || "---"}</p>
          </div>
        </div>
      </div>

      {/* Program Selection */}
      {data.program_type && (
        <div className="rounded-2xl bg-[#c9a962]/10 border border-[#c9a962]/30 p-5">
          <h4 className="text-sm font-semibold text-[#c9a962] uppercase tracking-wide mb-3">
            Selected Program
          </h4>
          <p className="text-white font-bold text-lg">{getProgramLabel(data.program_type)}</p>
          {data.session_dates && (
            <p className="text-white/60 mt-1">{getSessionLabel(data.session_dates)}</p>
          )}
          {data.session_time && (
            <p className="text-white/40 text-sm mt-1 capitalize">
              {data.session_time?.[0]?.replace(/_/g, " ")} Session
            </p>
          )}
        </div>
      )}

      {/* Extended Care */}
      {data.extended_care?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Extended Care
          </h4>
          <div className="space-y-2">
            {data.extended_care.map((care) => (
              <div key={care} className="flex items-center gap-2 text-white/80 text-sm">
                <div className="w-4 h-4 rounded-full bg-[#c9a962]/20 flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-[#c9a962]" />
                </div>
                <span className="capitalize">{care.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dietary Restrictions */}
      {data.dietary_restrictions?.length > 0 && !data.dietary_restrictions.includes("none") && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Dietary Restrictions
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.dietary_restrictions.map((diet) => (
              <span
                key={diet}
                className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium capitalize"
              >
                {diet.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Medical Alert */}
      {(data.allergies || data.medical_conditions) && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5">
          <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Medical Info
          </h4>
          {data.allergies && (
            <p className="text-white/60 text-sm mb-2">
              <span className="text-red-400">Allergies:</span> {data.allergies}
            </p>
          )}
          {data.medical_conditions && (
            <p className="text-white/60 text-sm">
              <span className="text-red-400">Conditions:</span> {data.medical_conditions}
            </p>
          )}
        </div>
      )}

      {/* Emergency Contact */}
      {data.emergency_contact_name && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Emergency Contact
          </h4>
          <p className="text-white font-medium">{data.emergency_contact_name}</p>
          <p className="text-white/40 text-sm">{data.emergency_contact_phone}</p>
          <p className="text-white/40 text-sm">{data.emergency_contact_relationship}</p>
        </div>
      )}

      {/* Payment */}
      {data.payment_method && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Payment
          </h4>
          <p className="text-white font-medium capitalize">
            {data.payment_method.replace(/_/g, " ")}
          </p>
          {data.promo_code && (
            <p className="text-[#c9a962] text-sm mt-2">Promo: {data.promo_code}</p>
          )}
          {data.sibling_discount?.includes("sibling") && (
            <p className="text-emerald-400 text-sm mt-1">Sibling discount applied</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProgramSignup() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createProgramSignupMutation = useMutation({
    mutationFn: async (data) => {
      const signupData = {
        participant_first_name: data.participant_first_name,
        participant_last_name: data.participant_last_name,
        date_of_birth: data.date_of_birth,
        age: data.age,
        gender: data.gender?.[0],
        skill_level: data.skill_level,
        t_shirt_size: data.t_shirt_size,
        program_type: data.program_type,
        session_dates: data.session_dates,
        session_time: data.session_time?.[0],
        location_preference: data.location_preference,
        extended_care: data.extended_care,
        additional_weeks: data.additional_weeks,
        allergies: data.allergies,
        medical_conditions: data.medical_conditions,
        medications: data.medications,
        dietary_restrictions: data.dietary_restrictions,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone,
        emergency_contact_relationship: data.emergency_contact_relationship,
        authorized_pickup: data.authorized_pickup,
        payment_method: data.payment_method,
        promo_code: data.promo_code,
        sibling_discount: data.sibling_discount,
        sibling_name: data.sibling_name,
        billing_name: data.billing_name,
        billing_email: data.billing_email,
        billing_phone: data.billing_phone,
        billing_address: data.billing_address,
        billing_city: data.billing_city,
        billing_postal: data.billing_postal,
        waivers_accepted: data.waivers_accepted,
        refund_policy: data.refund_policy,
        health_screening: data.health_screening,
        parent_signature: data.parent_signature,
        signature_date: data.signature_date,
        status: "pending_payment",
        created_date: new Date().toISOString(),
      };

      return base44.entities.ProgramRegistration.create(signupData);
    },
    onSuccess: (newSignup) => {
      localStorage.removeItem("program_signup_draft");
      navigate(`/ProgramConfirmation?id=${newSignup.id}`);
    },
  });

  const handleSubmit = (data) => {
    createProgramSignupMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("program_signup_draft", JSON.stringify(data));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("program_signup_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Program Registration"
        subtitle="Sign up for basketball camps and clinics"
        sections={PROGRAM_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={ProgramPreview}
        submitLabel={createProgramSignupMutation.isPending ? "Processing..." : "Complete Registration"}
        skipLabel="Save as Draft"
        defaultMode="form"
      />
    </div>
  );
}
