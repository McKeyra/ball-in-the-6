'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ShieldAlert, CheckCircle, Clock, Eye } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface ScamReport {
  id: string;
  senior_name?: string;
  description?: string;
  type?: string;
  severity?: string;
  status?: string;
  when_happened?: string;
  who_contacted?: string;
  created_date?: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-red-600/20 text-red-400 border-red-600/30',
  reviewed: 'bg-green-600/20 text-green-400 border-green-600/30',
  investigating: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
};

const SEVERITY_COLORS: Record<string, string> = {
  info: 'text-blue-400',
  warning: 'text-amber-400',
  urgent: 'text-orange-400',
  critical: 'text-red-400',
};

export function ScamReportsPage(): React.ReactElement {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery<ScamReport[]>({
    queryKey: ['vtf', 'scam-reports'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/scam-reports')
      return [];
    },
    enabled: !!user?.id,
  });

  const markReviewedMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: fetch(`/api/vtf/family/scam-reports/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'reviewed' }) })
      return { id };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vtf', 'scam-reports'] }),
  });

  return (
    <div className="bg-slate-950 min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Scam Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Reports submitted by your seniors.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 bg-slate-800 rounded-lg" />)}</div>
      ) : reports.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-12 text-center">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No Reports</h3>
            <p className="text-sm text-slate-400">No scam reports from your seniors.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{report.senior_name}</p>
                      <Badge variant="outline" className={cn('text-[10px]', STATUS_COLORS[report.status ?? 'new'] ?? STATUS_COLORS.new)}>
                        {report.status ?? 'new'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {report.created_date ? new Date(report.created_date).toLocaleString() : ''} | Type: {report.type ?? 'unknown'}
                    </p>
                  </div>
                  <span className={cn('text-xs font-bold uppercase', SEVERITY_COLORS[report.severity ?? 'warning'] ?? SEVERITY_COLORS.warning)}>
                    {report.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{report.description}</p>
                {report.when_happened && (
                  <p className="text-xs text-slate-400">
                    <Clock className="w-3 h-3 inline mr-1" />When: {report.when_happened}
                  </p>
                )}
                {report.who_contacted && (
                  <p className="text-xs text-slate-400">
                    <Eye className="w-3 h-3 inline mr-1" />Who: {report.who_contacted}
                  </p>
                )}
                {report.status !== 'reviewed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-600/30 text-green-400 hover:bg-green-600/10"
                    onClick={() => markReviewedMutation.mutate(report.id)}
                    disabled={markReviewedMutation.isPending}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />Mark as Reviewed
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
