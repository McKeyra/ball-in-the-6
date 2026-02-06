import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  Crown,
  Star,
  Users,
  Award,
  Trophy,
  Heart,
  BookOpen,
  Upload,
  User,
  UserPlus,
  Landmark,
  Camera,
} from 'lucide-react';
import FormBuilder from '@/components/forms/FormBuilder';

// ============================================================================
// THEME CONSTANTS
// ============================================================================

const GOLD = '#c9a962';
const GOLD_LIGHT = '#d4b872';
const GOLD_DARK = '#a88b4a';

// ============================================================================
// ROLE OPTIONS
// ============================================================================

const ROLE_OPTIONS = [
  { value: 'player', label: 'Player' },
  { value: 'coach', label: 'Coach' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'contributor', label: 'Contributor' },
];

// ============================================================================
// FORM CONFIGURATION
// ============================================================================

const formSections = [
  {
    id: 'nominee',
    label: 'Nominee Information',
    description: 'Tell us about the person being nominated for the Hall of Fame',
    icon: 'User',
    fields: [
      {
        id: 'nomineeName',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter the full name of the nominee',
        required: true,
      },
      {
        id: 'yearsActive',
        type: 'text',
        label: 'Years Active',
        placeholder: 'e.g., 1995-2010',
        required: true,
        hint: 'The period they were actively involved',
      },
      {
        id: 'roles',
        type: 'pills',
        label: 'Roles',
        required: true,
        options: ROLE_OPTIONS,
        hint: 'Select all roles that apply',
      },
    ],
  },
  {
    id: 'career',
    label: 'Career Highlights',
    description: 'Document their achievements and contributions',
    icon: 'Trophy',
    fields: [
      {
        id: 'teams',
        type: 'text',
        label: 'Teams / Organizations',
        placeholder: 'e.g., Toronto Raptors Youth, Scarborough Warriors',
        hint: 'List all teams or organizations they were part of',
      },
      {
        id: 'achievements',
        type: 'textarea',
        label: 'Major Achievements',
        placeholder: 'Championships won, MVP awards, coaching milestones...',
        rows: 4,
        required: true,
        hint: 'List their most significant accomplishments',
      },
      {
        id: 'recordsHeld',
        type: 'textarea',
        label: 'Records Held',
        placeholder: 'Any records or firsts they achieved...',
        rows: 3,
        hint: 'Include any league records, firsts, or notable statistics',
      },
    ],
  },
  {
    id: 'impact',
    label: 'Legacy & Impact',
    description: 'Share their lasting contribution to the community',
    icon: 'Heart',
    fields: [
      {
        id: 'communityContribution',
        type: 'textarea',
        label: 'Community Contribution',
        placeholder: 'How have they given back to the basketball community...',
        rows: 4,
        hint: 'Volunteer work, fundraising, community programs, etc.',
      },
      {
        id: 'mentorship',
        type: 'textarea',
        label: 'Mentorship',
        placeholder: 'Players they have mentored, coaching impact, guidance provided...',
        rows: 4,
        hint: 'Describe how they have helped develop others',
      },
      {
        id: 'legacy',
        type: 'textarea',
        label: 'Lasting Legacy',
        placeholder: 'What lasting impact have they made on the sport and community...',
        rows: 5,
        required: true,
        hint: 'The mark they have left that will endure',
      },
    ],
  },
  {
    id: 'supporting',
    label: 'Supporting Materials',
    description: 'Upload photos and documents to support the nomination',
    icon: 'Upload',
    fields: [
      {
        id: 'photos',
        type: 'upload',
        label: 'Photos',
        multiple: true,
        accept: 'image/*',
        hint: 'Upload photos of the nominee (action shots, ceremonies, etc.)',
      },
      {
        id: 'documents',
        type: 'upload',
        label: 'Supporting Documents',
        multiple: true,
        accept: '.pdf,.doc,.docx',
        hint: 'News articles, certificates, letters of recommendation',
      },
    ],
  },
  {
    id: 'nominators',
    label: 'Nominators',
    description: 'Primary nominator and supporting endorsements',
    icon: 'Users',
    fields: [
      {
        id: 'primaryNominatorName',
        type: 'text',
        label: 'Primary Nominator Name',
        placeholder: 'Your full name',
        required: true,
      },
      {
        id: 'primaryNominatorEmail',
        type: 'text',
        label: 'Primary Nominator Email',
        placeholder: 'your.email@example.com',
        required: true,
      },
      {
        id: 'primaryNominatorPhone',
        type: 'text',
        label: 'Primary Nominator Phone',
        placeholder: '(416) 555-0123',
      },
      {
        id: 'supporter1Name',
        type: 'text',
        label: 'First Supporter Name',
        placeholder: 'Full name of first supporter',
        required: true,
        hint: 'Someone who can vouch for this nomination',
      },
      {
        id: 'supporter1Email',
        type: 'text',
        label: 'First Supporter Email',
        placeholder: 'supporter1@example.com',
        required: true,
      },
      {
        id: 'supporter2Name',
        type: 'text',
        label: 'Second Supporter Name',
        placeholder: 'Full name of second supporter',
        required: true,
        hint: 'Another person who endorses this nomination',
      },
      {
        id: 'supporter2Email',
        type: 'text',
        label: 'Second Supporter Email',
        placeholder: 'supporter2@example.com',
        required: true,
      },
    ],
  },
];

