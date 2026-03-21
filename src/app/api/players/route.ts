import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, badRequest, paginated, parsePageParams } from '@/lib/api-response';

const VALID_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'] as const;

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePageParams(searchParams);
  const teamId = searchParams.get('teamId');
  const search = searchParams.get('search');

  try {
    const where: Record<string, unknown> = {};

    if (teamId) {
      where.teamId = teamId;
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        include: {
          team: {
            select: { id: true, name: true, color: true, sport: true },
          },
        },
        orderBy: { number: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.player.count({ where }),
    ]);

    return paginated(players, { page, limit, total });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch players';
    return error(message, 500, 'FETCH_FAILED');
  }
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { teamId, name, number: playerNumber, position } = body;

  if (!teamId || typeof teamId !== 'string') {
    return badRequest('teamId is required');
  }
  if (!name || typeof name !== 'string') {
    return badRequest('name is required');
  }
  if (typeof playerNumber !== 'number' || playerNumber < 0) {
    return badRequest('number must be a non-negative integer');
  }
  if (!position || !VALID_POSITIONS.includes(position as (typeof VALID_POSITIONS)[number])) {
    return badRequest(`position must be one of: ${VALID_POSITIONS.join(', ')}`);
  }

  // Verify team exists
  try {
    const team = await prisma.team.findUnique({ where: { id: teamId as string } });
    if (!team) {
      return badRequest('Team not found');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database connection failed';
    return error(message, 503, 'SERVICE_UNAVAILABLE');
  }

  try {
    const player = await prisma.player.create({
      data: {
        teamId: teamId as string,
        name: name as string,
        number: playerNumber as number,
        position: position as string,
      },
      include: {
        team: {
          select: { id: true, name: true, color: true, sport: true },
        },
      },
    });

    return success(player, { created: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create player';
    return error(message, 500, 'CREATE_FAILED');
  }
}
