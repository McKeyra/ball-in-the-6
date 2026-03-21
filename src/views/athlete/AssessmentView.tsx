'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const ASSESSMENT_CATEGORIES = [
  { id: 'physical', label: 'Physical', color: '#EF4444', icon: '\u{1F4AA}', questions: ['I can maintain high intensity throughout an entire game/practice.', 'My speed and acceleration are at the level I need for my position.', 'I have the strength required for physical matchups in my sport.', 'My flexibility and mobility help me avoid injuries.', 'I recover well between games and practices.', 'My endurance allows me to perform at my best in the 4th quarter/3rd period.', 'I maintain good body composition for my sport and position.'] },
  { id: 'technical', label: 'Technical', color: '#3B82F6', icon: '\u{1F3AF}', questions: ['I execute my position-specific skills consistently under pressure.', 'My fundamentals (footwork, stance, mechanics) are solid.', 'I can perform advanced skills that give me an edge.', 'My technique holds up when I am fatigued late in games.', 'I continue to develop new skills and add to my game.', 'I can execute plays and set pieces reliably.', 'My skill level is competitive at my current level of play.'] },
  { id: 'mental', label: 'Mental', color: '#10B981', icon: '\u{1F9E0}', questions: ['I stay focused and composed under pressure.', 'I bounce back quickly from mistakes during games.', 'I have a consistent pre-game mental routine.', 'I can block out distractions (crowd, refs, opponents) during play.', 'I maintain confidence even during losing streaks or slumps.', 'I use visualization and mental rehearsal regularly.', 'I handle criticism and coaching feedback constructively.'] },
  { id: 'goals', label: 'Goals & Growth', color: '#F59E0B', icon: '\u{1F31F}', questions: ['I have clear short-term goals (this season) for my development.', 'I have a long-term vision for where I want my athletic career to go.', 'I am willing to put in extra work outside of team practices.', 'I seek out feedback from coaches, teammates, and mentors.', 'I watch film and study the game outside of practice.', 'I take care of my nutrition and sleep as part of my training.', 'I balance my athletic goals with academics and personal life.'] },
];

const SCALE_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export function AssessmentView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);

  const totalQuestions = ASSESSMENT_CATEGORIES.reduce((sum, cat) => sum + cat.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const overallProgress = Math.round((answeredCount / totalQuestions) * 100);

  const flatIndex = useMemo(() => {
    let idx = 0;
    for (let c = 0; c < currentCategory; c++) {
      idx += ASSESSMENT_CATEGORIES[c].questions.length;
    }
    return idx + currentQuestion;
  }, [currentCategory, currentQuestion]);

  const category = ASSESSMENT_CATEGORIES[currentCategory];
  const question = category?.questions[currentQuestion];
  const questionKey = `${category?.id}-${currentQuestion}`;

  const handleAnswer = (value: number): void => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
    if (currentQuestion < category.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentCategory < ASSESSMENT_CATEGORIES.length - 1) {
      setCurrentCategory(currentCategory + 1);
      setCurrentQuestion(0);
    } else {
      setCompleted(true);
    }
  };

  const categoryScores = useMemo(() => {
    return ASSESSMENT_CATEGORIES.map((cat) => {
      let total = 0;
      let count = 0;
      cat.questions.forEach((_, qi) => {
        const key = `${cat.id}-${qi}`;
        if (answers[key]) { total += answers[key]; count++; }
      });
      const maxScore = cat.questions.length * 5;
      const score = count > 0 ? total : 0;
      const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      return { ...cat, score, maxScore, pct, answered: count, total: cat.questions.length };
    });
  }, [answers]);

  const overallScore = useMemo(() => {
    const total = categoryScores.reduce((sum, c) => sum + c.score, 0);
    const max = categoryScores.reduce((sum, c) => sum + c.maxScore, 0);
    return max > 0 ? Math.round((total / max) * 100) : 0;
  }, [categoryScores]);

  const resetAssessment = (): void => {
    setCurrentCategory(0);
    setCurrentQuestion(0);
    setAnswers({});
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{'\u{1F4C8}'}</span>
          <h1 className="text-2xl font-bold text-white">Assessment Results</h1>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl p-6 text-center">
          <div className="text-5xl font-bold mb-2" style={{ color: sportConfig.color }}>{overallScore}%</div>
          <div className="text-sm text-neutral-400">Overall Assessment Score</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl p-5 space-y-5">
          <h3 className="text-white text-lg font-semibold">Category Breakdown</h3>
          {categoryScores.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span className="text-sm font-medium text-neutral-300">{cat.label}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.pct}%</span>
              </div>
              <div className="w-full h-4 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
              </div>
              <div className="text-xs text-neutral-500 mt-1">{cat.score} / {cat.maxScore} points</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 max-w-2xl">
          <button onClick={resetAssessment} className="px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors">
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F4C8}'}</span>
        <h1 className="text-2xl font-bold text-white">Assessment</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {ASSESSMENT_CATEGORIES.map((cat, i) => {
          const catScore = categoryScores[i];
          return (
            <div
              key={cat.id}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border',
                currentCategory === i ? 'border-transparent text-white' : 'bg-neutral-900 text-neutral-500 border-neutral-800'
              )}
              style={currentCategory === i ? { backgroundColor: `${cat.color}30`, borderColor: cat.color, color: cat.color } : undefined}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="text-[10px] opacity-60">{catScore.answered}/{catScore.total}</span>
            </div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-neutral-500">Question {flatIndex + 1} of {totalQuestions}</span>
          <span className="text-xs text-neutral-500">{overallProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#c8ff00] rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <span>{category.icon}</span>
          <span className="text-xs uppercase tracking-wider" style={{ color: category.color }}>{category.label}</span>
          <span className="text-xs text-neutral-600">({currentQuestion + 1}/{category.questions.length})</span>
        </div>
        <h3 className="text-white text-lg font-semibold mt-2 mb-4">{question}</h3>
        <div className="space-y-3">
          {SCALE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4',
                answers[questionKey] === opt.value ? 'border-neutral-500 bg-neutral-800' : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800'
              )}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border"
                style={answers[questionKey] === opt.value ? { backgroundColor: `${category.color}30`, borderColor: category.color, color: category.color } : { borderColor: '#525252', color: '#a3a3a3' }}
              >
                {opt.value}
              </span>
              <span className="text-sm text-neutral-300">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
