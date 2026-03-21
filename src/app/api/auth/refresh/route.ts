import { cookies } from 'next/headers';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.226.wtf';
const COOKIE_NAME = 'b6_access_token';
const REFRESH_COOKIE = 'b6_refresh_token';
const IS_PROD = process.env.NODE_ENV === 'production';

export async function POST(): Promise<Response> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return Response.json(
      { error: 'NO_REFRESH_TOKEN', message: 'No refresh token' },
      { status: 401 },
    );
  }

  // Proxy refresh to ENUW Auth
  const authRes = await fetch(`${AUTH_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const authBody = await authRes.json();

  if (!authRes.ok) {
    // Clear cookies on refresh failure
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append(
      'Set-Cookie',
      `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
    );
    headers.append(
      'Set-Cookie',
      `${REFRESH_COOKIE}=; HttpOnly; Path=/api/auth; SameSite=Lax; Max-Age=0`,
    );
    return new Response(JSON.stringify(authBody), {
      status: authRes.status,
      headers,
    });
  }

  const { accessToken, refreshToken: newRefreshToken } = authBody as {
    accessToken: string;
    refreshToken: string;
  };

  // Decode expiry from JWT
  const payloadB64 = accessToken.split('.')[1];
  const jwtPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as { exp: number };
  const expiresAt = jwtPayload.exp;

  const maxAge = expiresAt - Math.floor(Date.now() / 1000);
  const cookieOpts = `HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${IS_PROD ? '; Secure' : ''}`;
  const refreshMaxAge = 30 * 24 * 60 * 60;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Set-Cookie', `${COOKIE_NAME}=${accessToken}; ${cookieOpts}`);
  headers.append(
    'Set-Cookie',
    `${REFRESH_COOKIE}=${newRefreshToken}; HttpOnly; Path=/api/auth; SameSite=Lax; Max-Age=${refreshMaxAge}${IS_PROD ? '; Secure' : ''}`,
  );

  return new Response(
    JSON.stringify({ accessToken, refreshToken: newRefreshToken, expiresAt }),
    { status: 200, headers },
  );
}
