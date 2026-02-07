import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  Trophy,
  TrendingUp,
  Heart,
  Sparkles,
  Crown,
  Users,
  Award,
  Star,
} from 'lucide-react';
import FormBuilder from '@/components/forms/FormBuilder';

// ============================================================================
// THEME CONSTANTS
// ============================================================================

const GOLD = '#c9a962';
const GOLD_LIGHT = '#d4b872';

// ============================================================================
// AWARD CATEGORIES
// ============================================================================

const AWARD_CATEGORIES = [
  {
    value: 'mvp',
    label: 'MVP',
    description: 'Most Valuable Player of the season',
    icon: 'Crown',
  },
  {
    value: 'most_improved',
    label: 'Most Improved',
    description: 'Greatest development and growth',
    icon: 'TrendingUp',
  },
  {
    value: 'sportsmanship',
    label: 'Sportsmanship',
    description: 'Excellence in character and fair play',
    icon: 'Heart',
  },
  {
    value: 'rookie',
    label: 'Rookie of the Year',
    description: 'Outstanding first-year player',
    icon: 'Sparkles',
  },
  {
    value: 'leadership',
    label: 'Leadership Award',
    description: 'Inspiring teammates on and off court',
    icon: 'Users',
  },
  {
    value: 'coaches_choice',
    label: "Coach's Choice",
    description: 'Special recognition from coaching staff',
    icon: 'Award',
  },
];

// ============================================================================
// FORM CONFIGURATION
// ============================================================================

