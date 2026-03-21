'use client';

import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Users,
  Timer,
  DollarSign,
  Bell,
  ArrowRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// TODO: Replace with actual API route

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-600/20 text-green-400 border-green-600/30',
  pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  completed: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  cancelled: 'bg-red-600/20 text-red-400 border-red-600/30',
};

interface SessionData {
  id: string;
  athlete_id?: string;
  athlete_name?: string;
  session_date?: string;
  start_time?: string;
  focus_area?: string;
  location?: string;
  status?: string;
  duration_minutes?: number;
  amount?: number;
}

interface BookingData {
  id: string;
  athlete_name?: string;
  requested_date?: string;
  session_type?: string;
  status?: string;
}

interface ReviewData {
  id: string;
  is_read?: boolean;
}

interface PendingAction {
  type: string;
  count: number;
  label: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
}

function StatCard({ title, value, icon: Icon, loading }: StatCardProps): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="h-4 w-20 mb-2 bg-slate-800 rounded animate-pulse" />
        <div className="h-8 w-16 bg-slate-800 rounded animate-pulse" />
      </div>
    );
  }
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">{title}</span>
        <div className="p-2 bg-slate-800 rounded-lg">
          <Icon className="w-4 h-4 text-red-500" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

export function TrainerDashboardPage(): React.ReactElement {
  const userId = 'current-user';

  const { data: sessions = [], isLoading: loadingSessions } = useQuery<SessionData[]>({
    queryKey: ['trainer', 'sessions'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/trainer/sessions')
      return [];
    },
    enabled: !!userId,
  });

  const { data: bookings = [], isLoading: loadingBookings } = useQuery<BookingData[]>({
    queryKey: ['trainer', 'bookings-pending'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/trainer/bookings?status=pending')
      return [];
    },
    enabled: !!userId,
  });

  const { data: reviews = [], isLoading: loadingReviews } = useQuery<ReviewData[]>({
    queryKey: ['trainer', 'reviews'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/trainer/reviews')
      return [];
    },
    enabled: !!userId,
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => s.session_date?.startsWith(todayStr));
  const upcomingSessions = sessions
    .filter((s) => (s.session_date ?? '') > todayStr && s.status !== 'cancelled')
    .slice(0, 5);

  const uniqueAthletes = new Set(sessions.map((s) => s.athlete_id)).size;
  const totalMinutes = sessions
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + (s.duration_minutes ?? 60), 0);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthRevenue = sessions
    .filter((s) => s.session_date?.startsWith(thisMonth) && s.status === 'completed')
    .reduce((sum, s) => sum + (s.amount ?? 0), 0);

  const pendingActions: PendingAction[] = [
    ...(bookings.length > 0
      ? [{ type: 'booking', count: bookings.length, label: 'New booking requests' }]
      : []),
    ...(reviews.filter((r) => !r.is_read).length > 0
      ? [{ type: 'review', count: reviews.filter((r) => !r.is_read).length, label: 'New reviews' }]
      : []),
  ];

  const isLoading = loadingSessions || loadingBookings;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Trainer Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back. Here is your overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Sessions" value={todaySessions.length} icon={Calendar} loading={isLoading} />
        <StatCard title="Active Athletes" value={uniqueAthletes} icon={Users} loading={isLoading} />
        <StatCard title="Training Minutes" value={totalMinutes.toLocaleString()} icon={Timer} loading={isLoading} />
        <StatCard title="Revenue (Month)" value={`$${monthRevenue.toLocaleString()}`} icon={DollarSign} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Sessions */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg lg:col-span-2">
          <div className="p-4 pb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Today&apos;s Sessions</h2>
            <span className="inline-flex items-center border border-slate-700 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
              {todaySessions.length}
            </span>
          </div>
          <div className="p-4 pt-2">
            {loadingSessions ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : todaySessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No sessions scheduled today</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-800"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-600/20">
                      <Clock className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {session.athlete_name ?? 'Athlete'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {session.start_time ?? 'TBD'} - {session.focus_area ?? 'General Training'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center border text-[10px] px-2 py-0.5 rounded-full',
                          STATUS_COLORS[session.status ?? 'pending'] ?? STATUS_COLORS.pending
                        )}
                      >
                        {session.status ?? 'confirmed'}
                      </span>
                      <span className="text-xs text-slate-400">{session.location ?? ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Pending Actions</h2>
          </div>
          <div className="p-4 pt-2 space-y-3">
            {pendingActions.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">All caught up!</p>
              </div>
            ) : (
              pendingActions.map((action, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-600/20 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{action.label}</p>
                    <p className="text-xs text-slate-400">{action.count} pending</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))
            )}

            <div className="border-t border-slate-800" />

            {/* Pending Booking Requests */}
            {bookings.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  New Booking Requests
                </p>
                {bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30"
                  >
                    <div>
                      <p className="text-sm text-white">{booking.athlete_name ?? 'Athlete'}</p>
                      <p className="text-xs text-slate-400">{booking.requested_date} - {booking.session_type}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="h-7 w-7 p-0 flex items-center justify-center text-green-400 hover:bg-green-600/20 rounded transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="h-7 w-7 p-0 flex items-center justify-center text-red-400 hover:bg-red-600/20 rounded transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4 pb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Upcoming Bookings</h2>
          <button className="flex items-center text-sm text-red-500 hover:text-red-400 transition-colors">
            View Schedule <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
        <div className="p-4 pt-2">
          {upcomingSessions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No upcoming sessions</p>
          ) : (
            <div className="space-y-2">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50"
                >
                  <div className="text-center min-w-[48px]">
                    <p className="text-xs text-slate-400">
                      {new Date(session.session_date!).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-white">
                      {new Date(session.session_date!).getDate()}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {session.athlete_name ?? 'Athlete'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {session.start_time} - {session.focus_area ?? 'Training'}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center border text-[10px] px-2 py-0.5 rounded-full',
                      STATUS_COLORS[session.status ?? 'confirmed'] ?? STATUS_COLORS.confirmed
                    )}
                  >
                    {session.status ?? 'confirmed'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
