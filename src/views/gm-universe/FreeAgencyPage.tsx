'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const SALARY_CAP = 136000000;
const CURRENT_USED = 118500000;

interface FreeAgent {
  id: string;
  name: string;
  position: string;
  age: number;
  overall: number;
  asking: number;
  tier: string;
}

interface SignedPlayer extends FreeAgent {
  signedFor: number;
  years: number;
}

const FREE_AGENTS: FreeAgent[] = [
  { id: 'fa1', name: 'Lauri Markkanen', position: 'PF', age: 27, overall: 84, asking: 35000000, tier: 'max' },
  { id: 'fa2', name: 'Miles Bridges', position: 'SF', age: 26, overall: 80, asking: 22000000, tier: 'starter' },
  { id: 'fa3', name: 'Thomas Bryant', position: 'C', age: 27, overall: 74, asking: 8000000, tier: 'rotation' },
  { id: 'fa4', name: 'Markelle Fultz', position: 'PG', age: 26, overall: 73, asking: 10000000, tier: 'rotation' },
  { id: 'fa5', name: 'Torrey Craig', position: 'SF', age: 34, overall: 72, asking: 5000000, tier: 'bench' },
  { id: 'fa6', name: 'T.J. McConnell', position: 'PG', age: 33, overall: 72, asking: 6000000, tier: 'bench' },
  { id: 'fa7', name: 'Kentavious Caldwell-Pope', position: 'SG', age: 31, overall: 76, asking: 14000000, tier: 'starter' },
  { id: 'fa8', name: 'Nic Claxton', position: 'C', age: 25, overall: 78, asking: 20000000, tier: 'starter' },
  { id: 'fa9', name: 'Kyle Anderson', position: 'SF', age: 31, overall: 74, asking: 9000000, tier: 'rotation' },
  { id: 'fa10', name: 'Patrick Beverley', position: 'PG', age: 36, overall: 68, asking: 3000000, tier: 'bench' },
  { id: 'fa11', name: 'Andre Drummond', position: 'C', age: 31, overall: 71, asking: 5000000, tier: 'bench' },
  { id: 'fa12', name: 'Monte Morris', position: 'PG', age: 29, overall: 73, asking: 7000000, tier: 'rotation' },
];

const POSITION_FILTER = ['All', 'PG', 'SG', 'SF', 'PF', 'C'] as const;

