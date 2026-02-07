import React, { useState, useMemo, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Globe, 
  MapPin,
  Building2,
  Calendar,
  Users,
  Star,
  Brain,
  RefreshCw,
  Edit,
  PlusCircle,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import VitalityRing from "../components/leads/VitalityRing";
import ScoreRadarChart from "../components/leads/ScoreRadarChart";
import ScoreDimensionTable from "../components/leads/ScoreDimensionTable";
import ActivityModal from "../components/leads/ActivityModal";
import ActivityTimeline from "../components/leads/ActivityTimeline";
import { scoreProspect, VENTURE_COLORS, TIER_COLORS, formatCurrency } from "../components/scoring/scoringUtils";

export default function LeadDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const leadId = urlParams.get('id');
  const queryClient = useQueryClient();
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [activityType, setActivityType] = useState(null);

  const { data: lead, isLoading: leadLoading } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => base44.entities.Lead.filter({ id: leadId }),
    select: (data) => data[0],
    enabled: !!leadId
  });

  const { data: existingScore, refetch: refetchScore } = useQuery({
    queryKey: ['leadScore', leadId],
    queryFn: () => base44.entities.LeadScore.filter({ lead_id: leadId }),
    select: (data) => data[0],
    enabled: !!leadId
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['activities', leadId],
    queryFn: () => base44.entities.Activity.filter({ lead_id: leadId }),
    enabled: !!leadId
  });

  const [calculatedScore, setCalculatedScore] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => setCurrentUser(user)).catch(() => {});
  }, []);

  const scoreMutation = useMutation({
    mutationFn: async (scoreData) => {
      if (existingScore) {
        return base44.entities.LeadScore.update(existingScore.id, scoreData);
      } else {
        return base44.entities.LeadScore.create(scoreData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadScore', leadId] });
      queryClient.invalidateQueries({ queryKey: ['leadScores'] });
    }
  });

  const activityMutation = useMutation({
    mutationFn: async (activityData) => {
      return base44.entities.Activity.create({
        lead_id: leadId,
        activity_type: activityType,
        subject: activityData.subject,
        description: activityData.description,
        outcome: activityData.outcome,
        next_action_date: activityData.follow_up_date || null,
        completed_by: currentUser?.email || "Unknown"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', leadId] });
      setActivityModalOpen(false);
    }
  });

  const handleRunScoring = () => {
    if (!lead) return;
    
    const result = scoreProspect(lead);
    setCalculatedScore(result);

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

    scoreMutation.mutate(scoreData);
  };

  // Use existing score or calculated score
  const displayScore = useMemo(() => {
    if (existingScore) {
      return {
        overall_score: existingScore.overall_score,
        tier: existingScore.tier,
        confidence: existingScore.confidence,
        scores: {
          industry_fit: { score: existingScore.industry_fit_score, evidence: existingScore.industry_fit_evidence },
          mrr_potential: { score: existingScore.mrr_potential_score, evidence: existingScore.mrr_potential_evidence },
          digital_maturity: { score: existingScore.digital_maturity_score, evidence: existingScore.digital_maturity_evidence },
          geographic_value: { score: existingScore.geographic_value_score, evidence: existingScore.geographic_value_evidence },
          decision_authority: { score: existingScore.decision_authority_score, evidence: existingScore.decision_authority_evidence },
          service_alignment: { score: existingScore.service_alignment_score, evidence: existingScore.service_alignment_evidence },
          timing_signals: { score: existingScore.timing_signals_score, evidence: existingScore.timing_signals_evidence }
        },
        projected_mrr: {
          conservative: existingScore.projected_mrr_conservative,
          target: existingScore.projected_mrr_target,
          stretch: existingScore.projected_mrr_stretch
        }
      };
    }
    return calculatedScore;
  }, [existingScore, calculatedScore]);

  const ventureColor = VENTURE_COLORS[lead?.venture] || "#3B82F6";
  const tierColor = TIER_COLORS[displayScore?.tier] || "#6B7280";

  const getTierLabel = (tier) => {
    if (tier === "Tier_1_Hot") return "🔥 TIER 1 (HOT)";
    if (tier === "Tier_2_Warm") return "🌡️ TIER 2 (WARM)";
    return "❄️ TIER 3 (MONITOR)";
  };

  if (leadLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] p-6">
        <p className="text-slate-400">Lead not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={createPageUrl("Leads")}>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{lead.company_name}</h1>
            <Badge 
              variant="outline"
              style={{ color: ventureColor, borderColor: ventureColor + '40' }}
            >
              {lead.venture?.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-slate-400 text-sm">{lead.industry} • {lead.city}, {lead.province}</p>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl("EditLead") + `?id=${leadId}`}>
            <Button variant="outline" className="border-slate-700 text-slate-300">
              <Edit className="w-4 h-4 mr-2" />
              Edit Lead
            </Button>
          </Link>
          <Button 
            onClick={handleRunScoring}
            disabled={scoreMutation.isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            <Brain className="w-4 h-4 mr-2" />
            {displayScore ? "Re-Score" : "Run AI6 Scoring"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lead Info */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h3 className="font-semibold text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              {lead.owner_name && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>{lead.owner_name}</span>
                </div>
              )}
              {lead.contact_email && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <a href={`mailto:${lead.contact_email}`} className="hover:text-blue-400 transition-colors">
                    {lead.contact_email}
                  </a>
                </div>
              )}
              {lead.contact_phone && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <a href={`tel:${lead.contact_phone}`} className="hover:text-blue-400 transition-colors">
                    {lead.contact_phone}
                  </a>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors truncate">
                    {lead.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>{lead.city}, {lead.province}</span>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h3 className="font-semibold text-white mb-4">Business Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Industry</span>
                <span className="text-white">{lead.industry}</span>
              </div>
              {lead.employee_count && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Employees</span>
                  <span className="text-white">{lead.employee_count}</span>
                </div>
              )}
              {lead.years_in_business && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Years in Business</span>
                  <span className="text-white">{lead.years_in_business}</span>
                </div>
              )}
              {lead.google_rating && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Google Rating</span>
                  <span className="text-white flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    {lead.google_rating} ({lead.google_review_count || 0} reviews)
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Lead Source</span>
                <span className="text-white">{lead.lead_source || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <Badge className="bg-slate-800 text-slate-300">{lead.status}</Badge>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h3 className="font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => {
                  setActivityType("Call");
                  setActivityModalOpen(true);
                }}
              >
                <Phone className="w-4 h-4 mr-2" /> Log Call
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => {
                  setActivityType("Email");
                  setActivityModalOpen(true);
                }}
              >
                <Mail className="w-4 h-4 mr-2" /> Send Email
              </Button>
              <Link to={createPageUrl("NewDeal") + `?leadId=${leadId}`}>
                <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800">
                  <PlusCircle className="w-4 h-4 mr-2" /> Create Deal
                </Button>
              </Link>
            </div>
          </Card>

          {/* Activity Timeline */}
          <ActivityTimeline activities={activities} />
        </div>

        {/* Right Column - Scoring */}
        <div className="lg:col-span-2 space-y-6">
          {displayScore ? (
            <>
              {/* Score Overview */}
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-lg">Lead Score: {lead.company_name}</h3>
                  <Badge style={{ backgroundColor: tierColor + '20', color: tierColor, borderColor: tierColor }}>
                    {getTierLabel(displayScore.tier)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Radar Chart */}
                  <div className="flex flex-col items-center">
                    <ScoreRadarChart scores={displayScore.scores} />
                  </div>

                  {/* Score Summary */}
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-2">OVERALL SCORE</p>
                      <VitalityRing score={displayScore.overall_score} size={140} />
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-slate-400 text-xs">CONFIDENCE</p>
                      <Badge className={`
                        ${displayScore.confidence === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
                          displayScore.confidence === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-500/20 text-slate-400'}
                      `}>
                        ● {displayScore.confidence}
                      </Badge>
                    </div>

                    <div className="text-center space-y-1 w-full max-w-[200px]">
                      <p className="text-slate-400 text-xs">PROJECTED MRR</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Conservative:</span>
                        <span className="text-white">${displayScore.projected_mrr?.conservative}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Target:</span>
                        <span className="text-emerald-400 font-semibold">${displayScore.projected_mrr?.target}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Stretch:</span>
                        <span className="text-white">${displayScore.projected_mrr?.stretch}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Dimension Breakdown */}
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <h3 className="font-semibold text-white mb-4">Dimension Breakdown</h3>
                <ScoreDimensionTable scores={displayScore.scores} />
              </Card>

              {/* Recommended Actions */}
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <h3 className="font-semibold text-white mb-4">Recommended Actions</h3>
                <div className="space-y-3">
                  {displayScore.tier === "Tier_1_Hot" && (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <span className="text-slate-300">Immediate outreach with industry-specific case study</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <span className="text-slate-300">Follow up with phone call within 24 hours</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <span className="text-slate-300">Consider promotional pricing for quick close</span>
                      </div>
                    </>
                  )}
                  {displayScore.scores?.decision_authority?.score < 70 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                      <span className="text-slate-300">Risk: May need to identify owner/decision maker before pitch</span>
                    </div>
                  )}
                </div>
              </Card>
            </>
          ) : (
            <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
              <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Lead Not Scored Yet</h3>
              <p className="text-slate-400 mb-6">Run the AI6 scoring engine to analyze this prospect's potential.</p>
              <Button 
                onClick={handleRunScoring}
                disabled={scoreMutation.isPending}
                className="bg-red-500 hover:bg-red-600"
              >
                <Brain className="w-4 h-4 mr-2" />
                Run AI6 Scoring
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        onSave={(data) => activityMutation.mutate(data)}
        activityType={activityType}
        leadEmail={lead?.contact_email || ""}
        isLoading={activityMutation.isPending}
      />
    </div>
  );
}