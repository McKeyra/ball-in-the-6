'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Hash,
  MapPin,
  Trophy,
  User,
  FileText,
  ArrowLeft,
  Command,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import { PLAYERS, COURTS, GAMES, TRENDING_TAGS } from '@/lib/mock-data';
import Link from 'next/link';

const FILTER_TABS = ['All', 'Players', 'Courts', 'Games', 'Posts'] as const;
type FilterTab = (typeof FILTER_TABS)[number];

interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

const MOCK_POSTS = [
  { id: 'sp-1', author: 'McKeyra', handle: '@mr_ballinthe6', content: 'Ankle breaker into a stepback three at Pan Am.', score: 342, time: '2h ago' },
  { id: 'sp-2', author: 'CourtKing_99', handle: '@courtking_99', content: 'Full-court press break to a no-look dime. Scarborough runs.', score: 218, time: '3h ago' },
  { id: 'sp-3', author: 'Toronto Hoops', handle: '@toronto_hoops', content: 'Summer league registrations are OPEN. 32 teams.', score: 624, time: '10h ago' },
  { id: 'sp-4', author: 'SixMan', handle: '@sixman_hoops', content: "Who's really the best PG in the 6ix right now?", score: 289, time: '8h ago' },
  { id: 'sp-5', author: 'DunkCity', handle: '@dunkcity_to', content: 'Caught a body at Cherry Beach. Poster of the summer.', score: 512, time: '5h ago' },
];

const RECENT_SEARCHES_KEY = 'bit6_recent_searches';
const MAX_RECENT = 8;

const getRecentSearches = (): RecentSearch[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as RecentSearch[]) : [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (query: string): void => {
  const searches = getRecentSearches().filter((s) => s.query !== query);
  searches.unshift({ id: crypto.randomUUID(), query, timestamp: Date.now() });
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, MAX_RECENT)));
};

