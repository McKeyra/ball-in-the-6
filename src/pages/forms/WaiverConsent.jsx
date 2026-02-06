import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Shield, Check, Calendar, User } from "lucide-react";

// Calculate if participant is a minor (under 18)
const calculateAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Waiver Form Configuration
const WAIVER_SECTIONS = [
  {
    id: "participant",
    label: "Participant Information",
    icon: "User",
    fields: [
      {
        id: "participant_name",
        type: "text",
        label: "Participant Full Legal Name",
        placeholder: "Enter full legal name as it appears on ID",
        required: true,
        hint: "This name will appear on the legal waiver document",
      },
      {
        id: "participant_dob",
        type: "text",
        label: "Date of Birth",
        placeholder: "YYYY-MM-DD",
        required: true,
        hint: "Format: YYYY-MM-DD (e.g., 2010-05-15)",
      },
      {
        id: "parent_guardian_name",
        type: "text",
        label: "Parent/Guardian Name (if participant is under 18)",
        placeholder: "Parent or legal guardian full name",
        hint: "Required if participant is a minor",
      },
      {
        id: "parent_guardian_relationship",
        type: "select",
        label: "Relationship to Participant",
        options: [
          { value: "parent", label: "Parent" },
          { value: "legal_guardian", label: "Legal Guardian" },
          { value: "grandparent", label: "Grandparent (with legal custody)" },
          { value: "other", label: "Other Legal Representative" },
        ],
        hint: "Only required if signing on behalf of a minor",
      },
    ],
  },
  {
    id: "waivers",
    label: "Waivers & Releases",
    icon: "Shield",
    fields: [
      {
        id: "liability_waiver",
        type: "checkboxes",
        label: "Liability Waiver",
        required: true,
        options: [
          {
            value: "liability_accepted",
            label: "I Accept the Liability Waiver",
            description:
              "I hereby release, waive, discharge, and covenant not to sue Ball in the 6, its officers, directors, employees, agents, volunteers, sponsors, and affiliates from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or injury that may be sustained while participating in any activities, programs, or events.",
          },
        ],
      },
      {
        id: "assumption_of_risk",
        type: "checkboxes",
        label: "Assumption of Risk",
        required: true,
        options: [
          {
            value: "risk_accepted",
            label: "I Acknowledge and Accept the Risks",
            description:
              "I acknowledge that participation in basketball and related athletic activities involves inherent risks including, but not limited to: physical contact, falls, collisions, muscle strains, sprains, fractures, concussions, and other injuries. I voluntarily assume all such risks and accept personal responsibility for any injury sustained.",
          },
        ],
      },
      {
        id: "photo_video_release",
        type: "checkboxes",
        label: "Photo/Video Release",
        required: true,
        options: [
          {
            value: "media_release_accepted",
            label: "I Grant Permission for Photo/Video Use",
            description:
              "I grant permission to Ball in the 6 and its affiliates to use photographs, video recordings, and other media of the participant for promotional, educational, and marketing purposes including website, social media, print materials, and broadcasts without compensation.",
          },
        ],
      },
      {
        id: "medical_authorization",
        type: "checkboxes",
        label: "Medical Treatment Authorization",
        required: true,
        options: [
          {
            value: "medical_auth_accepted",
            label: "I Authorize Emergency Medical Treatment",
            description:
              "In the event of an emergency, I authorize Ball in the 6 staff and medical personnel to provide or arrange for emergency medical treatment, including transportation to a medical facility. I understand that I am responsible for any medical expenses incurred.",
          },
        ],
      },
    ],
  },
  {
    id: "signature",
    label: "Electronic Signature",
    icon: "FileSignature",
    fields: [
      {
        id: "signature_typed",
        type: "text",
        label: "Type Your Full Legal Name as Signature",
        placeholder: "Type your full name exactly as it appears above",
        required: true,
        hint: "By typing your name, you acknowledge this constitutes a legal electronic signature",
      },
      {
        id: "signature_date",
        type: "text",
        label: "Today's Date",
        placeholder: "YYYY-MM-DD",
        required: true,
        hint: "Enter today's date to confirm signature",
      },
      {
        id: "signer_capacity",
        type: "select",
        label: "I am signing as",
        required: true,
        options: [
          { value: "self", label: "The Participant (18 or older)" },
          { value: "parent", label: "Parent of Minor Participant" },
          { value: "guardian", label: "Legal Guardian of Minor Participant" },
        ],
      },
      {
        id: "agreement_confirmation",
        type: "checkboxes",
        label: "Final Confirmation",
        required: true,
        options: [
          {
            value: "confirmed",
            label: "I confirm I have read and understood all waivers above",
            description:
              "I confirm that I have carefully read this waiver and release, understand its contents, and sign it voluntarily. I understand that this waiver is legally binding.",
          },
        ],
      },
    ],
  },
];

