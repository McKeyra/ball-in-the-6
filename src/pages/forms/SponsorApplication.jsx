import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Building2, Award, Globe, Mail, Phone, Target, Megaphone, CheckSquare } from "lucide-react";

// Sponsor Application Form Configuration
const SPONSOR_SECTIONS = [
  {
    id: "company",
    label: "Company Information",
    icon: "Building2",
    fields: [
      {
        id: "company_name",
        type: "text",
        label: "Company Name",
        placeholder: "Acme Corporation",
        required: true,
        hint: "Legal business name",
      },
      {
        id: "industry",
        type: "select",
        label: "Industry",
        required: true,
        options: [
          { value: "sports_equipment", label: "Sports Equipment & Apparel" },
          { value: "food_beverage", label: "Food & Beverage" },
          { value: "health_fitness", label: "Health & Fitness" },
          { value: "financial_services", label: "Financial Services" },
          { value: "technology", label: "Technology" },
          { value: "automotive", label: "Automotive" },
          { value: "retail", label: "Retail" },
          { value: "media_entertainment", label: "Media & Entertainment" },
          { value: "healthcare", label: "Healthcare" },
          { value: "real_estate", label: "Real Estate" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "website",
        type: "text",
        label: "Company Website",
        placeholder: "https://www.example.com",
        hint: "Include https://",
      },
      {
        id: "logo",
        type: "upload",
        label: "Company Logo",
        accept: "image/*",
        hint: "PNG or SVG preferred, minimum 500x500px",
        required: true,
      },
    ],
  },
  {
    id: "contact",
    label: "Contact Information",
    icon: "Mail",
    fields: [
      {
        id: "contact_name",
        type: "text",
        label: "Contact Name",
        placeholder: "John Smith",
        required: true,
      },
      {
        id: "contact_title",
        type: "text",
        label: "Title / Position",
        placeholder: "Marketing Director",
        required: true,
      },
      {
        id: "contact_email",
        type: "text",
        label: "Email Address",
        placeholder: "john@example.com",
        required: true,
      },
      {
        id: "contact_phone",
        type: "text",
        label: "Phone Number",
        placeholder: "(416) 555-0123",
        required: true,
      },
    ],
  },
  {
    id: "sponsorship",
    label: "Sponsorship Details",
    icon: "Award",
    fields: [
      {
        id: "tier_preference",
        type: "cards",
        label: "Preferred Sponsorship Tier",
        required: true,
        columns: 2,
        options: [
          {
            value: "title",
            label: "Title Sponsor",
            description: "Premier branding, exclusive category rights, VIP experiences",
            icon: "Crown",
          },
          {
            value: "gold",
            label: "Gold Sponsor",
            description: "Major visibility, courtside signage, event naming",
            icon: "Medal",
          },
          {
            value: "silver",
            label: "Silver Sponsor",
            description: "Strong presence, digital promotion, team sponsorship",
            icon: "Award",
          },
          {
            value: "bronze",
            label: "Bronze Sponsor",
            description: "Community support, logo placement, recognition",
            icon: "Star",
          },
          {
            value: "in_kind",
            label: "In-Kind Sponsor",
            description: "Product or service contribution in exchange for visibility",
            icon: "Gift",
          },
        ],
      },
      {
        id: "budget_range",
        type: "select",
        label: "Annual Sponsorship Budget",
        required: true,
        options: [
          { value: "under_5k", label: "Under $5,000" },
          { value: "5k_10k", label: "$5,000 - $10,000" },
          { value: "10k_25k", label: "$10,000 - $25,000" },
          { value: "25k_50k", label: "$25,000 - $50,000" },
          { value: "50k_100k", label: "$50,000 - $100,000" },
          { value: "over_100k", label: "$100,000+" },
        ],
      },
      {
        id: "sponsorship_goals",
        type: "checkboxes",
        label: "Sponsorship Goals",
        hint: "Select all that apply",
        options: [
          { value: "brand_awareness", label: "Brand Awareness", description: "Increase visibility in the community" },
          { value: "lead_generation", label: "Lead Generation", description: "Acquire new customers" },
          { value: "community_engagement", label: "Community Engagement", description: "Support local sports development" },
          { value: "employee_engagement", label: "Employee Engagement", description: "Team building and volunteer opportunities" },
          { value: "product_sampling", label: "Product Sampling", description: "Get products in front of target audience" },
          { value: "hospitality", label: "Hospitality & Entertainment", description: "Client entertainment opportunities" },
        ],
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & Activation",
    icon: "Megaphone",
    fields: [
      {
        id: "target_audience",
        type: "pills",
        label: "Target Audience",
        hint: "Select all demographics you want to reach",
        options: [
          { value: "youth", label: "Youth (Under 18)" },
          { value: "young_adults", label: "Young Adults (18-35)" },
          { value: "adults", label: "Adults (35-55)" },
          { value: "seniors", label: "Seniors (55+)" },
          { value: "families", label: "Families" },
          { value: "coaches", label: "Coaches & Trainers" },
          { value: "parents", label: "Parents" },
        ],
      },
      {
        id: "activation_ideas",
        type: "textarea",
        label: "Activation Ideas",
        placeholder: "Describe any specific activation ideas you'd like to explore (e.g., halftime contests, skills challenges, product giveaways, branded experiences...)",
        rows: 5,
        hint: "Share your creative ideas for engaging with our community",
      },
      {
        id: "previous_sponsorships",
        type: "textarea",
        label: "Previous Sports Sponsorships",
        placeholder: "List any previous sports or community sponsorships your company has participated in...",
        rows: 3,
      },
    ],
  },
  {
    id: "terms",
    label: "Terms & Agreement",
    icon: "CheckSquare",
    fields: [
      {
        id: "terms_accepted",
        type: "checkboxes",
        label: "Please confirm the following",
        required: true,
        options: [
          { value: "authorized", label: "Authorized Representative", description: "I am authorized to enter into sponsorship agreements on behalf of this company" },
          { value: "accuracy", label: "Information Accuracy", description: "All information provided is accurate and complete" },
          { value: "contact_consent", label: "Contact Consent", description: "I consent to being contacted about sponsorship opportunities" },
          { value: "terms_agreement", label: "Terms Agreement", description: "I have read and agree to the sponsorship terms and conditions" },
        ],
      },
      {
        id: "additional_notes",
        type: "textarea",
        label: "Additional Notes",
        placeholder: "Any other information you'd like to share...",
        rows: 3,
      },
    ],
  },
];

// Tier badge styling
const TIER_STYLES = {
  title: { bg: "bg-gradient-to-r from-purple-500 to-pink-500", text: "Title" },
  gold: { bg: "bg-gradient-to-r from-yellow-500 to-amber-500", text: "Gold" },
  silver: { bg: "bg-gradient-to-r from-gray-300 to-gray-400", text: "Silver" },
  bronze: { bg: "bg-gradient-to-r from-orange-600 to-orange-700", text: "Bronze" },
  in_kind: { bg: "bg-gradient-to-r from-teal-500 to-cyan-500", text: "In-Kind" },
};

// Preview Component
function SponsorPreview({ data }) {
  const tierStyle = TIER_STYLES[data.tier_preference] || null;
  const logoUrl = data.logo?.name ? URL.createObjectURL(data.logo) : null;

  return (
    <div className="space-y-4">
      {/* Company Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5 relative overflow-hidden">
        {tierStyle && (
          <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg ${tierStyle.bg}`}>
            {tierStyle.text} Sponsor
          </div>
        )}

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-white/[0.1] flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-[#c9a962]" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {data.company_name || "Company Name"}
            </h3>
            <p className="text-white/40 text-sm capitalize">
              {data.industry?.replace(/_/g, " ") || "Industry"}
            </p>
          </div>
        </div>

        {data.website && (
          <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
            <Globe className="w-4 h-4" />
            <span className="truncate">{data.website}</span>
          </div>
        )}

        {data.budget_range && (
          <div className="p-3 rounded-lg bg-[#c9a962]/10 border border-[#c9a962]/20">
            <span className="text-xs text-white/40">Budget Range</span>
            <p className="text-[#c9a962] font-semibold capitalize">
              {data.budget_range.replace(/_/g, " ").replace("k", "K")}
            </p>
          </div>
        )}
      </div>

      {/* Contact Info */}
      {data.contact_name && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Primary Contact
          </h4>
          <p className="text-white font-medium">{data.contact_name}</p>
          {data.contact_title && (
            <p className="text-white/50 text-sm">{data.contact_title}</p>
          )}
          {data.contact_email && (
            <div className="flex items-center gap-2 text-sm text-white/60 mt-2">
              <Mail className="w-3 h-3" />
              <span>{data.contact_email}</span>
            </div>
          )}
          {data.contact_phone && (
            <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
              <Phone className="w-3 h-3" />
              <span>{data.contact_phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Goals */}
      {data.sponsorship_goals?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Sponsorship Goals
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.sponsorship_goals.map((goal) => (
              <span
                key={goal}
                className="px-2 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-xs font-medium capitalize"
              >
                {goal.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Target Audience */}
      {data.target_audience?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Target Audience
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.target_audience.map((audience) => (
              <span
                key={audience}
                className="px-2 py-1 rounded-full bg-white/[0.1] text-white/70 text-xs font-medium capitalize"
              >
                {audience.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SponsorApplication() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createSponsorMutation = useMutation({
    mutationFn: async (data) => {
      // Upload logo if present
      let logoUrl = null;
      if (data.logo && data.logo instanceof File) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: data.logo });
        logoUrl = file_url;
      }

      const sponsorData = {
        company_name: data.company_name,
        industry: data.industry,
        website: data.website,
        logo_url: logoUrl,
        contact_name: data.contact_name,
        contact_title: data.contact_title,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        tier_preference: data.tier_preference,
        budget_range: data.budget_range,
        sponsorship_goals: data.sponsorship_goals,
        target_audience: data.target_audience,
        activation_ideas: data.activation_ideas,
        previous_sponsorships: data.previous_sponsorships,
        terms_accepted: data.terms_accepted,
        additional_notes: data.additional_notes,
        status: "pending",
        application_type: "sponsor",
        created_date: new Date().toISOString(),
      };

      return base44.entities.Application.create(sponsorData);
    },
    onSuccess: (newApplication) => {
      localStorage.removeItem("sponsor_application_draft");
      navigate(`/applications?id=${newApplication.id}&type=sponsor`);
    },
  });

  const handleSubmit = (data) => {
    createSponsorMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    // Auto-save to localStorage (excluding file objects)
    const saveData = { ...data };
    if (saveData.logo instanceof File) {
      saveData.logo = { name: saveData.logo.name, saved: true };
    }
    localStorage.setItem("sponsor_application_draft", JSON.stringify(saveData));
  };

  // Load draft from localStorage
  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("sponsor_application_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Sponsor Application"
        subtitle="Partner with Ball in the 6 and connect with our community"
        sections={SPONSOR_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={SponsorPreview}
        submitLabel={createSponsorMutation.isPending ? "Submitting..." : "Submit Application"}
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
