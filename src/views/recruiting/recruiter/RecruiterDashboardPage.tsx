'use client';

import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { AthleteCard } from '@/components/recruiting/AthleteCard';
import {
  Eye,
  Bookmark,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Zap,
  Star,
} from 'lucide-react';

// TODO: Replace with actual API route
// import { useAuth } from '@/lib/AuthContext';

interface AthleteData {
  id: string;
  name?: string;
  photo_url?: string;
  position?: string;
  height_ft?: number;
  height_in?: number;
  weight?: number;
  school?: string;
  city?: string;
  stat_line?: string;
  vance_rating?: number;
  is_verified?: boolean;
  is_committed?: boolean;
  committed_to?: string;
  graduation_year?: number;
  sport?: string;
}

interface RecruiterStats {
  total_views: number;
  athletes_saved: number;
  messages_sent: number;
}

interface ActivityItem {
  id?: string;
  type: string;
  description?: string;
  athlete_name?: string;
  created_date?: string;
}

interface QuickStatProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
}

interface ActivityIconProps {
  type: string;
}

function QuickStat({ title, value, icon: Icon, loading }: QuickStatProps): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="h-4 w-20 mb-2 bg-slate-800 rounded animate-pulse" />
        <div className="h-7 w-12 bg-slate-800 rounded animate-pulse" />
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

function ActivityIcon({ type }: ActivityIconProps): React.ReactElement {
  const config: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
    view: { icon: Eye, color: 'text-blue-400 bg-blue-600/20' },
    save: { icon: Bookmark, color: 'text-yellow-400 bg-yellow-600/20' },
    message: { icon: MessageSquare, color: 'text-green-400 bg-green-600/20' },
  };
  const { icon: Icon, color } = config[type] || config.view;
  return (
    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center', color)}>
      <Icon className="w-3.5 h-3.5" />
    </div>
  );
}

export function RecruiterDashboardPage(): React.ReactElement {
  // TODO: Replace with actual auth hook
  const userId = 'current-user';

  const { data: recommended = [], isLoading: loadingRecommended } = useQuery<AthleteData[]>({
    queryKey: ['recruiter', 'recommended'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/recruiting/recommended')
      return [];
    },
  });

  const { data: stats = { total_views: 0, athletes_saved: 0, messages_sent: 0 }, isLoading: loadingStats } = useQuery<RecruiterStats>({
    queryKey: ['recruiter', 'stats'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/recruiting/recruiter/stats')
      return { total_views: 0, athletes_saved: 0, messages_sent: 0 };
    },
    enabled: !!userId,
  });

  const { data: activity = [], isLoading: loadingActivity } = useQuery<ActivityItem[]>({
    queryKey: ['recruiter', 'activity-feed'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/recruiting/recruiter/activity')
      return [];
    },
    enabled: !!userId,
  });

  const isLoading = loadingRecommended || loadingStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recruiter Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Discover top athletes powered by Vance AI ratings.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <QuickStat title="Profile Views" value={stats.total_views || 0} icon={Eye} loading={isLoading} />
        <QuickStat title="Athletes Saved" value={stats.athletes_saved || 0} icon={Bookmark} loading={isLoading} />
        <QuickStat title="Messages Sent" value={stats.messages_sent || 0} icon={MessageSquare} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Athletes */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg lg:col-span-2">
          <div className="p-4 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-semibold text-white">Recommended Athletes</h2>
            </div>
            <button className="flex items-center text-sm text-red-500 hover:text-red-400">
              Search All <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          <div className="p-4 pt-2">
            {loadingRecommended ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recommended.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No recommendations yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recommended.slice(0, 6).map((athlete) => (
                  <AthleteCard key={athlete.id} athlete={athlete} variant="list" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="p-4 pt-2">
            {loadingActivity ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : activity.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No activity yet</p>
            ) : (
              <div className="space-y-2">
                {activity.map((item, i) => (
                  <div key={item.id || i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                    <ActivityIcon type={item.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate">
                        {item.description || `${item.type} - ${item.athlete_name || 'athlete'}`}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {item.created_date ? new Date(item.created_date).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Active Athletes */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h2 className="text-base font-semibold text-white">Top Active Athletes</h2>
          </div>
        </div>
        <div className="p-4 pt-2">
          {loadingRecommended ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.slice(0, 6).map((athlete) => (
                <AthleteCard key={athlete.id} athlete={athlete} variant="grid" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
