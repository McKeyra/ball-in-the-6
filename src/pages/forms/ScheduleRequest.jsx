import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
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

const MOCK_TEAMS = [
  { value: 'team-001', label: 'Raptors Youth U14' },
  { value: 'team-002', label: 'Raptors Youth U16' },
  { value: 'team-003', label: 'Lakers Academy U14' },
  { value: 'team-004', label: 'Lakers Academy U16' },
  { value: 'team-005', label: 'Celtics Jr U14' },
  { value: 'team-006', label: 'Heat Elite U16' },
];

const MOCK_VENUES = [
  { value: 'venue-001', label: 'Central Recreation Center' },
  { value: 'venue-002', label: 'Downtown Sports Complex' },
  { value: 'venue-003', label: 'Eastside Gymnasium' },
  { value: 'venue-004', label: 'Westview Arena' },
  { value: 'venue-005', label: 'North Park Courts' },
];

// ============================================================================
// FORM SECTIONS CONFIGURATION
// ============================================================================

const formSections = [
  {
    id: 'original',
    label: 'Original Game Details',
    icon: 'Calendar',
    description: 'Information about the game to be rescheduled',
    fields: [
      {
        id: 'originalDate',
        type: 'text',
        label: 'Original Game Date',
        placeholder: 'YYYY-MM-DD',
        required: true,
      },
      {
        id: 'originalTime',
        type: 'text',
        label: 'Original Game Time',
        placeholder: 'HH:MM AM/PM',
        required: true,
      },
      {
        id: 'homeTeam',
        type: 'select',
        label: 'Home Team',
        placeholder: 'Select home team...',
        options: MOCK_TEAMS,
        required: true,
      },
      {
        id: 'awayTeam',
        type: 'select',
        label: 'Away Team',
        placeholder: 'Select away team...',
        options: MOCK_TEAMS,
        required: true,
      },
      {
        id: 'venue',
        type: 'select',
        label: 'Venue',
        placeholder: 'Select venue...',
        options: MOCK_VENUES,
        required: true,
      },
    ],
  },
  {
    id: 'request',
    label: 'Change Request',
    icon: 'ArrowRight',
    description: 'What changes are you requesting?',
    fields: [
      {
        id: 'changeReason',
        type: 'cards',
        label: 'Reason for Change',
        options: [
          {
            value: 'conflict',
            label: 'Schedule Conflict',
            icon: 'AlertTriangle',
            description: 'Conflicting events or commitments'
          },
          {
            value: 'weather',
            label: 'Weather',
            icon: 'CloudRain',
            description: 'Weather-related concerns'
          },
          {
            value: 'facility',
            label: 'Facility Issue',
            icon: 'Building',
            description: 'Venue unavailable or issues'
          },
          {
            value: 'emergency',
            label: 'Emergency',
            icon: 'AlertCircle',
            description: 'Unforeseen emergency'
          },
          {
            value: 'other',
            label: 'Other',
            icon: 'MoreHorizontal',
            description: 'Other reason'
          },
        ],
        columns: 1,
        required: true,
      },
      {
        id: 'reasonDetails',
        type: 'textarea',
        label: 'Reason Details',
        placeholder: 'Provide more details about why this change is needed...',
        rows: 4,
        required: true,
      },
      {
        id: 'preferredDate1',
        type: 'text',
        label: 'Preferred New Date (Option 1)',
        placeholder: 'YYYY-MM-DD',
        required: true,
      },
      {
        id: 'preferredTime1',
        type: 'text',
        label: 'Preferred Time (Option 1)',
        placeholder: 'HH:MM AM/PM',
        required: true,
      },
      {
        id: 'preferredDate2',
        type: 'text',
        label: 'Preferred New Date (Option 2)',
        placeholder: 'YYYY-MM-DD',
      },
      {
        id: 'preferredTime2',
        type: 'text',
        label: 'Preferred Time (Option 2)',
        placeholder: 'HH:MM AM/PM',
      },
      {
        id: 'preferredDate3',
        type: 'text',
        label: 'Preferred New Date (Option 3)',
        placeholder: 'YYYY-MM-DD',
      },
      {
        id: 'preferredTime3',
        type: 'text',
        label: 'Preferred Time (Option 3)',
        placeholder: 'HH:MM AM/PM',
      },
      {
        id: 'venueChange',
        type: 'cards',
        label: 'Venue Change Required?',
        options: [
          { value: 'no', label: 'Same Venue', icon: 'Check', description: 'Keep the same venue' },
          { value: 'yes', label: 'Different Venue', icon: 'MapPin', description: 'Need a different venue' },
        ],
      },
      {
        id: 'newVenue',
        type: 'select',
        label: 'New Venue (if different)',
        placeholder: 'Select new venue...',
        options: MOCK_VENUES,
      },
    ],
  },
  {
    id: 'impact',
    label: 'Impact Assessment',
    icon: 'AlertTriangle',
    description: 'Who else is affected by this change?',
    fields: [
      {
        id: 'otherTeamsAffected',
        type: 'pills',
        label: 'Other Teams Affected',
        options: MOCK_TEAMS,
        hint: 'Select any other teams impacted by this change',
      },
      {
        id: 'impactDescription',
        type: 'textarea',
        label: 'Impact Description',
        placeholder: 'Describe how other teams or schedules are affected...',
        rows: 3,
      },
      {
        id: 'notificationStatus',
        type: 'checkboxes',
        label: 'Notification Status',
        options: [
          { value: 'home-notified', label: 'Home team notified', icon: 'Check' },
          { value: 'away-notified', label: 'Away team notified', icon: 'Check' },
          { value: 'venue-notified', label: 'Venue notified', icon: 'Check' },
          { value: 'officials-notified', label: 'Officials notified', icon: 'Check' },
          { value: 'parents-notified', label: 'Parents notified', icon: 'Check' },
        ],
        required: true,
      },
    ],
  },
  {
    id: 'approval',
    label: 'Approval',
    icon: 'CheckCircle',
    description: 'League approval and confirmation',
    fields: [
      {
        id: 'leagueApprovalNeeded',
        type: 'cards',
        label: 'League Approval Required?',
        options: [
          {
            value: 'yes',
            label: 'Yes, Required',
            icon: 'Shield',
            description: 'This change needs league approval'
          },
          {
            value: 'no',
            label: 'No, Not Required',
            icon: 'Check',
            description: 'Teams can reschedule directly'
          },
          {
            value: 'unsure',
            label: 'Unsure',
            icon: 'HelpCircle',
            description: 'Not sure if approval is needed'
          },
        ],
        required: true,
      },
      {
        id: 'opponentAgreement',
        type: 'cards',
        label: 'Opponent Team Agreement',
        options: [
          {
            value: 'agreed',
            label: 'Agreed',
            icon: 'CheckCircle',
            description: 'Opponent has agreed to the change'
          },
          {
            value: 'pending',
            label: 'Pending',
            icon: 'Clock',
            description: 'Waiting for opponent response'
          },
          {
            value: 'not-contacted',
            label: 'Not Contacted',
            icon: 'MessageSquare',
            description: 'Have not contacted opponent yet'
          },
        ],
        required: true,
      },
      {
        id: 'requesterName',
        type: 'text',
        label: 'Requester Name',
        placeholder: 'Your full name',
        required: true,
      },
      {
        id: 'requesterRole',
        type: 'select',
        label: 'Requester Role',
        placeholder: 'Select your role...',
        options: [
          { value: 'coach', label: 'Coach' },
          { value: 'team-manager', label: 'Team Manager' },
          { value: 'parent', label: 'Parent' },
          { value: 'league-admin', label: 'League Administrator' },
        ],
        required: true,
      },
      {
        id: 'additionalNotes',
        type: 'textarea',
        label: 'Additional Notes',
        placeholder: 'Any other information for the league...',
        rows: 3,
      },
    ],
  },
];

