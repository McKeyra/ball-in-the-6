import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { getStageProbability } from "../components/scoring/scoringUtils";

const ventures = [
  { value: "Vance", label: "Vance" },
  { value: "Ball_in_the_6", label: "Ball in the 6" },
  { value: "Wear_US", label: "Wear US" },
  { value: "enuwWEB", label: "enuwWEB" }
];

const stages = [
  "Discovery", "Proposal", "Negotiation", "Contract"
];

export default function NewDeal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 200),
  });

  const [formData, setFormData] = useState({
    deal_name: "",
    lead_id: "",
    venture: "",
    stage: "Discovery",
    deal_value: "",
    mrr_value: "",
    expected_close_date: ""
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Deal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      navigate(createPageUrl("Pipeline"));
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLeadSelect = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setFormData(prev => ({
        ...prev,
        lead_id: leadId,
        deal_name: lead.company_name,
        venture: lead.venture || prev.venture
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const probability = getStageProbability(formData.stage);
    
    createMutation.mutate({
      ...formData,
      deal_value: formData.deal_value ? Number(formData.deal_value) : null,
      mrr_value: formData.mrr_value ? Number(formData.mrr_value) : null,
      probability
    });
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={createPageUrl("Pipeline")}>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Deal</h1>
          <p className="text-slate-400 text-sm">Add a deal to your pipeline</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Link to Lead (Optional)</Label>
            <Select value={formData.lead_id} onValueChange={handleLeadSelect}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select a lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map(lead => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.company_name} - {lead.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Deal Name *</Label>
            <Input
              value={formData.deal_name}
              onChange={(e) => handleChange("deal_name", e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Venture *</Label>
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

            <div className="space-y-2">
              <Label className="text-slate-300">Stage</Label>
              <Select value={formData.stage} onValueChange={(v) => handleChange("stage", v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Deal Value ($)</Label>
              <Input
                type="number"
                value={formData.deal_value}
                onChange={(e) => handleChange("deal_value", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="25000"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">MRR Value ($)</Label>
              <Input
                type="number"
                value={formData.mrr_value}
                onChange={(e) => handleChange("mrr_value", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="175"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Expected Close Date</Label>
            <Input
              type="date"
              value={formData.expected_close_date}
              onChange={(e) => handleChange("expected_close_date", e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(createPageUrl("Pipeline"))}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || !formData.deal_name || !formData.venture}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Create Deal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}