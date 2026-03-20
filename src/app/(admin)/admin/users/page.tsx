'use client';

import { motion } from 'motion/react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Ban,
  UserPlus,
  ChevronDown,
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type UserStatus = 'active' | 'suspended' | 'pending';
type UserRole = 'admin' | 'moderator' | 'player' | 'fan' | 'coach' | 'scout';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  avatar: string;
  verified: boolean;
}

const MOCK_USERS: AdminUser[] = [
  { id: 'u-001', name: 'McKeyra Peter', email: 'mckeyra@enuw.ca', role: 'admin', status: 'active', joined: 'Jan 15, 2025', avatar: 'MK', verified: true },
  { id: 'u-002', name: 'Caleb Smith', email: 'caleb.smith@email.com', role: 'player', status: 'active', joined: 'Feb 3, 2025', avatar: 'CS', verified: true },
  { id: 'u-003', name: 'Marcus Thompson', email: 'marcus.t@email.com', role: 'player', status: 'active', joined: 'Feb 18, 2025', avatar: 'MT', verified: true },
  { id: 'u-004', name: 'Jaylen Carter', email: 'jaylen.c@uoft.ca', role: 'player', status: 'active', joined: 'Mar 1, 2025', avatar: 'JC', verified: false },
  { id: 'u-005', name: 'Devon Ellis', email: 'devon.ellis@email.com', role: 'player', status: 'pending', joined: 'Mar 8, 2025', avatar: 'DE', verified: false },
  { id: 'u-006', name: 'Sarah Chen', email: 'sarah.chen@email.com', role: 'moderator', status: 'active', joined: 'Jan 22, 2025', avatar: 'SC', verified: true },
  { id: 'u-007', name: 'Andre Williams', email: 'andre.w@email.com', role: 'coach', status: 'active', joined: 'Feb 10, 2025', avatar: 'AW', verified: true },
  { id: 'u-008', name: 'Tyler Brooks', email: 'tyler.b@email.com', role: 'fan', status: 'suspended', joined: 'Jan 5, 2025', avatar: 'TB', verified: false },
  { id: 'u-009', name: 'Keon James', email: 'keon.j@email.com', role: 'player', status: 'active', joined: 'Mar 12, 2025', avatar: 'KJ', verified: false },
  { id: 'u-010', name: 'Nina Rodriguez', email: 'nina.r@email.com', role: 'scout', status: 'active', joined: 'Feb 28, 2025', avatar: 'NR', verified: true },
];

const STATUS_CONFIG: Record<UserStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  active: { label: 'Active', icon: CheckCircle2, className: 'bg-accent-emerald/[0.08] text-accent-emerald' },
  suspended: { label: 'Suspended', icon: XCircle, className: 'bg-accent-red/[0.08] text-accent-red' },
  pending: { label: 'Pending', icon: Clock, className: 'bg-accent-orange/[0.08] text-accent-orange' },
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-lime/[0.1] text-lime-dark',
  moderator: 'bg-accent-purple/[0.08] text-accent-purple',
  player: 'bg-accent-blue/[0.08] text-accent-blue',
  fan: 'bg-neutral-100 text-neutral-600',
  coach: 'bg-accent-orange/[0.08] text-accent-orange',
  scout: 'bg-accent-cyan/[0.08] text-accent-cyan',
};

export default function UsersPage(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [openActions, setOpenActions] = useState<string | null>(null);

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Users</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage platform users and permissions
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800">
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-4 py-2.5">
          <Search size={16} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setStatusFilter(statusFilter === 'all' ? 'active' : statusFilter === 'active' ? 'suspended' : statusFilter === 'suspended' ? 'pending' : 'all')}
            className="inline-flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <Filter size={16} className="text-neutral-400" />
            {statusFilter === 'all' ? 'All Status' : STATUS_CONFIG[statusFilter].label}
            <ChevronDown size={14} className="text-neutral-400" />
          </button>
        </div>
      </motion.div>

      {/* User table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="overflow-hidden rounded-[20px] border border-black/[0.06] bg-white"
      >
        {/* Table header */}
        <div className="hidden border-b border-black/[0.06] bg-surface/50 px-5 py-3 md:grid md:grid-cols-[2fr_2fr_1fr_1fr_1fr_80px]">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Name</span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Email</span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Role</span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Status</span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Joined</span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Actions</span>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-black/[0.04]">
          {filteredUsers.map((user, i) => {
            const statusCfg = STATUS_CONFIG[user.status];
            const StatusIcon = statusCfg.icon;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-1 gap-2 px-5 py-4 transition-colors hover:bg-surface/30 md:grid-cols-[2fr_2fr_1fr_1fr_1fr_80px] md:items-center md:gap-0"
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 font-mono text-xs font-bold text-neutral-600">
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold text-neutral-900">{user.name}</span>
                      {user.verified && (
                        <Shield size={12} className="shrink-0 text-lime-dark" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <span className="truncate text-sm text-neutral-500">{user.email}</span>

                {/* Role */}
                <div>
                  <span className={cn('inline-flex rounded-xl px-2.5 py-1 text-xs font-bold capitalize', ROLE_COLORS[user.role])}>
                    {user.role}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <span className={cn('inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold', statusCfg.className)}>
                    <StatusIcon size={12} />
                    {statusCfg.label}
                  </span>
                </div>

                {/* Joined */}
                <span className="font-mono text-xs text-neutral-400">{user.joined}</span>

                {/* Actions */}
                <div className="relative">
                  <button
                    onClick={() => setOpenActions(openActions === user.id ? null : user.id)}
                    className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openActions === user.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-0 top-10 z-20 min-w-[140px] rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-lg"
                    >
                      <button
                        onClick={() => setOpenActions(null)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => setOpenActions(null)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setOpenActions(null)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-accent-red transition-colors hover:bg-accent-red/[0.06]"
                      >
                        <Ban size={14} /> Suspend
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={32} className="text-neutral-300" />
            <p className="mt-3 text-sm font-semibold text-neutral-500">No users found</p>
            <p className="mt-1 text-xs text-neutral-400">Try adjusting your search or filters</p>
          </div>
        )}
      </motion.div>

      {/* Summary bar */}
      <div className="flex items-center justify-between rounded-[20px] border border-black/[0.06] bg-white px-5 py-3">
        <span className="text-xs text-neutral-500">
          Showing <span className="font-bold text-neutral-900">{filteredUsers.length}</span> of{' '}
          <span className="font-bold text-neutral-900">{MOCK_USERS.length}</span> users
        </span>
        <div className="flex gap-4">
          {(['active', 'pending', 'suspended'] as const).map((s) => {
            const count = MOCK_USERS.filter((u) => u.status === s).length;
            const cfg = STATUS_CONFIG[s];
            return (
              <span key={s} className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span className={cn('h-2 w-2 rounded-full', s === 'active' ? 'bg-accent-emerald' : s === 'pending' ? 'bg-accent-orange' : 'bg-accent-red')} />
                {count} {cfg.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
