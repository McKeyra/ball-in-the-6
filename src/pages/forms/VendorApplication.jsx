import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Store, Shield, Mail, Phone, DollarSign, Clock } from "lucide-react";

// Vendor Application Form Configuration
const VENDOR_SECTIONS = [
  {
    id: "business",
    label: "Business Information",
    icon: "Store",
    fields: [
      {
        id: "business_name",
        type: "text",
        label: "Business Name",
        placeholder: "Slam Dunk Snacks",
        required: true,
        hint: "Legal business name or DBA",
      },
      {
        id: "business_type",
        type: "cards",
        label: "Business Type",
        required: true,
        columns: 2,
        options: [
          {
            value: "food",
            label: "Food Vendor",
            description: "Prepared food, snacks, beverages",
            icon: "UtensilsCrossed",
          },
          {
            value: "merchandise",
            label: "Merchandise",
            description: "Apparel, accessories, memorabilia",
            icon: "ShoppingBag",
          },
          {
            value: "services",
            label: "Services",
            description: "Photography, training, health services",
            icon: "Briefcase",
          },
          {
            value: "equipment",
            label: "Equipment",
            description: "Sports equipment, gear, accessories",
            icon: "Dumbbell",
          },
        ],
      },
      {
        id: "business_license",
        type: "text",
        label: "Business License Number",
        placeholder: "BL-123456789",
        required: true,
        hint: "City of Toronto business license",
      },
      {
        id: "health_permit",
        type: "text",
        label: "Health Permit Number (Food Vendors)",
        placeholder: "HP-987654321",
        hint: "Required for all food vendors",
      },
      {
        id: "years_in_business",
        type: "select",
        label: "Years in Business",
        options: [
          { value: "new", label: "New Business (Less than 1 year)" },
          { value: "1_3", label: "1-3 years" },
          { value: "3_5", label: "3-5 years" },
          { value: "5_10", label: "5-10 years" },
          { value: "10_plus", label: "10+ years" },
        ],
      },
    ],
  },
  {
    id: "products",
    label: "Products & Services",
    icon: "Package",
    fields: [
      {
        id: "product_description",
        type: "textarea",
        label: "Product/Service Description",
        placeholder: "Describe what you sell or the services you offer...\n\nExample:\nWe specialize in freshly grilled gourmet burgers, loaded fries, and cold beverages. All ingredients are locally sourced and we offer vegetarian options.",
        rows: 5,
        required: true,
        hint: "Be specific about your offerings",
      },
      {
        id: "menu_items",
        type: "textarea",
        label: "Sample Menu / Product List",
        placeholder: "List your main products and prices...\n\nExample:\n- Classic Burger - $8\n- Loaded Fries - $6\n- Soft Drinks - $3\n- Water - $2",
        rows: 6,
        hint: "Include approximate pricing",
      },
      {
        id: "price_range",
        type: "select",
        label: "Price Range",
        required: true,
        options: [
          { value: "budget", label: "Budget ($1-$5)" },
          { value: "moderate", label: "Moderate ($5-$15)" },
          { value: "premium", label: "Premium ($15-$30)" },
          { value: "luxury", label: "Luxury ($30+)" },
          { value: "mixed", label: "Mixed Range" },
        ],
      },
      {
        id: "dietary_options",
        type: "pills",
        label: "Dietary Options Offered (Food Vendors)",
        hint: "Select all that apply",
        options: [
          { value: "vegetarian", label: "Vegetarian" },
          { value: "vegan", label: "Vegan" },
          { value: "gluten_free", label: "Gluten-Free" },
          { value: "halal", label: "Halal" },
          { value: "kosher", label: "Kosher" },
          { value: "nut_free", label: "Nut-Free" },
        ],
      },
      {
        id: "samples_upload",
        type: "upload",
        label: "Product Photos / Menu",
        accept: "image/*,application/pdf",
        multiple: true,
        hint: "Upload photos of your products or PDF menu",
      },
    ],
  },
  {
    id: "requirements",
    label: "Setup Requirements",
    icon: "Settings",
    fields: [
      {
        id: "booth_size",
        type: "select",
        label: "Booth/Space Size Needed",
        required: true,
        options: [
          { value: "small", label: "Small (6ft x 6ft)" },
          { value: "standard", label: "Standard (10ft x 10ft)" },
          { value: "large", label: "Large (10ft x 20ft)" },
          { value: "extra_large", label: "Extra Large (20ft x 20ft)" },
          { value: "custom", label: "Custom Size (specify in notes)" },
        ],
      },
      {
        id: "power_requirements",
        type: "checkboxes",
        label: "Power Requirements",
        options: [
          { value: "none", label: "No Power Needed", description: "Battery operated or no electricity" },
          { value: "standard_outlet", label: "Standard Outlet (120V)", description: "Regular household outlet" },
          { value: "high_amp", label: "High Amperage (20A+)", description: "Heavy equipment needs" },
          { value: "generator", label: "Will Bring Own Generator", description: "Self-sufficient power" },
        ],
      },
      {
        id: "water_required",
        type: "select",
        label: "Water Access Needed",
        options: [
          { value: "none", label: "No water needed" },
          { value: "drinking", label: "Drinking water only" },
          { value: "hand_wash", label: "Hand washing station" },
          { value: "full", label: "Full water hookup" },
        ],
      },
      {
        id: "setup_time",
        type: "select",
        label: "Setup Time Required",
        required: true,
        options: [
          { value: "15min", label: "15 minutes" },
          { value: "30min", label: "30 minutes" },
          { value: "1hr", label: "1 hour" },
          { value: "2hr", label: "2 hours" },
          { value: "half_day", label: "Half day" },
        ],
      },
      {
        id: "teardown_time",
        type: "select",
        label: "Teardown Time Required",
        required: true,
        options: [
          { value: "15min", label: "15 minutes" },
          { value: "30min", label: "30 minutes" },
          { value: "1hr", label: "1 hour" },
          { value: "2hr", label: "2 hours" },
        ],
      },
      {
        id: "special_requirements",
        type: "textarea",
        label: "Special Requirements or Notes",
        placeholder: "Any additional setup needs, accessibility requirements, or special considerations...",
        rows: 3,
      },
    ],
  },
  {
    id: "insurance",
    label: "Insurance & Compliance",
    icon: "Shield",
    fields: [
      {
        id: "liability_insurance",
        type: "select",
        label: "Liability Insurance Coverage",
        required: true,
        options: [
          { value: "1m", label: "$1 Million" },
          { value: "2m", label: "$2 Million" },
          { value: "5m", label: "$5 Million" },
          { value: "other", label: "Other Amount" },
        ],
      },
      {
        id: "insurance_provider",
        type: "text",
        label: "Insurance Provider",
        placeholder: "ABC Insurance Company",
        required: true,
      },
      {
        id: "insurance_policy_number",
        type: "text",
        label: "Policy Number",
        placeholder: "POL-123456789",
        required: true,
      },
      {
        id: "insurance_expiry",
        type: "text",
        label: "Policy Expiration Date",
        placeholder: "MM/DD/YYYY",
        required: true,
      },
      {
        id: "insurance_proof",
        type: "upload",
        label: "Certificate of Insurance",
        accept: "application/pdf,image/*",
        required: true,
        hint: "Upload your COI naming Ball in the 6 as additional insured",
      },
      {
        id: "food_safety_cert",
        type: "upload",
        label: "Food Safety Certification (Food Vendors)",
        accept: "application/pdf,image/*",
        hint: "Food Handler Certification required for all food vendors",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact Information",
    icon: "User",
    fields: [
      {
        id: "owner_name",
        type: "text",
        label: "Owner / Primary Contact Name",
        placeholder: "Jane Smith",
        required: true,
      },
      {
        id: "owner_title",
        type: "text",
        label: "Title",
        placeholder: "Owner / Manager",
      },
      {
        id: "owner_email",
        type: "text",
        label: "Email Address",
        placeholder: "contact@business.com",
        required: true,
      },
      {
        id: "owner_phone",
        type: "text",
        label: "Phone Number",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "business_address",
        type: "text",
        label: "Business Address",
        placeholder: "123 Vendor Street, Toronto, ON M5A 1A1",
      },
      {
        id: "website",
        type: "text",
        label: "Website or Social Media",
        placeholder: "www.yourbusiness.com or @yourhandle",
      },
      {
        id: "previous_events",
        type: "textarea",
        label: "Previous Event Experience",
        placeholder: "List any previous events, tournaments, or venues you've worked with...",
        rows: 3,
        hint: "Helps us understand your experience level",
      },
    ],
  },
];

// Preview Component
function VendorPreview({ data }) {
  const productPhotoUrl = data.samples_upload?.[0]?.name
    ? URL.createObjectURL(data.samples_upload[0])
    : null;

  const businessTypeLabels = {
    food: "Food Vendor",
    merchandise: "Merchandise",
    services: "Services",
    equipment: "Equipment",
  };

  const businessTypeIcons = {
    food: "UtensilsCrossed",
    merchandise: "ShoppingBag",
    services: "Briefcase",
    equipment: "Dumbbell",
  };

  return (
    <div className="space-y-4">
      {/* Vendor Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] overflow-hidden">
        {productPhotoUrl && (
          <div className="h-28 overflow-hidden">
            <img src={productPhotoUrl} alt="Product" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#c9a962]/20 flex items-center justify-center">
              <Store className="w-6 h-6 text-[#c9a962]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                {data.business_name || "Business Name"}
              </h3>
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-xs font-medium mt-1">
                {businessTypeLabels[data.business_type] || "Vendor Type"}
              </span>
            </div>
          </div>

          {data.product_description && (
            <p className="text-white/60 text-sm mb-4 line-clamp-3">{data.product_description}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {data.price_range && (
              <div className="p-3 rounded-lg bg-white/[0.04]">
                <span className="text-white/40 text-xs flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Price Range
                </span>
                <p className="text-white font-medium capitalize">
                  {data.price_range.replace(/_/g, " ")}
                </p>
              </div>
            )}
            {data.booth_size && (
              <div className="p-3 rounded-lg bg-white/[0.04]">
                <span className="text-white/40 text-xs">Booth Size</span>
                <p className="text-white font-medium capitalize">
                  {data.booth_size.replace(/_/g, " ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dietary Options (Food Vendors) */}
      {data.dietary_options?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Dietary Options
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.dietary_options.map((option) => (
              <span
                key={option}
                className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium capitalize"
              >
                {option.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Setup Requirements */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
          Setup Requirements
        </h4>
        <div className="space-y-2 text-sm">
          {data.setup_time && (
            <div className="flex items-center justify-between">
              <span className="text-white/50 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Setup Time
              </span>
              <span className="text-white">{data.setup_time}</span>
            </div>
          )}
          {data.teardown_time && (
            <div className="flex items-center justify-between">
              <span className="text-white/50 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Teardown
              </span>
              <span className="text-white">{data.teardown_time}</span>
            </div>
          )}
          {data.power_requirements?.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-white/50">Power</span>
              <span className="text-white capitalize">
                {data.power_requirements[0]?.replace(/_/g, " ")}
              </span>
            </div>
          )}
          {data.water_required && (
            <div className="flex items-center justify-between">
              <span className="text-white/50">Water</span>
              <span className="text-white capitalize">
                {data.water_required.replace(/_/g, " ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Insurance */}
      {data.liability_insurance && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Insurance Coverage
          </h4>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-white font-medium">
                {data.liability_insurance === "1m" ? "$1M" :
                 data.liability_insurance === "2m" ? "$2M" :
                 data.liability_insurance === "5m" ? "$5M" : "Coverage"}
              </p>
              {data.insurance_provider && (
                <p className="text-white/50 text-sm">{data.insurance_provider}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact */}
      {data.owner_name && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Contact
          </h4>
          <p className="text-white font-medium">{data.owner_name}</p>
          {data.owner_title && (
            <p className="text-white/50 text-sm">{data.owner_title}</p>
          )}
          {data.owner_email && (
            <div className="flex items-center gap-2 text-sm text-white/60 mt-2">
              <Mail className="w-3 h-3" />
              <span>{data.owner_email}</span>
            </div>
          )}
          {data.owner_phone && (
            <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
              <Phone className="w-3 h-3" />
              <span>{data.owner_phone}</span>
            </div>
          )}
        </div>
      )}

      {/* License Info */}
      {data.business_license && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">
            Business License
          </h4>
          <p className="text-white/70 text-sm font-mono">{data.business_license}</p>
          {data.health_permit && (
            <>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2 mt-3">
                Health Permit
              </h4>
              <p className="text-white/70 text-sm font-mono">{data.health_permit}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function VendorApplication() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createVendorMutation = useMutation({
    mutationFn: async (data) => {
      // Upload files
      let sampleUrls = [];
      let insuranceProofUrl = null;
      let foodSafetyCertUrl = null;

      if (data.samples_upload && data.samples_upload.length > 0) {
        for (const file of data.samples_upload) {
          if (file instanceof File) {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            sampleUrls.push(file_url);
          }
        }
      }

      if (data.insurance_proof && data.insurance_proof instanceof File) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: data.insurance_proof });
        insuranceProofUrl = file_url;
      }

      if (data.food_safety_cert && data.food_safety_cert instanceof File) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: data.food_safety_cert });
        foodSafetyCertUrl = file_url;
      }

      const vendorData = {
        business_name: data.business_name,
        business_type: data.business_type,
        business_license: data.business_license,
        health_permit: data.health_permit,
        years_in_business: data.years_in_business,
        product_description: data.product_description,
        menu_items: data.menu_items,
        price_range: data.price_range,
        dietary_options: data.dietary_options,
        sample_urls: sampleUrls,
        booth_size: data.booth_size,
        power_requirements: data.power_requirements,
        water_required: data.water_required,
        setup_time: data.setup_time,
        teardown_time: data.teardown_time,
        special_requirements: data.special_requirements,
        liability_insurance: data.liability_insurance,
        insurance_provider: data.insurance_provider,
        insurance_policy_number: data.insurance_policy_number,
        insurance_expiry: data.insurance_expiry,
        insurance_proof_url: insuranceProofUrl,
        food_safety_cert_url: foodSafetyCertUrl,
        owner_name: data.owner_name,
        owner_title: data.owner_title,
        owner_email: data.owner_email,
        owner_phone: data.owner_phone,
        business_address: data.business_address,
        website: data.website,
        previous_events: data.previous_events,
        status: "pending",
        application_type: "vendor",
        created_date: new Date().toISOString(),
      };

      return base44.entities.Application.create(vendorData);
    },
    onSuccess: (newApplication) => {
      localStorage.removeItem("vendor_application_draft");
      navigate(`/applications?id=${newApplication.id}&type=vendor`);
    },
  });

  const handleSubmit = (data) => {
    createVendorMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    const saveData = { ...data };
    // Handle file objects for localStorage
    if (saveData.samples_upload) {
      saveData.samples_upload = saveData.samples_upload.map(f =>
        f instanceof File ? { name: f.name, saved: true } : f
      );
    }
    if (saveData.insurance_proof instanceof File) {
      saveData.insurance_proof = { name: saveData.insurance_proof.name, saved: true };
    }
    if (saveData.food_safety_cert instanceof File) {
      saveData.food_safety_cert = { name: saveData.food_safety_cert.name, saved: true };
    }
    localStorage.setItem("vendor_application_draft", JSON.stringify(saveData));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("vendor_application_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Vendor Application"
        subtitle="Become a vendor at Ball in the 6 events"
        sections={VENDOR_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={VendorPreview}
        submitLabel={createVendorMutation.isPending ? "Submitting..." : "Submit Application"}
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
