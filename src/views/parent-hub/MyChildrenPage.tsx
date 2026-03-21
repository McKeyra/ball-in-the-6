'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/auth-store';
import { Plus, Users, Calendar, BookOpen } from 'lucide-react';

interface Child {
  id: string;
  name?: string;
  dob?: string;
  sport?: string;
  position?: string;
  school?: string;
  team?: string;
  status?: string;
  next_event?: string;
}

const SPORTS = ['Basketball', 'Soccer', 'Football', 'Baseball', 'Hockey', 'Track & Field', 'Swimming', 'Volleyball', 'Tennis'] as const;

interface ChildForm {
  name: string;
  dob: string;
  sport: string;
  position: string;
  school: string;
}

const INITIAL_CHILD: ChildForm = { name: '', dob: '', sport: '', position: '', school: '' };

export function MyChildrenPage(): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<ChildForm>(INITIAL_CHILD);

  // TODO: Replace with fetch('/api/parent-hub/children')
  const { data: children = [], isLoading } = useQuery<Child[]>({
    queryKey: ['parent', 'children'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/children'); return r.ok ? r.json() : []; },
    enabled: !!user?.id,
  });

  const addMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: Replace with fetch('/api/parent-hub/children', { method: 'POST', body: JSON.stringify(data) })
      const r = await fetch('/api/parent-hub/children', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', 'children'] });
      setShowAdd(false);
      setForm(INITIAL_CHILD);
    },
  });

  const handleAdd = (): void => {
    addMutation.mutate({
      parent_id: user?.id,
      name: form.name,
      dob: form.dob,
      sport: form.sport,
      position: form.position,
      school: form.school,
      status: 'active',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Children</h1>
          <p className="text-slate-400 text-sm mt-1">{children.length} child{children.length !== 1 ? 'ren' : ''} registered</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white"><Plus className="w-4 h-4 mr-1" /> Add Child</Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader><DialogTitle className="text-white">Add Child</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Full Name</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Child's full name" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Date of Birth</Label>
                <Input type="date" value={form.dob} onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Sport</Label>
                  <Select value={form.sport} onValueChange={(v) => setForm((f) => ({ ...f, sport: v }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {SPORTS.map((s) => <SelectItem key={s} value={s} className="text-white hover:bg-slate-700">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Position</Label>
                  <Input value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} placeholder="e.g. PG" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">School</Label>
                <Input value={form.school} onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))} placeholder="School name" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleAdd} disabled={!form.name.trim() || addMutation.isPending}>
                {addMutation.isPending ? 'Adding...' : 'Add Child'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 bg-slate-800 rounded-lg" />)}
        </div>
      ) : children.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No Children Added</h3>
            <p className="text-sm text-slate-400 mb-4">Add your child to manage their activities, payments, and schedules.</p>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add Your First Child
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <Card key={child.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-red-400">{(child.name || 'C').charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{child.name}</p>
                    <p className="text-xs text-slate-400">{child.sport} {child.position && `- ${child.position}`}</p>
                  </div>
                  <Badge variant="outline" className={cn('text-[10px]', child.status === 'active' ? 'border-green-600/30 text-green-400' : 'border-slate-700 text-slate-400')}>
                    {child.status || 'active'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {child.team && (
                    <div className="flex items-center gap-1 text-slate-400"><BookOpen className="w-3 h-3" />{child.team}</div>
                  )}
                  {child.school && (
                    <div className="flex items-center gap-1 text-slate-400"><Calendar className="w-3 h-3" />{child.school}</div>
                  )}
                </div>
                {child.next_event && (
                  <div className="p-2 rounded bg-slate-800/50 text-xs">
                    <span className="text-slate-500">Next: </span>
                    <span className="text-slate-300">{child.next_event}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
