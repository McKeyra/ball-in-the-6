'use client';

import { motion } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  Flag,
  FileText,
  AlertTriangle,
  Eye,
  Clock,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type ModerationStatus = 'pending' | 'approved' | 'rejected';

interface PendingPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  type: 'play' | 'discussion' | 'media';
  timestamp: string;
  status: ModerationStatus;
}

interface ReportedContent {
  id: string;
  reportedBy: string;
  reason: string;
  content: string;
  author: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

const CONTENT_STATS = [
  { label: 'Posts Today', value: '247', icon: FileText, color: 'bg-accent-blue/[0.08] text-accent-blue' },
  { label: 'Flagged', value: '12', icon: Flag, color: 'bg-accent-red/[0.08] text-accent-red' },
  { label: 'Approved', value: '1,834', icon: CheckCircle2, color: 'bg-accent-emerald/[0.08] text-accent-emerald' },
  { label: 'Pending Review', value: '23', icon: Clock, color: 'bg-accent-orange/[0.08] text-accent-orange' },
];

const PENDING_POSTS: PendingPost[] = [
  { id: 'p-001', author: 'NovaBaller', handle: '@nova_ball', avatar: 'NB', content: 'Just dropped 35 at Downsview. Who wants the smoke next? Pull up.', type: 'play', timestamp: '5m ago', status: 'pending' },
  { id: 'p-002', author: 'SixSide Hoops', handle: '@sixside', avatar: 'SS', content: 'New court alert: Malvern just got resurfaced. Fresh lines, new nets. Game on.', type: 'discussion', timestamp: '12m ago', status: 'pending' },
  { id: 'p-003', author: 'CourtVision', handle: '@courtvision_6', avatar: 'CV', content: 'Film breakdown: How B.M.T. Titans run their PnR action. Thread incoming.', type: 'media', timestamp: '18m ago', status: 'pending' },
  { id: 'p-004', author: 'Hoop Dreams TO', handle: '@hoopdreams_to', avatar: 'HD', content: 'Summer league tryouts this Saturday at Cherry Beach. Ages 16-22. $20 entry.', type: 'discussion', timestamp: '25m ago', status: 'pending' },
  { id: 'p-005', author: 'Raptors Feed', handle: '@raps_feed', avatar: 'RF', content: 'Top 10 plays from last night across the 6ix. Number 4 is absolutely insane.', type: 'media', timestamp: '34m ago', status: 'pending' },
  { id: 'p-006', author: 'BallIsLife_TO', handle: '@ballislife_to', avatar: 'BL', content: 'Looking for a 5th for our squad tonight at Pan Am. Must be able to shoot.', type: 'discussion', timestamp: '41m ago', status: 'pending' },
];

const REPORTED_CONTENT: ReportedContent[] = [
  { id: 'r-001', reportedBy: 'CourtKing_99', reason: 'Spam / Self-promotion', content: 'Check out my mixtape link...', author: 'SpamBot_22', severity: 'high', timestamp: '10m ago' },
  { id: 'r-002', reportedBy: 'SixMan', reason: 'Harassment', content: 'You can\'t guard nobody bro...', author: 'TrollAccount', severity: 'medium', timestamp: '1h ago' },
  { id: 'r-003', reportedBy: 'DunkCity', reason: 'Misinformation', content: 'Game was cancelled tonight...', author: 'NewUser_44', severity: 'low', timestamp: '2h ago' },
  { id: 'r-004', reportedBy: 'Scarborough Elite', reason: 'Inappropriate content', content: 'Post contained offensive language...', author: 'AnonUser_91', severity: 'high', timestamp: '3h ago' },
];

const SEVERITY_CONFIG = {
  low: { className: 'bg-accent-blue/[0.08] text-accent-blue', label: 'Low' },
  medium: { className: 'bg-accent-orange/[0.08] text-accent-orange', label: 'Medium' },
  high: { className: 'bg-accent-red/[0.08] text-accent-red', label: 'High' },
} as const;

const TYPE_LABELS = {
  play: 'Play',
  discussion: 'Discussion',
  media: 'Media',
} as const;

export default function ContentPage(): React.ReactElement {
  const [posts, setPosts] = useState(PENDING_POSTS);

  const handleAction = (postId: string, action: ModerationStatus): void => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status: action } : p)));
  };

  const pendingPosts = posts.filter((p) => p.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">Content</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Moderate posts and review flagged content
        </p>
      </div>

      {/* Content stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {CONTENT_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="rounded-[20px] border border-black/[0.06] bg-white p-4"
            >
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-2xl', stat.color)}>
                <Icon size={18} />
              </div>
              <p className="mt-2 font-mono text-xl font-black text-neutral-900">{stat.value}</p>
              <p className="text-xs text-neutral-500">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Pending posts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-[20px] border border-black/[0.06] bg-white p-5 xl:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-900">Pending Review</h2>
              <span className="rounded-xl bg-accent-orange/[0.1] px-2 py-0.5 font-mono text-xs font-bold text-accent-orange">
                {pendingPosts.length}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: post.status === 'pending' ? 1 : 0.5 }}
                className={cn(
                  'rounded-2xl border border-black/[0.04] p-4 transition-all',
                  post.status === 'approved' && 'border-accent-emerald/20 bg-accent-emerald/[0.03]',
                  post.status === 'rejected' && 'border-accent-red/20 bg-accent-red/[0.03]',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 font-mono text-xs font-bold text-neutral-600">
                    {post.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900">{post.author}</span>
                      <span className="text-xs text-neutral-400">{post.handle}</span>
                      <span className="rounded-lg bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-neutral-500">
                        {TYPE_LABELS[post.type]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">{post.content}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-neutral-400">{post.timestamp}</span>
                      {post.status === 'pending' ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleAction(post.id, 'approved')}
                            className="inline-flex items-center gap-1 rounded-xl bg-accent-emerald/[0.08] px-3 py-1.5 text-xs font-bold text-accent-emerald transition-colors hover:bg-accent-emerald/[0.15]"
                          >
                            <CheckCircle2 size={12} /> Approve
                          </button>
                          <button
                            onClick={() => handleAction(post.id, 'rejected')}
                            className="inline-flex items-center gap-1 rounded-xl bg-accent-red/[0.08] px-3 py-1.5 text-xs font-bold text-accent-red transition-colors hover:bg-accent-red/[0.15]"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold',
                            post.status === 'approved'
                              ? 'bg-accent-emerald/[0.08] text-accent-emerald'
                              : 'bg-accent-red/[0.08] text-accent-red',
                          )}
                        >
                          {post.status === 'approved' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {post.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reported content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-[20px] border border-black/[0.06] bg-white p-5"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-accent-red" />
            <h2 className="text-sm font-bold text-neutral-900">Reported Content</h2>
          </div>

          <div className="mt-4 space-y-3">
            {REPORTED_CONTENT.map((report) => {
              const severity = SEVERITY_CONFIG[report.severity];
              return (
                <div
                  key={report.id}
                  className="rounded-2xl border border-black/[0.04] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-900">{report.author}</span>
                    <span className={cn('rounded-lg px-2 py-0.5 text-[10px] font-bold', severity.className)}>
                      {severity.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-neutral-600 line-clamp-2">{report.content}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">
                      <Flag size={10} className="mr-1 inline" />
                      {report.reason}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400">{report.timestamp}</span>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <button className="flex-1 rounded-xl bg-accent-red/[0.08] py-1.5 text-[11px] font-bold text-accent-red transition-colors hover:bg-accent-red/[0.15]">
                      Remove
                    </button>
                    <button className="flex-1 rounded-xl bg-neutral-100 py-1.5 text-[11px] font-bold text-neutral-600 transition-colors hover:bg-neutral-200">
                      Dismiss
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
