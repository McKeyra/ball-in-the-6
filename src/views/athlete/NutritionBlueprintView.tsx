'use client';

import { useState, useMemo } from 'react';
import { useSport } from '@/lib/athlete/sport-context';

const MACRO_TARGETS: Record<string, { min: number; max: number; unit: string; color: string }> = {
  protein: { min: 1.6, max: 2.2, unit: 'g/kg', color: '#EF4444' },
  carbs: { min: 5, max: 8, unit: 'g/kg', color: '#F59E0B' },
  fat: { min: 0.8, max: 1.2, unit: 'g/kg', color: '#10B981' },
};

const GAME_DAY_NUTRITION: Record<string, { title: string; items: string[]; example: string }> = {
  pre: { title: 'Pre-Game (3-4h before)', items: ['Complex carbs: rice, pasta, oatmeal, or sweet potato', 'Lean protein: chicken breast, fish, or eggs', 'Low fiber and low fat to avoid GI issues', 'Hydrate with 500-600ml water'], example: 'Grilled chicken with rice and steamed vegetables — $3.50' },
  during: { title: 'During Game', items: ['Water every 15-20 minutes (150-250ml)', 'Sports drink if game is 60+ minutes', 'Quick carbs at halftime: banana, energy bar, or orange slices', 'Avoid anything heavy or unfamiliar'], example: 'Water + banana at half — $0.50' },
  post: { title: 'Post-Game (within 30 min)', items: ['Protein shake or chocolate milk', '1:3 protein-to-carb ratio', 'Rehydrate: replace 150% of fluid lost', 'Full meal within 2 hours'], example: 'Chocolate milk + PB&J sandwich — $2.00' },
};

const MEAL_TEMPLATES = [
  {
    title: 'Budget Athlete Day ($7)',
    meals: [
      { time: 'Breakfast', meal: 'Oatmeal with banana and peanut butter', cost: '$1.00', macros: 'C: 55g | P: 15g | F: 12g' },
      { time: 'Snack', meal: 'Greek yogurt with honey', cost: '$0.75', macros: 'C: 20g | P: 17g | F: 3g' },
      { time: 'Lunch', meal: 'Rice, black beans, and chicken thigh', cost: '$2.00', macros: 'C: 65g | P: 35g | F: 8g' },
      { time: 'Snack', meal: 'Apple with peanut butter', cost: '$0.75', macros: 'C: 30g | P: 7g | F: 8g' },
      { time: 'Dinner', meal: 'Pasta with ground turkey and marinara', cost: '$2.50', macros: 'C: 70g | P: 30g | F: 10g' },
    ],
    total: { calories: 2200, protein: 104, carbs: 240, fat: 41 },
  },
  {
    title: 'Game Day Fuel ($8)',
    meals: [
      { time: 'Breakfast', meal: 'Scrambled eggs, whole wheat toast, OJ', cost: '$1.50', macros: 'C: 40g | P: 20g | F: 14g' },
      { time: 'Pre-Game', meal: 'Chicken & rice bowl', cost: '$2.50', macros: 'C: 65g | P: 35g | F: 5g' },
      { time: 'Halftime', meal: 'Banana + sports drink', cost: '$1.00', macros: 'C: 50g | P: 1g | F: 0g' },
      { time: 'Post-Game', meal: 'Chocolate milk + granola bar', cost: '$1.50', macros: 'C: 45g | P: 16g | F: 8g' },
      { time: 'Dinner', meal: 'Salmon, sweet potato, broccoli', cost: '$1.50', macros: 'C: 50g | P: 30g | F: 12g' },
    ],
    total: { calories: 2400, protein: 102, carbs: 250, fat: 39 },
  },
];

