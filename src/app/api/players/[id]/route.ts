import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, notFound, badRequest } from '@/lib/api-response';

const VALID_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'] as const;

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
    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        team: {
          select: { id: true, name: true, color: true, sport: true, logo: true },
        },
        stats: {
          include: {
            game: {
              select: {
                id: true,
                status: true,
                time: true,
                homeScore: true,
                awayScore: true,
                homeTeam: { select: { name: true } },
                awayTeam: { select: { name: true } },
              },
            },
          },
          orderBy: { game: { time: 'desc' } },
        },
      },
    });

    if (!player) {
      return notFound('Player not found');
    }

    // Calculate career averages across all games
    const totalGames = player.stats.length;
    const careerAverages = totalGames > 0
      ? {
          gamesPlayed: totalGames,
          ppg: +(player.stats.reduce((sum, s) => sum + s.points, 0) / totalGames).toFixed(1),
          rpg: +(player.stats.reduce((sum, s) => sum + s.offRebounds + s.defRebounds, 0) / totalGames).toFixed(1),
          apg: +(player.stats.reduce((sum, s) => sum + s.assists, 0) / totalGames).toFixed(1),
          spg: +(player.stats.reduce((sum, s) => sum + s.steals, 0) / totalGames).toFixed(1),
          bpg: +(player.stats.reduce((sum, s) => sum + s.blocks, 0) / totalGames).toFixed(1),
          mpg: +(player.stats.reduce((sum, s) => sum + s.minutes, 0) / totalGames).toFixed(1),
          fgPct: player.stats.reduce((sum, s) => sum + s.fgAttempts, 0) > 0
            ? +(player.stats.reduce((sum, s) => sum + s.fgMade, 0) / player.stats.reduce((sum, s) => sum + s.fgAttempts, 0) * 100).toFixed(1)
            : 0,
          threePct: player.stats.reduce((sum, s) => sum + s.threeAttempts, 0) > 0
            ? +(player.stats.reduce((sum, s) => sum + s.threeMade, 0) / player.stats.reduce((sum, s) => sum + s.threeAttempts, 0) * 100).toFixed(1)
            : 0,
          ftPct: player.stats.reduce((sum, s) => sum + s.ftAttempts, 0) > 0
            ? +(player.stats.reduce((sum, s) => sum + s.ftMade, 0) / player.stats.reduce((sum, s) => sum + s.ftAttempts, 0) * 100).toFixed(1)
            : 0,
        }
      : null;

    return success({
      ...player,
      careerAverages,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch player';
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

  // Verify player exists
  try {
    const existing = await prisma.player.findUnique({ where: { id } });
    if (!existing) {
      return notFound('Player not found');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database connection failed';
    return error(message, 503, 'SERVICE_UNAVAILABLE');
  }

  const updateData: Record<string, unknown> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.number !== undefined) {
    if (typeof body.number !== 'number' || body.number < 0) {
      return badRequest('number must be a non-negative integer');
    }
    updateData.number = body.number;
  }
  if (body.position !== undefined) {
    if (!VALID_POSITIONS.includes(body.position as (typeof VALID_POSITIONS)[number])) {
      return badRequest(`position must be one of: ${VALID_POSITIONS.join(', ')}`);
    }
    updateData.position = body.position;
  }
  if (body.onCourt !== undefined) updateData.onCourt = body.onCourt;
  if (body.teamId !== undefined) updateData.teamId = body.teamId;

  if (Object.keys(updateData).length === 0) {
    return badRequest('No fields to update');
  }

  try {
    const updated = await prisma.player.update({
      where: { id },
      data: updateData,
      include: {
        team: {
          select: { id: true, name: true, color: true, sport: true },
        },
      },
    });

    return success(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update player';
    return error(message, 500, 'UPDATE_FAILED');
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { id } = await context.params;

  try {
    const existing = await prisma.player.findUnique({ where: { id } });
    if (!existing) {
      return notFound('Player not found');
    }

    await prisma.player.delete({ where: { id } });

    return success({ id, deleted: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete player';
    return error(message, 500, 'DELETE_FAILED');
  }
}
