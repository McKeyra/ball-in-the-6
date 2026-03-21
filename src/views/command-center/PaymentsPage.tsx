'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Search, DollarSign, Receipt, Filter, TrendingUp, AlertCircle, CheckCircle2, Clock, ShoppingBag, Heart, Ticket, Terminal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Payment { id: string; invoice_number?: string; parent_name?: string; payer?: string; description?: string; program_name?: string; amount?: number; status?: string; created_date?: string; }
interface PaymentTerminal { id: string; name: string; type?: string; amount_type?: string; amount?: number; total_collected?: number; }

const TERMINAL_TYPE_CONFIG: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  registration: { icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  event: { icon: Ticket, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  merchandise: { icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-500/20' },
  donation: { icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/20' },
};

const AMOUNT_TYPE_LABELS: Record<string, string> = { fixed: 'Fixed', variable: 'Variable', tiered: 'Tiered' };

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-600/20 text-green-400 border-green-600/30',
  pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  overdue: 'bg-red-600/20 text-red-400 border-red-600/30',
  refunded: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  failed: 'bg-red-600/20 text-red-400 border-red-600/30',
};

const INVOICE_STATUS_OPTIONS = ['completed', 'pending', 'overdue', 'refunded', 'failed'] as const;

export function PaymentsPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('ledger');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: terminals = [], isLoading: loadingTerminals } = useQuery<PaymentTerminal[]>({
    queryKey: ['command-center', 'payment-terminals'],
    queryFn: async () => { const r = await fetch('/api/command-center/payment-terminals'); return r.ok ? r.json() : []; },
  });

  const { data: payments = [], isLoading: loadingPayments } = useQuery<Payment[]>({
    queryKey: ['command-center', 'payments'],
    queryFn: async () => { const r = await fetch('/api/command-center/payments'); return r.ok ? r.json() : []; },
  });

  const totalCollected = payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalOverdue = payments.filter((p) => p.status === 'overdue').reduce((sum, p) => sum + (p.amount || 0), 0);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = !searchQuery || (p.parent_name || p.payer || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.invoice_number || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Payments</h1><p className="text-slate-400 text-sm mt-1">Payment terminals and financial ledger</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-green-500/20 rounded-lg"><CheckCircle2 className="w-5 h-5 text-green-400" /></div><div><p className="text-xs text-slate-400">Collected</p><p className="text-xl font-bold text-white">${totalCollected.toLocaleString()}</p></div></div></CardContent></Card>
        <Card className="bg-slate-900 border-slate-800"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-yellow-500/20 rounded-lg"><Clock className="w-5 h-5 text-yellow-400" /></div><div><p className="text-xs text-slate-400">Pending</p><p className="text-xl font-bold text-white">${totalPending.toLocaleString()}</p></div></div></CardContent></Card>
        <Card className="bg-slate-900 border-slate-800"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-red-500/20 rounded-lg"><AlertCircle className="w-5 h-5 text-red-400" /></div><div><p className="text-xs text-slate-400">Overdue</p><p className="text-xl font-bold text-white">${totalOverdue.toLocaleString()}</p></div></div></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="ledger" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"><Receipt className="w-4 h-4 mr-2" /> Ledger</TabsTrigger>
          <TabsTrigger value="terminals" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"><Terminal className="w-4 h-4 mr-2" /> Terminals</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><Input className="bg-slate-900 border-slate-800 text-white pl-9" placeholder="Search payer, invoice..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full sm:w-40"><Filter className="w-4 h-4 mr-2 text-slate-500" /><SelectValue placeholder="Status" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all" className="text-white hover:bg-slate-700">All Statuses</SelectItem>{INVOICE_STATUS_OPTIONS.map((s) => (<SelectItem key={s} value={s} className="text-white hover:bg-slate-700 capitalize">{s}</SelectItem>))}</SelectContent></Select>
          </div>
          {loadingPayments ? (<Card className="bg-slate-900 border-slate-800"><CardContent className="p-0">{[1,2,3,4,5,6].map((i) => (<div key={i} className="flex items-center gap-4 p-4 border-b border-slate-800"><Skeleton className="h-4 w-24 bg-slate-800" /><Skeleton className="h-4 w-32 bg-slate-800" /><Skeleton className="h-4 w-20 bg-slate-800 ml-auto" /><Skeleton className="h-4 w-16 bg-slate-800" /></div>))}</CardContent></Card>) : filteredPayments.length === 0 ? (<Card className="bg-slate-900 border-slate-800"><CardContent className="py-12 text-center"><DollarSign className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400 font-medium">No payments found</p></CardContent></Card>) : (
            <Card className="bg-slate-900 border-slate-800 overflow-hidden"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="border-slate-800 hover:bg-transparent"><TableHead className="text-slate-400">Invoice</TableHead><TableHead className="text-slate-400">Payer</TableHead><TableHead className="text-slate-400">Description</TableHead><TableHead className="text-slate-400">Date</TableHead><TableHead className="text-slate-400 text-right">Amount</TableHead><TableHead className="text-slate-400">Status</TableHead></TableRow></TableHeader><TableBody>{filteredPayments.map((payment) => (<TableRow key={payment.id} className="border-slate-800 hover:bg-slate-800/50"><TableCell className="text-sm text-slate-400 font-mono">{payment.invoice_number || `INV-${String(payment.id).slice(-6)}`}</TableCell><TableCell className="text-sm text-white font-medium">{payment.parent_name || payment.payer || 'Unknown'}</TableCell><TableCell className="text-sm text-slate-300 max-w-[200px] truncate">{payment.description || payment.program_name || 'Payment'}</TableCell><TableCell className="text-sm text-slate-400">{payment.created_date ? new Date(payment.created_date).toLocaleDateString() : 'N/A'}</TableCell><TableCell className="text-sm text-white font-medium text-right">${(payment.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell><TableCell><Badge variant="outline" className={cn('text-[10px] capitalize', PAYMENT_STATUS_COLORS[payment.status || ''] || PAYMENT_STATUS_COLORS.pending)}>{payment.status || 'pending'}</Badge></TableCell></TableRow>))}</TableBody></Table></div></Card>
          )}
        </TabsContent>

        <TabsContent value="terminals" className="mt-4">
          {loadingTerminals ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4].map((i) => (<Card key={i} className="bg-slate-900 border-slate-800"><CardContent className="p-4"><Skeleton className="h-6 w-32 mb-3 bg-slate-800" /><Skeleton className="h-4 w-24 mb-2 bg-slate-800" /><Skeleton className="h-4 w-full bg-slate-800" /></CardContent></Card>))}</div>) : terminals.length === 0 ? (<Card className="bg-slate-900 border-slate-800"><CardContent className="py-12 text-center"><Terminal className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400 font-medium">No payment terminals configured</p></CardContent></Card>) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{terminals.map((terminal) => {
              const config = TERMINAL_TYPE_CONFIG[terminal.type || ''] || TERMINAL_TYPE_CONFIG.registration;
              const Icon = config.icon;
              const collected = terminal.total_collected || 0;
              return (
                <Card key={terminal.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"><CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><div className={cn('p-2 rounded-lg', config.bg)}><Icon className={cn('w-5 h-5', config.color)} /></div><div><h3 className="font-semibold text-white text-sm">{terminal.name}</h3><p className="text-xs text-slate-400 capitalize">{terminal.type}</p></div></div></div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Amount Type</span><Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px] capitalize">{AMOUNT_TYPE_LABELS[terminal.amount_type || ''] || terminal.amount_type || 'Fixed'}</Badge></div>
                    {terminal.amount && (<div className="flex items-center justify-between"><span className="text-xs text-slate-400">Price</span><span className="text-sm text-white font-medium">${Number(terminal.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>)}
                    <Separator className="bg-slate-800" />
                    <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Total Collected</span><div className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-green-500" /><span className="text-sm font-bold text-green-400">${collected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div></div>
                  </div>
                </CardContent></Card>
              );
            })}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
