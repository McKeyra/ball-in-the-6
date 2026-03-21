'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

type EventType = 'game' | 'practice' | 'tournament' | 'event';

interface EventData {
  type: EventType;
  title: string;
  date: string;
  time?: string;
  venue_id?: string;
}

interface EventCardProps {
  event: EventData;
  team?: { name?: string } | null;
}

const TYPE_ICONS: Record<EventType, string> = {
  game: '\uD83C\uDFC0',
  practice: '\u26A1',
  tournament: '\uD83C\uDFC6',
  event: '\uD83D\uDCC5',
};

const TYPE_COLORS: Record<EventType, string> = {
  game: 'from-red-500 to-pink-500',
  practice: 'from-blue-500 to-cyan-500',
  tournament: 'from-purple-500 to-indigo-500',
  event: 'from-green-500 to-emerald-500',
};

export function EventCard({ event }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${TYPE_COLORS[event.type]}`} />

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${TYPE_COLORS[event.type]} flex items-center justify-center text-3xl flex-shrink-0`}
            >
              {TYPE_ICONS[event.type]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {event.type}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {event.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4 text-[#D0FF00]" />
                  <span>
                    {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock className="w-4 h-4 text-[#D0FF00]" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.venue_id && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-[#D0FF00]" />
                    <span>Location details</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  className="bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90"
                >
                  <Users className="w-4 h-4 mr-2" />
                  I&apos;m Attending
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-white"
                >
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
