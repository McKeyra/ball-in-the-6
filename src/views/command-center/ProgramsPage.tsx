'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Plus, LayoutGrid, List, Search, Users, Calendar, DollarSign, Trophy, Filter } from 'lucide-react';

interface Program { id: string; name: string; sport?: string; description?: string; age_min?: number; age_max?: number; max_participants?: number; registration_fee?: number; status?: string; start_date?: string; end_date?: string; }
interface Registration { id: string; program_id?: string; program_name?: string; }

const STATUS_OPTIONS = ['draft', 'open', 'in_progress', 'closed', 'completed'] as const;
const SPORT_OPTIONS = ['Basketball', 'Soccer', 'Baseball', 'Hockey', 'Football', 'Track & Field', 'Swimming', 'Volleyball', 'Other'] as const;
const STATUS_COLORS: Record<string, string> = { draft: 'bg-slate-600/20 text-slate-400 border-slate-600/30', open: 'bg-green-600/20 text-green-400 border-green-600/30', in_progress: 'bg-blue-600/20 text-blue-400 border-blue-600/30', closed: 'bg-red-600/20 text-red-400 border-red-600/30', completed: 'bg-purple-600/20 text-purple-400 border-purple-600/30' };

interface ProgramForm { name: string; sport: string; description: string; age_min: string; age_max: string; max_participants: string; registration_fee: string; status: string; start_date: string; end_date: string; }
const INITIAL_FORM: ProgramForm = { name: '', sport: '', description: '', age_min: '', age_max: '', max_participants: '', registration_fee: '', status: 'draft', start_date: '', end_date: '' };

