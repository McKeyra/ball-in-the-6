'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Plus, ClipboardCheck, Clock, CheckCircle, XCircle } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface ContractorVet {
  id: string;
  name: string;
  type: string;
  company?: string;
  phone?: string;
  notes?: string;
  status: string;
  created_date?: string;
}

interface VetForm {
  name: string;
  type: string;
  company: string;
  phone: string;
  notes: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  approved: 'bg-green-600/20 text-green-400 border-green-600/30',
  rejected: 'bg-red-600/20 text-red-400 border-red-600/30',
};

const CONTRACTOR_TYPES = ['Plumber', 'Electrician', 'Handyman', 'Cleaner', 'Caregiver', 'Gardener', 'Contractor', 'Other'] as const;

export function VetContractorsPage(): React.ReactElement {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<VetForm>({ name: '', type: '', company: '', phone: '', notes: '' });

  const { data: vets = [], isLoading } = useQuery<ContractorVet[]>({
    queryKey: ['vtf', 'contractor-vets'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/contractor-vets')
      return [];
    },
    enabled: !!user?.id,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: fetch('/api/vtf/family/contractor-vets', { method: 'POST', body: JSON.stringify(data) })
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vtf', 'contractor-vets'] });
      setShowAdd(false);
      setForm({ name: '', type: '', company: '', phone: '', notes: '' });
    },
  });

  const pending = vets.filter((v) => v.status === 'pending');

  return (
    <div className="bg-slate-950 min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vet Contractors</h1>
          <p className="text-slate-400 text-sm mt-1">Submit and track contractor vetting requests.</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-1" />Submit for Vet
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Submit Contractor for Vetting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Contractor Name</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACTOR_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Company (optional)</Label>
                <Input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={() => submitMutation.mutate({ ...form, family_user_id: user?.id, status: 'pending', created_date: new Date().toISOString() })}
                disabled={!form.name.trim() || !form.type}
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit for Vetting'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pending.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Pending ({pending.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pending.map((vet) => (
              <div key={vet.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-600/5 border border-yellow-600/20">
                <div>
                  <p className="text-sm font-medium text-white">{vet.name}</p>
                  <p className="text-xs text-slate-400">{vet.type} {vet.company && `| ${vet.company}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <Badge variant="outline" className="text-[10px] border-yellow-600/30 text-yellow-400">Pending</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white">All Contractors ({vets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 bg-slate-800 rounded" />)}</div>
          ) : vets.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No contractors submitted yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {vets.map((vet) => (
                <div key={vet.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      vet.status === 'approved' ? 'bg-green-600/20' : vet.status === 'rejected' ? 'bg-red-600/20' : 'bg-yellow-600/20',
                    )}>
                      {vet.status === 'approved' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                       vet.status === 'rejected' ? <XCircle className="w-4 h-4 text-red-400" /> :
                       <Clock className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{vet.name}</p>
                      <p className="text-xs text-slate-400">{vet.type} {vet.company && `| ${vet.company}`}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn('text-[10px]', STATUS_COLORS[vet.status] ?? STATUS_COLORS.pending)}>
                    {vet.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
