// TODO: Replace base44 API calls with actual API client

interface UserProfile {
  email: string;
  role: string;
}

export async function getUserRole(email: string): Promise<UserProfile | null> {
  if (!email) return null;
  try {
    // TODO: Replace with actual API call
    const res = await fetch('/api/user-profiles');
    const profiles: UserProfile[] = await res.json();
    return profiles.find((p) => p.email === email) || { role: 'Fan', email };
  } catch (e) {
    console.error(e);
    return { role: 'Fan', email };
  }
}

const ROLE_LEVELS: Record<string, number> = {
  Fan: 1,
  Player: 2,
  Coach: 3,
  LeagueAdmin: 4,
  OrganizationAdmin: 5,
};

export function hasPermission(userRole: string, requiredRole: string): boolean {
  return (ROLE_LEVELS[userRole] || 0) >= (ROLE_LEVELS[requiredRole] || 99);
}
