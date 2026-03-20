'use client';

import { useState } from 'react';
import { Search, MapPin, Activity, Star } from 'lucide-react';
import { COURTS } from '@/lib/mock-data';
import { CourtDashboard } from '@/components/court/CourtDashboard';

const CourtCard: React.FC<{ court: (typeof COURTS)[number] }> = ({ court }) => (
  <div className="overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-200">
    <div className="relative aspect-[16/9] bg-gradient-to-br from-neutral-800 to-neutral-900">
      {court.hot && <span className="absolute top-3 left-3 rounded-full bg-red-500/90 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-neutral-900 backdrop-blur-sm">HOT</span>}
      <span className="absolute top-3 right-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neutral-700 backdrop-blur-sm border border-neutral-200">{court.type === 'indoor' ? 'Indoor' : 'Outdoor'}</span>
    </div>
    <div className="p-4">
      <h3 className="text-sm font-black text-neutral-900">{court.name}</h3>
      <p className="text-[10px] font-mono text-neutral-400">{court.area}</p>
      <div className="mt-3 flex items-center gap-4 text-xs text-neutral-600">
        <span>{court.courts} courts</span>
        <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-[#c8ff00]" />{court.activePlayers} active</span>
        <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400" fill="currentColor" />{court.rating}</span>
      </div>
      <p className="mt-2 text-xs text-neutral-500">{court.address}</p>
    </div>
  </div>
);

export const CourtsPage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const totalActive = COURTS.reduce((sum, c) => sum + c.activePlayers, 0);
  const filtered = COURTS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.area.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-neutral-200/60 px-4 pt-4 pb-3">
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Courts</h1>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-neutral-100/60 px-3 py-2.5">
          <Search className="h-4 w-4 text-neutral-500 shrink-0" />
          <input type="text" placeholder="Search courts..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none" />
        </div>
      </div>
      <div className="mx-auto max-w-xl px-4 pt-4">
        <div className="mb-3 flex items-center justify-between rounded-xl border border-[#c8ff00]/10 bg-[#c8ff00]/5 px-4 py-3">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-[#c8ff00]" /><span className="text-sm font-black text-[#c8ff00]">{totalActive} Active Players</span></div>
          <span className="text-[10px] font-mono text-neutral-500">across all courts</span>
        </div>
        <button type="button" className="mb-4 flex items-center gap-1.5 rounded-full border border-[#c8ff00]/20 px-3 py-1.5 text-xs font-bold text-[#c8ff00] transition-colors hover:bg-[#c8ff00]/5"><MapPin className="h-3 w-3" />Near Me</button>
        <div className="space-y-3">
          {filtered.map((court) => <CourtCard key={court.id} court={court} />)}
          {filtered.length === 0 && <p className="pt-12 text-center text-sm text-neutral-400">No courts found.</p>}
        </div>

        {/* Shot Charts Section */}
        <div className="mt-8 border-t border-neutral-200 pt-6">
          <CourtDashboard />
        </div>
      </div>
    </div>
  );
};
