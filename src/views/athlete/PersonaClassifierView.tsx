'use client';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const GENERIC_QUESTIONS = [
  { question: 'How do you prepare before a big game?', options: [{ text: 'Visualize my best plays', archIndex: 0 }, { text: 'Study the opponent', archIndex: 1 }, { text: 'Get fired up with music', archIndex: 2 }, { text: 'Stay calm and focused', archIndex: 3 }] },
  { question: 'When you make a mistake in a game, you:', options: [{ text: 'Shake it off and attack harder', archIndex: 0 }, { text: 'Analyze what went wrong immediately', archIndex: 1 }, { text: 'Use anger as fuel', archIndex: 2 }, { text: 'Reset and focus on the next play', archIndex: 3 }] },
  { question: 'Your ideal role model is someone who:', options: [{ text: 'Dominates with pure skill', archIndex: 0 }, { text: 'Outsmarks everyone', archIndex: 1 }, { text: 'Never backs down from a challenge', archIndex: 2 }, { text: 'Elevates everyone around them', archIndex: 3 }] },
  { question: 'In pickup games, you are usually the one who:', options: [{ text: 'Takes the most shots', archIndex: 0 }, { text: 'Calls the plays', archIndex: 1 }, { text: 'Guards the best player', archIndex: 2 }, { text: 'Does whatever is needed to win', archIndex: 3 }] },
];

export function PersonaClassifierView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [selectedPosition, setSelectedPosition] = useState(sportConfig.positions[0]?.code || '');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<{ name: string; description: string; traits?: string[] } | null>(null);

  const position = sportConfig.positions.find((p) => p.code === selectedPosition);
  const archetypes = sportConfig.personaArchetypes?.[selectedPosition] || [];

  const questions = useMemo(() => {
    const configQuiz = (sportConfig.personaQuiz || []).slice(0, 4).map((q) => ({
      question: q.question,
      options: q.options.map((opt, i) => ({ text: opt.text, archetypeName: opt.archetypes?.[selectedPosition] || archetypes[i % archetypes.length]?.name || 'Unknown' })),
    }));
    const generic = GENERIC_QUESTIONS.map((q) => ({
      question: q.question,
      options: q.options.map((opt) => ({ text: opt.text, archetypeName: archetypes[opt.archIndex]?.name || archetypes[0]?.name || 'Unknown' })),
    }));
    return [...configQuiz, ...generic];
  }, [sportConfig.personaQuiz, selectedPosition, archetypes]);

  const totalQuestions = questions.length;
  const progress = ((currentQ) / totalQuestions) * 100;

  const handleAnswer = (option: { text: string; archetypeName: string }) => {
    const newAnswers = [...answers, option.archetypeName];
    setAnswers(newAnswers);
    if (currentQ + 1 >= totalQuestions) {
      const tally: Record<string, number> = {};
      newAnswers.forEach((name) => { tally[name] = (tally[name] || 0) + 1; });
      const winner = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
      const matchedArchetype = archetypes.find((a) => a.name === winner[0]) || archetypes[0];
      setResult(matchedArchetype);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const resetQuiz = () => { setCurrentQ(0); setAnswers([]); setResult(null); };

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{String.fromCodePoint(0x1F9EC)}</span>
        <h1 className="text-2xl font-bold text-white">Persona Classifier</h1>
        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>
      <p className="text-neutral-400 text-sm">Discover your player archetype. Select your position and answer 8 questions.</p>
      <div className="flex flex-wrap gap-2">
        {sportConfig.positions.map((pos) => (
          <button key={pos.code} onClick={() => { setSelectedPosition(pos.code); resetQuiz(); }}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all border', selectedPosition === pos.code ? 'text-white border-transparent' : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:border-neutral-500')}
            style={selectedPosition === pos.code ? { backgroundColor: `${pos.color}30`, borderColor: pos.color, color: pos.color } : undefined}>
            {pos.code}
          </button>
        ))}
      </div>
      {!result ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between"><span className="text-xs text-neutral-500">Question {currentQ + 1} of {totalQuestions}</span><span className="text-xs text-neutral-500">{selectedPosition} - {position?.name}</span></div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#c8ff00] transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
          <h3 className="text-white text-lg font-semibold mt-4">{questions[currentQ]?.question}</h3>
          <div className="space-y-3">
            {questions[currentQ]?.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt)} className="w-full text-left p-4 rounded-xl border bg-neutral-800/50 border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all">
                <span className="text-sm">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl overflow-hidden">
          <div className="h-2" style={{ backgroundColor: position?.color }} />
          <div className="p-6 space-y-6 text-center">
            <div className="text-4xl mb-3">{String.fromCodePoint(0x1F3C6)}</div>
            <h2 className="text-2xl font-bold text-white">{result.name}</h2>
            <p className="text-sm" style={{ color: position?.color }}>{selectedPosition} - {position?.name}</p>
            <p className="text-neutral-300 leading-relaxed">{result.description}</p>
            {result.traits && (
              <div className="flex justify-center flex-wrap gap-2">
                {result.traits.map((trait) => (<span key={trait} className="px-2 py-0.5 rounded border border-neutral-600 text-neutral-300 text-xs">{trait}</span>))}
              </div>
            )}
            <button onClick={resetQuiz} className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-sm transition-all">Retake Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
}
