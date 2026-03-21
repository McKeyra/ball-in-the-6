'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Search, Filter, ClipboardList, UserMinus, ArrowUpCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Registration { id: string; athlete_name?: string; name?: string; program_name?: string; program?: string; status?: string; payment_status?: string; created_date?: string; }

const STATUS_OPTIONS = ['pending', 'approved', 'waitlisted', 'rejected', 'cancelled'] as const;
const PAYMENT_STATUS_OPTIONS = ['paid', 'unpaid', 'partial', 'refunded'] as const;
const STATUS_COLORS: Record<string, string> = { pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30', approved: 'bg-green-600/20 text-green-400 border-green-600/30', waitlisted: 'bg-blue-600/20 text-blue-400 border-blue-600/30', rejected: 'bg-red-600/20 text-red-400 border-red-600/30', cancelled: 'bg-slate-600/20 text-slate-400 border-slate-600/30' };
const PAYMENT_COLORS: Record<string, string> = { paid: 'bg-green-600/20 text-green-400 border-green-600/30', unpaid: 'bg-red-600/20 text-red-400 border-red-600/30', partial: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30', refunded: 'bg-slate-600/20 text-slate-400 border-slate-600/30' };

export function RegistrationsPage(): React.ReactElement {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: registrations = [], isLoading } = useQuery<Registration[]>({ queryKey: ['command-center', 'registrations'], queryFn: async () => { const r = await fetch('/api/command-center/registrations'); return r.ok ? r.json() : []; } });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => { const r = await fetch(`/api/command-center/registrations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) }); return r.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['command-center', 'registrations'] }); },
  });

  const filtered = registrations.filter((r) => {
    const matchesSearch = !searchQuery || (r.athlete_name || r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (r.program_name || r.program || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || r.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const waitlisted = filtered.filter((r) => r.status === 'waitlisted');
  const showWaitlist = statusFilter === 'waitlisted' || statusFilter === 'all';

  const toggleSelect = (id: string): void => { setSelectedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };
  const toggleSelectAll = (): void => { if (selectedIds.size === filtered.length) { setSelectedIds(new Set()); } else { setSelectedIds(new Set(filtered.map((r) => r.id))); } };
  const bulkUpdateStatus = (status: string): void => { selectedIds.forEach((id) => { updateMutation.mutate({ id, updates: { status } }); }); setSelectedIds(new Set()); };
  const promoteFromWaitlist = (id: string): void => { updateMutation.mutate({ id, updates: { status: 'approved' } }); };
  const removeRegistration = (id: string): void => { updateMutation.mutate({ id, updates: { status: 'cancelled' } }); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Registrations</h1><p className="text-slate-400 text-sm mt-1">Track athlete registrations, waitlists, and payments</p></div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-slate-700 text-slate-300">{filtered.length} total</Badge>
          {waitlisted.length > 0 && (<Badge variant="outline" className="border-blue-600/30 text-blue-400">{waitlisted.length} waitlisted</Badge>)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><Input className="bg-slate-900 border-slate-800 text-white pl-9" placeholder="Search athlete or program..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full sm:w-40"><Filter className="w-4 h-4 mr-2 text-slate-500" /><SelectValue placeholder="Status" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all" className="text-white hover:bg-slate-700">All Statuses</SelectItem>{STATUS_OPTIONS.map((s) => (<SelectItem key={s} value={s} className="text-white hover:bg-slate-700 capitalize">{s}</SelectItem>))}</SelectContent></Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}><SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full sm:w-40"><SelectValue placeholder="Payment" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all" className="text-white hover:bg-slate-700">All Payments</SelectItem>{PAYMENT_STATUS_OPTIONS.map((s) => (<SelectItem key={s} value={s} className="text-white hover:bg-slate-700 capitalize">{s}</SelectItem>))}</SelectContent></Select>
      </div>

      {selectedIds.size > 0 && (
        <Card className="bg-slate-800 border-slate-700"><CardContent className="py-3 px-4 flex items-center gap-4">
          <span className="text-sm text-white font-medium">{selectedIds.size} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-green-600/30 text-green-400 hover:bg-green-600/10" onClick={() => bulkUpdateStatus('approved')}><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approve</Button>
            <Button size="sm" variant="outline" className="border-red-600/30 text-red-400 hover:bg-red-600/10" onClick={() => bulkUpdateStatus('rejected')}><XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject</Button>
            <Button size="sm" variant="outline" className="border-blue-600/30 text-blue-400 hover:bg-blue-600/10" onClick={() => bulkUpdateStatus('waitlisted')}><Clock className="w-3.5 h-3.5 mr-1.5" /> Waitlist</Button>
          </div>
          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white ml-auto" onClick={() => setSelectedIds(new Set())}>Clear</Button>
        </CardContent></Card>
      )}

      {isLoading ? (<Card className="bg-slate-900 border-slate-800"><CardContent className="p-0">{[1,2,3,4,5,6,7,8].map((i) => (<div key={i} className="flex items-center gap-4 p-4 border-b border-slate-800"><Skeleton className="w-4 h-4 bg-slate-800" /><Skeleton className="w-8 h-8 rounded-full bg-slate-800" /><Skeleton className="h-4 w-32 bg-slate-800" /><Skeleton className="h-4 w-24 bg-slate-800 ml-auto" /><Skeleton className="h-4 w-16 bg-slate-800" /><Skeleton className="h-4 w-16 bg-slate-800" /></div>))}</CardContent></Card>) : filtered.length === 0 ? (<Card className="bg-slate-900 border-slate-800"><CardContent className="py-12 text-center"><ClipboardList className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400 font-medium">No registrations found</p></CardContent></Card>) : (
        <Card className="bg-slate-900 border-slate-800 overflow-hidden"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="border-slate-800 hover:bg-transparent"><TableHead className="w-10"><Checkbox checked={selectedIds.size === filtered.length && filtered.length > 0} onCheckedChange={toggleSelectAll} className="border-slate-600" /></TableHead><TableHead className="text-slate-400">Athlete</TableHead><TableHead className="text-slate-400">Program</TableHead><TableHead className="text-slate-400">Date</TableHead><TableHead className="text-slate-400">Status</TableHead><TableHead className="text-slate-400">Payment</TableHead><TableHead className="text-slate-400 w-20">Actions</TableHead></TableRow></TableHeader><TableBody>{filtered.map((reg) => (
          <TableRow key={reg.id} className={cn('border-slate-800 hover:bg-slate-800/50', selectedIds.has(reg.id) && 'bg-slate-800/30')}>
            <TableCell><Checkbox checked={selectedIds.has(reg.id)} onCheckedChange={() => toggleSelect(reg.id)} className="border-slate-600" /></TableCell>
            <TableCell><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0"><span className="text-xs font-medium text-white">{(reg.athlete_name || reg.name || 'A').charAt(0).toUpperCase()}</span></div><span className="text-sm text-white font-medium truncate">{reg.athlete_name || reg.name || 'Unknown'}</span></div></TableCell>
            <TableCell className="text-sm text-slate-300">{reg.program_name || reg.program || 'N/A'}</TableCell>
            <TableCell className="text-sm text-slate-400">{reg.created_date ? new Date(reg.created_date).toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell><Badge variant="outline" className={cn('text-[10px] capitalize', STATUS_COLORS[reg.status || ''] || STATUS_COLORS.pending)}>{reg.status || 'pending'}</Badge></TableCell>
            <TableCell><Badge variant="outline" className={cn('text-[10px] capitalize', PAYMENT_COLORS[reg.payment_status || ''] || PAYMENT_COLORS.unpaid)}>{reg.payment_status || 'unpaid'}</Badge></TableCell>
            <TableCell><div className="flex items-center gap-1">{reg.status === 'waitlisted' && (<Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-green-400 hover:text-green-300 hover:bg-green-600/10" onClick={() => promoteFromWaitlist(reg.id)} title="Promote to approved"><ArrowUpCircle className="w-4 h-4" /></Button>)}{reg.status !== 'cancelled' && (<Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-600/10" onClick={() => removeRegistration(reg.id)} title="Cancel registration"><UserMinus className="w-4 h-4" /></Button>)}</div></TableCell>
          </TableRow>
        ))}</TableBody></Table></div></Card>
      )}

      {showWaitlist && waitlisted.length > 0 && statusFilter !== 'waitlisted' && (
        <Card className="bg-slate-900 border-blue-600/20"><CardHeader className="pb-2"><CardTitle className="text-base text-white flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" />Waitlist ({waitlisted.length})</CardTitle></CardHeader><CardContent><div className="space-y-2">{waitlisted.map((reg, idx) => (
          <div key={reg.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
            <div className="flex items-center gap-3"><span className="text-xs text-slate-500 font-mono w-6">#{idx + 1}</span><div><p className="text-sm font-medium text-white">{reg.athlete_name || reg.name || 'Unknown'}</p><p className="text-xs text-slate-400">{reg.program_name || reg.program || 'N/A'}</p></div></div>
            <div className="flex items-center gap-2"><Button size="sm" variant="outline" className="h-7 text-xs border-green-600/30 text-green-400 hover:bg-green-600/10" onClick={() => promoteFromWaitlist(reg.id)}><ArrowUpCircle className="w-3 h-3 mr-1" /> Promote</Button><Button size="sm" variant="outline" className="h-7 text-xs border-red-600/30 text-red-400 hover:bg-red-600/10" onClick={() => removeRegistration(reg.id)}><UserMinus className="w-3 h-3 mr-1" /> Remove</Button></div>
          </div>
        ))}</div></CardContent></Card>
      )}
    </div>
  );
}
