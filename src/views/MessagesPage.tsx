'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  PenSquare,
  Check,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  verified: boolean;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    name: 'Caleb Smith',
    handle: '@caleb_buckets',
    avatar: 'CS',
    avatarColor: 'from-orange-500 to-red-500',
    lastMessage: 'Yo pull up to Pan Am tonight, we got a 5v5 going',
    time: '2m',
    unread: 3,
    online: true,
    verified: true,
  },
  {
    id: 'conv-002',
    name: 'Marcus Thompson',
    handle: '@marcust_6ix',
    avatar: 'MT',
    avatarColor: 'from-emerald-500 to-cyan-500',
    lastMessage: 'That crossover was nasty bro, send me the clip',
    time: '15m',
    unread: 1,
    online: true,
    verified: true,
  },
  {
    id: 'conv-003',
    name: 'DunkCity',
    handle: '@dunkcity_to',
    avatar: 'DC',
    avatarColor: 'from-pink-500 to-purple-500',
    lastMessage: 'Bet. See you at Cherry Beach Saturday',
    time: '1h',
    unread: 0,
    online: false,
    verified: false,
  },
  {
    id: 'conv-004',
    name: 'Toronto Hoops',
    handle: '@toronto_hoops',
    avatar: 'TH',
    avatarColor: 'from-violet-500 to-purple-500',
    lastMessage: 'Summer league registration closes Friday, you in?',
    time: '2h',
    unread: 2,
    online: true,
    verified: true,
  },
  {
    id: 'conv-005',
    name: 'CourtKing_99',
    handle: '@courtking_99',
    avatar: 'CK',
    avatarColor: 'from-yellow-500 to-orange-500',
    lastMessage: "Good game today. You were cooking out there fr",
    time: '5h',
    unread: 0,
    online: false,
    verified: false,
  },
  {
    id: 'conv-006',
    name: 'Scarborough Elite',
    handle: '@scarborough_elite',
    avatar: 'SE',
    avatarColor: 'from-gray-500 to-slate-600',
    lastMessage: "Tryouts next week. Don't sleep on it",
    time: '8h',
    unread: 0,
    online: false,
    verified: false,
  },
  {
    id: 'conv-007',
    name: 'Rexdale Runs',
    handle: '@rexdale_runs',
    avatar: 'RR',
    avatarColor: 'from-red-500 to-rose-500',
    lastMessage: 'Midnight runs tonight? Driftwood is calling',
    time: '1d',
    unread: 0,
    online: true,
    verified: false,
  },
  {
    id: 'conv-008',
    name: 'NorthSide Ball',
    handle: '@northside_ball',
    avatar: 'NB',
    avatarColor: 'from-teal-500 to-green-500',
    lastMessage: 'Downsview tournament bracket just dropped',
    time: '2d',
    unread: 0,
    online: false,
    verified: false,
  },
];

export const MessagesPage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const totalUnread = MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);

  const filtered = MOCK_CONVERSATIONS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-void/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60"
            >
              <ArrowLeft className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-neutral-900">Messages</h1>
              {totalUnread > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1.5 text-[10px] font-black text-black"
                >
                  {totalUnread}
                </motion.span>
              )}
            </div>
          </div>
          <Link
            href="/messages/new"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-lime-dim"
            aria-label="New message"
          >
            <PenSquare className="h-[18px] w-[18px] text-neutral-600" strokeWidth={1.8} />
          </Link>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[14px] bg-surface border border-neutral-200/60 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-lime/40 focus:ring-1 focus:ring-lime/20 transition-colors"
            />
          </div>
        </div>
      </motion.header>

      {/* Conversation List */}
      <div className="px-4 pt-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((conv, index) => (
            <motion.div
              key={conv.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
            >
              <Link
                href={`/messages/${conv.id}`}
                className={cn(
                  'group flex items-center gap-3 rounded-[16px] px-3 py-3.5 transition-colors',
                  conv.unread > 0 ? 'bg-lime/[0.04] hover:bg-lime/[0.08]' : 'hover:bg-surface'
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-sm font-black text-white',
                      conv.avatarColor
                    )}
                  >
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={cn(
                          'text-sm truncate',
                          conv.unread > 0 ? 'font-black text-neutral-900' : 'font-bold text-neutral-800'
                        )}
                      >
                        {conv.name}
                      </span>
                      {conv.verified && (
                        <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-lime">
                          <Check className="h-2.5 w-2.5 text-black" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'shrink-0 text-[11px] font-medium ml-2',
                        conv.unread > 0 ? 'text-lime-dark font-bold' : 'text-neutral-400'
                      )}
                    >
                      {conv.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p
                      className={cn(
                        'text-[13px] truncate pr-2',
                        conv.unread > 0 ? 'text-neutral-700 font-medium' : 'text-neutral-400'
                      )}
                    >
                      {conv.unread === 0 && (
                        <CheckCheck className="inline h-3.5 w-3.5 text-lime-dark mr-1 -mt-0.5" strokeWidth={2} />
                      )}
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1.5 text-[10px] font-black text-black"
                      >
                        {conv.unread}
                      </motion.span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty Search State */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
              <Search className="h-7 w-7 text-neutral-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">No conversations found</h3>
            <p className="mt-1 text-xs text-neutral-400 max-w-[220px]">
              Try a different search or start a new conversation.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