// ============================================================================
// PREVIEW COMPONENT - HALL OF FAME PLAQUE STYLE
// ============================================================================

const HallOfFamePreview = ({ data }) => {
  const roles = Array.isArray(data.roles) ? data.roles : [];
  const roleLabels = roles
    .map((r) => ROLE_OPTIONS.find((o) => o.value === r)?.label || r)
    .join(' | ');

  return (
    <div className="space-y-4">
      {/* Hall of Fame Plaque */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Outer frame - ornate border */}
        <div
          className="rounded-xl p-1"
          style={{
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 25%, ${GOLD_LIGHT} 50%, ${GOLD_DARK} 75%, ${GOLD} 100%)`,
            boxShadow: `0 0 30px rgba(201, 169, 98, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)`,
          }}
        >
          {/* Inner plaque */}
          <div
            className="rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
            }}
          >
            {/* Top decorative element */}
            <div className="flex justify-center py-3">
              <div
                className="flex items-center gap-2 px-4 py-1"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.2), transparent)`,
                }}
              >
                <div
                  className="w-8 h-0.5"
                  style={{ backgroundColor: GOLD }}
                />
                <Landmark className="w-5 h-5" style={{ color: GOLD }} />
                <div
                  className="w-8 h-0.5"
                  style={{ backgroundColor: GOLD }}
                />
              </div>
            </div>

            {/* Header */}
            <div className="text-center px-4">
              <h4
                className="text-xs tracking-[0.3em] uppercase mb-1"
                style={{ color: GOLD }}
              >
                Hall of Fame
              </h4>
              <div
                className="w-16 h-0.5 mx-auto"
                style={{
                  background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                }}
              />
            </div>

            {/* Photo placeholder */}
            <div className="flex justify-center py-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(201, 169, 98, 0.2) 0%, rgba(201, 169, 98, 0.05) 100%)',
                  border: `3px solid ${GOLD}`,
                  boxShadow: `0 0 20px rgba(201, 169, 98, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)`,
                }}
              >
                {data.photos && data.photos.length > 0 ? (
                  <img
                    src={URL.createObjectURL(data.photos[0])}
                    alt="Nominee"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-white/20" />
                )}
              </div>
            </div>

            {/* Name */}
            <div className="text-center px-4">
              <h3
                className="text-lg font-bold tracking-wide"
                style={{
                  color: data.nomineeName ? 'white' : 'rgba(255,255,255,0.3)',
                  fontFamily: "'Georgia', serif",
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {data.nomineeName || 'Nominee Name'}
              </h3>

              {/* Years Active */}
              {data.yearsActive && (
                <p
                  className="text-sm mt-1"
                  style={{ color: GOLD }}
                >
                  {data.yearsActive}
                </p>
              )}
            </div>

            {/* Roles */}
            {roles.length > 0 && (
              <div className="flex justify-center gap-2 px-4 py-3">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(201, 169, 98, 0.15)',
                      color: GOLD,
                      border: `1px solid rgba(201, 169, 98, 0.3)`,
                    }}
                  >
                    {ROLE_OPTIONS.find((o) => o.value === role)?.label || role}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="px-6">
              <div
                className="h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                }}
              />
            </div>

            {/* Achievements preview */}
            {data.achievements && (
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-3 h-3" style={{ color: GOLD }} />
                  <span
                    className="text-xs uppercase tracking-wider"
                    style={{ color: GOLD }}
                  >
                    Achievements
                  </span>
                </div>
                <p
                  className="text-xs text-white/50 line-clamp-2"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {data.achievements}
                </p>
              </div>
            )}

            {/* Legacy preview */}
            {data.legacy && (
              <div className="px-4 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-3 h-3" style={{ color: GOLD }} />
                  <span
                    className="text-xs uppercase tracking-wider"
                    style={{ color: GOLD }}
                  >
                    Legacy
                  </span>
                </div>
                <p
                  className="text-xs text-white/50 italic line-clamp-2"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  "{data.legacy}"
                </p>
              </div>
            )}

            {/* Bottom decorative element */}
            <div className="flex justify-center pb-3">
              <div
                className="flex items-center gap-2"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.2), transparent)`,
                  padding: '4px 16px',
                }}
              >
                <Star className="w-3 h-3" style={{ color: GOLD }} />
                <Crown className="w-4 h-4" style={{ color: GOLD }} />
                <Star className="w-3 h-3" style={{ color: GOLD }} />
              </div>
            </div>

            {/* Nominated by */}
            {data.primaryNominatorName && (
              <div
                className="text-center py-2 text-xs"
                style={{
                  backgroundColor: 'rgba(201, 169, 98, 0.05)',
                  borderTop: `1px solid rgba(201, 169, 98, 0.1)`,
                }}
              >
                <span className="text-white/30">Nominated by </span>
                <span className="text-white/50">{data.primaryNominatorName}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Supporters indicator */}
      {(data.supporter1Name || data.supporter2Name) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-xs text-white/40"
        >
          <Users className="w-3 h-3" style={{ color: GOLD }} />
          <span>
            Supported by{' '}
            {[data.supporter1Name, data.supporter2Name]
              .filter(Boolean)
              .join(' & ')}
          </span>
        </motion.div>
      )}

      {/* Status */}
      <div className="text-center text-xs text-white/40 pt-2">
        <span
          className="inline-flex items-center gap-1"
          style={{ color: GOLD }}
        >
          <Landmark className="w-3 h-3" />
          Hall of Fame Nomination
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HallOfFame() {
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
    // Don't save file objects to localStorage
    const dataToSave = { ...data };
    delete dataToSave.photos;
    delete dataToSave.documents;
    localStorage.setItem('hallOfFame_draft', JSON.stringify(dataToSave));
    return Promise.resolve();
  };

  // Load saved draft
  const loadDraft = () => {
    try {
      const saved = localStorage.getItem('hallOfFame_draft');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      // In a real app, you would upload files first and get URLs
      const nominationData = {
        type: 'hall_of_fame',
        recipient_name: data.nomineeName,
        years_active: data.yearsActive,
        roles: data.roles,
        teams: data.teams,
        achievements: data.achievements,
        records_held: data.recordsHeld,
        community_contribution: data.communityContribution,
        mentorship: data.mentorship,
        legacy: data.legacy,
        primary_nominator: {
          name: data.primaryNominatorName,
          email: data.primaryNominatorEmail,
          phone: data.primaryNominatorPhone,
        },
        supporters: [
          { name: data.supporter1Name, email: data.supporter1Email },
          { name: data.supporter2Name, email: data.supporter2Email },
        ],
        status: 'pending_review',
        votes: [],
      };
      return base44.entities.Award.create(nominationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      localStorage.removeItem('hallOfFame_draft');
      toast.success('Hall of Fame nomination submitted!', {
        description: 'Your nomination will be reviewed by the selection committee.',
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
          <Crown className="w-8 h-8" style={{ color: GOLD }} />
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
        className="relative overflow-hidden py-10"
        style={{
          background: 'linear-gradient(180deg, rgba(201, 169, 98, 0.1) 0%, transparent 100%)',
        }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, ${GOLD} 0%, transparent 25%),
              radial-gradient(circle at 80% 50%, ${GOLD} 0%, transparent 25%),
              radial-gradient(circle at 50% 0%, ${GOLD} 0%, transparent 40%)
            `,
          }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          {/* Decorative top line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div
              className="w-24 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${GOLD})`,
              }}
            />
            <Landmark className="w-6 h-6" style={{ color: GOLD }} />
            <div
              className="w-24 h-px"
              style={{
                background: `linear-gradient(90deg, ${GOLD}, transparent)`,
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-3"
            style={{
              fontFamily: "'Georgia', serif",
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            }}
          >
            Hall of Fame
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg mb-2"
            style={{ color: GOLD }}
          >
            Legacy Nomination
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/50 max-w-lg mx-auto"
          >
            Honor those who have made an indelible mark on our basketball community
          </motion.p>

          {/* Decorative bottom elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <Star className="w-4 h-4" style={{ color: GOLD, opacity: 0.6 }} />
            <Crown className="w-5 h-5" style={{ color: GOLD }} />
            <Star className="w-4 h-4" style={{ color: GOLD, opacity: 0.6 }} />
          </motion.div>
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
        previewComponent={HallOfFamePreview}
        submitLabel="Submit Nomination"
        skipLabel="Skip for now"
        defaultMode="wizard"
      />
    </div>
  );
}
