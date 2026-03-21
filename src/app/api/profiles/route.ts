import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { paginated, success, error, badRequest, parsePageParams } from '@/lib/api-response';
import { sendWebhookSafe } from '@/infrastructure/n8n';
import type { ProfileType } from '@/types/profiles';

const VALID_PROFILE_TYPES = [
  'fan',
  'player',
  'team',
  'coach',
  'organization',
  'business',
] as const;

type ValidProfileType = (typeof VALID_PROFILE_TYPES)[number];

function isValidProfileType(value: string): value is ValidProfileType {
  return VALID_PROFILE_TYPES.includes(value as ValidProfileType);
}

/**
 * Attempt to load mock profiles from @/lib/profile-data.
 * Returns an empty array if the module is unavailable.
 */
async function loadFallbackProfiles(): Promise<unknown[]> {
  try {
    const mod = await import('@/lib/profile-data');
    return (mod.ALL_PROFILES as unknown[]) ?? [];
  } catch {
    return [];
  }
}

// ─── GET /api/profiles ──────────────────────────────────────────────────────
// Query params: type, search, page, limit
// Returns paginated profiles with their links.
// Falls back to mock data if the database is not connected.

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get('type');
  const search = searchParams.get('search')?.trim() ?? null;
  const { page, limit } = parsePageParams(searchParams);

  try {
    // ── Build Prisma where clause ──
    const where: Record<string, unknown> = {};

    if (typeParam) {
      if (!isValidProfileType(typeParam)) {
        return badRequest(
          `Invalid profile type "${typeParam}". Must be one of: ${VALID_PROFILE_TYPES.join(', ')}`,
        );
      }
      where.type = typeParam;
    }

    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' as const } },
        { handle: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        include: { links: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { joinedDate: 'desc' },
      }),
      prisma.profile.count({ where }),
    ]);

    return paginated(profiles, { page, limit, total, filter: typeParam ?? undefined });
  } catch {
    // ── Database not connected — fall back to mock data ──
    const allProfiles = await loadFallbackProfiles();

    let filtered = [...allProfiles] as Array<{
      type: string;
      displayName: string;
      handle: string;
      [key: string]: unknown;
    }>;

    if (typeParam) {
      if (!isValidProfileType(typeParam)) {
        return badRequest(
          `Invalid profile type "${typeParam}". Must be one of: ${VALID_PROFILE_TYPES.join(', ')}`,
        );
      }
      filtered = filtered.filter((p) => p.type === typeParam);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.displayName.toLowerCase().includes(lowerSearch) ||
          p.handle.toLowerCase().includes(lowerSearch),
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paged = filtered.slice(start, end);

    return paginated(paged, { page, limit, total, filter: typeParam ?? undefined });
  }
}

// ─── POST /api/profiles ─────────────────────────────────────────────────────
// Creates a new profile for the authenticated user.
// Body: { type, displayName, handle, bio?, location?, stats?, metadata? }
// Fires n8n webhook: user.profile_created

export async function POST(request: Request): Promise<Response> {
  // ── Auth check ──
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;
  const { user } = auth;

  // ── Parse & validate body ──
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return badRequest('Invalid JSON body');
  }

  const {
    type,
    displayName,
    handle,
    bio,
    location,
    stats,
    metadata,
  } = body as {
    type: unknown;
    displayName: unknown;
    handle: unknown;
    bio: unknown;
    location: unknown;
    stats: unknown;
    metadata: unknown;
  };

  // ── Required fields ──
  if (typeof type !== 'string' || !isValidProfileType(type)) {
    return badRequest(
      `"type" is required and must be one of: ${VALID_PROFILE_TYPES.join(', ')}`,
    );
  }

  if (typeof displayName !== 'string' || displayName.trim().length === 0) {
    return badRequest('"displayName" is required and must be a non-empty string');
  }

  if (typeof handle !== 'string' || handle.trim().length === 0) {
    return badRequest('"handle" is required and must be a non-empty string');
  }

  // ── Optional field validation ──
  if (bio !== undefined && typeof bio !== 'string') {
    return badRequest('"bio" must be a string');
  }

  if (location !== undefined && typeof location !== 'string') {
    return badRequest('"location" must be a string');
  }

  if (stats !== undefined && (typeof stats !== 'object' || stats === null)) {
    return badRequest('"stats" must be a JSON object');
  }

  if (metadata !== undefined && (typeof metadata !== 'object' || metadata === null)) {
    return badRequest('"metadata" must be a JSON object');
  }

  try {
    // ── Check for existing profile on this user ──
    const existing = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (existing) {
      return error('User already has a profile. Use PATCH to update.', 409, 'CONFLICT');
    }

    // ── Check handle uniqueness ──
    const handleTaken = await prisma.profile.findUnique({
      where: { handle: handle.trim() },
    });

    if (handleTaken) {
      return error(
        `Handle "${handle.trim()}" is already taken`,
        409,
        'HANDLE_TAKEN',
      );
    }

    // ── Create profile ──
    const profile = await prisma.profile.create({
      data: {
        userId: user.userId,
        type: type as ProfileType,
        displayName: displayName.trim(),
        handle: handle.trim(),
        bio: typeof bio === 'string' ? bio.trim() : undefined,
        location: typeof location === 'string' ? location.trim() : undefined,
        stats: stats ?? undefined,
        metadata: metadata ?? undefined,
      },
      include: { links: true },
    });

    // ── Fire n8n webhook (non-blocking) ──
    void sendWebhookSafe('user.profile_created', {
      profileId: profile.id,
      userId: user.userId,
      type: profile.type,
      handle: profile.handle,
      displayName: profile.displayName,
    });

    return success(profile, { created: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create profile';
    return error(message, 500, 'CREATE_FAILED');
  }
}
