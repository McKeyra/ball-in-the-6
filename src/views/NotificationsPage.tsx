'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  UserPlus,
  Trophy,
  Award,
  Bell,
  BellOff,
  CheckCheck,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type NotificationType = 'like' | 'comment' | 'follow' | 'game_alert' | 'achievement';

interface Notification {
  id: string;
  type: NotificationType;
  avatar: string;
  avatarColor: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  timestamp: number;
}

const ICON_MAP: Record<NotificationType, { icon: typeof Heart; color: string; bg: string }> = {
  like: { icon: Heart, color: 'text-accent-red', bg: 'bg-accent-red/10' },
  comment: { icon: MessageCircle, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  follow: { icon: UserPlus, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
  game_alert: { icon: Trophy, color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
  achievement: { icon: Award, color: 'text-lime-dark', bg: 'bg-lime-dim' },
};

const NOW = Date.now();
const HOUR = 3600000;
const DAY = 86400000;

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n-01', type: 'like', avatar: 'CS', avatarColor: 'from-orange-500 to-red-500', title: 'Caleb Smith', message: 'liked your stepback three at Pan Am', time: '2m ago', read: false, timestamp: NOW - 120000 },
  { id: 'n-02', type: 'comment', avatar: 'MT', avatarColor: 'from-emerald-500 to-cyan-500', title: 'Marcus Thompson', message: 'commented: "That move was filthy bro"', time: '15m ago', read: false, timestamp: NOW - 900000 },
  { id: 'n-03', type: 'game_alert', avatar: 'GD', avatarColor: 'from-yellow-500 to-orange-500', title: 'Game Day', message: 'B.M.T. Titans vs Scarborough Elite tips off in 30 min', time: '30m ago', read: false, timestamp: NOW - 1800000 },
  { id: 'n-04', type: 'follow', avatar: 'DC', avatarColor: 'from-pink-500 to-purple-500', title: 'DunkCity', message: 'started following you', time: '1h ago', read: false, timestamp: NOW - HOUR },
  { id: 'n-05', type: 'achievement', avatar: 'BI', avatarColor: 'from-lime-400 to-emerald-500', title: 'Achievement Unlocked', message: "You've reached 10,000 Impact Score!", time: '2h ago', read: false, timestamp: NOW - 2 * HOUR },
  { id: 'n-06', type: 'like', avatar: 'SM', avatarColor: 'from-blue-500 to-indigo-500', title: 'SixMan', message: 'liked your court review of Cherry Beach', time: '3h ago', read: true, timestamp: NOW - 3 * HOUR },
  { id: 'n-07', type: 'comment', avatar: 'CK', avatarColor: 'from-yellow-500 to-orange-500', title: 'CourtKing_99', message: 'replied: "Pull up to Downsview tonight"', time: '5h ago', read: true, timestamp: NOW - 5 * HOUR },
  { id: 'n-08', type: 'game_alert', avatar: 'GD', avatarColor: 'from-yellow-500 to-orange-500', title: 'Final Score', message: 'Northside Kings 91 - East York Wolves 84', time: '8h ago', read: true, timestamp: NOW - 8 * HOUR },
  { id: 'n-09', type: 'follow', avatar: 'RR', avatarColor: 'from-red-500 to-rose-500', title: 'Rexdale Runs', message: 'started following you', time: '12h ago', read: true, timestamp: NOW - 12 * HOUR },
  { id: 'n-10', type: 'like', avatar: 'NB', avatarColor: 'from-teal-500 to-green-500', title: 'NorthSide Ball', message: 'and 4 others liked your tournament recap', time: '1d ago', read: true, timestamp: NOW - DAY },
  { id: 'n-11', type: 'comment', avatar: 'TH', avatarColor: 'from-violet-500 to-purple-500', title: 'Toronto Hoops', message: 'mentioned you in a post about summer league', time: '1d ago', read: true, timestamp: NOW - 1.5 * DAY },
  { id: 'n-12', type: 'achievement', avatar: 'BI', avatarColor: 'from-lime-400 to-emerald-500', title: 'Streak Bonus', message: '14-day posting streak! Keep it going.', time: '2d ago', read: true, timestamp: NOW - 2 * DAY },
  { id: 'n-13', type: 'game_alert', avatar: 'GD', avatarColor: 'from-yellow-500 to-orange-500', title: 'Schedule Update', message: "Oakwood Barons game moved to 6:00 PM", time: '3d ago', read: true, timestamp: NOW - 3 * DAY },
  { id: 'n-14', type: 'follow', avatar: 'SE', avatarColor: 'from-gray-500 to-slate-600', title: 'Scarborough Elite', message: 'started following you', time: '4d ago', read: true, timestamp: NOW - 4 * DAY },
  { id: 'n-15', type: 'like', avatar: 'JC', avatarColor: 'from-blue-600 to-blue-400', title: 'Jaylen Carter', message: 'liked your prediction on the UofT game', time: '5d ago', read: true, timestamp: NOW - 5 * DAY },
  { id: 'n-16', type: 'comment', avatar: 'AW', avatarColor: 'from-rose-500 to-pink-500', title: 'Ayo Williams', message: 'commented: "See you at the next run"', time: '6d ago', read: true, timestamp: NOW - 6 * DAY },
];

const groupNotifications = (
  notifications: Notification[]
): { today: Notification[]; thisWeek: Notification[]; earlier: Notification[] } => {
  const todayCutoff = NOW - DAY;
  const weekCutoff = NOW - 7 * DAY;

  return {
    today: notifications.filter((n) => n.timestamp >= todayCutoff),
    thisWeek: notifications.filter((n) => n.timestamp < todayCutoff && n.timestamp >= weekCutoff),
    earlier: notifications.filter((n) => n.timestamp < weekCutoff),
  };
};

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const grouped = groupNotifications(notifications);

  const handleMarkAllRead = useCallback((): void => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleDismiss = useCallback((id: string): void => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const renderNotification = (notification: Notification, index: number): React.ReactNode => {
    const iconData = ICON_MAP[notification.type];
    const Icon = iconData.icon;

    return (
      <motion.div
        key={notification.id}
        layout
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50, height: 0 }}
        transition={{ delay: index * 0.03, duration: 0.25 }}
        className={cn(
          'group relative flex items-start gap-3 rounded-[16px] px-3 py-3 transition-colors',
          notification.read ? 'hover:bg-surface' : 'bg-lime/[0.04] hover:bg-lime/[0.08]'
        )}
      >
        {/* Unread dot */}
        {!notification.read && (
          <span className="absolute left-0.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_6px_rgba(200,255,0,0.6)]" />
        )}

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-black text-white', notification.avatarColor)}>
            {notification.avatar}
          </div>
          <div className={cn('absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white', iconData.bg)}>
            <Icon className={cn('h-2.5 w-2.5', iconData.color)} strokeWidth={2.5} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug">
            <span className="font-bold text-neutral-900">{notification.title}</span>{' '}
            <span className="text-neutral-500">{notification.message}</span>
          </p>
          <span className="mt-0.5 block text-[11px] font-medium text-neutral-300">{notification.time}</span>
        </div>

        {/* Dismiss */}
        <button
          type="button"
          onClick={() => handleDismiss(notification.id)}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex h-7 w-7 items-center justify-center rounded-full hover:bg-neutral-200/60"
          aria-label="Dismiss notification"
        >
          <span className="text-neutral-400 text-xs font-bold">&times;</span>
        </button>
      </motion.div>
    );
  };

  const renderSection = (title: string, items: Notification[]): React.ReactNode => {
    if (items.length === 0) return null;
    return (
      <section className="mb-6">
        <h2 className="mb-2 px-1 text-xs font-black uppercase tracking-wider text-neutral-400">{title}</h2>
        <AnimatePresence mode="popLayout">
          {items.map((n, i) => renderNotification(n, i))}
        </AnimatePresence>
      </section>
    );
  };

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
            <Link href="/" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60">
              <ArrowLeft className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-neutral-900">Notifications</h1>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1.5 text-[10px] font-black text-black"
                >
                  {unreadCount}
                </motion.span>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-lime-dark transition-colors hover:bg-lime-dim"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>
      </motion.header>

      <div className="px-4 pt-4">
        {notifications.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Swipe hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-4 text-center text-[11px] text-neutral-300"
            >
              Hover to dismiss notifications
            </motion.p>

            {renderSection('Today', grouped.today)}
            {renderSection('This Week', grouped.thisWeek)}
            {renderSection('Earlier', grouped.earlier)}
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface">
              <BellOff className="h-8 w-8 text-neutral-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-bold text-neutral-900">All caught up</h3>
            <p className="mt-1 max-w-[240px] text-sm text-neutral-400">
              No new notifications. Go post a play or check out today&apos;s games to get the community buzzing.
            </p>
            <Link
              href="/"
              className="mt-5 rounded-2xl bg-lime px-6 py-2.5 text-xs font-black text-black transition-transform active:scale-95"
            >
              Back to Feed
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};