// ============================================================================
// PREVIEW COMPONENT
// ============================================================================

const ScheduleRequestPreview = ({ data }) => {
  const homeTeam = MOCK_TEAMS.find(t => t.value === data.homeTeam);
  const awayTeam = MOCK_TEAMS.find(t => t.value === data.awayTeam);
  const venue = MOCK_VENUES.find(v => v.value === data.venue);
  const newVenue = MOCK_VENUES.find(v => v.value === data.newVenue);

  const reasonLabels = {
    conflict: 'Schedule Conflict',
    weather: 'Weather',
    facility: 'Facility Issue',
    emergency: 'Emergency',
    other: 'Other',
  };

  return (
    <div className="space-y-4">
      {/* Schedule Change Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
      >
        <p className="text-white/40 text-xs uppercase tracking-wider mb-3 text-center">
          Schedule Change Request
        </p>

        {/* Teams */}
        {(homeTeam || awayTeam) && (
          <div className="text-center mb-4">
            <p className="text-white font-medium">
              {homeTeam?.label || 'Home Team'} vs {awayTeam?.label || 'Away Team'}
            </p>
          </div>
        )}

        {/* Original -> New */}
        <div className="flex items-stretch gap-3 py-3">
          {/* Original */}
          <div className="flex-1">
            <div
              className="h-full p-3 rounded-lg text-center"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <p className="text-red-400 text-xs uppercase tracking-wider mb-2">Original</p>
              <p className="text-white font-medium text-sm">
                {data.originalDate || 'No date'}
              </p>
              <p className="text-white/60 text-xs mt-1">
                {data.originalTime || 'No time'}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="w-5 h-5" style={{ color: THEME.accent }} />
            </motion.div>
          </div>

          {/* New */}
          <div className="flex-1">
            <div
              className="h-full p-3 rounded-lg text-center"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
            >
              <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2">Requested</p>
              <p className="text-white font-medium text-sm">
                {data.preferredDate1 || 'No date'}
              </p>
              <p className="text-white/60 text-xs mt-1">
                {data.preferredTime1 || 'No time'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Venue */}
      {venue && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Venue</p>
          <p className="text-white/80 text-sm">{venue.label}</p>
          {data.venueChange === 'yes' && newVenue && (
            <div className="mt-2 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" style={{ color: THEME.accent }} />
              <span className="text-sm" style={{ color: THEME.accent }}>
                {newVenue.label}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Reason */}
      {data.changeReason && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Reason</p>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" style={{ color: THEME.accent }} />
            <p className="text-white/80 text-sm">
              {reasonLabels[data.changeReason] || data.changeReason}
            </p>
          </div>
        </div>
      )}

      {/* Alternative Dates */}
      {(data.preferredDate2 || data.preferredDate3) && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Alternative Dates</p>
          <div className="space-y-1">
            {data.preferredDate2 && (
              <p className="text-white/60 text-sm">
                Option 2: {data.preferredDate2} {data.preferredTime2 && `at ${data.preferredTime2}`}
              </p>
            )}
            {data.preferredDate3 && (
              <p className="text-white/60 text-sm">
                Option 3: {data.preferredDate3} {data.preferredTime3 && `at ${data.preferredTime3}`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Status */}
      <div
        className="rounded-xl border p-4"
        style={{
          borderColor: data.opponentAgreement === 'agreed' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)',
          backgroundColor: data.opponentAgreement === 'agreed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        }}
      >
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Status</p>
        <div className="flex items-center gap-2">
          {data.opponentAgreement === 'agreed' ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <p className="text-emerald-400 text-sm font-medium">Opponent Agreed</p>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-amber-400" />
              <p className="text-amber-400 text-sm font-medium">
                {data.opponentAgreement === 'pending' ? 'Awaiting Response' : 'Not Yet Contacted'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Notifications */}
      {data.notificationStatus?.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
            Notified ({data.notificationStatus.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {data.notificationStatus.map((status) => (
              <span
                key={status}
                className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400"
              >
                {status.replace('-', ' ').replace('notified', '').trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ScheduleRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save handler
  const handleSave = useCallback(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Auto-saved schedule request:', data);
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitted schedule request:', data);
      // TODO: Replace with actual mutation
      // await submitScheduleRequest.mutateAsync(data);
      alert('Schedule change request submitted successfully!');
    } catch (error) {
      console.error('Failed to submit schedule request:', error);
      alert('Failed to submit schedule request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <FormBuilder
      title="Schedule Change Request"
      subtitle="Request a game schedule modification"
      sections={formSections}
      onSubmit={handleSubmit}
      onSave={handleSave}
      submitLabel={isSubmitting ? 'Submitting...' : 'Submit Request'}
      skipLabel="Skip for now"
      showPreview={true}
      previewComponent={ScheduleRequestPreview}
      defaultMode="form"
    />
  );
};

export default ScheduleRequest;
