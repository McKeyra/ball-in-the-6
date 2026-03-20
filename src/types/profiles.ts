export type ProfileType = 'fan' | 'player' | 'team' | 'coach' | 'organization' | 'business';

export interface ProfileTokens {
  gradient: string;
  accent: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  badgeLabel: string;
  badgeIcon: string;
  avatarGlow: string;
}

export interface ProfileLink {
  platform: string;
  url: string;
  label: string;
}

export interface BaseProfile {
  id: string;
  type: ProfileType;
  displayName: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  joinedDate: string;
  verified: boolean;
  followers: number;
  following: number;
  tokens: ProfileTokens;
  links: ProfileLink[];
}

export interface FanProfile extends BaseProfile {
  type: 'fan';
  stats: {
    gamesAttended: number;
    impactScore: number;
    assistsGiven: number;
    favoriteTeam: string;
    streak: number;
  };
}

export interface PlayerProfile extends BaseProfile {
  type: 'player';
  stats: {
    ppg: number;
    apg: number;
    rpg: number;
    impactScore: number;
    gamesPlayed: number;
    rank: number;
    streak: number;
  };
  position: string;
  jerseyNumber: number;
  team: string;
  height: string;
  experience: string;
}

export interface TeamProfile extends BaseProfile {
  type: 'team';
  stats: {
    wins: number;
    losses: number;
    impactScore: number;
    rosterSize: number;
    championships: number;
  };
  league: string;
  division: string;
  homeCourt: string;
  roster: { name: string; number: number; position: string; avatar: string }[];
}

export interface CoachProfile extends BaseProfile {
  type: 'coach';
  stats: {
    wins: number;
    losses: number;
    playersCoached: number;
    programsRun: number;
    yearsExperience: number;
    rating: number;
  };
  certifications: string[];
  currentTeam: string;
  specialty: string;
}

export interface OrganizationProfile extends BaseProfile {
  type: 'organization';
  stats: {
    activePrograms: number;
    totalPlayers: number;
    teamsManaged: number;
    revenue: number;
    eventsHosted: number;
  };
  entityType: 'organization' | 'league' | 'club';
  programs: { name: string; type: string; participants: number }[];
}

export interface BusinessProfile extends BaseProfile {
  type: 'business';
  stats: {
    sponsorships: number;
    eventsSponsored: number;
    communityReach: number;
    rating: number;
  };
  category: string;
  address: string;
  hours: string;
  offerings: string[];
}

export type AnyProfile = FanProfile | PlayerProfile | TeamProfile | CoachProfile | OrganizationProfile | BusinessProfile;

export const PROFILE_TOKEN_PRESETS: Record<ProfileType, ProfileTokens> = {
  fan: {
    gradient: 'from-blue-600 to-cyan-500',
    accent: 'blue',
    accentText: 'text-blue-400',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/20',
    badgeLabel: 'Fan',
    badgeIcon: 'heart',
    avatarGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]',
  },
  player: {
    gradient: 'from-purple-600 to-blue-500',
    accent: 'purple',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/20',
    badgeLabel: 'Player',
    badgeIcon: 'zap',
    avatarGlow: 'shadow-[0_0_30px_rgba(147,51,234,0.4)]',
  },
  team: {
    gradient: 'from-orange-500 to-red-500',
    accent: 'orange',
    accentText: 'text-orange-400',
    accentBg: 'bg-orange-500/10',
    accentBorder: 'border-orange-500/20',
    badgeLabel: 'Team',
    badgeIcon: 'users',
    avatarGlow: 'shadow-[0_0_30px_rgba(249,115,22,0.4)]',
  },
  coach: {
    gradient: 'from-emerald-500 to-cyan-400',
    accent: 'emerald',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/20',
    badgeLabel: 'Coach',
    badgeIcon: 'clipboard',
    avatarGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
  },
  organization: {
    gradient: 'from-yellow-500 to-orange-500',
    accent: 'yellow',
    accentText: 'text-yellow-400',
    accentBg: 'bg-yellow-500/10',
    accentBorder: 'border-yellow-500/20',
    badgeLabel: 'Organization',
    badgeIcon: 'building-2',
    avatarGlow: 'shadow-[0_0_30px_rgba(234,179,8,0.4)]',
  },
  business: {
    gradient: 'from-pink-500 to-purple-500',
    accent: 'pink',
    accentText: 'text-pink-400',
    accentBg: 'bg-pink-500/10',
    accentBorder: 'border-pink-500/20',
    badgeLabel: 'Business',
    badgeIcon: 'store',
    avatarGlow: 'shadow-[0_0_30px_rgba(236,72,153,0.4)]',
  },
};
