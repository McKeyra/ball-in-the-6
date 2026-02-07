import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, AlertTriangle } from 'lucide-react';
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

const MOCK_GAMES = [
  { value: 'game-001', label: 'vs. Raptors Youth - Jan 15, 2025' },
  { value: 'game-002', label: 'vs. Lakers Academy - Jan 18, 2025' },
  { value: 'game-003', label: 'vs. Celtics Jr - Jan 22, 2025' },
  { value: 'game-004', label: 'vs. Heat Elite - Jan 25, 2025' },
];

const MOCK_PLAYERS = [
  { value: 'player-001', label: 'Marcus Johnson (#12)' },
  { value: 'player-002', label: 'Tyler Williams (#5)' },
  { value: 'player-003', label: 'Derek Smith (#23)' },
  { value: 'player-004', label: 'James Lee (#8)' },
  { value: 'player-005', label: 'Kevin Brown (#11)' },
];

// ============================================================================
// FORM SECTIONS CONFIGURATION
// ============================================================================

const formSections = [
  {
    id: 'game-info',
    label: 'Game Information',
    icon: 'Trophy',
    description: 'Select the game and record the final score',
    fields: [
      {
        id: 'game',
        type: 'select',
        label: 'Select Game',
        placeholder: 'Choose the game...',
        options: MOCK_GAMES,
        required: true,
      },
      {
        id: 'ourScore',
        type: 'text',
        label: 'Our Score',
        placeholder: 'Enter our final score',
        required: true,
      },
      {
        id: 'opponentScore',
        type: 'text',
        label: 'Opponent Score',
        placeholder: 'Enter opponent score',
        required: true,
      },
      {
        id: 'gameResult',
        type: 'cards',
        label: 'Game Result',
        options: [
          { value: 'win', label: 'Win', icon: 'Trophy', description: 'We won the game' },
          { value: 'loss', label: 'Loss', icon: 'TrendingDown', description: 'We lost the game' },
          { value: 'tie', label: 'Tie', icon: 'Equal', description: 'Game ended in a tie' },
        ],
        required: true,
      },
    ],
  },
  {
    id: 'performance',
    label: 'Team Performance',
    icon: 'Star',
    description: 'Rate the team performance and note highlights',
    fields: [
      {
        id: 'teamRating',
        type: 'cards',
        label: 'Overall Team Rating',
        options: [
          { value: '5', label: 'Excellent', icon: 'Star', description: 'Outstanding performance' },
          { value: '4', label: 'Good', icon: 'ThumbsUp', description: 'Above average play' },
          { value: '3', label: 'Average', icon: 'Minus', description: 'Standard performance' },
          { value: '2', label: 'Below Average', icon: 'ThumbsDown', description: 'Needs improvement' },
          { value: '1', label: 'Poor', icon: 'AlertTriangle', description: 'Significant issues' },
        ],
        columns: 1,
        required: true,
      },
      {
        id: 'highlights',
        type: 'textarea',
        label: 'Game Highlights',
        placeholder: 'Describe key positive moments from the game...',
        rows: 4,
        required: true,
      },
      {
        id: 'areasToImprove',
        type: 'textarea',
        label: 'Areas to Improve',
        placeholder: 'What needs work going forward...',
        rows: 4,
        required: true,
      },
    ],
  },
  {
    id: 'player-notes',
    label: 'Player Notes',
    icon: 'Users',
    description: 'Note standout players and any injuries',
    fields: [
      {
        id: 'standoutPlayers',
        type: 'pills',
        label: 'Standout Players',
        options: MOCK_PLAYERS,
        maxSelect: 5,
        hint: 'Select up to 5 standout players',
      },
      {
        id: 'standoutNotes',
        type: 'textarea',
        label: 'Standout Player Notes',
        placeholder: 'Notes about standout performances...',
        rows: 3,
      },
      {
        id: 'injuries',
        type: 'pills',
        label: 'Injured Players',
        options: MOCK_PLAYERS,
        hint: 'Select any players who were injured',
      },
      {
        id: 'injuryDetails',
        type: 'textarea',
        label: 'Injury Details',
        placeholder: 'Describe injuries and severity...',
        rows: 3,
      },
    ],
  },
  {
    id: 'issues',
    label: 'Issues & Incidents',
    icon: 'AlertTriangle',
    description: 'Report any incidents or referee feedback',
    fields: [
      {
        id: 'hadIncidents',
        type: 'cards',
        label: 'Were there any incidents?',
        options: [
          { value: 'yes', label: 'Yes', icon: 'AlertCircle', description: 'There were incidents to report' },
          { value: 'no', label: 'No', icon: 'CheckCircle', description: 'No incidents occurred' },
        ],
      },
      {
        id: 'incidentDescription',
        type: 'textarea',
        label: 'Incident Description',
        placeholder: 'Describe what happened...',
        rows: 4,
      },
      {
        id: 'refereeFeedback',
        type: 'textarea',
        label: 'Referee Feedback',
        placeholder: 'Any notes about officiating...',
        rows: 3,
      },
    ],
  },
  {
    id: 'next-steps',
    label: 'Next Steps',
    icon: 'ArrowRight',
    description: 'Plan for upcoming practices and games',
    fields: [
      {
        id: 'practiceFocus',
        type: 'checkboxes',
        label: 'Practice Focus Areas',
        options: [
          { value: 'offense', label: 'Offensive plays', icon: 'Target' },
          { value: 'defense', label: 'Defensive schemes', icon: 'Shield' },
          { value: 'shooting', label: 'Shooting drills', icon: 'Crosshair' },
          { value: 'conditioning', label: 'Conditioning', icon: 'Heart' },
          { value: 'teamwork', label: 'Team chemistry', icon: 'Users' },
          { value: 'fundamentals', label: 'Fundamentals', icon: 'Layers' },
        ],
        required: true,
      },
      {
        id: 'lineupChanges',
        type: 'textarea',
        label: 'Lineup Changes',
        placeholder: 'Any planned changes to the starting lineup or rotations...',
        rows: 3,
      },
      {
        id: 'additionalNotes',
        type: 'textarea',
        label: 'Additional Notes',
        placeholder: 'Any other notes for the next game...',
        rows: 3,
      },
    ],
  },
];

