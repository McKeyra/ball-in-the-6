'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface EventItem {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  venue?: string;
  team_name?: string;
  opponent?: string;
  notes?: string;
}

interface Team {
  id: string;
  name: string;
}

interface EventTypeConfig {
  value: string;
  label: string;
  color: string;
  text: string;
  bg: string;
}

const EVENT_TYPES: EventTypeConfig[] = [
  { value: 'practice', label: 'Practice', color: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/20' },
  { value: 'game', label: 'Game', color: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/20' },
  { value: 'tournament', label: 'Tournament', color: 'bg-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/20' },
  { value: 'meeting', label: 'Meeting', color: 'bg-slate-500', text: 'text-slate-400', bg: 'bg-slate-500/20' },
  { value: 'tryout', label: 'Tryout', color: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-500/20' },
  { value: 'camp', label: 'Camp', color: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/20' },
  { value: 'fundraiser', label: 'Fundraiser', color: 'bg-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { value: 'ceremony', label: 'Ceremony', color: 'bg-pink-500', text: 'text-pink-400', bg: 'bg-pink-500/20' },
  { value: 'other', label: 'Other', color: 'bg-gray-500', text: 'text-gray-400', bg: 'bg-gray-500/20' },
];

const EVENT_TYPE_MAP = EVENT_TYPES.reduce<Record<string, EventTypeConfig>>((acc, t) => {
  acc[t.value] = t;
  return acc;
}, {});

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

interface EventForm {
  title: string;
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  team_name: string;
  opponent: string;
  venue: string;
  notes: string;
}

const INITIAL_FORM: EventForm = {
  title: '',
  type: 'practice',
  date: '',
  start_time: '',
  end_time: '',
  team_name: '',
  opponent: '',
  venue: '',
  notes: '',
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

interface CalendarCell {
  day: number | null;
  dateStr?: string;
  key: string;
  events: EventItem[];
}

export function SchedulePage(): React.ReactElement {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<EventForm>(INITIAL_FORM);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const fromDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const toDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

  const { data: events = [], isLoading } = useQuery<EventItem[]>({
    queryKey: ['command-center', 'events', year, month],
    queryFn: async () => {
      const res = await fetch(`/api/events?from=${fromDate}&to=${toDate}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['command-center', 'teams-list'],
    queryFn: async () => {
      const res = await fetch('/api/teams?sport=basketball');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create event');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['command-center', 'events'] });
      setDialogOpen(false);
      setForm(INITIAL_FORM);
    },
  });

  const eventsByDate = useMemo((): Record<string, EventItem[]> => {
    const map: Record<string, EventItem[]> = {};
    events.forEach((event) => {
      const dateStr = event.date || event.start_time?.split('T')[0];
      if (!dateStr) return;
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(event);
    });
    return map;
  }, [events]);

  const prevMonth = (): void => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = (): void => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = (): void => {
    setCurrentDate(new Date());
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      title: form.title,
      type: form.type,
      date: form.date,
      venue: form.venue,
      notes: form.notes,
      team_name: form.team_name || null,
      opponent: form.type === 'game' ? form.opponent : null,
    };
    if (form.start_time) {
      payload.start_time = `${form.date}T${form.start_time}:00`;
    }
    if (form.end_time) {
      payload.end_time = `${form.date}T${form.end_time}:00`;
    }
    createMutation.mutate(payload);
  };

  const updateForm = (field: keyof EventForm, value: string): void => setForm((prev) => ({ ...prev, [field]: value }));

  const todayStr = new Date().toISOString().split('T')[0];
  const calendarCells: CalendarCell[] = [];

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push({ day: null, key: `empty-${i}`, events: [] });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ day: d, dateStr, key: dateStr, events: eventsByDate[dateStr] || [] });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Schedule</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage events, practices, games, and more
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Event Title</Label>
                <Input
                  className="bg-slate-800 border-slate-700 text-white"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="e.g. U14 Boys Practice"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Event Type</Label>
                  <Select value={form.type} onValueChange={(v) => updateForm('type', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {EVENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value} className="text-white hover:bg-slate-700">
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Date</Label>
                  <Input
                    type="date"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.date}
                    onChange={(e) => updateForm('date', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Start Time</Label>
                  <Input
                    type="time"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.start_time}
                    onChange={(e) => updateForm('start_time', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">End Time</Label>
                  <Input
                    type="time"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.end_time}
                    onChange={(e) => updateForm('end_time', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Team</Label>
                <Select value={form.team_name} onValueChange={(v) => updateForm('team_name', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select team (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="none" className="text-white hover:bg-slate-700">None</SelectItem>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.name} className="text-white hover:bg-slate-700">
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.type === 'game' && (
                <div className="space-y-2">
                  <Label className="text-slate-300">Opponent</Label>
                  <Input
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.opponent}
                    onChange={(e) => updateForm('opponent', e.target.value)}
                    placeholder="Opponent team name"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-slate-300">Venue</Label>
                <Input
                  className="bg-slate-800 border-slate-700 text-white"
                  value={form.venue}
                  onChange={(e) => updateForm('venue', e.target.value)}
                  placeholder="Location or facility name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Textarea
                  className="bg-slate-800 border-slate-700 text-white min-h-[60px]"
                  value={form.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  placeholder="Additional details..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Adding...' : 'Add Event'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={prevMonth}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold text-white min-w-[180px] text-center">
                {monthLabel}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={nextMonth}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={goToToday}
            >
              Today
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-slate-500 py-2">{d}</div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-24 bg-slate-800 rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-slate-500 py-2">{d}</div>
              ))}
              {calendarCells.map((cell) => {
                if (!cell.day) {
                  return <div key={cell.key} className="min-h-[100px]" />;
                }

                const isToday = cell.dateStr === todayStr;

                return (
                  <div
                    key={cell.key}
                    className={cn(
                      'min-h-[100px] p-1.5 rounded border transition-colors',
                      isToday
                        ? 'border-red-600/50 bg-red-600/5'
                        : 'border-slate-800/50 hover:border-slate-700'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          'text-xs font-medium',
                          isToday
                            ? 'bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center'
                            : 'text-slate-400'
                        )}
                      >
                        {cell.day}
                      </span>
                      {cell.events.length > 0 && (
                        <span className="text-[10px] text-slate-500">{cell.events.length}</span>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {cell.events.slice(0, 3).map((event) => {
                        const typeConfig = EVENT_TYPE_MAP[event.type || 'other'] || EVENT_TYPE_MAP.other;
                        const time = event.start_time
                          ? new Date(event.start_time).toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : null;

                        return (
                          <div
                            key={event.id}
                            className={cn(
                              'rounded px-1.5 py-0.5 text-[10px] truncate cursor-default',
                              typeConfig.bg,
                              typeConfig.text
                            )}
                            title={`${event.title || event.name}${time ? ` @ ${time}` : ''}${event.venue ? ` - ${event.venue}` : ''}`}
                          >
                            {time && <span className="font-medium">{time} </span>}
                            {event.title || event.name}
                          </div>
                        );
                      })}
                      {cell.events.length > 3 && (
                        <span className="text-[10px] text-slate-500 pl-1">
                          +{cell.events.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        {EVENT_TYPES.map((t) => (
          <div key={t.value} className="flex items-center gap-1.5">
            <div className={cn('w-2.5 h-2.5 rounded-full', t.color)} />
            <span className="text-xs text-slate-400">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
