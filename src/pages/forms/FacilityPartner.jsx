import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { Building, Ruler, Clock, DollarSign, User, MapPin, Phone, Mail, Check } from "lucide-react";

// Facility Partner Form Configuration
const FACILITY_SECTIONS = [
  {
    id: "facility",
    label: "Facility Information",
    icon: "Building",
    fields: [
      {
        id: "facility_name",
        type: "text",
        label: "Facility Name",
        placeholder: "Toronto Athletic Center",
        required: true,
        hint: "Official name of the facility",
      },
      {
        id: "facility_address",
        type: "text",
        label: "Street Address",
        placeholder: "123 Sports Avenue",
        required: true,
      },
      {
        id: "facility_city",
        type: "text",
        label: "City",
        placeholder: "Toronto",
        required: true,
      },
      {
        id: "facility_postal",
        type: "text",
        label: "Postal Code",
        placeholder: "M5A 1A1",
        required: true,
      },
      {
        id: "facility_type",
        type: "cards",
        label: "Facility Type",
        required: true,
        columns: 2,
        options: [
          {
            value: "gym",
            label: "Indoor Gym",
            description: "Climate-controlled indoor facility",
            icon: "Building",
          },
          {
            value: "outdoor",
            label: "Outdoor Courts",
            description: "Open-air courts and fields",
            icon: "Sun",
          },
          {
            value: "school",
            label: "School Gymnasium",
            description: "Educational institution facility",
            icon: "GraduationCap",
          },
          {
            value: "community_center",
            label: "Community Center",
            description: "Multi-purpose community facility",
            icon: "Users",
          },
          {
            value: "recreation_center",
            label: "Recreation Center",
            description: "Parks & rec managed facility",
            icon: "Dumbbell",
          },
          {
            value: "private_club",
            label: "Private Club",
            description: "Members-only athletic club",
            icon: "Star",
          },
        ],
      },
      {
        id: "facility_photos",
        type: "upload",
        label: "Facility Photos",
        accept: "image/*",
        multiple: true,
        hint: "Upload photos of courts, amenities, and exterior",
      },
    ],
  },
  {
    id: "specs",
    label: "Facility Specifications",
    icon: "Ruler",
    fields: [
      {
        id: "court_count",
        type: "select",
        label: "Number of Courts",
        required: true,
        options: [
          { value: "1", label: "1 Court" },
          { value: "2", label: "2 Courts" },
          { value: "3", label: "3 Courts" },
          { value: "4", label: "4 Courts" },
          { value: "5", label: "5 Courts" },
          { value: "6_plus", label: "6+ Courts" },
        ],
      },
      {
        id: "court_dimensions",
        type: "select",
        label: "Court Dimensions",
        required: true,
        options: [
          { value: "full_nba", label: "Full Size (NBA - 94ft x 50ft)" },
          { value: "full_fiba", label: "Full Size (FIBA - 28m x 15m)" },
          { value: "high_school", label: "High School (84ft x 50ft)" },
          { value: "junior", label: "Junior Size" },
          { value: "half_court", label: "Half Court Only" },
          { value: "mixed", label: "Mixed Sizes" },
        ],
      },
      {
        id: "floor_type",
        type: "select",
        label: "Court Surface",
        options: [
          { value: "hardwood", label: "Hardwood" },
          { value: "sport_court", label: "Sport Court / Rubber" },
          { value: "concrete", label: "Concrete" },
          { value: "asphalt", label: "Asphalt" },
          { value: "synthetic", label: "Synthetic Turf" },
          { value: "vinyl", label: "Vinyl" },
        ],
      },
      {
        id: "ceiling_height",
        type: "select",
        label: "Ceiling Height",
        options: [
          { value: "standard", label: "Standard (20-25 ft)" },
          { value: "high", label: "High (25-35 ft)" },
          { value: "professional", label: "Professional (35+ ft)" },
          { value: "outdoor", label: "Outdoor / N/A" },
        ],
      },
      {
        id: "amenities",
        type: "checkboxes",
        label: "Amenities & Features",
        hint: "Select all available amenities",
        options: [
          { value: "electronic_scoreboard", label: "Electronic Scoreboard", icon: "Monitor" },
          { value: "shot_clocks", label: "Shot Clocks", icon: "Clock" },
          { value: "locker_rooms", label: "Locker Rooms", icon: "Lock" },
          { value: "showers", label: "Showers", icon: "Droplets" },
          { value: "bleachers", label: "Bleachers / Seating", icon: "Users" },
          { value: "air_conditioning", label: "Air Conditioning", icon: "Wind" },
          { value: "heating", label: "Heating", icon: "Flame" },
          { value: "wifi", label: "WiFi", icon: "Wifi" },
          { value: "parking", label: "Parking Available", icon: "Car" },
          { value: "accessible", label: "Wheelchair Accessible", icon: "Accessibility" },
          { value: "concessions", label: "Concession Area", icon: "Coffee" },
          { value: "first_aid", label: "First Aid Station", icon: "Heart" },
        ],
      },
      {
        id: "seating_capacity",
        type: "select",
        label: "Spectator Seating Capacity",
        options: [
          { value: "none", label: "No Seating" },
          { value: "under_50", label: "Under 50" },
          { value: "50_100", label: "50-100" },
          { value: "100_250", label: "100-250" },
          { value: "250_500", label: "250-500" },
          { value: "over_500", label: "500+" },
        ],
      },
    ],
  },
  {
    id: "availability",
    label: "Availability",
    icon: "Clock",
    fields: [
      {
        id: "available_days",
        type: "pills",
        label: "Days Available for Booking",
        hint: "Select all days the facility is available",
        required: true,
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
        id: "hours_weekday",
        type: "text",
        label: "Weekday Hours",
        placeholder: "6:00 AM - 11:00 PM",
        required: true,
      },
      {
        id: "hours_weekend",
        type: "text",
        label: "Weekend Hours",
        placeholder: "8:00 AM - 10:00 PM",
        required: true,
      },
      {
        id: "blackout_dates",
        type: "textarea",
        label: "Blackout Dates / Unavailable Periods",
        placeholder: "List any dates or periods when facility is not available...\n\nExample:\n- Dec 24-26 (Holiday closure)\n- School exam weeks (varies)",
        rows: 4,
        hint: "Include holidays, maintenance periods, or reserved times",
      },
      {
        id: "minimum_booking",
        type: "select",
        label: "Minimum Booking Duration",
        options: [
          { value: "30min", label: "30 minutes" },
          { value: "1hr", label: "1 hour" },
          { value: "1.5hr", label: "1.5 hours" },
          { value: "2hr", label: "2 hours" },
          { value: "half_day", label: "Half day" },
          { value: "full_day", label: "Full day" },
        ],
      },
    ],
  },
  {
    id: "rates",
    label: "Rates & Pricing",
    icon: "DollarSign",
    fields: [
      {
        id: "hourly_rate",
        type: "text",
        label: "Hourly Rate (per court)",
        placeholder: "$75",
        required: true,
        hint: "Standard hourly rental rate",
      },
      {
        id: "peak_rate",
        type: "text",
        label: "Peak Hours Rate (if different)",
        placeholder: "$100",
        hint: "Rate for evenings, weekends, or high-demand times",
      },
      {
        id: "off_peak_rate",
        type: "text",
        label: "Off-Peak Rate (if different)",
        placeholder: "$50",
        hint: "Discounted rate for early mornings or slow periods",
      },
      {
        id: "package_deals",
        type: "textarea",
        label: "Package Deals & Discounts",
        placeholder: "Describe any bulk booking discounts, seasonal packages, or special rates...\n\nExample:\n- 10% off for 10+ hour bookings\n- Season package: 20 games for $1,200\n- Non-profit discount: 15% off",
        rows: 5,
      },
      {
        id: "payment_terms",
        type: "checkboxes",
        label: "Accepted Payment Methods",
        options: [
          { value: "credit_card", label: "Credit Card" },
          { value: "debit", label: "Debit" },
          { value: "etransfer", label: "E-Transfer" },
          { value: "check", label: "Check" },
          { value: "cash", label: "Cash" },
          { value: "invoice", label: "Invoice / Net Terms" },
        ],
      },
      {
        id: "deposit_required",
        type: "select",
        label: "Deposit Required",
        options: [
          { value: "none", label: "No deposit" },
          { value: "25", label: "25% deposit" },
          { value: "50", label: "50% deposit" },
          { value: "full", label: "Full payment upfront" },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact Information",
    icon: "User",
    fields: [
      {
        id: "manager_name",
        type: "text",
        label: "Facility Manager Name",
        placeholder: "John Smith",
        required: true,
      },
      {
        id: "manager_title",
        type: "text",
        label: "Title / Position",
        placeholder: "Facilities Director",
      },
      {
        id: "manager_email",
        type: "text",
        label: "Email Address",
        placeholder: "facilities@example.com",
        required: true,
      },
      {
        id: "manager_phone",
        type: "text",
        label: "Phone Number",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "booking_email",
        type: "text",
        label: "Booking Inquiries Email",
        placeholder: "bookings@example.com",
        hint: "If different from manager email",
      },
      {
        id: "emergency_contact",
        type: "text",
        label: "Emergency Contact",
        placeholder: "(416) 555-9999",
        hint: "After-hours emergency number",
      },
    ],
  },
];

// Preview Component
function FacilityPreview({ data }) {
  const photoUrl = data.facility_photos?.[0]?.name
    ? URL.createObjectURL(data.facility_photos[0])
    : null;

  const facilityTypeLabels = {
    gym: "Indoor Gym",
    outdoor: "Outdoor Courts",
    school: "School Gymnasium",
    community_center: "Community Center",
    recreation_center: "Recreation Center",
    private_club: "Private Club",
  };

  return (
    <div className="space-y-4">
      {/* Facility Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] overflow-hidden">
        {photoUrl && (
          <div className="h-32 overflow-hidden">
            <img src={photoUrl} alt="Facility" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                {data.facility_name || "Facility Name"}
              </h3>
              <p className="text-[#c9a962] text-sm font-medium">
                {facilityTypeLabels[data.facility_type] || "Facility Type"}
              </p>
            </div>
            {data.court_count && (
              <div className="px-3 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-sm font-bold">
                {data.court_count === "6_plus" ? "6+" : data.court_count} {data.court_count === "1" ? "Court" : "Courts"}
              </div>
            )}
          </div>

          {(data.facility_address || data.facility_city) && (
            <div className="flex items-start gap-2 text-white/60 text-sm mb-4">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                {[data.facility_address, data.facility_city, data.facility_postal]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}

          {data.hourly_rate && (
            <div className="p-3 rounded-lg bg-white/[0.04] flex items-center justify-between">
              <span className="text-white/40 text-sm">Hourly Rate</span>
              <span className="text-[#c9a962] font-bold text-lg">{data.hourly_rate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Specifications */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
          Specifications
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {data.court_dimensions && (
            <div>
              <span className="text-white/40 block">Court Size</span>
              <span className="text-white capitalize">{data.court_dimensions.replace(/_/g, " ")}</span>
            </div>
          )}
          {data.floor_type && (
            <div>
              <span className="text-white/40 block">Surface</span>
              <span className="text-white capitalize">{data.floor_type.replace(/_/g, " ")}</span>
            </div>
          )}
          {data.seating_capacity && (
            <div>
              <span className="text-white/40 block">Seating</span>
              <span className="text-white capitalize">{data.seating_capacity.replace(/_/g, " ")}</span>
            </div>
          )}
          {data.ceiling_height && (
            <div>
              <span className="text-white/40 block">Ceiling</span>
              <span className="text-white capitalize">{data.ceiling_height}</span>
            </div>
          )}
        </div>
      </div>

      {/* Amenities */}
      {data.amenities?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Amenities
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {data.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2 text-sm">
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-white/70 capitalize">{amenity.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {data.available_days?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Availability
          </h4>
          <div className="flex flex-wrap gap-1 mb-3">
            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
              <span
                key={day}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  data.available_days.includes(day)
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/[0.05] text-white/30"
                }`}
              >
                {day.slice(0, 3).toUpperCase()}
              </span>
            ))}
          </div>
          {data.hours_weekday && (
            <p className="text-white/60 text-sm">
              <span className="text-white/40">Weekday:</span> {data.hours_weekday}
            </p>
          )}
          {data.hours_weekend && (
            <p className="text-white/60 text-sm">
              <span className="text-white/40">Weekend:</span> {data.hours_weekend}
            </p>
          )}
        </div>
      )}

      {/* Contact */}
      {data.manager_name && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-4">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Facility Manager
          </h4>
          <p className="text-white font-medium">{data.manager_name}</p>
          {data.manager_title && (
            <p className="text-white/50 text-sm">{data.manager_title}</p>
          )}
          {data.manager_email && (
            <div className="flex items-center gap-2 text-sm text-white/60 mt-2">
              <Mail className="w-3 h-3" />
              <span>{data.manager_email}</span>
            </div>
          )}
          {data.manager_phone && (
            <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
              <Phone className="w-3 h-3" />
              <span>{data.manager_phone}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FacilityPartner() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createFacilityMutation = useMutation({
    mutationFn: async (data) => {
      // Upload photos if present
      let photoUrls = [];
      if (data.facility_photos && data.facility_photos.length > 0) {
        for (const photo of data.facility_photos) {
          if (photo instanceof File) {
            const { file_url } = await base44.integrations.Core.UploadFile({ file: photo });
            photoUrls.push(file_url);
          }
        }
      }

      const facilityData = {
        facility_name: data.facility_name,
        facility_address: data.facility_address,
        facility_city: data.facility_city,
        facility_postal: data.facility_postal,
        facility_type: data.facility_type,
        photo_urls: photoUrls,
        court_count: data.court_count,
        court_dimensions: data.court_dimensions,
        floor_type: data.floor_type,
        ceiling_height: data.ceiling_height,
        amenities: data.amenities,
        seating_capacity: data.seating_capacity,
        available_days: data.available_days,
        hours_weekday: data.hours_weekday,
        hours_weekend: data.hours_weekend,
        blackout_dates: data.blackout_dates,
        minimum_booking: data.minimum_booking,
        hourly_rate: data.hourly_rate,
        peak_rate: data.peak_rate,
        off_peak_rate: data.off_peak_rate,
        package_deals: data.package_deals,
        payment_terms: data.payment_terms,
        deposit_required: data.deposit_required,
        manager_name: data.manager_name,
        manager_title: data.manager_title,
        manager_email: data.manager_email,
        manager_phone: data.manager_phone,
        booking_email: data.booking_email,
        emergency_contact: data.emergency_contact,
        status: "pending",
        application_type: "facility",
        created_date: new Date().toISOString(),
      };

      return base44.entities.Application.create(facilityData);
    },
    onSuccess: (newApplication) => {
      localStorage.removeItem("facility_application_draft");
      navigate(`/applications?id=${newApplication.id}&type=facility`);
    },
  });

  const handleSubmit = (data) => {
    createFacilityMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    const saveData = { ...data };
    if (saveData.facility_photos) {
      saveData.facility_photos = saveData.facility_photos.map(p =>
        p instanceof File ? { name: p.name, saved: true } : p
      );
    }
    localStorage.setItem("facility_application_draft", JSON.stringify(saveData));
  };

  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("facility_application_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Facility Partnership Application"
        subtitle="Partner your venue with Ball in the 6"
        sections={FACILITY_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={FacilityPreview}
        submitLabel={createFacilityMutation.isPending ? "Submitting..." : "Submit Application"}
        skipLabel="Save Draft"
        defaultMode="form"
      />
    </div>
  );
}
