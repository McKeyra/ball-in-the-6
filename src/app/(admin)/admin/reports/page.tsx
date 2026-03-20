'use client';

import { motion } from 'motion/react';
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Download,
  Trophy,
  Zap,
  ArrowUpRight,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const KEY_METRICS = [
  { label: 'Monthly Active Users', value: '8,421', change: '+14.3%', icon: Users, color: 'bg-accent-purple/[0.08] text-accent-purple' },
  { label: 'Avg. Session Duration', value: '12m 34s', change: '+8.7%', icon: Clock, color: 'bg-accent-blue/[0.08] text-accent-blue' },
  { label: 'Daily Page Views', value: '47.2k', change: '+22.1%', icon: Eye, color: 'bg-accent-emerald/[0.08] text-accent-emerald' },
  { label: 'Engagement Rate', value: '68.4%', change: '+5.2%', icon: TrendingUp, color: 'bg-lime/[0.1] text-lime-dark' },
];

const ENGAGEMENT_DATA = [
  { label: 'Jan', posts: 45, games: 22, courts: 12 },
  { label: 'Feb', posts: 62, games: 28, courts: 18 },
  { label: 'Mar', posts: 78, games: 35, courts: 24 },
  { label: 'Apr', posts: 91, games: 42, courts: 31 },
  { label: 'May', posts: 110, games: 48, courts: 36 },
  { label: 'Jun', posts: 134, games: 56, courts: 42 },
];

const MAX_ENGAGEMENT = Math.max(...ENGAGEMENT_DATA.map((d) => d.posts));

const TOP_PERFORMERS = [
  { rank: 1, name: 'McKeyra', handle: '@mr_ballinthe6', score: 12400, avatar: 'MK', change: '+340', color: 'from-lime to-lime-dark' },
  { rank: 2, name: 'Caleb Smith', handle: '@caleb_buckets', score: 11200, avatar: 'CS', change: '+280', color: 'from-accent-orange to-accent-red' },
  { rank: 3, name: 'Marcus Thompson', handle: '@marcust_6ix', score: 9800, avatar: 'MT', change: '+195', color: 'from-accent-emerald to-accent-cyan' },
  { rank: 4, name: 'DunkCity', handle: '@dunkcity_to', score: 8340, avatar: 'DC', change: '+142', color: 'from-accent-purple to-accent-blue' },
  { rank: 5, name: 'CourtKing_99', handle: '@courtking_99', score: 7120, avatar: 'CK', change: '+98', color: 'from-accent-blue to-accent-cyan' },
  { rank: 6, name: 'SixMan', handle: '@sixman_hoops', score: 6450, avatar: 'SM', change: '+87', color: 'from-accent-orange to-accent-yellow' },
];

const CONTENT_BREAKDOWN = [
  { type: 'Plays', count: 1248, percentage: 42, color: 'bg-accent-blue' },
  { type: 'Discussions', count: 876, percentage: 29, color: 'bg-accent-purple' },
  { type: 'Game Results', count: 534, percentage: 18, color: 'bg-accent-emerald' },
  { type: 'Media', count: 327, percentage: 11, color: 'bg-accent-orange' },
];

export default function ReportsPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Reports</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Platform analytics and performance insights
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 transition-colors hover:bg-neutral-50">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KEY_METRICS.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="rounded-[20px] border border-black/[0.06] bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', metric.color)}>
                  <Icon size={20} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-bold text-accent-emerald">
                  <ArrowUpRight size={14} />
                  {metric.change}
                </span>
              </div>
              <p className="mt-3 font-mono text-2xl font-black text-neutral-900">{metric.value}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{metric.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Engagement chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="rounded-[20px] border border-black/[0.06] bg-white p-5 xl:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-neutral-400" />
              <h2 className="text-sm font-bold text-neutral-900">Engagement Trends</h2>
            </div>
            <div className="flex gap-3">
              {[
                { label: 'Posts', color: 'bg-accent-blue' },
                { label: 'Games', color: 'bg-accent-emerald' },
                { label: 'Courts', color: 'bg-accent-purple' },
              ].map((legend) => (
                <span key={legend.label} className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className={cn('h-2 w-2 rounded-full', legend.color)} />
                  {legend.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-2" style={{ height: 180 }}>
            {ENGAGEMENT_DATA.map((month, i) => (
              <div key={month.label} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end justify-center gap-[2px]" style={{ height: 160 }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.posts / MAX_ENGAGEMENT) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                    className="w-1/3 max-w-[14px] rounded-t-lg bg-accent-blue"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.games / MAX_ENGAGEMENT) * 100}%` }}
                    transition={{ delay: 0.35 + i * 0.06, duration: 0.5 }}
                    className="w-1/3 max-w-[14px] rounded-t-lg bg-accent-emerald"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.courts / MAX_ENGAGEMENT) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
                    className="w-1/3 max-w-[14px] rounded-t-lg bg-accent-purple"
                  />
                </div>
                <span className="font-mono text-[10px] text-neutral-400">{month.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="rounded-[20px] border border-black/[0.06] bg-white p-5"
        >
          <h2 className="text-sm font-bold text-neutral-900">Content Breakdown</h2>
          <div className="mt-5 space-y-4">
            {CONTENT_BREAKDOWN.map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{item.type}</span>
                  <span className="font-mono text-xs font-bold text-neutral-900">{item.count.toLocaleString()}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className={cn('h-full rounded-full', item.color)}
                  />
                </div>
                <span className="mt-0.5 text-[10px] text-neutral-400">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top performers */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-accent-orange" />
            <h2 className="text-sm font-bold text-neutral-900">Top Performers</h2>
          </div>
          <span className="text-xs text-neutral-400">By Impact Score</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TOP_PERFORMERS.map((performer, i) => (
            <motion.div
              key={performer.handle}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center gap-3 rounded-2xl border border-black/[0.04] p-3 transition-colors hover:bg-surface/30"
            >
              <span className="flex h-6 w-6 items-center justify-center font-mono text-xs font-black text-neutral-300">
                {performer.rank}
              </span>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 font-mono text-xs font-bold text-neutral-600">
                {performer.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">{performer.name}</p>
                <p className="text-xs text-neutral-400">{performer.handle}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-black text-neutral-900">
                  {performer.score.toLocaleString()}
                </p>
                <p className="flex items-center justify-end gap-0.5 text-[10px] font-bold text-accent-emerald">
                  <Zap size={10} />
                  {performer.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
