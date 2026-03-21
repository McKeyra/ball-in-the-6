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
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        players: {
          select: {
            id: true,
            name: true,
            number: true,
            position: true,
            onCourt: true,
          },
          orderBy: { number: 'asc' },
        },
        standings: {
          orderBy: { season: 'desc' },
        },
        homeGames: {
          include: {
            homeTeam: { select: { name: true, logo: true, color: true } },
            awayTeam: { select: { name: true, logo: true, color: true } },
          },
          orderBy: { time: 'desc' },
          take: 10,
        },
        awayGames: {
          include: {
            homeTeam: { select: { name: true, logo: true, color: true } },
            awayTeam: { select: { name: true, logo: true, color: true } },
          },
          orderBy: { time: 'desc' },
          take: 10,
        },
      },
    });

    if (!team) {
      return notFound('Team not found');
    }

    // Merge home and away games, sort by time descending, take 10 most recent
    const recentGames = [...team.homeGames, ...team.awayGames]
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 10);

    return success({
      ...team,
      homeGames: undefined,
      awayGames: undefined,
      recentGames,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch team';
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

  // Verify team exists
  try {
    const existing = await prisma.team.findUnique({ where: { id } });
    if (!existing) {
      return notFound('Team not found');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database connection failed';
    return error(message, 503, 'SERVICE_UNAVAILABLE');
  }

  const updateData: Record<string, unknown> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.logo !== undefined) updateData.logo = body.logo;
  if (body.color !== undefined) updateData.color = body.color;
  if (body.sport !== undefined) updateData.sport = body.sport;
  if (body.league !== undefined) updateData.league = body.league;
  if (body.division !== undefined) updateData.division = body.division;
  if (body.homeCourt !== undefined) updateData.homeCourt = body.homeCourt;
  if (body.record !== undefined) updateData.record = body.record;

  if (Object.keys(updateData).length === 0) {
    return badRequest('No fields to update');
  }

  try {
    const updated = await prisma.team.update({
      where: { id },
      data: updateData,
      include: {
        players: {
          select: { id: true, name: true, number: true, position: true },
          orderBy: { number: 'asc' },
        },
        _count: { select: { players: true } },
      },
    });

    return success({
      ...updated,
      playerCount: updated._count.players,
      _count: undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update team';
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
    const existing = await prisma.team.findUnique({ where: { id } });
    if (!existing) {
      return notFound('Team not found');
    }

    await prisma.team.delete({ where: { id } });

    return success({ id, deleted: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete team';
    return error(message, 500, 'DELETE_FAILED');
  }
}
