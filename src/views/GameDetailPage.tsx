'use client';

import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowLeft, MapPin, Share2, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { Scoreboard } from '@/components/games/Scoreboard';
import { BoxScore } from '@/components/games/BoxScore';
import { PlayByPlay } from '@/components/games/PlayByPlay';
import { GameInsights } from '@/components/games/GameInsights';

/* ------------------------------------------------------------------ */
/*  Mock Data — Full game detail for game-001 (B.M.T. Titans vs       */
/*  Scarborough Elite, live Q3)                                       */
/* ------------------------------------------------------------------ */

const GAME_DETAIL = {
  id: 'game-001',
  status: 'live' as const,
  venue: 'Pan Am Centre, Scarborough',
  period: 'Q3',
  gameClock: '4:22',
  homeTeam: {
    name: 'Scarborough Elite',
    color: '#64748b',
    score: 48,
    record: '8-6',
    quarterScores: [14, 18, 16, 0],
  },
  awayTeam: {
    name: 'B.M.T. Titans',
    color: '#f97316',
    score: 54,
    record: '12-2',
    quarterScores: [18, 20, 16, 0],
  },
};

const HOME_PLAYERS = [
  { name: 'Devon Clarke', number: '3', min: 28, pts: 14, reb: 3, ast: 5, stl: 2, blk: 0, fgPct: 54 },
  { name: 'Isaiah Murray', number: '7', min: 26, pts: 12, reb: 6, ast: 2, stl: 1, blk: 2, fgPct: 46 },
  { name: 'Kyle Edwards', number: '11', min: 24, pts: 8, reb: 8, ast: 1, stl: 0, blk: 3, fgPct: 40 },
  { name: 'Andre Williams', number: '14', min: 22, pts: 6, reb: 2, ast: 4, stl: 3, blk: 0, fgPct: 37 },
  { name: 'Tremaine Harris', number: '21', min: 20, pts: 4, reb: 1, ast: 3, stl: 1, blk: 0, fgPct: 33 },
  { name: 'Jamal Brooks', number: '24', min: 14, pts: 2, reb: 4, ast: 0, stl: 0, blk: 1, fgPct: 25 },
  { name: 'Darius King', number: '30', min: 10, pts: 2, reb: 1, ast: 1, stl: 0, blk: 0, fgPct: 50 },
  { name: 'Chris Joseph', number: '33', min: 8, pts: 0, reb: 2, ast: 0, stl: 1, blk: 0, fgPct: 0 },
  { name: 'Nathan Grant', number: '5', min: 6, pts: 0, reb: 0, ast: 1, stl: 0, blk: 0, fgPct: 0 },
  { name: 'Marcus Lee', number: '42', min: 4, pts: 0, reb: 1, ast: 0, stl: 0, blk: 0, fgPct: 0 },
];

const AWAY_PLAYERS = [
  { name: 'Caleb Smith', number: '1', min: 30, pts: 18, reb: 4, ast: 2, stl: 1, blk: 0, fgPct: 58 },
  { name: 'Jordan Blake', number: '5', min: 28, pts: 12, reb: 2, ast: 6, stl: 2, blk: 0, fgPct: 50 },
  { name: 'Tyrell Davis', number: '10', min: 26, pts: 10, reb: 7, ast: 1, stl: 0, blk: 2, fgPct: 44 },
  { name: 'Malik Thompson', number: '15', min: 24, pts: 6, reb: 3, ast: 3, stl: 1, blk: 1, fgPct: 42 },
  { name: 'Kareem Ali', number: '20', min: 20, pts: 4, reb: 5, ast: 0, stl: 0, blk: 2, fgPct: 33 },
  { name: 'DeShawn Moore', number: '22', min: 14, pts: 2, reb: 1, ast: 2, stl: 1, blk: 0, fgPct: 28 },
  { name: 'Alex Chen', number: '8', min: 12, pts: 2, reb: 2, ast: 1, stl: 0, blk: 0, fgPct: 50 },
  { name: 'Ryan Persaud', number: '34', min: 8, pts: 0, reb: 3, ast: 0, stl: 0, blk: 1, fgPct: 0 },
  { name: 'Jaiden Scott', number: '12', min: 6, pts: 0, reb: 0, ast: 1, stl: 1, blk: 0, fgPct: 0 },
  { name: 'Omar Hassan', number: '44', min: 4, pts: 0, reb: 1, ast: 0, stl: 0, blk: 0, fgPct: 0 },
];

