'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

const MAX_GUESSES = 6;

interface PlayerPoolEntry {
  name: string;
  position: string;
  era: string;
  nationality: string;
  franchise: string;
  scoringTier: string;
}

interface StoredState {
  date: string;
  guesses: PlayerPoolEntry[];
  results: TileResult[][];
  gameOver: boolean;
  won: boolean;
}

interface Stats {
  played: number;
  won: number;
  streak: number;
  maxStreak: number;
  distribution: number[];
}

type TileResult = 'correct' | 'close' | 'wrong';

const PLAYER_POOL: PlayerPoolEntry[] = [
  { name: 'Vince Carter', position: 'SG', era: '00s', nationality: 'US', franchise: 'expansion', scoringTier: 'elite' },
  { name: 'Chris Bosh', position: 'PF', era: '00s', nationality: 'US', franchise: 'expansion', scoringTier: 'allstar' },
  { name: 'DeMar DeRozan', position: 'SG', era: '10s', nationality: 'US', franchise: 'expansion', scoringTier: 'allstar' },
  { name: 'Kyle Lowry', position: 'PG', era: '10s', nationality: 'US', franchise: 'expansion', scoringTier: 'allstar' },
  { name: 'Kawhi Leonard', position: 'SF', era: '10s', nationality: 'US', franchise: 'original', scoringTier: 'elite' },
  { name: 'Pascal Siakam', position: 'PF', era: '20s', nationality: 'INT', franchise: 'expansion', scoringTier: 'allstar' },
  { name: 'Scottie Barnes', position: 'SF', era: '20s', nationality: 'INT', franchise: 'expansion', scoringTier: 'allstar' },
  { name: 'Tracy McGrady', position: 'SF', era: '00s', nationality: 'US', franchise: 'expansion', scoringTier: 'elite' },
  { name: 'Andrea Bargnani', position: 'C', era: '00s', nationality: 'INT', franchise: 'expansion', scoringTier: 'starter' },
  { name: 'Damon Stoudamire', position: 'PG', era: '90s', nationality: 'US', franchise: 'expansion', scoringTier: 'starter' },
  { name: 'Marcus Camby', position: 'C', era: '90s', nationality: 'US', franchise: 'expansion', scoringTier: 'starter' },
  { name: 'Jose Calderon', position: 'PG', era: '00s', nationality: 'INT', franchise: 'expansion', scoringTier: 'starter' },
  { name: 'Fred VanVleet', position: 'PG', era: '20s', nationality: 'US', franchise: 'expansion', scoringTier: 'allstar' },
  { name: 'OG Anunoby', position: 'SF', era: '20s', nationality: 'INT', franchise: 'expansion', scoringTier: 'allstar' },
  { name: 'Immanuel Quickley', position: 'PG', era: '20s', nationality: 'INT', franchise: 'expansion', scoringTier: 'starter' },
];

const CATEGORIES = ['Position', 'Era', 'Nationality', 'Franchise', 'Scoring Tier'];

function getDailyPlayerIndex(): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % PLAYER_POOL.length;
}

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function compareGuess(guess: PlayerPoolEntry, answer: PlayerPoolEntry): TileResult[] {
  const tiles: TileResult[] = [];
  const fields: (keyof PlayerPoolEntry)[] = ['position', 'era', 'nationality', 'franchise', 'scoringTier'];
  for (const field of fields) {
    if (guess[field] === answer[field]) {
      tiles.push('correct');
    } else if (
      (field === 'scoringTier' && Math.abs(['starter', 'allstar', 'elite'].indexOf(guess[field]) - ['starter', 'allstar', 'elite'].indexOf(answer[field])) === 1) ||
      (field === 'era' && Math.abs(['90s', '00s', '10s', '20s'].indexOf(guess[field]) - ['90s', '00s', '10s', '20s'].indexOf(answer[field])) === 1)
    ) {
      tiles.push('close');
    } else {
      tiles.push('wrong');
    }
  }
  return tiles;
}

