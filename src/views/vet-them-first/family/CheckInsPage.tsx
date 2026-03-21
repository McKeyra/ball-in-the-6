'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Clock } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface Senior {
  id: string;
  senior_id: string;
  senior_name: string;
}

interface CheckIn {
  id: string;
  senior_id: string;
  senior_name?: string;
  created_date?: string;
  type?: string;
  completed?: boolean;
  scheduled_date?: string;
  scheduled_time?: string;
}

export function CheckInsPage(): React.ReactElement {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: seniors = [] } = useQuery<Senior[]>({
    queryKey: ['vtf', 'family-seniors'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/seniors')
      return [];
    },
    enabled: !!user?.id,
  });

  const { data: checkIns = [], isLoading } = useQuery<CheckIn[]>({
    queryKey: ['vtf', 'check-ins'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/check-ins')
      return [];
    },
    enabled: !!user?.id,
  });

  const checkInMutation = useMutation({
    mutationFn: async (seniorId: string) => {
      // TODO: fetch('/api/vtf/family/check-ins', { method: 'POST', body: JSON.stringify({ ... }) })
      return { seniorId };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vtf', 'check-ins'] }),
  });

  const scheduled = checkIns.filter((c) => c.type === 'scheduled' && !c.completed);
  const completed = checkIns.filter((c) => c.completed || c.type === 'manual');

  return (
    <div className="bg-slate-950 min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Check-Ins</h1>
        <p className="text-slate-400 text-sm mt-1">Stay connected with your seniors.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white">Quick Check-In</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {seniors.map((senior) => {
              const lastCheckIn = checkIns.find((c) => c.senior_id === senior.senior_id);
              const timeSince = lastCheckIn?.created_date
                ? Math.floor((Date.now() - new Date(lastCheckIn.created_date).getTime()) / (1000 * 60 * 60))
                : null;
              return (
                <div key={senior.id} className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-red-400">{(senior.senior_name || 'S').charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{senior.senior_name}</p>
                    <p className="text-xs text-slate-400">{timeSince !== null ? (timeSince < 1 ? 'Just now' : `${timeSince}h ago`) : 'No check-ins yet'}</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => checkInMutation.mutate(senior.senior_id)} disabled={checkInMutation.isPending}>
                    <CheckCircle className="w-4 h-4 mr-1" />Check In
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {scheduled.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Scheduled ({scheduled.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scheduled.map((ci) => (
              <div key={ci.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-sm text-white">{ci.senior_name}</p>
                    <p className="text-xs text-slate-400">{ci.scheduled_date} {ci.scheduled_time && `at ${ci.scheduled_time}`}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] border-yellow-600/30 text-yellow-400">Scheduled</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white">Check-In History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 bg-slate-800 rounded" />)}</div>
          ) : completed.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No check-ins yet</p>
          ) : (
            <div className="space-y-1">
              {completed.slice(0, 20).map((ci) => (
                <div key={ci.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-300">{ci.senior_name}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{ci.created_date ? new Date(ci.created_date).toLocaleString() : ''}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