const formSections = [
  {
    id: 'award',
    label: 'Award Category',
    description: 'Select the award you wish to nominate for',
    icon: 'Trophy',
    fields: [
      {
        id: 'awardCategory',
        type: 'cards',
        label: 'Select Award Category',
        required: true,
        columns: 2,
        options: AWARD_CATEGORIES,
      },
    ],
  },
  {
    id: 'nominee',
    label: 'Nominee Information',
    description: 'Details about the player being nominated',
    icon: 'User',
    fields: [
      {
        id: 'playerName',
        type: 'text',
        label: 'Player Name',
        placeholder: 'Enter the full name of the player',
        required: true,
      },
      {
        id: 'team',
        type: 'text',
        label: 'Team',
        placeholder: 'Team name',
        required: true,
      },
      {
        id: 'position',
        type: 'select',
        label: 'Position',
        placeholder: 'Select position',
        required: true,
        options: [
          { value: 'point_guard', label: 'Point Guard' },
          { value: 'shooting_guard', label: 'Shooting Guard' },
          { value: 'small_forward', label: 'Small Forward' },
          { value: 'power_forward', label: 'Power Forward' },
          { value: 'center', label: 'Center' },
        ],
      },
    ],
  },
  {
    id: 'achievements',
    label: 'Achievements',
    description: 'Highlight key accomplishments and standout moments',
    icon: 'Star',
    fields: [
      {
        id: 'statsHighlights',
        type: 'text',
        label: 'Stats Highlights',
        placeholder: 'e.g., 25.3 PPG, 8.2 APG, 45% 3PT',
        hint: 'Key statistics that showcase their performance',
      },
      {
        id: 'keyMoments',
        type: 'textarea',
        label: 'Key Moments',
        placeholder: 'Describe memorable plays, clutch performances, or defining moments...',
        rows: 4,
        hint: 'Share specific games or plays that stood out',
      },
    ],
  },
  {
    id: 'testimonial',
    label: 'Testimonial',
    description: 'Share why this player deserves recognition',
    icon: 'Heart',
    fields: [
      {
        id: 'whyDeserving',
        type: 'textarea',
        label: 'Why They Deserve This Award',
        placeholder: 'Explain what makes this player exceptional and why they should be recognized...',
        rows: 6,
        required: true,
        hint: 'Maximum 200 words - be specific and heartfelt',
      },
    ],
  },
  {
    id: 'nominator',
    label: 'Your Information',
    description: 'Tell us about yourself',
    icon: 'Users',
    fields: [
      {
        id: 'nominatorName',
        type: 'text',
        label: 'Your Name',
        placeholder: 'Enter your full name',
        required: true,
      },
      {
        id: 'relationship',
        type: 'select',
        label: 'Relationship to Nominee',
        placeholder: 'Select your relationship',
        required: true,
        options: [
          { value: 'coach', label: 'Coach' },
          { value: 'teammate', label: 'Teammate' },
          { value: 'parent', label: 'Parent/Guardian' },
          { value: 'fan', label: 'Fan' },
          { value: 'league_official', label: 'League Official' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'contact',
        type: 'text',
        label: 'Contact Email',
        placeholder: 'your.email@example.com',
        required: true,
        hint: 'We may reach out for verification',
      },
    ],
  },
];

// ============================================================================
// PREVIEW COMPONENT
// ============================================================================

const NominationPreview = ({ data }) => {
  const selectedAward = AWARD_CATEGORIES.find((a) => a.value === data.awardCategory);
  const positionLabels = {
    point_guard: 'PG',
    shooting_guard: 'SG',
    small_forward: 'SF',
    power_forward: 'PF',
    center: 'C',
  };

  const getAwardIcon = () => {
    switch (data.awardCategory) {
      case 'mvp':
        return <Crown className="w-6 h-6" />;
      case 'most_improved':
        return <TrendingUp className="w-6 h-6" />;
      case 'sportsmanship':
        return <Heart className="w-6 h-6" />;
      case 'rookie':
        return <Sparkles className="w-6 h-6" />;
      case 'leadership':
        return <Users className="w-6 h-6" />;
      case 'coaches_choice':
        return <Award className="w-6 h-6" />;
      default:
        return <Trophy className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Nomination Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-xl border-2"
        style={{
          borderColor: GOLD,
          background: 'linear-gradient(135deg, rgba(201, 169, 98, 0.1) 0%, rgba(15, 15, 15, 0.9) 50%, rgba(201, 169, 98, 0.05) 100%)',
        }}
      >
        {/* Gold accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />

        {/* Award Badge */}
        <div className="flex justify-center -mb-6 pt-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`,
                boxShadow: `0 0 30px rgba(201, 169, 98, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)`,
              }}
            >
              <div className="text-black">{getAwardIcon()}</div>
            </div>
            {selectedAward && (
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
                style={{
                  backgroundColor: 'rgba(201, 169, 98, 0.2)',
                  color: GOLD,
                  border: `1px solid ${GOLD}`,
                }}
              >
                {selectedAward.label}
              </div>
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5 pt-10 text-center space-y-3">
          {/* Player Name */}
          <h3
            className="text-xl font-bold tracking-wide"
            style={{
              color: data.playerName ? 'white' : 'rgba(255,255,255,0.3)',
              fontFamily: "'Georgia', serif",
            }}
          >
            {data.playerName || 'Player Name'}
          </h3>

          {/* Team & Position */}
          <div className="flex items-center justify-center gap-3 text-sm">
            {data.team && (
              <span className="text-white/60">{data.team}</span>
            )}
            {data.team && data.position && (
              <span className="text-white/30">|</span>
            )}
            {data.position && (
              <span
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(201, 169, 98, 0.15)',
                  color: GOLD,
                }}
              >
                {positionLabels[data.position] || data.position}
              </span>
            )}
          </div>

          {/* Stats */}
          {data.statsHighlights && (
            <div
              className="mt-3 p-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <Star className="w-4 h-4 inline-block mr-2" style={{ color: GOLD }} />
              <span className="text-white/70">{data.statsHighlights}</span>
            </div>
          )}

          {/* Testimonial Preview */}
          {data.whyDeserving && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <p
                className="text-sm italic text-white/50 line-clamp-3"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                "{data.whyDeserving.slice(0, 150)}
                {data.whyDeserving.length > 150 ? '...' : ''}"
              </p>
            </div>
          )}

          {/* Nominated By */}
          {data.nominatorName && (
            <div className="mt-3 text-xs text-white/40">
              Nominated by {data.nominatorName}
              {data.relationship && ` (${data.relationship.replace('_', ' ')})`}
            </div>
          )}
        </div>

        {/* Bottom accent */}
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />
      </motion.div>

      {/* Completion Status */}
      <div className="text-center text-xs text-white/40 pt-2">
        <span
          className="inline-flex items-center gap-1"
          style={{ color: GOLD }}
        >
          <Award className="w-3 h-3" />
          Award Nomination Preview
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AwardNomination() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  // Auto-save to localStorage
  const handleSave = async (data) => {
    localStorage.setItem('awardNomination_draft', JSON.stringify(data));
    return Promise.resolve();
  };

  // Load saved draft
  const loadDraft = () => {
    try {
      const saved = localStorage.getItem('awardNomination_draft');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const nominationData = {
        type: data.awardCategory,
        recipient_name: data.playerName,
        team_name: data.team,
        position: data.position,
        stats_snapshot: {
          highlights: data.statsHighlights,
          keyMoments: data.keyMoments,
        },
        reason: data.whyDeserving,
        nominator_name: data.nominatorName,
        nominator_relationship: data.relationship,
        nominator_contact: data.contact,
        status: 'pending',
        votes: [],
      };
      return base44.entities.Award.create(nominationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      localStorage.removeItem('awardNomination_draft');
      toast.success('Nomination submitted successfully!', {
        description: 'Thank you for recognizing excellence in our community.',
      });
    },
    onError: (error) => {
      toast.error('Failed to submit nomination', {
        description: error.message || 'Please try again later.',
      });
    },
  });

  const handleSubmit = (data) => {
    submitMutation.mutate(data);
  };

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0f0f0f' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Trophy className="w-8 h-8" style={{ color: GOLD }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#0f0f0f' }}
    >
      {/* Decorative Header */}
      <div
        className="relative overflow-hidden py-8"
        style={{
          background: 'linear-gradient(180deg, rgba(201, 169, 98, 0.08) 0%, transparent 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, ${GOLD} 0%, transparent 50%)`,
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                boxShadow: `0 0 20px rgba(201, 169, 98, 0.4)`,
              }}
            >
              <Trophy className="w-6 h-6 text-black" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Award Nomination
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50"
          >
            Recognize outstanding players in our community
          </motion.p>
        </div>
      </div>

      {/* Form */}
      <FormBuilder
        title=""
        subtitle=""
        sections={formSections}
        initialData={loadDraft()}
        onSubmit={handleSubmit}
        onSave={handleSave}
        showPreview={true}
        previewComponent={NominationPreview}
        submitLabel="Submit Nomination"
        skipLabel="Skip for now"
        defaultMode="wizard"
      />
    </div>
  );
}
