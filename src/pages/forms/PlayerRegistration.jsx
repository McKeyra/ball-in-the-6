import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { User, Phone, Heart, Settings, FileCheck, Calendar, Shield } from "lucide-react";

// Player Registration Form Configuration
const PLAYER_SECTIONS = [
  {
    id: "player_info",
    label: "Player Information",
    icon: "User",
    fields: [
      {
        id: "first_name",
        type: "text",
        label: "First Name",
        placeholder: "Enter player's first name",
        required: true,
      },
      {
        id: "last_name",
        type: "text",
        label: "Last Name",
        placeholder: "Enter player's last name",
        required: true,
      },
      {
        id: "date_of_birth",
        type: "text",
        label: "Date of Birth",
        placeholder: "YYYY-MM-DD",
        required: true,
        hint: "Player must meet age requirements for division",
      },
      {
        id: "gender",
        type: "pills",
        label: "Gender",
        required: true,
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
        maxSelect: 1,
      },
      {
        id: "photo",
        type: "upload",
        label: "Player Photo",
        accept: "image/*",
        hint: "Upload a recent photo for team roster and ID card",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact Information",
    icon: "Phone",
    fields: [
      {
        id: "parent_name",
        type: "text",
        label: "Parent/Guardian Name",
        placeholder: "Full name of parent or guardian",
        required: true,
      },
      {
        id: "parent_email",
        type: "text",
        label: "Email Address",
        placeholder: "parent@example.com",
        required: true,
      },
      {
        id: "parent_phone",
        type: "text",
        label: "Phone Number",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "emergency_contact_name",
        type: "text",
        label: "Emergency Contact Name",
        placeholder: "Alternative contact name",
        required: true,
      },
      {
        id: "emergency_contact_phone",
        type: "text",
        label: "Emergency Contact Phone",
        placeholder: "(416) 555-0456",
        required: true,
      },
      {
        id: "emergency_contact_relationship",
        type: "text",
        label: "Relationship to Player",
        placeholder: "e.g., Grandparent, Aunt, Family Friend",
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
        hint: "e.g., Asthma, Diabetes, Epilepsy",
      },
      {
        id: "medications",
        type: "textarea",
        label: "Current Medications",
        placeholder: "List any medications the player takes regularly",
      },
      {
        id: "doctor_name",
        type: "text",
        label: "Family Doctor Name",
        placeholder: "Dr. Smith",
      },
      {
        id: "doctor_phone",
        type: "text",
        label: "Doctor's Phone Number",
        placeholder: "(416) 555-0789",
      },
      {
        id: "health_card_number",
        type: "text",
        label: "Health Card Number",
        placeholder: "Ontario Health Card Number",
        hint: "For emergency medical situations only",
      },
    ],
  },
  {
    id: "preferences",
    label: "Player Preferences",
    icon: "Settings",
    fields: [
      {
        id: "preferred_position",
        type: "pills",
        label: "Preferred Position",
        options: [
          { value: "point_guard", label: "Point Guard" },
          { value: "shooting_guard", label: "Shooting Guard" },
          { value: "small_forward", label: "Small Forward" },
          { value: "power_forward", label: "Power Forward" },
          { value: "center", label: "Center" },
          { value: "no_preference", label: "No Preference" },
        ],
        maxSelect: 2,
        hint: "Select up to 2 positions",
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
            description: "New to basketball, learning fundamentals",
            icon: "Star",
          },
          {
            value: "intermediate",
            label: "Intermediate",
            description: "Knows basics, developing skills",
            icon: "Stars",
          },
          {
            value: "advanced",
            label: "Advanced",
            description: "Strong skills, competitive experience",
            icon: "Trophy",
          },
          {
            value: "elite",
            label: "Elite",
            description: "High-level player, rep/travel experience",
            icon: "Award",
          },
        ],
      },
      {
        id: "previous_experience",
        type: "textarea",
        label: "Previous Basketball Experience",
        placeholder: "Describe any previous teams, leagues, or training",
        hint: "Include years played and any notable achievements",
      },
      {
        id: "jersey_size",
        type: "select",
        label: "Jersey Size",
        required: true,
        options: [
          { value: "ys", label: "Youth Small" },
          { value: "ym", label: "Youth Medium" },
          { value: "yl", label: "Youth Large" },
          { value: "yxl", label: "Youth XL" },
          { value: "as", label: "Adult Small" },
          { value: "am", label: "Adult Medium" },
          { value: "al", label: "Adult Large" },
          { value: "axl", label: "Adult XL" },
          { value: "axxl", label: "Adult XXL" },
        ],
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
            description: "I acknowledge the inherent risks of basketball and release the league from liability for injuries",
          },
          {
            value: "photo_release",
            label: "Photo & Media Release",
            description: "I consent to photos and videos of my child being used for league promotion",
          },
          {
            value: "code_of_conduct",
            label: "Code of Conduct",
            description: "I agree to uphold the league's code of conduct for players and parents",
          },
        ],
      },
      {
        id: "medical_consent",
        type: "checkboxes",
        label: "Medical Consent",
        required: true,
        options: [
          {
            value: "medical_treatment",
            label: "Medical Treatment Authorization",
            description: "I authorize emergency medical treatment if I cannot be reached",
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
function PlayerPreview({ data }) {
  const getPositionLabel = (pos) => {
    const positions = {
      point_guard: "PG",
      shooting_guard: "SG",
      small_forward: "SF",
      power_forward: "PF",
      center: "C",
      no_preference: "Any",
    };
    return positions[pos] || pos;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Player Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#c9a962]/20 flex items-center justify-center overflow-hidden">
            {data.photo ? (
              <img
                src={URL.createObjectURL(data.photo)}
                alt="Player"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-[#c9a962]" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {data.first_name || data.last_name
                ? `${data.first_name || ""} ${data.last_name || ""}`.trim()
                : "Player Name"}
            </h3>
            <p className="text-white/40 text-sm">
              {data.date_of_birth || "Date of Birth"} | {data.gender?.[0] || "Gender"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Skill Level</span>
            <p className="text-white font-medium capitalize">{data.skill_level || "---"}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04]">
            <span className="text-white/40">Jersey Size</span>
            <p className="text-white font-medium uppercase">{data.jersey_size || "---"}</p>
          </div>
        </div>
      </div>

      {/* Positions */}
      {data.preferred_position?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Preferred Positions
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.preferred_position.map((pos) => (
              <span
                key={pos}
                className="px-3 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-sm font-medium"
              >
                {getPositionLabel(pos)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Parent Contact */}
      {data.parent_name && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Parent/Guardian
          </h4>
          <p className="text-white font-medium">{data.parent_name}</p>
          <p className="text-white/40 text-sm">{data.parent_email}</p>
          {data.parent_phone && (
            <p className="text-white/40 text-sm">{data.parent_phone}</p>
          )}
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

      {/* Waivers Status */}
      {data.waivers_accepted?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Waivers Accepted
          </h4>
          <div className="space-y-2">
            {data.waivers_accepted.map((waiver) => (
              <div key={waiver} className="flex items-center gap-2 text-emerald-400 text-sm">
                <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <Shield className="w-2.5 h-2.5" />
                </div>
                <span className="capitalize">{waiver.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayerRegistration() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createPlayerMutation = useMutation({
    mutationFn: async (data) => {
      const playerData = {
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender?.[0],
        parent_name: data.parent_name,
        parent_email: data.parent_email,
        parent_phone: data.parent_phone,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone,
        emergency_contact_relationship: data.emergency_contact_relationship,
        allergies: data.allergies,
        medical_conditions: data.medical_conditions,
        medications: data.medications,
        doctor_name: data.doctor_name,
        doctor_phone: data.doctor_phone,
        health_card_number: data.health_card_number,
        preferred_position: data.preferred_position,
        skill_level: data.skill_level,
        previous_experience: data.previous_experience,
        jersey_size: data.jersey_size,
        waivers_accepted: data.waivers_accepted,
        medical_consent: data.medical_consent,
        parent_signature: data.parent_signature,
        signature_date: data.signature_date,
        status: "pending",
        created_date: new Date().toISOString(),
      };

      return base44.entities.Player.create(playerData);
    },
    onSuccess: (newPlayer) => {
      localStorage.removeItem("player_registration_draft");
      navigate(`/PlayerDetail?id=${newPlayer.id}`);
    },
  });

  const handleSubmit = (data) => {
    createPlayerMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("player_registration_draft", JSON.stringify(data));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("player_registration_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Player Registration"
        subtitle="Register your child for the upcoming basketball season"
        sections={PLAYER_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={PlayerPreview}
        submitLabel={createPlayerMutation.isPending ? "Registering..." : "Register Player"}
        skipLabel="Save as Draft"
        defaultMode="form"
      />
    </div>
  );
}
