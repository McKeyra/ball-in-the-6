import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Play, CheckCircle2, Loader2, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { scoreProspect, TIER_COLORS, VENTURE_COLORS } from "../components/scoring/scoringUtils";

export default function Scoring() {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [ventureFilter, setVentureFilter] = useState("all");
  const [onlyUnscored, setOnlyUnscored] = useState(true);
  const [scoringProgress, setScoringProgress] = useState({ current: 0, total: 0, isRunning: false });
  
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 200),
  });

  const { data: leadScores = [] } = useQuery({
    queryKey: ['leadScores'],
    queryFn: () => base44.entities.LeadScore.list('-created_date', 200),
  });

  const { data: scoringSettings } = useQuery({
    queryKey: ['scoringSettings'],
    queryFn: async () => {
      const settings = await base44.entities.ScoringSettings.list();
      return settings[0] || null;
    }
  });

  // Create score map
  const scoreMap = useMemo(() => {
    const map = {};
    leadScores.forEach(s => { map[s.lead_id] = s; });
    return map;
  }, [leadScores]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesVenture = ventureFilter === "all" || lead.venture === ventureFilter;
      const hasScore = !!scoreMap[lead.id];
      const matchesScored = !onlyUnscored || !hasScore;
      return matchesVenture && matchesScored;
    });
  }, [leads, ventureFilter, onlyUnscored, scoreMap]);

  const createScoreMutation = useMutation({
    mutationFn: (data) => base44.entities.LeadScore.create(data),
  });

  const updateScoreMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.LeadScore.update(id, data),
  });

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const handleSelectLead = (leadId) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    } else {
      setSelectedLeads(prev => [...prev, leadId]);
    }
  };

  const runBatchScoring = async () => {
    if (selectedLeads.length === 0) return;
    
    setScoringProgress({ current: 0, total: selectedLeads.length, isRunning: true });

    for (let i = 0; i < selectedLeads.length; i++) {
      const leadId = selectedLeads[i];
      const lead = leads.find(l => l.id === leadId);
      if (!lead) continue;

      const result = scoreProspect(lead, scoringSettings);
      const existingScore = scoreMap[leadId];

      const scoreData = {
        lead_id: leadId,
        overall_score: result.overall_score,
        tier: result.tier,
        confidence: result.confidence,
        industry_fit_score: result.scores.industry_fit.score,
        industry_fit_evidence: result.scores.industry_fit.evidence,
        mrr_potential_score: result.scores.mrr_potential.score,
        mrr_potential_evidence: result.scores.mrr_potential.evidence,
        digital_maturity_score: result.scores.digital_maturity.score,
        digital_maturity_evidence: result.scores.digital_maturity.evidence,
        geographic_value_score: result.scores.geographic_value.score,
        geographic_value_evidence: result.scores.geographic_value.evidence,
        decision_authority_score: result.scores.decision_authority.score,
        decision_authority_evidence: result.scores.decision_authority.evidence,
        service_alignment_score: result.scores.service_alignment.score,
        service_alignment_evidence: result.scores.service_alignment.evidence,
        timing_signals_score: result.scores.timing_signals.score,
        timing_signals_evidence: result.scores.timing_signals.evidence,
        projected_mrr_conservative: result.projected_mrr.conservative,
        projected_mrr_target: result.projected_mrr.target,
        projected_mrr_stretch: result.projected_mrr.stretch,
        scored_by: "AI6_Engine"
      };

      if (existingScore) {
        await updateScoreMutation.mutateAsync({ id: existingScore.id, data: scoreData });
      } else {
        await createScoreMutation.mutateAsync(scoreData);
      }

      setScoringProgress(prev => ({ ...prev, current: i + 1 }));
    }

    setScoringProgress(prev => ({ ...prev, isRunning: false }));
    setSelectedLeads([]);
    queryClient.invalidateQueries({ queryKey: ['leadScores'] });
  };

  // Stats
  const stats = useMemo(() => {
    const scored = leadScores.length;
    const unscored = leads.length - scored;
    const tier1 = leadScores.filter(s => s.tier === 'Tier_1_Hot').length;
    const tier2 = leadScores.filter(s => s.tier === 'Tier_2_Warm').length;
    const tier3 = leadScores.filter(s => s.tier === 'Tier_3_Monitor').length;
    return { scored, unscored, tier1, tier2, tier3 };
  }, [leads, leadScores]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-red-500" />
            AI6 Scoring Engine
          </h1>
          <p className="text-slate-400 text-sm mt-1">7-dimension prospect scoring methodology</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="bg-slate-900/50 border-slate-800 p-4">
          <p className="text-slate-400 text-xs">Total Leads</p>
          <p className="text-2xl font-bold text-white">{leads.length}</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-4">
          <p className="text-slate-400 text-xs">Scored</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.scored}</p>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20 p-4">
          <p className="text-red-400 text-xs">🔥 Tier 1 Hot</p>
          <p className="text-2xl font-bold text-red-400">{stats.tier1}</p>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20 p-4">
          <p className="text-amber-400 text-xs">🌡️ Tier 2 Warm</p>
          <p className="text-2xl font-bold text-amber-400">{stats.tier2}</p>
        </Card>
        <Card className="bg-slate-500/10 border-slate-500/20 p-4">
          <p className="text-slate-400 text-xs">❄️ Tier 3 Monitor</p>
          <p className="text-2xl font-bold text-slate-400">{stats.tier3}</p>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-slate-900/50 border-slate-800 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Select value={ventureFilter} onValueChange={setVentureFilter}>
              <SelectTrigger className="w-[160px] bg-slate-800 border-slate-700 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ventures</SelectItem>
                <SelectItem value="Vance">Vance</SelectItem>
                <SelectItem value="Ball_in_the_6">Ball in the 6</SelectItem>
                <SelectItem value="Wear_US">Wear US</SelectItem>
                <SelectItem value="enuwWEB">enuwWEB</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Checkbox 
                checked={onlyUnscored}
                onCheckedChange={setOnlyUnscored}
                className="border-slate-600"
              />
              <span className="text-slate-300 text-sm">Show unscored only</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {scoringProgress.isRunning && (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                {scoringProgress.current} / {scoringProgress.total}
              </div>
            )}
            <Button
              onClick={runBatchScoring}
              disabled={selectedLeads.length === 0 || scoringProgress.isRunning}
              className="bg-red-500 hover:bg-red-600"
            >
              <Play className="w-4 h-4 mr-2" />
              Score {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-slate-600"
                />
              </TableHead>
              <TableHead className="text-slate-400">Company</TableHead>
              <TableHead className="text-slate-400">Industry</TableHead>
              <TableHead className="text-slate-400">Location</TableHead>
              <TableHead className="text-slate-400">Venture</TableHead>
              <TableHead className="text-slate-400 text-center">Score</TableHead>
              <TableHead className="text-slate-400 text-center">Tier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map(lead => {
              const score = scoreMap[lead.id];
              const ventureColor = VENTURE_COLORS[lead.venture] || "#3B82F6";

              return (
                <TableRow 
                  key={lead.id} 
                  className="border-slate-800 hover:bg-slate-800/30"
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => handleSelectLead(lead.id)}
                      className="border-slate-600"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-white">{lead.company_name}</TableCell>
                  <TableCell className="text-slate-300">{lead.industry}</TableCell>
                  <TableCell className="text-slate-400">{lead.city}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className="text-xs"
                      style={{ color: ventureColor, borderColor: ventureColor + '40' }}
                    >
                      {lead.venture?.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {score ? (
                      <span className={`font-semibold ${
                        score.overall_score >= 80 ? 'text-red-400' :
                        score.overall_score >= 60 ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {score.overall_score}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {score ? (
                      <Badge 
                        className={`text-xs ${
                          score.tier === 'Tier_1_Hot' ? 'bg-red-500/20 text-red-400' :
                          score.tier === 'Tier_2_Warm' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {score.tier === 'Tier_1_Hot' ? '🔥 Hot' :
                         score.tier === 'Tier_2_Warm' ? '🌡️ Warm' : '❄️ Monitor'}
                      </Badge>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredLeads.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-400">
              {onlyUnscored ? "All leads have been scored!" : "No leads found."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}