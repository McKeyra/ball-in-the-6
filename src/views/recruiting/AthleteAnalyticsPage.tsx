'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  Eye,
  TrendingUp,
  Building2,
  GraduationCap,
} from 'lucide-react';

// TODO: Replace with actual API route
// import { useAuth } from '@/lib/AuthContext';

interface ProfileView {
  id: string;
  created_date?: string;
  recruiter_type?: string;
  organization?: string;
  recruiter_organization?: string;
}

const PIE_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
];

export function AthleteAnalyticsPage(): React.ReactElement {
  // TODO: Replace with actual auth hook
  const userId = 'current-user';

  const { data: views = [], isLoading } = useQuery<ProfileView[]>({
    queryKey: ['athlete', 'profile-views'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/recruiting/profile-views')
      return [];
    },
    enabled: !!userId,
  });

  const viewsByDay = useMemo(() => {
    const now = new Date();
    const days: Array<{ key: string; label: string; count: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const count = views.filter((v) => v.created_date?.startsWith(key)).length;
      days.push({ key, label, count });
    }
    return days;
  }, [views]);

  const maxViews = Math.max(...viewsByDay.map((d) => d.count), 1);

  const recruiterTypes = useMemo(() => {
    const types: Record<string, number> = {};
    views.forEach((v) => {
      const type = v.recruiter_type || 'Unknown';
      types[type] = (types[type] || 0) + 1;
    });
    return Object.entries(types)
      .map(([type, count]) => ({ type, count, pct: Math.round((count / views.length) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [views]);

  const topSchools = useMemo(() => {
    const schools: Record<string, number> = {};
    views.forEach((v) => {
      const school = v.organization || v.recruiter_organization;
      if (school) schools[school] = (schools[school] || 0) + 1;
    });
    return Object.entries(schools)
      .map(([school, count]) => ({ school, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [views]);

  const totalViews = views.length;
  const last7Days = views.filter((v) => {
    const d = new Date(v.created_date ?? '');
    const sevenAgo = new Date();
    sevenAgo.setDate(sevenAgo.getDate() - 7);
    return d >= sevenAgo;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">See who is viewing your profile.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
          <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{totalViews}</p>
          <p className="text-xs text-slate-400">Total Views</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
          <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{last7Days}</p>
          <p className="text-xs text-slate-400">Last 7 Days</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
          <Building2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{topSchools.length}</p>
          <p className="text-xs text-slate-400">Organizations</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4 pb-2">
          <h2 className="text-base font-semibold text-white">Profile Views (30 Days)</h2>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="h-40 bg-slate-800 rounded animate-pulse" />
          ) : (
            <div className="space-y-2">
              <div className="flex items-end gap-1 h-32">
                {viewsByDay.map((day) => (
                  <div key={day.key} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div
                      className="w-full bg-red-600/60 hover:bg-red-600/80 rounded-t transition-colors min-h-[2px]"
                      style={{ height: `${(day.count / maxViews) * 100}%` }}
                    />
                    <div className="absolute bottom-full mb-1 hidden group-hover:block z-10">
                      <div className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap">
                        {day.label}: {day.count} view{day.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{viewsByDay[0]?.label}</span>
                <span>{viewsByDay[14]?.label}</span>
                <span>{viewsByDay[29]?.label}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Recruiter Type Breakdown</h2>
          </div>
          <div className="p-4">
            {recruiterTypes.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden relative flex-shrink-0"
                    style={{
                      background: `conic-gradient(${recruiterTypes.map((t, i) => {
                        const startPct = recruiterTypes.slice(0, i).reduce((s, r) => s + r.pct, 0);
                        const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'];
                        return `${colors[i % colors.length]} ${startPct}% ${startPct + t.pct}%`;
                      }).join(', ')})`,
                    }}
                  />
                  <div className="space-y-1 flex-1">
                    {recruiterTypes.map((t, i) => (
                      <div key={t.type} className="flex items-center gap-2">
                        <div className={cn('w-3 h-3 rounded-sm', PIE_COLORS[i % PIE_COLORS.length])} />
                        <span className="text-xs text-slate-300 flex-1">{t.type}</span>
                        <span className="text-xs font-medium text-white">{t.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Top Viewing Schools</h2>
          </div>
          <div className="p-4">
            {topSchools.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-2">
                {topSchools.map((school, i) => (
                  <div key={school.school} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                    <span className={cn(
                      'w-6 text-center text-xs font-bold',
                      i === 0 ? 'text-yellow-400' :
                      i === 1 ? 'text-slate-300' :
                      i === 2 ? 'text-amber-600' : 'text-slate-500'
                    )}>
                      {i + 1}
                    </span>
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-white flex-1 truncate">{school.school}</span>
                    <span className="text-xs font-medium text-slate-400">
                      {school.count} view{school.count !== 1 ? 's' : ''}
                    </span>
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
