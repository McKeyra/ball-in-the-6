'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import {
  User,
  Dumbbell,
  ClipboardList,
  Home,
  MessageSquare,
  Heart,
  ShoppingBag,
  Building2,
  Users,
  FileText,
  Trophy,
  MapPin,
  UsersRound,
  Shield,
  Brain,
  Search,
  GraduationCap,
  Gamepad2,
  TrendingUp,
  ShieldCheck,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleItem {
  label: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

interface ModuleCategory {
  title: string;
  items: ModuleItem[];
}

const MODULE_CATEGORIES: ModuleCategory[] = [
  {
    title: 'My Hub',
    items: [
      { label: 'Profile', description: 'Your profile & stats', icon: User, path: '/profile', color: 'bg-accent-blue/10 text-accent-blue' },
      { label: 'Athlete', description: 'Athlete dashboard & tools', icon: Dumbbell, path: '/athlete', color: 'bg-accent-emerald/10 text-accent-emerald' },
      { label: 'Coach', description: 'Coaching tools & drills', icon: ClipboardList, path: '/coach', color: 'bg-accent-orange/10 text-accent-orange' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Feed', description: 'Social feed & posts', icon: Home, path: '/', color: 'bg-lime/10 text-lime-dark' },
      { label: 'Forums', description: 'Community discussions', icon: MessageSquare, path: '/community', color: 'bg-accent-purple/10 text-accent-purple' },
      { label: 'Fan Zone', description: 'Fan engagement hub', icon: Heart, path: '/fan', color: 'bg-accent-pink/10 text-accent-pink' },
      { label: 'Store', description: 'Merchandise & gear', icon: ShoppingBag, path: '/store', color: 'bg-accent-yellow/10 text-accent-yellow' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Command Center', description: 'Org management hub', icon: Building2, path: '/command-center', color: 'bg-accent-red/10 text-accent-red' },
      { label: 'Parent Hub', description: 'Parent portal & updates', icon: Users, path: '/parent-hub', color: 'bg-accent-cyan/10 text-accent-cyan' },
      { label: 'Forms', description: 'Registration & waivers', icon: FileText, path: '/forms', color: 'bg-accent-orange/10 text-accent-orange' },
    ],
  },
  {
    title: 'Sports',
    items: [
      { label: 'Games', description: 'Scores & schedules', icon: Trophy, path: '/games', color: 'bg-accent-yellow/10 text-accent-yellow' },
      { label: 'Courts', description: 'Find courts near you', icon: MapPin, path: '/courts', color: 'bg-accent-emerald/10 text-accent-emerald' },
      { label: 'Teams', description: 'Team rosters & stats', icon: UsersRound, path: '/teams', color: 'bg-accent-blue/10 text-accent-blue' },
      { label: 'League', description: 'League standings & play', icon: Shield, path: '/leagues', color: 'bg-accent-purple/10 text-accent-purple' },
      { label: 'Intelligence', description: 'AI-powered sports intel', icon: Brain, path: '/intelligence', color: 'bg-lime/10 text-lime-dark' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Recruiting', description: 'Athlete-recruiter match', icon: Search, path: '/recruiting', color: 'bg-accent-cyan/10 text-accent-cyan' },
      { label: 'Training', description: 'Find trainers & book', icon: GraduationCap, path: '/training-marketplace', color: 'bg-accent-emerald/10 text-accent-emerald' },
      { label: 'GM Universe', description: 'Fantasy GM simulation', icon: Gamepad2, path: '/gm-universe', color: 'bg-accent-pink/10 text-accent-pink' },
      { label: 'Vance', description: 'Betting predictions', icon: TrendingUp, path: '/vance', color: 'bg-accent-orange/10 text-accent-orange' },
      { label: 'Vet Them First', description: 'Safety verification', icon: ShieldCheck, path: '/vet-them-first', color: 'bg-accent-red/10 text-accent-red' },
    ],
  },
];

const QUICK_ACCESS: ModuleItem[] = [
  { label: 'Games', description: 'Live scores', icon: Trophy, path: '/games', color: 'bg-accent-yellow/10 text-accent-yellow' },
  { label: 'Courts', description: 'Nearby courts', icon: MapPin, path: '/courts', color: 'bg-accent-emerald/10 text-accent-emerald' },
  { label: 'Intelligence', description: 'AI insights', icon: Brain, path: '/intelligence', color: 'bg-lime/10 text-lime-dark' },
  { label: 'Profile', description: 'Your stats', icon: User, path: '/profile', color: 'bg-accent-blue/10 text-accent-blue' },
];

export default function HubPage(): React.ReactElement {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime">
            <Compass size={22} className="text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-primary,#171717)]">
              Hub
            </h1>
            <p className="text-xs text-[var(--color-text-secondary,#737373)]">
              All your modules in one place
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick Access */}
      <div className="px-5 pt-4 pb-2">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary,#737373)]">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_ACCESS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link
                  href={item.path}
                  className="group flex items-center gap-3 rounded-2xl bg-[var(--color-surface,#f5f5f5)] p-4 transition-all duration-200 active:scale-[0.97] hover:shadow-md"
                >
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', item.color)}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--color-text-primary,#171717)]">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-secondary,#737373)]">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* All Modules by Category */}
      <div className="px-5 pt-6">
        {MODULE_CATEGORIES.map((category, catIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + catIndex * 0.06, duration: 0.3 }}
            className="mb-8"
          >
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary,#737373)]">
              {category.title}
            </h2>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      'group flex flex-col items-center gap-2 rounded-2xl p-3.5 transition-all duration-200 active:scale-95',
                      isActive
                        ? 'bg-lime/15 ring-1 ring-lime/30'
                        : 'bg-[var(--color-surface,#f5f5f5)] hover:shadow-md'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                        isActive ? 'bg-lime text-black' : item.color
                      )}
                    >
                      <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                    </div>
                    <div className="text-center">
                      <p
                        className={cn(
                          'text-[11px] font-semibold leading-tight',
                          isActive
                            ? 'text-lime-dark'
                            : 'text-[var(--color-text-primary,#171717)]'
                        )}
                      >
                        {item.label}
                      </p>
                      <p className="mt-0.5 hidden text-[9px] leading-tight text-[var(--color-text-secondary,#737373)] sm:block">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
