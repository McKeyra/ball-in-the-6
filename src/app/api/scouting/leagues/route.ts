import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, paginated, parsePageParams } from '@/lib/api-response';

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePageParams(searchParams);
  const sport = searchParams.get('sport');
  const country = searchParams.get('country');
  const level = searchParams.get('level');
  const province = searchParams.get('province');
  const search = searchParams.get('search');

  try {
    const where: Record<string, unknown> = {};

    if (sport) {
      where.sport = { equals: sport, mode: 'insensitive' };
    }
    if (country) {
      where.country = { equals: country, mode: 'insensitive' };
    }
    if (level) {
      where.level = { equals: level, mode: 'insensitive' };
    }
    if (province) {
      where.province = { equals: province, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [leagues, total] = await Promise.all([
      prisma.scoutingLeague.findMany({
        where,
        include: {
          _count: { select: { seasons: true } },
        },
        orderBy: [{ sport: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.scoutingLeague.count({ where }),
    ]);

    const data = leagues.map((l) => ({
      ...l,
      seasonCount: l._count.seasons,
      _count: undefined,
    }));

    return paginated(data, { page, limit, total });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch scouting leagues';
    return error(message, 500, 'FETCH_FAILED');
  }
}
