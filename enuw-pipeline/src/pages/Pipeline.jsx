import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PipelineColumn from "../components/pipeline/PipelineColumn";
import { formatCurrency, getStageProbability } from "../components/scoring/scoringUtils";

const STAGES = ["Discovery", "Proposal", "Negotiation", "Contract", "Closed_Won"];

export default function Pipeline() {
  const [ventureFilter, setVentureFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => base44.entities.Deal.list('-created_date', 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Deal.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });

  // Filter deals by venture
  const filteredDeals = useMemo(() => {
    if (ventureFilter === "all") return deals;
    return deals.filter(d => d.venture === ventureFilter);
  }, [deals, ventureFilter]);

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped = {};
    STAGES.forEach(stage => {
      grouped[stage] = filteredDeals.filter(d => d.stage === stage);
    });
    return grouped;
  }, [filteredDeals]);

  // Calculate totals per stage
  const stageTotals = useMemo(() => {
    const totals = {};
    STAGES.forEach(stage => {
      totals[stage] = dealsByStage[stage].reduce((sum, d) => sum + (d.deal_value || 0), 0);
    });
    return totals;
  }, [dealsByStage]);

  // Overall metrics
  const metrics = useMemo(() => {
    const activeDeals = filteredDeals.filter(d => !['Closed_Won', 'Closed_Lost'].includes(d.stage));
    const rawPipeline = activeDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
    const weightedPipeline = activeDeals.reduce((sum, d) => {
      const prob = d.probability || getStageProbability(d.stage);
      return sum + (d.deal_value || 0) * prob / 100;
    }, 0);
    return { rawPipeline, weightedPipeline, dealCount: activeDeals.length };
  }, [filteredDeals]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const newStage = destination.droppableId;
    const newProbability = getStageProbability(newStage);

    updateMutation.mutate({
      id: draggableId,
      data: { 
        stage: newStage,
        probability: newProbability
      }
    });
  };

  const handleDealClick = (deal) => {
    // Could open a modal or navigate to deal detail
    console.log("Deal clicked:", deal);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Pipeline Board</h1>
          <p className="text-slate-400 text-sm mt-1">
            {metrics.dealCount} active deals • {formatCurrency(metrics.rawPipeline)} pipeline • {formatCurrency(metrics.weightedPipeline)} weighted
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={ventureFilter} onValueChange={setVentureFilter}>
            <SelectTrigger className="w-[160px] bg-slate-800 border-slate-700 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Ventures" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ventures</SelectItem>
              <SelectItem value="Vance">Vance</SelectItem>
              <SelectItem value="Ball_in_the_6">Ball in the 6</SelectItem>
              <SelectItem value="Wear_US">Wear US</SelectItem>
              <SelectItem value="enuwWEB">enuwWEB</SelectItem>
            </SelectContent>
          </Select>
          <Link to={createPageUrl("NewDeal")}>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" /> New Deal
            </Button>
          </Link>
        </div>
      </div>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => (
            <PipelineColumn
              key={stage}
              stage={stage}
              deals={dealsByStage[stage]}
              totalValue={stageTotals[stage]}
              onDealClick={handleDealClick}
            />
          ))}
        </div>
      </DragDropContext>

      {deals.length === 0 && !isLoading && (
        <Card className="bg-slate-900/50 border-slate-800 p-12 text-center mt-8">
          <p className="text-slate-400 mb-4">No deals in your pipeline yet.</p>
          <Link to={createPageUrl("NewDeal")}>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" /> Create Your First Deal
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}