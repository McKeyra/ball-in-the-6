'use client';

import { motion } from 'motion/react';
import {
  Users,
  FileText,
  Trophy,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  UserPlus,
  Flag,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATS = [
  {
    label: 'Total Users',
    value: '12,847',
    change: '+8.2%',
    trend: 'up' as const,
    icon: Users,
    color: 'bg-accent-purple/[0.08] text-accent-purple',
  },
  {
    label: 'Active Posts',
    value: '3,241',
    change: '+12.5%',
    trend: 'up' as const,
    icon: FileText,
    color: 'bg-accent-blue/[0.08] text-accent-blue',
  },
  {
    label: 'Games Today',
    value: '18',
    change: '-2',
    trend: 'down' as const,
    icon: Trophy,
    color: 'bg-accent-orange/[0.08] text-accent-orange',
  },
  {
    label: 'Courts Registered',
    value: '156',
    change: '+4',
    trend: 'up' as const,
    icon: MapPin,
    color: 'bg-accent-emerald/[0.08] text-accent-emerald',
  },
];

const CHART_DATA = [
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 78 },
  { label: 'Wed', value: 92 },
  { label: 'Thu', value: 84 },
  { label: 'Fri', value: 110 },
  { label: 'Sat', value: 134 },
  { label: 'Sun', value: 121 },
];

const MAX_CHART = Math.max(...CHART_DATA.map((d) => d.value));

const RECENT_ACTIVITY = [
  { id: '1', icon: UserPlus, label: 'New user registered', detail: 'Jaylen Carter joined', time: '2m ago', color: 'text-accent-purple' },
  { id: '2', icon: Flag, label: 'Content flagged', detail: 'Post #3847 reported for spam', time: '8m ago', color: 'text-accent-red' },
  { id: '3', icon: Trophy, label: 'Game completed', detail: 'B.M.T. Titans vs Scarborough Elite — Final', time: '15m ago', color: 'text-accent-orange' },
  { id: '4', icon: MessageSquare, label: 'New comment spike', detail: '47 comments on trending post', time: '22m ago', color: 'text-accent-blue' },
  { id: '5', icon: MapPin, label: 'Court verified', detail: 'Pan Am Centre updated by admin', time: '30m ago', color: 'text-accent-emerald' },
  { id: '6', icon: Eye, label: 'Traffic spike', detail: '2.3k concurrent users', time: '45m ago', color: 'text-accent-cyan' },
];

const QUICK_ACTIONS = [
  { label: 'Add User', icon: UserPlus, color: 'bg-accent-purple/[0.08] text-accent-purple hover:bg-accent-purple/[0.14]' },
  { label: 'New Game', icon: Trophy, color: 'bg-accent-orange/[0.08] text-accent-orange hover:bg-accent-orange/[0.14]' },
  { label: 'Add Court', icon: MapPin, color: 'bg-accent-emerald/[0.08] text-accent-emerald hover:bg-accent-emerald/[0.14]' },
  { label: 'View Reports', icon: TrendingUp, color: 'bg-accent-blue/[0.08] text-accent-blue hover:bg-accent-blue/[0.14]' },
  { label: 'Moderate', icon: Flag, color: 'bg-accent-red/[0.08] text-accent-red hover:bg-accent-red/[0.14]' },
  { label: 'Intel Check', icon: Zap, color: 'bg-lime/[0.1] text-lime-dark hover:bg-lime/[0.18]' },
];

export default function AdminDashboardPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Overview of Ball in the 6 platform activity
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-[20px] border border-black/[0.06] bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', stat.color)}>
                  <Icon size={20} />
                </div>
                <div
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-bold',
                    stat.trend === 'up' ? 'text-accent-emerald' : 'text-accent-red',
                  )}
                >
                  <TrendIcon size={14} />
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="font-mono text-2xl font-black text-neutral-900">{stat.value}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Activity chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-[20px] border border-black/[0.06] bg-white p-5 xl:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900">Weekly Activity</h2>
            <span className="text-xs text-neutral-400">Last 7 days</span>
          </div>
          <div className="mt-6 flex items-end justify-between gap-3" style={{ height: 160 }}>
            {CHART_DATA.map((bar, i) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(bar.value / MAX_CHART) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className={cn(
                    'w-full max-w-[40px] rounded-xl transition-colors',
                    i === CHART_DATA.length - 2
                      ? 'bg-lime shadow-[0_4px_12px_rgba(200,255,0,0.3)]'
                      : 'bg-neutral-100 hover:bg-neutral-200',
                  )}
                />
                <span className="font-mono text-[10px] text-neutral-400">{bar.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="rounded-[20px] border border-black/[0.06] bg-white p-5"
        >
          <h2 className="text-sm font-bold text-neutral-900">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors',
                    action.color,
                  )}
                >
                  <Icon size={20} />
                  <span className="text-xs font-semibold">{action.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-5"
      >
        <h2 className="text-sm font-bold text-neutral-900">Recent Activity</h2>
        <div className="mt-4 divide-y divide-black/[0.04]">
          {RECENT_ACTIVITY.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface', activity.color)}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900">{activity.label}</p>
                  <p className="truncate text-xs text-neutral-500">{activity.detail}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-neutral-400">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