export function ProgramsPage(): React.ReactElement {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ProgramForm>(INITIAL_FORM);

  const { data: programs = [], isLoading } = useQuery<Program[]>({ queryKey: ['command-center', 'programs'], queryFn: async () => { const r = await fetch('/api/command-center/programs'); return r.ok ? r.json() : []; } });
  const { data: registrations = [] } = useQuery<Registration[]>({ queryKey: ['command-center', 'registrations-all'], queryFn: async () => { const r = await fetch('/api/command-center/registrations'); return r.ok ? r.json() : []; } });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => { const r = await fetch('/api/command-center/programs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); return r.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['command-center', 'programs'] }); setDialogOpen(false); setForm(INITIAL_FORM); },
  });

  const participantCounts = registrations.reduce<Record<string, number>>((acc, reg) => { const key = reg.program_id || reg.program_name || ''; if (key) acc[key] = (acc[key] || 0) + 1; return acc; }, {});

  const filtered = programs.filter((p) => {
    const matchesSearch = !searchQuery || (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.sport || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSport = sportFilter === 'all' || p.sport === sportFilter;
    return matchesSearch && matchesStatus && matchesSport;
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    createMutation.mutate({ ...form, age_min: form.age_min ? Number(form.age_min) : null, age_max: form.age_max ? Number(form.age_max) : null, max_participants: form.max_participants ? Number(form.max_participants) : null, registration_fee: form.registration_fee ? Number(form.registration_fee) : null });
  };

  const updateForm = (field: keyof ProgramForm, value: string): void => setForm((prev) => ({ ...prev, [field]: value }));
  const getParticipantCount = (program: Program): number => participantCounts[program.id] || participantCounts[program.name] || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Programs</h1><p className="text-slate-400 text-sm mt-1">Manage your organization&apos;s programs and seasons</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="bg-red-600 hover:bg-red-700 text-white"><Plus className="w-4 h-4 mr-2" /> Create Program</Button></DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create New Program</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2"><Label className="text-slate-300">Program Name</Label><Input className="bg-slate-800 border-slate-700 text-white" value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="e.g. Summer Basketball League" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-slate-300">Sport</Label><Select value={form.sport} onValueChange={(v) => updateForm('sport', v)}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select sport" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700">{SPORT_OPTIONS.map((s) => (<SelectItem key={s} value={s} className="text-white hover:bg-slate-700">{s}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label className="text-slate-300">Status</Label><Select value={form.status} onValueChange={(v) => updateForm('status', v)}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700">{STATUS_OPTIONS.map((s) => (<SelectItem key={s} value={s} className="text-white hover:bg-slate-700 capitalize">{s.replace('_', ' ')}</SelectItem>))}</SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label className="text-slate-300">Description</Label><Textarea className="bg-slate-800 border-slate-700 text-white min-h-[80px]" value={form.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Program details..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-slate-300">Min Age</Label><Input type="number" className="bg-slate-800 border-slate-700 text-white" value={form.age_min} onChange={(e) => updateForm('age_min', e.target.value)} placeholder="e.g. 8" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Max Age</Label><Input type="number" className="bg-slate-800 border-slate-700 text-white" value={form.age_max} onChange={(e) => updateForm('age_max', e.target.value)} placeholder="e.g. 14" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-slate-300">Max Participants</Label><Input type="number" className="bg-slate-800 border-slate-700 text-white" value={form.max_participants} onChange={(e) => updateForm('max_participants', e.target.value)} placeholder="e.g. 60" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Registration Fee ($)</Label><Input type="number" step="0.01" className="bg-slate-800 border-slate-700 text-white" value={form.registration_fee} onChange={(e) => updateForm('registration_fee', e.target.value)} placeholder="e.g. 150.00" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-slate-300">Start Date</Label><Input type="date" className="bg-slate-800 border-slate-700 text-white" value={form.start_date} onChange={(e) => updateForm('start_date', e.target.value)} /></div>
                <div className="space-y-2"><Label className="text-slate-300">End Date</Label><Input type="date" className="bg-slate-800 border-slate-700 text-white" value={form.end_date} onChange={(e) => updateForm('end_date', e.target.value)} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2"><Button type="button" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating...' : 'Create Program'}</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><Input className="bg-slate-900 border-slate-800 text-white pl-9" placeholder="Search programs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full sm:w-40"><Filter className="w-4 h-4 mr-2 text-slate-500" /><SelectValue placeholder="Status" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all" className="text-white hover:bg-slate-700">All Statuses</SelectItem>{STATUS_OPTIONS.map((s) => (<SelectItem key={s} value={s} className="text-white hover:bg-slate-700 capitalize">{s.replace('_', ' ')}</SelectItem>))}</SelectContent></Select>
        <Select value={sportFilter} onValueChange={setSportFilter}><SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full sm:w-40"><Trophy className="w-4 h-4 mr-2 text-slate-500" /><SelectValue placeholder="Sport" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all" className="text-white hover:bg-slate-700">All Sports</SelectItem>{SPORT_OPTIONS.map((s) => (<SelectItem key={s} value={s} className="text-white hover:bg-slate-700">{s}</SelectItem>))}</SelectContent></Select>
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-md p-1">
          <Button variant="ghost" size="sm" className={cn('px-2', viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white')} onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" className={cn('px-2', viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white')} onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
        </div>
      </div>

      {isLoading ? (<div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3')}>{[1,2,3,4,5,6].map((i) => (<Card key={i} className="bg-slate-900 border-slate-800"><CardContent className="p-4"><Skeleton className="h-5 w-32 mb-3 bg-slate-800" /><Skeleton className="h-4 w-24 mb-2 bg-slate-800" /><Skeleton className="h-4 w-full mb-2 bg-slate-800" /><Skeleton className="h-3 w-20 bg-slate-800" /></CardContent></Card>))}</div>) : filtered.length === 0 ? (<Card className="bg-slate-900 border-slate-800"><CardContent className="py-12 text-center"><Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400 font-medium">No programs found</p></CardContent></Card>) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map((program) => {
          const count = getParticipantCount(program); const max = program.max_participants; const fillPct = max ? Math.round((count / max) * 100) : 0;
          return (<Card key={program.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"><CardContent className="p-4">
            <div className="flex items-start justify-between mb-3"><div><h3 className="font-semibold text-white text-sm">{program.name}</h3><p className="text-xs text-slate-400 mt-0.5">{program.sport || 'General'}</p></div><Badge variant="outline" className={cn('text-[10px] capitalize', STATUS_COLORS[program.status || ''] || STATUS_COLORS.draft)}>{(program.status || 'draft').replace('_', ' ')}</Badge></div>
            {program.description && (<p className="text-xs text-slate-500 mb-3 line-clamp-2">{program.description}</p>)}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400"><Users className="w-3.5 h-3.5" /><span>{count}{max ? `/${max}` : ''} participants</span>{max && (<div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className={cn('h-full rounded-full transition-all', fillPct >= 90 ? 'bg-red-500' : fillPct >= 70 ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: `${Math.min(fillPct, 100)}%` }} /></div>)}</div>
              {(program.age_min || program.age_max) && (<div className="flex items-center gap-2 text-xs text-slate-400"><Calendar className="w-3.5 h-3.5" /><span>Ages {program.age_min || '?'} - {program.age_max || '?'}</span></div>)}
              {program.registration_fee && (<div className="flex items-center gap-2 text-xs text-slate-400"><DollarSign className="w-3.5 h-3.5" /><span>${Number(program.registration_fee).toFixed(2)}</span></div>)}
            </div>
          </CardContent></Card>);
        })}</div>
      ) : (
        <div className="space-y-2">{filtered.map((program) => {
          const count = getParticipantCount(program); const max = program.max_participants;
          return (<Card key={program.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"><CardContent className="p-3 flex items-center gap-4">
            <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h3 className="font-semibold text-white text-sm truncate">{program.name}</h3><Badge variant="outline" className={cn('text-[10px] capitalize shrink-0', STATUS_COLORS[program.status || ''] || STATUS_COLORS.draft)}>{(program.status || 'draft').replace('_', ' ')}</Badge></div><p className="text-xs text-slate-400 mt-0.5">{program.sport || 'General'}{(program.age_min || program.age_max) ? ` | Ages ${program.age_min || '?'}-${program.age_max || '?'}` : ''}</p></div>
            <div className="flex items-center gap-6 text-xs text-slate-400 shrink-0"><div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /><span>{count}{max ? `/${max}` : ''}</span></div>{program.registration_fee && (<div className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /><span>${Number(program.registration_fee).toFixed(2)}</span></div>)}</div>
          </CardContent></Card>);
        })}</div>
      )}
    </div>
  );
}