// Preview Component - Signed Document Summary
function WaiverPreview({ data }) {
  const isMinor = data.participant_dob ? calculateAge(data.participant_dob) < 18 : false;
  const allWaiversSigned =
    data.liability_waiver?.includes("liability_accepted") &&
    data.assumption_of_risk?.includes("risk_accepted") &&
    data.photo_video_release?.includes("media_release_accepted") &&
    data.medical_authorization?.includes("medical_auth_accepted");

  return (
    <div className="space-y-4">
      {/* Document Header */}
      <div className="rounded-xl bg-gradient-to-br from-[#c9a962]/20 to-transparent border border-[#c9a962]/30 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#c9a962]/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#c9a962]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Waiver & Consent</h3>
            <p className="text-white/40 text-xs">Digital Document</p>
          </div>
        </div>
        <div className="text-xs text-white/60">
          Document ID: WVR-{Date.now().toString(36).toUpperCase()}
        </div>
      </div>

      {/* Participant Info */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-white/40" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
            Participant
          </span>
        </div>
        <p className="text-white font-medium">
          {data.participant_name || "Name pending..."}
        </p>
        <p className="text-white/40 text-sm">
          DOB: {data.participant_dob || "—"}
        </p>
        {isMinor && data.parent_guardian_name && (
          <p className="text-white/40 text-sm mt-1">
            Guardian: {data.parent_guardian_name}
          </p>
        )}
      </div>

      {/* Waiver Checklist */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">
          Waivers Signed
        </h4>
        <div className="space-y-2">
          <WaiverCheckItem
            label="Liability Waiver"
            checked={data.liability_waiver?.includes("liability_accepted")}
          />
          <WaiverCheckItem
            label="Assumption of Risk"
            checked={data.assumption_of_risk?.includes("risk_accepted")}
          />
          <WaiverCheckItem
            label="Photo/Video Release"
            checked={data.photo_video_release?.includes("media_release_accepted")}
          />
          <WaiverCheckItem
            label="Medical Authorization"
            checked={data.medical_authorization?.includes("medical_auth_accepted")}
          />
        </div>
      </div>

      {/* Signature Block */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">
          Signature
        </h4>
        {data.signature_typed ? (
          <>
            <p
              className="text-lg font-script text-[#c9a962] italic"
              style={{ fontFamily: "cursive" }}
            >
              {data.signature_typed}
            </p>
            <div className="flex items-center gap-2 mt-2 text-white/40 text-sm">
              <Calendar className="w-3 h-3" />
              <span>{data.signature_date || "Date pending"}</span>
            </div>
            <p className="text-white/40 text-xs mt-1">
              Signed as: {data.signer_capacity === "self" ? "Participant" : data.signer_capacity}
            </p>
          </>
        ) : (
          <p className="text-white/40 text-sm italic">Awaiting signature...</p>
        )}
      </div>

      {/* Status Badge */}
      <div
        className={`rounded-xl p-4 text-center ${
          allWaiversSigned && data.signature_typed && data.agreement_confirmation?.includes("confirmed")
            ? "bg-emerald-500/10 border border-emerald-500/30"
            : "bg-amber-500/10 border border-amber-500/30"
        }`}
      >
        <span
          className={`text-sm font-medium ${
            allWaiversSigned && data.signature_typed && data.agreement_confirmation?.includes("confirmed")
              ? "text-emerald-400"
              : "text-amber-400"
          }`}
        >
          {allWaiversSigned && data.signature_typed && data.agreement_confirmation?.includes("confirmed")
            ? "Ready to Submit"
            : "Completion Required"}
        </span>
      </div>
    </div>
  );
}

function WaiverCheckItem({ label, checked }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center ${
          checked ? "bg-emerald-500/20" : "bg-white/[0.05]"
        }`}
      >
        {checked ? (
          <Check className="w-3 h-3 text-emerald-400" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-white/20" />
        )}
      </div>
      <span className={`text-sm ${checked ? "text-white" : "text-white/40"}`}>
        {label}
      </span>
    </div>
  );
}

export default function WaiverConsent() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const submitWaiverMutation = useMutation({
    mutationFn: async (data) => {
      const waiverData = {
        participant_name: data.participant_name,
        participant_dob: data.participant_dob,
        parent_guardian_name: data.parent_guardian_name,
        parent_guardian_relationship: data.parent_guardian_relationship,
        liability_waiver_signed: data.liability_waiver?.includes("liability_accepted"),
        assumption_of_risk_signed: data.assumption_of_risk?.includes("risk_accepted"),
        photo_video_release_signed: data.photo_video_release?.includes("media_release_accepted"),
        medical_authorization_signed: data.medical_authorization?.includes("medical_auth_accepted"),
        signature: data.signature_typed,
        signature_date: data.signature_date,
        signer_capacity: data.signer_capacity,
        signed_at: new Date().toISOString(),
        status: "signed",
      };

      return base44.entities.WaiverConsent.create(waiverData);
    },
    onSuccess: (result) => {
      localStorage.removeItem("waiver_consent_draft");
      navigate("/Dashboard");
    },
  });

  const handleSubmit = (data) => {
    submitWaiverMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("waiver_consent_draft", JSON.stringify(data));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("waiver_consent_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Waiver & Consent Form"
        subtitle="Please read carefully and sign all required waivers"
        sections={WAIVER_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={WaiverPreview}
        submitLabel={submitWaiverMutation.isPending ? "Submitting..." : "Submit Signed Waiver"}
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
