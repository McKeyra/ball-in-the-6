import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { UserCheck, Shield, MapPin, FileCheck, Calendar, Clock } from "lucide-react";

// Background Check Form Configuration
const BACKGROUND_SECTIONS = [
  {
    id: "personal",
    label: "Personal Information",
    icon: "User",
    description: "Legal identification information required for background verification",
    fields: [
      {
        id: "full_legal_name",
        type: "text",
        label: "Full Legal Name",
        placeholder: "Enter name exactly as it appears on government ID",
        required: true,
        hint: "Include all legal names (first, middle, last) as shown on your ID",
      },
      {
        id: "date_of_birth",
        type: "text",
        label: "Date of Birth",
        placeholder: "YYYY-MM-DD",
        required: true,
        hint: "Format: YYYY-MM-DD",
      },
      {
        id: "ssn_last_four",
        type: "text",
        label: "Last 4 Digits of Social Insurance Number (SIN)",
        placeholder: "XXXX",
        required: true,
        hint: "For verification purposes only. Your full SIN is never stored.",
      },
      {
        id: "other_names",
        type: "textarea",
        label: "Other Names Used (Maiden Name, Aliases)",
        placeholder: "List any other names you have used, one per line...",
        rows: 2,
        hint: "Include maiden names, previous married names, or any legal name changes",
      },
    ],
  },
  {
    id: "address",
    label: "Address History",
    icon: "MapPin",
    description: "Current and previous addresses for the past 5 years",
    fields: [
      {
        id: "current_address",
        type: "textarea",
        label: "Current Address",
        placeholder: "Street Address\nCity, Province/State\nPostal/ZIP Code\nCountry",
        rows: 4,
        required: true,
        hint: "Enter your complete current residential address",
      },
      {
        id: "years_at_current",
        type: "select",
        label: "Years at Current Address",
        required: true,
        options: [
          { value: "less_than_1", label: "Less than 1 year" },
          { value: "1_2", label: "1-2 years" },
          { value: "2_3", label: "2-3 years" },
          { value: "3_5", label: "3-5 years" },
          { value: "5_plus", label: "5+ years" },
        ],
      },
      {
        id: "previous_addresses",
        type: "textarea",
        label: "Previous Addresses (Past 5 Years)",
        placeholder: "List previous addresses with approximate dates:\n\n123 Old Street, Toronto, ON M5V 1A1 (2020-2022)\n456 Former Ave, Mississauga, ON L5B 2C3 (2018-2020)",
        rows: 6,
        hint: "Include all addresses for the past 5 years if at current address less than 5 years",
      },
    ],
  },
  {
    id: "consent",
    label: "Consent & Authorization",
    icon: "Shield",
    description: "Authorization for background verification",
    fields: [
      {
        id: "authorize_check",
        type: "checkboxes",
        label: "Authorization to Conduct Background Check",
        required: true,
        options: [
          {
            value: "check_authorized",
            label: "I Authorize This Background Check",
            description:
              "I hereby authorize Ball in the 6 and its designated background check provider to conduct a comprehensive background investigation. This may include, but is not limited to: criminal record checks, sex offender registry searches, identity verification, and other relevant background screenings as permitted by law.",
          },
        ],
      },
      {
        id: "understand_results",
        type: "checkboxes",
        label: "Understanding of Results",
        required: true,
        options: [
          {
            value: "results_understood",
            label: "I Understand Results May Affect Eligibility",
            description:
              "I understand that the results of this background check may affect my eligibility to participate in Ball in the 6 programs, particularly in roles involving contact with minors. I understand that a criminal record does not automatically disqualify me, but certain offenses may prevent participation in specific roles.",
          },
        ],
      },
      {
        id: "information_accuracy",
        type: "checkboxes",
        label: "Accuracy Acknowledgment",
        options: [
          {
            value: "accuracy_confirmed",
            label: "I Confirm Information Accuracy",
            description:
              "I understand that providing false or misleading information on this form may result in immediate disqualification from participation and potential legal consequences.",
          },
        ],
      },
    ],
  },
  {
    id: "declaration",
    label: "Declaration & Signature",
    icon: "FileSignature",
    description: "Final declaration and electronic signature",
    fields: [
      {
        id: "truthfulness_statement",
        type: "checkboxes",
        label: "Truthfulness Declaration",
        required: true,
        options: [
          {
            value: "truthfulness_declared",
            label: "I Declare All Information is True and Complete",
            description:
              "I declare under penalty of perjury that all information provided on this form is true, accurate, and complete to the best of my knowledge. I understand that any false statements or omissions may be grounds for denial or revocation of my participation privileges.",
          },
        ],
      },
      {
        id: "data_consent",
        type: "checkboxes",
        label: "Data Processing Consent",
        required: true,
        options: [
          {
            value: "data_consent_given",
            label: "I Consent to Data Processing",
            description:
              "I consent to the collection, storage, and processing of my personal information for the purpose of conducting this background check. I understand my data will be handled in accordance with applicable privacy laws and the organization's privacy policy.",
          },
        ],
      },
      {
        id: "typed_signature",
        type: "text",
        label: "Type Your Full Legal Name as Electronic Signature",
        placeholder: "Type your full legal name exactly as entered above",
        required: true,
        hint: "By typing your name, you confirm this serves as your legal electronic signature",
      },
      {
        id: "signature_date",
        type: "text",
        label: "Date of Signature",
        placeholder: "YYYY-MM-DD",
        required: true,
      },
    ],
  },
];

