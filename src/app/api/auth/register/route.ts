import { prisma } from '@/infrastructure/database';
import { sendWebhookSafe } from '@/infrastructure/n8n';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.226.wtf';
const AUTH_BRAND = 'b6';
const COOKIE_NAME = 'b6_access_token';
const REFRESH_COOKIE = 'b6_refresh_token';
const IS_PROD = process.env.NODE_ENV === 'production';

interface RegisterBody {
  email?: string;
  password?: string;
  name?: string;
  dateOfBirth?: string;
}

export async function POST(request: Request): Promise<Response> {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return Response.json(
      { error: 'BAD_REQUEST', message: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const { email, password, name, dateOfBirth } = body;
  if (!email || !password || !name) {
    return Response.json(
      { error: 'BAD_REQUEST', message: 'Email, password, and name are required' },
      { status: 400 },
    );
  }

  // Proxy to ENUW Auth
  const authRes = await fetch(`${AUTH_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      displayName: name,
      dateOfBirth,
      brand: AUTH_BRAND,
    }),
  });

  const authBody = await authRes.json();

  if (!authRes.ok) {
    return Response.json(authBody, { status: authRes.status });
  }

  const { accessToken, refreshToken } = authBody as {
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; ageBracket: string };
  };

  // Decode JWT to get auth ID, age bracket, and expiry
  const payloadB64 = accessToken.split('.')[1];
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as {
    sub: string;
    age_bracket: string;
    exp: number;
  };
  const expiresAt = payload.exp;

  // Create user in ballinthe6 database
  try {
    await prisma.user.create({
      data: {
        authId: payload.sub,
        email,
        name,
        ageBracket: payload.age_bracket || 'adult',
      },
    });
  } catch {
    // User may already exist if they registered via another path
  }

  // Fire n8n webhook
  void sendWebhookSafe('user.registered', {
    authId: payload.sub,
    email,
    name,
    brand: AUTH_BRAND,
    ageBracket: payload.age_bracket,
  });

  // Build response with httpOnly cookies
  const maxAge = expiresAt - Math.floor(Date.now() / 1000);
  const cookieOpts = `HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${IS_PROD ? '; Secure' : ''}`;
  const refreshMaxAge = 30 * 24 * 60 * 60;

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
    { status: 201, headers },
  );
}
