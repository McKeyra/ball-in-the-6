'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SportsMeta {
  label: string;
  emoji: string;
}

interface TierConfig {
  label: string;
  color: string;
  badgeColor: string;
  range: string;
}

interface Pick {
  id: number;
  sport: string;
  league: string;
  matchup: string;
  pick: string;
  confidence: number;
  odds: string;
  status: string;
  time: string;
  analysis: string;
}

const SPORTS_META: Record<string, SportsMeta> = {
  nba: { label: 'NBA', emoji: '\u{1F3C0}' },
  nfl: { label: 'NFL', emoji: '\u{1F3C8}' },
  mlb: { label: 'MLB', emoji: '\u26BE' },
  nhl: { label: 'NHL', emoji: '\u{1F3D2}' },
  soccer: { label: 'Soccer', emoji: '\u26BD' },
  ncaab: { label: 'NCAAB', emoji: '\u{1F3C0}' },
  ncaaf: { label: 'NCAAF', emoji: '\u{1F3C8}' },
  mma: { label: 'MMA', emoji: '\u{1F94A}' },
  tennis: { label: 'Tennis', emoji: '\u{1F3BE}' },
  golf: { label: 'Golf', emoji: '\u26F3' },
  esports: { label: 'Esports', emoji: '\u{1F3AE}' },
};

const TIER_CONFIG: Record<string, TierConfig> = {
  top: { label: 'Top Picks', color: 'border-[#C9A92C]/30 bg-[#C9A92C]/5', badgeColor: 'bg-[#C9A92C]/20 text-[#C9A92C]', range: '85%+' },
  value: { label: 'Value Picks', color: 'border-emerald-500/30 bg-emerald-500/5', badgeColor: 'bg-emerald-500/20 text-emerald-400', range: '70-84%' },
  lean: { label: 'Leans', color: 'border-blue-500/30 bg-blue-500/5', badgeColor: 'bg-blue-500/20 text-blue-400', range: '60-69%' },
};

const MOCK_PICKS: Pick[] = [
  { id: 1, sport: 'nba', league: 'NBA', matchup: 'Toronto Raptors vs Boston Celtics', pick: 'TOR +6.5', confidence: 92, odds: '-110', status: 'published', time: '7:30 PM ET', analysis: 'Strong ATS trend at home, Celtics 2-5 ATS as road favorites of 6+.' },
  { id: 2, sport: 'nba', league: 'NBA', matchup: 'LA Lakers vs Golden State Warriors', pick: 'Over 228.5', confidence: 88, odds: '-105', status: 'published', time: '10:00 PM ET', analysis: 'Both teams playing at top-5 pace, combined 240+ PPG in last 3 H2H.' },
  { id: 3, sport: 'nba', league: 'NBA', matchup: 'Milwaukee Bucks vs Miami Heat', pick: 'MIL -4.5', confidence: 86, odds: '-110', status: 'published', time: '8:00 PM ET', analysis: 'Giannis dominant in Miami historically, Bucks 8-2 ATS last 10 H2H.' },
  { id: 4, sport: 'nfl', league: 'NFL', matchup: 'Kansas City Chiefs vs Buffalo Bills', pick: 'Under 47.5', confidence: 83, odds: '-110', status: 'published', time: '4:25 PM ET', analysis: 'Defensive chess match, both teams allow under 20 PPG last month.' },
  { id: 5, sport: 'nba', league: 'NBA', matchup: 'Denver Nuggets vs Phoenix Suns', pick: 'DEN ML', confidence: 80, odds: '-130', status: 'published', time: '9:30 PM ET', analysis: 'Jokic averaging a triple-double in PHX, Nuggets 7-1 straight up last 8.' },
  { id: 6, sport: 'mlb', league: 'MLB', matchup: 'NY Yankees vs Boston Red Sox', pick: 'NYY -1.5', confidence: 78, odds: '+120', status: 'published', time: '7:05 PM ET', analysis: 'Yankees ace on mound, Red Sox bullpen ERA 5.2+ this month.' },
  { id: 7, sport: 'nhl', league: 'NHL', matchup: 'Toronto Maple Leafs vs Montreal Canadiens', pick: 'TOR ML', confidence: 75, odds: '-155', status: 'published', time: '7:00 PM ET', analysis: 'Rivalry game but talent gap is massive, Leafs 6-0 last 6 at home vs MTL.' },
  { id: 8, sport: 'nba', league: 'NBA', matchup: 'Cleveland Cavaliers vs Indiana Pacers', pick: 'CLE -3', confidence: 72, odds: '-110', status: 'published', time: '7:00 PM ET', analysis: 'Cavs elite defense limits IND pace, CLE 5-1 ATS last 6.' },
  { id: 9, sport: 'soccer', league: 'EPL', matchup: 'Arsenal vs Manchester City', pick: 'Under 2.5 Goals', confidence: 68, odds: '+100', status: 'published', time: '12:30 PM ET', analysis: 'Title race match, both managers will be conservative. Last 4 H2H averaged 1.75 goals.' },
  { id: 10, sport: 'nba', league: 'NBA', matchup: 'OKC Thunder vs Minnesota T-Wolves', pick: 'OKC -2.5', confidence: 65, odds: '-105', status: 'draft', time: '8:00 PM ET', analysis: 'SGA in MVP form, Thunder elite at home this season.' },
  { id: 11, sport: 'ncaab', league: 'NCAAB', matchup: 'Duke vs North Carolina', pick: 'Duke -4', confidence: 62, odds: '-110', status: 'published', time: '6:00 PM ET', analysis: 'Rivalry game variance, but Duke talent edge and home court strong.' },
  { id: 12, sport: 'mma', league: 'UFC', matchup: 'Oliveira vs Gaethje', pick: 'Oliveira by Sub', confidence: 60, odds: '+150', status: 'draft', time: '10:00 PM ET', analysis: 'Oliveira submission threat too dangerous, Gaethje vulnerable on the ground.' },
];

