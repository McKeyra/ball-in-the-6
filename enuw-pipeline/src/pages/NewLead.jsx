import React from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LeadForm from "../components/leads/LeadForm";

export default function NewLead() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Lead.create(data),
    onSuccess: (newLead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      navigate(createPageUrl(`LeadDetail?id=${newLead.id}`));
    },
  });

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={createPageUrl("Leads")}>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Lead</h1>
          <p className="text-slate-400 text-sm">Enter prospect information for AI6 scoring</p>
        </div>
      </div>

      <LeadForm
        onSave={createMutation.mutate}
        onCancel={() => navigate(createPageUrl("Leads"))}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}