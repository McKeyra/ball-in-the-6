import { prisma } from '@/infrastructure/database';
import { success, error, paginated, parsePageParams } from '@/lib/api-response';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePageParams(searchParams);
  const sport = searchParams.get('sport');
  const country = searchParams.get('country');
  const level = searchParams.get('level');
  const province = searchParams.get('province');
  const search = searchParams.get('search');
  const summary = searchParams.get('summary');

  try {
    // Summary mode: return sport counts for the sports index page
    if (summary === 'sports') {
      const sportCounts = await prisma.scoutingLeague.groupBy({
        by: ['sport'],
        _count: { id: true },
      });

      const data = sportCounts.map((sc) => ({
        sport: sc.sport,
        leagueCount: sc._count.id,
      }));

      return success(data);
    }

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
          seasons: {
            select: { id: true, season: true },
            orderBy: { season: 'desc' },
          },
        },
        orderBy: [{ sport: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.scoutingLeague.count({ where }),
    ]);

    const data = leagues.map((l) => ({
      id: l.id,
      sport: l.sport,
      code: l.code,
      name: l.name,
      country: l.country,
      province: l.province,
      level: l.level,
      source: l.source,
      seasonCount: l._count.seasons,
      seasons: l.seasons.map((s) => s.season),
    }));

    return paginated(data, { page, limit, total });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch scouting leagues';
    return error(message, 500, 'FETCH_FAILED');
  }
}
