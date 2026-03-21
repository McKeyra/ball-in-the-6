import { prisma } from '@/infrastructure/database';
import { error, paginated, parsePageParams } from '@/lib/api-response';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePageParams(searchParams);
  const leagueCode = searchParams.get('leagueCode');
  const season = searchParams.get('season');
  const sport = searchParams.get('sport');
  const search = searchParams.get('search');
  const team = searchParams.get('team');

  try {
    const where: Record<string, unknown> = {};

    if (leagueCode || season || sport) {
      const seasonWhere: Record<string, unknown> = {};

      if (leagueCode) {
        seasonWhere.league = {
          code: { equals: leagueCode, mode: 'insensitive' },
        };
      } else if (sport) {
        seasonWhere.league = {
          sport: { equals: sport, mode: 'insensitive' },
        };
      }
      if (season) {
        seasonWhere.season = season;
      }

      where.season = seasonWhere;
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (team) {
      where.team = { contains: team, mode: 'insensitive' };
    }

    const [players, total] = await Promise.all([
      prisma.scoutingPlayer.findMany({
        where,
        include: {
          season: {
            include: {
              league: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  sport: true,
                  country: true,
                  level: true,
                },
              },
            },
          },
        },
        orderBy: { rank: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.scoutingPlayer.count({ where }),
    ]);

    const data = players.map((p) => ({
      id: p.id,
      rank: p.rank,
      name: p.name,
      team: p.team,
      stats: p.stats,
      season: p.season.season,
      league: p.season.league,
    }));

    return paginated(data, { page, limit, total });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch scouting players';
    return error(message, 500, 'FETCH_FAILED');
  }
}
