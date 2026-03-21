'use client';

import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
} from 'lucide-react';

const EVENT_TYPES = [
  { label: 'Showcases', description: 'Multi-team events where recruiters evaluate talent', icon: Trophy, color: 'text-yellow-400' },
  { label: 'Camps', description: 'Skill development camps run by college programs', icon: Users, color: 'text-blue-400' },
  { label: 'Combines', description: 'Athletic testing events with measurables and drills', icon: Clock, color: 'text-green-400' },
];

export function AthleteEventsPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recruiting Events</h1>
        <p className="text-slate-400 text-sm mt-1">
          Discover showcases, camps, and combines to get noticed by recruiters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EVENT_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <div key={type.label} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Icon className={`w-5 h-5 ${type.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{type.label}</p>
                  <p className="text-xs text-slate-500">{type.description}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600">No upcoming events</p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-400" />
            <h2 className="text-base font-semibold text-white">Upcoming Events</h2>
          </div>
        </div>
        <div className="p-4 text-center py-12">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">No events scheduled</p>
          <p className="text-slate-600 text-xs mt-2 max-w-sm mx-auto">
            Browse available recruiting events in your area to register and get your
            name in front of college coaches and scouts.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400" />
            <h2 className="text-base font-semibold text-white">Events Near You</h2>
          </div>
        </div>
        <div className="p-4 text-center py-12">
          <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            Enable location to discover recruiting events near you.
          </p>
        </div>
      </div>
    </div>
  );
}