const PLAY_EVENTS = [
  { id: 'ev-01', type: 'quarter_start' as const, time: '12:00', period: 'Q1', description: 'Start of Q1' },
  { id: 'ev-02', type: 'score' as const, time: '11:34', period: 'Q1', description: 'Caleb Smith drives to the basket for the layup.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316', scoreAfter: { away: 2, home: 0 } },
  { id: 'ev-03', type: 'score' as const, time: '11:08', period: 'Q1', description: 'Devon Clarke pulls up from three. Swish.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b', scoreAfter: { away: 2, home: 3 } },
  { id: 'ev-04', type: 'foul' as const, time: '10:45', period: 'Q1', description: 'Shooting foul on Kyle Edwards. Two free throws for Jordan Blake.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b' },
  { id: 'ev-05', type: 'score' as const, time: '10:42', period: 'Q1', description: 'Jordan Blake makes both free throws.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316', scoreAfter: { away: 4, home: 3 } },
  { id: 'ev-06', type: 'score' as const, time: '9:56', period: 'Q1', description: 'Tyrell Davis with the putback dunk off the offensive rebound!', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316', scoreAfter: { away: 6, home: 3 } },
  { id: 'ev-07', type: 'timeout' as const, time: '9:30', period: 'Q1', description: 'Scarborough Elite calls a full timeout.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b' },
  { id: 'ev-08', type: 'score' as const, time: '9:12', period: 'Q1', description: 'Isaiah Murray catches and shoots the mid-range jumper.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b', scoreAfter: { away: 6, home: 5 } },
  { id: 'ev-09', type: 'substitution' as const, time: '8:30', period: 'Q1', description: 'DeShawn Moore checks in for Malik Thompson.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316' },
  { id: 'ev-10', type: 'score' as const, time: '7:48', period: 'Q1', description: 'Caleb Smith step-back three from the wing. Nothing but net.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316', scoreAfter: { away: 9, home: 5 } },
  { id: 'ev-11', type: 'score' as const, time: '7:15', period: 'Q1', description: 'Andre Williams finds Devon Clarke for the alley-oop!', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b', scoreAfter: { away: 9, home: 7 } },
  { id: 'ev-12', type: 'foul' as const, time: '6:42', period: 'Q1', description: 'Offensive foul on Tyrell Davis. Turnover.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316' },
  { id: 'ev-13', type: 'score' as const, time: '6:10', period: 'Q1', description: 'Kyle Edwards with the hook shot in the paint.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b', scoreAfter: { away: 9, home: 9 } },
  { id: 'ev-14', type: 'score' as const, time: '5:33', period: 'Q1', description: 'Jordan Blake crossover into a floater. Tough shot.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316', scoreAfter: { away: 11, home: 9 } },
  { id: 'ev-15', type: 'quarter_end' as const, time: '0:00', period: 'Q1', description: 'End of Q1 \u2014 Titans 18, Elite 14' },
  { id: 'ev-16', type: 'quarter_start' as const, time: '12:00', period: 'Q2', description: 'Start of Q2' },
  { id: 'ev-17', type: 'score' as const, time: '11:20', period: 'Q2', description: 'Caleb Smith catches fire with another three-pointer.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316', scoreAfter: { away: 21, home: 14 } },
  { id: 'ev-18', type: 'timeout' as const, time: '10:50', period: 'Q2', description: 'B.M.T. Titans call a 20-second timeout.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316' },
  { id: 'ev-19', type: 'score' as const, time: '10:05', period: 'Q2', description: 'Isaiah Murray drives and finishes through contact. And one!', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b', scoreAfter: { away: 21, home: 17 } },
  { id: 'ev-20', type: 'substitution' as const, time: '9:30', period: 'Q2', description: 'Jamal Brooks enters for Tremaine Harris.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b' },
  { id: 'ev-21', type: 'score' as const, time: '8:45', period: 'Q2', description: 'Kareem Ali with the putback after the offensive board.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316', scoreAfter: { away: 23, home: 17 } },
  { id: 'ev-22', type: 'foul' as const, time: '7:55', period: 'Q2', description: 'Flagrant-1 on Kareem Ali. Hard foul on Devon Clarke.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316' },
  { id: 'ev-23', type: 'score' as const, time: '7:52', period: 'Q2', description: 'Devon Clarke makes both flagrant free throws.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b', scoreAfter: { away: 23, home: 19 } },
  { id: 'ev-24', type: 'score' as const, time: '6:30', period: 'Q2', description: 'Andre Williams pull-up jumper from the elbow.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b', scoreAfter: { away: 23, home: 21 } },
  { id: 'ev-25', type: 'score' as const, time: '5:10', period: 'Q2', description: 'Jordan Blake no-look pass to Tyrell Davis for the slam!', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316', scoreAfter: { away: 25, home: 21 } },
  { id: 'ev-26', type: 'quarter_end' as const, time: '0:00', period: 'Q2', description: 'End of Q2 \u2014 Titans 38, Elite 32' },
  { id: 'ev-27', type: 'quarter_start' as const, time: '12:00', period: 'Q3', description: 'Start of Q3' },
  { id: 'ev-28', type: 'score' as const, time: '11:15', period: 'Q3', description: 'Devon Clarke comes out hot with a corner three.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b', scoreAfter: { away: 38, home: 35 } },
  { id: 'ev-29', type: 'score' as const, time: '10:30', period: 'Q3', description: 'Caleb Smith answers with a quick layup in transition.', team: 'away' as const, teamName: 'Titans', teamColor: '#f97316', scoreAfter: { away: 40, home: 35 } },
  { id: 'ev-30', type: 'foul' as const, time: '9:44', period: 'Q3', description: 'Loose ball foul on Chris Joseph. Titans ball.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b' },
  { id: 'ev-31', type: 'score' as const, time: '8:20', period: 'Q3', description: 'Isaiah Murray with the fadeaway over two defenders. Incredible shot.', team: 'home' as const, teamName: 'Elite', teamColor: '#64748b', scoreAfter: { away: 40, home: 37 } },
];

const INSIGHTS = {
  analysisText:
    'The Titans are controlling the pace with Caleb Smith dominating in isolation. Scarborough Elite needs to force turnovers and push the tempo in transition to close the 6-point gap. Watch for Devon Clarke \u2014 he is heating up from deep and could swing momentum in Q4.',
  winProbability: { home: 37, away: 63 },
  momentum: 'away' as const,
  predictedScore: { home: 72, away: 81 },
  keyMatchup: {
    playerA: 'Caleb Smith',
    playerB: 'Devon Clarke',
    analysis:
      'Smith is shooting 58% from the field and has been the primary creator for the Titans. Clarke is the only Elite player who can match his scoring output \u2014 their head-to-head in Q4 will likely decide this game.',
  },
  playerImpacts: [
    { name: 'Caleb Smith', team: 'away' as const, rating: 94, note: 'Dominant scorer' },
    { name: 'Devon Clarke', team: 'home' as const, rating: 82, note: 'Heating up' },
    { name: 'Jordan Blake', team: 'away' as const, rating: 78, note: 'Floor general' },
    { name: 'Isaiah Murray', team: 'home' as const, rating: 74, note: 'Inside presence' },
    { name: 'Tyrell Davis', team: 'away' as const, rating: 71, note: 'Rebounding machine' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Team Comparison Stats                                             */
/* ------------------------------------------------------------------ */

interface ComparisonStat {
  label: string;
  home: number;
  away: number;
}

const COMPARISON_STATS: ComparisonStat[] = [
  { label: 'FG%', home: 42, away: 48 },
  { label: '3PT%', home: 35, away: 41 },
  { label: 'Rebounds', home: 28, away: 32 },
  { label: 'Assists', home: 17, away: 16 },
  { label: 'Steals', home: 8, away: 6 },
  { label: 'Turnovers', home: 7, away: 9 },
  { label: 'Fast Break Pts', home: 10, away: 14 },
  { label: 'Points in Paint', home: 22, away: 26 },
];

const TeamComparisonBar: React.FC<{
  stat: ComparisonStat;
  homeColor: string;
  awayColor: string;
  index: number;
}> = ({ stat, homeColor, awayColor, index }) => {
  const total = stat.home + stat.away;
  const homePct = total > 0 ? (stat.home / total) * 100 : 50;
  const awayPct = total > 0 ? (stat.away / total) * 100 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
      className="flex items-center gap-3"
    >
      <span className="font-mono text-xs font-bold text-neutral-500 w-10 text-right">
        {stat.away}
      </span>
      <div className="flex-1 flex h-3 rounded-full overflow-hidden bg-neutral-100 gap-px">
        <motion.div
          className="h-full rounded-l-full"
          style={{ backgroundColor: awayColor }}
          initial={{ width: 0 }}
          animate={{ width: `${awayPct}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
        />
        <motion.div
          className="h-full rounded-r-full"
          style={{ backgroundColor: homeColor }}
          initial={{ width: 0 }}
          animate={{ width: `${homePct}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
        />
      </div>
      <span className="font-mono text-xs font-bold text-neutral-500 w-10">
        {stat.home}
      </span>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Page Component                                               */
/* ------------------------------------------------------------------ */

export const GameDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const game = GAME_DETAIL;
  const isLive = game.status === 'live';

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/games')}
            className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Games</span>
          </button>
          <div className="flex items-center gap-1">
            {isLive && (
              <div className="flex items-center gap-1.5 mr-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
                  Live
                </span>
              </div>
            )}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100/60 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <Bell className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100/60 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="px-4 pt-4 space-y-4">
        {/* Venue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-1.5 text-[10px] text-neutral-400"
        >
          <MapPin className="h-3 w-3" />
          <span>{game.venue}</span>
        </motion.div>

        {/* Scoreboard */}
        <Scoreboard
          homeTeam={game.homeTeam}
          awayTeam={game.awayTeam}
          period={game.period}
          gameClock={game.gameClock}
          isLive={isLive}
          status={game.status}
        />

        {/* Team Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-[20px] border border-neutral-200/60 bg-white p-5"
        >
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-4">
            Team Comparison
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: game.awayTeam.color }}
              />
              <span className="text-xs font-bold text-neutral-600">
                {game.awayTeam.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-600">
                {game.homeTeam.name}
              </span>
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: game.homeTeam.color }}
              />
            </div>
          </div>
          <div className="space-y-3">
            {COMPARISON_STATS.map((stat, idx) => (
              <div key={stat.label}>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 text-center mb-1">
                  {stat.label}
                </p>
                <TeamComparisonBar
                  stat={stat}
                  homeColor={game.homeTeam.color}
                  awayColor={game.awayTeam.color}
                  index={idx}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Box Score */}
        <BoxScore
          homeTeamName={game.homeTeam.name}
          awayTeamName={game.awayTeam.name}
          homeTeamColor={game.homeTeam.color}
          awayTeamColor={game.awayTeam.color}
          homePlayers={HOME_PLAYERS}
          awayPlayers={AWAY_PLAYERS}
        />

        {/* Play-by-Play */}
        <PlayByPlay
          events={PLAY_EVENTS}
          homeTeamName={game.homeTeam.name}
          awayTeamName={game.awayTeam.name}
          homeTeamColor={game.homeTeam.color}
          awayTeamColor={game.awayTeam.color}
        />

        {/* AI6 Insights */}
        <GameInsights
          homeTeamName={game.homeTeam.name}
          awayTeamName={game.awayTeam.name}
          homeTeamColor={game.homeTeam.color}
          awayTeamColor={game.awayTeam.color}
          winProbability={INSIGHTS.winProbability}
          momentum={INSIGHTS.momentum}
          predictedScore={INSIGHTS.predictedScore}
          keyMatchup={INSIGHTS.keyMatchup}
          playerImpacts={INSIGHTS.playerImpacts}
          analysisText={INSIGHTS.analysisText}
        />
      </div>
    </div>
  );
};
