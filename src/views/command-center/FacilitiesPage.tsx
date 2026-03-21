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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus, MapPin, Users, Building2, Search, Waves, TreePine, Dumbbell, Snowflake, LayoutGrid } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  type?: string;
  address?: string;
  capacity?: number;
  availability?: string;
  description?: string;
  contact_name?: string;
  contact_phone?: string;
}

const FACILITY_TYPES = ['gym', 'field', 'pool', 'court', 'rink'] as const;

const FACILITY_TYPE_CONFIG: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  gym: { icon: Dumbbell, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  field: { icon: TreePine, color: 'text-green-400', bg: 'bg-green-500/20' },
  pool: { icon: Waves, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  court: { icon: LayoutGrid, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  rink: { icon: Snowflake, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
};

const AVAILABILITY_OPTIONS = ['available', 'limited', 'unavailable', 'maintenance'] as const;

const AVAILABILITY_COLORS: Record<string, string> = {
  available: 'bg-green-600/20 text-green-400 border-green-600/30',
  limited: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  unavailable: 'bg-red-600/20 text-red-400 border-red-600/30',
  maintenance: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
};

interface FacilityForm {
  name: string;
  type: string;
  address: string;
  capacity: string;
  availability: string;
  description: string;
  contact_name: string;
  contact_phone: string;
}

const INITIAL_FORM: FacilityForm = { name: '', type: 'gym', address: '', capacity: '', availability: 'available', description: '', contact_name: '', contact_phone: '' };

export function FacilitiesPage(): React.ReactElement {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FacilityForm>(INITIAL_FORM);

  const { data: facilities = [], isLoading } = useQuery<Facility[]>({
    queryKey: ['command-center', 'facilities'],
    queryFn: async () => { const r = await fetch('/api/command-center/facilities'); return r.ok ? r.json() : []; },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const r = await fetch('/api/command-center/facilities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      return r.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['command-center', 'facilities'] }); setDialogOpen(false); setForm(INITIAL_FORM); },
  });

  const filtered = facilities.filter((f) => {
    const matchesSearch = !searchQuery || (f.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (f.address || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || f.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    createMutation.mutate({ ...form, capacity: form.capacity ? Number(form.capacity) : null });
  };

  const updateForm = (field: keyof FacilityForm, value: string): void => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Facilities</h1><p className="text-slate-400 text-sm mt-1">Manage venues, gyms, fields, and other spaces</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="bg-red-600 hover:bg-red-700 text-white"><Plus className="w-4 h-4 mr-2" /> Add Facility</Button></DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add Facility</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2"><Label className="text-slate-300">Facility Name</Label><Input className="bg-slate-800 border-slate-700 text-white" value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="e.g. Community Recreation Center" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-slate-300">Type</Label><Select value={form.type} onValueChange={(v) => updateForm('type', v)}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700">{FACILITY_TYPES.map((t) => (<SelectItem key={t} value={t} className="text-white hover:bg-slate-700 capitalize">{t}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label className="text-slate-300">Capacity</Label><Input type="number" className="bg-slate-800 border-slate-700 text-white" value={form.capacity} onChange={(e) => updateForm('capacity', e.target.value)} placeholder="e.g. 200" /></div>
              </div>
              <div className="space-y-2"><Label className="text-slate-300">Address</Label><Input className="bg-slate-800 border-slate-700 text-white" value={form.address} onChange={(e) => updateForm('address', e.target.value)} placeholder="Full address" /></div>
              <div className="space-y-2"><Label className="text-slate-300">Availability</Label><Select value={form.availability} onValueChange={(v) => updateForm('availability', v)}><SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700">{AVAILABILITY_OPTIONS.map((a) => (<SelectItem key={a} value={a} className="text-white hover:bg-slate-700 capitalize">{a}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-2"><Label className="text-slate-300">Description</Label><Textarea className="bg-slate-800 border-slate-700 text-white min-h-[80px]" value={form.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Amenities, notes, booking info..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-slate-300">Contact Name</Label><Input className="bg-slate-800 border-slate-700 text-white" value={form.contact_name} onChange={(e) => updateForm('contact_name', e.target.value)} placeholder="Facility manager" /></div>
                <div className="space-y-2"><Label className="text-slate-300">Contact Phone</Label><Input className="bg-slate-800 border-slate-700 text-white" value={form.contact_phone} onChange={(e) => updateForm('contact_phone', e.target.value)} placeholder="(416) 555-0123" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={createMutation.isPending}>{createMutation.isPending ? 'Adding...' : 'Add Facility'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><Input className="bg-slate-900 border-slate-800 text-white pl-9" placeholder="Search facilities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full sm:w-40"><Building2 className="w-4 h-4 mr-2 text-slate-500" /><SelectValue placeholder="Type" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all" className="text-white hover:bg-slate-700">All Types</SelectItem>{FACILITY_TYPES.map((t) => (<SelectItem key={t} value={t} className="text-white hover:bg-slate-700 capitalize">{t}</SelectItem>))}</SelectContent></Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4].map((i) => (<Card key={i} className="bg-slate-900 border-slate-800"><CardContent className="p-4"><Skeleton className="h-6 w-32 mb-3 bg-slate-800" /><Skeleton className="h-4 w-20 mb-2 bg-slate-800" /><Skeleton className="h-4 w-full mb-2 bg-slate-800" /><Skeleton className="h-4 w-24 bg-slate-800" /></CardContent></Card>))}</div>
      ) : filtered.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800"><CardContent className="py-12 text-center"><Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400 font-medium">No facilities found</p><p className="text-slate-500 text-sm mt-1">{searchQuery || typeFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first facility to get started'}</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((facility) => {
            const type = facility.type || 'gym';
            const config = FACILITY_TYPE_CONFIG[type] || FACILITY_TYPE_CONFIG.gym;
            const Icon = config.icon;
            const availability = facility.availability || 'available';
            return (
              <Card key={facility.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2.5 rounded-lg', config.bg)}><Icon className={cn('w-5 h-5', config.color)} /></div>
                      <div><h3 className="font-semibold text-white text-sm">{facility.name}</h3><p className="text-xs text-slate-400 capitalize">{type}</p></div>
                    </div>
                    <Badge variant="outline" className={cn('text-[10px] capitalize', AVAILABILITY_COLORS[availability] || AVAILABILITY_COLORS.available)}>{availability}</Badge>
                  </div>
                  {facility.address && (<div className="flex items-start gap-2 mb-3"><MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" /><p className="text-xs text-slate-400 leading-relaxed">{facility.address}</p></div>)}
                  {facility.description && (<p className="text-xs text-slate-500 mb-3 line-clamp-2">{facility.description}</p>)}
                  <Separator className="bg-slate-800 mb-3" />
                  <div className="flex items-center justify-between">
                    {facility.capacity && (<div className="flex items-center gap-1.5 text-xs text-slate-400"><Users className="w-3.5 h-3.5" /><span>Capacity: {facility.capacity}</span></div>)}
                    {facility.contact_name && (<p className="text-xs text-slate-500 truncate max-w-[120px]">{facility.contact_name}</p>)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
