'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
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
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleItem {
  label: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

interface ModuleCategory {
  title: string;
  items: ModuleItem[];
}

const MODULE_CATEGORIES: ModuleCategory[] = [
  {
    title: 'My Hub',
    items: [
      { label: 'Profile', description: 'Your profile & stats', icon: User, path: '/profile' },
      { label: 'Athlete', description: 'Athlete dashboard & tools', icon: Dumbbell, path: '/athlete' },
      { label: 'Coach', description: 'Coaching tools & drills', icon: ClipboardList, path: '/coach' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Feed', description: 'Social feed & posts', icon: Home, path: '/' },
      { label: 'Forums', description: 'Community discussions', icon: MessageSquare, path: '/communities' },
      { label: 'Fan Zone', description: 'Fan engagement hub', icon: Heart, path: '/fan' },
      { label: 'Store', description: 'Merchandise & gear', icon: ShoppingBag, path: '/store' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Command Center', description: 'Org management hub', icon: Building2, path: '/command-center' },
      { label: 'Parent Hub', description: 'Parent portal & updates', icon: Users, path: '/parent-hub' },
      { label: 'Forms', description: 'Registration & waivers', icon: FileText, path: '/forms' },
    ],
  },
  {
    title: 'Sports',
    items: [
      { label: 'Games', description: 'Scores & schedules', icon: Trophy, path: '/games' },
      { label: 'Courts', description: 'Find courts near you', icon: MapPin, path: '/courts' },
      { label: 'Teams', description: 'Team rosters & stats', icon: UsersRound, path: '/teams' },
      { label: 'League', description: 'League standings & play', icon: Shield, path: '/leagues' },
      { label: 'Intelligence', description: 'AI-powered sports intel', icon: Brain, path: '/intelligence' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Recruiting', description: 'Athlete-recruiter match', icon: Search, path: '/recruiting' },
      { label: 'Training', description: 'Find trainers & book', icon: GraduationCap, path: '/training-marketplace' },
      { label: 'GM Universe', description: 'Fantasy GM simulation', icon: Gamepad2, path: '/gm-universe' },
      { label: 'Vance', description: 'Betting predictions', icon: TrendingUp, path: '/vance' },
      { label: 'Vet Them First', description: 'Safety verification', icon: ShieldCheck, path: '/vet-them-first' },
    ],
  },
];

interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreMenu: React.FC<MoreMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const handleLinkClick = useCallback((): void => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[var(--color-void,#ffffff)]/95 backdrop-blur-2xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-1 flex-col overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-14 pb-4">
              <h2 className="text-2xl font-black tracking-tight text-[var(--color-text-primary,#171717)]">
                Explore
              </h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface,#f5f5f5)] transition-colors active:bg-[var(--color-border,rgba(0,0,0,0.06))]"
                aria-label="Close menu"
              >
                <X size={20} className="text-[var(--color-text-primary,#171717)]" />
              </button>
            </div>

            {/* Scrollable categories */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-32 no-scrollbar">
              {MODULE_CATEGORIES.map((category, catIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.06, duration: 0.3 }}
                  className="mb-6"
                >
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary,#737373)]">
                    {category.title}
                  </h3>
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
                          onClick={handleLinkClick}
                          className={cn(
                            'group flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all duration-200 active:scale-95',
                            isActive
                              ? 'bg-lime/15 ring-1 ring-lime/30'
                              : 'bg-[var(--color-surface,#f5f5f5)] hover:bg-[var(--color-surface,#f5f5f5)]/80'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                              isActive
                                ? 'bg-lime text-black'
                                : 'bg-[var(--color-void,#ffffff)] text-[var(--color-text-secondary,#737373)] group-hover:text-[var(--color-text-primary,#171717)]'
                            )}
                          >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                          </div>
                          <span
                            className={cn(
                              'text-center text-[11px] font-semibold leading-tight',
                              isActive
                                ? 'text-lime-dark'
                                : 'text-[var(--color-text-primary,#171717)]'
                            )}
                          >
                            {item.label}
                          </span>
                          <span className="hidden text-center text-[9px] leading-tight text-[var(--color-text-secondary,#737373)] sm:block">
                            {item.description}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
