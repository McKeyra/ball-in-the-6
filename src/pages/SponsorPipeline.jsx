import { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SponsorColumn from "../components/pipeline/SponsorColumn";
import { formatCurrency } from "../components/scoring/teamHealthScoring";

const STAGES = ["Discovery", "Proposal", "Negotiation", "Contract", "Closed_Won"];

const SPONSOR_TYPES = ["All", "Title", "Gold", "Silver", "Bronze", "In_Kind", "Media"];

// Stage probability mapping for weighted value calculation
const STAGE_PROBABILITY = {
  "Discovery": 10,
  "Proposal": 25,
  "Negotiation": 50,
  "Contract": 75,
  "Closed_Won": 100
};

export default function SponsorPipeline() {
  const [typeFilter, setTypeFilter] = useState("All");
  const queryClient = useQueryClient();

  const { data: sponsors = [], isLoading } = useQuery({
    queryKey: ['sponsors'],
    queryFn: () => base44.entities.Sponsor.list('-created_date', 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Sponsor.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
    }
  });

  // Filter sponsors by type
  const filteredSponsors = useMemo(() => {
    if (typeFilter === "All") return sponsors;
    return sponsors.filter(s => s.sponsor_type === typeFilter);
  }, [sponsors, typeFilter]);

  // Group sponsors by stage
  const sponsorsByStage = useMemo(() => {
    const grouped = {};
    STAGES.forEach(stage => {
      grouped[stage] = filteredSponsors.filter(s => s.stage === stage);
    });
    return grouped;
  }, [filteredSponsors]);

  // Calculate totals per stage
  const stageTotals = useMemo(() => {
    const totals = {};
    STAGES.forEach(stage => {
      totals[stage] = sponsorsByStage[stage].reduce((sum, s) => sum + (s.deal_value || s.sponsorship_value || 0), 0);
    });
    return totals;
  }, [sponsorsByStage]);

  // Overall metrics
  const metrics = useMemo(() => {
    const activeSponsors = filteredSponsors.filter(s => s.stage !== 'Closed_Won');
    const totalPipeline = activeSponsors.reduce((sum, s) => sum + (s.deal_value || s.sponsorship_value || 0), 0);
    const weightedPipeline = activeSponsors.reduce((sum, s) => {
      const prob = s.probability || STAGE_PROBABILITY[s.stage] || 10;
      return sum + (s.deal_value || s.sponsorship_value || 0) * prob / 100;
    }, 0);
    return {
      totalPipeline,
      weightedPipeline,
      sponsorCount: activeSponsors.length
    };
  }, [filteredSponsors]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStage = destination.droppableId;
    const newProbability = STAGE_PROBABILITY[newStage];

    updateMutation.mutate({
      id: draggableId,
      data: {
        stage: newStage,
        probability: newProbability
      }
    });
  };

  const handleSponsorClick = (sponsor) => {
    console.log("Sponsor clicked:", sponsor);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 md:mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Sponsor Pipeline</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {metrics.sponsorCount} active sponsors • {formatCurrency(metrics.totalPipeline)} pipeline • {formatCurrency(metrics.weightedPipeline)} weighted
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[160px] bg-[#1a1a1a] border-[#2a2a2a] text-white min-h-[44px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
              {SPONSOR_TYPES.map(type => (
                <SelectItem key={type} value={type} className="text-white hover:bg-[#2a2a2a] min-h-[44px]">
                  {type.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link to={createPageUrl("AddSponsor")} className="w-full sm:w-auto">
            <Button className="bg-[#c9a962] hover:bg-[#b8944f] text-black font-medium min-h-[44px] w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add Sponsor
            </Button>
          </Link>
        </div>
      </div>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => (
            <SponsorColumn
              key={stage}
              stage={stage}
              sponsors={sponsorsByStage[stage]}
              totalValue={stageTotals[stage]}
              onSponsorClick={handleSponsorClick}
            />
          ))}
        </div>
      </DragDropContext>

      {sponsors.length === 0 && !isLoading && (
        <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6 md:p-12 text-center mt-6 md:mt-8">
          <p className="text-gray-400 mb-4 text-sm md:text-base">No sponsors in your pipeline yet.</p>
          <Link to={createPageUrl("AddSponsor")}>
            <Button className="bg-[#c9a962] hover:bg-[#b8944f] text-black font-medium min-h-[44px]">
              <Plus className="w-4 h-4 mr-2" /> Add Your First Sponsor
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
