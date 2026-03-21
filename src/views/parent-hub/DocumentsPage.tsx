'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/auth-store';
import { FileText, Download, File, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Document {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  status?: string;
  file_url?: string;
  child_name?: string;
  organization?: string;
  created_date?: string;
}

const TYPE_ICONS: Record<string, LucideIcon> = { waiver: Shield, medical: FileText, team: File };
const TYPE_COLORS: Record<string, string> = { waiver: 'text-red-400', medical: 'text-blue-400', team: 'text-green-400' };

export function DocumentsPage(): React.ReactElement {
  const user = useAuthStore((s) => s.user);

  // TODO: Replace with fetch('/api/parent-hub/documents')
  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['parent', 'documents'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/documents'); return r.ok ? r.json() : []; },
    enabled: !!user?.id,
  });

  const grouped = documents.reduce<Record<string, Document[]>>((acc, doc) => {
    const type = doc.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Documents</h1>
        <p className="text-slate-400 text-sm mt-1">Waivers, medical forms, and team documents.</p>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 bg-slate-800 rounded-lg" />)}
        </div>
      ) : documents.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No Documents</h3>
            <p className="text-sm text-slate-400">Documents from your organizations will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([type, docs]) => {
          const Icon = TYPE_ICONS[type] || FileText;
          const iconColor = TYPE_COLORS[type] || 'text-slate-400';
          return (
            <Card key={type} className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className={cn('w-4 h-4', iconColor)} />
                  <CardTitle className="text-base text-white capitalize">{type} Documents ({docs.length})</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {docs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg">
                          <FileText className={cn('w-4 h-4', iconColor)} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{doc.name || doc.title}</p>
                          <p className="text-xs text-slate-400">
                            {doc.child_name && `${doc.child_name} | `}
                            {doc.organization || ''}
                            {doc.created_date ? ` | ${new Date(doc.created_date).toLocaleDateString()}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status && (
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px]',
                              doc.status === 'signed'
                                ? 'border-green-600/30 text-green-400'
                                : 'border-yellow-600/30 text-yellow-400'
                            )}
                          >
                            {doc.status}
                          </Badge>
                        )}
                        {doc.file_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-700 text-slate-300"
                            onClick={() => window.open(doc.file_url, '_blank')}
                          >
                            <Download className="w-3.5 h-3.5 mr-1" />Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
