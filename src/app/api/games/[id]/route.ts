import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, notFound, badRequest } from '@/lib/api-response';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { id } = await context.params;

  try {
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        homeTeam: {
          include: {
            players: {
              select: { id: true, name: true, number: true, position: true, onCourt: true },
              orderBy: { number: 'asc' },
            },
          },
        },
        awayTeam: {
          include: {
            players: {
              select: { id: true, name: true, number: true, position: true, onCourt: true },
              orderBy: { number: 'asc' },
            },
          },
        },
        playerStats: {
          include: {
            player: {
              select: { id: true, name: true, number: true, position: true },
            },
          },
        },
        gameEvents: {
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
      },
    });

    if (!game) {
      return notFound('Game not found');
    }

    return success(game);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch game';
    return error(message, 500, 'FETCH_FAILED');
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return badRequest('Invalid JSON body');
  }

  // Verify game exists
  try {
    const existing = await prisma.game.findUnique({ where: { id } });
    if (!existing) {
      return notFound('Game not found');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database connection failed';
    return error(message, 503, 'SERVICE_UNAVAILABLE');
  }

  const VALID_STATUSES = ['live', 'upcoming', 'final'] as const;

  const updateData: Record<string, unknown> = {};

  if (body.homeScore !== undefined) {
    if (typeof body.homeScore !== 'number' || body.homeScore < 0) {
      return badRequest('homeScore must be a non-negative number');
    }
    updateData.homeScore = body.homeScore;
  }
  if (body.awayScore !== undefined) {
    if (typeof body.awayScore !== 'number' || body.awayScore < 0) {
      return badRequest('awayScore must be a non-negative number');
    }
    updateData.awayScore = body.awayScore;
  }
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])) {
      return badRequest(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    updateData.status = body.status;
  }
  if (body.quarter !== undefined) {
    if (typeof body.quarter !== 'number' || body.quarter < 1) {
      return badRequest('quarter must be a positive integer');
    }
    updateData.quarter = body.quarter;
  }
  if (body.gameClock !== undefined) {
    if (typeof body.gameClock !== 'number' || body.gameClock < 0) {
      return badRequest('gameClock must be a non-negative number');
    }
    updateData.gameClock = body.gameClock;
  }
  if (body.shotClock !== undefined) {
    if (typeof body.shotClock !== 'number' || body.shotClock < 0) {
      return badRequest('shotClock must be a non-negative number');
    }
    updateData.shotClock = body.shotClock;
  }
  if (body.timeoutsHome !== undefined) updateData.timeoutsHome = body.timeoutsHome;
  if (body.timeoutsAway !== undefined) updateData.timeoutsAway = body.timeoutsAway;
  if (body.venue !== undefined) updateData.venue = body.venue;
  if (body.mvpName !== undefined) updateData.mvpName = body.mvpName;
  if (body.mvpStats !== undefined) updateData.mvpStats = body.mvpStats;
  if (body.mvpAvatar !== undefined) updateData.mvpAvatar = body.mvpAvatar;
  if (body.impactScore !== undefined) updateData.impactScore = body.impactScore;

  if (Object.keys(updateData).length === 0) {
    return badRequest('No fields to update');
  }

  try {
    const updated = await prisma.game.update({
      where: { id },
      data: updateData,
      include: {
        homeTeam: {
          select: { id: true, name: true, logo: true, color: true, record: true },
        },
        awayTeam: {
          select: { id: true, name: true, logo: true, color: true, record: true },
        },
      },
    });

    return success(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update game';
    return error(message, 500, 'UPDATE_FAILED');
  }
}
