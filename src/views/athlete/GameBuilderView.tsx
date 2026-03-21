'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

interface Choice {
  text: string;
  successPct: number;
  outcome: { success: string; fail: string };
}

interface Scenario {
  title: string;
  situation: string;
  choices: Choice[];
}

const SCENARIOS_BY_SPORT: Record<string, Scenario[]> = {
  basketball: [
    {
      title: 'The Final Possession',
      situation: 'Down by 2 with 8 seconds left. You have the ball at half court after a timeout.',
      choices: [
        { text: 'Drive to the basket for the tie', successPct: 55, outcome: { success: 'You split the defenders and finish a tough layup! Tied game heading to overtime.', fail: 'Your drive is cut off and you turn the ball over. Game over.' } },
        { text: 'Pull up for the three-pointer to win', successPct: 35, outcome: { success: 'BANG! You drain the three at the buzzer! Your team wins!', fail: 'The three-pointer rims out. Close, but no cigar.' } },
        { text: 'Pass to the open teammate in the corner', successPct: 65, outcome: { success: 'Great read! Your teammate knocks down the wide-open three. Victory!', fail: 'The pass is deflected. The defense read your eyes.' } },
      ],
    },
    {
      title: 'Fast Break Decision',
      situation: '3-on-2 fast break. You are handling the ball in the middle with teammates on each wing.',
      choices: [
        { text: 'Attack the rim yourself', successPct: 50, outcome: { success: 'You finish strong through contact and draw the foul! And-one!', fail: 'Both defenders collapse on you and you get the charge call.' } },
        { text: 'Pass to the left wing for a layup', successPct: 60, outcome: { success: 'Perfect pass! Easy layup in transition.', fail: 'The weak-side defender rotated faster than expected. Blocked!' } },
        { text: 'Pull back and set up the half-court offense', successPct: 75, outcome: { success: 'Smart play. You run a pick-and-roll and score from the mid-range.', fail: 'The momentum dies and the shot clock runs down. Tough contested shot misses.' } },
      ],
    },
    {
      title: 'Defensive Stand',
      situation: 'Opponent star player has the ball in isolation. 20 seconds on the shot clock. You are guarding them.',
      choices: [
        { text: 'Play tight and pressure the ball', successPct: 40, outcome: { success: 'Your pressure forces a bad pass. Turnover!', fail: 'They blow past you with a quick crossover. Easy bucket.' } },
        { text: 'Give space and cut off the drive', successPct: 55, outcome: { success: 'They settle for a contested jump shot and miss. Great defense!', fail: 'They step into an uncontested three-pointer and nail it.' } },
        { text: 'Bait the pass and go for the steal', successPct: 30, outcome: { success: 'You read the play perfectly! Steal and fast break the other way!', fail: 'You gamble and they drive to an open lane. Easy layup.' } },
      ],
    },
  ],
  hockey: [
    {
      title: 'Overtime Breakaway',
      situation: 'Sudden death overtime. You intercept a pass at center ice and are going in alone on the goalie.',
      choices: [
        { text: 'Deke forehand-backhand', successPct: 45, outcome: { success: 'You slide it through the five-hole! OT winner!', fail: 'The goalie reads the deke and makes a pad save.' } },
        { text: 'Rip a wrist shot high glove side', successPct: 50, outcome: { success: 'Top corner! What a snipe! Game over!', fail: 'The goalie flashes the glove and robs you. Incredible save.' } },
        { text: 'Slow down and wait for the goalie to commit', successPct: 40, outcome: { success: 'You wait, wait... and slide it into the open net!', fail: 'You wait too long and the defender catches up for a poke check.' } },
      ],
    },
    {
      title: 'Power Play Setup',
      situation: '5-on-4 power play, 90 seconds left in the period. You have the puck on the half-wall.',
      choices: [
        { text: 'One-timer pass to the circle', successPct: 40, outcome: { success: 'One-time blast finds the back of the net! Power play goal!', fail: 'The pass is just off target and the PK clears the zone.' } },
        { text: 'Walk to the slot and shoot', successPct: 45, outcome: { success: 'You find a lane and wire it past the goalie!', fail: 'Your shot is blocked at the point. Good PK.' } },
        { text: 'Cycle low and look for the back door', successPct: 55, outcome: { success: 'Beautiful patience. Back door tap-in goal!', fail: 'The penalty killers clog the passing lanes. No chance.' } },
      ],
    },
    {
      title: 'Defensive Zone Pressure',
      situation: 'Opponents are cycling in your zone. Your partner just got beat. 2-on-1 against you.',
      choices: [
        { text: 'Take away the pass and play the shooter', successPct: 50, outcome: { success: 'You cut the passing lane and the shot goes wide!', fail: 'They find the pass through your legs. Goal against.' } },
        { text: 'Go aggressive and try to separate the puck', successPct: 35, outcome: { success: 'Big hit! You knock the puck loose and clear the zone!', fail: 'They go around you and score on an open net.' } },
        { text: 'Drop back and play the gap', successPct: 60, outcome: { success: 'Smart positioning forces a low-percentage shot. Save by your goalie.', fail: 'They use the time to find the perfect shot. Goal.' } },
      ],
    },
  ],
};

