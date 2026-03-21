'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  User,
  Users,
  Calendar,
  Clock,
  Target,
  MapPin,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';

// TODO: Replace with actual API route

interface TrainerProfile {
  id: string;
  name?: string;
  sports?: string[];
  hourly_rate?: number;
  group_rate?: number;
  avg_rating?: number;
  location_types?: string[];
  availability?: Record<string, string[]>;
}

interface SessionTypeConfig {
  value: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SESSION_TYPES: SessionTypeConfig[] = [
  { value: '1on1', label: '1-on-1', desc: 'Private session with your trainer', icon: User },
  { value: 'group', label: 'Group', desc: 'Train with other athletes', icon: Users },
];

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay());
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

interface SummaryRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function SummaryRow({ icon: Icon, label, value }: SummaryRowProps): React.ReactElement {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
      <span className="text-sm text-slate-400 w-20">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

export function BookSessionPage(): React.ReactElement {
  const userId = 'current-user';
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState('1on1');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [focusArea, setFocusArea] = useState('');
  const [notes, setNotes] = useState('');
  const [booked, setBooked] = useState(false);

  const { data: trainers = [] } = useQuery<TrainerProfile[]>({
    queryKey: ['trainers', 'active'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training/trainers?status=approved')
      return [];
    },
  });

  const selectedTrainer = trainers.find((t) => t.id === trainerId);

  const { data: trainerSchedule = {} } = useQuery<Record<string, string[]>>({
    queryKey: ['trainer-availability', trainerId],
    queryFn: async () => {
      const trainer = trainers.find((t) => t.id === trainerId);
      return trainer?.availability || {};
    },
    enabled: !!trainerId,
  });

  const bookMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: Replace with fetch('/api/training/sessions', { method: 'POST' })
      return data;
    },
    onSuccess: () => setBooked(true),
  });

  const weekDays = useMemo(() => getWeekDays(new Date()), []);

  const availableSlots = useMemo(() => {
    if (!selectedDate || !trainerSchedule) return [];
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    return trainerSchedule[dayName] || [];
  }, [selectedDate, trainerSchedule]);

  const handleBook = (): void => {
    if (!selectedDate || !selectedTime) return;
    bookMutation.mutate({
      trainer_id: trainerId,
      athlete_id: userId,
      session_type: sessionType,
      session_date: formatDateKey(selectedDate),
      start_time: selectedTime,
      focus_area: focusArea,
      notes,
      status: 'pending',
      amount: sessionType === '1on1' ? selectedTrainer?.hourly_rate || 0 : selectedTrainer?.group_rate || 0,
    });
  };

  if (booked) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Session Booked!</h1>
        <p className="text-slate-400">
          Your {sessionType === '1on1' ? '1-on-1' : 'group'} session with{' '}
          {selectedTrainer?.name} on{' '}
          {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}{' '}
          at {selectedTime} has been requested.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors" onClick={() => { setBooked(false); setStep(1); setTrainerId(null); setSelectedDate(null); setSelectedTime(null); setFocusArea(''); setNotes(''); }}>
          Book Another Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Book a Session</h1>
        <p className="text-slate-400 text-sm mt-1">Schedule your next training session.</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {['Trainer', 'Type', 'Date & Time', 'Details', 'Confirm'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', i + 1 <= step ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-500')}>
              {i + 1}
            </div>
            <span className={cn('text-xs hidden sm:inline', i + 1 <= step ? 'text-white' : 'text-slate-500')}>{label}</span>
            {i < 4 && <div className="w-4 h-px bg-slate-700" />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Trainer */}
      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Select Trainer</h2></div>
          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
            {trainers.map((trainer) => (
              <button key={trainer.id} onClick={() => { setTrainerId(trainer.id); setStep(2); }} className={cn('w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left', trainerId === trainer.id ? 'bg-red-600/10 border-red-600' : 'bg-slate-800/50 border-slate-800 hover:border-slate-700')}>
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-red-400">{(trainer.name || 'T').charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{trainer.name}</p>
                  <p className="text-xs text-slate-400">{(trainer.sports || []).join(', ')} - ${trainer.hourly_rate}/hr</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-slate-300">{(trainer.avg_rating || 0).toFixed(1)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Session Type */}
      {step === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Session Type</h2></div>
          <div className="p-4 space-y-3">
            {SESSION_TYPES.map((type) => {
              const Icon = type.icon;
              const rate = type.value === '1on1' ? selectedTrainer?.hourly_rate : selectedTrainer?.group_rate;
              return (
                <button key={type.value} onClick={() => { setSessionType(type.value); setStep(3); }} className={cn('w-full flex items-center gap-4 p-4 rounded-lg border transition-colors text-left', sessionType === type.value ? 'bg-red-600/10 border-red-600' : 'bg-slate-800/50 border-slate-800 hover:border-slate-700')}>
                  <div className="p-3 bg-slate-800 rounded-lg"><Icon className="w-6 h-6 text-red-400" /></div>
                  <div className="flex-1"><p className="text-sm font-semibold text-white">{type.label}</p><p className="text-xs text-slate-400">{type.desc}</p></div>
                  <span className="text-lg font-bold text-white">${rate || 0}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Pick Date & Time</h2></div>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-3">Select a Date</p>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const today = new Date(); today.setHours(0, 0, 0, 0);
                  const isPast = day < today;
                  const isSelected = selectedDate !== null && formatDateKey(day) === formatDateKey(selectedDate);
                  return (
                    <button key={formatDateKey(day)} onClick={() => { if (!isPast) { setSelectedDate(day); setSelectedTime(null); } }} disabled={isPast} className={cn('flex flex-col items-center p-2 rounded-lg transition-colors', isSelected && 'bg-red-600/20 border border-red-600', isPast && 'opacity-30 cursor-not-allowed', !isSelected && !isPast && 'hover:bg-slate-800')}>
                      <span className="text-[10px] text-slate-500">{DAYS_SHORT[day.getDay()]}</span>
                      <span className={cn('text-sm font-medium', isSelected ? 'text-red-400' : 'text-white')}>{day.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {selectedDate && (
              <>
                <div className="border-t border-slate-800" />
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-3">Available Times for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  {availableSlots.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No available slots on this day</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((time) => (
                        <button key={time} onClick={() => { setSelectedTime(time); setStep(4); }} className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors border', selectedTime === time ? 'bg-red-600/20 border-red-600 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600')}>{time}</button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Details */}
      {step === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Session Details</h2></div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Focus Area</label>
              <input value={focusArea} onChange={(e) => setFocusArea(e.target.value)} placeholder="e.g. Ball handling, shooting form, defense..." className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Additional Notes (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any injuries, specific goals, or things the trainer should know..." rows={3} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none resize-none" />
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Confirm */}
      {step === 5 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2"><h2 className="text-base font-semibold text-white">Confirm Booking</h2></div>
          <div className="p-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-800 space-y-3">
              <SummaryRow icon={User} label="Trainer" value={selectedTrainer?.name || 'N/A'} />
              <SummaryRow icon={Users} label="Type" value={sessionType === '1on1' ? '1-on-1 Session' : 'Group Session'} />
              <SummaryRow icon={Calendar} label="Date" value={selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) || 'N/A'} />
              <SummaryRow icon={Clock} label="Time" value={selectedTime || 'N/A'} />
              <SummaryRow icon={Target} label="Focus" value={focusArea || 'General'} />
              <SummaryRow icon={MapPin} label="Location" value={selectedTrainer?.location_types?.[0] || 'TBD'} />
              <div className="border-t border-slate-700 pt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-white">Total</span>
                <span className="text-xl font-bold text-white">${sessionType === '1on1' ? selectedTrainer?.hourly_rate || 0 : selectedTrainer?.group_rate || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button className="flex items-center border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm disabled:opacity-50" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>
        {step < 5 ? (
          <button className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors" onClick={() => setStep((s) => s + 1)} disabled={(step === 1 && !trainerId) || (step === 3 && (!selectedDate || !selectedTime)) || (step === 4 && !focusArea.trim())}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors" onClick={handleBook} disabled={bookMutation.isPending}>
            {bookMutation.isPending ? 'Booking...' : 'Confirm & Book'}
          </button>
        )}
      </div>
    </div>
  );
}