export function NutritionBlueprintView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [tab, setTab] = useState('plan');

  const macroCalc = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;
    return {
      protein: { min: Math.round(w * MACRO_TARGETS.protein.min), max: Math.round(w * MACRO_TARGETS.protein.max) },
      carbs: { min: Math.round(w * MACRO_TARGETS.carbs.min), max: Math.round(w * MACRO_TARGETS.carbs.max) },
      fat: { min: Math.round(w * MACRO_TARGETS.fat.min), max: Math.round(w * MACRO_TARGETS.fat.max) },
    };
  }, [weight]);

  const hydrationTarget = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;
    return (w * 0.033).toFixed(1);
  }, [weight]);

  const tabs = [
    { id: 'plan', label: 'Meal Plan' },
    { id: 'gameday', label: 'Game Day' },
    { id: 'tracker', label: 'Body Comp' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F34E}'}</span>
        <h1 className="text-2xl font-bold text-white">Nutrition Blueprint</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>
          {sportConfig.name}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === t.id ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Meal Plan Tab */}
      {tab === 'plan' && (
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <h3 className="text-white text-lg font-semibold">Macro Targets</h3>
            <div className="flex items-center gap-4">
              <label className="text-sm text-neutral-400">Body Weight (kg):</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-24 bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
                placeholder="70"
              />
            </div>

            {macroCalc && (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(macroCalc).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-center">
                    <div className="text-xs uppercase tracking-wider mb-1" style={{ color: MACRO_TARGETS[key].color }}>
                      {key}
                    </div>
                    <div className="text-lg font-bold text-white">{val.min}-{val.max}g</div>
                    <div className="text-xs text-neutral-500">
                      {MACRO_TARGETS[key].min}-{MACRO_TARGETS[key].max} {MACRO_TARGETS[key].unit}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hydrationTarget && (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
                <span className="text-xl">{'\u{1F4A7}'}</span>
                <div>
                  <div className="text-sm text-white font-medium">Hydration Target: {hydrationTarget}L / day</div>
                  <div className="text-xs text-neutral-400">Add 500ml for every hour of training</div>
                </div>
              </div>
            )}
          </div>

          {MEAL_TEMPLATES.map((template) => (
            <div key={template.title} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
              <h3 className="text-white text-lg font-semibold mb-4">{template.title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-700">
                      <th className="text-left py-2 px-3 text-neutral-400">Time</th>
                      <th className="text-left py-2 px-3 text-neutral-400">Meal</th>
                      <th className="text-center py-2 px-3 text-neutral-400">Cost</th>
                      <th className="text-left py-2 px-3 text-neutral-400">Macros</th>
                    </tr>
                  </thead>
                  <tbody>
                    {template.meals.map((m, i) => (
                      <tr key={i} className="border-b border-neutral-800">
                        <td className="py-2 px-3 text-neutral-300 font-medium">{m.time}</td>
                        <td className="py-2 px-3 text-neutral-300">{m.meal}</td>
                        <td className="py-2 px-3 text-center text-green-400">{m.cost}</td>
                        <td className="py-2 px-3 text-xs text-neutral-500">{m.macros}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-neutral-800 text-xs text-neutral-400">
                <span>Total: <span className="text-white">{template.total.calories} cal</span></span>
                <span>P: <span className="text-red-400">{template.total.protein}g</span></span>
                <span>C: <span className="text-yellow-400">{template.total.carbs}g</span></span>
                <span>F: <span className="text-green-400">{template.total.fat}g</span></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Game Day Tab */}
      {tab === 'gameday' && (
        <div className="space-y-4">
          {Object.entries(GAME_DAY_NUTRITION).map(([key, data]) => (
            <div key={key} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
              <h3 className="text-white text-lg font-semibold">{data.title}</h3>
              {data.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">{'\u2713'}</span>
                  <span className="text-sm text-neutral-300">{item}</span>
                </div>
              ))}
              <div className="mt-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                <div className="text-xs text-neutral-500 mb-1">Example</div>
                <div className="text-sm text-neutral-300">{data.example}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Body Comp Tab */}
      {tab === 'tracker' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h3 className="text-white text-lg font-semibold">Body Composition Tracker</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
                placeholder="70"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-400 block mb-1">Body Fat %</label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
                placeholder="15"
              />
            </div>
          </div>

          {weight && bodyFat && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
              <div className="p-3 rounded-xl bg-neutral-800/50 text-center">
                <div className="text-xs text-neutral-500">Lean Mass</div>
                <div className="text-xl font-bold text-white">
                  {(parseFloat(weight) * (1 - parseFloat(bodyFat) / 100)).toFixed(1)} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-800/50 text-center">
                <div className="text-xs text-neutral-500">Fat Mass</div>
                <div className="text-xl font-bold text-white">
                  {(parseFloat(weight) * (parseFloat(bodyFat) / 100)).toFixed(1)} kg
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-neutral-500 italic">
            Track weekly. Focus on trends, not day-to-day fluctuations. Weigh in at the same time each day.
          </p>
        </div>
      )}
    </div>
  );
}
