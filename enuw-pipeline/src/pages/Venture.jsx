import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Clock, TrendingUp, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import VitalityRing from "../components/leads/VitalityRing";
import { formatCurrency, getStageProbability, calculateWeightedValue, VENTURE_COLORS, TIER_COLORS } from "../components/scoring/scoringUtils";

const ventureInfo = {
  "Vance": { icon: "🎰", focus: "Sports betting intelligence", targetValue: "$44B" },
  "Ball_in_the_6": { icon: "🏀", focus: "Toronto sports platform", targetValue: "$22B" },
  "Wear_US": { icon: "👔", focus: "B2B apparel", targetValue: "$18B" },
  "enuwWEB": { icon: "🌐", focus: "Conversational website builder", targetValue: "$16B" }
};

export default function Venture() {
  const urlParams = new URLSearchParams(window.location.search);
  const ventureName = urlParams.get('name') || "enuwWEB";
  const info = ventureInfo[ventureName] || ventureInfo["enuwWEB"];
  const color = VENTURE_COLORS[ventureName] || "#3B82F6";

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

  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: () => base44.entities.Activity.list('-created_date', 50),
  });

  const data = useMemo(() => {
    const ventureLeads = leads.filter(l => l.venture === ventureName);
    const ventureDeals = deals.filter(d => d.venture === ventureName);
    const activeDeals = ventureDeals.filter(d => !['Closed_Won', 'Closed_Lost'].includes(d.stage));
    const wonDeals = ventureDeals.filter(d => d.stage === 'Closed_Won');
    const lostDeals = ventureDeals.filter(d => d.stage === 'Closed_Lost');

    const pipeline = activeDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
    const weightedPipeline = activeDeals.reduce((sum, d) => {
      const prob = d.probability || getStageProbability(d.stage);
      return sum + calculateWeightedValue(d.deal_value || 0, prob);
    }, 0);

    const totalClosed = wonDeals.length + lostDeals.length;
    const winRate = totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0;

    // Tier breakdown
    const tier1 = leadScores.filter(s => s.tier === 'Tier_1_Hot' && ventureLeads.some(l => l.id === s.lead_id)).length;
    const tier2 = leadScores.filter(s => s.tier === 'Tier_2_Warm' && ventureLeads.some(l => l.id === s.lead_id)).length;
    const tier3 = leadScores.filter(s => s.tier === 'Tier_3_Monitor' && ventureLeads.some(l => l.id === s.lead_id)).length;

    // Stage breakdown for chart
    const stageData = [
      { name: 'Discovery', value: activeDeals.filter(d => d.stage === 'Discovery').reduce((s, d) => s + (d.deal_value || 0), 0), count: activeDeals.filter(d => d.stage === 'Discovery').length },
      { name: 'Proposal', value: activeDeals.filter(d => d.stage === 'Proposal').reduce((s, d) => s + (d.deal_value || 0), 0), count: activeDeals.filter(d => d.stage === 'Proposal').length },
      { name: 'Negotiation', value: activeDeals.filter(d => d.stage === 'Negotiation').reduce((s, d) => s + (d.deal_value || 0), 0), count: activeDeals.filter(d => d.stage === 'Negotiation').length },
      { name: 'Contract', value: activeDeals.filter(d => d.stage === 'Contract').reduce((s, d) => s + (d.deal_value || 0), 0), count: activeDeals.filter(d => d.stage === 'Contract').length },
    ];

    const vitality = Math.min(100, 50 + (tier1 * 10) + (winRate * 0.3) + (pipeline > 100000 ? 20 : pipeline / 5000));

    // Recent activities for this venture
    const ventureLeadIds = ventureLeads.map(l => l.id);
    const recentActivities = activities.filter(a => ventureLeadIds.includes(a.lead_id)).slice(0, 5);

    return {
      leads: ventureLeads,
      activeDeals,
      wonDeals,
      lostDeals,
      pipeline,
      weightedPipeline,
      winRate,
      tier1,
      tier2,
      tier3,
      stageData,
      vitality: Math.round(vitality),
      recentActivities
    };
  }, [leads, deals, leadScores, activities, ventureName]);

  const tierPieData = [
    { name: 'Tier 1 Hot', value: data.tier1, color: TIER_COLORS.Tier_1_Hot },
    { name: 'Tier 2 Warm', value: data.tier2, color: TIER_COLORS.Tier_2_Warm },
    { name: 'Tier 3 Monitor', value: data.tier3, color: TIER_COLORS.Tier_3_Monitor },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={createPageUrl("Ventures")}>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: color + '20' }}
          >
            {info.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{ventureName.replace(/_/g, ' ')} — Golden Hour View</h1>
            <p className="text-slate-400 text-sm">{info.focus}</p>
          </div>
        </div>
        <Badge className="text-lg px-4 py-2" style={{ backgroundColor: color + '20', color: color }}>
          Target: {info.targetValue}
        </Badge>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-900/50 border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <VitalityRing score={data.vitality} size={60} />
            <div>
              <p className="text-slate-400 text-xs">Vitality Index</p>
              <p className="text-xl font-bold text-white">{data.vitality >= 80 ? 'Healthy' : data.vitality >= 60 ? 'Stable' : 'Needs Attention'}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-4">
          <p className="text-slate-400 text-xs">Pipeline</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(data.pipeline)}</p>
          <p className="text-xs text-emerald-400">Weighted: {formatCurrency(data.weightedPipeline)}</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-4">
          <p className="text-slate-400 text-xs">Win Rate</p>
          <p className="text-2xl font-bold text-white">{data.winRate}%</p>
          <p className="text-xs text-slate-400">{data.wonDeals.length} won / {data.wonDeals.length + data.lostDeals.length} closed</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-4">
          <p className="text-slate-400 text-xs">Active Deals</p>
          <p className="text-2xl font-bold text-white">{data.activeDeals.length}</p>
          <p className="text-xs text-slate-400">{data.leads.length} total leads</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline by Stage Chart */}
        <Card className="bg-slate-900/50 border-slate-800 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Pipeline by Stage</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.stageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value, name) => [formatCurrency(value), 'Value']}
                />
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Tier Distribution */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Lead Quality</h3>
          {tierPieData.length > 0 ? (
            <>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tierPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {tierPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {tierPieData.map((tier) => (
                  <div key={tier.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                      <span className="text-slate-300">{tier.name}</span>
                    </div>
                    <span className="text-white font-medium">{tier.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-center py-8">No scored leads yet</p>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-900/50 border-slate-800 p-6 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        {data.recentActivities.length > 0 ? (
          <div className="space-y-3">
            {data.recentActivities.map((activity) => {
              const lead = data.leads.find(l => l.id === activity.lead_id);
              return (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30">
                  <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.subject}</p>
                    <p className="text-slate-400 text-sm">{lead?.company_name} • {activity.activity_type}</p>
                  </div>
                  <Badge className={`
                    ${activity.outcome === 'Positive' ? 'bg-emerald-500/20 text-emerald-400' :
                      activity.outcome === 'Negative' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-500/20 text-slate-400'}
                  `}>
                    {activity.outcome || 'Pending'}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No recent activities</p>
        )}
      </Card>
    </div>
  );
}