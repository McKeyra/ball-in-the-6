import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, FileText, AlertCircle } from 'lucide-react';
import FormBuilder from '@/components/forms/FormBuilder';

// ============================================================================
// THEME CONSTANTS
// ============================================================================

const THEME = {
  accent: '#c9a962',
  background: '#0f0f0f',
};

// ============================================================================
// FORM SECTIONS CONFIGURATION
// ============================================================================

const formSections = [
  {
    id: 'incident',
    label: 'Incident Details',
    icon: 'AlertTriangle',
    description: 'When and where did the incident occur?',
    fields: [
      {
        id: 'incidentDate',
        type: 'text',
        label: 'Date of Incident',
        placeholder: 'YYYY-MM-DD',
        required: true,
      },
      {
        id: 'incidentTime',
        type: 'text',
        label: 'Time of Incident',
        placeholder: 'HH:MM AM/PM',
        required: true,
      },
      {
        id: 'location',
        type: 'text',
        label: 'Location',
        placeholder: 'Where did this occur?',
        required: true,
      },
      {
        id: 'incidentType',
        type: 'cards',
        label: 'Type of Incident',
        options: [
          { value: 'injury', label: 'Injury', icon: 'Heart', description: 'Physical injury to a person' },
          { value: 'conduct', label: 'Conduct', icon: 'AlertCircle', description: 'Behavioral or conduct issue' },
          { value: 'property', label: 'Property', icon: 'Package', description: 'Damage to property or equipment' },
        ],
        required: true,
      },
      {
        id: 'severity',
        type: 'cards',
        label: 'Severity Level',
        options: [
          { value: 'low', label: 'Low', icon: 'Minus', description: 'Minor incident, no immediate action needed' },
          { value: 'medium', label: 'Medium', icon: 'AlertTriangle', description: 'Moderate incident, requires attention' },
          { value: 'high', label: 'High', icon: 'AlertCircle', description: 'Serious incident, immediate action required' },
          { value: 'critical', label: 'Critical', icon: 'XCircle', description: 'Emergency, requires immediate intervention' },
        ],
        columns: 1,
        required: true,
      },
    ],
  },
  {
    id: 'people-involved',
    label: 'People Involved',
    icon: 'Users',
    description: 'Who was involved in this incident?',
    fields: [
      {
        id: 'primaryPerson',
        type: 'text',
        label: 'Primary Person Involved',
        placeholder: 'Full name',
        required: true,
      },
      {
        id: 'primaryRole',
        type: 'select',
        label: 'Role',
        placeholder: 'Select role...',
        options: [
          { value: 'player', label: 'Player' },
          { value: 'coach', label: 'Coach' },
          { value: 'referee', label: 'Referee' },
          { value: 'parent', label: 'Parent/Guardian' },
          { value: 'spectator', label: 'Spectator' },
          { value: 'staff', label: 'Staff' },
          { value: 'other', label: 'Other' },
        ],
        required: true,
      },
      {
        id: 'primaryContact',
        type: 'text',
        label: 'Contact Information',
        placeholder: 'Phone or email',
        required: true,
      },
      {
        id: 'otherPeopleInvolved',
        type: 'textarea',
        label: 'Other People Involved',
        placeholder: 'List names, roles, and contact info for anyone else involved...',
        rows: 4,
      },
    ],
  },
  {
    id: 'description',
    label: 'Incident Description',
    icon: 'FileText',
    description: 'Describe what happened in detail',
    fields: [
      {
        id: 'whatHappened',
        type: 'textarea',
        label: 'What Happened?',
        placeholder: 'Provide a detailed description of the incident...',
        rows: 6,
        required: true,
      },
      {
        id: 'immediateResponse',
        type: 'textarea',
        label: 'Immediate Response',
        placeholder: 'What was done immediately after the incident?',
        rows: 4,
      },
      {
        id: 'contributingFactors',
        type: 'checkboxes',
        label: 'Contributing Factors',
        options: [
          { value: 'weather', label: 'Weather conditions', icon: 'Cloud' },
          { value: 'equipment', label: 'Equipment issue', icon: 'Tool' },
          { value: 'facility', label: 'Facility condition', icon: 'Building' },
          { value: 'supervision', label: 'Supervision gap', icon: 'Eye' },
          { value: 'communication', label: 'Communication breakdown', icon: 'MessageSquare' },
          { value: 'other', label: 'Other factors', icon: 'HelpCircle' },
        ],
      },
    ],
  },
  {
    id: 'witnesses',
    label: 'Witnesses',
    icon: 'Eye',
    description: 'Document any witnesses to the incident',
    fields: [
      {
        id: 'hasWitnesses',
        type: 'cards',
        label: 'Were there witnesses?',
        options: [
          { value: 'yes', label: 'Yes', icon: 'Users', description: 'There were witnesses present' },
          { value: 'no', label: 'No', icon: 'UserX', description: 'No witnesses were present' },
        ],
      },
      {
        id: 'witnessNames',
        type: 'textarea',
        label: 'Witness Names & Contact',
        placeholder: 'List witness names and contact information...',
        rows: 3,
      },
      {
        id: 'witnessStatements',
        type: 'textarea',
        label: 'Witness Statements',
        placeholder: 'Summarize any statements provided by witnesses...',
        rows: 5,
      },
    ],
  },
  {
    id: 'action-taken',
    label: 'Action Taken',
    icon: 'Shield',
    description: 'What actions were taken and what follow-up is needed?',
    fields: [
      {
        id: 'firstAid',
        type: 'cards',
        label: 'Was first aid administered?',
        options: [
          { value: 'yes', label: 'Yes', icon: 'Heart', description: 'First aid was provided' },
          { value: 'no', label: 'No', icon: 'X', description: 'First aid was not needed' },
          { value: 'ems', label: 'EMS Called', icon: 'Phone', description: 'Emergency services were called' },
        ],
      },
      {
        id: 'firstAidDetails',
        type: 'textarea',
        label: 'First Aid Details',
        placeholder: 'Describe the first aid provided...',
        rows: 3,
      },
      {
        id: 'disciplinaryAction',
        type: 'checkboxes',
        label: 'Disciplinary Actions',
        options: [
          { value: 'verbal-warning', label: 'Verbal warning issued', icon: 'MessageSquare' },
          { value: 'written-warning', label: 'Written warning issued', icon: 'FileText' },
          { value: 'ejection', label: 'Ejection from game/event', icon: 'LogOut' },
          { value: 'suspension', label: 'Suspension recommended', icon: 'Ban' },
          { value: 'none', label: 'No disciplinary action', icon: 'Check' },
        ],
      },
      {
        id: 'followUpNeeded',
        type: 'checkboxes',
        label: 'Follow-up Required',
        options: [
          { value: 'medical', label: 'Medical follow-up', icon: 'Stethoscope' },
          { value: 'investigation', label: 'Further investigation', icon: 'Search' },
          { value: 'parent-contact', label: 'Parent/guardian contact', icon: 'Phone' },
          { value: 'league-report', label: 'League office report', icon: 'FileText' },
          { value: 'police', label: 'Police report filed', icon: 'Shield' },
          { value: 'insurance', label: 'Insurance claim', icon: 'FileCheck' },
        ],
        required: true,
      },
      {
        id: 'additionalNotes',
        type: 'textarea',
        label: 'Additional Notes',
        placeholder: 'Any other relevant information...',
        rows: 4,
      },
    ],
  },
];

