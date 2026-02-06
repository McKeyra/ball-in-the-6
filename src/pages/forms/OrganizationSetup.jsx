import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Building2, Palette, Phone, Plug, Scale, Globe, Mail, MapPin } from "lucide-react";

// Color Options for Branding Color Picker
const BRAND_COLOR_OPTIONS = [
  { value: "#c9a962", label: "Gold", color: "#c9a962" },
  { value: "#3b82f6", label: "Blue", color: "#3b82f6" },
  { value: "#ef4444", label: "Red", color: "#ef4444" },
  { value: "#22c55e", label: "Green", color: "#22c55e" },
  { value: "#8b5cf6", label: "Purple", color: "#8b5cf6" },
  { value: "#f97316", label: "Orange", color: "#f97316" },
  { value: "#06b6d4", label: "Cyan", color: "#06b6d4" },
  { value: "#ec4899", label: "Pink", color: "#ec4899" },
  { value: "#1e3a5f", label: "Navy", color: "#1e3a5f" },
  { value: "#0f172a", label: "Slate", color: "#0f172a" },
  { value: "#7c3aed", label: "Violet", color: "#7c3aed" },
  { value: "#14b8a6", label: "Teal", color: "#14b8a6" },
];

// Organization Setup Form Configuration
const ORG_SECTIONS = [
  {
    id: "organization",
    label: "Organization Details",
    icon: "Building2",
    description: "Basic information about your organization",
    fields: [
      {
        id: "org_name",
        type: "text",
        label: "Organization Name",
        placeholder: "Toronto Youth Basketball Association",
        required: true,
      },
      {
        id: "tagline",
        type: "text",
        label: "Tagline",
        placeholder: "Building Champions On and Off the Court",
        hint: "A short phrase that describes your organization's mission",
      },
      {
        id: "logo",
        type: "upload",
        label: "Organization Logo",
        accept: "image/*",
        hint: "PNG or SVG with transparent background, minimum 400x400 pixels",
      },
      {
        id: "website",
        type: "text",
        label: "Website URL",
        placeholder: "https://tyba.org",
      },
      {
        id: "org_type",
        type: "cards",
        label: "Organization Type",
        required: true,
        columns: 2,
        options: [
          {
            value: "nonprofit",
            label: "Non-Profit",
            description: "501(c)(3) or equivalent charity",
            icon: "Heart"
          },
          {
            value: "forprofit",
            label: "For-Profit",
            description: "Business entity",
            icon: "Building"
          },
          {
            value: "school",
            label: "School/Education",
            description: "School district or educational institution",
            icon: "GraduationCap"
          },
          {
            value: "recreation",
            label: "Parks & Recreation",
            description: "Municipal recreation department",
            icon: "TreePine"
          },
        ],
      },
    ],
  },
  {
    id: "branding",
    label: "Brand Colors",
    icon: "Palette",
    description: "Define your organization's visual identity",
    fields: [
      {
        id: "primary_color",
        type: "cards",
        label: "Primary Brand Color",
        required: true,
        columns: 4,
        options: BRAND_COLOR_OPTIONS.map((c) => ({
          value: c.value,
          label: c.label,
          description: "",
          color: c.color,
        })),
      },
      {
        id: "secondary_color",
        type: "cards",
        label: "Secondary Brand Color",
        required: true,
        columns: 4,
        options: BRAND_COLOR_OPTIONS.map((c) => ({
          value: c.value,
          label: c.label,
          description: "",
          color: c.color,
        })),
      },
      {
        id: "font_preference",
        type: "cards",
        label: "Font Style Preference",
        columns: 3,
        options: [
          {
            value: "modern",
            label: "Modern",
            description: "Clean sans-serif fonts",
            icon: "Minus"
          },
          {
            value: "classic",
            label: "Classic",
            description: "Traditional serif fonts",
            icon: "BookOpen"
          },
          {
            value: "bold",
            label: "Bold",
            description: "Strong, impactful fonts",
            icon: "Bold"
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact Information",
    icon: "Phone",
    description: "How people can reach your organization",
    fields: [
      {
        id: "main_email",
        type: "text",
        label: "Main Email Address",
        placeholder: "info@tyba.org",
        required: true,
        hint: "Primary contact email for inquiries",
      },
      {
        id: "support_email",
        type: "text",
        label: "Support Email",
        placeholder: "support@tyba.org",
        hint: "For technical support and help requests",
      },
      {
        id: "phone",
        type: "text",
        label: "Phone Number",
        placeholder: "(416) 555-0100",
        required: true,
      },
      {
        id: "fax",
        type: "text",
        label: "Fax Number (Optional)",
        placeholder: "(416) 555-0101",
      },
      {
        id: "address_line1",
        type: "text",
        label: "Street Address",
        placeholder: "123 Sports Complex Drive",
        required: true,
      },
      {
        id: "address_line2",
        type: "text",
        label: "Suite/Unit (Optional)",
        placeholder: "Suite 200",
      },
      {
        id: "city",
        type: "text",
        label: "City",
        placeholder: "Toronto",
        required: true,
      },
      {
        id: "province_state",
        type: "text",
        label: "Province/State",
        placeholder: "Ontario",
        required: true,
      },
      {
        id: "postal_code",
        type: "text",
        label: "Postal/ZIP Code",
        placeholder: "M5V 1A1",
        required: true,
      },
      {
        id: "country",
        type: "select",
        label: "Country",
        required: true,
        options: [
          { value: "CA", label: "Canada" },
          { value: "US", label: "United States" },
          { value: "UK", label: "United Kingdom" },
          { value: "AU", label: "Australia" },
        ],
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: "Plug",
    description: "Connect third-party services",
    fields: [
      {
        id: "payment_provider",
        type: "cards",
        label: "Payment Provider",
        columns: 2,
        options: [
          {
            value: "stripe",
            label: "Stripe",
            description: "Credit cards, Apple Pay, Google Pay",
            icon: "CreditCard"
          },
          {
            value: "square",
            label: "Square",
            description: "In-person and online payments",
            icon: "Square"
          },
          {
            value: "paypal",
            label: "PayPal",
            description: "PayPal and Venmo",
            icon: "Wallet"
          },
          {
            value: "none",
            label: "No Online Payments",
            description: "Handle payments offline",
            icon: "X"
          },
        ],
      },
      {
        id: "payment_api_key",
        type: "text",
        label: "Payment API Key",
        placeholder: "pk_live_...",
        hint: "Your payment provider's public API key",
      },
      {
        id: "email_service",
        type: "cards",
        label: "Email Service",
        columns: 2,
        options: [
          {
            value: "sendgrid",
            label: "SendGrid",
            description: "Transactional and marketing emails",
            icon: "Mail"
          },
          {
            value: "mailchimp",
            label: "Mailchimp",
            description: "Email marketing and newsletters",
            icon: "Mail"
          },
          {
            value: "ses",
            label: "Amazon SES",
            description: "High-volume email sending",
            icon: "Cloud"
          },
          {
            value: "builtin",
            label: "Built-in Email",
            description: "Use platform default email",
            icon: "Settings"
          },
        ],
      },
      {
        id: "email_api_key",
        type: "text",
        label: "Email Service API Key",
        placeholder: "SG.xxx...",
        hint: "API key for your email service",
      },
      {
        id: "calendar_integration",
        type: "checkboxes",
        label: "Calendar Integrations",
        options: [
          { value: "google", label: "Google Calendar", description: "Sync events with Google Calendar", icon: "Calendar" },
          { value: "outlook", label: "Outlook Calendar", description: "Sync with Microsoft Outlook", icon: "Calendar" },
          { value: "apple", label: "Apple Calendar", description: "iCal feed support", icon: "Calendar" },
        ],
      },
    ],
  },
  {
    id: "legal",
    label: "Legal & Compliance",
    icon: "Scale",
    description: "Legal documents and policies",
    fields: [
      {
        id: "terms_url",
        type: "text",
        label: "Terms of Service URL",
        placeholder: "https://tyba.org/terms",
        hint: "Link to your terms of service document",
      },
      {
        id: "privacy_url",
        type: "text",
        label: "Privacy Policy URL",
        placeholder: "https://tyba.org/privacy",
        hint: "Link to your privacy policy document",
      },
      {
        id: "refund_policy_url",
        type: "text",
        label: "Refund Policy URL",
        placeholder: "https://tyba.org/refunds",
        hint: "Link to your refund/cancellation policy",
      },
      {
        id: "waiver_url",
        type: "text",
        label: "Liability Waiver URL",
        placeholder: "https://tyba.org/waiver",
        hint: "Link to your liability waiver document",
      },
      {
        id: "compliance_options",
        type: "checkboxes",
        label: "Compliance Settings",
        options: [
          {
            value: "gdpr",
            label: "GDPR Compliance",
            description: "European data protection regulations",
            icon: "Shield"
          },
          {
            value: "ccpa",
            label: "CCPA Compliance",
            description: "California consumer privacy",
            icon: "Shield"
          },
          {
            value: "coppa",
            label: "COPPA Compliance",
            description: "Children's online privacy protection",
            icon: "Shield"
          },
          {
            value: "pipeda",
            label: "PIPEDA Compliance",
            description: "Canadian privacy legislation",
            icon: "Shield"
          },
        ],
      },
      {
        id: "tax_id",
        type: "text",
        label: "Tax ID / EIN",
        placeholder: "12-3456789",
        hint: "Your organization's tax identification number",
      },
    ],
  },
];

// Preview Component - Organization Brand Card
function OrganizationPreview({ data }) {
  const primaryColor = data.primary_color || "#c9a962";
  const secondaryColor = data.secondary_color || "#3b82f6";

  const fullAddress = [
    data.address_line1,
    data.address_line2,
    [data.city, data.province_state].filter(Boolean).join(", "),
    data.postal_code,
    data.country === "CA" ? "Canada" : data.country === "US" ? "USA" : data.country,
  ].filter(Boolean).join("\n");

  return (
    <div className="space-y-4">
      {/* Organization Brand Card */}
      <div
        className="rounded-2xl border border-white/[0.06] p-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 100%)`
        }}
      >
        {/* Color accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
          }}
        />

        <div className="flex items-center gap-4 mt-2">
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: `${primaryColor}30` }}
          >
            {data.logo ? (
              <img
                src={URL.createObjectURL(data.logo)}
                alt="Organization Logo"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <Building2 className="w-10 h-10" style={{ color: primaryColor }} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">
              {data.org_name || "Organization Name"}
            </h3>
            {data.tagline && (
              <p className="text-white/50 text-sm italic">"{data.tagline}"</p>
            )}
            {data.org_type && (
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 capitalize"
                style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
              >
                {data.org_type.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            )}
          </div>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-lg"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="text-white/60 text-xs">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-lg"
              style={{ backgroundColor: secondaryColor }}
            />
            <span className="text-white/60 text-xs">Secondary</span>
          </div>
          {data.font_preference && (
            <span className="text-white/40 text-xs ml-auto capitalize">
              {data.font_preference} fonts
            </span>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Contact
        </h4>
        <div className="space-y-3 text-sm">
          {data.main_email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-white/40" />
              <span className="text-white">{data.main_email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white/40" />
              <span className="text-white">{data.phone}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-white/40" />
              <span className="text-[#c9a962]">{data.website}</span>
            </div>
          )}
          {data.address_line1 && (
            <div className="flex items-start gap-2 mt-2 pt-2 border-t border-white/[0.06]">
              <MapPin className="w-4 h-4 text-white/40 mt-0.5" />
              <span className="text-white/60 whitespace-pre-line text-xs">{fullAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* Integrations */}
      {(data.payment_provider || data.email_service) && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Plug className="w-4 h-4" />
            Integrations
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.payment_provider && data.payment_provider !== "none" && (
              <span className="px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-400 text-xs font-medium capitalize">
                {data.payment_provider}
              </span>
            )}
            {data.email_service && data.email_service !== "builtin" && (
              <span className="px-2 py-1 rounded-full bg-blue-400/20 text-blue-400 text-xs font-medium capitalize">
                {data.email_service}
              </span>
            )}
            {data.calendar_integration?.map((cal) => (
              <span
                key={cal}
                className="px-2 py-1 rounded-full bg-purple-400/20 text-purple-400 text-xs font-medium capitalize"
              >
                {cal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legal & Compliance */}
      {(data.terms_url || data.privacy_url || data.compliance_options?.length > 0) && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Legal
          </h4>
          <div className="space-y-2">
            {data.terms_url && (
              <p className="text-white/60 text-xs flex items-center gap-2">
                <span className="text-white/40">Terms:</span>
                <span className="text-[#c9a962] truncate">{data.terms_url}</span>
              </p>
            )}
            {data.privacy_url && (
              <p className="text-white/60 text-xs flex items-center gap-2">
                <span className="text-white/40">Privacy:</span>
                <span className="text-[#c9a962] truncate">{data.privacy_url}</span>
              </p>
            )}
            {data.compliance_options?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/[0.06]">
                {data.compliance_options.map((opt) => (
                  <span
                    key={opt}
                    className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 text-xs font-medium uppercase"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrganizationSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get("id");
  const [savedData, setSavedData] = useState(null);

  const updateOrgMutation = useMutation({
    mutationFn: async (data) => {
      const orgSettings = {
        name: data.org_name,
        tagline: data.tagline,
        logo: data.logo?.name || null,
        website: data.website,
        org_type: data.org_type,
        branding: {
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          font_preference: data.font_preference,
        },
        contact: {
          main_email: data.main_email,
          support_email: data.support_email,
          phone: data.phone,
          fax: data.fax,
          address: {
            line1: data.address_line1,
            line2: data.address_line2,
            city: data.city,
            province_state: data.province_state,
            postal_code: data.postal_code,
            country: data.country,
          },
        },
        integrations: {
          payment_provider: data.payment_provider,
          payment_api_key: data.payment_api_key,
          email_service: data.email_service,
          email_api_key: data.email_api_key,
          calendar_integration: data.calendar_integration,
        },
        legal: {
          terms_url: data.terms_url,
          privacy_url: data.privacy_url,
          refund_policy_url: data.refund_policy_url,
          waiver_url: data.waiver_url,
          compliance_options: data.compliance_options,
          tax_id: data.tax_id,
        },
        updated_date: new Date().toISOString(),
      };

      if (orgId) {
        return base44.entities.Organization.update(orgId, orgSettings);
      } else {
        orgSettings.status = "active";
        orgSettings.created_date = new Date().toISOString();
        return base44.entities.Organization.create(orgSettings);
      }
    },
    onSuccess: (org) => {
      localStorage.removeItem("organization_setup_draft");
      navigate(`/OrgDashboard?id=${org.id || orgId}`);
    },
  });

  const handleSubmit = (data) => {
    updateOrgMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("organization_setup_draft", JSON.stringify(data));
  };

  // Load draft from localStorage
  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("organization_setup_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Organization Setup"
        subtitle="Configure your organization's settings, branding, and integrations"
        sections={ORG_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={OrganizationPreview}
        submitLabel={updateOrgMutation.isPending ? "Saving..." : "Save Organization Settings"}
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
