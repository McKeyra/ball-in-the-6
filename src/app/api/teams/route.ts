import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, badRequest, paginated, parsePageParams } from '@/lib/api-response';

const VALID_SPORTS = ['basketball', 'hockey', 'soccer', 'baseball', 'football'] as const;

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePageParams(searchParams);
  const sport = searchParams.get('sport');
  const search = searchParams.get('search');

  try {
    const where: Record<string, unknown> = {};

    if (sport) {
      where.sport = { equals: sport, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { league: { contains: search, mode: 'insensitive' } },
        { division: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          _count: { select: { players: true } },
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.team.count({ where }),
    ]);

    const data = teams.map((t) => ({
      ...t,
      playerCount: t._count.players,
      _count: undefined,
    }));

    return paginated(data, { page, limit, total });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch teams';
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

  const { name, sport, logo, color, league, division, homeCourt } = body;

  if (!name || typeof name !== 'string') {
    return badRequest('name is required');
  }
  if (!sport || typeof sport !== 'string') {
    return badRequest('sport is required');
  }
  if (!VALID_SPORTS.includes(sport.toLowerCase() as (typeof VALID_SPORTS)[number])) {
    return badRequest(`sport must be one of: ${VALID_SPORTS.join(', ')}`);
  }

  try {
    const team = await prisma.team.create({
      data: {
        name: name as string,
        sport: (sport as string).toLowerCase(),
        logo: (logo as string) ?? null,
        color: (color as string) ?? null,
        league: (league as string) ?? null,
        division: (division as string) ?? null,
        homeCourt: (homeCourt as string) ?? null,
        record: '0-0',
      },
      include: {
        _count: { select: { players: true } },
      },
    });

    return success(
      {
        ...team,
        playerCount: team._count.players,
        _count: undefined,
      },
      { created: true },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create team';
    return error(message, 500, 'CREATE_FAILED');
  }
}
