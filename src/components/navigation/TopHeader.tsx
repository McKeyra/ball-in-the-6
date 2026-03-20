'use client';

import Link from 'next/link';
import { Bell, Search, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const FILTERS = ['For You', 'Plays', 'Games', 'Courts', 'Trending'] as const;

interface TopHeaderProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <header className="sticky top-0 z-40 bg-void/80 backdrop-blur-2xl border-b border-neutral-200/60">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime">
            <Zap className="h-4 w-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Ball in the 6</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/search" className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60" aria-label="Search">
            <Search className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
          </Link>
          <Link href="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_6px_rgba(200,255,0,0.6)]" />
          </Link>
        </div>
      </div>
      <nav className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-3">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button key={filter} type="button" onClick={() => onFilterChange(filter)} className={cn('shrink-0 rounded-full px-4 py-1.5 text-xs transition-all duration-200', isActive ? 'bg-lime font-black text-black' : 'font-bold text-neutral-400 hover:text-neutral-600')}>
              {filter}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
