import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building, Wrench, Users, CheckCircle, Clock, MapPin } from 'lucide-react';
import FormBuilder from '@/components/forms/FormBuilder';

// ============================================================================
// THEME CONSTANTS
// ============================================================================

const THEME = {
  accent: '#c9a962',
  background: '#0f0f0f',
};

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_VENUES = [
  { value: 'venue-001', label: 'Central Recreation Center' },
  { value: 'venue-002', label: 'Downtown Sports Complex' },
  { value: 'venue-003', label: 'Eastside Gymnasium' },
  { value: 'venue-004', label: 'Westview Arena' },
  { value: 'venue-005', label: 'North Park Courts' },
];

const MOCK_TEAMS = [
  { value: 'team-001', label: 'Raptors Youth U14' },
  { value: 'team-002', label: 'Raptors Youth U16' },
  { value: 'team-003', label: 'Lakers Academy U14' },
  { value: 'team-004', label: 'Lakers Academy U16' },
  { value: 'team-005', label: 'Celtics Jr U14' },
  { value: 'team-006', label: 'Heat Elite U16' },
];

// ============================================================================
// FORM SECTIONS CONFIGURATION
// ============================================================================

const formSections = [
  {
    id: 'event',
    label: 'Event Details',
    icon: 'Calendar',
    description: 'What type of event and when?',
    fields: [
      {
        id: 'eventType',
        type: 'cards',
        label: 'Event Type',
        options: [
          {
            value: 'practice',
            label: 'Practice',
            icon: 'Target',
            description: 'Regular team practice'
          },
          {
            value: 'game',
            label: 'Game',
            icon: 'Trophy',
            description: 'Scheduled game or scrimmage'
          },
          {
            value: 'tournament',
            label: 'Tournament',
            icon: 'Award',
            description: 'Multi-game tournament event'
          },
          {
            value: 'tryout',
            label: 'Tryout',
            icon: 'Users',
            description: 'Player tryouts or evaluations'
          },
          {
            value: 'camp',
            label: 'Camp/Clinic',
            icon: 'BookOpen',
            description: 'Skills camp or clinic'
          },
          {
            value: 'meeting',
            label: 'Meeting',
            icon: 'MessageSquare',
            description: 'Team or parent meeting'
          },
        ],
        columns: 1,
        required: true,
      },
      {
        id: 'eventName',
        type: 'text',
        label: 'Event Name',
        placeholder: 'Name this booking',
        required: true,
      },
      {
        id: 'eventDate',
        type: 'text',
        label: 'Date',
        placeholder: 'YYYY-MM-DD',
        required: true,
      },
      {
        id: 'startTime',
        type: 'text',
        label: 'Start Time',
        placeholder: 'HH:MM AM/PM',
        required: true,
      },
      {
        id: 'endTime',
        type: 'text',
        label: 'End Time',
        placeholder: 'HH:MM AM/PM',
        required: true,
      },
      {
        id: 'recurring',
        type: 'cards',
        label: 'Is this recurring?',
        options: [
          { value: 'no', label: 'One-time', icon: 'Calendar', description: 'Single booking' },
          { value: 'weekly', label: 'Weekly', icon: 'Repeat', description: 'Same day each week' },
          { value: 'biweekly', label: 'Bi-weekly', icon: 'Repeat', description: 'Every two weeks' },
        ],
      },
      {
        id: 'recurringEndDate',
        type: 'text',
        label: 'Recurring Until',
        placeholder: 'YYYY-MM-DD (if recurring)',
      },
    ],
  },
  {
    id: 'facility',
    label: 'Facility Selection',
    icon: 'Building',
    description: 'Choose your venue and court',
    fields: [
      {
        id: 'venue',
        type: 'select',
        label: 'Select Venue',
        placeholder: 'Choose a facility...',
        options: MOCK_VENUES,
        required: true,
      },
      {
        id: 'courtPreference',
        type: 'cards',
        label: 'Court Preference',
        options: [
          { value: 'full', label: 'Full Court', icon: 'Maximize', description: 'Entire gymnasium' },
          { value: 'half', label: 'Half Court', icon: 'Divide', description: 'One side of gym' },
          { value: 'any', label: 'No Preference', icon: 'Shuffle', description: 'Any available space' },
        ],
        required: true,
      },
      {
        id: 'specificCourt',
        type: 'text',
        label: 'Specific Court (if known)',
        placeholder: 'e.g., Court A, Gym 2',
      },
      {
        id: 'backupVenue',
        type: 'select',
        label: 'Backup Venue',
        placeholder: 'Alternative if unavailable...',
        options: MOCK_VENUES,
      },
    ],
  },
  {
    id: 'requirements',
    label: 'Requirements',
    icon: 'Tool',
    description: 'Equipment and setup needs',
    fields: [
      {
        id: 'equipmentNeeded',
        type: 'checkboxes',
        label: 'Equipment Needed',
        options: [
          { value: 'basketballs', label: 'Basketballs', icon: 'Circle' },
          { value: 'scoreboard', label: 'Scoreboard', icon: 'Hash' },
          { value: 'shot-clocks', label: 'Shot Clocks', icon: 'Clock' },
          { value: 'hoops-adjustable', label: 'Adjustable Hoops', icon: 'ArrowUpDown' },
          { value: 'sound-system', label: 'Sound System', icon: 'Volume2' },
          { value: 'tables-chairs', label: 'Tables & Chairs', icon: 'LayoutGrid' },
          { value: 'first-aid', label: 'First Aid Kit', icon: 'Heart' },
          { value: 'water-cooler', label: 'Water Cooler', icon: 'Droplet' },
        ],
      },
      {
        id: 'setupTime',
        type: 'select',
        label: 'Setup Time Needed',
        placeholder: 'Time before event...',
        options: [
          { value: '0', label: 'None - ready to go' },
          { value: '15', label: '15 minutes' },
          { value: '30', label: '30 minutes' },
          { value: '60', label: '1 hour' },
          { value: '120', label: '2 hours' },
        ],
      },
      {
        id: 'cleanupTime',
        type: 'select',
        label: 'Cleanup Time Needed',
        placeholder: 'Time after event...',
        options: [
          { value: '0', label: 'None' },
          { value: '15', label: '15 minutes' },
          { value: '30', label: '30 minutes' },
          { value: '60', label: '1 hour' },
        ],
      },
      {
        id: 'specialRequests',
        type: 'textarea',
        label: 'Special Requirements',
        placeholder: 'Any additional setup needs or special accommodations...',
        rows: 3,
      },
    ],
  },
  {
    id: 'attendees',
    label: 'Attendees',
    icon: 'Users',
    description: 'Who will be attending?',
    fields: [
      {
        id: 'expectedAttendance',
        type: 'select',
        label: 'Expected Attendance',
        placeholder: 'How many people?',
        options: [
          { value: '1-15', label: '1-15 people' },
          { value: '16-30', label: '16-30 people' },
          { value: '31-50', label: '31-50 people' },
          { value: '51-100', label: '51-100 people' },
          { value: '100+', label: 'More than 100' },
        ],
        required: true,
      },
      {
        id: 'teams',
        type: 'pills',
        label: 'Teams Participating',
        options: MOCK_TEAMS,
        hint: 'Select all teams that will be present',
      },
      {
        id: 'spectators',
        type: 'cards',
        label: 'Spectators Expected?',
        options: [
          { value: 'yes', label: 'Yes', icon: 'Users', description: 'Family/fans will attend' },
          { value: 'no', label: 'No', icon: 'UserX', description: 'Closed event' },
          { value: 'limited', label: 'Limited', icon: 'User', description: 'Restricted attendance' },
        ],
      },
      {
        id: 'organizerName',
        type: 'text',
        label: 'Organizer Name',
        placeholder: 'Primary contact for this event',
        required: true,
      },
      {
        id: 'organizerPhone',
        type: 'text',
        label: 'Organizer Phone',
        placeholder: '(555) 123-4567',
        required: true,
      },
      {
        id: 'organizerEmail',
        type: 'text',
        label: 'Organizer Email',
        placeholder: 'email@example.com',
        required: true,
      },
    ],
  },
  {
    id: 'confirmation',
    label: 'Confirmation',
    icon: 'CheckCircle',
    description: 'Review and accept terms',
    fields: [
      {
        id: 'termsAcceptance',
        type: 'checkboxes',
        label: 'Please Confirm',
        options: [
          {
            value: 'facility-rules',
            label: 'I agree to follow all facility rules and guidelines',
            icon: 'FileText',
          },
          {
            value: 'liability',
            label: 'I understand the liability waiver requirements',
            icon: 'Shield',
          },
          {
            value: 'cancellation',
            label: 'I understand the 48-hour cancellation policy',
            icon: 'Clock',
          },
          {
            value: 'cleanup',
            label: 'I will ensure proper cleanup after the event',
            icon: 'Trash2',
          },
        ],
        required: true,
      },
      {
        id: 'paymentAcknowledge',
        type: 'cards',
        label: 'Payment',
        options: [
          {
            value: 'prepaid',
            label: 'Pre-paid Season',
            icon: 'CheckCircle',
            description: 'Covered by seasonal booking'
          },
          {
            value: 'pay-now',
            label: 'Pay Now',
            icon: 'CreditCard',
            description: 'Pay for this booking'
          },
          {
            value: 'invoice',
            label: 'Invoice Organization',
            icon: 'Receipt',
            description: 'Bill to organization account'
          },
        ],
        required: true,
      },
      {
        id: 'additionalNotes',
        type: 'textarea',
        label: 'Additional Notes',
        placeholder: 'Any other information for the facility...',
        rows: 3,
      },
    ],
  },
];

