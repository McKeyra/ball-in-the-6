'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SportsMeta {
  label: string;
  emoji: string;
}

interface Recommendation {
  pick: string;
  odds: string;
  units: number;
}

interface Report {
  id: number;
  matchup: string;
  sport: string;
  confidence: number;
  gameTime: string;
  venue: string;
  overview: string;
  keyFactors: string[];
  prediction: string;
  recommendation: Recommendation;
}

const SPORTS_META: Record<string, SportsMeta> = {
  nba: { label: 'NBA', emoji: '\u{1F3C0}' },
  nfl: { label: 'NFL', emoji: '\u{1F3C8}' },
  mlb: { label: 'MLB', emoji: '\u26BE' },
  nhl: { label: 'NHL', emoji: '\u{1F3D2}' },
  soccer: { label: 'Soccer', emoji: '\u26BD' },
};

const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    matchup: 'Toronto Raptors vs Boston Celtics',
    sport: 'nba',
    confidence: 92,
    gameTime: '7:30 PM ET',
    venue: 'Scotiabank Arena',
    overview: 'The Raptors host the Celtics in a pivotal Eastern Conference matchup. Toronto has been playing inspired basketball at home, going 8-2 in their last 10. Boston comes in on a 5-game win streak but has struggled against the spread as road favorites of 6 or more points.',
    keyFactors: [
      'Raptors 8-2 at home last 10 games',
      'Celtics 2-5 ATS as road favorites of 6+',
      'Scottie Barnes averaging 28.4 PPG last 5 games',
      'Boston back-to-back, played in NY last night',
      'TOR bench outscoring opponents bench by 12 PPG this month',
    ],
    prediction: 'Raptors cover the spread and keep this game within 3-4 points. The fatigue factor for Boston on a back-to-back is significant. Scottie Barnes continues his breakout stretch.',
    recommendation: { pick: 'TOR +6.5', odds: '-110', units: 2 },
  },
  {
    id: 2,
    matchup: 'LA Lakers vs Golden State Warriors',
    sport: 'nba',
    confidence: 88,
    gameTime: '10:00 PM ET',
    venue: 'Chase Center',
    overview: 'A marquee West Coast matchup between LeBron\'s Lakers and Curry\'s Warriors. Both teams are playing at a top-5 pace this season and have combined for 240+ points in their last 3 head-to-head meetings.',
    keyFactors: [
      'Combined 240+ PPG in last 3 H2H matchups',
      'Both teams top-5 in pace this season',
      'Curry shooting 45% from three last 10 games',
      'Lakers allowing 118 PPG on the road',
      'Over is 7-3 in last 10 LAL-GSW games',
    ],
    prediction: 'High-scoring affair as neither team can consistently stop the other. Both stars will want to put on a show in this nationally televised game.',
    recommendation: { pick: 'Over 228.5', odds: '-105', units: 1.5 },
  },
  {
    id: 3,
    matchup: 'Kansas City Chiefs vs Buffalo Bills',
    sport: 'nfl',
    confidence: 83,
    gameTime: '4:25 PM ET',
    venue: 'Highmark Stadium',
    overview: 'A defensive slugfest is expected in this AFC rivalry rematch. Both teams have elite defensive units and tend to play conservatively in cold weather January games.',
    keyFactors: [
      'Both defenses allowing under 20 PPG last month',
      'Cold weather forecast (22\u00B0F, winds 15mph)',
      'Under is 6-2 in last 8 KC-BUF meetings',
      'Mahomes interception rate up 40% in cold weather',
      'Bills run-heavy approach in home playoff games',
    ],
    prediction: 'Defensive game plan from both coaches. The weather suppresses the passing game, leading to a grinding, low-scoring affair.',
    recommendation: { pick: 'Under 47.5', odds: '-110', units: 1 },
  },
  {
    id: 4,
    matchup: 'Arsenal vs Manchester City',
    sport: 'soccer',
    confidence: 68,
    gameTime: '12:30 PM ET',
    venue: 'Emirates Stadium',
    overview: 'Title race showdown at the Emirates. Arteta and Guardiola will both approach this tactically, knowing a loss could be season-defining. Recent meetings have been tight, defensive affairs.',
    keyFactors: [
      'Last 4 H2H averaged just 1.75 goals',
      'Arsenal conceding 0.7 goals per game at home',
      'City missing key midfielders due to injury',
      'Both managers historically conservative in big matches',
      'Title implications mean neither team will overcommit',
    ],
    prediction: 'Expect a cagey, tactical battle with few clear-cut chances. One goal could decide this match.',
    recommendation: { pick: 'Under 2.5 Goals', odds: '+100', units: 1 },
  },
];

function ReportCard({ report }: { report: Report }): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const sportMeta = SPORTS_META[report.sport] || { label: report.sport, emoji: '' };

  return (
    <div
      className={cn(
        'bg-neutral-900/80 border border-neutral-800 rounded-xl cursor-pointer transition-all',
        'hover:border-neutral-700',
        expanded && 'border-red-600/30',
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">{sportMeta.emoji}</span>
            <span className="text-[10px] text-neutral-500">{sportMeta.label}</span>
          </div>
          <span className={cn(
            'text-[10px] font-bold px-1.5 py-0.5 rounded',
            report.confidence >= 85 ? 'bg-[#C9A92C]/20 text-[#C9A92C]' :
            report.confidence >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
            'bg-blue-500/20 text-blue-400',
          )}>
            {report.confidence}%
          </span>
        </div>

        <h3 className="text-sm text-white font-semibold mb-1">{report.matchup}</h3>
        <div className="flex items-center gap-3 text-[10px] text-neutral-500">
          <span>{report.gameTime}</span>
          <span>{report.venue}</span>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-neutral-800 space-y-4">
            {/* Overview */}
            <div>
              <h4 className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider mb-1.5">Matchup Overview</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">{report.overview}</p>
            </div>

            {/* Key Factors */}
            <div>
              <h4 className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider mb-1.5">Key Factors</h4>
              <ul className="space-y-1">
                {report.keyFactors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                    <span className="text-red-500 mt-0.5 shrink-0">*</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prediction */}
            <div>
              <h4 className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider mb-1.5">Prediction</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">{report.prediction}</p>
            </div>

            {/* Recommendation */}
            <div className="bg-neutral-800/50 rounded-lg p-3">
              <h4 className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider mb-2">Betting Recommendation</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white bg-red-600/20 border border-red-600/30 px-2.5 py-1 rounded">
                    {report.recommendation.pick}
                  </span>
                  <span className="text-xs text-neutral-400">({report.recommendation.odds})</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#C9A92C] font-bold">
                    {report.recommendation.units}u
                  </span>
                  <p className="text-[9px] text-neutral-600">Recommended</p>
                </div>
              </div>
            </div>

            <p className="text-[8px] text-neutral-700 italic">
              AI-generated pregame analysis. Past performance does not guarantee future results. Gamble responsibly.
            </p>
          </div>
        )}

        {!expanded && (
          <p className="text-[10px] text-neutral-600 mt-2">Tap to expand full analysis</p>
        )}
      </div>
    </div>
  );
}

export function ReportsView(): React.ReactElement {
  const reports = MOCK_REPORTS;

  return (
    <div className="max-w-lg mx-auto space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Pregame Reports</h1>
        <span className="text-xs text-neutral-500">{reports.length} reports</span>
      </div>

      <p className="text-xs text-neutral-500">
        Detailed AI-powered pregame analysis with key factors and recommendations.
      </p>

      <div className="space-y-3">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
