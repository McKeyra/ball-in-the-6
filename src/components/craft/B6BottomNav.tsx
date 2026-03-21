'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Trophy, Users, User, type LucideIcon } from 'lucide-react';

interface NavItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Games', icon: Trophy, path: '/games' },
  { name: 'Teams', icon: Users, path: '/teams' },
  { name: 'Profile', icon: User, path: '/profile' },
];

export function B6BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0f0f0f]/95 backdrop-blur-lg border-t border-white/[0.06]">
      <div className="pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-4 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors min-w-[64px] ${
                  isActive
                    ? 'text-[#c9a962]'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-[#c9a962]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
