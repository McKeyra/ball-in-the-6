import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "@/components/forms/FormBuilder";
import { User, Users, Calendar, Heart } from "lucide-react";

// Parent Profile Setup Form Configuration
const PARENT_SECTIONS = [
  {
    id: "personal",
    label: "Personal Information",
    icon: "User",
    description: "Your basic contact information",
    fields: [
      {
        id: "first_name",
        type: "text",
        label: "First Name",
        placeholder: "Jane",
        required: true,
      },
      {
        id: "last_name",
        type: "text",
        label: "Last Name",
        placeholder: "Smith",
        required: true,
      },
      {
        id: "email",
        type: "text",
        label: "Email Address",
        placeholder: "jane.smith@example.com",
        required: true,
        hint: "We'll use this for important notifications",
      },
      {
        id: "phone",
        type: "text",
        label: "Phone Number",
        placeholder: "(416) 555-0123",
        required: true,
      },
      {
        id: "photo",
        type: "upload",
        label: "Profile Photo",
        accept: "image/*",
        hint: "JPG, PNG up to 5MB",
      },
    ],
  },
  {
    id: "children",
    label: "Children",
    icon: "Users",
    description: "Add your children who participate in sports",
    fields: [
      {
        id: "child_1_name",
        type: "text",
        label: "Child 1 - Full Name",
        placeholder: "Alex Smith",
        required: true,
      },
      {
        id: "child_1_dob",
        type: "text",
        label: "Child 1 - Date of Birth",
        placeholder: "YYYY-MM-DD",
        required: true,
      },
      {
        id: "child_1_team",
        type: "text",
        label: "Child 1 - Team",
        placeholder: "Toronto Thunder U12",
      },
      {
        id: "child_2_name",
        type: "text",
        label: "Child 2 - Full Name (Optional)",
        placeholder: "Jordan Smith",
      },
      {
        id: "child_2_dob",
        type: "text",
        label: "Child 2 - Date of Birth",
        placeholder: "YYYY-MM-DD",
      },
      {
        id: "child_2_team",
        type: "text",
        label: "Child 2 - Team",
        placeholder: "Toronto Thunder U10",
      },
      {
        id: "child_3_name",
        type: "text",
        label: "Child 3 - Full Name (Optional)",
        placeholder: "Sam Smith",
      },
      {
        id: "child_3_dob",
        type: "text",
        label: "Child 3 - Date of Birth",
        placeholder: "YYYY-MM-DD",
      },
      {
        id: "child_3_team",
        type: "text",
        label: "Child 3 - Team",
        placeholder: "Toronto Thunder U8",
      },
    ],
  },
  {
    id: "preferences",
    label: "Notification Preferences",
    icon: "Bell",
    description: "How would you like to be notified?",
    fields: [
      {
        id: "notifications",
        type: "checkboxes",
        label: "Notification Methods",
        hint: "Select all that apply",
        options: [
          { value: "email", label: "Email", description: "Receive updates via email", icon: "Mail" },
          { value: "sms", label: "SMS", description: "Text message alerts", icon: "Smartphone" },
          { value: "push", label: "Push Notifications", description: "In-app notifications", icon: "Bell" },
        ],
      },
      {
        id: "language",
        type: "select",
        label: "Preferred Language",
        required: true,
        options: [
          { value: "en", label: "English" },
          { value: "fr", label: "French" },
          { value: "es", label: "Spanish" },
          { value: "zh", label: "Chinese (Simplified)" },
          { value: "pt", label: "Portuguese" },
        ],
      },
    ],
  },
  {
    id: "emergency",
    label: "Emergency Information",
    icon: "Heart",
    description: "Important emergency contact details",
    fields: [
      {
        id: "emergency_contact_name",
        type: "text",
        label: "Alternate Emergency Contact Name",
        placeholder: "John Smith",
        required: true,
        hint: "Someone we can contact if we can't reach you",
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
        type: "select",
        label: "Relationship",
        required: true,
        options: [
          { value: "spouse", label: "Spouse/Partner" },
          { value: "grandparent", label: "Grandparent" },
          { value: "sibling", label: "Sibling" },
          { value: "aunt_uncle", label: "Aunt/Uncle" },
          { value: "family_friend", label: "Family Friend" },
          { value: "neighbor", label: "Neighbor" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "medical_authorization",
        type: "checkboxes",
        label: "Medical Authorization",
        required: true,
        options: [
          {
            value: "emergency_treatment",
            label: "Emergency Treatment Authorization",
            description: "I authorize emergency medical treatment for my child(ren) if I cannot be reached"
          },
          {
            value: "medical_info_release",
            label: "Medical Information Release",
            description: "I consent to sharing medical information with coaches for safety purposes"
          },
        ],
      },
      {
        id: "medical_notes",
        type: "textarea",
        label: "Medical Notes & Allergies",
        placeholder: "List any allergies, medical conditions, or medications...",
        hint: "This information will be kept confidential and shared only with necessary staff",
      },
    ],
  },
  {
    id: "communication",
    label: "Communication Preferences",
    icon: "Mail",
    description: "Stay updated with news and events",
    fields: [
      {
        id: "communication_prefs",
        type: "checkboxes",
        label: "I would like to receive:",
        options: [
          {
            value: "newsletter",
            label: "Weekly Newsletter",
            description: "League news, tips, and highlights",
            icon: "Newspaper"
          },
          {
            value: "event_alerts",
            label: "Event Alerts",
            description: "Notifications about upcoming events and tournaments",
            icon: "Calendar"
          },
          {
            value: "game_reminders",
            label: "Game Reminders",
            description: "Reminders 24 hours before scheduled games",
            icon: "Clock"
          },
          {
            value: "practice_updates",
            label: "Practice Updates",
            description: "Practice schedule changes and cancellations",
            icon: "MapPin"
          },
          {
            value: "volunteer_opportunities",
            label: "Volunteer Opportunities",
            description: "Ways to get involved with the team",
            icon: "Heart"
          },
        ],
      },
      {
        id: "quiet_hours",
        type: "pills",
        label: "Quiet Hours (No notifications)",
        hint: "Select time periods when you prefer not to receive notifications",
        options: [
          { value: "none", label: "No Quiet Hours" },
          { value: "night", label: "10 PM - 7 AM" },
          { value: "work", label: "9 AM - 5 PM" },
          { value: "evening", label: "6 PM - 9 PM" },
        ],
        maxSelect: 1,
      },
    ],
  },
];

// Preview Component - Profile Card with Children List
function ParentPreview({ data }) {
  const children = [];
  if (data.child_1_name) {
    children.push({ name: data.child_1_name, dob: data.child_1_dob, team: data.child_1_team });
  }
  if (data.child_2_name) {
    children.push({ name: data.child_2_name, dob: data.child_2_dob, team: data.child_2_team });
  }
  if (data.child_3_name) {
    children.push({ name: data.child_3_name, dob: data.child_3_dob, team: data.child_3_team });
  }

  const notificationLabels = {
    email: "Email",
    sms: "SMS",
    push: "Push",
  };

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-[#c9a962]/20 flex items-center justify-center overflow-hidden">
            {data.photo ? (
              <img
                src={URL.createObjectURL(data.photo)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-[#c9a962]" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {data.first_name && data.last_name
                ? `${data.first_name} ${data.last_name}`
                : "Parent Name"}
            </h3>
            <p className="text-white/40 text-sm">{data.email || "email@example.com"}</p>
            <p className="text-white/40 text-sm">{data.phone || "(000) 000-0000"}</p>
          </div>
        </div>

        {/* Notification badges */}
        {data.notifications?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.notifications.map((n) => (
              <span
                key={n}
                className="px-2 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] text-xs font-medium"
              >
                {notificationLabels[n] || n}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Children List */}
      {children.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Children ({children.length})
          </h4>
          <div className="space-y-3">
            {children.map((child, index) => (
              <div key={index} className="p-3 rounded-lg bg-white/[0.04]">
                <p className="text-white font-medium">{child.name}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-white/40">
                  {child.dob && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {child.dob}
                    </span>
                  )}
                  {child.team && (
                    <span className="text-[#c9a962]">{child.team}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      {data.emergency_contact_name && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            Emergency Contact
          </h4>
          <p className="text-white font-medium">{data.emergency_contact_name}</p>
          <p className="text-white/40 text-sm">{data.emergency_contact_phone}</p>
          <p className="text-white/40 text-sm capitalize">
            {data.emergency_contact_relationship?.replace(/_/g, " ")}
          </p>
        </div>
      )}

      {/* Communication Prefs */}
      {data.communication_prefs?.length > 0 && (
        <div className="rounded-2xl bg-white/[0.07] border border-white/[0.06] p-5">
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
            Subscribed To
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.communication_prefs.map((pref) => (
              <span
                key={pref}
                className="px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-400 text-xs font-medium"
              >
                {pref.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ParentProfileSetup() {
  const navigate = useNavigate();
  const [savedData, setSavedData] = useState(null);

  const createProfileMutation = useMutation({
    mutationFn: async (data) => {
      // Transform form data to parent profile entity structure
      const children = [];
      if (data.child_1_name) {
        children.push({
          name: data.child_1_name,
          dob: data.child_1_dob,
          team: data.child_1_team
        });
      }
      if (data.child_2_name) {
        children.push({
          name: data.child_2_name,
          dob: data.child_2_dob,
          team: data.child_2_team
        });
      }
      if (data.child_3_name) {
        children.push({
          name: data.child_3_name,
          dob: data.child_3_dob,
          team: data.child_3_team
        });
      }

      const profileData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        photo: data.photo?.name || null,
        children: children,
        notification_preferences: data.notifications,
        language: data.language,
        emergency_contact: {
          name: data.emergency_contact_name,
          phone: data.emergency_contact_phone,
          relationship: data.emergency_contact_relationship,
        },
        medical_authorization: data.medical_authorization,
        medical_notes: data.medical_notes,
        communication_preferences: data.communication_prefs,
        quiet_hours: data.quiet_hours?.[0],
        status: "active",
        created_date: new Date().toISOString(),
      };

      return base44.entities.ParentProfile.create(profileData);
    },
    onSuccess: (profile) => {
      localStorage.removeItem("parent_profile_draft");
      navigate("/ParentDashboard");
    },
  });

  const handleSubmit = (data) => {
    createProfileMutation.mutate(data);
  };

  const handleSave = (data) => {
    setSavedData(data);
    localStorage.setItem("parent_profile_draft", JSON.stringify(data));
  };

  // Load draft from localStorage
  const initialData = React.useMemo(() => {
    try {
      const draft = localStorage.getItem("parent_profile_draft");
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FormBuilder
        title="Parent Profile Setup"
        subtitle="Complete your profile to access the parent portal"
        sections={PARENT_SECTIONS}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={ParentPreview}
        submitLabel={createProfileMutation.isPending ? "Saving..." : "Complete Setup"}
        skipLabel="Skip for Now"
        defaultMode="form"
      />
    </div>
  );
}
