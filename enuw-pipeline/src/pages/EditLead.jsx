import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import LeadForm from '../components/leads/LeadForm';

export default function EditLead() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const leadId = urlParams.get('id');

  const { data: lead, isLoading: loadingLead } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: async () => {
      const leads = await base44.entities.Lead.filter({ id: leadId });
      return leads[0];
    },
    enabled: !!leadId
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.Lead.update(leadId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      navigate(createPageUrl('LeadDetail') + `?id=${leadId}`);
    }
  });

  const handleSave = (data) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(createPageUrl('LeadDetail') + `?id=${leadId}`);
  };

  if (loadingLead) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] p-6">
        <div className="text-center text-slate-400">Lead not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(createPageUrl('LeadDetail') + `?id=${leadId}`)}
            className="text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lead
          </Button>
          
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Edit Lead: {lead.company_name}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Update lead information</p>
        </div>

        <LeadForm 
          lead={lead}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
}