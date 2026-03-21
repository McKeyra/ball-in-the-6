'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { VanceScoreBadge } from '@/components/recruiting/VanceScoreBadge';
import {
  Eye,
  Bookmark,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface ProfileSection {
  key: string;
  label: string;
}

const PROFILE_SECTIONS: ProfileSection[] = [
  { key: 'name', label: 'Full Name' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'sport', label: 'Sport' },
  { key: 'position', label: 'Position' },
  { key: 'photo_url', label: 'Profile Photo' },
  { key: 'height_ft', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { key: 'wingspan', label: 'Wingspan' },
  { key: 'vertical', label: 'Vertical' },
  { key: 'dominant_hand', label: 'Dominant Hand' },
  { key: 'team', label: 'Current Team' },
  { key: 'league', label: 'League' },
  { key: 'coach_name', label: 'Coach' },
  { key: 'school', label: 'School' },
  { key: 'gpa', label: 'GPA' },
  { key: 'bio', label: 'Bio' },
  { key: 'recruiting_statement', label: 'Personal Statement' },
  { key: 'recruiting_goals', label: 'Recruiting Goals' },
  { key: 'videos', label: 'Video Highlights' },
  { key: 'stats', label: 'Season Stats' },
  { key: 'references', label: 'Coach References' },
];

interface Tip {
  condition: (p: Record<string, unknown>) => boolean;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

const TIPS: Tip[] = [
  { condition: (p) => !p.photo_url, text: 'Upload a profile photo to increase views by 40%', priority: 'high' },
  { condition: (p) => !p.bio, text: 'Write a bio to tell recruiters your story', priority: 'high' },
  { condition: (p) => !((p.videos as unknown[])?.length > 0), text: 'Upload game film or highlights to stand out', priority: 'high' },
  { condition: (p) => !p.gpa, text: 'Add your GPA - academics matter to recruiters', priority: 'medium' },
  { condition: (p) => !((p.references as unknown[])?.length > 0), text: 'Add coach references for credibility', priority: 'medium' },
  { condition: (p) => !p.recruiting_statement, text: 'Write a personal statement about your goals', priority: 'low' },
  { condition: (p) => !p.wingspan, text: 'Add wingspan measurement', priority: 'low' },
  { condition: (p) => !p.vertical, text: 'Add vertical jump measurement', priority: 'low' },
];

function StatCard({ title, value, icon: Icon, loading }: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
}): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="h-4 w-20 mb-2 bg-slate-800 rounded animate-pulse" />
        <div className="h-7 w-12 bg-slate-800 rounded animate-pulse" />
      </div>
    );
  }
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">{title}</span>
        <div className="p-2 bg-slate-800 rounded-lg"><Icon className="w-4 h-4 text-red-500" /></div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

export function AthleteDashboardPage(): React.ReactElement {
  const { data: profile, isLoading: loadingProfile } = useQuery<Record<string, unknown> | null>({
    queryKey: ['athlete', 'my-profile'],
    queryFn: async () => {
      // TODO: fetch('/api/recruiting/athlete-profile')
      return null;
    },
  });

  const { data: analytics = { total_views: 0, total_saves: 0, total_messages: 0 }, isLoading: loadingAnalytics } = useQuery({
    queryKey: ['athlete', 'analytics-summary'],
    queryFn: async () => {
      // TODO: fetch('/api/recruiting/analytics-summary')
      return { total_views: 0, total_saves: 0, total_messages: 0 };
    },
    enabled: !!profile,
  });

  const { data: activity = [] } = useQuery<Array<{ id?: string; recruiter_name?: string; created_date?: string; organization?: string }>>({
    queryKey: ['athlete', 'recent-activity'],
    queryFn: async () => {
      // TODO: fetch('/api/recruiting/recent-activity')
      return [];
    },
    enabled: !!profile,
  });

  const isLoading = loadingProfile || loadingAnalytics;

  const completeness = profile
    ? Math.round(
        (PROFILE_SECTIONS.filter((s) => {
          const val = profile[s.key];
          if (Array.isArray(val)) return val.length > 0;
          return val !== null && val !== undefined && val !== '';
        }).length / PROFILE_SECTIONS.length) * 100
      )
    : 0;

  const activeTips = profile
    ? TIPS.filter((t) => t.condition(profile))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Athlete Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your recruiting profile and track interest from coaches.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Profile Completeness</span>
          <span className={cn(
            'text-sm font-bold',
            completeness >= 80 ? 'text-green-400' :
            completeness >= 50 ? 'text-yellow-400' : 'text-red-400'
          )}>
            {completeness}%
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${completeness}%` }} />
        </div>
        <p className="text-xs text-slate-500">
          {PROFILE_SECTIONS.length - Math.round(completeness / 100 * PROFILE_SECTIONS.length)} fields remaining
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Profile Views" value={analytics.total_views} icon={Eye} loading={isLoading} />
        <StatCard title="Saves" value={analytics.total_saves} icon={Bookmark} loading={isLoading} />
        <StatCard title="Messages" value={analytics.total_messages} icon={MessageSquare} loading={isLoading} />
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-slate-400">Vance Rating</span>
            <div className="mt-1">
              <VanceScoreBadge score={(profile?.vance_rating as number) ?? undefined} size="md" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <h2 className="text-base font-semibold text-white">Tips to Improve</h2>
            </div>
          </div>
          <div className="p-4">
            {activeTips.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Your profile is looking great!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTips.slice(0, 5).map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-slate-800/30">
                    <AlertCircle className={cn(
                      'w-4 h-4 mt-0.5 flex-shrink-0',
                      tip.priority === 'high' ? 'text-red-400' :
                      tip.priority === 'medium' ? 'text-yellow-400' : 'text-slate-400'
                    )} />
                    <p className="text-sm text-slate-300">{tip.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <h2 className="text-base font-semibold text-white">Recent Activity</h2>
            </div>
          </div>
          <div className="p-4">
            {activity.length === 0 ? (
              <div className="text-center py-6">
                <Eye className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activity.map((item, i) => (
                  <div key={item.id ?? i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                    <Eye className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate">
                        {item.recruiter_name ?? 'A recruiter'} viewed your profile
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {item.created_date ? new Date(item.created_date).toLocaleDateString() : ''}
                        {item.organization && ` - ${item.organization}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
