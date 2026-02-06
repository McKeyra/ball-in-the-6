import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Heart, User, Phone, Building, AlertTriangle, Droplets } from "lucide-react";

// Medical Form Configuration
const MEDICAL_SECTIONS = [
  {
    id: "player",
    label: "Player Information",
    icon: "User",
    fields: [
      {
        id: "player_name",
        type: "text",
        label: "Player Full Name",
        placeholder: "Enter player's full legal name",
        required: true,
      },
      {
        id: "player_dob",
        type: "text",
        label: "Date of Birth",
        placeholder: "YYYY-MM-DD",
        required: true,
        hint: "Format: YYYY-MM-DD",
      },
      {
        id: "blood_type",
        type: "select",
        label: "Blood Type",
        options: [
          { value: "a_positive", label: "A+" },
          { value: "a_negative", label: "A-" },
          { value: "b_positive", label: "B+" },
          { value: "b_negative", label: "B-" },
          { value: "ab_positive", label: "AB+" },
          { value: "ab_negative", label: "AB-" },
          { value: "o_positive", label: "O+" },
          { value: "o_negative", label: "O-" },
          { value: "unknown", label: "Unknown" },
        ],
        hint: "Optional but recommended for emergencies",
      },
    ],
  },
  {
    id: "conditions",
    label: "Medical Conditions",
    icon: "Heart",
    fields: [
      {
        id: "allergies",
        type: "textarea",
        label: "Allergies",
        placeholder: "List all known allergies (medications, food, environmental)...\n\nExample:\n- Penicillin (causes hives)\n- Peanuts (anaphylaxis - carries EpiPen)\n- Bee stings (mild swelling)",
        rows: 5,
        hint: "Include severity and reactions if known. Enter 'None' if no known allergies.",
      },
      {
        id: "medical_conditions",
        type: "checkboxes",
        label: "Medical Conditions",
        hint: "Check all conditions that apply to the player",
        options: [
          {
            value: "asthma",
            label: "Asthma",
            description: "Respiratory condition - may require inhaler during activities",
          },
          {
            value: "diabetes",
            label: "Diabetes",
            description: "Type 1 or Type 2 - may require insulin or glucose monitoring",
          },
          {
            value: "epilepsy",
            label: "Epilepsy",
            description: "Seizure disorder - staff should be aware of seizure protocols",
          },
          {
            value: "heart_condition",
            label: "Heart Condition",
            description: "Any cardiac issues - may limit physical exertion",
          },
          {
            value: "other",
            label: "Other Condition",
            description: "Please describe in the notes section below",
          },
        ],
      },
      {
        id: "condition_notes",
        type: "textarea",
        label: "Additional Medical Notes",
        placeholder: "Provide details about any conditions checked above or other health information...",
        rows: 3,
        hint: "Include any specific instructions for coaches or emergency responders",
      },
      {
        id: "medications",
        type: "textarea",
        label: "Current Medications",
        placeholder: "List all current medications with dosage and frequency...\n\nExample:\n- Ventolin inhaler - as needed for asthma\n- Methylphenidate 10mg - daily for ADHD",
        rows: 4,
        hint: "Enter 'None' if not taking any medications",
      },
    ],
  },
  {
    id: "insurance",
    label: "Insurance Information",
    icon: "Shield",
    fields: [
      {
        id: "insurance_provider",
        type: "text",
        label: "Insurance Provider",
        placeholder: "e.g., Sun Life, Manulife, Blue Cross",
        required: true,
      },
      {
        id: "policy_number",
        type: "text",
        label: "Policy Number",
        placeholder: "Enter policy number",
        required: true,
      },
      {
        id: "group_number",
        type: "text",
        label: "Group Number",
        placeholder: "Enter group number (if applicable)",
        hint: "Leave blank if not applicable",
      },
    ],
  },
  {
    id: "physician",
    label: "Primary Physician",
    icon: "Stethoscope",
    fields: [
      {
        id: "doctor_name",
        type: "text",
        label: "Doctor's Name",
        placeholder: "Dr. Full Name",
        required: true,
      },
      {
        id: "doctor_phone",
        type: "text",
        label: "Doctor's Phone Number",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "hospital_preference",
        type: "text",
        label: "Preferred Hospital",
        placeholder: "e.g., SickKids, Toronto General",
        hint: "In case of emergency, which hospital should be used?",
      },
    ],
  },
  {
    id: "emergency",
    label: "Emergency Contacts",
    icon: "Phone",
    fields: [
      {
        id: "emergency1_name",
        type: "text",
        label: "Primary Emergency Contact Name",
        placeholder: "Full name",
        required: true,
      },
      {
        id: "emergency1_relationship",
        type: "select",
        label: "Relationship",
        required: true,
        options: [
          { value: "mother", label: "Mother" },
          { value: "father", label: "Father" },
          { value: "guardian", label: "Legal Guardian" },
          { value: "grandparent", label: "Grandparent" },
          { value: "aunt_uncle", label: "Aunt/Uncle" },
          { value: "sibling", label: "Sibling (18+)" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "emergency1_phone",
        type: "text",
        label: "Primary Contact Phone",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "emergency2_name",
        type: "text",
        label: "Secondary Emergency Contact Name",
        placeholder: "Full name",
        required: true,
        hint: "Must be different from primary contact",
      },
      {
        id: "emergency2_relationship",
        type: "select",
        label: "Relationship",
        required: true,
        options: [
          { value: "mother", label: "Mother" },
          { value: "father", label: "Father" },
          { value: "guardian", label: "Legal Guardian" },
          { value: "grandparent", label: "Grandparent" },
          { value: "aunt_uncle", label: "Aunt/Uncle" },
          { value: "sibling", label: "Sibling (18+)" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "emergency2_phone",
        type: "text",
        label: "Secondary Contact Phone",
        placeholder: "(416) 555-0123",
        required: true,
      },
    ],
  },
];

// Blood type display helper
const getBloodTypeDisplay = (value) => {
  const types = {
    a_positive: "A+",
    a_negative: "A-",
    b_positive: "B+",
    b_negative: "B-",
    ab_positive: "AB+",
    ab_negative: "AB-",
    o_positive: "O+",
    o_negative: "O-",
    unknown: "?",
  };
  return types[value] || "—";
};

// Preview Component - Medical ID Card Style
function MedicalPreview({ data }) {
  const hasConditions = data.medical_conditions?.length > 0;
  const hasAllergies = data.allergies && data.allergies.toLowerCase() !== "none";

  return (
    <div className="space-y-4">
      {/* Medical ID Card */}
      <div className="rounded-xl bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent border border-red-500/30 overflow-hidden">
        {/* Card Header */}
        <div className="bg-red-500/20 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-xs font-bold uppercase tracking-wide">
              Medical ID
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Droplets className="w-4 h-4 text-red-400" />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-white font-semibold text-lg">
              {data.player_name || "Player Name"}
            </p>
            <p className="text-white/40 text-sm">
              DOB: {data.player_dob || "—"}
            </p>
          </div>

          {/* Blood Type Badge */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30">
              <span className="text-xs text-red-400/70 block">Blood Type</span>
              <span className="text-red-400 font-bold text-xl">
                {getBloodTypeDisplay(data.blood_type)}
              </span>
            </div>
            {hasConditions && (
              <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <span className="text-xs text-amber-400/70 block">Conditions</span>
                <span className="text-amber-400 font-bold">
                  {data.medical_conditions?.length || 0}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(hasAllergies || hasConditions) && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
              Medical Alerts
            </span>
          </div>

          {hasAllergies && (
            <div className="mb-2">
              <span className="text-white/60 text-xs">Allergies:</span>
              <p className="text-white text-sm">{data.allergies}</p>
            </div>
          )}

          {hasConditions && (
            <div className="flex flex-wrap gap-1">
              {data.medical_conditions?.map((condition) => (
                <span
                  key={condition}
                  className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs capitalize"
                >
                  {condition.replace("_", " ")}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Insurance Card */}
      {data.insurance_provider && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building className="w-4 h-4 text-white/40" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
              Insurance
            </span>
          </div>
          <p className="text-white font-medium">{data.insurance_provider}</p>
          <p className="text-white/40 text-sm">Policy: {data.policy_number || "—"}</p>
          {data.group_number && (
            <p className="text-white/40 text-sm">Group: {data.group_number}</p>
          )}
        </div>
      )}

      {/* Physician Card */}
      {data.doctor_name && (
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-white/40" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
              Physician
            </span>
          </div>
          <p className="text-white font-medium">{data.doctor_name}</p>
          <p className="text-white/40 text-sm">{data.doctor_phone || "—"}</p>
          {data.hospital_preference && (
            <p className="text-white/40 text-sm mt-1">
              Hospital: {data.hospital_preference}
            </p>
          )}
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-4 h-4 text-white/40" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
            Emergency Contacts
          </span>
        </div>
        <div className="space-y-2">
          {data.emergency1_name && (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white text-sm font-medium">{data.emergency1_name}</p>
                <p className="text-white/40 text-xs capitalize">
                  {data.emergency1_relationship?.replace("_", " ")}
                </p>
              </div>
              <span className="text-[#c9a962] text-sm">{data.emergency1_phone}</span>
            </div>
          )}
          {data.emergency2_name && (
            <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
              <div>
                <p className="text-white text-sm font-medium">{data.emergency2_name}</p>
                <p className="text-white/40 text-xs capitalize">
                  {data.emergency2_relationship?.replace("_", " ")}
                </p>
              </div>
              <span className="text-[#c9a962] text-sm">{data.emergency2_phone}</span>
            </div>
          )}
          {!data.emergency1_name && !data.emergency2_name && (
            <p className="text-white/40 text-sm italic">No contacts added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MedicalForm() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const submitMedicalFormMutation = useMutation({
    mutationFn: async (data) => {
      const medicalData = {
        player_name: data.player_name,
        player_dob: data.player_dob,
        blood_type: data.blood_type,
        allergies: data.allergies,
        medical_conditions: data.medical_conditions,
        condition_notes: data.condition_notes,
        medications: data.medications,
        insurance_provider: data.insurance_provider,
        policy_number: data.policy_number,
        group_number: data.group_number,
        doctor_name: data.doctor_name,
        doctor_phone: data.doctor_phone,
        hospital_preference: data.hospital_preference,
        emergency_contact_1: {
          name: data.emergency1_name,
          relationship: data.emergency1_relationship,
          phone: data.emergency1_phone,
        },
        emergency_contact_2: {
          name: data.emergency2_name,
          relationship: data.emergency2_relationship,
          phone: data.emergency2_phone,
        },
        submitted_at: new Date().toISOString(),
        status: "active",
      };

      return base44.entities.MedicalForm.create(medicalData);
    },
    onSuccess: (result) => {
      localStorage.removeItem("medical_form_draft");
      navigate("/Dashboard");
    },
  });

  const handleSubmit = (data) => {
    submitMedicalFormMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("medical_form_draft", JSON.stringify(data));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("medical_form_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Medical Information Form"
        subtitle="Please provide accurate health information for player safety"
        sections={MEDICAL_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={MedicalPreview}
        submitLabel={submitMedicalFormMutation.isPending ? "Submitting..." : "Submit Medical Form"}
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
