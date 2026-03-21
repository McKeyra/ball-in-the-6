'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/auth-store';
import { Calendar, Clock, MapPin, Bell, Users, ArrowRight, CreditCard, Megaphone } from 'lucide-react';

interface Child {
  id: string;
  name?: string;
  team?: string;
  sport?: string;
}

interface ParentEvent {
  id: string;
  title?: string;
  name?: string;
  date?: string;
  start_time?: string;
  location?: string;
  child_id?: string;
  child_name?: string;
  requires_rsvp?: boolean;
  rsvp_status?: string;
}

interface Payment {
  id: string;
  description?: string;
  amount?: number;
  status?: string;
  due_date?: string;
}

interface Announcement {
  id: string;
  title?: string;
  body?: string;
  created_date?: string;
}

interface Alert {
  type: string;
  text: string;
  severity: 'warning' | 'info';
}

export function ParentDashboardPage(): React.ReactElement {
  const user = useAuthStore((s) => s.user);

  // TODO: Replace with fetch('/api/parent-hub/children')
  const { data: children = [], isLoading: loadingChildren } = useQuery<Child[]>({
    queryKey: ['parent', 'children'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/children'); return r.ok ? r.json() : []; },
    enabled: !!user?.id,
  });

  // TODO: Replace with fetch('/api/parent-hub/events')
  const { data: events = [], isLoading: loadingEvents } = useQuery<ParentEvent[]>({
    queryKey: ['parent', 'today-events'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/events'); return r.ok ? r.json() : []; },
    enabled: !!user?.id,
  });

  // TODO: Replace with fetch('/api/parent-hub/payments?status=outstanding')
  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ['parent', 'payments-outstanding'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/payments?status=outstanding'); return r.ok ? r.json() : []; },
    enabled: !!user?.id,
  });

  // TODO: Replace with fetch('/api/parent-hub/announcements')
  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ['parent', 'announcements'],
    queryFn: async () => { const r = await fetch('/api/parent-hub/announcements'); return r.ok ? r.json() : []; },
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter((e) => (e.date || e.start_time?.split('T')[0]) === todayStr);
  const rsvpNeeded = events.filter((e) => e.requires_rsvp && !e.rsvp_status);
  const outstandingTotal = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const alerts: Alert[] = [
    ...(payments.length > 0 ? [{ type: 'payment', text: `${payments.length} outstanding payment${payments.length !== 1 ? 's' : ''} ($${outstandingTotal})`, severity: 'warning' as const }] : []),
    ...(rsvpNeeded.length > 0 ? [{ type: 'rsvp', text: `${rsvpNeeded.length} event${rsvpNeeded.length !== 1 ? 's' : ''} need${rsvpNeeded.length === 1 ? 's' : ''} RSVP`, severity: 'info' as const }] : []),
  ];

  const isLoading = loadingChildren || loadingEvents;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome{user?.fullName ? `, ${user.fullName}` : ''}
        </h1>
        <p className="text-slate-400 text-sm mt-1">Here is your family overview for today.</p>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div key={i} className={cn(
              'flex items-center gap-3 p-3 rounded-lg border',
              alert.severity === 'warning' ? 'bg-amber-600/10 border-amber-600/30' : 'bg-blue-600/10 border-blue-600/30'
            )}>
              <Bell className={cn('w-4 h-4', alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400')} />
              <span className="text-sm text-white flex-1">{alert.text}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base text-white">Today&apos;s Schedule</CardTitle>
          <Badge variant="outline" className="border-slate-700 text-slate-400">{todayEvents.length}</Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 bg-slate-800 rounded-lg" />)}</div>
          ) : todayEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No events today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-600/20">
                    <Clock className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{event.title || event.name}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                      <span>{event.start_time ? new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span>
                      {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
                    </div>
                  </div>
                  {event.child_name && (
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">{event.child_name}</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base text-white">My Children</CardTitle>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-slate-800">
              Manage <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingChildren ? (
              <div className="space-y-2">{[1, 2].map((i) => <Skeleton key={i} className="h-16 bg-slate-800 rounded-lg" />)}</div>
            ) : children.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No children added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {children.map((child) => {
                  const childEvents = events.filter((e) => e.child_id === child.id);
                  const nextEvent = childEvents.filter((e) => (e.date || '') >= todayStr).sort((a, b) => (a.date || '').localeCompare(b.date || ''))[0];
                  return (
                    <div key={child.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                      <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-red-400">{(child.name || 'C').charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{child.name}</p>
                        <p className="text-xs text-slate-400">{child.team || child.sport || 'No team'}</p>
                      </div>
                      {nextEvent && (
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500">Next</p>
                          <p className="text-xs text-slate-300">{nextEvent.title}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-yellow-400" />
                <CardTitle className="text-base text-white">Announcements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No announcements</p>
              ) : (
                <div className="space-y-2">
                  {announcements.slice(0, 3).map((ann) => (
                    <div key={ann.id} className="p-2 rounded-lg bg-slate-800/30">
                      <p className="text-sm font-medium text-white">{ann.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{ann.body}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {ann.created_date ? new Date(ann.created_date).toLocaleDateString() : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-400" />
                <CardTitle className="text-base text-white">Upcoming Payments</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No outstanding payments</p>
              ) : (
                <div className="space-y-2">
                  {payments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
                      <div>
                        <p className="text-sm text-white">{payment.description || 'Payment'}</p>
                        <p className="text-xs text-slate-400">{payment.due_date ? `Due ${new Date(payment.due_date).toLocaleDateString()}` : ''}</p>
                      </div>
                      <span className="text-sm font-bold text-white">${(payment.amount || 0).toLocaleString()}</span>
                    </div>
                  ))}
                  {outstandingTotal > 0 && (
                    <>
                      <Separator className="bg-slate-800" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-400">Total Owed</span>
                        <span className="text-sm font-bold text-red-400">${outstandingTotal.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
