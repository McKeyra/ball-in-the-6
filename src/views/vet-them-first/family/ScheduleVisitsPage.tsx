'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface Senior {
  id: string;
  senior_id: string;
  senior_name: string;
}

interface Visit {
  id: string;
  senior_name?: string;
  date: string;
  time?: string;
  type?: string;
  notes?: string;
}

interface VisitForm {
  senior_id: string;
  date: string;
  time: string;
  type: string;
  notes: string;
}

const VISIT_TYPES = ['Check-in', 'Medical', 'Social', 'Errands', 'Tech Support', 'Other'] as const;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function getMonthDays(y: number, m: number): (number | null)[] {
  const f = new Date(y, m, 1).getDay();
  const d = new Date(y, m + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < f; i++) days.push(null);
  for (let i = 1; i <= d; i++) days.push(i);
  return days;
}

function fmtDate(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function ScheduleVisitsPage(): React.ReactElement {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<VisitForm>({ senior_id: '', date: '', time: '', type: 'Check-in', notes: '' });

  const { data: seniors = [] } = useQuery<Senior[]>({
    queryKey: ['vtf', 'family-seniors'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/seniors')
      return [];
    },
    enabled: !!user?.id,
  });

  const { data: visits = [] } = useQuery<Visit[]>({
    queryKey: ['vtf', 'visits'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/visits')
      return [];
    },
    enabled: !!user?.id,
  });

  const addMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: fetch('/api/vtf/family/visits', { method: 'POST', body: JSON.stringify(data) })
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vtf', 'visits'] });
      setShowAdd(false);
      setForm({ senior_id: '', date: '', time: '', type: 'Check-in', notes: '' });
    },
  });

  const visitsByDate = useMemo(() => {
    const m: Record<string, Visit[]> = {};
    visits.forEach((v) => {
      if (!m[v.date]) m[v.date] = [];
      m[v.date].push(v);
    });
    return m;
  }, [visits]);

  const monthDays = getMonthDays(year, month);
  const todayKey = fmtDate(now.getFullYear(), now.getMonth(), now.getDate());
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const selectedVisits = visitsByDate[selectedDate] ?? [];

  const nav = (d: number): void => {
    let m = month + d;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
  };

  return (
    <div className="bg-slate-950 min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Schedule Visits</h1>
          <p className="text-slate-400 text-sm mt-1">Plan visits to your seniors.</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-1" />Schedule Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Schedule a Visit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Senior</Label>
                <Select value={form.senior_id} onValueChange={(v) => setForm((f) => ({ ...f, senior_id: v }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select senior" />
                  </SelectTrigger>
                  <SelectContent>
                    {seniors.map((s) => (
                      <SelectItem key={s.senior_id} value={s.senior_id}>{s.senior_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Time</Label>
                  <Input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={() => addMutation.mutate({
                  ...form,
                  family_user_id: user?.id,
                  senior_name: seniors.find((s) => s.senior_id === form.senior_id)?.senior_name,
                  status: 'scheduled',
                })}
                disabled={!form.senior_id || !form.date}
              >
                {addMutation.isPending ? 'Scheduling...' : 'Schedule Visit'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => nav(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-base text-white">{MONTHS[month]} {year}</CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => nav(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {DAYS_SHORT.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-slate-500 py-2">{d}</div>
              ))}
              {monthDays.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;
                const key = fmtDate(year, month, day);
                const hasVisits = (visitsByDate[key]?.length ?? 0) > 0;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(key)}
                    className={cn(
                      'p-2 rounded-lg text-sm min-h-[44px] flex flex-col items-center',
                      selectedDate === key && 'bg-red-600/20 border border-red-600',
                      key === todayKey && selectedDate !== key && 'bg-slate-800',
                      !hasVisits && selectedDate !== key && key !== todayKey && 'hover:bg-slate-800/50',
                    )}
                  >
                    <span className={cn('font-medium', selectedDate === key ? 'text-red-400' : 'text-slate-300')}>{day}</span>
                    {hasVisits && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1" />}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">
              Visits on {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedVisits.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No visits scheduled</p>
            ) : (
              <div className="space-y-2">
                {selectedVisits.map((v) => (
                  <div key={v.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{v.senior_name}</p>
                      <Badge variant="outline" className="text-[10px] border-blue-600/30 text-blue-400">{v.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">
                      <Clock className="w-3 h-3 inline mr-1" />{v.time ?? 'Time TBD'}
                    </p>
                    {v.notes && <p className="text-xs text-slate-400">{v.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
