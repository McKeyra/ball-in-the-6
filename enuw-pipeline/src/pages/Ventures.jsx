import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VitalityRing from "../components/leads/VitalityRing";
import { formatCurrency, getStageProbability, calculateWeightedValue, VENTURE_COLORS } from "../components/scoring/scoringUtils";

const ventureInfo = {
  "Vance": {
    icon: "🎰",
    focus: "Sports betting intelligence (64.8% prediction accuracy)",
    targetValue: "$44B"
  },
  "Ball_in_the_6": {
    icon: "🏀",
    focus: "Toronto sports platform (community + content + commerce)",
    targetValue: "$22B"
  },
  "Wear_US": {
    icon: "👔",
    focus: "B2B apparel (blankletics, wearuniforms, basicbrands)",
    targetValue: "$18B"
  },
  "enuwWEB": {
    icon: "🌐",
    focus: "Conversational website builder ($35K MRR target)",
    targetValue: "$16B"
  }
};

export default function Ventures() {
  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 200),
  });

  const { data: deals = [] } = useQuery({
    queryKey: ['deals'],
    queryFn: () => base44.entities.Deal.list('-created_date', 200),
  });

  const { data: leadScores = [] } = useQuery({
    queryKey: ['leadScores'],
    queryFn: () => base44.entities.LeadScore.list('-created_date', 200),
  });

  const ventureData = useMemo(() => {
    const ventures = ["Vance", "Ball_in_the_6", "Wear_US", "enuwWEB"];
    
    return ventures.map(venture => {
      const info = ventureInfo[venture];
      const ventureLeads = leads.filter(l => l.venture === venture);
      const ventureDeals = deals.filter(d => d.venture === venture && !['Closed_Won', 'Closed_Lost'].includes(d.stage));
      const wonDeals = deals.filter(d => d.venture === venture && d.stage === 'Closed_Won');
      const lostDeals = deals.filter(d => d.venture === venture && d.stage === 'Closed_Lost');
      
      const pipeline = ventureDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
      const weightedPipeline = ventureDeals.reduce((sum, d) => {
        const prob = d.probability || getStageProbability(d.stage);
        return sum + calculateWeightedValue(d.deal_value || 0, prob);
      }, 0);

      const totalClosed = wonDeals.length + lostDeals.length;
      const winRate = totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0;

      // Calculate vitality
      const tier1Count = leadScores.filter(s => s.tier === 'Tier_1_Hot' && 
        ventureLeads.some(l => l.id === s.lead_id)).length;
      const vitality = Math.min(100, 50 + (tier1Count * 10) + (winRate * 0.3) + (pipeline > 100000 ? 20 : pipeline / 5000));

      return {
        venture,
        ...info,
        color: VENTURE_COLORS[venture],
        leads: ventureLeads.length,
        deals: ventureDeals.length,
        pipeline,
        weightedPipeline,
        winRate,
        vitality: Math.round(vitality),
        tier1Count,
        wonDeals: wonDeals.length,
        wonValue: wonDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0)
      };
    });
  }, [leads, deals, leadScores]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Venture Portfolio</h1>
        <p className="text-slate-400 text-sm mt-1">$100B trajectory across 4 ventures</p>
      </div>

      {/* Venture Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ventureData.map((v) => (
          <Card 
            key={v.venture} 
            className="bg-slate-900/50 border-slate-800 overflow-hidden hover:border-slate-700 transition-all"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: v.color + '20' }}
                  >
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{v.venture.replace(/_/g, ' ')}</h3>
                    <p className="text-sm text-slate-400">{v.focus}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Target</p>
                  <p className="text-lg font-bold" style={{ color: v.color }}>{v.targetValue}</p>
                </div>
              </div>

              {/* Vitality + Metrics */}
              <div className="flex items-center gap-6 mb-6">
                <VitalityRing score={v.vitality} size={100} />
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Pipeline</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(v.pipeline)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Weighted</p>
                    <p className="text-lg font-semibold text-emerald-400">{formatCurrency(v.weightedPipeline)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Win Rate</p>
                    <p className="text-lg font-semibold text-white">{v.winRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Hot Leads</p>
                    <p className="text-lg font-semibold text-red-400">{v.tier1Count}</p>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-slate-800/30 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{v.leads}</p>
                  <p className="text-xs text-slate-400">Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{v.deals}</p>
                  <p className="text-xs text-slate-400">Active Deals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{v.wonDeals}</p>
                  <p className="text-xs text-slate-400">Won</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(v.wonValue)}</p>
                  <p className="text-xs text-slate-400">Won Value</p>
                </div>
              </div>

              {/* Action */}
              <Link to={createPageUrl(`Venture?name=${v.venture}`)}>
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  View Golden Hour Details <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}