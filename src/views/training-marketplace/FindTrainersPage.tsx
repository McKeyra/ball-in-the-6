'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Search, Star, MapPin, DollarSign, Filter, SortAsc, Users } from 'lucide-react';

interface TrainerProfile {
  id: string;
  name?: string;
  photo_url?: string;
  sports?: string[];
  specializations?: string[];
  avg_rating?: number;
  total_reviews?: number;
  hourly_rate?: number;
  location_types?: string[];
}

const SPORTS_FILTER = ['All Sports', 'Basketball', 'Soccer', 'Football', 'Baseball', 'Hockey', 'Track & Field', 'Swimming', 'Volleyball', 'Tennis'] as const;
const SPECIALIZATIONS_FILTER = ['All', 'Shooting', 'Ball Handling', 'Strength & Conditioning', 'Speed Training', 'Agility', 'Positional Training', 'Game IQ', 'Film Study', 'Recovery & Mobility'] as const;
const SORT_OPTIONS = [{ value: 'rating', label: 'Highest Rated' }, { value: 'price_low', label: 'Price: Low to High' }, { value: 'price_high', label: 'Price: High to Low' }, { value: 'reviews', label: 'Most Reviews' }] as const;
const LOCATION_LABELS: Record<string, string> = { facility: 'Facility', client: 'Mobile', virtual: 'Virtual', public: 'Public' };

function renderStars(rating: number): React.ReactElement[] {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars: React.ReactElement[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push(<Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />);
    else if (i === full && half) stars.push(<Star key={i} className="w-3.5 h-3.5 fill-yellow-400/50 text-yellow-400" />);
    else stars.push(<Star key={i} className="w-3.5 h-3.5 text-slate-600" />);
  }
  return stars;
}

function TrainerCard({ trainer }: { trainer: TrainerProfile }): React.ReactElement {
  const rating = trainer.avg_rating || 0;
  const locationTypes = trainer.location_types || [];
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-red-600/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {trainer.photo_url ? <img src={trainer.photo_url} alt={trainer.name} className="w-full h-full object-cover" /> : <span className="text-lg font-bold text-red-400">{(trainer.name || 'T').charAt(0).toUpperCase()}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{trainer.name}</p>
          <div className="flex items-center gap-1 mt-0.5">{renderStars(rating)}<span className="text-xs text-slate-400 ml-1">{rating.toFixed(1)} ({trainer.total_reviews || 0})</span></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {(trainer.sports || []).map((sport) => (<span key={sport} className="border border-red-600/30 text-red-400 text-[10px] px-2 py-0.5 rounded-full">{sport}</span>))}
      </div>
      <div className="flex flex-wrap gap-1">
        {(trainer.specializations || []).slice(0, 3).map((spec) => (<span key={spec} className="border border-slate-700 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">{spec}</span>))}
        {(trainer.specializations || []).length > 3 && <span className="border border-slate-700 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">+{(trainer.specializations || []).length - 3}</span>}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <div className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="w-3 h-3" />{locationTypes.map((t) => LOCATION_LABELS[t] || t).join(', ') || 'TBD'}</div>
        <div className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-green-400" /><span className="text-sm font-bold text-white">${trainer.hourly_rate || 0}</span><span className="text-xs text-slate-500">/hr</span></div>
      </div>
      <button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition-colors">View Profile & Book</button>
    </div>
  );
}

export function FindTrainersPage(): React.ReactElement {
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('All Sports');
  const [specFilter, setSpecFilter] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const { data: trainers = [], isLoading } = useQuery<TrainerProfile[]>({
    queryKey: ['trainers', 'public'],
    queryFn: async () => { /* TODO: fetch('/api/training/trainers?status=approved') */ return []; },
  });

  const filtered = useMemo(() => {
    let results = [...trainers];
    if (search.trim()) { const q = search.toLowerCase(); results = results.filter((t) => (t.name || '').toLowerCase().includes(q) || (t.sports || []).some((s) => s.toLowerCase().includes(q))); }
    if (sportFilter !== 'All Sports') results = results.filter((t) => (t.sports || []).includes(sportFilter));
    if (specFilter !== 'All') results = results.filter((t) => (t.specializations || []).includes(specFilter));
    if (minRating > 0) results = results.filter((t) => (t.avg_rating || 0) >= minRating);
    results = results.filter((t) => (t.hourly_rate || 0) >= priceRange[0] && (t.hourly_rate || 0) <= priceRange[1]);
    switch (sortBy) {
      case 'rating': results.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0)); break;
      case 'price_low': results.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0)); break;
      case 'price_high': results.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0)); break;
      case 'reviews': results.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0)); break;
    }
    return results;
  }, [trainers, search, sportFilter, specFilter, minRating, priceRange, sortBy]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Find a Trainer</h1><p className="text-slate-400 text-sm mt-1">Browse {trainers.length} certified trainers in your area.</p></div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, sport, or specialization..." className="w-full bg-slate-900 border border-slate-800 text-white pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none" /></div>
        <button className={cn('flex items-center px-3 py-2 rounded-lg text-sm font-medium border transition-colors', showFilters ? 'border-red-600 text-red-400' : 'border-slate-700 text-slate-300')} onClick={() => setShowFilters(!showFilters)}><Filter className="w-4 h-4 mr-1" /> Filters</button>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-[180px] bg-slate-900 border border-slate-800 text-white text-sm rounded-lg px-3 py-2">{SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>
      </div>
      {showFilters && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2"><label className="text-xs font-medium text-slate-400">Sport</label><select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2">{SPORTS_FILTER.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
            <div className="space-y-2"><label className="text-xs font-medium text-slate-400">Specialization</label><select value={specFilter} onChange={(e) => setSpecFilter(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2">{SPECIALIZATIONS_FILTER.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
            <div className="space-y-2"><label className="text-xs font-medium text-slate-400">Min Rating: {minRating > 0 ? `${minRating}+` : 'Any'}</label><div className="flex items-center gap-2 pt-1">{[0, 3, 3.5, 4, 4.5].map((r) => (<button key={r} onClick={() => setMinRating(r)} className={cn('px-2 py-1 rounded text-xs transition-colors', minRating === r ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700')}>{r === 0 ? 'Any' : `${r}+`}</button>))}</div></div>
            <div className="space-y-2"><label className="text-xs font-medium text-slate-400">Price: ${priceRange[0]} - ${priceRange[1]}</label><input type="range" min="0" max="200" step="5" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full mt-3" /></div>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3"><div className="flex items-center gap-3"><div className="w-14 h-14 rounded-full bg-slate-800 animate-pulse" /><div className="flex-1 space-y-2"><div className="h-4 w-32 bg-slate-800 rounded animate-pulse" /><div className="h-3 w-20 bg-slate-800 rounded animate-pulse" /></div></div><div className="h-3 w-full bg-slate-800 rounded animate-pulse" /><div className="h-8 w-full bg-slate-800 rounded animate-pulse" /></div>))}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg py-12 text-center"><Users className="w-12 h-12 text-slate-600 mx-auto mb-3" /><h3 className="text-lg font-medium text-white mb-1">No Trainers Found</h3><p className="text-sm text-slate-400">Try adjusting your filters or search terms.</p></div>
      ) : (
        <><p className="text-sm text-slate-400">{filtered.length} trainer{filtered.length !== 1 ? 's' : ''} found</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map((trainer) => (<TrainerCard key={trainer.id} trainer={trainer} />))}</div></>
      )}
    </div>
  );
}