function rollSuccess(pct: number): boolean {
  return Math.random() * 100 < pct;
}

interface Result {
  success: boolean;
  outcome: string;
  choice: string;
}

interface HistoryEntry {
  scenario: string;
  choice: string;
  success: boolean;
  outcome: string;
}

export function GameBuilderView(): React.ReactElement {
  const { sportConfig, activeSport } = useSport();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const scenarios = SCENARIOS_BY_SPORT[activeSport] || SCENARIOS_BY_SPORT.basketball;
  const scenario = scenarios[currentScenario];

  const handleChoice = useCallback((choice: Choice) => {
    const success = rollSuccess(choice.successPct);
    const outcome = success ? choice.outcome.success : choice.outcome.fail;

    setResult({ success, outcome, choice: choice.text });
    setScore((prev) => ({
      wins: prev.wins + (success ? 1 : 0),
      losses: prev.losses + (success ? 0 : 1),
    }));
    setHistory((prev) => [...prev, {
      scenario: scenario.title,
      choice: choice.text,
      success,
      outcome,
    }]);
  }, [scenario]);

  const nextScenario = (): void => {
    setResult(null);
    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
  };

  const resetGame = (): void => {
    setCurrentScenario(0);
    setResult(null);
    setScore({ wins: 0, losses: 0 });
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F3AE}'}</span>
        <h1 className="text-2xl font-bold text-white">Game Builder</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>
          {sportConfig.name}
        </span>
      </div>

      {/* Score */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-bold text-lg">{score.wins}W</span>
          <span className="text-neutral-600">/</span>
          <span className="text-red-400 font-bold text-lg">{score.losses}L</span>
        </div>
        <div className="text-sm text-neutral-500">
          Scenario {currentScenario + 1} of {scenarios.length}
        </div>
        <button onClick={resetGame} className="ml-auto text-neutral-400 text-sm hover:text-white transition-colors">
          Reset
        </button>
      </div>

      {/* Scenario Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl">
        <div className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4">{scenario.title}</h3>
          <p className="text-neutral-300 leading-relaxed mb-5">{scenario.situation}</p>

          {!result ? (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-neutral-400">What do you do?</h4>
              {scenario.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left p-4 rounded-xl border bg-neutral-800/50 border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{choice.text}</span>
                    <span className="text-xs text-neutral-500 ml-4 shrink-0">
                      {choice.successPct}% chance
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className={cn(
                'p-4 rounded-xl border',
                result.success
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{result.success ? '\u2705' : '\u274C'}</span>
                  <span className={cn(
                    'font-semibold',
                    result.success ? 'text-green-400' : 'text-red-400'
                  )}>
                    {result.success ? 'Success!' : 'Failed!'}
                  </span>
                </div>
                <p className="text-sm text-neutral-300">{result.outcome}</p>
              </div>

              <div className="text-xs text-neutral-500">
                Your choice: <span className="text-neutral-400">{result.choice}</span>
              </div>

              <button
                onClick={nextScenario}
                className="px-4 py-2 rounded-lg bg-[#c8ff00] text-black text-sm font-medium hover:bg-[#b8ef00] transition-colors"
              >
                Next Scenario {'\u2192'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl">
          <div className="p-5">
            <h3 className="text-white text-sm font-semibold mb-3">Play History</h3>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg text-xs',
                    h.success ? 'bg-green-500/5' : 'bg-red-500/5'
                  )}
                >
                  <span>{h.success ? '\u2705' : '\u274C'}</span>
                  <span className="text-neutral-400 flex-1">
                    {h.scenario}: {h.choice}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
