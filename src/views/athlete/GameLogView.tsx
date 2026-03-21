'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const WEEKS_COUNT = 16;

interface GameEntry {
  week: string;
  date: string;
  opponent: string;
  result: string;
  position: string;
  sport: string;
  created_at: string;
  [key: string]: string;
}

export function GameLogView(): React.ReactElement {
  const { sportConfig, activeSport } = useSport();
  const gameLogFields = (sportConfig as unknown as Record<string, unknown>).gameLogFields as Array<{ key: string; label: string; type?: string }> || [];
  const [games, setGames] = useState<GameEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGame, setNewGame] = useState<Record<string, string>>({
    week: '',
    date: '',
    opponent: '',
    result: 'W',
    position: sportConfig.positions[0]?.code || '',
  });

  const handleFieldChange = (key: string, value: string): void => {
    setNewGame((prev) => ({ ...prev, [key]: value }));
  };

  const addGame = (): void => {
    const entry: GameEntry = {
      ...newGame,
      sport: activeSport,
      created_at: new Date().toISOString(),
    } as GameEntry;

    setGames((prev) => [...prev, entry]);
    setDialogOpen(false);
    setNewGame({
      week: '',
      date: '',
      opponent: '',
      result: 'W',
      position: sportConfig.positions[0]?.code || '',
    });
  };

  const stats = useMemo(() => {
    if (games.length === 0) return null;
    const wins = games.filter((g) => g.result === 'W').length;
    const fieldTotals: Record<string, number> = {};
    const fieldCounts: Record<string, number> = {};

    gameLogFields.forEach((field) => {
      fieldTotals[field.key] = 0;
      fieldCounts[field.key] = 0;
    });

    games.forEach((game) => {
      gameLogFields.forEach((field) => {
        const val = parseFloat(game[field.key]);
        if (!isNaN(val)) {
          fieldTotals[field.key] += val;
          fieldCounts[field.key]++;
        }
      });
    });

    const fieldAverages: Record<string, string> = {};
    gameLogFields.forEach((field) => {
      const count = fieldCounts[field.key];
      fieldAverages[field.key] = count > 0 ? (fieldTotals[field.key] / count).toFixed(1) : '0';
    });

    return {
      total: games.length,
      wins,
      losses: games.length - wins,
      winPct: Math.round((wins / games.length) * 100),
      fieldTotals,
      fieldAverages,
    };
  }, [games, gameLogFields]);

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{'\u{1F4D3}'}</span>
          <h1 className="text-2xl font-bold text-white">Game Log</h1>
          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
        </div>
        <button onClick={() => setDialogOpen(true)} className="px-4 py-2 rounded-lg bg-[#c8ff00] text-black text-sm font-medium hover:bg-[#b8ef00] transition-colors">+ Add Game</button>
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDialogOpen(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Log a Game</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Week #</label>
                  <input type="number" value={newGame.week} onChange={(e) => handleFieldChange('week', e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500" placeholder="1" min="1" max={WEEKS_COUNT} />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Date</label>
                  <input type="date" value={newGame.date} onChange={(e) => handleFieldChange('date', e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500" />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Opponent</label>
                <input value={newGame.opponent} onChange={(e) => handleFieldChange('opponent', e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500" placeholder="Team name..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Result</label>
                  <select value={newGame.result} onChange={(e) => handleFieldChange('result', e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500">
                    <option value="W">Win</option>
                    <option value="L">Loss</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Position</label>
                  <select value={newGame.position} onChange={(e) => handleFieldChange('position', e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500">
                    {sportConfig.positions.map((pos) => (
                      <option key={pos.code} value={pos.code}>{pos.code} - {pos.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gameLogFields.map((field) => (
                  <div key={field.key}>
                    <label className="text-xs text-neutral-400 block mb-1">{field.label}</label>
                    <input type="number" value={newGame[field.key] || ''} onChange={(e) => handleFieldChange(field.key, e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500" placeholder="0" step={field.type === 'percent' || field.type === 'decimal' ? '0.1' : '1'} />
                  </div>
                ))}
              </div>

              <button onClick={addGame} className="w-full px-4 py-2 rounded-lg bg-[#c8ff00] text-black text-sm font-medium hover:bg-[#b8ef00] transition-colors">Save Game</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Games', value: stats.total, color: 'text-white' },
            { label: 'Wins', value: `${stats.wins}W`, color: 'text-green-400' },
            { label: 'Losses', value: `${stats.losses}L`, color: 'text-red-400' },
            { label: 'Win Rate', value: `${stats.winPct}%`, color: 'text-white' },
          ].map((s) => (
            <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
              <div className={cn('text-xl font-bold', s.color)}>{s.value}</div>
              <div className="text-xs text-neutral-500">{s.label}</div>
            </div>
          ))}
          {gameLogFields.slice(0, 2).map((field) => (
            <div key={field.key} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold" style={{ color: sportConfig.color }}>{stats.fieldAverages[field.key]}</div>
              <div className="text-xs text-neutral-500">Avg {field.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Game Log Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
        <div className="p-4 border-b border-neutral-800">
          <h3 className="text-white text-lg font-semibold">{WEEKS_COUNT}-Week Season Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-3 px-3 text-neutral-400 font-medium">Wk</th>
                <th className="text-left py-3 px-3 text-neutral-400 font-medium">Date</th>
                <th className="text-left py-3 px-3 text-neutral-400 font-medium">Opponent</th>
                <th className="text-center py-3 px-3 text-neutral-400 font-medium">W/L</th>
                <th className="text-center py-3 px-3 text-neutral-400 font-medium">Pos</th>
                {gameLogFields.map((field) => (
                  <th key={field.key} className="text-center py-3 px-3 text-neutral-400 font-medium">{field.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {games.length > 0 ? (
                games.map((game, i) => (
                  <tr key={i} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                    <td className="py-2 px-3 text-neutral-400">{game.week}</td>
                    <td className="py-2 px-3 text-neutral-400">{game.date}</td>
                    <td className="py-2 px-3 text-neutral-300">{game.opponent}</td>
                    <td className={cn('py-2 px-3 text-center font-bold', game.result === 'W' ? 'text-green-400' : 'text-red-400')}>{game.result}</td>
                    <td className="py-2 px-3 text-center text-neutral-400">{game.position}</td>
                    {gameLogFields.map((field) => (
                      <td key={field.key} className="py-2 px-3 text-center text-neutral-300">{game[field.key] || '-'}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5 + gameLogFields.length} className="py-12 text-center text-neutral-500">
                    No games logged yet. Click &quot;+ Add Game&quot; to start tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
