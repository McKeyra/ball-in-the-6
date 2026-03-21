'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
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
  Filter,
} from 'lucide-react';

/* ---------- Types ---------- */
const HEALTH_TIERS = { HEALTHY: 'Healthy', AT_RISK: 'At_Risk', CRITICAL: 'Critical' } as const;
type HealthTier = (typeof HEALTH_TIERS)[keyof typeof HEALTH_TIERS];

interface TeamWithScore {
  id: string;
  team_name: string;
  division?: string;
  coach_name?: string;
  overall_score: number;
  payment_score: number;
  engagement_score: number;
  retention_score: number;
  tier: HealthTier;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

/* ---------- Sub-components ---------- */
function TierBadge({ tier }: { tier: HealthTier }): React.ReactElement {
  const tierStyles: Record<string, string> = {
    Healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    At_Risk: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const displayTier = tier === 'At_Risk' ? 'At Risk' : tier;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${tierStyles[tier] || tierStyles.At_Risk}`}>
      {displayTier}
    </span>
  );
}

function MiniVitalityRing({ score }: { score: number }): React.ReactElement {
  const size = 32;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">{score}</span>
      </div>
    </div>
  );
}

/* ---------- Component ---------- */
export function TeamHealthDashboardPage(): React.ReactElement {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'overall_score', direction: 'desc' });
  const [tierFilter, setTierFilter] = useState('all');

  const { data: teams = [], isLoading } = useQuery<TeamWithScore[]>({
    queryKey: ['teams-health'],
    queryFn: async () => {
      const res = await fetch('/api/teams?sport=basketball');
      if (!res.ok) throw new Error('Failed to fetch teams');
      const rawTeams = await res.json() as Record<string, unknown>[];
      return rawTeams.map((t) => ({
        id: String(t.id ?? ''),
        team_name: String(t.name ?? t.team_name ?? ''),
        division: t.division ? String(t.division) : undefined,
        coach_name: t.coach_name ? String(t.coach_name) : undefined,
        overall_score: 75,
        payment_score: 80,
        engagement_score: 70,
        retention_score: 75,
        tier: 'Healthy' as HealthTier,
      }));
    },
  });

  const filteredTeams = useMemo(() => {
    if (tierFilter === 'all') return teams;
    return teams.filter((t) => t.tier === tierFilter);
  }, [teams, tierFilter]);

  const sortedTeams = useMemo(() => {
    return [...filteredTeams].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortConfig.key];
      const bVal = (b as unknown as Record<string, unknown>)[sortConfig.key];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredTeams, sortConfig]);

  const summary = useMemo(() => ({
    total: teams.length,
    healthy: teams.filter((t) => t.tier === HEALTH_TIERS.HEALTHY).length,
    atRisk: teams.filter((t) => t.tier === HEALTH_TIERS.AT_RISK).length,
    critical: teams.filter((t) => t.tier === HEALTH_TIERS.CRITICAL).length,
  }), [teams]);

  const handleSort = (key: string): void => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

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

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 mb-1 md:mb-2">Team Health Dashboard</h1>
            <p className="text-sm md:text-base text-white/60">Monitor and manage team wellness across your organization</p>
          </div>
          <button className="bg-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.1] min-h-[44px] px-4 rounded-md flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {[
            { title: 'Total Teams', value: summary.total, icon: Users, color: 'text-blue-400' },
            { title: 'Healthy', value: summary.healthy, icon: Heart, color: 'text-green-400' },
            { title: 'At Risk', value: summary.atRisk, icon: AlertTriangle, color: 'text-orange-400' },
            { title: 'Critical', value: summary.critical, icon: XCircle, color: 'text-red-400' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-4 md:p-6">
                <Icon className={`w-6 h-6 md:w-8 md:h-8 ${card.color} mb-2 md:mb-3`} />
                <p className="text-2xl md:text-3xl font-bold text-white">{card.value}</p>
                <p className="text-xs md:text-sm text-white/40">{card.title}</p>
              </div>
            );
          })}
        </div>

        {/* Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 text-white/60">
            <Filter className="w-4 h-4" />
            <span className="text-xs md:text-sm font-medium">Filter by Tier:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: HEALTH_TIERS.HEALTHY, label: 'Healthy' },
              { value: HEALTH_TIERS.AT_RISK, label: 'At Risk' },
              { value: HEALTH_TIERS.CRITICAL, label: 'Critical' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTierFilter(option.value)}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all min-h-[44px] ${
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

        {/* Table */}
        <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left">
                    <button onClick={() => handleSort('team_name')} className="flex items-center gap-1 text-white/60 hover:text-white/90 font-medium text-sm">
                      Team Name
                      <span className="flex flex-col">
                        <ChevronUp className={`w-3 h-3 -mb-1 ${sortConfig.key === 'team_name' && sortConfig.direction === 'asc' ? 'text-[#c9a962]' : 'text-white/30'}`} />
                        <ChevronDown className={`w-3 h-3 ${sortConfig.key === 'team_name' && sortConfig.direction === 'desc' ? 'text-[#c9a962]' : 'text-white/30'}`} />
                      </span>
                    </button>
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left">
                    <button onClick={() => handleSort('overall_score')} className="flex items-center gap-1 text-white/60 hover:text-white/90 font-medium text-sm">
                      Score
                    </button>
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left">
                    <span className="text-white/60 font-medium text-sm">Tier</span>
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left">
                    <span className="text-white/60 font-medium text-sm">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((team, index) => (
                  <tr
                    key={team.id}
                    className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${index % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <MiniVitalityRing score={team.overall_score} />
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm md:text-base truncate">{team.team_name}</p>
                          {team.coach_name && <p className="text-[10px] md:text-xs text-white/40 truncate">Coach: {team.coach_name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 md:w-12 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${team.overall_score}%`, backgroundColor: getScoreColor(team.overall_score) }} />
                        </div>
                        <span className="text-white font-semibold text-sm">{team.overall_score}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <TierBadge tier={team.tier} />
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <Link
                        href={`/teams/${team.id}`}
                        className="text-white/60 hover:text-white hover:bg-white/[0.1] min-h-[44px] min-w-[44px] px-2 md:px-3 inline-flex items-center gap-1 rounded"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden md:inline">View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedTeams.length === 0 && (
            <div className="p-8 md:p-12 text-center">
              <Filter className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 text-sm md:text-base">
                {teams.length === 0 ? 'No teams found. Create teams to start monitoring.' : 'No teams match the selected filter'}
              </p>
              {tierFilter !== 'all' && (
                <button onClick={() => setTierFilter('all')} className="mt-4 text-[#c9a962] hover:underline text-sm min-h-[44px]">
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm text-white/40">
          <p>Showing {sortedTeams.length} of {teams.length} teams</p>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
