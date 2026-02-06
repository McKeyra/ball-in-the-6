import React, { useState, useMemo } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Users,
  Heart,
  AlertTriangle,
  XCircle,
  Eye,
  Play,
  ChevronUp,
  ChevronDown,
  Filter
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import VitalityRing from "@/components/dashboard/VitalityRing";
import {
  scoreTeamHealth,
  HEALTH_TIERS,
  getTierColor,
  getScoreColor
} from "@/components/scoring/teamHealthScoring";

// Tier badge component
function TierBadge({ tier }) {
  const tierStyles = {
    [HEALTH_TIERS.HEALTHY]: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    [HEALTH_TIERS.AT_RISK]: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    [HEALTH_TIERS.CRITICAL]: "bg-red-500/20 text-red-400 border-red-500/30"
  };

  const displayTier = tier === "At_Risk" ? "At Risk" : tier;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${tierStyles[tier] || tierStyles[HEALTH_TIERS.AT_RISK]}`}>
      {displayTier}
    </span>
  );
}

// Score indicator with color
function ScoreIndicator({ score, showColor = true }) {
  const color = getScoreColor(score);

  return (
    <div className="flex items-center gap-2">
      {showColor && (
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-white/90 font-medium">{score}</span>
    </div>
  );
}

// Mini vitality ring for table
function MiniVitalityRing({ score }) {
  const size = 32;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">{score}</span>
      </div>
    </div>
  );
}

// Sortable column header
function SortableHeader({ label, sortKey, currentSort, onSort }) {
  const isActive = currentSort.key === sortKey;
  const isAsc = currentSort.direction === 'asc';

  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-left text-white/60 hover:text-white/90 transition-colors font-medium text-sm"
    >
      {label}
      <span className="flex flex-col">
        <ChevronUp
          className={`w-3 h-3 -mb-1 ${isActive && isAsc ? 'text-[#c9a962]' : 'text-white/30'}`}
        />
        <ChevronDown
          className={`w-3 h-3 ${isActive && !isAsc ? 'text-[#c9a962]' : 'text-white/30'}`}
        />
      </span>
    </button>
  );
}

export default function TeamHealthDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [sortConfig, setSortConfig] = useState({ key: 'overall_score', direction: 'desc' });
  const [tierFilter, setTierFilter] = useState('all');
  const [scoringTeamId, setScoringTeamId] = useState(null);

  // Fetch teams
  const {
    data: teams = [],
    isLoading: teamsLoading,
    refetch: refetchTeams
  } = useQuery({
    queryKey: ['health-dashboard-teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  // Fetch team health scores
  const {
    data: healthScores = [],
    isLoading: scoresLoading,
    refetch: refetchScores
  } = useQuery({
    queryKey: ['health-dashboard-scores'],
    queryFn: () => base44.entities.TeamHealthScore.list('-created_at'),
  });

  // Create/update health score mutation
  const saveScoreMutation = useMutation({
    mutationFn: async ({ teamId, scoreData }) => {
      // Check if score exists for this team
      const existingScores = await base44.entities.TeamHealthScore.filter({ team_id: teamId });

      if (existingScores.length > 0) {
        // Update existing score
        return base44.entities.TeamHealthScore.update(existingScores[0].id, {
          ...scoreData,
          team_id: teamId,
          updated_at: new Date().toISOString()
        });
      } else {
        // Create new score
        return base44.entities.TeamHealthScore.create({
          ...scoreData,
          team_id: teamId,
          created_at: new Date().toISOString()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-dashboard-scores'] });
      setScoringTeamId(null);
    },
    onError: (error) => {
      console.error('Failed to save score:', error);
      setScoringTeamId(null);
    }
  });

  // Combine teams with their scores
  const teamsWithScores = useMemo(() => {
    return teams.map(team => {
      const existingScore = healthScores.find(s => s.team_id === team.id);

      if (existingScore) {
        return {
          ...team,
          healthScore: existingScore,
          overall_score: existingScore.overall_score || 0,
          payment_score: existingScore.payment_score || 0,
          engagement_score: existingScore.engagement_score || 0,
          retention_score: existingScore.retention_score || 0,
          tier: existingScore.tier || HEALTH_TIERS.AT_RISK
        };
      }

      // Calculate score on the fly if not saved
      const calculated = scoreTeamHealth(team);
      return {
        ...team,
        healthScore: null,
        overall_score: calculated.overall_score,
        payment_score: calculated.scores.payment_health.score,
        engagement_score: calculated.scores.engagement.score,
        retention_score: calculated.scores.retention.score,
        tier: calculated.tier
      };
    });
  }, [teams, healthScores]);

  // Filter by tier
  const filteredTeams = useMemo(() => {
    if (tierFilter === 'all') return teamsWithScores;
    return teamsWithScores.filter(t => t.tier === tierFilter);
  }, [teamsWithScores, tierFilter]);

  // Sort teams
  const sortedTeams = useMemo(() => {
    const sorted = [...filteredTeams].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle string comparisons
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      // Handle null/undefined
      if (aVal == null) aVal = sortConfig.direction === 'asc' ? Infinity : -Infinity;
      if (bVal == null) bVal = sortConfig.direction === 'asc' ? Infinity : -Infinity;

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredTeams, sortConfig]);

  // Summary counts
  const summary = useMemo(() => {
    return {
      total: teamsWithScores.length,
      healthy: teamsWithScores.filter(t => t.tier === HEALTH_TIERS.HEALTHY).length,
      atRisk: teamsWithScores.filter(t => t.tier === HEALTH_TIERS.AT_RISK).length,
      critical: teamsWithScores.filter(t => t.tier === HEALTH_TIERS.CRITICAL).length
    };
  }, [teamsWithScores]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Handle refresh
  const handleRefresh = () => {
    refetchTeams();
    refetchScores();
  };

  // Handle run scoring for a team
  const handleRunScoring = async (team) => {
    setScoringTeamId(team.id);

    const result = scoreTeamHealth(team);

    const scoreData = {
      overall_score: result.overall_score,
      tier: result.tier,
      confidence: result.confidence,
      payment_score: result.scores.payment_health.score,
      payment_evidence: result.scores.payment_health.evidence,
      engagement_score: result.scores.engagement.score,
      engagement_evidence: result.scores.engagement.evidence,
      retention_score: result.scores.retention.score,
      retention_evidence: result.scores.retention.evidence,
      roster_score: result.scores.roster_completeness.score,
      coach_activity_score: result.scores.coach_activity.score,
      parent_satisfaction_score: result.scores.parent_satisfaction.score,
      recommendations: JSON.stringify(result.recommendations)
    };

    saveScoreMutation.mutate({ teamId: team.id, scoreData });
  };

  const isLoading = teamsLoading || scoresLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-[#c9a962] animate-spin" />
          <div className="text-xl text-white/60">Loading team health data...</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (teams.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white/90 mb-2">Team Health Dashboard</h1>
              <p className="text-white/60">Monitor and manage team wellness across your organization</p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Empty State */}
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-3xl p-16 text-center">
            <Users className="w-24 h-24 mx-auto mb-6 text-white/20" />
            <h3 className="text-2xl font-bold text-white/80 mb-3">No Teams Found</h3>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              There are no teams in the system yet. Create teams to start monitoring their health scores.
            </p>
            <Button
              onClick={() => navigate(createPageUrl("CreateTeam"))}
              className="bg-[#c9a962] text-black hover:bg-[#d4b872] font-semibold px-6"
            >
              Create Your First Team
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white/90 mb-2">Team Health Dashboard</h1>
            <p className="text-white/60">Monitor and manage team wellness across your organization</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Teams"
            value={summary.total}
            icon={Users}
            color="blue"
          />
          <MetricCard
            title="Healthy Teams"
            value={summary.healthy}
            icon={Heart}
            color="green"
          />
          <MetricCard
            title="At Risk Teams"
            value={summary.atRisk}
            icon={AlertTriangle}
            color="orange"
          />
          <MetricCard
            title="Critical Teams"
            value={summary.critical}
            icon={XCircle}
            color="red"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-white/60">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter by Tier:</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: HEALTH_TIERS.HEALTHY, label: 'Healthy' },
              { value: HEALTH_TIERS.AT_RISK, label: 'At Risk' },
              { value: HEALTH_TIERS.CRITICAL, label: 'Critical' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setTierFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tierFilter === option.value
                    ? 'bg-[#c9a962] text-black'
                    : 'bg-white/[0.05] text-white/70 hover:bg-white/[0.1] border border-white/[0.06]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Team Health Table */}
        <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Team Name"
                      sortKey="team_name"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Division"
                      sortKey="division"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Overall Score"
                      sortKey="overall_score"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Payment"
                      sortKey="payment_score"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Engagement"
                      sortKey="engagement_score"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Retention"
                      sortKey="retention_score"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <SortableHeader
                      label="Tier"
                      sortKey="tier"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-white/60 font-medium text-sm">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((team, index) => (
                  <tr
                    key={team.id}
                    className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${
                      index % 2 === 0 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    {/* Team Name with Mini Vitality Ring */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <MiniVitalityRing score={team.overall_score} />
                        <div>
                          <p className="font-semibold text-white">{team.team_name}</p>
                          {team.coach_name && (
                            <p className="text-xs text-white/40">Coach: {team.coach_name}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Division */}
                    <td className="px-6 py-4">
                      <span className="text-white/70">{team.division || '-'}</span>
                    </td>

                    {/* Overall Score */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-12 h-2 rounded-full bg-white/10 overflow-hidden"
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${team.overall_score}%`,
                              backgroundColor: getScoreColor(team.overall_score)
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold w-8">{team.overall_score}</span>
                      </div>
                    </td>

                    {/* Payment Score */}
                    <td className="px-6 py-4">
                      <ScoreIndicator score={team.payment_score} />
                    </td>

                    {/* Engagement Score */}
                    <td className="px-6 py-4">
                      <ScoreIndicator score={team.engagement_score} showColor={false} />
                    </td>

                    {/* Retention Score */}
                    <td className="px-6 py-4">
                      <ScoreIndicator score={team.retention_score} showColor={false} />
                    </td>

                    {/* Tier Badge */}
                    <td className="px-6 py-4">
                      <TierBadge tier={team.tier} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(createPageUrl("TeamDetail") + `?id=${team.id}`)}
                          className="text-white/60 hover:text-white hover:bg-white/[0.1]"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRunScoring(team)}
                          disabled={scoringTeamId === team.id}
                          className="text-[#c9a962] hover:text-[#d4b872] hover:bg-[#c9a962]/10"
                        >
                          {scoringTeamId === team.id ? (
                            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4 mr-1" />
                          )}
                          Run Scoring
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No results after filtering */}
          {sortedTeams.length === 0 && (
            <div className="p-12 text-center">
              <Filter className="w-12 h-12 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">No teams match the selected filter</p>
              <button
                onClick={() => setTierFilter('all')}
                className="mt-4 text-[#c9a962] hover:underline text-sm"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between text-sm text-white/40">
          <p>Showing {sortedTeams.length} of {teams.length} teams</p>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
