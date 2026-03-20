import { verifyToken } from './jwt';
import type { TokenPayload } from './types';

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
 * Require auth — returns the user or a 401 Response.
 */
export async function requireAuth(
  request: Request,
): Promise<{ user: TokenPayload } | { error: Response }> {
  const user = await getAuthUser(request);
  if (!user) {
    return {
      error: Response.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 },
      ),
    };
  }
  return { user };
}
