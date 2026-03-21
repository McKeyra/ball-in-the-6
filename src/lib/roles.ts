export const ROLES = {
  OWNER: 'owner',
  ORG_ADMIN: 'org_admin',
  ADMIN: 'admin',
  COMMISSIONER: 'commissioner',
  LEAGUE_ADMIN: 'league_admin',
  TEAM_ADMIN: 'team_admin',
  TEAM_MANAGER: 'team_manager',
  COACH: 'coach',
  PARENT: 'parent',
  ATHLETE: 'athlete',
  PLAYER: 'player',
  TRAINER: 'trainer',
  RECRUITER: 'recruiter',
  FAN: 'fan',
  GM: 'gm',
  SENIOR: 'senior',
  FAMILY: 'family',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.OWNER]: 'Owner',
  [ROLES.ORG_ADMIN]: 'Organization Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.COMMISSIONER]: 'Commissioner',
  [ROLES.LEAGUE_ADMIN]: 'League Admin',
  [ROLES.TEAM_ADMIN]: 'Team Admin',
  [ROLES.TEAM_MANAGER]: 'Team Manager',
  [ROLES.COACH]: 'Coach',
  [ROLES.PARENT]: 'Parent',
  [ROLES.ATHLETE]: 'Athlete',
  [ROLES.PLAYER]: 'Player',
  [ROLES.TRAINER]: 'Trainer',
  [ROLES.RECRUITER]: 'Recruiter',
  [ROLES.FAN]: 'Fan',
  [ROLES.GM]: 'General Manager',
  [ROLES.SENIOR]: 'Senior',
  [ROLES.FAMILY]: 'Family Member',
};

export const ROLE_DASHBOARDS: Record<Role, string> = {
  [ROLES.OWNER]: '/admin',
  [ROLES.ORG_ADMIN]: '/admin',
  [ROLES.ADMIN]: '/admin',
  [ROLES.COMMISSIONER]: '/admin',
  [ROLES.LEAGUE_ADMIN]: '/admin',
  [ROLES.TEAM_ADMIN]: '/admin',
  [ROLES.TEAM_MANAGER]: '/admin',
  [ROLES.COACH]: '/admin',
  [ROLES.PARENT]: '/parent',
  [ROLES.ATHLETE]: '/athlete',
  [ROLES.PLAYER]: '/athlete',
  [ROLES.TRAINER]: '/training/trainer',
  [ROLES.RECRUITER]: '/recruit/recruiter',
  [ROLES.FAN]: '/fan',
  [ROLES.GM]: '/gm',
  [ROLES.SENIOR]: '/vtf/senior',
  [ROLES.FAMILY]: '/vtf/family',
};

export type ModuleName =
  | 'command-center'
  | 'parent-hub'
  | 'training-marketplace'
  | 'recruiting'
  | 'athlete'
  | 'fan'
  | 'gm-universe'
  | 'vance'
  | 'vet-them-first';

export const ROLE_MODULES: Record<Role, ModuleName[]> = {
  [ROLES.OWNER]: ['command-center', 'parent-hub', 'training-marketplace', 'recruiting', 'athlete', 'fan', 'gm-universe', 'vance', 'vet-them-first'],
  [ROLES.ORG_ADMIN]: ['command-center', 'training-marketplace', 'recruiting', 'fan', 'vance'],
  [ROLES.ADMIN]: ['command-center', 'training-marketplace', 'recruiting', 'fan', 'vance'],
  [ROLES.COMMISSIONER]: ['command-center', 'fan'],
  [ROLES.LEAGUE_ADMIN]: ['command-center', 'fan'],
  [ROLES.TEAM_ADMIN]: ['command-center', 'fan'],
  [ROLES.TEAM_MANAGER]: ['command-center', 'fan'],
  [ROLES.COACH]: ['command-center', 'training-marketplace', 'fan'],
  [ROLES.PARENT]: ['parent-hub', 'training-marketplace', 'fan'],
  [ROLES.ATHLETE]: ['athlete', 'training-marketplace', 'recruiting', 'fan', 'gm-universe'],
  [ROLES.PLAYER]: ['athlete', 'training-marketplace', 'recruiting', 'fan', 'gm-universe'],
  [ROLES.TRAINER]: ['training-marketplace', 'fan'],
  [ROLES.RECRUITER]: ['recruiting', 'fan', 'vance'],
  [ROLES.FAN]: ['fan', 'gm-universe'],
  [ROLES.GM]: ['gm-universe', 'fan'],
  [ROLES.SENIOR]: ['vet-them-first'],
  [ROLES.FAMILY]: ['vet-them-first'],
};

export const ADMIN_ROLES: Role[] = [
  ROLES.OWNER,
  ROLES.ORG_ADMIN,
  ROLES.ADMIN,
  ROLES.COMMISSIONER,
  ROLES.LEAGUE_ADMIN,
  ROLES.TEAM_ADMIN,
  ROLES.TEAM_MANAGER,
  ROLES.COACH,
];
