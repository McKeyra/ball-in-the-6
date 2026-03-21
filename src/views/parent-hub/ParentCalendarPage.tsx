'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/auth-store';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User } from 'lucide-react';

interface Child {
  id: string;
  name: string;
}

interface CalendarEvent {
  id: string;
  title?: string;
  name?: string;
  date?: string;
  start_time?: string;
  child_id?: string;
  child_name?: string;
  location?: string;
  description?: string;
  requires_rsvp?: boolean;
  rsvp_status?: string;
}

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;
const CHILD_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'] as const;

function getMonthDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function ParentCalendarPage(): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // TODO: Replace with fetch('/api/parent-hub/children')
  const { data: children = [] } = useQuery<Child[]>({
    queryKey: ['parent', 'children'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/children'); return r.ok ? r.json() : []; },
    enabled: !!user?.id,
  });

  // TODO: Replace with fetch('/api/parent-hub/events')
  const { data: events = [] } = useQuery<CalendarEvent[]>({
    queryKey: ['parent', 'calendar-events'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/events'); return r.ok ? r.json() : []; },
    enabled: !!user?.id,
  });

  const childColorMap = useMemo((): Record<string, string> => {
    const map: Record<string, string> = {};
    children.forEach((c, i) => { map[c.id] = CHILD_COLORS[i % CHILD_COLORS.length]; });
    return map;
  }, [children]);

  const eventsByDate = useMemo((): Record<string, CalendarEvent[]> => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => {
      const key = (e.date || e.start_time?.split('T')[0]);
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [events]);

  const monthDays = getMonthDays(year, month);
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedEvents = eventsByDate[selectedDate] || [];

  const navigateMonth = (dir: number): void => {
    let m = month + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Family Calendar</h1>
        <p className="text-slate-400 text-sm mt-1">All events for your children in one place.</p>
      </div>

      {children.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {children.map((child) => (
            <div key={child.id} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', childColorMap[child.id])} />
              <span className="text-xs text-slate-300">{child.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-base text-white">{MONTHS[month]} {year}</CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => navigateMonth(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {DAYS_SHORT.map((d) => <div key={d} className="text-center text-xs font-medium text-slate-500 py-2">{d}</div>)}
              {monthDays.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} className="p-2" />;
                const key = formatDateKey(year, month, day);
                const dayEvents = eventsByDate[key] || [];
                const isToday = key === todayKey;
                const isSelected = key === selectedDate;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(key)}
                    className={cn(
                      'relative p-2 rounded-lg text-sm transition-colors min-h-[52px] flex flex-col items-center',
                      isSelected && 'bg-red-600/20 border border-red-600',
                      isToday && !isSelected && 'bg-slate-800 border border-slate-700',
                      !isSelected && !isToday && 'hover:bg-slate-800/50'
                    )}
                  >
                    <span className={cn('font-medium', isSelected ? 'text-red-400' : isToday ? 'text-white' : 'text-slate-300')}>{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {dayEvents.slice(0, 4).map((e, ei) => (
                          <div key={ei} className={cn('w-1.5 h-1.5 rounded-full', childColorMap[e.child_id || ''] || 'bg-slate-500')} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No events</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedEvents
                  .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
                  .map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg border transition-colors',
                        selectedEvent?.id === event.id
                          ? 'bg-red-600/10 border-red-600'
                          : 'bg-slate-800/50 border-slate-800 hover:border-slate-700'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-8 rounded-full', childColorMap[event.child_id || ''] || 'bg-slate-500')} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{event.title || event.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.start_time ? new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                            </span>
                            {event.child_name && (
                              <span className="flex items-center gap-1"><User className="w-3 h-3" />{event.child_name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {selectedEvent?.id === event.id && (
                        <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-400">
                          {event.location && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</p>}
                          {event.description && <p className="text-slate-300">{event.description}</p>}
                          {event.requires_rsvp && !event.rsvp_status && (
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-7">RSVP Yes</Button>
                              <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 text-xs h-7">RSVP No</Button>
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