// Preview Component - Authorization Card with Status
function BackgroundPreview({ data }) {
  const consentsComplete =
    data.authorize_check?.includes("check_authorized") &&
    data.understand_results?.includes("results_understood");

  const declarationComplete =
    data.truthfulness_statement?.includes("truthfulness_declared") &&
    data.data_consent?.includes("data_consent_given") &&
    data.typed_signature;

  const isComplete =
    data.full_legal_name &&
    data.date_of_birth &&
    data.ssn_last_four &&
    data.current_address &&
    consentsComplete &&
    declarationComplete;

  // Status determination
  const getStatus = () => {
    if (!isComplete) return { label: "Incomplete", color: "amber", icon: Clock };
    return { label: "Ready to Submit", color: "emerald", icon: FileCheck };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4">
      {/* Authorization Card */}
      <div className="rounded-xl bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent border border-blue-500/30 overflow-hidden">
        {/* Card Header */}
        <div className="bg-blue-500/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wide">
              Background Check
            </span>
          </div>
          <div className="text-xs text-white/40">
            Authorization Form
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-4">
          {/* Applicant Info */}
          <div>
            <p className="text-white font-semibold text-lg">
              {data.full_legal_name || "Applicant Name"}
            </p>
            <div className="flex items-center gap-4 mt-1 text-white/40 text-sm">
              <span>DOB: {data.date_of_birth || "—"}</span>
              {data.ssn_last_four && (
                <span>SIN: ***-***-{data.ssn_last_four}</span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
              status.color === "emerald"
                ? "bg-emerald-500/20 border-emerald-500/30"
                : "bg-amber-500/20 border-amber-500/30"
            } border`}
          >
            <StatusIcon
              className={`w-3 h-3 ${
                status.color === "emerald" ? "text-emerald-400" : "text-amber-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                status.color === "emerald" ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-white/40" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
            Current Address
          </span>
        </div>
        {data.current_address ? (
          <>
            <p className="text-white text-sm whitespace-pre-line">
              {data.current_address}
            </p>
            <p className="text-white/40 text-xs mt-2">
              Duration: {data.years_at_current?.replace("_", "-").replace("plus", "+") || "—"}
            </p>
          </>
        ) : (
          <p className="text-white/40 text-sm italic">Address pending...</p>
        )}
      </div>

      {/* Authorization Checklist */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-white/40" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
            Authorizations
          </span>
        </div>
        <div className="space-y-2">
          <AuthCheckItem
            label="Background Check Authorized"
            checked={data.authorize_check?.includes("check_authorized")}
          />
          <AuthCheckItem
            label="Results Impact Understood"
            checked={data.understand_results?.includes("results_understood")}
          />
          <AuthCheckItem
            label="Information Accuracy Confirmed"
            checked={data.information_accuracy?.includes("accuracy_confirmed")}
          />
          <AuthCheckItem
            label="Truthfulness Declared"
            checked={data.truthfulness_statement?.includes("truthfulness_declared")}
          />
          <AuthCheckItem
            label="Data Processing Consented"
            checked={data.data_consent?.includes("data_consent_given")}
          />
        </div>
      </div>

      {/* Signature Block */}
      <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] p-4">
        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">
          Electronic Signature
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

      {/* Privacy Notice */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-3">
        <p className="text-white/30 text-xs leading-relaxed">
          Your personal information is protected under applicable privacy laws.
          Background check results are kept confidential and accessed only by
          authorized personnel on a need-to-know basis.
        </p>
      </div>

      {/* Final Status */}
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
          {isComplete
            ? "Authorization Complete - Ready to Submit"
            : "Please Complete All Required Fields"}
        </span>
      </div>
    </div>
  );
}

function AuthCheckItem({ label, checked }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          checked ? "bg-emerald-500/20" : "bg-white/[0.05]"
        }`}
      >
        {checked ? (
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        )}
      </div>
      <span className={`text-xs ${checked ? "text-white" : "text-white/40"}`}>
        {label}
      </span>
    </div>
  );
}

export default function BackgroundCheck() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const submitBackgroundCheckMutation = useMutation({
    mutationFn: async (data) => {
      const backgroundData = {
        full_legal_name: data.full_legal_name,
        date_of_birth: data.date_of_birth,
        ssn_last_four: data.ssn_last_four,
        other_names: data.other_names,
        current_address: data.current_address,
        years_at_current: data.years_at_current,
        previous_addresses: data.previous_addresses,
        check_authorized: data.authorize_check?.includes("check_authorized"),
        results_understood: data.understand_results?.includes("results_understood"),
        accuracy_confirmed: data.information_accuracy?.includes("accuracy_confirmed"),
        truthfulness_declared: data.truthfulness_statement?.includes("truthfulness_declared"),
        data_consent_given: data.data_consent?.includes("data_consent_given"),
        signature: data.typed_signature,
        signature_date: data.signature_date,
        submitted_at: new Date().toISOString(),
        status: "pending_verification",
        check_status: "submitted",
      };

      return base44.entities.BackgroundCheck.create(backgroundData);
    },
    onSuccess: (result) => {
      localStorage.removeItem("background_check_draft");
      navigate("/Dashboard");
    },
  });

  const handleSubmit = (data) => {
    submitBackgroundCheckMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("background_check_draft", JSON.stringify(data));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("background_check_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Background Check Authorization"
        subtitle="Consent form for volunteer and staff background verification"
        sections={BACKGROUND_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={BackgroundPreview}
        submitLabel={
          submitBackgroundCheckMutation.isPending
            ? "Submitting..."
            : "Submit Authorization"
        }
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
