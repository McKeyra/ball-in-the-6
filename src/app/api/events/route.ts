import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, badRequest, paginated, parsePageParams } from '@/lib/api-response';

const VALID_EVENT_TYPES = ['practice', 'game', 'clinic', 'meeting'] as const;

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePageParams(searchParams);
  const type = searchParams.get('type');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const programId = searchParams.get('programId');

  try {
    const where: Record<string, unknown> = {};

    if (type) {
      if (!VALID_EVENT_TYPES.includes(type as (typeof VALID_EVENT_TYPES)[number])) {
        return badRequest(`type must be one of: ${VALID_EVENT_TYPES.join(', ')}`);
      }
      where.type = type;
    }

    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) {
        const fromDate = new Date(from);
        if (isNaN(fromDate.getTime())) {
          return badRequest('from must be a valid ISO date string');
        }
        dateFilter.gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        if (isNaN(toDate.getTime())) {
          return badRequest('to must be a valid ISO date string');
        }
        dateFilter.lte = toDate;
      }
      where.date = dateFilter;
    }

    if (programId) {
      where.programId = programId;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          program: {
            select: { id: true, name: true, sport: true },
          },
          game: {
            select: {
              id: true,
              status: true,
              homeScore: true,
              awayScore: true,
              homeTeam: { select: { name: true, color: true } },
              awayTeam: { select: { name: true, color: true } },
            },
          },
        },
        orderBy: { date: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return paginated(events, { page, limit, total });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch events';
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

  const { type, title, date, time, venue, description, programId, gameId } = body;

  if (!type || !VALID_EVENT_TYPES.includes(type as (typeof VALID_EVENT_TYPES)[number])) {
    return badRequest(`type must be one of: ${VALID_EVENT_TYPES.join(', ')}`);
  }
  if (!title || typeof title !== 'string') {
    return badRequest('title is required');
  }
  if (!date || typeof date !== 'string') {
    return badRequest('date is required (ISO date string)');
  }
  const parsedDate = new Date(date as string);
  if (isNaN(parsedDate.getTime())) {
    return badRequest('date must be a valid ISO date string');
  }
  if (!time || typeof time !== 'string') {
    return badRequest('time is required (e.g. "7:00 PM")');
  }

  // Verify program exists if provided
  if (programId) {
    try {
      const program = await prisma.program.findUnique({ where: { id: programId as string } });
      if (!program) {
        return badRequest('Program not found');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Database connection failed';
      return error(message, 503, 'SERVICE_UNAVAILABLE');
    }
  }

  // Verify game exists if provided
  if (gameId) {
    try {
      const game = await prisma.game.findUnique({ where: { id: gameId as string } });
      if (!game) {
        return badRequest('Game not found');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Database connection failed';
      return error(message, 503, 'SERVICE_UNAVAILABLE');
    }
  }

  try {
    const event = await prisma.event.create({
      data: {
        type: type as string,
        title: title as string,
        date: parsedDate,
        time: time as string,
        venue: (venue as string) ?? null,
        description: (description as string) ?? null,
        programId: (programId as string) ?? null,
        gameId: (gameId as string) ?? null,
      },
      include: {
        program: {
          select: { id: true, name: true, sport: true },
        },
        game: {
          select: {
            id: true,
            status: true,
            homeTeam: { select: { name: true } },
            awayTeam: { select: { name: true } },
          },
        },
      },
    });

    return success(event, { created: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create event';
    return error(message, 500, 'CREATE_FAILED');
  }
}
