import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, Save, X } from "lucide-react";

const industries = [
  "Roofing", "HVAC", "Plumbing", "Electrical", "Insurance",
  "Legal Services", "Medical", "Dental", "Real Estate",
  "Mortgage", "Financial Services", "Home Security", "Solar",
  "Renovations", "Landscaping", "Cleaning", "Pest Control",
  "Auto Services", "Fitness", "Personal Training", "Accounting",
  "Bookkeeping", "Photography", "Event Planning", "Moving Services",
  "Sports Organization", "Education", "Other"
];

const ventures = [
  { value: "Vance", label: "Vance" },
  { value: "Ball_in_the_6", label: "Ball in the 6" },
  { value: "Wear_US", label: "Wear US" },
  { value: "enuwWEB", label: "enuwWEB" },
  { value: "Cross_Portfolio", label: "Cross Portfolio" }
];

const leadSources = [
  "YellowPages", "Referral", "Inbound", "Outbound", "LinkedIn", "Event", "Other"
];

export default function LeadForm({ lead, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState(lead || {
    company_name: "",
    industry: "",
    city: "",
    province: "ON",
    website: "",
    contact_email: "",
    contact_phone: "",
    owner_name: "",
    employee_count: "",
    years_in_business: "",
    google_review_count: "",
    google_rating: "",
    lead_source: "",
    venture: "",
    status: "New",
    notes: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      employee_count: formData.employee_count ? Number(formData.employee_count) : null,
      years_in_business: formData.years_in_business ? Number(formData.years_in_business) : null,
      google_review_count: formData.google_review_count ? Number(formData.google_review_count) : null,
      google_rating: formData.google_rating ? Number(formData.google_rating) : null
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Company Information</h3>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Company Name *</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Industry *</Label>
              <Select value={formData.industry} onValueChange={(v) => handleChange("industry", v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(ind => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">City *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Province</Label>
                <Input
                  value={formData.province}
                  onChange={(e) => handleChange("province", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Website</Label>
              <Input
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="https://"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Employees</Label>
                <Input
                  type="number"
                  value={formData.employee_count}
                  onChange={(e) => handleChange("employee_count", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Years in Business</Label>
                <Input
                  type="number"
                  value={formData.years_in_business}
                  onChange={(e) => handleChange("years_in_business", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact & Source Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Contact & Source</h3>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Owner Name</Label>
              <Input
                value={formData.owner_name}
                onChange={(e) => handleChange("owner_name", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Contact Email</Label>
              <Input
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleChange("contact_email", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Contact Phone</Label>
              <Input
                value={formData.contact_phone}
                onChange={(e) => handleChange("contact_phone", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Lead Source</Label>
              <Select value={formData.lead_source} onValueChange={(v) => handleChange("lead_source", v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {leadSources.map(src => (
                    <SelectItem key={src} value={src}>{src}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Target Venture</Label>
              <Select value={formData.venture} onValueChange={(v) => handleChange("venture", v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select venture" />
                </SelectTrigger>
                <SelectContent>
                  {ventures.map(v => (
                    <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Google Reviews</Label>
                <Input
                  type="number"
                  value={formData.google_review_count}
                  onChange={(e) => handleChange("google_review_count", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Google Rating</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.google_rating}
                  onChange={(e) => handleChange("google_rating", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onCancel} className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {lead ? "Update Lead" : "Create Lead"}
          </Button>
        </div>
      </form>
    </Card>
  );
}