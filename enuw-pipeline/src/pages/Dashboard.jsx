import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Plus,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import MetricCard from "../components/dashboard/MetricCard";
import VentureCard from "../components/dashboard/VentureCard";
import HotLeadCard from "../components/dashboard/HotLeadCard";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import TasksList from "../components/dashboard/TasksList";
import { formatCurrency, scoreProspect, getStageProbability, calculateWeightedValue } from "../components/scoring/scoringUtils";

export default function Dashboard() {
  const { data: leads = [], isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 100),
  });

  const { data: deals = [], isLoading: dealsLoading, refetch: refetchDeals } = useQuery({
    queryKey: ['deals'],
    queryFn: () => base44.entities.Deal.list('-created_date', 100),
  });

  const { data: leadScores = [], refetch: refetchScores } = useQuery({
    queryKey: ['leadScores'],
    queryFn: () => base44.entities.LeadScore.list('-created_date', 100),
  });

  const refreshAll = () => {
    refetchLeads();
    refetchDeals();
    refetchScores();
  };

  // Calculate portfolio metrics
  const metrics = useMemo(() => {
    // Calculate raw pipeline (excluding won/lost)
    const activeDeals = deals.filter(d => !['Closed_Won', 'Closed_Lost'].includes(d.stage));
    const rawPipeline = activeDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
    
    // Calculate weighted pipeline
    const weightedPipeline = activeDeals.reduce((sum, d) => {
      const prob = d.probability || getStageProbability(d.stage);
      return sum + calculateWeightedValue(d.deal_value || 0, prob);
    }, 0);

    // MRR target (from lead scores)
    const totalMRR = leadScores.reduce((sum, s) => sum + (s.projected_mrr_target || 0), 0);
    const mrrTarget = 35000; // $35K MRR target

    // Average close time (mock for now)
    const avgClose = 18;

    return {
      rawPipeline,
      weightedPipeline,
      totalMRR,
      mrrTarget,
      mrrProgress: Math.round((totalMRR / mrrTarget) * 100),
      avgClose
    };
  }, [deals, leadScores]);

  // Calculate venture metrics
  const ventureMetrics = useMemo(() => {
    const ventures = ["Vance", "Ball_in_the_6", "Wear_US", "enuwWEB"];
    
    return ventures.map(venture => {
      const ventureDeals = deals.filter(d => d.venture === venture && !['Closed_Won', 'Closed_Lost'].includes(d.stage));
      const wonDeals = deals.filter(d => d.venture === venture && d.stage === 'Closed_Won');
      const lostDeals = deals.filter(d => d.venture === venture && d.stage === 'Closed_Lost');
      
      const pipeline = ventureDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
      const totalClosed = wonDeals.length + lostDeals.length;
      const winRate = totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0;
      
      // Calculate vitality (simplified)
      const ventureLeads = leads.filter(l => l.venture === venture);
      const tier1Leads = leadScores.filter(s => s.tier === 'Tier_1_Hot' && 
        ventureLeads.some(l => l.id === s.lead_id)).length;
      const vitality = Math.min(100, 50 + (tier1Leads * 10) + (winRate * 0.3) + (pipeline > 100000 ? 20 : pipeline / 5000));

      return {
        venture,
        vitality: Math.round(vitality),
        pipeline: formatCurrency(pipeline),
        deals: ventureDeals.length,
        winRate
      };
    });
  }, [deals, leads, leadScores]);

  // Get hot leads (Tier 1)
  const hotLeads = useMemo(() => {
    const tier1Scores = leadScores.filter(s => s.tier === 'Tier_1_Hot').slice(0, 5);
    return tier1Scores.map(score => {
      const lead = leads.find(l => l.id === score.lead_id);
      return { lead, score };
    }).filter(item => item.lead);
  }, [leads, leadScores]);

  const isLoading = leadsLoading || dealsLoading;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Portfolio Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshAll}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Link to={createPageUrl("NewLead")}>
            <Button size="sm" className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" /> Add Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* TIER 1: Portfolio Pulse Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Pipeline"
          value={formatCurrency(metrics.rawPipeline)}
          icon={BarChart3}
          trend="up"
          trendValue="↑ 12% vs last mo"
          color="blue"
        />
        <MetricCard
          title="Weighted Value"
          value={formatCurrency(metrics.weightedPipeline)}
          icon={DollarSign}
          trend="up"
          trendValue="↑ 8%"
          color="green"
        />
        <MetricCard
          title="MRR Target"
          value={`${metrics.mrrProgress}%`}
          icon={TrendingUp}
          trend={metrics.mrrProgress >= 50 ? "up" : "down"}
          trendValue={`${formatCurrency(metrics.totalMRR)}/mo`}
          color="purple"
        />
        <MetricCard
          title="Avg Close"
          value={`${metrics.avgClose} days`}
          icon={Clock}
          trend="down"
          trendValue="↓ 3 days"
          color="orange"
        />
      </div>

      {/* TIER 2: Venture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {ventureMetrics.map((vm, index) => (
          <VentureCard
            key={vm.venture}
            venture={vm.venture}
            vitality={vm.vitality}
            pipeline={vm.pipeline}
            deals={vm.deals}
            winRate={vm.winRate}
            index={index}
          />
        ))}
      </div>

      {/* TIER 3: Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hot Leads */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              🔥 Hot Leads (Tier 1)
            </h2>
            <Link to={createPageUrl("Leads")}>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                View All
              </Button>
            </Link>
          </div>
          
          {hotLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {hotLeads.map((item, index) => (
                <HotLeadCard 
                  key={item.lead.id} 
                  lead={item.lead} 
                  score={item.score}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 text-center">
              <p className="text-slate-400">No Tier 1 leads yet. Add leads and run scoring to see hot prospects.</p>
              <Link to={createPageUrl("Scoring")}>
                <Button className="mt-4 bg-red-500 hover:bg-red-600">
                  Run AI6 Scoring
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <TasksList />
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
}