'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  FileText,
  MapPin,
  Trophy,
  Brain,
  BarChart3,
  Settings,
  Search,
  Bell,
  Shield,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AdminNavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
}

const NAV_ITEMS: AdminNavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Content', icon: FileText, path: '/admin/content' },
  { label: 'Courts', icon: MapPin, path: '/admin/courts' },
  { label: 'Games', icon: Trophy, path: '/admin/games' },
  { label: 'Intelligence', icon: Brain, path: '/admin/intelligence' },
  { label: 'Reports', icon: BarChart3, path: '/admin/reports' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string): boolean => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-black/[0.06] bg-white',
          'lg:relative lg:z-auto',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        style={{ width: collapsed ? 72 : 260 }}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between border-b border-black/[0.06] px-4">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime">
                  <Shield className="h-4 w-4 text-black" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black tracking-tight text-neutral-900">
                  B6 Admin
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-lime">
              <Shield className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-lime/[0.12] text-lime-dark'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900',
                  collapsed && 'justify-center px-0',
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={cn(
                    'shrink-0 transition-colors',
                    active ? 'text-lime-dark' : 'text-neutral-400 group-hover:text-neutral-600',
                  )}
                />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {active && !collapsed && (
                  <motion.div
                    layoutId="admin-nav-indicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_6px_rgba(200,255,0,0.8)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-black/[0.06] p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden w-full items-center justify-center rounded-2xl p-2.5 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600 lg:flex"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/[0.06] bg-white/80 px-4 backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="hidden items-center gap-2 rounded-2xl bg-surface px-4 py-2 sm:flex">
              <Search size={16} className="text-neutral-400" />
              <input
                type="text"
                placeholder="Search admin..."
                className="w-48 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 lg:w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-2xl bg-lime/[0.1] px-3 py-1.5">
              <Shield size={14} className="text-lime-dark" strokeWidth={2.5} />
              <span className="text-xs font-bold text-lime-dark">Admin</span>
            </div>
            <button className="relative rounded-xl p-2 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-red" />
            </button>
            <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 text-xs font-bold text-white">
              MK
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
