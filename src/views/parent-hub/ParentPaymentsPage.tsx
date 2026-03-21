'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/auth-store';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';

interface Payment {
  id: string;
  description?: string;
  amount?: number;
  status?: string;
  due_date?: string;
  paid_date?: string;
  created_date?: string;
  child_name?: string;
}

const STATUS_COLORS: Record<string, string> = {
  outstanding: 'bg-red-600/20 text-red-400 border-red-600/30',
  paid: 'bg-green-600/20 text-green-400 border-green-600/30',
  overdue: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
  processing: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
};

export function ParentPaymentsPage(): React.ReactElement {
  const user = useAuthStore((s) => s.user);

  // TODO: Replace with fetch('/api/parent-hub/payments')
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ['parent', 'all-payments'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/payments'); return r.ok ? r.json() : []; },
    enabled: !!user?.id,
  });

  const outstanding = payments.filter((p) => p.status === 'outstanding' || p.status === 'overdue');
  const history = payments.filter((p) => p.status === 'paid' || p.status === 'processing');
  const totalOwed = outstanding.reduce((s, p) => s + (p.amount || 0), 0);
  const totalPaid = history.reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your invoices and payment history.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">${totalOwed.toLocaleString()}</p>
            <p className="text-xs text-slate-400">Total Owed</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{outstanding.length}</p>
            <p className="text-xs text-slate-400">Outstanding</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">${totalPaid.toLocaleString()}</p>
            <p className="text-xs text-slate-400">Total Paid</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white">Outstanding Invoices ({outstanding.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 bg-slate-800 rounded" />)}</div>
          ) : outstanding.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-slate-500">All paid up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {outstanding.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                  <div>
                    <p className="text-sm font-medium text-white">{p.description || 'Invoice'}</p>
                    <p className="text-xs text-slate-400">{p.child_name} {p.due_date ? `| Due ${new Date(p.due_date).toLocaleDateString()}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={cn('text-[10px]', STATUS_COLORS[p.status || 'outstanding'] || STATUS_COLORS.outstanding)}>{p.status}</Badge>
                    <span className="text-sm font-bold text-white">${(p.amount || 0).toLocaleString()}</span>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs">Pay Now</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No payment history</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Date</TableHead>
                    <TableHead className="text-slate-400">Description</TableHead>
                    <TableHead className="text-slate-400">Child</TableHead>
                    <TableHead className="text-slate-400">Amount</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((p) => (
                    <TableRow key={p.id} className="border-slate-800">
                      <TableCell className="text-sm text-slate-300">
                        {p.paid_date ? new Date(p.paid_date).toLocaleDateString() : p.created_date ? new Date(p.created_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-sm text-white">{p.description || 'Payment'}</TableCell>
                      <TableCell className="text-sm text-slate-400">{p.child_name || '-'}</TableCell>
                      <TableCell className="text-sm font-medium text-white">${(p.amount || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-[10px]', STATUS_COLORS[p.status || 'paid'] || STATUS_COLORS.paid)}>{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
