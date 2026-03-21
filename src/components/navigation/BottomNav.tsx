'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Plus, MapPin, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MoreMenu } from '@/components/navigation/MoreMenu';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  isPost?: boolean;
  isMore?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Feed', icon: Home, path: '/' },
  { label: 'Games', icon: Trophy, path: '/games' },
  { label: 'Post', icon: Plus, path: '/compose', isPost: true },
  { label: 'Courts', icon: MapPin, path: '/courts' },
  { label: 'More', icon: Menu, path: '', isMore: true },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState<boolean>(false);

  const handleMoreOpen = useCallback((): void => {
    setMoreOpen(true);
  }, []);

  const handleMoreClose = useCallback((): void => {
    setMoreOpen(false);
  }, []);

  return (
    <>
      <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-2xl border-t border-neutral-200/60">
        <div className="mx-auto flex max-w-xl items-end justify-around px-2 pb-1 pt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            if (item.isPost) {
              return (
                <Link key="post" href={item.path} className="flex flex-col items-center gap-1">
                  <div className="-mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime shadow-[0_4px_20px_rgba(200,255,0,0.3)] transition-transform active:scale-95">
                    <Icon className="h-6 w-6 text-black" strokeWidth={2.5} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-300">
                    {item.label}
                  </span>
                </Link>
              );
            }

            if (item.isMore) {
              return (
                <button
                  key="more"
                  onClick={handleMoreOpen}
                  className="group flex flex-col items-center gap-1 py-1"
                  aria-label="Open navigation menu"
                >
                  <Icon
                    size={20}
                    strokeWidth={moreOpen ? 2.5 : 1.5}
                    className={cn(
                      'transition-colors duration-200',
                      moreOpen
                        ? 'text-lime-dark'
                        : 'text-neutral-300 group-hover:text-neutral-500'
                    )}
                  />
                  <span
                    className={cn(
                      'text-[9px] font-bold uppercase tracking-wider transition-colors duration-200',
                      moreOpen
                        ? 'text-lime-dark'
                        : 'text-neutral-300 group-hover:text-neutral-500'
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      'h-1 w-1 rounded-full transition-all duration-300',
                      moreOpen
                        ? 'bg-lime shadow-[0_0_6px_rgba(200,255,0,0.8)] opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </button>
              );
            }

            const isActive =
              item.path === '/'
                ? pathname === '/'
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className="group flex flex-col items-center gap-1 py-1"
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={cn(
                    'transition-colors duration-200',
                    isActive
                      ? 'text-lime-dark'
                      : 'text-neutral-300 group-hover:text-neutral-500'
                  )}
                />
                <span
                  className={cn(
                    'text-[9px] font-bold uppercase tracking-wider transition-colors duration-200',
                    isActive
                      ? 'text-lime-dark'
                      : 'text-neutral-300 group-hover:text-neutral-500'
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    'h-1 w-1 rounded-full transition-all duration-300',
                    isActive
                      ? 'bg-lime shadow-[0_0_6px_rgba(200,255,0,0.8)] opacity-100'
                      : 'opacity-0'
                  )}
                />
              </Link>
            );
          })}
        </div>
      </nav>

      <MoreMenu isOpen={moreOpen} onClose={handleMoreClose} />
    </>
  );
};
