const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.226.wtf';
const COOKIE_NAME = 'b6_access_token';
const REFRESH_COOKIE = 'b6_refresh_token';

export async function POST(): Promise<Response> {
  // Best-effort logout on ENUW Auth
  try {
    await fetch(`${AUTH_BASE_URL}/auth/logout`, {
      method: 'POST',
    });
  } catch {
    // Non-critical
  }

  // Clear both cookies
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

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers,
  });
}
