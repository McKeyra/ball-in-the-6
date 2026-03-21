'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone } from 'lucide-react';

interface Announcement {
  id: string;
  title?: string;
  body?: string;
  organization?: string;
  created_date?: string;
}

export function AnnouncementsPage(): React.ReactElement {
  // TODO: Replace with fetch('/api/parent-hub/announcements')
  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ['parent', 'announcements-all'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/announcements'); return r.ok ? r.json() : []; },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Announcements</h1>
        <p className="text-slate-400 text-sm mt-1">Latest news from your organizations and teams.</p>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 bg-slate-800 rounded-lg" />)}
        </div>
      ) : announcements.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-12 text-center">
            <Megaphone className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No Announcements</h3>
            <p className="text-sm text-slate-400">Check back later for updates from your teams.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <Card key={ann.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-white">{ann.title}</h3>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                    {ann.created_date ? new Date(ann.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  </span>
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{ann.body}</p>
                {ann.organization && (
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">{ann.organization}</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