const clearRecentSearches = (): void => {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
};

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      if (query.trim().length > 0) {
        saveRecentSearch(query.trim());
        setRecentSearches(getRecentSearches());
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleClearRecent = useCallback((): void => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const handleRecentClick = useCallback((q: string): void => {
    setQuery(q);
    inputRef.current?.focus();
  }, []);

  const hasResults = debouncedQuery.length > 0;
  const lowerQ = debouncedQuery.toLowerCase();

  const filteredPlayers = PLAYERS.filter(
    (p) => p.name.toLowerCase().includes(lowerQ) || p.handle.toLowerCase().includes(lowerQ)
  );
  const filteredCourts = COURTS.filter(
    (c) => c.name.toLowerCase().includes(lowerQ) || c.area.toLowerCase().includes(lowerQ)
  );
  const filteredGames = GAMES.filter(
    (g) => g.teamA.name.toLowerCase().includes(lowerQ) || g.teamB.name.toLowerCase().includes(lowerQ) || g.venue.toLowerCase().includes(lowerQ)
  );
  const filteredPosts = MOCK_POSTS.filter(
    (p) => p.author.toLowerCase().includes(lowerQ) || p.content.toLowerCase().includes(lowerQ)
  );

  const totalResults = filteredPlayers.length + filteredCourts.length + filteredGames.length + filteredPosts.length;

  const showPlayers = activeTab === 'All' || activeTab === 'Players';
  const showCourts = activeTab === 'All' || activeTab === 'Courts';
  const showGames = activeTab === 'All' || activeTab === 'Games';
  const showPosts = activeTab === 'All' || activeTab === 'Posts';

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-void/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="flex items-center gap-3 px-4 pt-3 pb-3">
          <Link href="/" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60">
            <ArrowLeft className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" strokeWidth={2} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search players, courts, games..."
              className={cn(
                'w-full rounded-[14px] border bg-surface py-2.5 pl-10 pr-20 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-200',
                isFocused ? 'border-lime shadow-[0_0_0_3px_rgba(200,255,0,0.15)]' : 'border-black/[0.06]'
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {query.length > 0 ? (
                <button type="button" onClick={() => setQuery('')} className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200/60 transition-colors hover:bg-neutral-300/60">
                  <X className="h-3 w-3 text-neutral-500" strokeWidth={2.5} />
                </button>
              ) : (
                <span className="hidden items-center gap-0.5 rounded-md border border-black/[0.06] bg-white px-1.5 py-0.5 text-[10px] font-bold text-neutral-400 sm:flex">
                  <Command className="h-2.5 w-2.5" /> K
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Filter tabs - show when results exist */}
        {hasResults && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-3"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-1.5 text-xs transition-all duration-200',
                    isActive ? 'bg-lime font-black text-black' : 'font-bold text-neutral-400 hover:text-neutral-600'
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </motion.nav>
        )}
      </motion.header>

      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          {/* Empty state — no query */}
          {!hasResults && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <section className="mb-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-400">
                      <Clock className="h-3.5 w-3.5" /> Recent
                    </h2>
                    <button type="button" onClick={handleClearRecent} className="text-[11px] font-bold text-neutral-400 hover:text-neutral-600 transition-colors">
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, i) => (
                      <motion.button
                        key={search.id}
                        type="button"
                        onClick={() => handleRecentClick(search.query)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors hover:bg-surface"
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0 text-neutral-300" />
                        <span className="text-sm font-medium text-neutral-700">{search.query}</span>
                      </motion.button>
                    ))}
                  </div>
                </section>
              )}

              {/* Trending Tags */}
              <section className="mb-6">
                <h2 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-400">
                  <TrendingUp className="h-3.5 w-3.5" /> Trending
                </h2>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map((tag, i) => (
                    <motion.button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag.replace('#', ''))}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-xs font-bold text-neutral-600 transition-all hover:border-lime hover:bg-lime-dim hover:text-lime-dark"
                    >
                      <Hash className="h-3 w-3 text-lime-dark" />
                      {tag.replace('#', '')}
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Suggested */}
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-400">
                  <Flame className="h-3.5 w-3.5" /> Popular Players
                </h2>
                <div className="space-y-1">
                  {PLAYERS.slice(0, 4).map((player, i) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition-colors hover:bg-surface"
                    >
                      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-black text-white', player.color)}>
                        {player.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-neutral-900 truncate">{player.name}</span>
                          {player.verified && <CheckCircle className="h-3.5 w-3.5 shrink-0 text-lime-dark" fill="#C8FF00" />}
                        </div>
                        <span className="text-xs text-neutral-400">{player.handle}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-neutral-400">{formatNumber(player.impactScore)}</span>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* Results */}
          {hasResults && totalResults > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <p className="text-xs font-bold text-neutral-400">
                {totalResults} result{totalResults !== 1 ? 's' : ''} for &ldquo;{debouncedQuery}&rdquo;
              </p>

              {/* Players */}
              {showPlayers && filteredPlayers.length > 0 && (
                <section>
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-400">
                    <User className="h-3.5 w-3.5" /> Players
                  </h3>
                  <div className="space-y-1">
                    {filteredPlayers.map((player, i) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition-colors hover:bg-surface"
                      >
                        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-black text-white', player.color)}>
                          {player.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-neutral-900 truncate">{player.name}</span>
                            {player.verified && <CheckCircle className="h-3.5 w-3.5 shrink-0 text-lime-dark" fill="#C8FF00" />}
                          </div>
                          <span className="text-xs text-neutral-400">{player.handle} &middot; Rank #{player.rank}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-neutral-900">{formatNumber(player.impactScore)}</span>
                          <p className="text-[10px] text-neutral-400">IMPACT</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Courts */}
              {showCourts && filteredCourts.length > 0 && (
                <section>
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-400">
                    <MapPin className="h-3.5 w-3.5" /> Courts
                  </h3>
                  <div className="space-y-1">
                    {filteredCourts.map((court, i) => (
                      <motion.div
                        key={court.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 rounded-[20px] border border-black/[0.06] bg-white p-3 transition-colors hover:border-lime/30"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-lime-dim">
                          <MapPin className="h-4 w-4 text-lime-dark" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-neutral-900 truncate">{court.name}</span>
                            {court.hot && <Flame className="h-3 w-3 shrink-0 text-accent-orange" />}
                          </div>
                          <span className="text-xs text-neutral-400">{court.area} &middot; {court.type} &middot; {court.courts} courts</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-lime-dark">{court.activePlayers}</span>
                          <p className="text-[10px] text-neutral-400">playing</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Games */}
              {showGames && filteredGames.length > 0 && (
                <section>
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-400">
                    <Trophy className="h-3.5 w-3.5" /> Games
                  </h3>
                  <div className="space-y-2">
                    {filteredGames.slice(0, 5).map((game, i) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-[20px] border border-black/[0.06] bg-white p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="h-6 w-6 rounded-full" style={{ backgroundColor: game.teamA.color }} />
                            <span className="text-sm font-bold text-neutral-900 truncate">{game.teamA.name}</span>
                            <span className="font-mono text-sm font-black text-neutral-900">{game.teamA.score}</span>
                          </div>
                          <span className={cn(
                            'mx-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase',
                            game.status === 'live' ? 'bg-accent-red/10 text-accent-red' : game.status === 'final' ? 'bg-neutral-100 text-neutral-500' : 'bg-lime-dim text-lime-dark'
                          )}>
                            {game.status === 'live' ? 'LIVE' : game.time}
                          </span>
                          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                            <span className="font-mono text-sm font-black text-neutral-900">{game.teamB.score}</span>
                            <span className="text-sm font-bold text-neutral-900 truncate">{game.teamB.name}</span>
                            <div className="h-6 w-6 rounded-full" style={{ backgroundColor: game.teamB.color }} />
                          </div>
                        </div>
                        <p className="mt-1.5 text-[11px] text-neutral-400">{game.venue}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Posts */}
              {showPosts && filteredPosts.length > 0 && (
                <section>
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-400">
                    <FileText className="h-3.5 w-3.5" /> Posts
                  </h3>
                  <div className="space-y-1">
                    {filteredPosts.map((post, i) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-[14px] px-3 py-2.5 transition-colors hover:bg-surface"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-neutral-900">{post.author}</span>
                          <span className="text-xs text-neutral-400">{post.handle}</span>
                          <span className="text-xs text-neutral-300">&middot; {post.time}</span>
                        </div>
                        <p className="text-sm text-neutral-600 leading-snug">{post.content}</p>
                        <div className="mt-1.5 flex items-center gap-3">
                          <span className="font-mono text-[11px] font-bold text-neutral-400">{post.score} impact</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {/* No results */}
          {hasResults && totalResults === 0 && (
            <motion.div
              key="noresults"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
                <Search className="h-7 w-7 text-neutral-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-bold text-neutral-900">No results found</h3>
              <p className="mt-1 max-w-[240px] text-sm text-neutral-400">
                Nothing matched &ldquo;{debouncedQuery}&rdquo;. Try a different search term or browse trending tags.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-4 rounded-2xl bg-lime px-6 py-2.5 text-xs font-black text-black transition-transform active:scale-95"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
