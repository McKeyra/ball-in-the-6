import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, getStageProbability, calculateWeightedValue, VENTURE_COLORS, TIER_COLORS } from "../components/scoring/scoringUtils";

export default function Reports() {
  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 500),
  });

  const { data: deals = [] } = useQuery({
    queryKey: ['deals'],
    queryFn: () => base44.entities.Deal.list('-created_date', 500),
  });

  const { data: leadScores = [] } = useQuery({
    queryKey: ['leadScores'],
    queryFn: () => base44.entities.LeadScore.list('-created_date', 500),
  });

  // Portfolio Overview
  const portfolioMetrics = useMemo(() => {
    const activeDeals = deals.filter(d => !['Closed_Won', 'Closed_Lost'].includes(d.stage));
    const wonDeals = deals.filter(d => d.stage === 'Closed_Won');
    const lostDeals = deals.filter(d => d.stage === 'Closed_Lost');

    const rawPipeline = activeDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
    const weightedPipeline = activeDeals.reduce((sum, d) => {
      const prob = d.probability || getStageProbability(d.stage);
      return sum + calculateWeightedValue(d.deal_value || 0, prob);
    }, 0);

    const totalWonValue = wonDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
    const totalClosed = wonDeals.length + lostDeals.length;
    const winRate = totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0;

    return {
      totalLeads: leads.length,
      activeDeals: activeDeals.length,
      rawPipeline,
      weightedPipeline,
      totalWonValue,
      wonDeals: wonDeals.length,
      winRate
    };
  }, [leads, deals]);

  // Venture breakdown
  const ventureData = useMemo(() => {
    const ventures = ["Vance", "Ball_in_the_6", "Wear_US", "enuwWEB"];
    
    return ventures.map(venture => {
      const ventureDeals = deals.filter(d => d.venture === venture && !['Closed_Won', 'Closed_Lost'].includes(d.stage));
      const wonDeals = deals.filter(d => d.venture === venture && d.stage === 'Closed_Won');
      const pipeline = ventureDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
      const won = wonDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);

      return {
        name: venture.replace(/_/g, ' '),
        pipeline,
        won,
        deals: ventureDeals.length,
        color: VENTURE_COLORS[venture]
      };
    });
  }, [deals]);

  // Lead source breakdown
  const sourceData = useMemo(() => {
    const sources = {};
    leads.forEach(lead => {
      const source = lead.lead_source || 'Unknown';
      sources[source] = (sources[source] || 0) + 1;
    });
    
    return Object.entries(sources).map(([name, value]) => ({ name, value }));
  }, [leads]);

  // Tier distribution
  const tierData = useMemo(() => {
    const tier1 = leadScores.filter(s => s.tier === 'Tier_1_Hot').length;
    const tier2 = leadScores.filter(s => s.tier === 'Tier_2_Warm').length;
    const tier3 = leadScores.filter(s => s.tier === 'Tier_3_Monitor').length;
    const unscored = leads.length - leadScores.length;

    return [
      { name: 'Tier 1 Hot', value: tier1, color: TIER_COLORS.Tier_1_Hot },
      { name: 'Tier 2 Warm', value: tier2, color: TIER_COLORS.Tier_2_Warm },
      { name: 'Tier 3 Monitor', value: tier3, color: TIER_COLORS.Tier_3_Monitor },
      { name: 'Unscored', value: unscored, color: '#475569' },
    ].filter(d => d.value > 0);
  }, [leads, leadScores]);

  // Stage distribution
  const stageData = useMemo(() => {
    const activeDeals = deals.filter(d => !['Closed_Won', 'Closed_Lost'].includes(d.stage));
    const stages = ['Discovery', 'Proposal', 'Negotiation', 'Contract'];
    
    return stages.map(stage => ({
      name: stage,
      count: activeDeals.filter(d => d.stage === stage).length,
      value: activeDeals.filter(d => d.stage === stage).reduce((s, d) => s + (d.deal_value || 0), 0)
    }));
  }, [deals]);

  // Industry breakdown
  const industryData = useMemo(() => {
    const industries = {};
    leads.forEach(lead => {
      const ind = lead.industry || 'Unknown';
      industries[ind] = (industries[ind] || 0) + 1;
    });
    
    return Object.entries(industries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, [leads]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Analytics & Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Portfolio performance overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-900/50 border-slate-800 p-4">
          <p className="text-slate-400 text-xs">Total Pipeline</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(portfolioMetrics.rawPipeline)}</p>
          <p className="text-xs text-emerald-400">Weighted: {formatCurrency(portfolioMetrics.weightedPipeline)}</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-4">
          <p className="text-slate-400 text-xs">Total Won</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(portfolioMetrics.totalWonValue)}</p>
          <p className="text-xs text-slate-400">{portfolioMetrics.wonDeals} deals</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-4">
          <p className="text-slate-400 text-xs">Win Rate</p>
          <p className="text-2xl font-bold text-white">{portfolioMetrics.winRate}%</p>
          <p className="text-xs text-slate-400">Overall conversion</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-4">
          <p className="text-slate-400 text-xs">Total Leads</p>
          <p className="text-2xl font-bold text-white">{portfolioMetrics.totalLeads}</p>
          <p className="text-xs text-slate-400">{portfolioMetrics.activeDeals} active deals</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pipeline by Venture */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pipeline by Venture</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventureData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="pipeline" name="Pipeline" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="won" name="Won" fill="#22C55E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Tier Distribution */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Lead Quality Distribution</h3>
          <div className="flex items-center gap-6">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {tierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {tierData.map((tier) => (
                <div key={tier.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="text-slate-300 text-sm">{tier.name}</span>
                  </div>
                  <span className="text-white font-semibold">{tier.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Stage Distribution */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Deals by Stage</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  formatter={(value, name) => [name === 'value' ? formatCurrency(value) : value, name === 'value' ? 'Value' : 'Deals']}
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Sources */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Lead Sources</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Bar dataKey="value" fill="#F97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Industries */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Industries</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={industryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}