// ============================================================================
// PREVIEW COMPONENT
// ============================================================================

const IncidentReportPreview = ({ data }) => {
  const severityConfig = {
    low: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', label: 'Low' },
    medium: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', label: 'Medium' },
    high: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', label: 'High' },
    critical: { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.25)', label: 'Critical' },
  };

  const typeConfig = {
    injury: { icon: AlertCircle, label: 'Injury', color: '#ef4444' },
    conduct: { icon: AlertTriangle, label: 'Conduct', color: '#f59e0b' },
    property: { icon: FileText, label: 'Property', color: '#3b82f6' },
  };

  const severity = severityConfig[data.severity] || severityConfig.low;
  const type = typeConfig[data.incidentType] || null;
  const TypeIcon = type?.icon || AlertTriangle;

  const getStatusLabel = () => {
    if (data.followUpNeeded?.length > 0) return 'Follow-up Required';
    if (data.disciplinaryAction?.length > 0) return 'Action Taken';
    return 'Pending Review';
  };

  return (
    <div className="space-y-4">
      {/* Severity Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-xl border p-4"
        style={{
          borderColor: data.severity ? `${severity.color}40` : 'rgba(255,255,255,0.06)',
          backgroundColor: data.severity ? severity.bg : 'rgba(255,255,255,0.03)',
        }}
      >
        <div className="text-center">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Incident Report</p>

          {/* Severity Badge */}
          {data.severity && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3"
              style={{ backgroundColor: severity.bg }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: severity.color }} />
              <span className="font-semibold text-lg" style={{ color: severity.color }}>
                {severity.label} Severity
              </span>
            </motion.div>
          )}

          {/* Type */}
          {type && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <TypeIcon className="w-4 h-4" style={{ color: type.color }} />
              <span className="text-white/60 text-sm">{type.label} Incident</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Date/Time/Location */}
      {(data.incidentDate || data.incidentTime || data.location) && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 space-y-2">
          {data.incidentDate && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-white/40" />
              <span className="text-white/60">
                {data.incidentDate} {data.incidentTime && `at ${data.incidentTime}`}
              </span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-white/40" />
              <span className="text-white/60">{data.location}</span>
            </div>
          )}
        </div>
      )}

      {/* People Involved */}
      {data.primaryPerson && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Primary Person</p>
          <p className="text-white font-medium">{data.primaryPerson}</p>
          {data.primaryRole && (
            <span
              className="inline-block mt-1 px-2 py-0.5 rounded text-xs"
              style={{ backgroundColor: 'rgba(201, 169, 98, 0.2)', color: THEME.accent }}
            >
              {data.primaryRole}
            </span>
          )}
        </div>
      )}

      {/* Status */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Status</p>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: data.followUpNeeded?.length > 0 ? '#f59e0b' : '#22c55e' }}
          />
          <span className="text-white/80 text-sm">{getStatusLabel()}</span>
        </div>
      </div>

      {/* First Aid */}
      {data.firstAid && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">First Aid</p>
          <p className="text-white/80 text-sm">
            {data.firstAid === 'yes' && 'First aid administered'}
            {data.firstAid === 'no' && 'Not required'}
            {data.firstAid === 'ems' && 'EMS called'}
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const IncidentReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save handler
  const handleSave = useCallback(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Auto-saved incident report:', data);
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitted incident report:', data);
      // TODO: Replace with actual mutation
      // await submitIncidentReport.mutateAsync(data);
      alert('Incident report submitted successfully!');
    } catch (error) {
      console.error('Failed to submit incident report:', error);
      alert('Failed to submit incident report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <FormBuilder
      title="Incident Report"
      subtitle="Document safety or conduct incidents"
      sections={formSections}
      onSubmit={handleSubmit}
      onSave={handleSave}
      submitLabel={isSubmitting ? 'Submitting...' : 'Submit Report'}
      skipLabel="Skip for now"
      showPreview={true}
      previewComponent={IncidentReportPreview}
      defaultMode="wizard"
    />
  );
};

export default IncidentReport;
