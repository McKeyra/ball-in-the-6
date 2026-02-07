import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar } from 'lucide-react';
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

// ============================================================================
// FORM SECTIONS CONFIGURATION
// ============================================================================

const formSections = [
  {
    id: 'player',
    label: 'Player Information',
    icon: 'User',
    description: 'Details about the player requesting transfer',
    fields: [
      {
        id: 'playerName',
        type: 'text',
        label: 'Player Name',
        placeholder: 'Full legal name',
        required: true,
      },
      {
        id: 'playerId',
        type: 'text',
        label: 'Player ID',
        placeholder: 'League registration ID',
        required: true,
      },
      {
        id: 'currentTeam',
        type: 'select',
        label: 'Current Team',
        placeholder: 'Select current team...',
        options: MOCK_TEAMS,
        required: true,
      },
      {
        id: 'playerContact',
        type: 'text',
        label: 'Player/Parent Contact',
        placeholder: 'Email or phone number',
        required: true,
      },
    ],
  },
  {
    id: 'transfer',
    label: 'Transfer Details',
    icon: 'ArrowRight',
    description: 'Where is the player transferring to and why?',
    fields: [
      {
        id: 'newTeam',
        type: 'select',
        label: 'New Team',
        placeholder: 'Select destination team...',
        options: MOCK_TEAMS,
        required: true,
      },
      {
        id: 'transferReason',
        type: 'cards',
        label: 'Reason for Transfer',
        options: [
          {
            value: 'moving',
            label: 'Relocating',
            icon: 'MapPin',
            description: 'Family is moving to a new area'
          },
          {
            value: 'playing-time',
            label: 'Playing Time',
            icon: 'Clock',
            description: 'Seeking more playing opportunities'
          },
          {
            value: 'personal',
            label: 'Personal',
            icon: 'User',
            description: 'Personal or family reasons'
          },
          {
            value: 'development',
            label: 'Development',
            icon: 'TrendingUp',
            description: 'Better fit for player development'
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
        label: 'Additional Details',
        placeholder: 'Provide more context about the transfer request...',
        rows: 4,
      },
    ],
  },
  {
    id: 'timing',
    label: 'Timing',
    icon: 'Calendar',
    description: 'When should this transfer take effect?',
    fields: [
      {
        id: 'effectiveDate',
        type: 'text',
        label: 'Requested Effective Date',
        placeholder: 'YYYY-MM-DD',
        required: true,
      },
      {
        id: 'urgency',
        type: 'cards',
        label: 'Urgency',
        options: [
          {
            value: 'immediate',
            label: 'Immediate',
            icon: 'Zap',
            description: 'As soon as possible'
          },
          {
            value: 'end-of-season',
            label: 'End of Season',
            icon: 'Calendar',
            description: 'After current season ends'
          },
          {
            value: 'next-season',
            label: 'Next Season',
            icon: 'CalendarPlus',
            description: 'Start of next season'
          },
          {
            value: 'flexible',
            label: 'Flexible',
            icon: 'Clock',
            description: 'No specific timeline'
          },
        ],
        required: true,
      },
    ],
  },
  {
    id: 'approvals',
    label: 'Approvals',
    icon: 'CheckCircle',
    description: 'Consent from current and new teams',
    fields: [
      {
        id: 'currentCoachConsent',
        type: 'cards',
        label: 'Current Coach Consent',
        options: [
          {
            value: 'approved',
            label: 'Approved',
            icon: 'CheckCircle',
            description: 'Coach has approved the transfer'
          },
          {
            value: 'pending',
            label: 'Pending',
            icon: 'Clock',
            description: 'Waiting for coach response'
          },
          {
            value: 'denied',
            label: 'Denied',
            icon: 'XCircle',
            description: 'Coach has denied the request'
          },
        ],
        required: true,
      },
      {
        id: 'currentCoachName',
        type: 'text',
        label: 'Current Coach Name',
        placeholder: 'Name of current coach',
      },
      {
        id: 'newCoachAcceptance',
        type: 'cards',
        label: 'New Coach Acceptance',
        options: [
          {
            value: 'accepted',
            label: 'Accepted',
            icon: 'CheckCircle',
            description: 'New team has accepted the player'
          },
          {
            value: 'pending',
            label: 'Pending',
            icon: 'Clock',
            description: 'Waiting for new team response'
          },
          {
            value: 'declined',
            label: 'Declined',
            icon: 'XCircle',
            description: 'New team has declined'
          },
        ],
        required: true,
      },
      {
        id: 'newCoachName',
        type: 'text',
        label: 'New Coach Name',
        placeholder: 'Name of new coach',
      },
    ],
  },
  {
    id: 'notes',
    label: 'Additional Notes',
    icon: 'FileText',
    description: 'Any other relevant information',
    fields: [
      {
        id: 'parentGuardianConsent',
        type: 'cards',
        label: 'Parent/Guardian Consent',
        options: [
          {
            value: 'yes',
            label: 'Consent Given',
            icon: 'CheckCircle',
            description: 'Parent/guardian approves this transfer'
          },
          {
            value: 'no',
            label: 'No Consent',
            icon: 'XCircle',
            description: 'Parent/guardian has not consented'
          },
        ],
        required: true,
      },
      {
        id: 'outstandingFees',
        type: 'cards',
        label: 'Outstanding Fees with Current Team',
        options: [
          { value: 'none', label: 'No Outstanding Fees', icon: 'CheckCircle' },
          { value: 'pending', label: 'Fees Pending', icon: 'Clock' },
          { value: 'paid', label: 'All Paid', icon: 'CreditCard' },
        ],
      },
      {
        id: 'additionalNotes',
        type: 'textarea',
        label: 'Additional Notes',
        placeholder: 'Any other information relevant to this transfer...',
        rows: 4,
      },
      {
        id: 'attachments',
        type: 'upload',
        label: 'Supporting Documents',
        hint: 'Upload any supporting documentation (PDF, images)',
        accept: '.pdf,.png,.jpg,.jpeg',
        multiple: true,
      },
    ],
  },
];

// ============================================================================
// PREVIEW COMPONENT
// ============================================================================

const TransferRequestPreview = ({ data }) => {
  const currentTeam = MOCK_TEAMS.find(t => t.value === data.currentTeam);
  const newTeam = MOCK_TEAMS.find(t => t.value === data.newTeam);

  const getApprovalStatus = () => {
    const current = data.currentCoachConsent;
    const newCoach = data.newCoachAcceptance;

    if (current === 'approved' && newCoach === 'accepted') return 'approved';
    if (current === 'denied' || newCoach === 'declined') return 'denied';
    return 'pending';
  };

  const approvalStatus = getApprovalStatus();
  const statusConfig = {
    approved: { color: '#22c55e', label: 'Ready for League Review' },
    pending: { color: '#f59e0b', label: 'Awaiting Approvals' },
    denied: { color: '#ef4444', label: 'Transfer Blocked' },
  };
  const status = statusConfig[approvalStatus];

  return (
    <div className="space-y-4">
      {/* Transfer Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
      >
        <p className="text-white/40 text-xs uppercase tracking-wider mb-3 text-center">
          Transfer Request
        </p>

        {/* Player Name */}
        {data.playerName && (
          <div className="text-center mb-4">
            <p className="text-white font-semibold text-lg">{data.playerName}</p>
            {data.playerId && (
              <p className="text-white/40 text-sm">ID: {data.playerId}</p>
            )}
          </div>
        )}

        {/* From -> To Visual */}
        <div className="flex items-center gap-3 py-3">
          <div className="flex-1 text-center">
            <div
              className="p-3 rounded-lg mb-2"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <Users className="w-6 h-6 mx-auto text-red-400" />
            </div>
            <p className="text-white/40 text-xs mb-1">From</p>
            <p className="text-white text-sm font-medium">
              {currentTeam?.label || 'Select team'}
            </p>
          </div>

          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight className="w-6 h-6" style={{ color: THEME.accent }} />
          </motion.div>

          <div className="flex-1 text-center">
            <div
              className="p-3 rounded-lg mb-2"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
            >
              <Users className="w-6 h-6 mx-auto text-emerald-400" />
            </div>
            <p className="text-white/40 text-xs mb-1">To</p>
            <p className="text-white text-sm font-medium">
              {newTeam?.label || 'Select team'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Reason */}
      {data.transferReason && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Reason</p>
          <p className="text-white/80 text-sm capitalize">
            {data.transferReason.replace('-', ' ')}
          </p>
        </div>
      )}

      {/* Timing */}
      {data.effectiveDate && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Effective Date</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/40" />
            <p className="text-white/80 text-sm">{data.effectiveDate}</p>
          </div>
          {data.urgency && (
            <span
              className="inline-block mt-2 px-2 py-0.5 rounded text-xs capitalize"
              style={{ backgroundColor: 'rgba(201, 169, 98, 0.2)', color: THEME.accent }}
            >
              {data.urgency}
            </span>
          )}
        </div>
      )}

      {/* Approval Status */}
      <div
        className="rounded-xl border p-4"
        style={{
          borderColor: `${status.color}30`,
          backgroundColor: `${status.color}10`,
        }}
      >
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Status</p>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: status.color }}
          />
          <p className="text-sm font-medium" style={{ color: status.color }}>
            {status.label}
          </p>
        </div>

        {/* Approval Details */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">Current Coach</span>
            <span className={`capitalize ${
              data.currentCoachConsent === 'approved' ? 'text-emerald-400' :
              data.currentCoachConsent === 'denied' ? 'text-red-400' : 'text-amber-400'
            }`}>
              {data.currentCoachConsent || 'Pending'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">New Coach</span>
            <span className={`capitalize ${
              data.newCoachAcceptance === 'accepted' ? 'text-emerald-400' :
              data.newCoachAcceptance === 'declined' ? 'text-red-400' : 'text-amber-400'
            }`}>
              {data.newCoachAcceptance || 'Pending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TransferRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save handler
  const handleSave = useCallback(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Auto-saved transfer request:', data);
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitted transfer request:', data);
      // TODO: Replace with actual mutation
      // await submitTransferRequest.mutateAsync(data);
      alert('Transfer request submitted successfully!');
    } catch (error) {
      console.error('Failed to submit transfer request:', error);
      alert('Failed to submit transfer request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <FormBuilder
      title="Transfer Request"
      subtitle="Request a player team transfer"
      sections={formSections}
      onSubmit={handleSubmit}
      onSave={handleSave}
      submitLabel={isSubmitting ? 'Submitting...' : 'Submit Request'}
      skipLabel="Skip for now"
      showPreview={true}
      previewComponent={TransferRequestPreview}
      defaultMode="wizard"
    />
  );
};

export default TransferRequest;