export function FreeAgencyPage(): React.ReactElement {
  const [posFilter, setPosFilter] = useState('All');
  const [sortBy, setSortBy] = useState('overall');
  const [signedPlayers, setSignedPlayers] = useState<SignedPlayer[]>([]);
  const [offerDialog, setOfferDialog] = useState<FreeAgent | null>(null);
  const [offerAmount, setOfferAmount] = useState<number[]>([0]);
  const [offerYears, setOfferYears] = useState(1);

  const usedCap = CURRENT_USED + signedPlayers.reduce((s, p) => s + p.signedFor, 0);
  const remainingCap = SALARY_CAP - usedCap;

  const availableAgents = useMemo(() => {
    const signedIds = new Set(signedPlayers.map((p) => p.id));
    let filtered = FREE_AGENTS.filter((p) => !signedIds.has(p.id));
    if (posFilter !== 'All') filtered = filtered.filter((p) => p.position === posFilter);
    filtered.sort((a, b) => {
      if (sortBy === 'overall') return b.overall - a.overall;
      if (sortBy === 'age') return a.age - b.age;
      if (sortBy === 'asking') return a.asking - b.asking;
      return 0;
    });
    return filtered;
  }, [posFilter, sortBy, signedPlayers]);

  const openOffer = useCallback((player: FreeAgent) => {
    setOfferDialog(player);
    setOfferAmount([Math.round(player.asking * 0.9)]);
    setOfferYears(2);
  }, []);

  const submitOffer = useCallback(() => {
    if (!offerDialog) return;
    const offer = offerAmount[0];
    const accepted = offer >= offerDialog.asking * 0.85;

    if (accepted && offer <= remainingCap) {
      setSignedPlayers((prev) => [...prev, { ...offerDialog, signedFor: offer, years: offerYears }]);
    }

    setOfferDialog(null);
  }, [offerDialog, offerAmount, offerYears, remainingCap]);

  const canAfford = (salary: number): boolean => salary <= remainingCap;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Free Agency</h1>
        <div className="text-right">
          <span className={cn('text-xs font-bold', remainingCap > 15000000 ? 'text-emerald-400' : remainingCap > 5000000 ? 'text-amber-400' : 'text-red-400')}>
            ${(remainingCap / 1000000).toFixed(1)}M cap space
          </span>
        </div>
      </div>

      {signedPlayers.length > 0 && (
        <Card className="bg-emerald-900/20 border-emerald-800/30">
          <CardContent className="p-3">
            <h3 className="text-xs font-semibold text-emerald-400 mb-2">Signed This Session</h3>
            <div className="flex flex-wrap gap-2">
              {signedPlayers.map((p) => (
                <div key={p.id} className="bg-emerald-800/20 border border-emerald-700/30 rounded px-2 py-1">
                  <span className="text-xs text-emerald-300">{p.name}</span>
                  <span className="text-[10px] text-emerald-500 ml-1">${(p.signedFor / 1000000).toFixed(1)}M/{p.years}yr</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1">
          {POSITION_FILTER.map((pos) => (
            <button key={pos} onClick={() => setPosFilter(pos)} className={cn('px-2.5 py-1 rounded text-xs font-medium transition-all', posFilter === pos ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700')}>
              {pos}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          {[{ key: 'overall', label: 'Rating' }, { key: 'age', label: 'Age' }, { key: 'asking', label: 'Price' }].map((opt) => (
            <button key={opt.key} onClick={() => setSortBy(opt.key)} className={cn('px-2 py-1 rounded text-[10px] font-medium transition-all', sortBy === opt.key ? 'bg-slate-700 text-white' : 'bg-slate-800/50 text-slate-500')}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left py-2 px-2 text-slate-500">Player</th>
              <th className="text-center py-2 px-1 text-slate-500">POS</th>
              <th className="text-center py-2 px-1 text-slate-500">AGE</th>
              <th className="text-center py-2 px-1 text-slate-500">OVR</th>
              <th className="text-right py-2 px-2 text-slate-500">Asking</th>
              <th className="text-right py-2 px-2 text-slate-500"></th>
            </tr>
          </thead>
          <tbody>
            {availableAgents.map((player) => (
              <tr key={player.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="py-2.5 px-2 text-white font-medium">{player.name}</td>
                <td className="py-2.5 px-1 text-center text-slate-400">{player.position}</td>
                <td className="py-2.5 px-1 text-center text-slate-400">{player.age}</td>
                <td className="py-2.5 px-1 text-center">
                  <span className={cn('font-bold', player.overall >= 80 ? 'text-emerald-400' : player.overall >= 75 ? 'text-amber-400' : 'text-slate-400')}>{player.overall}</span>
                </td>
                <td className="py-2.5 px-2 text-right text-slate-300 font-mono">${(player.asking / 1000000).toFixed(1)}M</td>
                <td className="py-2.5 px-2 text-right">
                  <Button onClick={() => openOffer(player)} disabled={!canAfford(player.asking * 0.85)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] h-6 px-2" size="sm">Sign</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-2">
        {availableAgents.map((player) => (
          <Card key={player.id} className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('text-lg font-bold', player.overall >= 80 ? 'text-emerald-400' : player.overall >= 75 ? 'text-amber-400' : 'text-slate-400')}>{player.overall}</span>
                  <div>
                    <p className="text-xs text-white font-medium">{player.name}</p>
                    <p className="text-[10px] text-slate-500">{player.position} | Age {player.age}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">${(player.asking / 1000000).toFixed(1)}M</span>
                  <Button onClick={() => openOffer(player)} disabled={!canAfford(player.asking * 0.85)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] h-6 px-2" size="sm">Sign</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableAgents.length === 0 && (
        <div className="text-center py-12"><p className="text-slate-500 text-sm">No free agents match your filters.</p></div>
      )}

      <Dialog open={!!offerDialog} onOpenChange={() => setOfferDialog(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Sign {offerDialog?.name}</DialogTitle>
            <DialogDescription className="text-slate-400">{offerDialog?.position} | Age {offerDialog?.age} | OVR {offerDialog?.overall}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Annual Salary</span>
                <span className="text-white font-bold font-mono">${(offerAmount[0] / 1000000).toFixed(1)}M</span>
              </div>
              <Slider value={offerAmount} onValueChange={setOfferAmount} min={Math.round((offerDialog?.asking ?? 0) * 0.5)} max={Math.round((offerDialog?.asking ?? 0) * 1.3)} step={500000} className="w-full" />
              <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                <span>Min: ${((offerDialog?.asking ?? 0) * 0.5 / 1000000).toFixed(1)}M</span>
                <span>Asking: ${((offerDialog?.asking ?? 0) / 1000000).toFixed(1)}M</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 mb-2 block">Contract Length</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((y) => (
                  <button key={y} onClick={() => setOfferYears(y)} className={cn('flex-1 py-1.5 rounded text-xs font-medium transition-all', offerYears === y ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400')}>{y}yr</button>
                ))}
              </div>
            </div>
            {offerAmount[0] > remainingCap && <p className="text-[10px] text-red-400">Exceeds available cap space by ${((offerAmount[0] - remainingCap) / 1000000).toFixed(1)}M</p>}
            {offerAmount[0] < (offerDialog?.asking ?? 0) * 0.85 && <p className="text-[10px] text-amber-400">Offer may be too low. Player is asking for ${((offerDialog?.asking ?? 0) / 1000000).toFixed(1)}M.</p>}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOfferDialog(null)} className="border-slate-700 text-slate-300 hover:bg-slate-800" size="sm">Cancel</Button>
            <Button onClick={submitOffer} disabled={offerAmount[0] > remainingCap} className="bg-red-600 hover:bg-red-700 text-white" size="sm">Submit Offer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
