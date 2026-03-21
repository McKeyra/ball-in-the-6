'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const JOURNAL_PROMPTS = [
  'What is one thing you did today that your future self will thank you for?',
  'Describe a moment today where you showed mental toughness.',
  'What is the biggest lesson you learned from your last game?',
  'If you could replay one play from today, what would you change?',
  'What are you most grateful for in your athletic journey right now?',
  'How did you push yourself outside your comfort zone today?',
  'What would your coach say you did well today?',
  'Describe your energy level throughout the day. What affected it?',
  'What is one skill you want to improve by next week?',
  'Who helped you today and how can you thank them?',
  'What did you learn from watching film or studying the game today?',
  'How did you handle adversity today?',
];

const SORENESS_LABELS = ['None', 'Light', 'Moderate', 'Heavy', 'Severe'];
const MOOD_OPTIONS = [
  { value: 'great', icon: '\u{1F604}', label: 'Great' },
  { value: 'good', icon: '\u{1F642}', label: 'Good' },
  { value: 'okay', icon: '\u{1F610}', label: 'Okay' },
  { value: 'down', icon: '\u{1F614}', label: 'Down' },
  { value: 'rough', icon: '\u{1F61E}', label: 'Rough' },
];

interface DailyEntry {
  rpe: number;
  sleep_hours: number;
  sleep_quality: number;
  soreness: number;
  mood: string;
  hydration: number;
  journal: string;
  date: string;
}

export function DailyLogView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [form, setForm] = useState({
    rpe: 5,
    sleep_hours: 8,
    sleep_quality: 3,
    soreness: 1,
    mood: 'okay',
    hydration: 2.0,
    journal: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const todayPrompt = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return JOURNAL_PROMPTS[dayOfYear % JOURNAL_PROMPTS.length];
  }, []);

  const updateField = (key: string, value: number | string): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (): void => {
    const entry: DailyEntry = {
      ...form,
      date: new Date().toISOString().split('T')[0],
    };
    setEntries((prev) => [entry, ...prev]);
    setSubmitted(true);
  };

  const resetForm = (): void => {
    setForm({ rpe: 5, sleep_hours: 8, sleep_quality: 3, soreness: 1, mood: 'okay', hydration: 2.0, journal: '' });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F4DD}'}</span>
        <h1 className="text-2xl font-bold text-white">Daily Log</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>

      <p className="text-neutral-400 text-sm">Track your daily wellness. Small data, big picture. Log once a day for best results.</p>

      {!submitted ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl p-5 space-y-6">
          <h3 className="text-white text-lg font-semibold">
            {new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>

          {/* RPE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-neutral-300">Rate of Perceived Exertion (RPE)</label>
              <span className="text-sm font-bold text-white">{form.rpe}/10</span>
            </div>
            <input type="range" value={form.rpe} onChange={(e) => updateField('rpe', parseInt(e.target.value))} min={1} max={10} step={1} className="w-full accent-[#c8ff00] cursor-pointer" />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>Easy</span><span>Moderate</span><span>Max Effort</span>
            </div>
          </div>

          {/* Sleep */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-neutral-300">Sleep Hours</label>
                <span className="text-sm font-bold text-white">{form.sleep_hours}h</span>
              </div>
              <input type="range" value={form.sleep_hours} onChange={(e) => updateField('sleep_hours', parseFloat(e.target.value))} min={3} max={12} step={0.5} className="w-full accent-[#c8ff00] cursor-pointer" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-neutral-300">Sleep Quality</label>
                <span className="text-sm font-bold text-white">{form.sleep_quality}/5</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => updateField('sleep_quality', star)}
                    className={cn('text-xl transition-all', star <= form.sleep_quality ? 'text-yellow-400 scale-110' : 'text-neutral-700 hover:text-neutral-500')}
                  >
                    {'\u2605'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Soreness */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-neutral-300">Soreness</label>
              <span className="text-sm font-bold text-white">{SORENESS_LABELS[form.soreness - 1]} ({form.soreness}/5)</span>
            </div>
            <input type="range" value={form.soreness} onChange={(e) => updateField('soreness', parseInt(e.target.value))} min={1} max={5} step={1} className="w-full accent-[#c8ff00] cursor-pointer" />
          </div>

          {/* Mood */}
          <div>
            <label className="text-sm text-neutral-300 block mb-3">Mood</label>
            <div className="flex gap-3">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => updateField('mood', m.value)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-lg border transition-all flex-1',
                    form.mood === m.value ? 'border-[#c8ff00] bg-[#c8ff00]/10' : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                  )}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-[10px] text-neutral-400">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hydration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-neutral-300">Hydration (litres)</label>
              <span className="text-sm font-bold text-white">{form.hydration}L</span>
            </div>
            <input type="range" value={form.hydration} onChange={(e) => updateField('hydration', parseFloat(e.target.value))} min={0} max={5} step={0.25} className="w-full accent-[#c8ff00] cursor-pointer" />
          </div>

          {/* Journal */}
          <div>
            <label className="text-sm text-neutral-300 block mb-2">Journal Entry</label>
            <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50 mb-2">
              <span className="text-xs text-neutral-400 italic">{'\u{1F4A1}'} Prompt: {todayPrompt}</span>
            </div>
            <textarea
              value={form.journal}
              onChange={(e) => updateField('journal', e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg p-3 min-h-[100px] text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
              placeholder="How was your day? What did you learn?"
            />
          </div>

          <button onClick={handleSubmit} className="w-full px-4 py-2 rounded-lg bg-[#c8ff00] text-black text-sm font-medium hover:bg-[#b8ef00] transition-colors">Submit Daily Log</button>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl max-w-2xl p-6 text-center space-y-4">
          <span className="text-4xl">{'\u2705'}</span>
          <h3 className="text-xl font-bold text-white">Daily log submitted!</h3>
          <p className="text-sm text-neutral-400">Consistency is the key to improvement. See you tomorrow.</p>
          <button onClick={resetForm} className="px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors">Log Another Entry</button>
        </div>
      )}

      {entries.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Entries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {entries.slice(0, 6).map((entry, i) => (
              <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{entry.date}</span>
                  <span className="text-lg">{MOOD_OPTIONS.find((m) => m.value === entry.mood)?.icon || '\u{1F610}'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div><div className="text-neutral-400">RPE</div><div className="font-bold text-white">{entry.rpe}</div></div>
                  <div><div className="text-neutral-400">Sleep</div><div className="font-bold text-white">{entry.sleep_hours}h</div></div>
                  <div><div className="text-neutral-400">Water</div><div className="font-bold text-white">{entry.hydration}L</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
