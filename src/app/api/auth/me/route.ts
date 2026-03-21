import { cookies } from 'next/headers';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.226.wtf';
const COOKIE_NAME = 'b6_access_token';

export async function GET(): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAME)?.value;

  if (!accessToken) {
    return Response.json(
      { error: 'UNAUTHORIZED', message: 'Not authenticated' },
      { status: 401 },
    );
  }

  const authRes = await fetch(`${AUTH_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const authBody = await authRes.json();

  if (!authRes.ok) {
    return Response.json(authBody, { status: authRes.status });
  }

  // Map ENUW Auth response to B6 AuthUser shape
  const raw = authBody as {
    id: string;
    email: string;
    displayName?: string;
    ageBracket: string;
    mfaEnabled?: boolean;
    idvStatus?: string;
    brands?: string[];
  };

  return Response.json({
    id: raw.id,
    email: raw.email,
    brands: raw.brands ?? ['b6'],
    ageBracket: raw.ageBracket,
    mfaVerified: raw.mfaEnabled ?? false,
    idvVerified: raw.idvStatus === 'verified',
    profile: {
      name: raw.displayName,
    },
  });
}
