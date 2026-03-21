'use client';

import Link from 'next/link';
import {
  UserPlus, Briefcase, ClipboardList, MessageSquare,
  Settings, ShieldCheck, Trophy, ChevronRight,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface FormLink {
  href: string;
  label: string;
  description: string;
}

interface FormCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  forms: FormLink[];
}

// ============================================================================
// FORM CATEGORIES
// ============================================================================

const CATEGORIES: FormCategory[] = [
  {
    id: 'registration',
    label: 'Registration',
    icon: <UserPlus className="w-5 h-5" />,
    color: 'bg-[#c8ff00]/20 text-[#3d6b00]',
    forms: [
      { href: '/forms/player-registration', label: 'Player Registration', description: 'Register a player for the upcoming season' },
      { href: '/forms/coach-registration', label: 'Coach Registration', description: 'Apply to coach in the basketball program' },
      { href: '/forms/referee-registration', label: 'Referee Registration', description: 'Sign up to officiate basketball games' },
      { href: '/forms/volunteer-registration', label: 'Volunteer Registration', description: 'Join as a volunteer in the organization' },
      { href: '/forms/tryout-registration', label: 'Tryout Registration', description: 'Register for competitive rep team tryouts' },
      { href: '/forms/program-signup', label: 'Program Signup', description: 'Sign up for camps, clinics, and programs' },
    ],
  },
  {
    id: 'applications',
    label: 'Applications',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'bg-accent-purple/10 text-accent-purple',
    forms: [
      { href: '/forms/sponsor-application', label: 'Sponsor Application', description: 'Apply to become a league sponsor' },
      { href: '/forms/league-application', label: 'League Application', description: 'Apply for a new team to join the league' },
      { href: '/forms/facility-partner', label: 'Facility Partner', description: 'Partner your facility with the organization' },
      { href: '/forms/vendor-application', label: 'Vendor Application', description: 'Apply to become an approved vendor' },
    ],
  },
  {
    id: 'operational',
    label: 'Operational',
    icon: <ClipboardList className="w-5 h-5" />,
    color: 'bg-accent-blue/10 text-accent-blue',
    forms: [
      { href: '/forms/game-report', label: 'Game Report', description: 'Submit post-game reports and scores' },
      { href: '/forms/incident-report', label: 'Incident Report', description: 'Report incidents, injuries, or issues' },
      { href: '/forms/transfer-request', label: 'Transfer Request', description: 'Request a player or team transfer' },
      { href: '/forms/schedule-request', label: 'Schedule Request', description: 'Request schedule changes or accommodations' },
      { href: '/forms/equipment-request', label: 'Equipment Request', description: 'Request equipment or supplies' },
      { href: '/forms/facility-booking', label: 'Facility Booking', description: 'Book a facility for games or practices' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'bg-accent-emerald/10 text-accent-emerald',
    forms: [
      { href: '/forms/season-survey', label: 'Season Survey', description: 'Share feedback about the season' },
      { href: '/forms/coach-evaluation', label: 'Coach Evaluation', description: 'Evaluate a coach\'s performance' },
      { href: '/forms/event-feedback', label: 'Event Feedback', description: 'Provide feedback on events and tournaments' },
      { href: '/forms/nps-survey', label: 'NPS Survey', description: 'Rate your overall experience' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-accent-orange/10 text-accent-orange',
    forms: [
      { href: '/forms/parent-profile-setup', label: 'Parent Profile Setup', description: 'Set up your parent or guardian profile' },
      { href: '/forms/team-settings', label: 'Team Settings', description: 'Configure team identity and preferences' },
      { href: '/forms/league-settings', label: 'League Settings', description: 'Manage league rules and structure' },
      { href: '/forms/organization-setup', label: 'Organization Setup', description: 'Set up your organization profile' },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: <ShieldCheck className="w-5 h-5" />,
    color: 'bg-accent-red/10 text-accent-red',
    forms: [
      { href: '/forms/waiver-consent', label: 'Waiver & Consent', description: 'Sign required waivers and consent forms' },
      { href: '/forms/medical-form', label: 'Medical Form', description: 'Submit medical information and clearance' },
      { href: '/forms/code-of-conduct', label: 'Code of Conduct', description: 'Acknowledge the code of conduct' },
      { href: '/forms/background-check', label: 'Background Check', description: 'Submit background check authorization' },
    ],
  },
  {
    id: 'recognition',
    label: 'Recognition',
    icon: <Trophy className="w-5 h-5" />,
    color: 'bg-accent-yellow/10 text-accent-yellow',
    forms: [
      { href: '/forms/award-nomination', label: 'Award Nomination', description: 'Nominate someone for an award' },
      { href: '/forms/hall-of-fame', label: 'Hall of Fame', description: 'Nominate for the Hall of Fame' },
    ],
  },
];

const TOTAL_FORMS = CATEGORIES.reduce((sum, cat) => sum + cat.forms.length, 0);

// ============================================================================
// COMPONENT
// ============================================================================

export function FormsIndexPage(): React.ReactElement {
  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Forms
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {TOTAL_FORMS} forms across {CATEGORIES.length} categories
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {CATEGORIES.map((category) => (
          <section key={category.id}>
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${category.color}`}>
                {category.icon}
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {category.label}
                </h2>
                <p className="text-xs text-neutral-400">
                  {category.forms.length} form{category.forms.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Form Cards */}
            <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden divide-y divide-neutral-100">
              {category.forms.map((form) => (
                <Link
                  key={form.href}
                  href={form.href}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-neutral-50/80 transition-colors group"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#3d6b00] transition-colors">
                      {form.label}
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5 truncate">
                      {form.description}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-[#3d6b00] flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