// ============================================================================
// PREVIEW COMPONENT
// ============================================================================

const GameReportPreview = ({ data }) => {
  const selectedGame = MOCK_GAMES.find(g => g.value === data.game);
  const ourScore = data.ourScore || '0';
  const opponentScore = data.opponentScore || '0';
  const isWin = parseInt(ourScore) > parseInt(opponentScore);
  const isTie = parseInt(ourScore) === parseInt(opponentScore);

  return (
    <div className="space-y-4">
      {/* Game Summary Card */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div className="text-center">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Game Report</p>
          <p className="text-white/60 text-sm mb-3">
            {selectedGame?.label || 'No game selected'}
          </p>

          {/* Score Display */}
          <div className="flex items-center justify-center gap-4 my-4">
            <div className="text-center">
              <p className="text-white/40 text-xs mb-1">Us</p>
              <p
                className="text-3xl font-bold"
                style={{ color: isWin ? '#10b981' : isTie ? THEME.accent : '#ef4444' }}
              >
                {ourScore}
              </p>
            </div>
            <div className="text-white/20 text-xl">-</div>
            <div className="text-center">
              <p className="text-white/40 text-xs mb-1">Them</p>
              <p className="text-3xl font-bold text-white/60">{opponentScore}</p>
            </div>
          </div>

          {/* Result Badge */}
          {data.ourScore && data.opponentScore && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                ${isWin
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isTie
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-red-500/20 text-red-400'
                }
              `}
            >
              <Trophy className="w-4 h-4" />
              {isWin ? 'Victory' : isTie ? 'Draw' : 'Defeat'}
            </motion.div>
          )}
        </div>
      </div>

      {/* Team Rating */}
      {data.teamRating && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Team Rating</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= parseInt(data.teamRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Standout Players */}
      {data.standoutPlayers?.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Standout Players</p>
          <div className="flex flex-wrap gap-1.5">
            {data.standoutPlayers.map((playerId) => {
              const player = MOCK_PLAYERS.find(p => p.value === playerId);
              return (
                <span
                  key={playerId}
                  className="px-2 py-1 rounded-md text-xs font-medium"
                  style={{ backgroundColor: 'rgba(201, 169, 98, 0.2)', color: THEME.accent }}
                >
                  {player?.label || playerId}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Incidents Alert */}
      {data.hadIncidents === 'yes' && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <p className="text-sm font-medium">Incident Reported</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const GameReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save handler
  const handleSave = useCallback(async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Auto-saved game report:', data);
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API mutation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitted game report:', data);
      // TODO: Replace with actual mutation
      // await submitGameReport.mutateAsync(data);
      alert('Game report submitted successfully!');
    } catch (error) {
      console.error('Failed to submit game report:', error);
      alert('Failed to submit game report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <FormBuilder
      title="Game Report"
      subtitle="Complete the post-game coach report"
      sections={formSections}
      onSubmit={handleSubmit}
      onSave={handleSave}
      submitLabel={isSubmitting ? 'Submitting...' : 'Submit Report'}
      skipLabel="Skip for now"
      showPreview={true}
      previewComponent={GameReportPreview}
      defaultMode="form"
    />
  );
};

export default GameReport;