function getTier(confidence: number): string {
  if (confidence >= 85) return 'top';
  if (confidence >= 70) return 'value';
  return 'lean';
}

function PickCard({ pick }: { pick: Pick }): React.ReactElement {
  const tier = getTier(pick.confidence);
  const config = TIER_CONFIG[tier];
  const sportMeta = SPORTS_META[pick.sport] || { label: pick.sport, emoji: '' };

  return (
    <div className={cn('rounded-xl border transition-all hover:border-opacity-60 p-3', config.color)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{sportMeta.emoji}</span>
          <span className="text-[10px] text-neutral-500 font-medium">{pick.league}</span>
          <span className="text-[10px] text-neutral-600">{pick.time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', config.badgeColor)}>
            {pick.confidence}%
          </span>
          {pick.status === 'draft' && (
            <span className="text-[9px] bg-neutral-700 text-neutral-400 px-1 py-0.5 rounded">DRAFT</span>
          )}
        </div>
      </div>

      <h3 className="text-xs text-white font-medium mb-1">{pick.matchup}</h3>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold text-white bg-neutral-800 px-2 py-0.5 rounded">
          {pick.pick}
        </span>
        <span className="text-[10px] text-neutral-500">({pick.odds})</span>
      </div>

      <p className="text-[10px] text-neutral-400 leading-relaxed">{pick.analysis}</p>
    </div>
  );
}

export function PicksView(): React.ReactElement {
  const [sportFilter, setSportFilter] = useState('all');

  const picks = MOCK_PICKS;

  const filteredPicks = useMemo(() => {
    const filtered = sportFilter === 'all' ? picks : picks.filter((p) => p.sport === sportFilter);
    return filtered.sort((a, b) => b.confidence - a.confidence);
  }, [picks, sportFilter]);

  const tieredPicks = useMemo(() => {
    return {
      top: filteredPicks.filter((p) => p.confidence >= 85),
      value: filteredPicks.filter((p) => p.confidence >= 70 && p.confidence < 85),
      lean: filteredPicks.filter((p) => p.confidence >= 60 && p.confidence < 70),
    };
  }, [filteredPicks]);

  const activeSports = useMemo(() => {
    const sportSet = new Set(picks.map((p) => p.sport));
    return ['all', ...Array.from(sportSet)];
  }, [picks]);

  return (
    <div className="max-w-lg mx-auto space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Today&apos;s Picks</h1>
        <span className="text-xs text-neutral-500">{filteredPicks.length} picks</span>
      </div>

      {/* Sport Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {activeSports.map((sport) => (
          <button
            key={sport}
            onClick={() => setSportFilter(sport)}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1',
              sportFilter === sport ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700',
            )}
          >
            {sport !== 'all' && <span className="text-sm">{SPORTS_META[sport]?.emoji}</span>}
            {sport === 'all' ? 'All Sports' : SPORTS_META[sport]?.label || sport}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {Object.entries(tieredPicks).map(([tier, tierPicks]) => {
          if (tierPicks.length === 0) return null;
          const config = TIER_CONFIG[tier];
          return (
            <div key={tier}>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-semibold text-white">{config.label}</h2>
                <span className="text-[10px] text-neutral-600">({config.range})</span>
                <span className="text-[10px] text-neutral-500 ml-auto">{tierPicks.length} picks</span>
              </div>
              <div className="space-y-2">
                {tierPicks.map((pick) => (
                  <PickCard key={pick.id} pick={pick} />
                ))}
              </div>
            </div>
          );
        })}

        {filteredPicks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500 text-sm">No picks for this sport today.</p>
          </div>
        )}
      </div>
    </div>
  );
}