// ============================================================================
// PREVIEW COMPONENT
// ============================================================================

const FacilityBookingPreview = ({ data }) => {
  const selectedVenue = MOCK_VENUES.find(v => v.value === data.venue);
  const selectedTeams = MOCK_TEAMS.filter(t => data.teams?.includes(t.value));

  const eventTypeLabels = {
    practice: 'Practice',
    game: 'Game',
    tournament: 'Tournament',
    tryout: 'Tryout',
    camp: 'Camp/Clinic',
    meeting: 'Meeting',
  };

  const eventTypeIcons = {
    practice: 'Target',
    game: 'Trophy',
    tournament: 'Award',
    tryout: 'Users',
    camp: 'BookOpen',
    meeting: 'MessageSquare',
  };

  const isConfirmed = data.termsAcceptance?.length >= 4;

  return (
    <div className="space-y-4">
      {/* Booking Confirmation Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-xl border p-4"
        style={{
          borderColor: isConfirmed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.06)',
          backgroundColor: isConfirmed ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 0.03)',
        }}
      >
        <div className="text-center mb-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
            Booking {isConfirmed ? 'Ready' : 'Draft'}
          </p>
          {data.eventName && (
            <h3 className="text-white font-semibold text-lg">{data.eventName}</h3>
          )}
          {data.eventType && (
            <span
              className="inline-block mt-2 px-3 py-1 rounded-full text-sm"
              style={{ backgroundColor: 'rgba(201, 169, 98, 0.2)', color: THEME.accent }}
            >
              {eventTypeLabels[data.eventType] || data.eventType}
            </span>
          )}
        </div>

        {/* Date & Time */}
        {data.eventDate && (
          <div className="flex items-center gap-3 py-3 border-t border-white/[0.06]">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(201, 169, 98, 0.1)' }}
            >
              <Calendar className="w-5 h-5" style={{ color: THEME.accent }} />
            </div>
            <div>
              <p className="text-white font-medium">{data.eventDate}</p>
              <p className="text-white/60 text-sm">
                {data.startTime || '--:--'} - {data.endTime || '--:--'}
              </p>
            </div>
          </div>
        )}

        {/* Venue */}
        {selectedVenue && (
          <div className="flex items-center gap-3 py-3 border-t border-white/[0.06]">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(201, 169, 98, 0.1)' }}
            >
              <MapPin className="w-5 h-5" style={{ color: THEME.accent }} />
            </div>
            <div>
              <p className="text-white font-medium">{selectedVenue.label}</p>
              {data.courtPreference && (
                <p className="text-white/60 text-sm capitalize">
                  {data.courtPreference === 'full' ? 'Full Court' :
                   data.courtPreference === 'half' ? 'Half Court' : 'Any Court'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Recurring */}
        {data.recurring && data.recurring !== 'no' && (
          <div className="flex items-center gap-3 py-3 border-t border-white/[0.06]">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(201, 169, 98, 0.1)' }}
            >
              <Clock className="w-5 h-5" style={{ color: THEME.accent }} />
            </div>
            <div>
              <p className="text-white font-medium capitalize">{data.recurring}</p>
              {data.recurringEndDate && (
                <p className="text-white/60 text-sm">Until {data.recurringEndDate}</p>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Attendance */}
      {data.expectedAttendance && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Expected Attendance</p>
          <p className="text-white font-medium">{data.expectedAttendance} people</p>
          {data.spectators && (
            <p className="text-white/60 text-sm mt-1">
              {data.spectators === 'yes' ? 'Spectators welcome' :
               data.spectators === 'limited' ? 'Limited spectators' : 'Closed event'}
            </p>
          )}
        </div>
      )}

      {/* Teams */}
      {selectedTeams.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Participating Teams</p>
          <div className="flex flex-wrap gap-1">
            {selectedTeams.map((team) => (
              <span
                key={team.value}
                className="px-2 py-0.5 rounded text-xs"
                style={{ backgroundColor: 'rgba(201, 169, 98, 0.2)', color: THEME.accent }}
              >
                {team.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Equipment */}
      {data.equipmentNeeded?.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
            Equipment ({data.equipmentNeeded.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {data.equipmentNeeded.map((item) => (
              <span
                key={item}
                className="px-2 py-0.5 rounded text-xs bg-white/[0.05] text-white/60"
              >
                {item.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Organizer */}
      {data.organizerName && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Organizer</p>
          <p className="text-white font-medium">{data.organizerName}</p>
          {data.organizerEmail && (
            <p className="text-white/60 text-xs mt-1">{data.organizerEmail}</p>
          )}
        </div>
      )}

      {/* Confirmation Status */}
      <div
        className="rounded-xl border p-4"
        style={{
          borderColor: isConfirmed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)',
          backgroundColor: isConfirmed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        }}
      >
        <div className="flex items-center gap-2">
          {isConfirmed ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-emerald-400 font-medium">Ready to Submit</p>
                <p className="text-emerald-400/60 text-xs">All terms accepted</p>
              </div>
            </>
          ) : (
            <>
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-amber-400 font-medium">Pending Confirmation</p>
                <p className="text-amber-400/60 text-xs">
                  {4 - (data.termsAcceptance?.length || 0)} items remaining
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FacilityBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save handler
  const handleSave = useCallback(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Auto-saved facility booking:', data);
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitted facility booking:', data);
      // TODO: Replace with actual mutation
      // await submitFacilityBooking.mutateAsync(data);
      alert('Facility booking submitted successfully!');
    } catch (error) {
      console.error('Failed to submit facility booking:', error);
      alert('Failed to submit facility booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <FormBuilder
      title="Facility Booking"
      subtitle="Reserve a court or gym for your event"
      sections={formSections}
      onSubmit={handleSubmit}
      onSave={handleSave}
      submitLabel={isSubmitting ? 'Submitting...' : 'Submit Booking'}
      skipLabel="Skip for now"
      showPreview={true}
      previewComponent={FacilityBookingPreview}
      defaultMode="form"
    />
  );
};

export default FacilityBooking;
