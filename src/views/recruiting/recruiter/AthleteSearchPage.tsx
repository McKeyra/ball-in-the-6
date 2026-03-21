'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { AthleteCard } from '@/components/recruiting/AthleteCard';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Users,
} from 'lucide-react';

// TODO: Replace with actual API route

interface AthleteData {
  id: string;
  name?: string;
  photo_url?: string;
  position?: string;
  height_ft?: number;
  height_in?: number;
  weight?: number;
  school?: string;
  city?: string;
  stat_line?: string;
  vance_rating?: number;
  is_verified?: boolean;
  is_committed?: boolean;
  committed_to?: string;
  graduation_year?: number;
  sport?: string;
  gender?: string;
  has_video?: boolean;
  videos?: unknown[];
  created_date?: string;
  profile_views?: number;
  gpa?: number;
}

const SPORTS = [
  { value: 'all', label: 'All Sports' },
  { value: 'Basketball', label: 'Basketball' },
  { value: 'Soccer', label: 'Soccer' },
  { value: 'Football', label: 'Football' },
  { value: 'Baseball', label: 'Baseball' },
  { value: 'Hockey', label: 'Hockey' },
  { value: 'Track & Field', label: 'Track & Field' },
  { value: 'Swimming', label: 'Swimming' },
  { value: 'Volleyball', label: 'Volleyball' },
  { value: 'Tennis', label: 'Tennis' },
] as const;

const BASKETBALL_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'] as const;
const SOCCER_POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'] as const;
const FOOTBALL_POSITIONS = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K'] as const;
const HOCKEY_POSITIONS = ['C', 'LW', 'RW', 'D', 'G'] as const;

const POSITION_MAP: Record<string, readonly string[]> = {
  Basketball: BASKETBALL_POSITIONS,
  Soccer: SOCCER_POSITIONS,
  Football: FOOTBALL_POSITIONS,
  Hockey: HOCKEY_POSITIONS,
};

const GRAD_YEARS = ['2025', '2026', '2027', '2028', '2029', '2030'] as const;

const SORT_OPTIONS = [
  { value: 'vance_desc', label: 'Vance Rating (High)' },
  { value: 'vance_asc', label: 'Vance Rating (Low)' },
  { value: 'newest', label: 'Newest' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'height', label: 'Tallest' },
  { value: 'gpa', label: 'Highest GPA' },
] as const;

export function AthleteSearchPage(): React.ReactElement {
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('all');
  const [position, setPosition] = useState('all');
  const [gradYear, setGradYear] = useState('all');
  const [gender, setGender] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hasVideoOnly, setHasVideoOnly] = useState(false);
  const [sortBy, setSortBy] = useState('vance_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  const { data: athletes = [], isLoading } = useQuery<AthleteData[]>({
    queryKey: ['recruiting', 'athlete-search'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/recruiting/athletes')
      return [];
    },
  });

  const positions = sport !== 'all' ? (POSITION_MAP[sport] || []) : [];

  const filtered = useMemo(() => {
    let results = [...athletes];

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (a) =>
          (a.name || '').toLowerCase().includes(q) ||
          (a.school || '').toLowerCase().includes(q) ||
          (a.city || '').toLowerCase().includes(q) ||
          (a.position || '').toLowerCase().includes(q)
      );
    }

    if (sport !== 'all') results = results.filter((a) => a.sport === sport);
    if (position !== 'all') results = results.filter((a) => a.position === position);
    if (gradYear !== 'all') results = results.filter((a) => String(a.graduation_year) === gradYear);
    if (gender !== 'all') results = results.filter((a) => a.gender === gender);
    if (verifiedOnly) results = results.filter((a) => a.is_verified);
    if (hasVideoOnly) results = results.filter((a) => a.has_video || ((a.videos as unknown[]) ?? []).length > 0);

    switch (sortBy) {
      case 'vance_desc':
        results.sort((a, b) => (b.vance_rating || 0) - (a.vance_rating || 0));
        break;
      case 'vance_asc':
        results.sort((a, b) => (a.vance_rating || 0) - (b.vance_rating || 0));
        break;
      case 'newest':
        results.sort((a, b) => (b.created_date || '').localeCompare(a.created_date || ''));
        break;
      case 'views':
        results.sort((a, b) => (b.profile_views || 0) - (a.profile_views || 0));
        break;
      case 'height': {
        const toInches = (a: AthleteData): number => ((a.height_ft || 0) * 12) + (a.height_in || 0);
        results.sort((a, b) => toInches(b) - toInches(a));
        break;
      }
      case 'gpa':
        results.sort((a, b) => (b.gpa || 0) - (a.gpa || 0));
        break;
    }

    return results;
  }, [athletes, search, sport, position, gradYear, gender, verifiedOnly, hasVideoOnly, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Athlete Search</h1>
        <p className="text-slate-400 text-sm mt-1">Find athletes using advanced filters and Vance AI ratings.</p>
      </div>

      {/* Search + Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, school, city, or position..."
            className="w-full bg-slate-900 border border-slate-800 text-white pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:border-slate-600"
          />
        </div>
        <button
          className={cn(
            'flex items-center px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
            showFilters ? 'border-red-600 text-red-400' : 'border-slate-700 text-slate-300'
          )}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-1" /> Filters
        </button>
        <div className="flex items-center border border-slate-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 transition-colors',
              viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 transition-colors',
              viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Sport</label>
              <select
                value={sport}
                onChange={(e) => { setSport(e.target.value); setPosition('all'); }}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2"
              >
                {SPORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                disabled={positions.length === 0}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 disabled:opacity-50"
              >
                <option value="all">All Positions</option>
                {positions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Grad Year</label>
              <select
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2"
              >
                <option value="all">All Years</option>
                {GRAD_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2"
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="space-y-2 pt-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="rounded" />
                Verified Only
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked={hasVideoOnly} onChange={(e) => setHasVideoOnly(e.target.checked)} className="rounded" />
                Has Video
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {filtered.length} athlete{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-2'
        )}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={cn('bg-slate-800 rounded-lg animate-pulse', viewMode === 'grid' ? 'h-48' : 'h-16')} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg py-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">No Athletes Found</h3>
          <p className="text-sm text-slate-400">Try adjusting your search criteria or filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((athlete) => (
            <AthleteCard key={athlete.id} athlete={athlete} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((athlete) => (
            <AthleteCard key={athlete.id} athlete={athlete} variant="list" />
          ))}
        </div>
      )}
    </div>
  );
}