function getStoredState(): StoredState | null {
  try {
    const raw = localStorage.getItem('1fan_daily_rank');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (parsed.date !== getTodayKey()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function getStats(): Stats {
  try {
    const raw = localStorage.getItem('1fan_daily_rank_stats');
    return raw ? (JSON.parse(raw) as Stats) : { played: 0, won: 0, streak: 0, maxStreak: 0, distribution: [0, 0, 0, 0, 0, 0] };
  } catch {
    return { played: 0, won: 0, streak: 0, maxStreak: 0, distribution: [0, 0, 0, 0, 0, 0] };
  }
}

function saveStats(stats: Stats): void {
  localStorage.setItem('1fan_daily_rank_stats', JSON.stringify(stats));
}

const TILE_EMOJI: Record<TileResult, string> = { correct: '\u{1F7E9}', close: '\u{1F7E8}', wrong: '\u{1F7E5}' };
const TILE_CLASS: Record<TileResult, string> = {
  correct: 'bg-emerald-600 text-white',
  close: 'bg-amber-500 text-white',
  wrong: 'bg-red-600/60 text-white',
};

function ConfettiEffect(): React.ReactElement {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 2;
        const colors = ['#dc2626', '#C9A92C', '#10b981', '#3b82f6', '#f59e0b'];
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${left}%`,
              top: '-10px',
              backgroundColor: color,
              animation: `fall ${duration}s linear ${delay}s forwards`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function GuessDistribution({ distribution }: { distribution: number[] }): React.ReactElement {
  const max = Math.max(...distribution, 1);
  return (
    <div className="space-y-1">
      {distribution.map((count, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 w-3 text-right">{i + 1}</span>
          <div className="flex-1 h-5 bg-neutral-800 rounded overflow-hidden">
            <div
              className="h-full bg-red-600 rounded flex items-center justify-end px-1.5 transition-all duration-500"
              style={{ width: `${Math.max((count / max) * 100, count > 0 ? 8 : 0)}%` }}
            >
              {count > 0 && <span className="text-[10px] font-bold text-white">{count}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DailyRankView(): React.ReactElement {
  const answer = useMemo(() => PLAYER_POOL[getDailyPlayerIndex()], []);
  const inputRef = useRef<HTMLInputElement>(null);

  const stored = getStoredState();
  const [guesses, setGuesses] = useState<PlayerPoolEntry[]>(stored?.guesses || []);
  const [results, setResults] = useState<TileResult[][]>(stored?.results || []);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gameOver, setGameOver] = useState(stored?.gameOver || false);
  const [won, setWon] = useState(stored?.won || false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [copied, setCopied] = useState(false);

  const stats = getStats();
  const guessedNames = useMemo(() => new Set(guesses.map((g) => g.name)), [guesses]);

  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    const lower = inputValue.toLowerCase();
    return PLAYER_POOL.filter(
      (p) => p.name.toLowerCase().includes(lower) && !guessedNames.has(p.name)
    ).slice(0, 5);
  }, [inputValue, guessedNames]);

  const saveState = useCallback(
    (newGuesses: PlayerPoolEntry[], newResults: TileResult[][], isOver: boolean, isWon: boolean): void => {
      localStorage.setItem(
        '1fan_daily_rank',
        JSON.stringify({
          date: getTodayKey(),
          guesses: newGuesses,
          results: newResults,
          gameOver: isOver,
          won: isWon,
        })
      );
    },
    []
  );

  const handleGuess = useCallback(
    (player: PlayerPoolEntry): void => {
      if (gameOver || guesses.length >= MAX_GUESSES) return;

      const result = compareGuess(player, answer);
      const newGuesses = [...guesses, player];
      const newResults = [...results, result];
      const isCorrect = result.every((t) => t === 'correct');
      const isOver = isCorrect || newGuesses.length >= MAX_GUESSES;

      setGuesses(newGuesses);
      setResults(newResults);
      setInputValue('');
      setShowSuggestions(false);

      if (isOver) {
        setGameOver(true);
        setWon(isCorrect);

        const newStats = { ...stats };
        newStats.played += 1;
        if (isCorrect) {
          newStats.won += 1;
          newStats.streak += 1;
          newStats.maxStreak = Math.max(newStats.maxStreak, newStats.streak);
          newStats.distribution[newGuesses.length - 1] += 1;
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        } else {
          newStats.streak = 0;
        }
        saveStats(newStats);
      }

      saveState(newGuesses, newResults, isOver, isCorrect);
    },
    [gameOver, guesses, results, answer, stats, saveState]
  );

  const shareResult = useCallback((): void => {
    const emojiGrid = results
      .map((row) => row.map((t) => TILE_EMOJI[t]).join(''))
      .join('\n');
    const text = `Ball in the 6 Daily Rank ${getTodayKey()}\n${won ? guesses.length : 'X'}/${MAX_GUESSES}\n\n${emojiGrid}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [results, won, guesses]);

  return (
    <div className="max-w-lg mx-auto space-y-4 p-6">
      {showConfetti && <ConfettiEffect />}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Daily Rank</h1>
        <button
          onClick={() => setShowStats(!showStats)}
          className="text-xs text-neutral-400 hover:text-white transition-colors px-2 py-1 rounded bg-neutral-800"
        >
          Stats
        </button>
      </div>

      {showStats && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-4">
          <h3 className="text-sm font-semibold text-white text-center">Your Statistics</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-white">{stats.played}</div>
              <div className="text-[10px] text-neutral-500">Played</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0}%
              </div>
              <div className="text-[10px] text-neutral-500">Win Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats.streak}</div>
              <div className="text-[10px] text-neutral-500">Streak</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats.maxStreak}</div>
              <div className="text-[10px] text-neutral-500">Max Streak</div>
            </div>
          </div>
          <div>
            <h4 className="text-xs text-neutral-400 mb-2">Guess Distribution</h4>
            <GuessDistribution distribution={stats.distribution} />
          </div>
        </div>
      )}

      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
        <p className="text-xs text-neutral-400 mb-3">
          Guess the Raptors-connected player. Each guess reveals 5 clues.
        </p>

        <div className="mb-3">
          <div className="grid grid-cols-5 gap-1 mb-2">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="text-[9px] text-neutral-600 text-center font-medium uppercase tracking-wider">
                {cat}
              </div>
            ))}
          </div>

          {guesses.map((guess, gi) => (
            <div key={gi} className="grid grid-cols-5 gap-1 mb-1">
              {results[gi]?.map((tile, ti) => (
                <div
                  key={ti}
                  className={cn(
                    'h-8 rounded flex items-center justify-center text-[10px] font-bold transition-all',
                    TILE_CLASS[tile],
                  )}
                  style={{ animationDelay: `${ti * 100}ms` }}
                >
                  {ti === 0 && guess.position}
                  {ti === 1 && guess.era}
                  {ti === 2 && (guess.nationality === 'INT' ? 'INT' : 'US')}
                  {ti === 3 && (guess.franchise === 'original' ? 'OG6' : 'EXP')}
                  {ti === 4 && guess.scoringTier?.toUpperCase().slice(0, 3)}
                </div>
              ))}
            </div>
          ))}

          {!gameOver &&
            [...Array(MAX_GUESSES - guesses.length)].map((_, i) => (
              <div key={`empty-${i}`} className="grid grid-cols-5 gap-1 mb-1">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="h-8 rounded bg-neutral-800/50 border border-neutral-800"
                  />
                ))}
              </div>
            ))}
        </div>

        {!gameOver && (
          <div className="relative">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Type a player name..."
              className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-500"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden z-10 shadow-xl">
                {suggestions.map((player) => (
                  <button
                    key={player.name}
                    onClick={() => handleGuess(player)}
                    className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{player.name}</span>
                    <span className="text-[10px] text-neutral-500">{player.position}</span>
                  </button>
                ))}
              </div>
            )}
            <p className="text-[10px] text-neutral-600 mt-1.5">
              Guess {guesses.length + 1} of {MAX_GUESSES}
            </p>
          </div>
        )}

        {gameOver && (
          <div className="text-center space-y-3">
            {won ? (
              <div>
                <p className="text-emerald-400 font-bold text-sm">
                  You got it in {guesses.length}!
                </p>
                <p className="text-xs text-neutral-400">
                  The answer was {answer.name}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-red-400 font-bold text-sm">Better luck tomorrow!</p>
                <p className="text-xs text-neutral-400">
                  The answer was <span className="text-white font-medium">{answer.name}</span>
                </p>
              </div>
            )}
            <button
              onClick={shareResult}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {copied ? 'Copied!' : 'Share Result'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-neutral-900/60 border border-neutral-800/50 rounded-xl p-3">
        <h4 className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider mb-2">Legend</h4>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-emerald-600" />
            <span className="text-[10px] text-neutral-500">Exact match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span className="text-[10px] text-neutral-500">Close</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-red-600/60" />
            <span className="text-[10px] text-neutral-500">Wrong</span>
          </div>
        </div>
      </div>
    </div>
  );
}
