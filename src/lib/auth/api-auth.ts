import { verifyToken } from './jwt';
import { prisma } from '@/infrastructure/database';
import type { TokenPayload } from './types';

export interface AuthResult {
  /** JWT payload from ENUW Auth */
  token: TokenPayload;
  /** Local user ID (cuid) from the ballinthe6 users table */
  userId: string;
}

/**
 * Extract and verify the authenticated user from an API request.
 * Reads the x-user-token header injected by middleware.ts.
 * Returns null if no token or invalid token — never throws.
 */
export async function getAuthUser(request: Request): Promise<TokenPayload | null> {
  const token = request.headers.get('x-user-token');
  if (!token) return null;

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Require auth — returns the local user ID + token payload, or a 401 Response.
 * Resolves the ENUW Auth ID (JWT sub) to the local users table ID.
 */
export async function requireAuth(
  request: Request,
): Promise<{ user: AuthResult } | { error: Response }> {
  const token = await getAuthUser(request);
  if (!token) {
    return {
      error: Response.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 },
      ),
    };
  }

  // Resolve local user
  try {
    const localUser = await prisma.user.findUnique({
      where: { authId: token.sub },
      select: { id: true },
    });

    if (!localUser) {
      // Auto-create local user on first authenticated request
      const created = await prisma.user.create({
        data: {
          authId: token.sub,
          email: token.email,
          name: token.email.split('@')[0],
          ageBracket: token.age_bracket || 'adult',
        },
        select: { id: true },
      });
      return { user: { token, userId: created.id } };
    }

    return { user: { token, userId: localUser.id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      error: Response.json(
        { error: 'USER_RESOLUTION_FAILED', message: `Failed to resolve user: ${message}` },
        { status: 500 },
      ),
    };
  }
}
