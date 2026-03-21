'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Eye,
  UserCheck,
  Tag,
} from 'lucide-react';

// TODO: Replace with actual API route

interface RecruitingEvent {
  id: string;
  name?: string;
  type?: string;
  sport?: string;
  event_date?: string;
  venue?: string;
  fee?: number;
  athletes_registered?: number;
  recruiters_attending?: number;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  showcase: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  camp: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  combine: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
};

interface EventCardProps {
  event: RecruitingEvent;
  onRegister?: () => void;
  isRegistering?: boolean;
  isPast?: boolean;
}

function EventCard({ event, onRegister, isRegistering, isPast }: EventCardProps): React.ReactElement {
  const typeColor = EVENT_TYPE_COLORS[event.type || ''] || EVENT_TYPE_COLORS.showcase;

  return (
    <div className={cn(
      'bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-lg p-4 space-y-3',
      isPast && 'opacity-60'
    )}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{event.name}</h3>
          <span className={cn('inline-flex items-center text-[10px] mt-1 px-2 py-0.5 rounded-full border', typeColor)}>
            <Tag className="w-3 h-3 mr-1" />
            {event.type || 'showcase'}
          </span>
        </div>
        {event.sport && (
          <span className="border border-slate-700 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
            {event.sport}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {event.event_date
            ? new Date(event.event_date + 'T12:00:00').toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })
            : 'TBD'}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {event.venue || 'TBD'}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          {event.fee ? `$${event.fee}` : 'Free'}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {event.athletes_registered || 0} athletes
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Eye className="w-3 h-3" />
        <span>{event.recruiters_attending || 0} recruiters attending</span>
      </div>

      {!isPast && onRegister && (
        <button
          className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition-colors disabled:opacity-50"
          onClick={onRegister}
          disabled={isRegistering}
        >
          <UserCheck className="w-4 h-4 mr-1" />
          {isRegistering ? 'Registering...' : 'Register to Attend'}
        </button>
      )}
    </div>
  );
}

export function RecruiterEventsPage(): React.ReactElement {
  const queryClient = useQueryClient();
  const [sportFilter, setSportFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: events = [], isLoading } = useQuery<RecruitingEvent[]>({
    queryKey: ['recruiting', 'events'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/recruiting/events')
      return [];
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      // TODO: Replace with fetch('/api/recruiting/events/register', { method: 'POST' })
      return { eventId };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recruiting', 'events'] }),
  });

  const filtered = useMemo(() => {
    let result = [...events];
    if (sportFilter !== 'all') result = result.filter((e) => e.sport === sportFilter);
    if (typeFilter !== 'all') result = result.filter((e) => e.type === typeFilter);
    return result;
  }, [events, sportFilter, typeFilter]);

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = filtered.filter((e) => (e.event_date || '') >= todayStr);
  const pastEvents = filtered.filter((e) => (e.event_date || '') < todayStr);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recruiting Events</h1>
        <p className="text-slate-400 text-sm mt-1">Browse showcases, camps, and combines.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="w-[160px] bg-slate-900 border border-slate-800 text-white text-sm rounded-lg px-3 py-2"
        >
          <option value="all">All Sports</option>
          {['Basketball', 'Soccer', 'Football', 'Baseball', 'Hockey'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-[160px] bg-slate-900 border border-slate-800 text-white text-sm rounded-lg px-3 py-2"
        >
          <option value="all">All Types</option>
          <option value="showcase">Showcase</option>
          <option value="camp">Camp</option>
          <option value="combine">Combine</option>
        </select>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Upcoming ({upcomingEvents.length})</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg py-8 text-center">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No upcoming events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={() => registerMutation.mutate({ eventId: event.id })}
                isRegistering={registerMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Past Events ({pastEvents.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
