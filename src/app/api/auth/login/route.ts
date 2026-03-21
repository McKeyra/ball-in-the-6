import { prisma } from '@/infrastructure/database';
import { sendWebhookSafe } from '@/infrastructure/n8n';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.226.wtf';
const AUTH_BRAND = 'b6';
const COOKIE_NAME = 'b6_access_token';
const REFRESH_COOKIE = 'b6_refresh_token';
const IS_PROD = process.env.NODE_ENV === 'production';

export async function POST(request: Request): Promise<Response> {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return Response.json(
      { error: 'BAD_REQUEST', message: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const { email, password } = body;
  if (!email || !password) {
    return Response.json(
      { error: 'BAD_REQUEST', message: 'Email and password are required' },
      { status: 400 },
    );
  }

  // Proxy to ENUW Auth
  const authRes = await fetch(`${AUTH_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, brand: AUTH_BRAND }),
  });

  const authBody = await authRes.json();

  if (!authRes.ok) {
    return Response.json(authBody, { status: authRes.status });
  }

  const { accessToken, refreshToken } = authBody as {
    accessToken: string;
    refreshToken: string;
  };

  // Decode JWT payload to get sub, age_bracket, and expiry
  const payloadB64 = accessToken.split('.')[1];
  const jwtPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as {
    sub: string;
    age_bracket: string;
    exp: number;
  };
  const expiresAt = jwtPayload.exp;

  // Sync user to ballinthe6 database
  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (!existing) {

      await prisma.user.create({
        data: {
          authId: jwtPayload.sub,
          email,
          name: email.split('@')[0],
          ageBracket: jwtPayload.age_bracket || 'adult',
        },
      });

      void sendWebhookSafe('user.registered', {
        authId: jwtPayload.sub,
        email,
        brand: AUTH_BRAND,
        source: 'login_sync',
      });
    }
  } catch {
    // User sync failure shouldn't block login
  }

  // Build response with httpOnly cookies
  const maxAge = expiresAt - Math.floor(Date.now() / 1000);
  const cookieOpts = `HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${IS_PROD ? '; Secure' : ''}`;
  const refreshMaxAge = 30 * 24 * 60 * 60; // 30 days

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Set-Cookie', `${COOKIE_NAME}=${accessToken}; ${cookieOpts}`);
  headers.append(
    'Set-Cookie',
    `${REFRESH_COOKIE}=${refreshToken}; HttpOnly; Path=/api/auth; SameSite=Lax; Max-Age=${refreshMaxAge}${IS_PROD ? '; Secure' : ''}`,
  );

  return new Response(
    JSON.stringify({
      accessToken,
      refreshToken,
      expiresAt,
    }),
    { status: 200, headers },
  );
}
