'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Filter } from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface Sponsor {
  id: string;
  name?: string;
  company_name?: string;
  stage: string;
  sponsor_type?: string;
  deal_value?: number;
  sponsorship_value?: number;
  probability?: number;
  contact_name?: string;
}

const STAGES = ['Discovery', 'Proposal', 'Negotiation', 'Contract', 'Closed_Won'];
const SPONSOR_TYPES = ['All', 'Title', 'Gold', 'Silver', 'Bronze', 'In_Kind', 'Media'];

const STAGE_PROBABILITY: Record<string, number> = {
  Discovery: 10,
  Proposal: 25,
  Negotiation: 50,
  Contract: 75,
  Closed_Won: 100,
};

const STAGE_COLORS: Record<string, string> = {
  Discovery: 'bg-blue-500/20 text-blue-400',
  Proposal: 'bg-purple-500/20 text-purple-400',
  Negotiation: 'bg-yellow-500/20 text-yellow-400',
  Contract: 'bg-emerald-500/20 text-emerald-400',
  Closed_Won: 'bg-green-500/20 text-green-400',
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function SponsorPipelinePage(): React.ReactElement {
  const [typeFilter, setTypeFilter] = useState('All');

  // TODO: Replace with API calls
  // const { data: sponsors = [], isLoading } = useQuery({ queryKey: ['sponsors'], queryFn: ... });
  const sponsors: Sponsor[] = [];
  const isLoading = false;

  const filteredSponsors = useMemo(() => {
    if (typeFilter === 'All') return sponsors;
    return sponsors.filter((s) => s.sponsor_type === typeFilter);
  }, [sponsors, typeFilter]);

  const sponsorsByStage = useMemo(() => {
    const grouped: Record<string, Sponsor[]> = {};
    STAGES.forEach((stage) => {
      grouped[stage] = filteredSponsors.filter((s) => s.stage === stage);
    });
    return grouped;
  }, [filteredSponsors]);

  const stageTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    STAGES.forEach((stage) => {
      totals[stage] = sponsorsByStage[stage].reduce((sum, s) => sum + (s.deal_value || s.sponsorship_value || 0), 0);
    });
    return totals;
  }, [sponsorsByStage]);

  const metrics = useMemo(() => {
    const activeSponsors = filteredSponsors.filter((s) => s.stage !== 'Closed_Won');
    const totalPipeline = activeSponsors.reduce((sum, s) => sum + (s.deal_value || s.sponsorship_value || 0), 0);
    const weightedPipeline = activeSponsors.reduce((sum, s) => {
      const prob = s.probability || STAGE_PROBABILITY[s.stage] || 10;
      return sum + ((s.deal_value || s.sponsorship_value || 0) * prob) / 100;
    }, 0);
    return { totalPipeline, weightedPipeline, sponsorCount: activeSponsors.length };
  }, [filteredSponsors]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 md:mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Sponsor Pipeline</h1>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            {metrics.sponsorCount} active sponsors &bull; {formatCurrency(metrics.totalPipeline)} pipeline &bull;{' '}
            {formatCurrency(metrics.weightedPipeline)} weighted
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full sm:w-[160px] bg-white/[0.05] border border-white/[0.06] text-white min-h-[44px] rounded-lg pl-9 pr-3"
            >
              {SPONSOR_TYPES.map((type) => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <Link href="/forms/sponsor-application" className="w-full sm:w-auto">
            <button className="bg-[#c9a962] hover:bg-[#b8944f] text-black font-medium min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Sponsor
            </button>
          </Link>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageSponsors = sponsorsByStage[stage] || [];
          const colorClass = STAGE_COLORS[stage] || 'bg-white/10 text-white/60';

          return (
            <div key={stage} className="min-w-[280px] flex-shrink-0">
              {/* Stage Header */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-white">{stage.replace(/_/g, ' ')}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
                    {stageSponsors.length}
                  </span>
                </div>
                <div className="text-xs text-white/40">
                  {formatCurrency(stageTotals[stage] || 0)} &bull; {STAGE_PROBABILITY[stage]}% prob
                </div>
                <div className="h-1 bg-white/[0.06] rounded-full mt-2">
                  <div
                    className="h-1 bg-[#c9a962] rounded-full transition-all"
                    style={{ width: `${STAGE_PROBABILITY[stage]}%` }}
                  />
                </div>
              </div>

              {/* Sponsor Cards */}
              <div className="space-y-2">
                {stageSponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-3 hover:border-white/[0.1] transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {sponsor.name || sponsor.company_name}
                      </h4>
                      {sponsor.sponsor_type && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/50 flex-shrink-0">
                          {sponsor.sponsor_type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#c9a962]">
                        {formatCurrency(sponsor.deal_value || sponsor.sponsorship_value || 0)}
                      </span>
                      <span className="text-xs text-white/40">
                        {sponsor.probability || STAGE_PROBABILITY[stage]}%
                      </span>
                    </div>
                    {sponsor.contact_name && (
                      <p className="text-xs text-white/30 mt-1 truncate">{sponsor.contact_name}</p>
                    )}
                  </div>
                ))}
                {stageSponsors.length === 0 && (
                  <div className="p-4 rounded-xl border border-dashed border-white/[0.06] text-center">
                    <p className="text-xs text-white/30">No sponsors</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sponsors.length === 0 && !isLoading && (
        <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-6 md:p-12 text-center mt-6 md:mt-8">
          <p className="text-white/60 mb-4 text-sm md:text-base">No sponsors in your pipeline yet.</p>
          <Link href="/forms/sponsor-application">
            <button className="bg-[#c9a962] hover:bg-[#b8944f] text-black font-medium min-h-[44px] px-4 py-2 rounded-lg flex items-center justify-center gap-2 mx-auto">
              <Plus className="w-4 h-4" /> Add Your First Sponsor
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
